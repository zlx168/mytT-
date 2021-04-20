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
export default class hero extends cc.Component {
        
    private _state = constant.playerState.STOP
    private _speed:number = 300
    
    @property(cc.Node)
    private camera:cc.Node = null

    private offset:cc.Vec3 = null

    start () {
        this.offset = this.node.position.sub(this.camera.position)
        console.log("照相机",this.camera)
        this.run()
    }
    public jump(height:number,distance:number,onFinishCb?:Function){
        this._state = constant.playerState.JUMP
        this.node.runAction(cc.sequence(cc.jumpBy(1,cc.v2(distance, 0),height,1),cc.callFunc(()=>{
            console.log(this.node.position)
            this._state = constant.playerState.RUNGING
            if(onFinishCb){
                onFinishCb()
            }
        })))
    }

    
    public run(){
        this._state = constant.playerState.RUNGING
    }   
    public stop(){
        this._state = constant.playerState.STOP
    }
   
    update (dt) {
        if(this.camera){
            this.camera.x = this.node.position.sub(this.offset).x
        }
        if(this._state === constant.playerState.RUNGING){
            this.node.x += this._speed * dt
        }
    }

    onDestroy(){
    }
}
