// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class wave extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private sp:cc.Sprite = null
    private time = 0

    start () {
        this.sp = this.getComponent(cc.Sprite);
        this.time = 0;
    }

    update (dt) {

        this.time += dt*2;
        var material = this.sp.getMaterials()[0];
        material.setProperty("time", this.time);
        this.sp.setMaterial(0, material);
    }
}
