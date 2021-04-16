// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class beatRect extends cc.Component {

  

    onLoad () {
        this.registerTouchEvent()
    }
    start () {

    }
    onDestroy(){
        this.unregisterTouchEvent()
    }

    touchStart(e){
        console.log("touchStart")
    }
    touchMove(e){
        console.log("touchMove")
    }
    touchEnd(e){
        this.node.parent.getChildByName("shu").getComponent("shu").onClick(e)
        let pos = e.getLocation();
        let converPos = this.node.parent.convertToNodeSpaceAR(pos)
        this.node.parent.getChildByName("beat").position = converPos
        console.log("touchEnd")
    }
    touchCancel(e){
        console.log("touchCancel")
    }

    registerTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this)
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchCancel,this)
    }
    unregisterTouchEvent(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.touchStart,this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this)
        this.node.off(cc.Node.EventType.TOUCH_END,this.touchEnd,this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.touchCancel,this)
    }

    // update (dt) {}
}
