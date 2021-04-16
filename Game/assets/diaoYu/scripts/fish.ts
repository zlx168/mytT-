// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import gameSceneDiaoYu, { gameLevel } from "./gameSceneDiaoYu";




export enum State{
    PROTECT = 0,
    NOMAL
}



const { ccclass, property } = cc._decorator;

@ccclass
export default class fish extends cc.Component {
    //泡泡爆炸由于可能两个同时爆炸所以借口分开不然有可能同时爆炸就
    @property(cc.AudioClip)
    paopaoBaoZhaMusic:cc.AudioClip = null

    state:State = State.NOMAL
    private boneNode = null

    private spine: sp.Skeleton = null
    //鱼的名字
    private fishName: string = null
    // 鱼的icon
    private icon: cc.SpriteFrame = null
    // 鱼儿播放的语音
    private music: cc.AudioClip = null

    gameScene: gameSceneDiaoYu = null

    private cardTime = 0

    private fishMoveAction = null

    private maxHeight: number = null

    private minHeight: number = null

    onLoad() {
        this.spine = this.node.getComponent(sp.Skeleton)
        this.gameScene = cc.find("Canvas").getComponent("gameSceneDiaoYu")
    }
    start() {
        if(this.gameScene.gameLevel === gameLevel.LEVEL1){
            this.registerTouchEvent()
        }
        let menBan = cc.find("Canvas").getChildByName("mengban")
        this.maxHeight = menBan.y + menBan.height / 2 - this.node.height / 2
        this.minHeight = menBan.y - menBan.height / 2 + this.node.height / 2
    }
    onDestroy() {
        if(this.gameScene.gameLevel === gameLevel.LEVEL1){
            this.unregisterTouchEvent()
        }
    }

    touchStart(e) {
        console.log("touchStart")
    }
    touchMove(e) {
        console.log("touchMove")
    }
    touchEnd(e) {

       this.checkTouch(e)
    }
    touchCancel(e) {
        console.log("touchCancel")
    }
    
    checkTouch(e?:any){
        switch(this.gameScene.gameLevel){
            case gameLevel.LEVEL1:{
                if (this.gameScene.isCatching) {
                    return
                }
                if(this.state == State.NOMAL){
                    this.gameScene.showWord(this.fishName)
                    this.gameScene.addScore(1, this.fishName)
                    this.playEffect()
                    this.lineAction(e,(hook:cc.Node)=>{
                        cc.find("audioManager").getComponent("audioManager").playCatchFish()
                        this.node.parent = hook;
                        this.node.setPosition(0, 0);
                        this.node.stopAction(this.fishMoveAction)
                    })
                }
                else if(this.state == State.PROTECT){
                    this.clearPao(e)
                }
                break
            }
            case gameLevel.LEVEL2:{
                if (this.gameScene.isCatching) {
                    return
                }
                if(this.state == State.NOMAL){
                }
                else if(this.state == State.PROTECT){
                    this.hidePao()
                }
                break
            }
            case gameLevel.LEVEL3:{
                break
            }
        }

    }

    addScoreAction(){
        this.gameScene.showWord(this.fishName)
        this.gameScene.addScore(1, this.fishName)
        this.playEffect()
    }

    lineAction(e,callBack){
        let gouPos = this.gameScene.getLinePos()
        let width = cc.v2(gouPos.x, gouPos.y).sub(e.getLocation()).mag()
        let p = cc.v2(gouPos.x, gouPos.y).sub(e.getLocation()).normalize();
        let rotation = 90 - cc.misc.radiansToDegrees(Math.atan2(p.y, p.x));
        this.gameScene.gouGetFish(0.3, 0.5, rotation, width,callBack)
    }

    clearPao(e){
        this.lineAction(e,()=>{
            this.hidePao()
        })
    }
    
    hidePao(){
        this.playPaoPaoEffect()
        this.state = State.NOMAL
        this.node.getChildByName("pao").active = false
    }
    stopMoveAction() {
        this.node.stopAction(this.fishMoveAction)
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

    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    randCreatePao(){
        let randNum = this.gameScene.randPaoMaxNum
        if(Math.floor(Math.random()* randNum) == 1){
            this.node.getChildByName("pao").active = true
            this.state = State.PROTECT
        }
    }
    

    randPosY() {
        let menBan = cc.find("Canvas").getChildByName("fishCreateRange")
        this.maxHeight = menBan.height / 2 - this.node.height / 2
        this.minHeight = -menBan.height / 2 + this.node.height / 2
        let posY = this.rnd(this.minHeight, this.maxHeight)
        return posY
    }
    resetPos() {
        let pos = cc.v2(cc.winSize.width / 2 + this.node.width / 2, this.randPosY())
        this.node.setPosition(pos)
    }

    move(time) {
        let pox = this.node.x - cc.winSize.width - this.node.width
        this.fishMoveAction = this.node.runAction(cc.sequence(cc.moveTo(time, cc.v2(pox, this.node.y)), cc.callFunc(() => {
            this.node.destroy()
        })))
    }

    setIsPauseAction(bool: boolean) {
        if (bool) {
            this.pauseAction()
        } else {
            this.resumeAction()
        }
    }

    pauseAction() {
        this.node.pauseAllActions()
    }

    resumeAction() {
        this.node.resumeAllActions()
    }

    setNameIconAndMusic(name, icon, music) {
        this.fishName = name
        this.icon = icon
        this.music = music
        this.addIconToBoneNode(this.icon)
    }

    addIconToBoneNode(icon) {
        let node = new cc.Node()
        node.addComponent(cc.Sprite).spriteFrame = icon
        //let size =  node.addComponent(cc.Sprite).spriteFrame.getOriginalSize()
        node.width = 200
        node.height = 200

        let attachUtil = this.spine["attachUtil"];
        let boneNodes = attachUtil.generateAttachedNodes("daoju");
        let boneNode = this.boneNode = boneNodes[0];
        if (boneNode) {
            boneNode.addChild(node)
        }
    }
    removeIconFromBoneNode() {
        this.boneNode.destroyAllChildren()
    }

    playEffect() {
        cc.audioEngine.playEffect(this.music, false)
    }
    update() {
        // this.node.x -=  1
    }
    playPaoPaoEffect(){
        cc.audioEngine.playEffect(this.paopaoBaoZhaMusic,false)
    }
  
}
