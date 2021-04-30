// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import bgManager from "./bgManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class bgDestroyCheck extends cc.Component {

    BgCamera: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.BgCamera = cc.find("Canvas").getChildByName("BgCamera")
    }

    update (dt) {
        let distance = this.node.position.sub(this.BgCamera.position).mag()
        if(distance > cc.winSize.width * 2 && this.node.x < this.BgCamera.x){
           // let script:bgManager =this.node.parent.getComponent("bgManager")
            //script.createBg(1)
            //this.node.destroy()
            let length = this.node.parent.children.length
            let index = this.node.parent.children.indexOf(this.node)
            if(index < 0){
                return
            }
            let posX = this.node.parent.children[length - 1].x + cc.winSize.width - 2
            this.node.parent.children.splice(index,1)
            this.node.parent.children.push(this.node)
            this.node.setPosition(cc.v2(posX,this.node.y))
        }
    }
}
