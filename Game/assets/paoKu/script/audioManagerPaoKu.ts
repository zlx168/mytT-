// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import constant from "./constant";

const {ccclass, property} = cc._decorator;

@ccclass
export default class audioManagerPaoKu extends cc.Component {

    @property(cc.AudioClip)
    eatDaoJu:cc.AudioClip = undefined

    @property(cc.AudioClip)
    jump:cc.AudioClip = undefined

    @property(cc.AudioClip)
    run:cc.AudioClip = undefined

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    runEffectId = 0
    start () {
        cc.systemEvent.on(constant.event.PAUSE_ACTION,this.PauseAll,this)
        cc.systemEvent.on(constant.event.RESERME_ACTION,this.ResumeAll,this)
    }

    playJumpMusic(){
        return cc.audioEngine.playEffect(this.jump,false)
    }
    playRunMusic(){
       this.runEffectId = cc.audioEngine.playEffect(this.run,true)
    }
    stopRunMusic(){
        cc.audioEngine.stopEffect(this.runEffectId)
    }
    playEatDaoJuMusic(cb?:Function){
        let id = cc.audioEngine.playEffect(this.eatDaoJu,false)
        cc.audioEngine.setFinishCallback(id,()=>{
            if(cb){
                cb()
            }
        })
    }

    PauseAll(){
        cc.audioEngine.pauseAllEffects()
        cc.audioEngine.pauseMusic()
    }
    ResumeAll(){
        cc.audioEngine.resumeAllEffects()
        cc.audioEngine.resumeMusic()
    }
    onDestroy(){
        cc.systemEvent.off(constant.event.PAUSE_ACTION,this.PauseAll,this)
        cc.systemEvent.off(constant.event.RESERME_ACTION,this.ResumeAll,this)
    }
    // update (dt) {}
}
