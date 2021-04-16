// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class wordIcon extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    num:cc.Label  = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setIconAndScore(icon:cc.SpriteFrame,score:number){
        this.icon.getComponent(cc.Sprite).spriteFrame = icon
        this.num.string = score.toString()
    }
    setIcon(icon:cc.SpriteFrame){
        this.icon.getComponent(cc.Sprite).spriteFrame = icon
    }
    setScore(score:number){
        this.num.string = score.toString()
    }
    // update (dt) {}
}
