// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import constant from "./constant";


const {ccclass, property} = cc._decorator;

@ccclass
export default class icon extends cc.Component {

    private _music: cc.AudioClip = null;
    private _word: string = null;
    private _icon:cc.SpriteFrame = null 
    // LIFE-CYCLE CALLBACKS:
    private _animation = null

    private _animationNode = null

    private _upDownAction = null

    public _isCollider = false
    onLoad () {
        this._animationNode = this.node.getChildByName("animationNode")
        this._animation = this._animationNode.getComponent(cc.Animation)
        this._animation.on('finished',  this.onFinished,    this);
    }

    start () {
        cc.systemEvent.on(constant.event.PAUSE_ANIMATION,this.pauseAction,this)
        cc.systemEvent.on(constant.event.RESERME_AIMATION,this.resumeAction,this)
    }

    public setIconMusicWord(icon:cc.SpriteFrame,music:cc.AudioClip,word:string,){
        this.playUpDownAction()
        this._music = music
        this._word = word
        this._icon = icon
        this.node.getComponent(cc.Sprite).spriteFrame = this._icon
        if(!this._animationNode){

        }
        this._animationNode.getChildByName("word").getComponent(cc.Label).string = this._word
    }

    onFinished(){
        // this.node.active = false
        // this.node.getChildByName("word").active = false
        this.node.destroy()
    }

    public playMusic(){
        cc.audioEngine.playEffect(this._music,false)
    }
    public playWordAnimation(){
        this.node.stopAction(this._upDownAction)
        this._animationNode.active = true
        this.node.getComponent(cc.Sprite).enabled = false
        this._animation.play("wordAnimation")
    }

    playUpDownAction(){
        this._upDownAction = this.node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1,cc.v2(0,50)),cc.moveBy(1,cc.v2(0,-50)))))
    }
    pauseAction(){
        this.node.pauseAllActions()
    }
    resumeAction(){
        this.node.resumeAllActions()
    }
    onDestroy(){
        cc.systemEvent.off(constant.event.PAUSE_ANIMATION,this.pauseAction,this)
        cc.systemEvent.off(constant.event.RESERME_AIMATION,this.resumeAction,this)
    }
    // update (dt) {}
}
