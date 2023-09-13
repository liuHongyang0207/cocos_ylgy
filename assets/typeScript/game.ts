import { _decorator,Component, Node ,Label,Prefab,instantiate,tween,Input,Sprite,Vec3,Color,Vec2,input,EventTouch,UITransform} from 'cc';
import {block} from "db://assets/typeScript/block";
import {gameData} from "db://assets/typeScript/gameData";

const { ccclass, property } = _decorator;



/**
 * @Author: 刘宏洋
 * @Date: 2023/00/08 00:13:36
 * @LastEditors: 刘宏洋
 * @Description: 测试项目
*/
@ccclass('game')
export class game extends Component {
    //预制体
    @property({type:Prefab})
    preBlock = null

    //上部block
    @property({type:Node})
    parentBlocks = null

    //定义第几关
    @property({type:Label})
    labelLevel = null

    //定义失败后的按钮
    @property({type:Node})
    layerOver = null

    //底部block
    @property({type:Node})
    parentBlocksDB = null

    //开始碰触的元素数
    numTouchStart: number;
    //结束碰触的元素数
    numTouchEnd: number;
    //关卡数据
    gameData: gameData;
    //关卡
    numLevel: number;
    //元素的x起始位置
    xStartDB: number;
    //是否消除
    isXiaoChu: boolean;
    //是否禁用btn_1
    isBtn1: boolean;
    //是否禁用btn_2
    isBtn2: Boolean;
    //是否禁用btn_3
    isBtn3: Boolean;
    //最新加入的元素
    newBlock: any;


