// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import daojuManager from "./daojuManager";
import gameScenePaoKu from "./gameScenePaoKu";
import obstacle from "./obstacle";
import poolManager from "./poolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class obStacleManager extends cc.Component {

    @property(cc.Prefab)
    obstacleList: cc.Prefab[] = []
    timeMax = 5
    lastPos: cc.Vec2 = null

    posY = -136
    startX = 0
    width = 214

    gameScene:gameScenePaoKu = null

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    daoJuManagerNode:cc.Node = null
    _daoJuManager:daojuManager = null

    private _poolManger:poolManager = null
    onLoad () {
        this.startX = cc.winSize.width
        this._daoJuManager = this.daoJuManagerNode.getComponent("daojuManager")
        this._poolManger = poolManager.instance()
        this._poolManger.initObstacleNodePoolList(this.obstacleList,[10,10,10])
    }

    start() {
        
    }

    setGameScene(gameScene){
        this.gameScene = gameScene
    }
    createObstacle(icon: cc.SpriteFrame, music: cc.AudioClip, word: string) {
        let index = 0
        let randVaule = Math.floor(Math.random() * 10)
        if (randVaule < 2) {
            index = 0
        } else if (randVaule >= 2 && randVaule < 3) {
            index = 1
        } else {
            index = 2
        }
        let node = this._poolManger.getObstacleNode(index)

        if (this.node.children.length <= 0) {
            node.x = this.startX
            node.y = this.posY
        } else {
            let length = this.node.children.length
            let lastPos = this.node.children[length - 1].position
            let rx = this.creatRandX()
            node.x = lastPos.x + rx
            node.y = this.posY
            this._daoJuManager.creatDaoJu(lastPos.x, lastPos.x + rx)
        }
        node.parent = this.node
        const script: obstacle = node.getComponent("obstacle")
        script._prefabIndex = index
        script.setIconMusicWord(icon, music, word)

    }

    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    creatRandX() {
        return this.rnd(2000, 3000)
    }
    // update (dt) {}
}
