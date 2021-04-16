// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MAXNUMFISH = 3
let MINNUMFISH = 2





export enum gameLevel {
    LEVEL1,
    LEVEL2,
    LEVEL3
}
import beatRect from "../../beatDiShu/script/beatRect";
import jieSuan from "../../comon/scripts/jieSuan";
import fish from "./fish";
import pz from "./pzDiaoYu";
import audioManager from "../../comon/scripts/audioManager"
import loadRes from "../../comon/scripts/loadRes";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameSceneDiaoYu extends cc.Component {

    ////////////////////////////配置相关数据开始//////////////////////////////////////////
    //顺子最长距离
    throwMaxLen = 900
    //钩子旋转角度范围
    rotateMaxAngle = 60

    //总时间
    totalTime = 30
    //游戏等级
    gameLevel: gameLevel = gameLevel.LEVEL2

    //引导语
    @property(cc.AudioClip)
    yindao: cc.AudioClip = null

    //课程单词学习内容
    wordList = ["this is apdple", "i like mango", " this is a peach", "that is watermelon"]
    //课程单词icon
    @property(cc.SpriteFrame)
    wordIconList: cc.SpriteFrame[] = []
    //课程语音列表
    @property(cc.AudioClip)
    musicList: cc.AudioClip[] = []

    //背景音乐
    @property(cc.AudioClip)
    bgMusic: cc.AudioClip = null

    //鱼游动时间
    fishiMoveTime: number = 7

    //生成鱼的间隔时间最大值

    fishCreateIntervalMaxTime = 2
    //生成鱼的间隔时间最小值
    fishCreateIntervalMinTime = 1

    //游戏鱼儿产生泡泡的概率最大值

    randPaoMaxNum = 3
    ////////////////////////////配置相关数据结束//////////////////////////////////////////


    //////加载资源预制体/////
    @property(cc.Prefab)
    loadRes: cc.Prefab = null

    //统计面板
    @property(pz)
    pz: pz = null
    @property(cc.Node)
    //钓鱼绳子节点
    line: cc.Node = null;

    //类型数量统计
    tongJi = {}

    //当前时间

    curentTime = this.totalTime

    //倒计时节点
    @property(cc.Node)
    daoJiShAnimation: cc.Node = null

    //单词动画父节点

    wordActionParent: cc.Node = null

    //卡片动画预制体
    @property(cc.Prefab)
    wordItem: cc.Prefab = null

    //卡片动画最终位置数组

    wordAnimationPos: any[] = []

    //暂停按钮资源图片

    @property(cc.SpriteFrame)
    pauseBtnSpriteFrameList: cc.SpriteFrame[] = []

    //卡片初始位置
    @property(cc.Vec3)
    wordItemStartPos: cc.Vec3 = null


    @property(cc.Prefab)
    jieSuanPrefab: cc.Prefab = null

    //初始生成鱼的数量
    startFishNum = 0
    //生成鱼的间隔事件
    createFishIntervalTime = 0
    //移动时间
    moveTime = 0

    //是否正在执行捕鱼动画
    isCatching = false
    //游戏是否暂停
    gameIsPause: boolean = false
    //游戏是否结束
    gameIsOver: boolean = false

    //第一次触摸钩子
    touching = false
    //tweenAciton

    //扔出钩子的 action 
    throwHookTweenAction: cc.Tween = null

    //钓鱼钩子旋转action 记录
    gouRotateAciton = null

    //是否旋转钩子

    isRotateGou = false

    //钩子角度增量值

    debal = 20
    //鱼类型预制体数组
    @property(cc.Prefab)
    fishPrefabList: cc.Prefab[] = []
    onLoad() {
    }

    private adioMgr: audioManager = null

    //播放粒子效果

    playParticle() {
        this.node.getChildByName("Particle").active = true
        this.node.getChildByName("Particle").getComponent(cc.ParticleSystem).playOnLoad = true
    }
    //播放倒计时骨骼动画

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




    //开始游戏
    startGame() {
        this.adioMgr.playPaoPaoMusic()
        this.init()
        switch (this.gameLevel) {
            case gameLevel.LEVEL1: {
                cc.director.getCollisionManager().enabled = false
                break
            }
            case gameLevel.LEVEL2: {
                this.setGuangShow(true)
                this.registerTouchEvent()
                cc.director.getCollisionManager().enabled = true
                this.startGouRotate()
                break
            }
            case gameLevel.LEVEL3: {
                this.setGuangShow(true)
                cc.director.getCollisionManager().enabled = true
                break
            }
        }
        this.showUI(true)
    }

    init() {
        this.gameIsPause = false
        this.gameIsOver = false
        this.pz.initWordItemLayout(this.wordIconList, this.wordList)
        this.playParticle()
        this.startFishNum = this.rnd(MINNUMFISH, MAXNUMFISH)
        this.startTime()
        this.startCreateFishSchedule()
    }

    showUI(show: boolean) {
        this.node.getChildByName("star").active = show
        this.node.getChildByName("btnPause").active = show
        this.node.getChildByName("clock").active = show
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
        console.log("touchStart")
    }
    touchMove(e) {
        console.log("touchMove")
    }
    touchEnd(e) {
        if (this.isCatching) {
            return
        }
        switch (this.gameLevel) {
            case gameLevel.LEVEL1: {
                break
            }
            case gameLevel.LEVEL2: {
                if (this.touching || this.gameIsOver || this.gameIsPause) {
                    return
                }
                this.touching = true
                this.stopGouAction()
                let rotation = this.line.angle
                // this.gouGetFish(0.3,0.5,rotation,height,null,()=>{
                //     this.startGouRotate()
                // },100)
                this.throwHook(0.5, 0.5, rotation, this.throwMaxLen)
                break
            }
            case gameLevel.LEVEL3: {
                break
            }
        }
    }
    touchCancel(e) {
        console.log("touchCancel")
    }


    //显示卡片动画
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
            tempNode.opacity = 0
            tempNode.addChild(node)
            if (this.checkIsIpad()) {
                node.width = node.width * 0.6
                node.height = node.height * 0.6
            }
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
            if (this.checkIsIpad()) {
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
                let id = cc.audioEngine.playEffect(this.musicList[index], false)
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
        if (this.curentTime <= 0) {
            this.gameOver()
        }
    }


    fisheDeadRecord(key: string, addScore) {
        this.tongJi[key] += addScore
    }


    addScore(addScore, wordName) {
        this.fisheDeadRecord(wordName, addScore)
        this.pz.updateScore(addScore, wordName)
    }

    //游戏结束
    gameOver() {
        if (this.gameLevel > gameLevel.LEVEL1) {
            this.stopGouAction()
        }
        this.adioMgr.stopPaoPaoMusic()
        this.adioMgr.playerGameOverMusic(() => {

        })
        let jieSuanNode = cc.instantiate(this.jieSuanPrefab)
        let script: jieSuan = jieSuanNode.getComponent("jieSuan")
        script.show(this.tongJi, this.wordIconList, this.getStarNumber())
        this.node.addChild(jieSuanNode)

        this.showUI(false)
        this.gameIsPause = true
        this.stopTime()
        this.stopCreateFishSchedule()
        this.setAllAnimationState(true)

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

    //暂停按钮点击回调
    onClicePauseAndResume(e: cc.Event.EventTouch, c) {
        this.gameIsPause = !this.gameIsPause
        this.setAllAnimationState(this.gameIsPause)
        let node = e.target
        let sprite: cc.Sprite = node.getComponent(cc.Sprite)
        if (this.gameIsPause) {
            this.stopCreateFishSchedule()
            sprite.spriteFrame = this.pauseBtnSpriteFrameList[0]
        } else {
            this.startCreateFishSchedule()
            sprite.spriteFrame = this.pauseBtnSpriteFrameList[1]
        }
    }


    setAllAnimationState(isPause: boolean) {
        let yuParent = cc.find("Canvas").getChildByName("mengban").getChildByName("yuParent")
        this.setAnimationStateByArray(yuParent.children, isPause)
    }

    setAnimationStateByArray(arr: cc.Node[], isPause: boolean, childName?: string) {
        let len = arr.length
        for (let i = 0; i < len; ++i) {
            {
                let node = arr[i]
                node.getComponent("fish").setIsPauseAction(isPause)
                let spine = arr[i].getComponent(sp.Skeleton)
                spine.paused = isPause
            }

        }
    }


    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }


    async start() {

        if (cc.sys.isNative) {
            let node = cc.instantiate(this.loadRes)
            let loadResScript: loadRes = node.getComponent("loadRes")
            loadResScript.getGameConfig(1, (gameConfig) => {
                this.setConfig(gameConfig)
            })
            this.node.addChild(node)
        }
        else {
            this.readyGame()
        }
    }



    setConfig(data) {
        console.log(JSON.stringify(data),"setConfig")
        data.maxTime && (this.fishCreateIntervalMaxTime = data.maxTime)
        data.minTime && (this.fishCreateIntervalMinTime = data.minTime)
        data.totalTime && (this.totalTime = data.totalTime)
        data.throwMaxLen && (this.throwMaxLen = data.throwMaxLen)
        data.gameLevel && (this.gameLevel = data.gameLevel)

        data.randPaoMaxNum && (this.randPaoMaxNum = data.randPaoMaxNum)

        data.rotateMaxAngle && (this.rotateMaxAngle = data.rotateMaxAngle)

        data.speed && (this.fishiMoveTime = data.speed)

        data.wordList && (this.wordList = data.wordList)
        data.yindao && (this.yindao = data.yindao)
        data.bgMusic && (this.bgMusic = data.bgMusic)
        data.wordIconList && (this.wordIconList = data.wordIconList)
        data.wordMusicList && (this.musicList = data.wordMusicList)

        this.readyGame()

    }



    async readyGame() {
        this.curentTime = this.totalTime
        this.adioMgr = cc.find("audioManager").getComponent("audioManager")
        this.setGuangShow(false)
        this.showUI(false)
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
    //播放北京音乐
    playBackGround() {
        cc.audioEngine.setMusicVolume(0.2)
        cc.audioEngine.playMusic(this.bgMusic, true)
    }

    setGuangShow(show) {
        this.line.getChildByName("guang").active = show
    }

    startCreateFishSchedule() {
        this.createFishIntervalTime = this.rnd(this.fishCreateIntervalMinTime, this.fishCreateIntervalMaxTime)
        this.stopCreateFishSchedule()
        this.schedule(this.createFish, this.createFishIntervalTime)
    }

    /**
     停止鱼创建的倒计时
     */
    stopCreateFishSchedule() {
        this.unschedule(this.createFish)
    }

    /**
     @param leftAngle 向左边摇晃的最大角度
     @param rightAngle 向右边摇晃的最大角度
     */
    gouRotate(leftAngle, rightAngle) {
        this.stopGouAction()
        this.line.rotation = 0
        this.line.height = 100
        let act1 = cc.rotateBy(3, rightAngle)
        let act2 = cc.rotateBy(3, -rightAngle)
        let act3 = cc.rotateBy(3, -leftAngle)
        let act4 = cc.rotateBy(3, leftAngle)
        this.gouRotateAciton = this.line.runAction(cc.repeatForever(cc.sequence(act1, act2, act3, act4)))
    }

    startGouRotate() {
        this.isRotateGou = true
    }
    //创建鱼
    createFish() {
        let index = Math.floor(Math.random() * this.wordList.length)
        let fishNode = cc.instantiate(this.fishPrefabList[index])
        if (this.checkIsIpad()) {
            fishNode.scale = 0.8
        }
        fishNode.active = true
        let yuParent = cc.find("Canvas").getChildByName("mengban").getChildByName("yuParent")
        yuParent.addChild(fishNode)
        let finshScript: fish = fishNode.getComponent("fish")
        finshScript.setNameIconAndMusic(this.wordList[index], this.wordIconList[index], this.musicList[index])
        finshScript.resetPos()
        finshScript.randCreatePao()
        let moveTime = this.getFishMoveTime()
        finshScript.move(moveTime)
        this.startCreateFishSchedule()
    }
    //鱼运行时间
    getFishMoveTime() {
        let time = this.fishiMoveTime;
        return time
    }

    //获取鱼线的位置
    getLinePos() {
        return this.line.parent.convertToWorldSpaceAR(this.line.position)
    }
    //鱼钩鱼动画
    gouGetFish(goTime: number, backTime: number, rotation: number, height: number, hook: Function, hui?: Function, heightLast?: number) {

        this.stopGouAction()
        this.isCatching = true
        this.line.rotation = rotation

        let backHeight = heightLast ? heightLast : 0
        cc.tween(this.line)
            .to(goTime, { height: height })
            .call(() => {
                if (hook) {
                    hook(this.line.getChildByName("gou"))
                }
            })
            .to(backTime, { height: backHeight })
            .call(() => {
                if (hui) {
                    hui()
                }
                this.line.getChildByName("gou").destroyAllChildren()
                this.isCatching = false
                //得到一条鱼的处理
            })
            .start()
    }

    //LEVEL 2 3
    //放出钩子
    throwHook(goTime: number, backTime: number, rotation: number, height: number) {
        this.adioMgr.playCatchMusic()
        this.stopGouAction()
        this.line.angle = rotation
        this.throwHookTweenAction = cc.tween(this.line)
            .to(goTime, { height: height })
            .call(() => {
                this.takeInHook(backTime, () => {
                    this.startGouRotate()
                })
            })
            .start()
    }

    setCatching(isCatching: boolean) {
        this.isCatching = isCatching
    }

    //LEVEL 2 3
    //收回钩子
    takeInHook(time, onFinish?: Function) {
        if (this.throwHookTweenAction) {
            this.throwHookTweenAction.stop()
            this.throwHookTweenAction = null
        }
        cc.tween(this.line)
            .to(time, { height: 0 })
            .call(() => {
                this.touching = false
                if (onFinish) {
                    onFinish(this.line.getChildByName("gou"))
                }
            })
            .start()
    }

    showWord(word: string) {
        let wordShowNode = this.node.getChildByName("wordShow")
        wordShowNode.active = true
        let wordNode = wordShowNode.getChildByName("word")
        wordNode.getComponent(cc.Label).string = word
        wordShowNode.getComponent(cc.Layout).updateLayout()
    }

    stopGouAction() {
        this.isRotateGou = false
    }
    update(dt) {
        if (!this.isRotateGou || this.gameIsPause) {
            return
        }
        if (this.line.angle >= this.rotateMaxAngle) {
            this.debal *= -1
        }
        else if (this.line.angle <= -this.rotateMaxAngle) {
            this.debal *= -1
        }
        this.line.angle += this.debal * dt
    }

    onDestroy() {
        if (this.gameLevel >= gameLevel.LEVEL1) {
            this.unregisterTouchEvent()
        }
    }

    onClickDadishu() {
        cc.director.loadScene("gameSceneDaDiShu")
    }
}
