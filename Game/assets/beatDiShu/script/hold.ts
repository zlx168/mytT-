// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import gameScene from "./gameScene";

export enum holdState{
    LENQUE,
    NOMAL,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class hold extends cc.Component {
    
    holdState:holdState = holdState.NOMAL

    gameScene:gameScene = null

    onLoad () {
        this.gameScene = cc.find("Canvas").getComponent("gameScene")
    }

    start () {

    }

    holdWaitSchedule(){
        this.holdState = holdState.NOMAL
        this.stopHoldWaitTime()
    }

    startHoldWaitTime() {
        this.holdState = holdState.LENQUE
        this.unschedule(this.holdWaitSchedule)
        this.schedule(this.holdWaitSchedule,this.gameScene.holdWaitTime)
    }


    stopHoldWaitTime() {
        this.unschedule(this.holdWaitSchedule)
    }


    // update (dt) {}
}
