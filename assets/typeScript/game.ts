import { _decorator,Component, Node ,Prefab,instantiate,tween,Input,Sprite,Vec3,Color,Vec2,input,EventTouch,UITransform} from 'cc';
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
    @property({type:Prefab})
    preBlock = null

    //
    @property({type:Node})
    parentBlocks = null

    //开始碰触的元素数
    numTouchStart: number;
    //结束碰触的元素数
    numTouchEnd: number;
    //关卡数据
    gameData: gameData;
    //关卡
    numLevel: number;

    start() {
        //关卡
        this.numLevel = 0
        //关卡数据
        this.gameData = this.node.getComponent(gameData)
        //删除所有子节点
        this.parentBlocks.removeAllChildren()
        //创建block
        this.crateBlocks()
        // this.pddj()
        this.btn3()



        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
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
                    console.log("相交了")
                    break
                }
            }
        }
    }

    onTouchStart(event:EventTouch){


        console.log("点击事件")
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
                    console.log("点中了" + i);
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
                    console.log("确认点中了" + i);
                    // 判断是否是同一个 block，是的话就删除
                    if (this.numTouchStart === this.numTouchEnd) {
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
        if (str === "btn_3") {
            console.log("洗牌按钮")
            this.btn3()
            this.getBlockZuoBiao()

        }
    }

    //洗牌功能
    btn3(){
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

    //输出所有元素快的坐标
    getBlockZuoBiao(){
        let str = ""
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let item = children[i].getPosition();
            str = str+"{x:"+item.x+",y:"+item.y+"},\n"
        }
        console.log(str)
    }


    update(deltaTime: number) {

    }

}


