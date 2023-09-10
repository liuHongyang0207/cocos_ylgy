import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData extends Component {
    arrPosLevel:any[];
    arrTypeLevel:any[];


    start() {
        //关卡难度
        this.arrTypeLevel = [
            4,16
        ]

        //关卡的位置坐标数据
        this.arrPosLevel = [
            [//第一关
                {x:-167.368,y:311.151},
                {x:-167.368,y:270.44},
                {x:0,y:308.243},
                {x:0,y:267.532},
                {x:170,y:308.243},
                {x:170,y:267.532},
                {x:-167.368,y:101.779},
                {x:-167.368,y:61.068},
                {x:0,y:98.871},
                {x:0,y:58.16},
                {x:170,y:98.871},
                {x:170,y:58.16},
                {x:-167.368,y:-116.317},
                {x:-167.368,y:-139.58},
                {x:0,y:-119.225},
                {x:0,y:-142.488},
                {x:170,y:-119.225},
                {x:170,y:-142.488},
            ]
        ]
    }

    update(deltaTime: number) {
        
    }
}


