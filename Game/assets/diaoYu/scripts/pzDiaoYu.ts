// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class pz extends cc.Component {

   @property(cc.Label)
   timeNum:cc.Label = null

   @property(cc.Prefab)
   itemIcon:cc.Prefab = null

   @property(cc.Node)
   wordItemLayout:cc.Node = null


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }
    initWordItemLayout(wordListIcon:cc.SpriteFrame[],wordList:string[]){
        for(let i = 0 ; i < wordListIcon.length; ++i){
            let node = cc.instantiate(this.itemIcon)
            node.name = wordList[i]
            node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = wordListIcon[i]
            this.wordItemLayout.addChild(node)
        }
        
    }
    updateTime(time:number){
        let node =  this.timeNum.node
        node.runAction(cc.sequence(cc.scaleTo(0.5,1.2),cc.scaleTo(0.5,1),cc.callFunc(()=>{
            this.timeNum.string = time.toString()
        })))
    }
    updateScore(score:number,itemName){
        let node = this.wordItemLayout.getChildByName(itemName)

        let iconNode = node.getChildByName("icon")

        let numNode = node.getChildByName("num")

        let curentScore = parseInt(numNode.getComponent(cc.Label).string)
        curentScore += score
        numNode.getComponent(cc.Label).string = curentScore.toString()
       // node.stopAllActions()
        iconNode.runAction(cc.sequence(cc.scaleTo(0.5,1.2),cc.scaleTo(0.5,1)))
        numNode.runAction(cc.sequence(cc.scaleTo(0.5,1.5),cc.scaleTo(0.5,1)))
        
    }
    // update (dt) {}
}
