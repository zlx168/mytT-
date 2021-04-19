// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import player from "./player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Node)
        player = null
    start () {
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this)
    }

    touchEnd(){
        const script:player = this.player.getComponent("player")
        script.jump(200,500)
        

    }

    // update (dt) {}
}
