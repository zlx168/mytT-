// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import camera from "./camera";
import constant from "./constant";
import gameScenePaoKu from "./gameScenePaoKu";
import icon from "./icon";
import obstacle from "./obstacle";



const { ccclass, property } = cc._decorator;

@ccclass
export default class hero extends cc.Component {

    private _state = constant.playerState.STOP
    private _speed: number = 500
    private _spine: sp.Skeleton = null

    @property(cc.Node)
    private camera: cc.Node = null
    private offset: cc.Vec3 = null

    @property(gameScenePaoKu)

    gameScene:gameScenePaoKu = null
    start() {
        this._spine = this.getComponent(sp.Skeleton)
        this.offset = this.node.position.sub(this.camera.position)
        console.log("照相机", this.camera)
        this._spine.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            // if (animationName === 'shoot') {
            //     this.spine.clearTrack(1);
            // }
            // var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd); 
            // cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            if (animationName == "luodi") {
                this.run()
            }
        })
        cc.systemEvent.on(constant.event.PAUSE_ANIMATION,this.pauseAnimation,this)
        cc.systemEvent.on(constant.event.RESERME_AIMATION,this.resermAniamtion,this)
    }
    public jump(height: number, distance: number, onFinishCb?: Function) {
        if(this.gameScene._gameOver || this.gameScene._gamePause){
            return
        }
        if(this.node.getNumberOfRunningActions() > 0){
            return
        }
        this._state = constant.playerState.JUMP
        this._playJumpAnimation()
        this.node.runAction(cc.sequence(cc.jumpBy(1, cc.v2(0, 0), height, 1), cc.callFunc(() => {
            console.log(this.node.position)
            this._playRunAnimaiton()
            this.run()
            if (onFinishCb) {
                onFinishCb()
            }
        })))
    }

    private _playRunAnimaiton() {
        this._spine.setAnimation(0, "benpao", true)
    }

    private _playFallGroundAnimation() {
        this._spine.setAnimation(0, "luodi", false)
    }

    private _playJumpAnimation() {
        this._spine.setAnimation(0, "tiao", false)
    }

    public run() {
        this._playRunAnimaiton()
        this._state = constant.playerState.RUNGING
    }
    public stop() {
        this._state = constant.playerState.STOP
    }

    _stopAnimation(){
        this._spine.clearTracks()
    }

    update(dt) {
        if(this.gameScene._gameOver || this.gameScene._gamePause){
            return
        }
        if (this.camera) {
            this.camera.x = this.node.position.sub(this.offset).x
        }
       
       
       // if (this._state === constant.playerState.RUNGING) {
            this.node.x += this._speed * dt
       // }
    }

    onDestroy() {
        cc.systemEvent.off(constant.event.PAUSE_ANIMATION,this.pauseAnimation,this)
        cc.systemEvent.off(constant.event.RESERME_AIMATION,this.resermAniamtion,this)
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        //console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;
        //
        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;
        //
        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;
        //
        // // 碰撞框的世界矩阵
        // var t = world.transform;
        //
        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;
        //
        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
        if (self.node.group === "player" && other.node.group === "obstacle") {
            let com:obstacle = other.node.getComponent("obstacle")
            if(com._isCollider){
                return
            }
            com._isCollider = true
            cc.systemEvent.emit(constant.event.GAME_OVER)
        }
        else if(self.node.group === "player" && other.node.group === "obstacleIcon"){
            let com:icon = other.node.getComponent("icon")
            if(com._isCollider){
                return
            }
            com._isCollider = true
            com.playMusic()
            com.playWordAnimation()
            cc.systemEvent.emit(constant.event.ADD_SCORE,other.node.name,1)
        }
    }

    pauseAnimation(){
        this.node.getChildByName("particle").active = false//.getComponent(cc.ParticleSystem)
        this._spine.paused = true
        this.node.pauseAllActions()
    }
    resermAniamtion(){
        this.node.getChildByName("particle").active = true //.getComponent(cc.ParticleSystem)
        this._spine.paused = false
        this.node.resumeAllActions()
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
       // console.log('on collision stay');
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        console.log('on collision exit');
    }
}
