// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
 
const {ccclass, property} = cc._decorator;
 
@ccclass
export default class giftWordNode extends cc.Component {
 
    @property(cc.Label)
    wordLabel:cc.Label = null;
 
    animation:cc.Animation= null

    finishCb:Function = null
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('finished',  this.onFinished,    this);
    }
 
    start () {
 
    }
 
    onFinished(){
        this.node.active = false
        if(this.finishCb){
            this.finishCb()
        }
    }

    setFinishCb(cb){
        this.finishCb = cb
    }
 
    setLabel(wordLabel:string){
        this.wordLabel.string = wordLabel 
    }
 
    playWordNodeAnimation(){
        this.animation.play()
    }
 
    onDestroy(){
        this.animation.off('finished',  this.onFinished,    this);
    }
 
    // update (dt) {}
}
 
