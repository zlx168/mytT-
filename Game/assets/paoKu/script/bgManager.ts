// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "./hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class bgManager extends cc.Component {

    @property(cc.Prefab)
    bgPrefab:cc.Prefab = null

    @property(cc.Prefab)
    bgBackPrefab:cc.Prefab = null

    lastPosx = 0
    onLoad(){
    }
    start () {
       
    }
    createBg(num){
        for(let i = 0; i < num; ++i){
            const node = cc.instantiate(this.bgPrefab)
            node.parent = this.node
            node.setPosition(this.lastPosx,0)
            //this.lastPosx += cc.winSize.width - 2
            const nodeBgBack = cc.instantiate(this.bgBackPrefab)
            nodeBgBack.parent = this.node.getChildByName("bgBackList")
            nodeBgBack.setPosition(this.lastPosx,0)
            this.lastPosx += cc.winSize.width - 2
        }
    }

    update (dt) {
       
    }
}
