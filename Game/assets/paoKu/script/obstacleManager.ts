// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class obStacleManager extends cc.Component {

    @property(cc.Prefab)
    obstacleList: cc.Prefab[] = []
    timeMax = 5
    lastPos: cc.Vec2 = null

    posY = -136
    startX = 322

    width = 214

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    createObstacle(num) {
    
        for(let i = 0 ; i < num ; i++){
            let index = 0
            let randVaule = Math.floor(Math.random() * 10)
            if (randVaule < 2) {
                index = 0
            } else if (randVaule >= 2 && randVaule < 3) {
                index = 1
            } else {
                index = 2
            }
            let node = cc.instantiate(this.obstacleList[index])
           
            if (this.node.children.length <= 0) {
                node.x = this.startX
                node.y = this.posY
            } else {
                let length = this.node.children.length
                let lastPos = this.node.children[length - 1].position
                let rx = this.creatRandX()
                node.x = lastPos.x + rx
                node.y = this.posY
            }
            node.parent = this.node
        }
    }

    rnd(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    creatRandX(){
        return this.rnd(500,800)
    }
    // update (dt) {}
}
