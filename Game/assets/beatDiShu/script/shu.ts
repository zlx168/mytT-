// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import gameScene from "./gameScene";
import wordNode from "./wordNode";


export enum mouseState {
    NORMAL ,
    PROTECT
}
export enum animationState {
    CHUDONG,
    DAIJI,
    JIZHONG,
    XIAOSHI,
    BD_CHUDONG,
    BD_DAJI_1,
    BD_JIZHONG_1,
    BD_DAIJI_2,
    BD_JIZHONG_2,
    BD_XS_1,
    BD_XS_2
}

//保护状态有全身冰块 敲打冰块掉一半


const { ccclass, property } = cc._decorator;

@ccclass
export default class shu extends cc.Component {

    private mouseState: mouseState = mouseState.NORMAL


    private state: animationState = null

    private spine: sp.Skeleton = null

    private mouseName: string = null

    private icon: cc.SpriteFrame = null

    private wordEffect: cc.AudioClip = null
    @property(wordNode)
    private wordNode: wordNode = null

    @property(cc.Prefab)
    private iconPrefab: cc.Prefab = null

    private boneNode = null

    gameScene: gameScene = null

    iconNode: cc.Node = null



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameScene = cc.find("Canvas").getComponent("gameScene")
        let spine = this.spine = this.node.getComponent(sp.Skeleton)

        if(this.gameScene.mouseSkeletonData){
            spine.skeletonData =  this.gameScene.mouseSkeletonData
            spine["_updateSkeletonData"]();
        }

