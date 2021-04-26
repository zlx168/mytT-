// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import constant from "./constant";
import gameScenePaoKu from "./gameScenePaoKu";
import icon from "./icon";
import poolManager from "./poolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class daojuManager extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Prefab)
    iconItem:cc.Prefab = null
    @property(cc.Node)
    gameSceneNode: cc.Node = null
    _gameScene:gameScenePaoKu = null
    leftPadding = 200
    rightPadding = 200
    spacing = 200

    posY = -25
     
    _poolManager:poolManager = null
    onLoad(){
        this._poolManager = poolManager.instance()
        this._poolManager.initIconNodePool(this.iconItem,30)
    }

    start() {
        this._gameScene = this.gameSceneNode.getComponent("gameScenePaoKu")
    }


    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    creatDaoJu(startPosX:number, endPosX:number) {
        let subX = endPosX- startPosX - this.leftPadding - this.rightPadding 
        let node = cc.instantiate(this.iconItem)
        let nodeWidth = node.width * node.scaleX
        let sigleWidth = nodeWidth + this.spacing



        let startX = startPosX + this.leftPadding
        let endX = endPosX - this.rightPadding

        let iconPosList = []
        while(true){
            startX += sigleWidth
            if(startX > endX){
                break
            }
            iconPosList.push(startX) 
        }

        let canThrowNum = iconPosList.length;
        //随机个数
        let randNum = this.rnd(4,5)
        if(canThrowNum < randNum){
            return
        }
        //算出道具位置
        let daoJuIndexList = this.getRandomSequence(canThrowNum)
        console.log("道具位置下标",daoJuIndexList)
        for(let i = 0 ; i < randNum; ++i){
            let index = Math.floor(Math.random()*this._gameScene.wordIconList.length)
            let icon = this._gameScene.wordIconList[index]
            let word = this._gameScene.wordList[index]
            let music = this._gameScene.wordMusicList[index]
            let node = this._poolManager.getIconNode()
            let iconScript:icon = node.getComponent("icon")
            iconScript.setType(constant.iconType.NOMALE)
            node.parent = this.node
            let pos = cc.v2(iconPosList[daoJuIndexList[i]],this.posY )
            node.name = this._gameScene.wordList[index]
            node.x = pos.x
            node.y = pos.y
            iconScript.setIconMusicWord(icon,music,word)
        }
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
        
        console.log("总个数",total)
        console.log("随机出来得数字", output)
        return output
    }


    // update (dt) {}
}
