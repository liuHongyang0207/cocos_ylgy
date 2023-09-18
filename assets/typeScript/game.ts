import { _decorator,Component, Node,Label,Prefab,AudioClip,instantiate,tween,Input,AudioSource,Sprite,Vec3,Color,Vec2,input,EventTouch,UITransform} from 'cc';
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
    //元素预制体
    @property({type:Prefab})
    preBlock = null

    //编辑器预制体
    @property({type:Prefab})
    preBlockEdit = null

    //上部block
    @property({type:Node})
    parentBlocks = null

    //定义第几关
    @property({type:Label})
    labelLevel = null

    //显示元素块数
    @property({type:Label})
    labelBlocksNum = null

    //定义失败后的按钮
    @property({type:Node})
    layerOver = null

    //提示信息
    @property({type:Node})
    nodeTap = null

    //底部block
    @property({type:Node})
    parentBlocksDB = null

    //编辑器节点
    @property({type:Node})
    parentEdit = null


    //道具的数量
    @property({type:[Label]})
    arrLableDJ = []

    //音频文件列表
    @property({type:[AudioClip]})
    arrAudio = []

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
    //失败或者成功后禁止点击
    isJinZhi: boolean;
    //添加或者修改模式
    isAddDelete: number;//{0:添加,1:删除}
    //每增加一关增加的块数
    numAdd: number;
    //道具的数量
    arrLableNumber: number[];
    //音乐
    audioSource: any;
    //是否是编辑模式
    isBianJi: boolean;
    //防止拖动添加多个
    editMove: number;
    //是否随机生成
    isSuiJi: boolean;



    start() {

        //关卡
        this.numLevel = 0
        //元素的x起始位置
        this.xStartDB = 610 / 2 - 280 - 610 / 2 + 40
        // this.xStartDB = -250
        //关卡数据
        this.gameData = this.node.getComponent(gameData)
        //每增加一关增加的块数
        this.numAdd =66
        //道具的数量
        this.arrLableNumber= this.node.getComponent(gameData).arrLableNumber

        //是否是编辑模式
        this.isBianJi = false

        //默认添加模式
        this.isAddDelete = 0

        //初始化音频
        this.audioSource = this.node.getComponent(AudioSource)

        //是否开启随机生成
        this.isSuiJi = false

        this.bg()

        //初始化
        this.init()

        //道具的数组





        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    //填充背景
    bg(){
        // debugger
        // //填充背景bg，获取当前设备屏幕的宽高，不是项目设置的宽高
        //
        // let size = this.node.getComponent(UITransform).designResolution
        // //获取背景的宽高
        // // let size_bg = this.node.getChildByName("bg").getComponent(UITransform).contentSize
        // //将bg的背景填充满
        // this.node.getChildByName("bg").getComponent(UITransform).setContentSize(size.width,size.height)
    }


    //初始化
    init(){
        //删除所有子节点

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
        //判断是否编辑模式
        if (this.isBianJi) {
            this.createBlockEdit()
            let children = this.parentBlocks.children
            for (let i = 0; i < children.length; i++) {
                let block_1 = children[i].getComponent(block)
                let type_random = Math.floor(Math.random()*30)
                block_1.init(type_random)

            }
        }else {
            this.parentBlocks.removeAllChildren()
            //创建block
            this.crateBlocks("chuangjian")
        }


        this.btn3()
        //将失败后的背景图变为false
        this.layerOver.active = false
        this.shuXinTitle()
        //失败或者成功后禁止点击
        this.isJinZhi = false
        //刷新道具的数量
        this.shuaXinDJ()
        //提示信息大小
        this.nodeTap.scale = new Vec3(0,0,0)
    }

    //刷新道具的数量
    shuaXinDJ(){
        for (let i = 0; i < this.arrLableDJ.length; i++) {
            this.arrLableDJ[i].string = this.arrLableNumber[i]
        }
    }

    //展示标题
    shuXinTitle(){
        //更新关卡
        if (this.isBianJi){
            if (this.isAddDelete==0){
                this.labelLevel.string = "添加元素模式"
            }else {
                this.labelLevel.string = "删除元素模式"
            }

            //获取元素数
            let children = this.parentBlocks.children
            //判断是否3的倍数
            if (children.length%3==0) {
                this.labelBlocksNum.string = "元素总数："+children.length+" (是3的倍数)"
                //添加颜色
                this.labelBlocksNum.color = new Color(123,129,115,255)
            }else {
                this.labelBlocksNum.string = "元素总数："+children.length+" (不是3的倍数)"
                //添加颜色
                this.labelBlocksNum.color = new Color(226,87,110,255)

            }
        }else {
            this.labelLevel.string = "第 "+(this.numLevel+1)+" 关"
        }
    }


    //创建一个block
    crateBlocks(str?:string){
        //随机一个元素类型
        let num_type_random = 0
        //关卡难度
        let arrTypeLevel = this.gameData.arrTypeLevel[this.numLevel>=3?3:this.numLevel]
        //循环创建十个block
        let arrPos = 0
        let arrPosArray = null
        if (this.numLevel<=1&&str!="suiji"){
            arrPos = this.gameData.arrPosLevel[this.numLevel].length
            arrPosArray = this.gameData.arrPosLevel[this.numLevel]
        }else {
            arrPos = this.numAdd*(this.numLevel+1)
        }
        if (str=="suiji"){

            //获取编辑器的所有元素
            var childrenEdit = this.parentEdit.children
            // this.parentBlocks.removeAllchildren()
        }

        for (let i = 0; i < arrPos; i++) {
            //实例化出block
            let node_block =  instantiate(this.preBlock)
            if (arrPosArray!=null&&str!="suiji"){
                let x = arrPosArray[i].x
                let y = arrPosArray[i].y
                //设置block的位置
                node_block.setPosition(x,y,0)
            }else {
                if (i==0){
                    this.createBlockEdit()
                    childrenEdit = this.parentEdit.children

                }
                    //获取随机的坐标
                    let num = Math.floor(Math.random()*childrenEdit.length-1)
                    let x = childrenEdit[num].getPosition().x
                    let y = childrenEdit[num].getPosition().y
                    //设置block的位置
                    node_block.setPosition(x,y,0)
            }


            // this.node 就是拖拽进来的预制体
            node_block.parent = this.parentBlocks
            //设定元素的内容
            let block_1 = node_block.getComponent(block)

            if (i%3==0) {
                num_type_random = Math.floor(Math.random()*arrTypeLevel)
            }
            block_1.init(num_type_random)
        }

        if (str=="suiji"){
            //判断是否可以消除
            this.pddj()
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
        //播放消除音效
        this.audioSource.playOneShot(this.arrAudio[1],1)
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
        if (this.isXiaoChu||this.isJinZhi) {
            return
        }
        //获取 UI 坐标系下的触点位置
        let v2_touchstart = event.getUILocation()
        //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        let v3_touchstart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //创建一个parentEdit的位置
        let rect_parentEdit = this.parentEdit.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //如果是编辑模式
        if (this.isBianJi) {
            this.bianJi(rect_parentEdit,"start")
            return;
        }
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
                    //播放音效
                    this.audioSource.playOneShot(this.arrAudio[0],1)
                    this.numTouchStart = i;
                    //点中后加一个放大的效果
                    tween(item).to(0.1,{scale:new Vec3(1.2,1.2,1.2)}).start()
                    break
                }
            }
        }
    }


    bianJi(rect_parentEdit: any, start1: string){

        let children = this.parentEdit.children
        if (this.isAddDelete==0){
            for (let i = children.length-1; i >= 0; i--) {
                let item = children[i];
                // 判断 block 是否可以选中

                let node_UITransform = item.getComponent(UITransform);
                if (node_UITransform.getBoundingBox().contains(new Vec2(rect_parentEdit.x, rect_parentEdit.y))) {


                    if (this.editMove==i&&start1=="move"){
                        return;
                    }
                    //播放音效
                    this.audioSource.playOneShot(this.arrAudio[0],1)
                    this.editMove = i
                    //创建
                    let node_block =  instantiate(this.preBlock)
                    node_block.parent = this.parentBlocks
                    node_block.setPosition(children[i].getPosition())

                    let block_1 = node_block.getComponent(block)
                    let type_random = Math.floor(Math.random()*30)
                    block_1.init(type_random)
                    this.pddj()
                    this.shuXinTitle()
                    return
                }

            }
        }else {
            let children2 = this.parentBlocks.children

            for (let i = children2.length-1; i >= 0; i--) {
                let item = children2[i];
                // 判断 block 是否可以选中

                let node_UITransform = item.getComponent(UITransform);
                if (node_UITransform.getBoundingBox().contains(new Vec2(rect_parentEdit.x, rect_parentEdit.y))) {
                    //播放音效
                    this.audioSource.playOneShot(this.arrAudio[0],1)

                    //创建
                    item.removeFromParent();
                    this.pddj()
                    this.shuXinTitle()
                    return
                }

            }
        }



    }

    onTouchMove(event:EventTouch){
        if (this.isXiaoChu||this.isJinZhi) {
            return
        }
        //获取 UI 坐标系下的触点位置
        let v2_touchstart = event.getUILocation()
        //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        let v3_touchstart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //创建一个parentEdit的位置
        let rect_parentEdit = this.parentEdit.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //如果是编辑模式
        if (this.isBianJi) {
            this.bianJi(rect_parentEdit, "move")
            return;
        }

    }

    onTouchEnd(event:EventTouch){
        if (this.isXiaoChu||this.isBianJi) {
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

                if (this.isJinZhi||this.isBtn3){
                    if (this.arrLableNumber[2]==0){
                        this.showTips("每关只能使用一次刷新哦！")
                    }
                    return
                }
                this.arrLableNumber[2]--
                this.shuaXinDJ()
                this.isBtn3 = true
                this.btn3()
                break;

            //出去3个按钮
            case "btn_1":
                if (this.isJinZhi||this.isBtn1){
                    if (this.arrLableNumber[0]==0){
                        this.showTips("每关只能使用一次移出哦！")
                    }
                    return
                }

                this.btn1("cq")
                break;

            //撤回按钮
            case "btn_2":
                if (this.isJinZhi||this.isBtn2){
                    if (this.arrLableNumber[1]==0){
                        this.showTips("每关只能使用一次撤回哦！")
                    }
                    return
                }

                this.btn2()
                break;

                //复活按钮
            case "btn_fh":
                if (this.arrLableNumber[3]==0){
                        this.showTips("每关只能使用一次复活哦！")
                    return;
                }
                this.layerOver.active = false
                this.isBtn1 = false
                this.isJinZhi = false
                //修改道具数量
                this.arrLableNumber[3]--
                this.shuaXinDJ()
                this.btn1("fh")
                break;

                //重新开始
            case "btn_cw":
                this.numLevel = 0
                this.isJinZhi = false
                this.init()
                break;

            //输出坐标
            case "btn_shuChu":
                this.getBlockZuoBiao()
                break;

                //编辑器
            case "btn_yin":
                this.isBianJi = !this.isBianJi

                let children = this.parentEdit.children
                for (let i = children.length-1; i >= 0; i--) {
                    if (children[i].name == "blockEdit") {
                        children[i].active = !children[i].active
                    }
                }
                break;
            //清空
            case "btn_clear":
                this.parentBlocks.removeAllChildren()
                this.shuXinTitle()
                break;

            //添加
            case "btn_add":
                this.isAddDelete = 0
                this.shuXinTitle()
                break;

            //删除
            case "btn_delete":
                this.isAddDelete = 1
                this.shuXinTitle()
                break;

                //随机生成
            case "btn_suiJi":
                if (!this.isBianJi){
                    this.showTips("只能在编辑模式下使用哦！")
                    return;
                }
                this.crateBlocks("suiji")
                break


        }


    }


    //撤回的方法
    btn2(){
        //获取所有的元素
        let children = this.parentBlocksDB.children
        //判断长度是否大于3

        //判断长度是否大于1
        if (children.length>=1&&!this.isBtn2&&this.newBlock!=null) {
            this.isXiaoChu = true

            //修改道具数量
            this.arrLableNumber[1]--
            this.shuaXinDJ()
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
        }{
            if (children.length<1){
                this.showTips("没有元素可以撤回哦！")
            }
        }
    }


    //出去3个按钮
    btn1(str:string){
        //获取所有的元素
        let children = this.parentBlocksDB.children

        //判断长度是否大于3
        let isThree = children.length > 3
        //判断长度是否大于1
        if (children.length>=1&&(!this.isBtn1||str=="fh")) {
            this.isXiaoChu = true


            this.shuaXinDJ()
            //判断是否是复活
            if (str!="fh") {
                this.isBtn1 = true
                //修改道具数量
                this.arrLableNumber[0]--
                this.shuaXinDJ()
            }

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
        }else {
            if (children.length<1){
                this.showTips("没有元素可以移出哦！")
            }
        }


    }

    //洗牌功能
    btn3(){
        //修改道具数量
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
        if (children.length>0&&children.length%3==0){
            for (let i = 0; i < children.length; i++) {
                let item = children[i].getPosition();
                str = str+"{x:"+item.x+",y:"+item.y+"},\n"
            }
            console.log(str)
        }else {
            this.showTips("元素数量不是3的倍数/个数为0")
        }
    }

    //判断游戏成功
    pdGameTrue(){
        let parentBlocks = this.parentBlocks.children
        if (parentBlocks.length==0){
            this.isJinZhi = true
            this.audioSource.playOneShot(this.arrAudio[3],1)

            //延时一秒后执行
            this.scheduleOnce(()=>{
                this.numLevel++
                //延时一秒后执行
                this.init()
            },0.5)
            console.log("游戏成功")
        }
    }

    //判断游戏失败
    pdGameFalse(){
        let parentBlocksDB = this.parentBlocksDB.children
        if (parentBlocksDB.length>=7){
            this.isJinZhi = true
            this.audioSource.playOneShot(this.arrAudio[2],1)

            //延时一秒后执行
            this.scheduleOnce(()=>{
                console.log("游戏失败")
                //将失败后的背景图变为false
                this.layerOver.active = true
            },0.5)

        }
    }


    //显示提示信息
    showTips(str:string){
        this.nodeTap.getChildByName("bg").getChildByName("Label").getComponent(Label).string = str
        //写一个动画
        tween(this.nodeTap)
            .to(0.1,{scale:new Vec3(1,1,1)})
            .delay(1)
            .to(0.1,{scale:new Vec3(0,0,0)})
            .start()
        this.nodeTap.scale = new Vec3(0,0,0)


    }

    //创建编辑器元素
    createBlockEdit(){
        //列
        let hang = 14
        //行
        let lie = 15
        //创建10个，需要两个循环控制行和列
        for (let i = 0; i < hang; i++) {
            for (let j = 0; j < lie; j++) {

                //实例化出block
                let node_block =  instantiate(this.preBlockEdit)
                //设置block的位置
                node_block.setPosition(i*40-(hang-1)*40/2,j*45-200,0)
                // this.node 就是拖拽进来的预制体
                node_block.parent = this.parentEdit
                //默认隐藏
                node_block.active = this.isBianJi
            }
        }


    }

    update(deltaTime: number) {

    }

}


