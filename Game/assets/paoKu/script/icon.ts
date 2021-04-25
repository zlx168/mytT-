// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import constant from "./constant";
import poolManager from "./poolManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class icon extends cc.Component {

    private _music: cc.AudioClip = null;
    private _word: string = null;
    private _icon:cc.SpriteFrame = null 
    // LIFE-CYCLE CALLBACKS:
    private _animation = null

    private _animationNode:cc.Node = null

    private _upDownAction = null

    public _hasCollider = false

    width = 20
    height = 20

    type = constant.iconType.NOMALE

    startPos:cc.Vec3 = null
    onLoad () {
        this._animationNode = this.node.getChildByName("animationNode")
        this._animation = this._animationNode.getComponent(cc.Animation)
        this.startPos = this.node.position
    }

    setType(type){
        this.type = type
    }

    reset(){
        this.node.stopAllActions()
        this.node.getComponent(cc.Sprite).enabled = true
        this._animationNode.active = false
        this._animationNode.setPosition(cc.v2(0,0))
        this._hasCollider = false
        this.node.position = this.startPos
        this.node.scale = 1
    }

    start () {
        this._animation.on('finished',  this.onFinished, this);
        cc.systemEvent.on(constant.event.PAUSE_ACTION,this.pauseAction,this)
        cc.systemEvent.on(constant.event.RESERME_ACTION,this.resumeAction,this)
    }

    public setIconMusicWord(icon:cc.SpriteFrame,music:cc.AudioClip,word:string,){
        this.playUpDownAction()
        this._music = music
        this._word = word
        this._icon = icon.clone()

        this.node.width = this._icon.getOriginalSize().width
        this.node.height = this._icon.getOriginalSize().height

        console.log("Textrure:width;height,word",this._icon.getOriginalSize().width,  this._icon.getOriginalSize().height,word)
        
        this.node.getComponent(cc.Sprite).spriteFrame = this._icon
        if(!this._animationNode){

        }
        this._animationNode.getChildByName("word").getComponent(cc.Label).string = this._word
    }

    onFinished(){
        // this.node.active = false
        // this.node.getChildByName("word").active = false
        //this.node.destroy()
        this.reset()
        switch(this.type){
            case constant.iconType.NOMALE:{
                poolManager.instance().putIconNode(this.node)
                break
            }
            case constant.iconType.OBSTACLE:{
                this.node.active = false
                break
            }
        }
        
    }

    public playMusic(){
        cc.audioEngine.playEffect(this._music,false)
    }
    public playWordAnimation(){
        this._animationNode.setScale(0)
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
        cc.systemEvent.off(constant.event.PAUSE_ACTION,this.pauseAction,this)
        cc.systemEvent.off(constant.event.RESERME_ACTION,this.resumeAction,this)
    }
    // update (dt) {}
}
