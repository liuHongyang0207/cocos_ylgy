import { _decorator, Vec3,Component, Node ,UITransform,Rect,tween,Sprite,SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {
    //阴影
    @property({type:Node})
    nodeYinYing = null
    //
    @property({type:Sprite})
    spYuanSu = null

    //元素的图片
    @property({type:[SpriteFrame]})
    spfYuanSu = []


    blockType : any
    //是否可以点击
    canTouch : boolean
    //临时定义底部元素的数字
    numDB: number;
    //是否消除
    isXiaoChu: boolean;
    //底部元素是否在移动
    isMove: boolean;
    start() {
    }

    init(type){
        this.blockType =type //0-29
        this.canTouch = true
        this.spYuanSu.spriteFrame = this.spfYuanSu[this.blockType]
        this.isXiaoChu = false
    }

    initDB(type){
        this.numDB = -1
        this.blockType =type //0-29
        this.canTouch = false
        this.nodeYinYing.active = false
        this.spYuanSu.spriteFrame = this.spfYuanSu[type]

    }

    shuaXin(type){
        this.blockType =type //0-29

        //将spriteFrame进行缩放1秒
        tween(this.spYuanSu.node)
            .to(0.1,{scale:new Vec3(0,0,0)})
            .call(()=>{
                this.spYuanSu.spriteFrame = this.spfYuanSu[this.blockType]
            })
            .to(0.1,{scale:new Vec3(0.7,0.7,0.7)})
            .start()

    }

    //判断是否有点击
    setTouch(can_touch:boolean){
        this.canTouch = can_touch
        if (can_touch) {
            this.nodeYinYing.active = false
        }else{
            this.nodeYinYing.active = true
        }
    }

    //获取包围盒，并且返回小一些的包围盒
    getBoundingBox_pz(){
        let number = 5
        let node_UITransform = this.node.getComponent(UITransform)
        let rect = node_UITransform.getBoundingBox()
        return new Rect(rect.x+number,rect.y+number,rect.width-number*2,rect.height-number*2)
    }



    update(deltaTime: number) {
        
    }
}


