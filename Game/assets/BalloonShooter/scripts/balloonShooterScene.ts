// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import jieSuan from "../../comon/scripts/jieSuan";
import loadRes from "../../comon/scripts/loadRes";
import crow from "./crow";
import gift from "./gift";

const { ccclass, property } = cc._decorator;

@ccclass
export default class balloonShooterScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    gameIsPause = false
    public gameIsOver = false
    private curentTime = 0 //当前时间
    private totalTime = 220//总时间
    private gitPerMaxNum = 3 //每次产生得最多礼物数量

    private posRandList = []

    private balloonCreateIntervalMinTime = 1

    private balloonCreateIntervalMaxTime = 2

    private balloonFishIntervalTime = 0

    isShoting = false

    @property(cc.Node)
    paoNode:cc.Node = null

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
    private yindao: cc.AudioClip = null

    wordAnimationPos: any[] = []

    @property(cc.Node)
    daoJiShAnimation: cc.Node = null

    tongJi = {}

    wordActionParent: cc.Node = null

    @property(cc.AudioClip)
    bgMusic: cc.AudioClip = null

    @property(cc.Prefab)
    leftCowPre: cc.Prefab = null

    @property(cc.Prefab)
    rightCowPre: cc.Prefab = null

    @property(cc.Prefab)
    jieSuanPrefab: cc.Prefab = null

    @property(cc.Prefab)
    wordItem: cc.Prefab = null

    @property(cc.Prefab)
    giftItem: cc.Prefab = null

    @property(cc.Prefab)
    bullet: cc.Prefab = null

    @property(cc.Prefab)
    studytem: cc.Prefab = null

    @property(cc.Prefab)
    loadRes: cc.Prefab = null

    @property(cc.Vec3)

    wordItemStartPos: cc.Vec3 = null


    destination:cc.Vec3 = null

    start() {
        cc.director.getCollisionManager().enabled = true
        if (cc.sys.isNative) {
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

    setConfig(setConfig) {

    }

    playBackGround() {
        cc.audioEngine.setMusicVolume(0.2)
        cc.audioEngine.playMusic(this.bgMusic, true)
    }


    async readyGame() {

        this.destination = this.getDestination()
        this.getRandomPosList()
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

    startGame() {
        this.createGift()
        this.startCreateBalloonSchedule()
        this.updateStutyWordLayout()
        this.startTime()
    }
    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }


    createGift() {

        let childCount = this.node.getChildByName("bg").getChildByName("gifParentNode").children.length
        if (childCount > 0) {
            return
        }

        if (Math.floor(Math.random() * 5) == 0) {
            this.showCrow()
        }

        let num = this.rnd(2, this.gitPerMaxNum)

        let posList = this.getRandomSequence(num)

        for (let i = 0; i < num; ++i) {
            let index = Math.floor(Math.random() * this.wordList.length)
            let node = cc.instantiate(this.giftItem)
            this.node.getChildByName("bg").getChildByName("gifParentNode").addChild(node)

            let script: gift = node.getComponent("gift")
            script.setNameIconAndMusic(this.wordList[index], this.wordIconList[index], this.wordMusicList[index])

           

            // let x = this.rnd(100,cc.winSize.width / 2 - 100)
            // if(Math.floor(Math.random() * 2) == 1){
            //     x = -x
            // }
            node.x = posList[i]
            node.y = cc.winSize.height / 2 + node.height / 2
            console.log("node.x,node.y", node.x, node.y)
            let endy = this.destination.y

            console.log("destination",this.destination)
            console.log("endy",endy)
            node.getComponent("gift").initGameScene(this)

            // node.getComponent("gift").curentTween = cc.tween(node)
            // .to(2, { y: endy })
            // .call(() => {
            //     node.destroy()
            // })
            // .start()

            node.runAction(cc.sequence(cc.moveTo(5, cc.v2(node.x, endy)), cc.callFunc(() => {
                if(cc.isValid(node,true)){
                    node.destroy()
                }
            })))
        }
    }

    getDestination(){
        let node = this.node.getChildByName("bg").getChildByName("destination")
        node.getComponent(cc.Widget).updateAlignment()
        let pos =node.parent.convertToWorldSpaceAR(node.position)
        let cpos = this.node.getChildByName("bg").getChildByName("gifParentNode").convertToNodeSpaceAR(pos)
        return cpos
    }


    getRandomPosList() {
        let node = cc.instantiate(this.giftItem)
        let width = node.width
        let maxWidth = cc.winSize.width / 2 - 100
        let posList = []
        let startPos = 0
        while (true) {
            startPos += width
            startPos += 10//间距

            if (startPos > maxWidth) {
                break
            }
            else {
                posList.push(startPos)
            }
        }
        let len = posList.length
        for (let i = 0; i < len; ++i) {
            posList.push(-posList[i])
        }
        console.log("所有坐标", posList)

        len = posList.length

        for (let i = 0; i < len; ++i) {
            this.posRandList.push(posList[i])
        }
        return posList
    }

    getRandomSequence(total) {
        let sequence = [];
        let output = [];

        for (let i = 0; i < total; i++) {
            sequence[i] = i;
        }
        let end = total - 1;

        for (let i = 0; i < total; i++) {
            let num = Math.floor(Math.random() * (end + 1));
            output[i] = sequence[num];
            sequence[num] = sequence[end];
            end--;
        }
        console.log("随机出来得数字", output)

        let posList = []

        function randFun(arr) {
            arr.sort(function () {
                return Math.random() - 0.5;
            });
        }
        for (let i = 0; i < 6; ++i) {
            randFun(this.posRandList)
        }
        for (let i = 0; i < total; ++i) {
            posList.push(this.posRandList[output[i]])
        }
        return posList;
    }

    showCrow() {
        if (Math.floor(Math.random() * 2) == 0) {
            this.showLeftCrow()
        } else {
            this.showRightCrow()
        }
    }

    showLeftCrow() {
        let leftCrow = cc.instantiate(this.leftCowPre)
        let script: crow = leftCrow.getComponent("crow")
        script.initGame(this)
        script.setHp(3)
        leftCrow.x = -cc.winSize.width / 2 - leftCrow.width / 2
        leftCrow.runAction(cc.sequence(cc.moveTo(10, cc.v2(leftCrow.x + cc.winSize.width + leftCrow.width + 100, leftCrow.y)),cc.callFunc(()=>{
            leftCrow.destroy()
        })))
        this.node.getChildByName("bg").getChildByName("cowParent").addChild(leftCrow)
    }

    showRightCrow() {
        let rightCrow = cc.instantiate(this.rightCowPre)
        let script: crow = rightCrow.getComponent("crow")
        script.initGame(this)
        script.setHp(3)
        rightCrow.x = cc.winSize.width / 2 + rightCrow.width / 2
        rightCrow.runAction(cc.sequence(cc.moveTo(10, cc.v2(rightCrow.x - cc.winSize.width - rightCrow.width - 100, rightCrow.y)),cc.callFunc(()=>{
            rightCrow.destroy()
        })))
        this.node.getChildByName("bg").getChildByName("cowParent").addChild(rightCrow)
    }


    startCreateBalloonSchedule() {
        this.balloonFishIntervalTime = this.rnd(this.balloonCreateIntervalMinTime, this.balloonCreateIntervalMaxTime)
        this.stopCreateBalloonSchedule()
        this.schedule(this.createGift, this.balloonFishIntervalTime)
    }

    /**
     停止鱼创建的倒计时
     */
    stopCreateBalloonSchedule() {
        this.unschedule(this.createGift)
    }
    ipShot(node: cc.Node) {
        cc.find("audioManager").getComponent("audioManager").playShotMusic()
        let spine = this.paoNode.getComponent(sp.Skeleton)

        spine.setAnimation(0, "fashe", false)

        let bullet = cc.instantiate(this.bullet)
        this.node.addChild(bullet)
        let countPosNode = this.paoNode.getChildByName("countPos")
        let startPos = countPosNode.position
       
        let angle = this.getAngle(node.parent.convertToNodeSpaceAR(countPosNode.parent.convertToWorldSpaceAR(startPos)), node.position)
        bullet.angle = -angle
        this.paoNode.angle =  180 - angle

        let shotPos = this.paoNode.getChildByName("shotPos").position

        bullet.setPosition(bullet.parent.convertToNodeSpaceAR(countPosNode.parent.convertToWorldSpaceAR(shotPos)))


        let script = node.getComponent("gift")

        bullet.runAction(cc.sequence(cc.spawn(cc.rotateBy(0.5,360),cc.moveTo(0.5, cc.v2(node.x, node.y))), cc.callFunc(() => {
            script.runBaoZhaAnimation(()=>{
                node.getComponent(sp.Skeleton).enabled = false
                script.clearIcon()
                script.unregisterTouchEvent()
                script.showWord(() => {
                    script.isStop = false
                    this.addScore(script.giftName, 1)
                    node.getComponent(sp.Skeleton).enabled = true
                    if(cc.isValid(node,true)){
                        node.destroy()
                    }
                })
               
            })
            if(cc.isValid(bullet,true)){
                bullet.destroy()
            }
        })))
   
        spine.setCompleteListener((trackEntry) => {
            console.log("完成")
        });
        spine.setStartListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        });
        spine.setInterruptListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        });
        spine.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        });
        spine.setDisposeListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        });
    }

    ipShotCrow(node: cc.Node, onFinish: Function) {
        // if(this.isShoting){
        //     return 
        // }
        cc.find("audioManager").getComponent("audioManager").playShotMusic()
        let bullet = cc.instantiate(this.bullet)
        this.node.addChild(bullet)
        let countPosNode = this.paoNode.getChildByName("countPos")
        let startPos = countPosNode.position
       
        let angle = this.getAngle(node.parent.convertToNodeSpaceAR(countPosNode.parent.convertToWorldSpaceAR(startPos)), node.position)
        bullet.angle = -angle
        this.paoNode.angle =  180 - angle

        let shotPos = this.paoNode.getChildByName("shotPos").position

        bullet.setPosition(bullet.parent.convertToNodeSpaceAR(countPosNode.parent.convertToWorldSpaceAR(shotPos)))

        let spine = this.paoNode.getComponent(sp.Skeleton)
        spine.setAnimation(0, "fashe", false)
        
        bullet.runAction(cc.sequence(cc.spawn(cc.rotateBy(0.5,360),cc.moveTo(0.5, cc.v2(node.x, node.y))), cc.callFunc(() => {
            onFinish()
            if(cc.isValid(bullet,true)){
                bullet.destroy()
            }
        })))
        
        spine.setCompleteListener((trackEntry) => {
            
        });
    }
    getAngle(startPos, endPos) {
        let p = cc.v2(startPos.x, startPos.y).sub(endPos).normalize();
        let rotation = 90 - cc.misc.radiansToDegrees(Math.atan2(p.y, p.x));
        return rotation
    }

    updateStutyWordLayout() {
        let studyWordLayout = this.node.getChildByName("bg").getChildByName("studyWordLayout")
        for (let i = 0; i < this.wordList.length; ++i) {
            let node = cc.instantiate(this.studytem)
            node.name = this.wordList[i]
            node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.wordIconList[i]
            node.getChildByName("num").getComponent(cc.Label).string = `${0}`
            studyWordLayout.addChild(node)
        }
    }

    addScore(name, score) {
        let studyWordLayout = this.node.getChildByName("bg").getChildByName("studyWordLayout")
        let node = studyWordLayout.getChildByName(name)
        let startScore: any = node.getChildByName("num").getComponent(cc.Label).string
        startScore = parseInt(startScore)
        startScore += score
        node.getChildByName("num").getComponent(cc.Label).string = `${startScore}`
        this.tongJi[name] = startScore
    }

    //倒计时开始计时
    startTime() {
        let node = this.node.getChildByName("bg").getChildByName("timeNode").getChildByName("num")
        node.getComponent(cc.Label).string = this.curentTime.toString()
        this.schedule(this.timeSchedule, 1)
    }
    //停止倒计时
    stopTime() {
        this.unschedule(this.timeSchedule)
    }
    //计时器回调
    timeSchedule(dt) {
        if (this.gameIsPause) { return }
        if (this.gameIsOver) { return }
        this.curentTime -= 1
        let node = this.node.getChildByName("bg").getChildByName("timeNode").getChildByName("num")
        node.getComponent(cc.Label).string = this.curentTime.toString()
        if (this.curentTime == 0) {

            this.gameOver()
        }
    }

    gameOver() {

        this.gameIsOver = true
        this.stopCreateBalloonSchedule()
        this.pauseAcion()
        this.stopTime()
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

    onDestroy() {
        this.stopCreateBalloonSchedule()
        this.stopTime()
    }

    pauseGame() {
        this.gameIsPause = !this.gameIsPause
        if (this.gameIsPause) {
            this.pauseAcion()
        }
        else {
            this.resumeAction()
        }

    }
    pauseAcion() {
        cc.director.emit("pauseAction")
        this.stopCreateBalloonSchedule()
    }
    resumeAction() {
        this.startCreateBalloonSchedule()
        cc.director.emit("resumeAction")
    }
    // update (dt) {}
}
