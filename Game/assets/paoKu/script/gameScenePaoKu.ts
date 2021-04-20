// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import bgManager from "./bgManager";
import hero from "./hero";
import obStacleManager from "./obstacleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScenePaoKu extends cc.Component {

    @property(cc.Node)
    hero = null
    @property(bgManager)
    bgManager: bgManager = null
    @property(obStacleManager)
    obstacleManager:obStacleManager = null
    start() {
        this.bgManager.createBg(5)
        this.obstacleManager.createObstacle(50)
    }

    jump() {
        const script: hero = this.hero.getComponent("hero")
        script.jump(200, 500)

    }

    // update (dt) {}
}