        this.boneNode = this.getBoneNode()
      
        
        spine.setCompleteListener((trackEntry) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            // if (animationName === 'shoot') {
            //     this.spine.clearTrack(1);
            // }
            // var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd); 
            // cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            if (animationName == "chudong") {
                this.daiJi()
            } else if (animationName === "daiji") {


            } else if (animationName == "xiaoshi") {
                this.createNewMouse()
            }
            else if (animationName == "jizhong") {
                this.createNewMouse()
            }
            else if (animationName == "bingdong_chudong") {
                this.bingDongDaiJiOne()
            } else if (animationName === "bingdong_daiji1") {
                
            }
            else if (animationName == "bingdong_jizhong1") {
                this.bingDongDaiJiTwo()
            }
            else if (animationName == "bingdong_daiji2") {
                
            }
            else if (animationName == "bingdong_jizhong2") {
                this.createNewMouse()
            }
            else if (animationName == "bingdong_xiaoshi1") {
                this.createNewMouse()
            }
            else if (animationName == "bingdong_xiaoshi2") {
                this.createNewMouse()
            }
        });
        spine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });                                                                         //---->如果玩家再打击一次---->冰冻击中2----->消失
    }                              //如果玩家打击一次------>冰冻击中1---->冰冻击中待机   
    //---->消失
    //冰冻出洞---->冰冻出洞待机----->
    //消失                                                


    setMouseState(state: mouseState) {
        this.mouseState = state
    }

    createNewMouse() {
        this.scheduleOnce(() => {
            this.clearIcon()
            console.log("老鼠消失")
            this.showRectAndShu(false)
            this.gameScene.createNewMouse()
            let len = this.gameScene.getEmptyHold().length
            console.log("空洞数量", len)
        }, 0)
    }

    start() {

    }
    setAnimationState(state: animationState) {
        this.state = state
    }

    clearIcon() {
        this.boneNode.destroyAllChildren()
        this.iconNode = null
    }

    getAnimationState() {
        return this.state
    }
    onClick(e) {
        console.log("点中老鼠了")
        if (this.mouseState === mouseState.NORMAL) {
            if (this.state === animationState.DAIJI || this.state === animationState.CHUDONG) {
                this.gameScene.ipMoveToPos(e.getLocation(), () => {
                    this.playBeatAnimation()
                    this.jiZhong()
                    this.showWord()
                    this.gameScene.addScore(1, this.mouseName)
                    this.unschedule(this.timer)
                })
                this.gameScene.startIpToInitSchedule()
            }
            else {
                this.gameScene.touchEnd(e)
            }
        }
        else if (this.mouseState === mouseState.PROTECT) {
            if (this.state === animationState.BD_DAJI_1) {
                this.gameScene.ipMoveToPos(e.getLocation(),()=>{
                    //this.iconNode.getChildByName("covers").active = false
                    //this.iconNode.getChildByName("animation").active = true
                    //let spine = this.iconNode.getChildByName("animation").getComponent(sp.Skeleton)
                    //spine.setAnimation(0, "xin_jiedong", false)
                    this.playBeatAnimation()
                    this.bingDongJiZhong()
                    this.showWord()
                    this.stopAllBingDongTimer()
                    // spine.setCompleteListener(() => {
    
                    // })
                })
                this.gameScene.startIpToInitSchedule()
            }
            else if (this.state === animationState.BD_DAIJI_2) {
                this.gameScene.ipMoveToPos(e.getLocation(),()=>{
                    this.iconNode.active = false
                    this.playBeatAnimation()
                    this.bingDongJiZhongTwo()
                    this.showWord()
                    this.stopAllBingDongTimer()
                    this.gameScene.addScore(1, this.mouseName)
                })
                this.gameScene.startIpToInitSchedule()
            }
            else {
                this.gameScene.touchEnd(e)
            }
        }


    }

    showChuBingAnimation(){

    }

    playBeatAnimation(){
        let beat: cc.Node = this.node.parent.getChildByName("beat")
        beat.active = true
        let spine = beat.getComponent(sp.Skeleton)
        if (spine) {
            spine.setAnimation(0, 'jida', false);
            spine.setCompleteListener((t) => {
                beat.active = false
                //this.node.parent.getComponent("hold").startHoldWaitTime() 
            })
        }
    }
    showWord() {
        let wordNode = this.wordNode.node
        //wordNode.setScale(40.5)
        wordNode.active = true
        // let wordNodeSpine = wordNode.getComponent(sp.Skeleton) 
        // if(wordNodeSpine){
        //     wordNodeSpine.setAnimation(0,"dc",false)
        //     wordNodeSpine.setCompleteListener(t=>{
        //         wordNodeSpine.clearTrack(0)
        //         //wordNode.active = false
        //     })
        // }
        this.wordNode.playWordNodeAnimation()
        this.playEffect()
    }

    chuDong() {
        this.showRectAndShu(true)
        
        if (this.mouseState === mouseState.NORMAL) {
            this.spine.setAnimation(0, 'chudong', false);
            this.state = animationState.CHUDONG
            this.setIcon()
        }
        else if (this.mouseState === mouseState.PROTECT) {
            this.spine.setAnimation(0, 'bingdong_chudong', false);
            this.state = animationState.BD_CHUDONG
        }
        // this.spine.setCompleteListener((t)=>{
        //     this.daiJi()
        // })
    }

    setIcon() {
        if (this.boneNode) {
            let targetNode = cc.instantiate(this.iconPrefab);
            targetNode.getComponent(cc.Sprite).spriteFrame = this.icon
            targetNode.width = this.icon.getOriginalSize().width
            targetNode.height = this.icon.getOriginalSize().height
            this.boneNode.addChild(targetNode);
            this.iconNode = targetNode
            if (this.mouseState === mouseState.NORMAL) {

            } else if (this.mouseState === mouseState.PROTECT) {
            //    this.playSpineAnimation(targetNode.getChildByName("b_out_animation"),"xin_chubing",false,(spine:sp.Skeleton)=>{
            //       spine.clearTrack(0)
            //    })   
            }
        }
    }

    playSpineAnimation(node:cc.Node,animationName:string,loop:boolean,onFinish?:Function){
        node.active = true
        let spine = node.getComponent(sp.Skeleton)
        spine.setAnimation(0,animationName,loop)
        spine.setCompleteListener(()=>{
            onFinish(spine)
        })
    }


    getBoneNode() {
        let attachUtil = this.spine["attachUtil"];
        let boneNodes = attachUtil.generateAttachedNodes("daoju");
        let boneNode = boneNodes[0];
        return boneNode
    }
    //正常待机
    daiJi() {
        this.unschedule(this.timer)
        this.spine.setAnimation(0, 'daiji', true);
        this.state = animationState.DAIJI
        // this.spine.setCompleteListener(()=>{
        //     console.log("daiji完成一次")
        // })
        this.schedule(this.timer, this.gameScene.daiJiTime)
    }
    //正常待机计时器
    timer() {
        this.spine.clearTrack(0)
        this.unschedule(this.timer)
        this.xiaoShi()
    }
    //冰冻待机计时器
    timerBingDongDaJiOne() {
        this.stopAllBingDongTimer()
        this.xiaoShi()
    }
    //冰冻待机
    bingDongDaiJiOne() {
        this.stopAllBingDongTimer()
        this.spine.setAnimation(0, 'bingdong_daiji1', true);
        this.state = animationState.BD_DAJI_1
        // this.spine.setCompleteListener(()=>{
        //     console.log("daiji完成一次")
        // })
        //添加icon
        this.setIcon()
        //添加冰遮罩到icon前面
        this.playSpineAnimation(this.iconNode.getChildByName("b_out_animation"),"img",false,(spine:sp.Skeleton)=>{
            spine.clearTrack(0)
        })
        this.schedule(this.timerBingDongDaJiOne, this.gameScene.daiJiTime)
    }


    //冰冻击中一次待机计时器
    timerBingDongDaiJiTwo() {
        this.stopAllBingDongTimer()
        this.xiaoShi()
    }
    //冰冻击中一次待机
    bingDongDaiJiTwo() {
        this.stopAllBingDongTimer()
        this.spine.setAnimation(0, 'bingdong_daiji2', true);
        this.state = animationState.BD_DAIJI_2
        // this.spine.setCompleteListener(()=>{
        //     console.log("daiji完成一次")
        // })
        this.schedule(this.timerBingDongDaiJiTwo, this.gameScene.daiJiTime)
    }

    stopAllBingDongTimer(){
        this.unschedule(this.timerBingDongDaJiOne)
        this.unschedule(this.timerBingDongDaiJiTwo)
    }

    xiaoShi() {
        if(this.mouseState === mouseState.NORMAL){
            this.state = animationState.XIAOSHI
            this.spine.setAnimation(0, 'xiaoshi', false);
        }
        else if(this.mouseState === mouseState.PROTECT){
            if(this.state  === animationState.BD_DAJI_1){
                this.iconNode.active = false
                this.state = animationState.BD_XS_1
                this.spine.setAnimation(0,"bingdong_xiaoshi1",false)
            }
            else if(this.state  === animationState.BD_DAIJI_2){
                this.state = animationState.BD_XS_2
                //this.iconNode.active = true
                this.spine.setAnimation(0,"bingdong_xiaoshi2",false)
                this.iconNode.getChildByName("b_out_animation").active = false
            }
            // else if(this.state === animationState.BD_JIZHONG_2){
            //     this.state = animationState.BD_XS_2
            //     this.spine.setAnimation(0,"bingdong_xiaoshi2",false)
            // }
        }
    }

    jiZhong() {
        this.clearIcon()
        this.state = animationState.JIZHONG
        this.spine.setAnimation(0, 'jizhong', false);
    }

    showRectAndShu(b: boolean) {
        this.node.active = b
        this.node.parent.getChildByName("beatRect").active = b
    }

    bingDongJiZhong() {
        if(this.iconNode.getChildByName("b_out_animation")){
            this.playSpineAnimation(this.iconNode.getChildByName("b_out_animation"),"xin_yiban",false,(spine:sp.Skeleton)=>{
            })
        }
        this.state = animationState.BD_JIZHONG_1
        this.spine.setAnimation(0, 'bingdong_jizhong1', false);
    }

    bingDongJiZhongTwo() {
        this.state = animationState.BD_JIZHONG_2
        this.spine.setAnimation(0, 'bingdong_jizhong2', false);
    }

    playWordMusic() {
        let musicAudioClip = this.gameScene.wordMusic
        cc.audioEngine.playEffect(musicAudioClip, false)
    }

    setMouseNameAndIconAndMusic(name: string, icon: cc.SpriteFrame, effect: cc.AudioClip) {
        this.mouseName = name
        this.icon = icon
        this.wordNode.setIconAndLabel(name)
        this.wordEffect = effect
    }
    getMouseName() {
        return this.mouseName
    }

    playEffect() {
        cc.audioEngine.playEffect(this.wordEffect, false)
    }


    // hideNode(node:cc.Node){
    //     for(let j = 0 ; j < node.children.length; ++j){
    //         let child:cc.Node = node.children[j]
    //         child.active = false 
    //     }
    // }
    // update (dt) {}


}
