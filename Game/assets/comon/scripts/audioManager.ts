// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class audioManager extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    @property(cc.AudioClip)
    catchMusic:cc.AudioClip = undefined

    @property(cc.AudioClip)
    catchFishMusic:cc.AudioClip = undefined

    @property(cc.AudioClip)
    bgMusic:cc.AudioClip = undefined
    @property(cc.AudioClip)
    paoPaoMusic:cc.AudioClip = undefined
    @property(cc.AudioClip)
    btnClickMusic:cc.AudioClip = undefined
    @property(cc.AudioClip)
    starShowMusic:cc.AudioClip = undefined
    @property(cc.AudioClip)
    gameOverMusic:cc.AudioClip = undefined
   // @property(cc.Node)
    musicOpenButton:cc.Node = undefined
   // @property(cc.Node)
    musicCloseButton:cc.Node = undefined

    private paopaoId = null

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

    onLoad () {
       // cc.audioEngine.playMusic(this.bgMusic,true)
        let s:Storage = cc.sys.localStorage
        let strMusic = s.getItem("music")
        if(!strMusic)
        {
            cc.audioEngine.setMusicVolume(1)
            this.showMusic(true)
        }
        else
        {
            if(strMusic === "no")
            {
                cc.audioEngine.setMusicVolume(0)
                this.showMusic(false)
            }
            else if(strMusic === "yes")
            {
                cc.audioEngine.setMusicVolume(1)
                this.showMusic(true)
            }
        }
    }
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

    musicOnCallBack()
    {
        this.showMusic(true)
        cc.audioEngine.setMusicVolume(1)
        let s:Storage = cc.sys.localStorage
        s.setItem("music","yes")
    }
    musicOffCallBack()
    {
        this.showMusic(false)
        cc.audioEngine.setMusicVolume(0)
        let s:Storage = cc.sys.localStorage
        s.setItem("music","no")
    }
    showMusic(is0pen:boolean)
    {
        if(!this.musicOpenButton || !this.musicCloseButton){
            return
        }
        this.musicOpenButton.active = is0pen
        this.musicCloseButton.active = !is0pen
    }
    playerGameOverMusic(onFinish)
    {
        let id = cc.audioEngine.playEffect(this.gameOverMusic,false)
        cc.audioEngine.setFinishCallback(id,()=>{
            onFinish()
        })
    }
    playerBtnClickMusic()
    {
        cc.audioEngine.playEffect(this.btnClickMusic,false)
    }
    playShowStarMusic(){
        return cc.audioEngine.playEffect(this.starShowMusic,false)
    }
    playPaoPaoMusic(){
        this.paopaoId = cc.audioEngine.playEffect(this.paoPaoMusic,true)
    }
    playCatchMusic(){
        cc.audioEngine.playEffect(this.catchMusic,false)
    }
    stopPaoPaoMusic(){
        cc.audioEngine.stop(this.paopaoId)
    }

    playCatchFish(){
        cc.audioEngine.playEffect(this.catchFishMusic,false)
    }
    
    // update (dt) {}
}
