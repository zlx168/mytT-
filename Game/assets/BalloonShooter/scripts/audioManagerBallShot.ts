// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class audioManagerBallShot extends cc.Component {

    @property(cc.AudioClip)
    zhiShengJi:cc.AudioClip = undefined

    @property(cc.AudioClip)
    yanHuaBao:cc.AudioClip = undefined

    @property(cc.AudioClip)
    shot:cc.AudioClip = undefined
    @property(cc.AudioClip)
    feiJiEat:cc.AudioClip = undefined

    zhiShengJiId = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    playerZhiShengJiMusic()
    {
        this.zhiShengJiId = cc.audioEngine.playEffect(this.zhiShengJi,true)
    }

    stopZhiShengJiMusic(){
        cc.audioEngine.stopEffect(this.zhiShengJiId)
    }
    playYanHuaBaoMusic(){
        return cc.audioEngine.playEffect(this.shot,false)
    }
    playShotMusic(){
        cc.audioEngine.playEffect(this.yanHuaBao,false)
    }
    playfeiJiEatMusic(){
        cc.audioEngine.playEffect(this.feiJiEat,false)
    }

    // update (dt) {}
}