    start() {
        //关卡
        this.numLevel = 0
        //元素的x起始位置
        this.xStartDB = 610 / 2 - 280 - 610 / 2 + 40
        // this.xStartDB = -250
        //关卡数据
        this.gameData = this.node.getComponent(gameData)


        this.init()




        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    //初始化
    init(){
        //删除所有子节点
        this.parentBlocks.removeAllChildren()
        this.parentBlocksDB.removeAllChildren()

        this.isXiaoChu = false
        //是否禁用btn_1
        this.isBtn1 = false
        //是否禁用btn_2
        this.isBtn2 = false
        //是否禁用btn_3
        this.isBtn3 = false
        //最新加入的元素
        this.newBlock = null
        //创建block
        this.crateBlocks()
        // this.pddj()
        this.btn3()
        //将失败后的背景图变为false
        this.layerOver.active = false
        //更新关卡
        this.labelLevel.string = "第 "+(this.numLevel+1)+" 关"
    }

    //创建一个block
    crateBlocks(){
        //随机一个元素类型
        let num_type_random = 0
        //关卡难度
        let arrTypeLevel = this.gameData.arrTypeLevel[this.numLevel]
        //循环创建十个block
        let arrPos = this.gameData.arrPosLevel[this.numLevel]
        for (let i = 0; i < arrPos.length; i++) {
            //实例化出block
            let node_block =  instantiate(this.preBlock)
            let x = arrPos[i].x
            let y = arrPos[i].y
            //设置block的位置
            node_block.setPosition(x,y,0)
            // this.node 就是拖拽进来的预制体
            node_block.parent = this.parentBlocks
            //设定元素的内容
            let block_1 = node_block.getComponent(block)

            if (i%3==0) {
                num_type_random = Math.floor(Math.random()*arrTypeLevel)
            }
            block_1.init(num_type_random)
        }
    }

    //在底部创建元素快
    createBlockBottom(type, startPosition){
        //实例化出block
        let node_block =  instantiate(this.preBlock)
        var blockBottomPos = this.getBlockBottomPos(type);

        //得到元素的坐标
        let x = this.xStartDB+80 * blockBottomPos.num
        let y = 0
        blockBottomPos["zb"]=startPosition
        this.newBlock = blockBottomPos

        //将parentBlocks的坐标转为世界坐标
        let v3_startPosition = this.parentBlocks.getComponent(UITransform).convertToWorldSpaceAR(startPosition)
        //将世界坐标转为parentBlocksDB的坐标
        let v3_startPositionDB = this.parentBlocksDB.getComponent(UITransform).convertToNodeSpaceAR(v3_startPosition)

        //设置block的位置
        node_block.setPosition(v3_startPositionDB)

        //添加动作
        tween(node_block)
            .to(0.08,{position:new Vec3(x,y,0)})
            .call(()=>{
                if (blockBottomPos.returnNum){
                    this.pdxc(blockBottomPos.num)
                    //判断游戏是否成功
                    this.pdGameTrue()
                }else {
                    this.isXiaoChu = false
                    //判断游戏是否失败
                    this.pdGameFalse()
                }
            })
            .start()


        if (blockBottomPos.is) {
            //将预制体插入指定位置
            this.parentBlocksDB.insertChild(node_block,blockBottomPos.num)
        }else{
            //将数据添加到预制体中
            node_block.parent = this.parentBlocksDB
        }
        //设定元素的内容
        let block_1 = node_block.getComponent(block)

        block_1.initDB(type)

    }

    //得到重复元素在底部的位置
    getBlockBottomPos(type){
        let children = this.parentBlocksDB.children
        //判断是否第三个相同元素
        let returnNum = false

        if (children.length>=2) {
        // 循环遍历前面的元素
        for (var k = 0; k < children.length-1; k++) {
            //判断是否相同的元素
            if (children[k].getComponent(block).blockType == type) {

                //因为消除是3个开始，所以判断下一个是否也相同，从最后面追加
                if (children[k+1].getComponent(block).blockType == type){
                    //即将要插入的位置 - 有3个相同了
                    k = k+1
                    returnNum = true
                }
                // 如果前面有与最后一个元素相同的元素
                for (let j = k+1; j <= children.length-1; j++) {
                    //将后面的元素x坐标加80
                    tween(children[j])
                        .to(0.05,{position:new Vec3(children[j].getPosition().x+80,0,0)})
                        .start()
                    // children[j].setPosition(children[j].getPosition().x+80,0,0)
                }
                //改变元素在parentBlocksDB的位置
                return {num:k+1,is:true,returnNum:returnNum,type:type}
            }
        }
        return {num:children.length,is:false,type:type}
        }
        else {
           return {num:children.length,is:false,type:type}
        }

    }

    //判断是否可以消除
    //z
    pdxc(number){
        //获取所有的元素
        let children = this.parentBlocksDB.children
        //循环遍历所有元素，从number下角标向前删除3个block
        for (let i = number; i >= number-2; i--) {
            //删除元素
            //创建一个删除的动作
            tween(children[i])
                .delay(0.05)
                .to(0.05,{scale:new Vec3(0,0,0)})
                .removeSelf()
                .call(()=>{
                    //循环遍历所有元素，从number下角标向后每个block的x坐标减240
                    for (let j = number-2; j < children.length; j++) {
                        //做一个移动的动作
                        //x坐标减240
                        tween(children[j])
                            .delay(0.05)
                            .to(0.05,{position:new Vec3(children[j].getPosition().x-240,0,0)})
                            .call(()=>{
                                this.isXiaoChu = false
                                this.newBlock = null
                            })
                            .start()
                        // children[j].setPosition(children[j].getPosition().x-240,0,0)

                    }
                })
                .start()
            // children[i].removeFromParent()
        }

    }

    //判断叠加
    pddj(){
        let children = this.parentBlocks.children
        //遍历所有子节点，判断包围盒是否有相交，
        for (let i = 0; i < children.length; i++) {
            let block_1 = children[i].getComponent(block)
            let rect_1 = block_1.getBoundingBox_pz()
            block_1.setTouch(true)

            for (let j = i+1; j < children.length; j++) {
                let block_2 = children[j].getComponent(block)
                let rect_2 = block_2.getBoundingBox_pz()
                //有相交，改变颜色
                if(rect_1.intersects(rect_2)){
                    block_1.setTouch(false)
                    break
                }
            }
        }
    }

    onTouchStart(event:EventTouch){
        if (this.isXiaoChu) {
            return
        }
        //获取 UI 坐标系下的触点位置
        let v2_touchstart = event.getUILocation()
        //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        let v3_touchstart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //实例化出block
        /*let node_block =  instantiate(this.preBlock)
        node_block.setPosition(v3_touchstart)
        // this.node 就是拖拽进来的预制体
        node_block.parent = this.node*/

        //将node中的所有children-子节点遍历出来，并判断如果是block就判断如果是包围盒，用fori

        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            let item = children[i];
            // 判断 block 是否可以选中
            let ts_block = item.getComponent(block);
            if (ts_block.canTouch !== false) {
                let node_UITransform = item.getComponent(UITransform);
                if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchstart.x, v3_touchstart.y))) {
                    this.numTouchStart = i;
                    //点中后加一个放大的效果
                    tween(item).to(0.1,{scale:new Vec3(1.2,1.2,1.2)}).start()
                    break
                }
            }
        }
    }

    onTouchMove(event:EventTouch){
        // let children = this.parentBlocks.children
        // let v2_touchstart = event.getUILocation()
        // //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        // let v3_touchstart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))
        //
        // //将最后一个block的位置设置为触摸点的位置
        // children[children.length-1].setPosition(v3_touchstart)
        // this.pddj()


    }

    onTouchEnd(event:EventTouch){
        if (this.isXiaoChu) {
            return
        }
        let v2_touchstart = event.getUILocation()
        //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        let v3_touchstart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //将node中的所有children-子节点遍历出来，并判断如果是block就判断如果是包围盒
        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            let item = children[i];

            // 判断 block 是否可以选中
            let ts_block = item.getComponent(block);
            if (ts_block.canTouch !== false) {
                let node_UITransform = item.getComponent(UITransform);
                if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchstart.x, v3_touchstart.y))) {
                    this.numTouchEnd = i;
                    // 判断是否是同一个 block，是的话就删除

                    if (this.numTouchStart === this.numTouchEnd && ts_block.isXiaoChu==false) {
                        this.isXiaoChu = true
                        ts_block.isXiaoChu = true
                        this.createBlockBottom(ts_block.blockType,item.getPosition())
                        item.removeFromParent();
                        this.pddj()
                        break
                    }
                }
            }
        }
        tween(children[this.numTouchStart]).to(0.1,{scale:new Vec3(1,1,1)}).start()

    }

    //按钮的回调
    callBackBtn(event:Event,str:string){

        switch (str) {
            //洗牌按钮
            case "btn_3":
                this.btn3()
                break;

            //出去3个按钮
            case "btn_1":
                this.btn1()
                break;

            //撤回按钮
            case "btn_2":
                this.btn2()
                break;

                //复活按钮
            case "btn_fh":
                this.layerOver.active = false
                this.isBtn1 = false
                this.btn1()
                break;

                //重新开始
            case "btn_cw":
                this.numLevel = 0
                this.init()
                break;


        }


    }

    //撤回的方法
    btn2(){
        console.log("撤回"   )
        if (this.isXiaoChu) {
            return
        }
        this.isXiaoChu = true
        //获取所有的元素
        let children = this.parentBlocksDB.children
        //判断长度是否大于3

        //判断长度是否大于1
        if (children.length>=1&&!this.isBtn2&&this.newBlock!=null) {
            let isThree = children.length > this.newBlock.num+1
            this.isBtn2 = true
            //循环遍历所有元素，
            //添加元素到底部
            let preBlock = instantiate(this.preBlock)

            preBlock.parent = this.parentBlocks
            //初始化元素
            //加一个转场动画
            //将parentBlocksDB的坐标转为世界坐标
            let v3_startPosition = this.parentBlocksDB.getComponent(UITransform).convertToWorldSpaceAR(children[this.newBlock.num].getPosition())
            //将世界坐标转为parentBlocks的坐标
            let v3_startPositionDB = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_startPosition)

            //设置block的位置
            preBlock.setPosition(v3_startPositionDB)

            tween(preBlock)
                .to(0.1,{position:new Vec3(this.newBlock.zb)})
                .call(()=>{
                    this.pddj()
                })
                .start()


            let block_1 = preBlock.getComponent(block)
            block_1.init(this.newBlock.type)
            block_1.setTouch(true)


            tween(children[this.newBlock.num])
                .delay(0.05)
                .to(0.05,{scale:new Vec3(0,0,0)})
                .removeSelf()
                .call(()=>{
                    if (isThree){
                        //循环遍历所有元素，从number下角标向后每个block的x坐标减240
                        for (let j = this.newBlock.num; j < children.length; j++) {
                            //做一个移动的动作
                            //x坐标减240
                            //加一个转场动画
                            tween(children[j])
                                .delay(0.05)
                                .to(0.05,{position:new Vec3(children[j].getPosition().x-80,0,0)})
                                .call(()=>{
                                    this.isXiaoChu = false
                                })
                                .start()
                        }
                    }else {
                        this.isXiaoChu = false
                    }
                })
                .start()
        }
    }


    //出去3个按钮
    btn1(){
        if (this.isXiaoChu) {
            return
        }
        this.isXiaoChu = true
        //获取所有的元素
        let children = this.parentBlocksDB.children

        //判断长度是否大于3
        let isThree = children.length > 3
        //判断长度是否大于1
        if (children.length>=1&&!this.isBtn1) {
            this.isBtn1 = true
            let length = children.length>=3?3:children.length
            //循环遍历所有元素，
            for (let i = 0; i < length; i++) {

                //添加元素到底部
                let preBlock = instantiate(this.preBlock)

                preBlock.parent = this.parentBlocks

                //加一个转场动画
                let v3_startPosition = this.parentBlocksDB.getComponent(UITransform).convertToWorldSpaceAR(children[i].getPosition())
                //将世界坐标转为parentBlocks的坐标
                let v3_startPositionDB = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_startPosition)

                //设置block的位置
                preBlock.setPosition(v3_startPositionDB)

                //初始化元素
                switch (length) {
                    case 1:
                        //加一个转场动画
                        tween(preBlock)
                            .to(0.1,{position:new Vec3(this.gameData.arrPosRemove[1].x,this.gameData.arrPosRemove[1].y,0)})
                            .call(()=>{
                                this.pddj()
                            })
                            .start()
                        break;
                    case 2:

                        let zuobiao = i==0?this.gameData.arrPosRemove[0]:this.gameData.arrPosRemove[2]
                        //加一个转场动画
                        tween(preBlock)
                            .to(0.1,{position:new Vec3(zuobiao.x,zuobiao.y,0)})
                            .call(()=>{
                                this.pddj()
                            })
                            .start()
                        break;
                    case 3:
                        //加一个转场动画
                        tween(preBlock)
                            .to(0.1,{position:new Vec3(this.gameData.arrPosRemove[i].x,this.gameData.arrPosRemove[i].y,0)})
                            .call(()=>{
                                this.pddj()
                            })
                            .start()
                        break;
                }
                let block_1 = preBlock.getComponent(block)
                block_1.init(children[i].getComponent(block).blockType)
                block_1.setTouch(true)


                tween(children[i])
                    .delay(0.05)
                    .to(0.05,{scale:new Vec3(0,0,0)})
                    .removeSelf()
                    .call(()=>{
                        if (isThree){
                        //循环遍历所有元素，从number下角标向后每个block的x坐标减240
                            for (let j = 0; j < children.length; j++) {
                            //做一个移动的动作
                            //x坐标减240
                            tween(children[j])
                                .delay(0.05)
                                .to(0.05,{position:new Vec3(children[j].getPosition().x-240,0,0)})
                                .call(()=>{
                                    this.isXiaoChu = false
                                })
                                .start()
                            // children[j].setPosition(children[j].getPosition().x-240,0,0)

                        }
                        }else {
                            this.isXiaoChu = false
                        }
                    })
                    .start()
            }
        }


    }

    //洗牌功能
    btn3(){
        if (this.isBtn3){
            return
        }
        this.isBtn3 = true
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            // 判断 block 是否可以选中
            let ts_block = item.getComponent(block);
            let i_random = Math.floor(Math.random()*children.length)
            let ts_block2 = children[i_random].getComponent(block);

            let type1 = ts_block.blockType
            let type2 = ts_block2.blockType

            ts_block.shuaXin(type2)
            ts_block2.shuaXin(type1)

        }
        this.pddj()
    }

    //刷新底部
    btn4(children){
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            // 判断 block 是否可以选中
            let ts_block = item.getComponent(block);
            let i_random = Math.floor(Math.random()*children.length)
            let ts_block2 = children[i_random].getComponent(block);

            let type1 = ts_block.blockType
            let type2 = ts_block2.blockType

            ts_block.shuaXin(type2)
            ts_block2.shuaXin(type1)

        }
    }

    //输出所有元素快的坐标
    getBlockZuoBiao(){
        let str = ""
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let item = children[i].getPosition();
            str = str+"{x:"+item.x+",y:"+item.y+"},\n"
        }
    }

    //判断游戏成功
    pdGameTrue(){
        let parentBlocks = this.parentBlocks.children
        if (parentBlocks.length==0){

            //延时一秒后执行
            this.scheduleOnce(()=>{
                this.numLevel++
                //延时一秒后执行
                this.init()
            },1)
            console.log("游戏成功")
        }
    }

    //判断游戏失败
    pdGameFalse(){
        let parentBlocksDB = this.parentBlocksDB.children
        if (parentBlocksDB.length>=7){
            //延时一秒后执行
            this.scheduleOnce(()=>{
                console.log("游戏失败")
                //将失败后的背景图变为false
                this.layerOver.active = true
            },1)

        }
    }


    update(deltaTime: number) {

    }

}


