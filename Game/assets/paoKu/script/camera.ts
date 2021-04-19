// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class camera extends cc.Component {

    private target:cc.Node 
    private _offset: cc.Vec2;
    start () {

    }

    update (dt) {
        if (this._shouldMove) {
            let pos = this.node.parent.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(cc.Vec2.ZERO));
            this.node.x = cc.v2(pos.x, pos.y).sub(this._offset).x;
        }
        
    }
    public _shouldMove = false;
    move(node: cc.Node) {
        if (this.target === node) return;
        this.target = node;
        let pos = this.node.parent.convertToNodeSpaceAR(this.target.parent.convertToWorldSpaceAR(cc.v2(this.target.x,0)));
        this._offset = cc.v2(pos.x, pos.y).sub(cc.v2(this.node.position.x,this.node.position.y));
        this._shouldMove = true;
    }
}
