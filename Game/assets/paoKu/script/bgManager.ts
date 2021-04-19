// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bgList:cc.Node[] = []
    // onLoad () {}
    private speed = 1

    start () {

    }

    update (dt) {
        let bg = this.bgList[0]
        let bg1 = this.bgList[1]
        bg.x -= this.speed
        bg1.x -= this.speed
        if(bg.x <= -cc.winSize.width){
            bg.x = cc.winSize.width
        }
        if(bg1.x <= cc.winSize.width){
            bg1.x = cc.winSize.width
        }
    }
}
