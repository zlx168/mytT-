// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import camera from "./camera";
import constant from "./constant";



const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {
    
    private _state = constant.playerState.STOP
    private _speed:number = 200
    
    @property(camera)
    private camera:camera = null
    start () {
        console.log("照相机",this.camera)
        this.run()
    }
    public jump(height:number,dictance:number,onFinishCb?:Function){
        this._state = constant.playerState.JUMP
        this.node.runAction(cc.sequence(cc.jumpBy(1,cc.v2(dictance, 0),height,1),cc.callFunc(()=>{
            console.log(this.node.position)
            this._state = constant.playerState.RUNGING
            if(onFinishCb){
                onFinishCb()
            }
        })))
    }

    run(){
        this._state = constant.playerState.RUNGING
    }   
    public stop(){
        this._state = constant.playerState.STOP
    }
   
    update (dt) {
        if(this._state === constant.playerState.RUNGING){
            this.node.x += this._speed * dt
        }
    }
}
