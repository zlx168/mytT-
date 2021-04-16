// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import balloonShooterScene from "./balloonShooterScene";
const {ccclass, property} = cc._decorator;

@ccclass
export default class crow extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private totalHp:number =  0

    private curentHp:number = 0

    private hurt:number = 0

    private isStop = false

    private gameScene:balloonShooterScene = null

    @property(cc.Node)

    b:cc.Node = null



    start () {
        
        this.registerTouchEvent()
        cc.director.on("pauseAction",this.pauseAction,this)
        cc.director.on("resumeAction",this.resumeAction,this)
    }
    initGame(game){
        cc.find("audioManager").getComponent("audioManager").playerZhiShengJiMusic()
        this.gameScene = game
    }
    setHp(hp){
        this.totalHp = hp
        this.curentHp = hp 
        this.updateHpShow()
    }

    registerTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this)
    }
    unregisterTouchEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this)
    }

    sethurt(hurt){
        this.curentHp -= hurt
        this.updateHpShow()
        if(this.curentHp <=0){
            this.dead()    
        }
    }

    updateHpShow(){
        this.b.children.forEach((v)=>{
            v.active = false
        })
        for(let i = 0 ; i < this.curentHp; ++i){
            this.b.children[this.totalHp- i - 1].active = true
        }
    }

    dead(){
        this.node.stopAllActions()
        if(cc.isValid(this.node,true)){
            this.node.destroy()
        }
    }

    touchStart(e) {
        if(this.isStop){
            return
        }
        if(this.gameScene.isShoting){
            return
        }
        if(this.gameScene.gameIsPause){
            return
        }
        if(this.gameScene.gameIsOver){
            return
        }
        this.isStop = true
        this.node.pauseAllActions()
        this.gameScene.ipShotCrow(this.node,()=>{
            this.sethurt(1)
            this.runBaoZhaAnimation()
            this.isStop = false
            this.node.resumeAllActions()
        })
        console.log("touchStart")
    }
    touchMove(e) {
        console.log("touchMove")
    }
    touchEnd(e) {
        
    }
    touchCancel(e) {
        console.log("touchCancel")
    }

    runBaoZhaAnimation(){
        let node = this.node.getChildByName("baoZha")
        node.active = true
        let spine = node.getComponent(sp.Skeleton)
        spine.setAnimation(0,"newAnimation",false)
        spine.setCompleteListener(t=>{
            node.active = false
        }) 
    }


    // update (dt) {}
    onCollisionEnter(other:cc.Collider, self:cc.Collider) {
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
    //    if(self.node.name === "gou" && other.node.name === "yu"){ 
    //         let gameScene:gameSceneDiaoYu = cc.find("Canvas").getComponent("gameSceneDiaoYu")
    //         if(gameScene.isCatching){
    //             return
    //         }
    //         let selfNode = self.node
    //         let otherNode = other.node
    //         let fishScript:fish = otherNode.getComponent("fish")
    //         gameScene.isCatching = true
    //         //已经碰到鱼了
    //         if(fishScript.state == State.NOMAL){
    //             //otherNode.getComponent(cc.Collider).enabled = false ///去掉鱼的碰撞
    //             fishScript.stopMoveAction()
    //             gameScene.stopGouAction()//停止钩旋转
    //             otherNode.setPosition(0,0)//鱼上钩
    //             otherNode.parent = selfNode
    //             cc.find("audioManager").getComponent("audioManager").playCatchFish()
    //             gameScene.takeInHook(0.5,()=>{
    //                 fishScript.addScoreAction()
    //                 gameScene.isCatching = false
    //                 selfNode.destroyAllChildren()
    //                 gameScene.startGouRotate()
    //             })
    //         }
    //         else if(fishScript.state == State.PROTECT){
    //             gameScene.stopGouAction()//停止钩旋转
    //             fishScript.hidePao()//鱼隐藏气泡
    //             //收钩
    //             gameScene.takeInHook(0.5,()=>{
    //                 gameScene.startGouRotate()
    //                 gameScene.isCatching = false
    //             })
    //         }
          
       //    }
        let node = other.node
        let script = node.getComponent("gift")
        node.getComponent(sp.Skeleton).enabled = false
        script.unregisterTouchEvent()
        
        script.runBaoZhaAnimation1(()=>{
            if(cc.isValid(other.node,true)){
                script.unregisterTouchEvent()
                other.node.destroy()
            }
        })
        script.clearIcon()
        
    }
    onCollisionStay (other:cc.Collider, self:cc.Collider) {
        console.log('on collision stay');
    }
    onCollisionExit (other:cc.Collider, self:cc.Collider) {
        console.log('on collision exit');
    }

    pauseAction(){
        this.node.pauseAllActions()
    }

    resumeAction(){
        this.node.resumeAllActions()
    }

    onDestroy(){
        cc.find("audioManager").getComponent("audioManager").stopZhiShengJiMusic()
        this.unregisterTouchEvent()
        cc.director.off("pauseAction",this.pauseAction,this)
        cc.director.off("resumeAction",this.resumeAction,this)
    }
}
