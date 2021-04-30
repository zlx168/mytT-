// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import audioManagerPaoKu from "./audioManagerPaoKu";
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

    @property(cc.Node)
    private bgcamera: cc.Node = null

    private offset: cc.Vec3 = null

    @property(gameScenePaoKu)

    gameScene:gameScenePaoKu = null

    _adioManager:audioManagerPaoKu = null 

    private meter:number = 0
    

    private desiredMeter = 0 

    //intervalId = null
    onLoad(){
         let self = this
         this._adioManager = cc.find("audioManager").getComponent("audioManagerPaoKu")
        // this.intervalId =  setInterval(this.intervalCallBack.bind(self),1)
        this.bgcamera = cc.find("Canvas").getChildByName("BgCamera")
    }
    start() {
        this.startMeterSchedule()
        this._spine = this.getComponent(sp.Skeleton)
        this.offset = this.node.position.sub(this.camera.position)
        console.log("照相机", this.camera)
        console.log(this._adioManager,"声音管理器")
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

        cc.Camera
        
        cc.systemEvent.on(constant.event.PAUSE_ACTION,this.pauseAnimation,this)
        cc.systemEvent.on(constant.event.RESERME_ACTION,this.resermAniamtion,this)
    }
    public jump(height: number, distance: number, onFinishCb?: Function) {
        if(this.gameScene._gameOver || this.gameScene._gamePause){
            return
        }
        if(this.node.getNumberOfRunningActions() > 0){
            return
        }
        this._stopRunEffect()
        this._playJumEffect()
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
        // let upAction = cc.moveBy(0.5,cc.v2(0,height))
        // let downAciton = cc.moveBy(0.5,cc.v2(0,-height))
        // let sqAc = cc.sequence(upAction,downAciton)//.easing(cc.easeBackInOut())
        // this.node.runAction(cc.sequence(sqAc,cc.callFunc(()=>{
        //     console.log(this.node.position)
        //     this._playRunAnimaiton()
        //     this.run()
        //     if (onFinishCb) {
        //         onFinishCb()
        //     }
        // })))
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
    _playJumEffect(){
        this._adioManager.playJumpMusic()
    }

    public run() {
        this._playRunEffect()
        this.showParticle(true)
        this._playRunAnimaiton()
        this._state = constant.playerState.RUNGING
    }
    public stop() {
        this._state = constant.playerState.STOP
    }

    _playRunEffect(){
        this._adioManager.playRunMusic()
    }
    _stopRunEffect(){
        this._adioManager.stopRunMusic()
    }

    _stopAnimation(){
        this._spine.clearTracks()
    }

    update(dt) {
        //console.log("英雄的update")
        if(this.gameScene._gameOver || this.gameScene._gamePause){
            return
        }
        if (this.camera) {
            //this.camera.x = this.node.position.sub(this.offset).x
            this.camera.x += this._speed * dt 
        }
       
        if(this.bgcamera){
            this.bgcamera.x += this._speed * dt * 0.6
        }
        //if (this._state === constant.playerState.RUNGING) {
            this.node.x += this._speed * dt 
        //}
        //else if(this._state === constant.playerState.JUMP){
            //console.log("当前坐标",this.node.x )
       // }
    //    this.desiredMeter = this.meter + this._speed / 500 * dt
    //    this.desiredMeter = Math.ceil(this.desiredMeter)
    //    if(this.meter < this.desiredMeter){
    //        this.meter += 1
    //        this.gameScene.updateMeter(this.meter)
    //    }
    }
      

    meterSchedule(dt){
        if(this.gameScene._gameOver || this.gameScene._gamePause){
            return
        }
        let tempMeter = this.meter
        this.meter += this._speed / 500 * dt
        this.meter = Math.round(this.meter)
        for(let i = tempMeter ; i < this.meter; ++i){
            this.scheduleOnce(()=>{
                this.gameScene.updateMeter(this.meter)
            },0.2)
        }
        
    }
    

    startMeterSchedule(){
        this.schedule(this.meterSchedule,1)
    }

    stopMeterSchedule(){
        this.unschedule(this.meterSchedule)
    }

    
    // intervalCallBack(){
    //     if(this.gameScene._gameOver || this.gameScene._gamePause){
    //         return
    //     }
    //     if (this.camera) {
    //         this.camera.x = this.node.position.sub(this.offset).x
    //     }
       
    //     if(this.bgcamera){
    //         this.bgcamera.x += this._speed * 0.6
    //     }
    //    // if (this._state === constant.playerState.RUNGING) {
    //     this.node.x += this._speed 
    // }

    onDestroy() {
        cc.systemEvent.off(constant.event.PAUSE_ACTION,this.pauseAnimation,this)
        cc.systemEvent.off(constant.event.RESERME_ACTION,this.resermAniamtion,this)
        this.stopMeterSchedule()
        //clearInterval(this.intervalId)
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        console.log('on collision enter');

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
            if(com._hasCollider){
                return
            }
            com._hasCollider = true
            cc.systemEvent.emit(constant.event.GAME_OVER)
        }
        else if(self.node.group === "player" && other.node.group === "obstacleIcon"){
            let com:icon = other.node.getComponent("icon")
            this._adioManager.playEatDaoJuMusic(()=>{
                
            })
           
            com.playWordAnimation()
            com.playMusic()
            cc.systemEvent.emit(constant.event.ADD_SCORE,other.node.name,1)
            other.node.getComponent(cc.BoxCollider).enabled = false
        }
    }

    pauseAnimation(){
        this.showParticle(false)
        this._spine.paused = true
        this.node.pauseAllActions()
    }
    resermAniamtion(){
        this.showParticle(true)
        this._spine.paused = false
        this.node.resumeAllActions()
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        console.log('on collision stay');
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        console.log('on collision exit');
    }

    showParticle(visible){
        this.node.getChildByName("particle").active = visible
    }

}

