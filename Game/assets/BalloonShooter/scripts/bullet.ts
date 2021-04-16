// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class bullet extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        cc.director.on("pauseAction",this.pauseAction,this)
        cc.director.on("resumeAction",this.resumeAction,this)
    }

    pauseAction(){
        this.node.pauseAllActions()
    }

    resumeAction(){
        this.node.resumeAllActions()
    }

    onDestroy(){
        cc.director.off("pauseAction",this.pauseAction,this)
        cc.director.off("resumeAction",this.resumeAction,this)
    }
    

    // update (dt) {}
}
