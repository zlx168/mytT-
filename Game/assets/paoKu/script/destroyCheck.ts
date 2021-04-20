// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import bgManager from "./bgManager";
import obStacleManager from "./obstacleManager";

const TYPE = cc.Enum({
    BG: 1,
    OBSTACLE: 2
});


const { ccclass, property } = cc._decorator;

@ccclass
export default class bgDestroyCheck extends cc.Component {

    hero: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property({ type: TYPE, displayName: "块类型", visible: true })
    objectType = TYPE.BG
    start() {
        this.hero = this.node.parent.parent.getChildByName("hero")
        console.log("hero",this.hero)
    }

    update(dt) {
        let distance = this.node.position.sub(this.hero.position).mag()
        if (distance > cc.winSize.width * 2 && this.node.x < this.hero.x) {
            switch (this.objectType) {
                case TYPE.BG: {
                    let script:bgManager =this.node.parent.getComponent("bgManager")
            //script.createBg(1)
            //this.node.destroy()
                    let length = this.node.parent.children.length
                    let index = this.node.parent.children.indexOf(this.node)
                    if(index < 0){
                        return
                    }
                    let posX = this.node.parent.children[length - 1].x + cc.winSize.width 
                    this.node.parent.children.splice(index,1)
                    this.node.parent.children.push(this.node)
                    this.node.setPosition(cc.v2(posX,this.node.y))
                    break;
                }
                case TYPE.OBSTACLE: {
                    let script:obStacleManager = this.node.parent.getComponent("obstacleManager")
                    script.createObstacle(1)
                    this.node.destroy()
                    break;
                }
            }
        }
    }
}
