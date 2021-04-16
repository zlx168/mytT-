// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import balloonShooterScene from "./balloonShooterScene";
import giftWordNode from "./giftWordNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class gift extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    
    private isStop = false

    @property(giftWordNode)
    wordAnimation:giftWordNode = null

    private giftName:string = null

    private icon:cc.SpriteFrame  = null

    private music:cc.AudioClip = null

    private gameScene:balloonShooterScene = null

    private boneNode = null

    private iconNode = null

    private spine:sp.Skeleton = null
    initGameScene(scene){
        this.gameScene = scene
    }

    onLoad () {
        this.spine = this.node.getComponent(sp.Skeleton)
        this.boneNode = this.getBoneNode()
    }
    start () {
        this.registerTouchEvent()
        cc.director.on("pauseAction",this.pauseAction,this)
        cc.director.on("resumeAction",this.resumeAction,this)
        this.schedule(this.setColor,1)
    }

    setColor(){
        let material = this.node.getComponent(sp.Skeleton).getMaterials()[0]
        material.setProperty('u_dH', Math.floor(Math.random()*360));
        this.node.getComponent(sp.Skeleton).setMaterial(0,material)
        console.log("setColor")
    }
    setNameIconAndMusic(name:string, icon:cc.SpriteFrame, music:cc.AudioClip) {
        this.giftName = name
        this.icon = icon
        this.music = music
        this.wordAnimation.setLabel(name)
        this.setIcon()
    }

    getBoneNode() {
        let attachUtil = this.spine["attachUtil"];
        let boneNodes = attachUtil.generateAttachedNodes("Gd");
        let boneNode = boneNodes[0];
        return boneNode
    }

    clearIcon() {
        this.boneNode.destroyAllChildren()
        this.iconNode = null
    }

    runBaoZhaAnimation(onFinish){
        let node = this.node.getChildByName("baoZha")
        node.active = true
        let spine = node.getComponent(sp.Skeleton)
        spine.setAnimation(0,"newAnimation",false)
        cc.find("audioManager").getComponent("audioManager").playYanHuaBaoMusic()
        spine.setCompleteListener(t=>{
            onFinish()
            node.active = false
        }) 
    }

    runBaoZhaAnimation1(onFinish){
        let node = this.node.getChildByName("baoZha1")
        node.active = true
        let spine = node.getComponent(sp.Skeleton)
        spine.setAnimation(0,"Sprite",false)
        cc.find("audioManager").getComponent("audioManager").playfeiJiEatMusic()
        spine.setCompleteListener(t=>{
            onFinish()
            node.active = false
        }) 
    }

    setIcon() {
        if (this.boneNode) {
            let targetNode = new cc.Node()
            targetNode.addComponent(cc.Sprite).spriteFrame = this.icon
            targetNode.width = this.icon.getOriginalSize().width
            targetNode.height = this.icon.getOriginalSize().height
            this.boneNode.addChild(targetNode);
            this.iconNode = targetNode
        }
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

    touchStart(e) {
        if(this.isStop){
            return
        }
        // if(this.gameScene.isShoting){
        //     return
        // }
        if(this.gameScene.gameIsPause){
            return
        }
        if(this.gameScene.gameIsOver){
            return
        }
        this.isStop = true
        this.node.stopAllActions()
        this.gameScene.ipShot(this.node)
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

    playEffect() {
        cc.audioEngine.playEffect(this.music, false)
    }

    showWord(cb?:Function) {
        let wordAnimationNode = this.wordAnimation.node
        if(cb)
        this.wordAnimation.setFinishCb(cb)
        //wordNode.setScale(40.5)
        wordAnimationNode.active = true
        // let wordNodeSpine = wordNode.getComponent(sp.Skeleton) 
        // if(wordNodeSpine){
        //     wordNodeSpine.setAnimation(0,"dc",false)
        //     wordNodeSpine.setCompleteListener(t=>{
        //         wordNodeSpine.clearTrack(0)
        //         //wordNode.active = false
        //     })
        // }
        this.wordAnimation.playWordNodeAnimation()
        this.playEffect()
    }

    pauseAction(){
        this.node.pauseAllActions()
    }

    resumeAction(){
        this.node.resumeAllActions()
    }

    onDestroy(){
        this.unschedule(this.setColor)
        this.unregisterTouchEvent()
        cc.director.off("pauseAction",this.pauseAction,this)
        cc.director.off("resumeAction",this.resumeAction,this)
    }
    
    // update (dt) {}
}
