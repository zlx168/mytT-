// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import bgManager from "./bgManager";
import hero from "./hero";
import obStacleManager from "./obstacleManager";
import constant from "./constant";
import loadRes from "../../comon/scripts/loadRes";
import jieSuan from "../../comon/scripts/jieSuan";
import poolManager from "./poolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScenePaoKu extends cc.Component {

    private curentTime = 0 //当前时间

    private totalTime = 320//总时间

    //课程单词学习内容
    wordList = ["apple", "mango", "peach", "watermelon"]
    //课程单词icon
    @property(cc.SpriteFrame)
    wordIconList: cc.SpriteFrame[] = []
    //课程单词音乐
    @property(cc.AudioClip)
    wordMusicList: cc.AudioClip[] = []

    @property(cc.AudioClip)
    bgMusic:cc.AudioClip = null


    @property(cc.Node)
    hero:cc.Node = null
    @property(bgManager)
    bgManager: bgManager = null
    @property(obStacleManager)
    obstacleManager: obStacleManager = null
    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Prefab)
    loadRes: cc.Prefab = null
    @property(cc.Prefab)
    jieSuanPrefab: cc.Prefab = null



    wordActionParent:cc.Node = null
    @property(cc.AudioClip)
    private yindao: cc.AudioClip = null
    wordAnimationPos: any[] = []
    @property(cc.Prefab)
    wordItem: cc.Prefab = null
    tongJi = {}
    @property(cc.Node)
    daoJiShAnimation: cc.Node = null
    @property(cc.Vec3)
    wordItemStartPos: cc.Vec3 = null
    @property(cc.Prefab)
    studytem: cc.Prefab = null
    @property(cc.Node)
    timeNode: cc.Node = null
    @property(cc.Node)
    btnPause: cc.Node = null



    _gameOver = false
    _gamePause = true

    start() {

        cc.director.getCollisionManager().enabled = true
        //cc.director.getCollisionManager().enabledDebugDraw = true

        cc.systemEvent.on(constant.event.CREATE_OBSTACLE,this.createObstacle,this)
        cc.systemEvent.on(constant.event.GAME_OVER,this.gameOver,this)
        cc.systemEvent.on(constant.event.ADD_SCORE,this.addScore,this)
        if (false&&cc.sys.isNative) {
            let node = cc.instantiate(this.loadRes)
            let loadResScript: loadRes = node.getComponent("loadRes")
            loadResScript.getGameConfig(0, (gameConfig) => {
                this.setConfig(gameConfig)
            })
            this.node.addChild(node)
        }
        else {
            this.readyGame()
        }
    }

    playBgMusic(){
        cc.audioEngine.playMusic(this.bgMusic,true)
    }

     async readyGame(){
        this.showButtonWithPause(false)
        console.log("readGame")
        this.curentTime = this.totalTime
        let posList: any = await this.getWordActionPosList()
        for (let i = 0; i < posList.length; ++i) {
            this.wordAnimationPos.push(cc.v3(posList[i].x, posList[i].y))
        }

        let yinDoId = cc.audioEngine.playEffect(this.yindao, false)
        cc.audioEngine.setEffectsVolume(1)
        cc.audioEngine.setFinishCallback(yinDoId, () => {
            this.showCard()
        })
    }

    showButtonWithPause(visible:boolean){
        this.btnPause.active = visible
        this.timeNode.active = visible
        this.node.getChildByName("UIRoot").getChildByName("Jump").active = visible
    }


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

    async showCard() {
        let len = this.wordList.length
        for (let v of this.wordList) {
            this.tongJi[v] = 0
        }

        this.wordActionParent = new cc.Node()
        this.wordActionParent.group = 'UI'
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

    runDaoJiShiAnimation() {
        this.daoJiShAnimation.active = true
        let daoJiShiSpine = this.daoJiShAnimation.getComponent(sp.Skeleton)
        daoJiShiSpine.setAnimation(0, "newAnimation", false)
        daoJiShiSpine.setCompleteListener(() => {
            this.daoJiShAnimation.active = false
            this.scheduleOnce(() => {
                this.startGame()
            }, 0)
        })
    }

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
                let id = cc.audioEngine.playEffect(this.wordMusicList[index], false)
                cc.audioEngine.setFinishCallback(id, () => {
                    resolve(0)
                })
            })))
        })
        return p
    }

    
    setConfig(setConfig) {

    }

    startGame(){
        this.startTime()
        this.playBgMusic()
        this.showButtonWithPause(true)
        this.updateStutyWordLayout()
        this.hero.getComponent("hero").run()
        this._gamePause = false
        this.bgManager.createBg(5)
        this.createObstacle(10)
    }
    jump() {
        this.hero.getComponent("hero").jump(300, 500, () => {
            
        })
    
    }

    
    //倒计时开始计时
    startTime() {
        let node = this.node.getChildByName("UIRoot").getChildByName("timeNode").getChildByName("num")
        node.getComponent(cc.Label).string = this.curentTime.toString()
        this.schedule(this.timeSchedule, 1)
    }
    //停止倒计时
    stopTime() {
        this.unschedule(this.timeSchedule)
    }
    //计时器回调
    timeSchedule(dt) {
        if (this._gameOver) { return }
        if (this._gamePause) { return }
        this.curentTime -= 1
        let node = this.node.getChildByName("UIRoot").getChildByName("timeNode").getChildByName("num")
        node.getComponent(cc.Label).string = this.curentTime.toString()
        if (this.curentTime == 0) {

            this.gameOver()
        }
    }


    gameOver(){
        console.log("gameOver")
        this.pauseGame()
        this._gameOver = true
        this.stopTime()
        let jieSuanNode = cc.instantiate(this.jieSuanPrefab)
        jieSuanNode.group = "UI"
        let script:jieSuan = jieSuanNode.getComponent("jieSuan")
        script.show(this.tongJi, this.wordIconList, this.getStarNumber(),"gameScenePaoKu")
        this.node.addChild(jieSuanNode)
    }

    
    // gameOver() {

    //     this.gameIsOver = true
    //     this.stopCreateBalloonSchedule()
    //     this.pauseAcion()
    //     this.stopTime()
    //     let jieSuanNode = cc.instantiate(this.jieSuanPrefab)
    //     let script: jieSuan = jieSuanNode.getComponent("jieSuan")
    //     script.show(this.tongJi, this.wordIconList, this.getStarNumber())
    //     this.node.addChild(jieSuanNode)
    // }

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









    createObstacle(num){
        for(let i = 0 ; i < num; ++i){
            let index = Math.floor(Math.random() * this.wordIconList.length)
            let icon = this.wordIconList[index]
            let music = this.wordMusicList[index]
            let word = this.wordList[index]
            this.obstacleManager.createObstacle(icon,music,word)
        }
    }

    
    updateStutyWordLayout() {
        let studyWordLayout = this.node.getChildByName("UIRoot").getChildByName("studyWordLayout")
        for (let i = 0; i < this.wordList.length; ++i) {
            let node = cc.instantiate(this.studytem)
            node.name = this.wordList[i]
            node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.wordIconList[i]
            node.getChildByName("num").getComponent(cc.Label).string = `${0}`
            studyWordLayout.addChild(node)
        }
    }

    addScore(name, score) {
        let studyWordLayout = this.node.getChildByName("UIRoot").getChildByName("studyWordLayout")
        let node = studyWordLayout.getChildByName(name)
        let startScore: any = node.getChildByName("num").getComponent(cc.Label).string
        startScore = parseInt(startScore)
        startScore += score
        node.getChildByName("num").getComponent(cc.Label).string = `${startScore}`
        this.tongJi[name] = startScore
    }

    pauseGame(){
        cc.systemEvent.emit(constant.event.PAUSE_ACTION)
    }
    resumeGame(){
        cc.systemEvent.emit(constant.event.RESERME_ACTION)
    }

    onClickPause(){
        
        this._gamePause = !this._gamePause
        if(this._gamePause){
            //cc.director.pause()
            this.pauseGame()
        }else{
            //cc.director.resume()
            this.resumeGame()
        }
    }

    onDestroy(){
        cc.systemEvent.off(constant.event.CREATE_OBSTACLE,this.createObstacle,this)
        cc.systemEvent.off(constant.event.GAME_OVER,this.gameOver,this)
        cc.systemEvent.off(constant.event.ADD_SCORE,this.addScore,this)
        this.stopTime() 
        poolManager.instance().clearAll()
    }
    // update (dt) {}  
}
