import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData extends Component {
    arrPosLevel:any[];
    arrTypeLevel:any[];
    arrPosRemove: any[];
    arrLableNumber: number[];


    start() {
        //关卡难度
        this.arrTypeLevel = [
            4,16,23,30
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

        //移除的位置坐标数据
        this.arrPosRemove = [
            {x:-100,y:-305},
            {x:0,y:-305},
            {x:100,y:-305},
            ]

        //道具的数量
        this.arrLableNumber = [1,1,1,1]
    }

    update(deltaTime: number) {
        
    }
}


