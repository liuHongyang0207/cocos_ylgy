import { _decorator, Component, Node ,Prefab,instantiate,Input,Vec3,input,EventTouch,UITransform} from 'cc';

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
    start() {


        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event:EventTouch){

        console.log("点击事件")
        //获取 UI 坐标系下的触点位置
        let v2_touchstart = event.getUILocation()
        //将 UI 坐标系下的触点位置转换到当前节点坐标系下的触点位置
        let v3_touchstart = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchstart.x,v2_touchstart.y,0))

        //实例化出block
        let node_block =  instantiate(this.preBlock)
        node_block.setPosition(v3_touchstart)
        // this.node 就是拖拽进来的预制体
        node_block.parent = this.node
    }

    onTouchMove(event:EventTouch){

    }

    onTouchEnd(event:EventTouch){

    }

    update(deltaTime: number) {
        console.log("update")

    }

}


