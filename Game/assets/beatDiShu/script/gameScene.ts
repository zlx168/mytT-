// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



import jieSuan from "../../comon/scripts/jieSuan";
import loadRes from "../../comon/scripts/loadRes";

import { holdState } from "./hold";
import pz from "./pz";
import shu, { animationState } from "./shu";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScene extends cc.Component {

    //////////////////////////////////////配置相关接口数据///////////////////////////////////////////
    //每次出来的老鼠最多数量
    @property
    maxNum: number = 2
    //背景音乐
    @property(cc.AudioClip)
    bgMusic: cc.AudioClip = null

    //游戏时间
    totalTime = 20
    
    //老鼠待机时间

    daiJiTime = 3

    //老鼠成为冰块的概率

    probability = 5

    //课程单词学习内容
    wordList = ["apple", "mango", "peach", "watermelon"]
    //课程单词icon
    @property(cc.SpriteFrame)
    wordIconList: cc.SpriteFrame[] = []
    //课程单词音乐
    @property(cc.AudioClip)
    wordMusicList: cc.AudioClip[] = []
    //引导语
    @property(cc.AudioClip)
    yindao: cc.AudioClip = null

    holdWaitTime = 0
    
    hp:number = 2//老鼠血量


    mouseSkeletonData:sp.SkeletonData = null
    //////////////////////////////////////配置相关接口数据///////////////////////////////////////////


    /////////////////////////////////////加载资源预制体//////////////////////////////////////////////
    @property(cc.Prefab)
    loadRes:cc.Prefab = null
    /////////////////////////////////////加载资源预制体//////////////////////////////////////////////
    @property(cc.Node)
    holdList: cc.Node = null
    // LIFE-CYCLE CALLBACKS:
    @property(cc.AudioClip)
    wordMusic: cc.AudioClip = null

    @property(cc.AudioClip)
    tryAgainMusic: cc.AudioClip = null

    @property(cc.Prefab)
    notBeat: cc.Prefab = null

    @property(cc.Prefab)
    wordItem: cc.Prefab = null


    @property(cc.Prefab)
    jieSuanPrefab: cc.Prefab = null

    @property(cc.SpriteFrame)
    ipFront: cc.SpriteFrame = null

    @property(cc.SpriteFrame)
    ipBack: cc.SpriteFrame = null

    @property(cc.Sprite)
    ip: cc.Sprite = null

    @property(cc.Node)
    daoJiShAnimation: cc.Node = null

    @property(cc.Node)
    notBeatList: cc.Node = null

    @property(pz)
    pz: pz = null


    @property(cc.Vec3)

    wordItemStartPos: cc.Vec3 = null

    @property(cc.SpriteFrame)
    pauseBtnSpriteFrameList: cc.SpriteFrame[] = []


    wordAnimationPos: any[] = []

    tongJi = {}

    wordActionParent: cc.Node = null

    ipInitPos: cc.Vec3 = null

    curentTime: number = this.totalTime

    score: number = 0

    wordMusicId: number = null

    isMoveing: boolean = false


    gameIsPause: boolean = true

    gameIsOver: boolean = false

    
   async onLoad() {
        this.daoJiShAnimation.active = false
        this.registerTouchEvent()

        // let spine = this.node.getChildByName("New Node").getComponent(sp.Skeleton)
        // spine.setAnimation(0,"xin_jiedong",false)

        // this.scheduleOnce(()=>{
        //     spine.clearTrack(0);
        // },0.5)

    }

    runDaoJiShiAnimation() {
        this.daoJiShAnimation.active = true
        let daoJiShiSpine = this.daoJiShAnimation.getComponent(sp.Skeleton)
        daoJiShiSpine.setAnimation(0, "daojishi", false)
        daoJiShiSpine.setCompleteListener(() => {
            this.daoJiShAnimation.active = false
            this.scheduleOnce(() => {
                this.startGame()
            }, 0)
        })
    }

    async showCard() {
        let len = this.wordList.length
        for (let v of this.wordList) {
            this.tongJi[v] = 0
        }

        this.wordActionParent = new cc.Node()
        this.wordActionParent.parent = this.node


        // for(let i = 0 ; i < len; ++i){
        //     (function(i,len){

        //     })(i,len)
        // }

        for (let i = 0; i < len; ++i) {
            await this.itemWordMove(len - 1 - i)
        }

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            if (this.wordActionParent) {
                this.wordActionParent.destroy()
                this.wordActionParent = null
            }
            this.runDaoJiShiAnimation()
        })))
        //this.startGame()
    }
    //获取开始卡片动画的位置
    async getWordActionPosList() {
        let tempNode = new cc.Node()
        tempNode.addComponent(cc.Layout)
        tempNode.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL
        tempNode.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER
        tempNode.getComponent(cc.Layout).spacingX = 20
        this.node.addChild(tempNode)
        let len = this.wordList.length
        let posList: Array<any> = []
        if (this.checkIsIpad()) {
            tempNode.getComponent(cc.Layout).spacingX = 20 * 0.6
        }
        for (let i = 0; i < len; ++i) {
            let node = cc.instantiate(this.wordItem)
            node.opacity = 0
            if(this.checkIsIpad()){
                node.width = node.width * 0.6
                node.height = node.height * 0.6
            }
            tempNode.addChild(node)
        }
        tempNode.getComponent(cc.Layout).updateLayout()
        for (let i = 0; i < len; ++i) {
            posList.push(tempNode.children[i].position)
        }
        let p = new Promise(resolve => {
            this.scheduleOnce(() => {
                tempNode.destroy()
                resolve(posList)
            }, 0)
        })
        return p
    }
    //动画卡片移动
    async itemWordMove(index: number) {
        let p = new Promise(resolve => {
            let len = this.wordList.length - 1
            let wordPosList: cc.Vec3[] = this.wordAnimationPos

            let wordNode = cc.instantiate(this.wordItem)
            if(this.checkIsIpad()){
                wordNode.scale = 0.6
            }
            if (this.wordActionParent) {
                this.wordActionParent.addChild(wordNode)
            }
            wordNode.getComponent("wordItem").updateIconAndLabelAndWordMusic(this.wordList[index], this.wordIconList[index])
            wordNode.setPosition(this.wordItemStartPos)

            let maxDistance = cc.v2(wordPosList[len].x, wordPosList[len].y).sub(cc.v2(this.wordItemStartPos.x, this.wordItemStartPos.y)).mag()
            let curentDistance = cc.v2(wordPosList[index].x, wordPosList[index].y).sub(cc.v2(this.wordItemStartPos.x, this.wordItemStartPos.y)).mag()
            let moveTime = 0.5
            let timeScale = curentDistance / maxDistance

            moveTime = moveTime * timeScale


            wordNode.runAction(cc.sequence(cc.moveTo(moveTime, cc.v2(wordPosList[index].x, wordPosList[index].y)), cc.delayTime(0.5), cc.callFunc(() => {
                let id = cc.audioEngine.playEffect(this.wordMusicList[index], false)
                cc.audioEngine.setFinishCallback(id, () => {
                    resolve(0)
                })
            })))
        })
        return p
    }
    //倒计时开始计时
    startTime() {
        this.schedule(this.timeSchedule, 1)
    }
    //停止倒计时
    stopTime() {
        this.unschedule(this.timeSchedule)
    }
    //计时器回调
    timeSchedule(dt) {
        if (this.gameIsPause) { return }
        this.curentTime -= 1
        this.pz.updateTime(this.curentTime)
        if (this.curentTime == 0) {
            this.stopTime()
            this.gameOver()
        }
    }
    //打死老是总数个数
    addScore(addScore, wordName) {
        this.moveDeadRecord(wordName, addScore)
        this.pz.updateScore(addScore, wordName)
    }

    checkIsIpad() {
        let windowSize = cc.view.getVisibleSize();

        console.log("屏幕尺寸")
        console.log("宽：", windowSize.width)
        console.log("高：", windowSize.height)

        let width = Math.floor(windowSize.width)
        let height = Math.floor(windowSize.height)
        //ipad airpro(9.7-inch)尺寸 //ipad airpro(12.9-inch)尺寸
        if (width == 1440 && height == 1080) {
            return true
        }
        //ipad air尺寸
        if (width == 1554 && windowSize.height == 1080) {
            return true
        }
        //ipad airpro(11-inch)尺寸
        if (width == 1546 && windowSize.height == 1080) {
            return true
        }


        let devive = [
            { name: 'Apple iPad', width: 1024, height: 768, ratio: 2 },
            { name: 'Apple iPad Air 2', width: 768, height: 1024, ratio: 2 },
            { name: 'Apple iPad Pro 10.5-inch', width: 834, height: 1112, ratio: 2 },
            { name: 'Apple iPad Pro 12.9-inch', width: 1024, height: 1366, ratio: 2 },
        ]

        for (let i = 0; i < devive.length; ++i) {
            if (devive[i].height == windowSize.width && devive[i].width == windowSize.width) {
                return true
            }
        }
        return false

    }

    gameOver() {
        this.gameIsOver = true
        console.log("gameOver")
        this.setAllAnimationState(true)
        let jieSuanNode = cc.instantiate(this.jieSuanPrefab)
        let script: jieSuan = jieSuanNode.getComponent("jieSuan")
        script.show(this.tongJi, this.wordIconList, this.getStarNumber())
        this.node.addChild(jieSuanNode)
    }

    getStarNumber() {
        let total = 0
        for (let k in this.tongJi) {
            total += this.tongJi[k]
        }
        let starNum = 0
        if (total >= 1 && total < Math.round(0.08 * this.totalTime)) {
            starNum = 1
        }
        else if (total >= Math.round(0.08 * this.totalTime) && total < Math.round(2 * 0.08 * this.totalTime)) {
            starNum = 2
        }
        else if (total >= Math.round(2 * 0.08 * this.totalTime) && total < Math.round(3 * 0.08 * this.totalTime)) {
            starNum = 3
        }
        else if (total >= 3 * 0.08 * this.totalTime) {
            starNum = 3
        }
        return starNum
    }

    playBackGround() {
        cc.audioEngine.setMusicVolume(0.2)
        cc.audioEngine.playMusic(this.bgMusic, true)
    }

    playWordMusic() {
        if (!this.wordMusicId) {
            cc.audioEngine.setEffectsVolume(1)
            this.wordMusicId = cc.audioEngine.playEffect(this.wordMusic, false)
        }
        else if (cc.audioEngine.getState(this.wordMusicId) != cc.audioEngine.AudioState.PLAYING) {
            cc.audioEngine.setEffectsVolume(1)
            this.wordMusicId = cc.audioEngine.playEffect(this.wordMusic, false)
        }

    }

    playTryAgainMusic() {
        cc.audioEngine.setEffectsVolume(1)
        cc.audioEngine.playEffect(this.tryAgainMusic, false)
    }

    start() {
        if(cc.sys.isNative){
              let node = cc.instantiate(this.loadRes) 
              let loadResScript:loadRes =  node.getComponent("loadRes")
              loadResScript.getGameConfig(0,(gameConfig)=>{
                  this.setConfig(gameConfig)
              })
              this.node.addChild(node)
        }
        else{
            this.readyGame()
        }
    }

    setConfig(data){
        data.maxNum && (this.maxNum = data.maxNum)
        data.totalTime && (this.totalTime = data.totalTime)
        data.daiJiTime && (this.daiJiTime = data.daiJiTime)
        data.wordList && (this.wordList = data.wordList)
        data.yindao && (this.yindao = data.yindao)
        data.bgMusic && (this.bgMusic = data.bgMusic)
        data.wordIconList && (this.wordIconList = data.wordIconList)
        data.wordMusicList && (this.wordMusicList = data.wordMusicList)
        data.hp && (this.hp = data.hp)
        data.probability && (this.probability = data.probability)
        data.mouseSkeletonData && (this.mouseSkeletonData = data.mouseSkeletonData) 
        
        this.readyGame()
    }

   async readyGame(){
        this.curentTime = this.totalTime
        let posList: any = await this.getWordActionPosList()
        for (let i = 0; i < posList.length; ++i) {
            this.wordAnimationPos.push(cc.v3(posList[i].x, posList[i].y))
        }
        this.playBackGround()
        let yinDoId = cc.audioEngine.playEffect(this.yindao, false)
        cc.audioEngine.setEffectsVolume(1)
        cc.audioEngine.setFinishCallback(yinDoId, () => {
            this.showCard()
        })
    }

    startGame() {
        this.init()
        this.pz.getComponent("pz").initWordItemLayout(this.wordIconList, this.wordList)
        this.createNewMouse()
        this.gameIsOver = false
        this.daoJiShAnimation.active = false
        this.gameIsPause = false
        this.startTime()
    }

    init() {
        this.ipInitPos = this.ip.node.position
        for (let i = 0; i < this.holdList.children.length; ++i) {
            let node: cc.Node = this.holdList.children[i]
            for (let j = 0; j < node.children.length; ++j) {
                let child: cc.Node = node.children[j]
                child.active = false
            }
        }
    }

    suiJiNum() {
        let count = this.getEmptyHold().length;
        let a = [];
        for (var i = 0; i < count; i++) {
            a[i] = i;

        }
        a.sort(function () {
            return 0.5 - Math.random();
        })


        let numCount = this.rnd(1, 3)

        let temArry = []

        for (let i = 0; i < numCount; ++i) {
            temArry.push(a[i])
        }
        return temArry;

    }

    createNewMouse() {
        let emptyHold = this.getEmptyHold()
        var a = this.suiJiNum();

        //当前场面上存在的老鼠
        let curentNum = 8 - emptyHold.length

        //随机出来的老鼠
        let srandNum = a.length

        //let holdIndex0 = a[0]
        //let holdIndex1 = a[1]

        //this.showItem( this.holdList.children[holdIndex0])
        // this.showItem( this.holdList.children[holdIndex1])

        let cha = this.maxNum - curentNum

        if (srandNum > cha) {

        } else {
            cha = srandNum
        }

        for (let i = 0; i < cha; ++i) {
            console.log("a[i]", a[i])
            console.log(emptyHold)
            let data = this.randMouseName()
            this.showMouse(emptyHold[a[i]], data)
        }
    }

    randMouseName() {
        let index = Math.floor(Math.random() * this.wordList.length)
        return { mouseName: this.wordList[index], index: index }
    }

    getEmptyHold() {
        let emptyHoldList: cc.Node[] = []
        for (let i = 0; i < this.holdList.children.length; ++i) {
            let node = this.holdList.children[i]
            if (node.getChildByName("beatRect").active == false && node.getComponent("hold").holdState == holdState.NOMAL ) {
                emptyHoldList.push(this.holdList.children[i])
            }
        }
        //console.log("空洞数组")
        // console.log(emptyHoldList)
        return emptyHoldList
    }

    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    showMouse(node: cc.Node, data: { mouseName, index }) {
        let suScript: shu = node.getChildByName("shu").getComponent("shu")
        suScript.setMouseNameAndIconAndMusic(data.mouseName, this.wordIconList[data.index],
            this.wordMusicList[data.index])
        
        if(this.hp > 1){
            if(Math.floor(Math.random()*this.probability) === 1){
                suScript.setMouseState(1)
            }
            else{
                suScript.setMouseState(0)
            }
        }else{
            suScript.setMouseState(0)
        }
        suScript.chuDong()
    }
    touchStart(e) {
        console.log("touchStart")
    }
    touchMove(e) {
        console.log("touchMove")
    }
    touchEnd(e) {
        if (this.gameIsPause || this.gameIsOver) {
            return
        }
        this.startIpToInitSchedule()
        let pos = e.getLocation();
        this.ipMoveToPos(pos, () => {
            let converPos = this.notBeatList.convertToNodeSpaceAR(pos)
            let node = cc.instantiate(this.notBeat)
            node.active = true
            this.notBeatList.addChild(node)
            node.position = converPos

            // let len = this.notBeatList.length
            // node.name = len.toString()
            // this.notBeatList.push(node)

            let spine = node.getComponent(sp.Skeleton)
            this.playTryAgainMusic()
            if (spine) {
                spine.setAnimation(0, 'weijizhong', false);
                spine.setCompleteListener((t) => {
                    node.destroy()
                })
            }
        })

        console.log("touchEnd")
    }

    ipMoveToPos(pos: cc.Vec3, callBack) {
        if (this.isMoveing || this.gameIsPause || this.gameIsOver) {
            return
        }
        this.isMoveing = true
        this.ip.spriteFrame = this.ipBack
        let ipNode = this.ip.node
        ipNode.setScale(0.5)
        let endPos = ipNode.parent.convertToNodeSpaceAR(pos)
        //this.ip.node.runAction(cc.moveTo(1,cc.v2(endPos.x,endPos.y)))

        let seqAction = cc.sequence(cc.moveTo(0.1, cc.v2(endPos.x, endPos.y)), cc.callFunc(() => {
            this.isMoveing = false

            callBack && callBack()
        }))
        //this.ip.node.setPosition(endPos)
        this.ip.node.runAction(seqAction)
    }
    ipMoveStartPos() {
        this.ip.spriteFrame = this.ipFront
        this.ip.node.setPosition(this.ipInitPos)
        this.stopIpToInitSchedule()
    }
    touchCancel(e) {
        console.log("touchCancel")
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

    setAllAnimationState(isPause: boolean) {
        this.setAnimationStateByArray(this.notBeatList.children, isPause)
        this.setAnimationStateByArray(this.holdList.children, isPause, "shu")
    }

    setAnimationStateByArray(arr: cc.Node[], isPause: boolean, childName?: string) {
        let len = arr.length
        for (let i = 0; i < len; ++i) {
            if (childName) {
                let spine = arr[i].getChildByName(childName).getComponent(sp.Skeleton)
                spine.paused = isPause
            } else {
                let spine = arr[i].getComponent(sp.Skeleton)
                spine.paused = isPause
            }

        }
    }

    onClicePauseAndResume(e: cc.Event.EventTouch, c) {
        this.gameIsPause = !this.gameIsPause
        this.setAllAnimationState(this.gameIsPause)
        let node = e.target
        let sprite: cc.Sprite = node.getComponent(cc.Sprite)
        if (this.gameIsPause) {

            sprite.spriteFrame = this.pauseBtnSpriteFrameList[0]
        } else {
            sprite.spriteFrame = this.pauseBtnSpriteFrameList[1]
        }
    }
    onDestroy() {
        this.unregisterTouchEvent()
        this.stopTime()
    }


    moveDeadRecord(key: string, addScore) {
        this.tongJi[key] += addScore
    }

    startIpToInitSchedule() {
        this.unschedule(this.ipMoveStartPos)
        this.schedule(this.ipMoveStartPos, 5)
    }


    stopIpToInitSchedule() {
        this.unschedule(this.ipMoveStartPos)
    }

    onClickDiao(){
        cc.director.loadScene("gameSceneDiaoYu")
    }
    // update (dt) {}
}
