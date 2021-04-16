// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class wordItem extends cc.Component {

   
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private wordMusic:cc.AudioClip = null
    updateIconAndLabelAndWordMusic(lb:string,icon?:cc.SpriteFrame,wordMusic?:cc.AudioClip){
        if(icon){
            this.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = icon
            this.node.getChildByName("icon").width = icon.getOriginalSize().width
            this.node.getChildByName("icon").height = icon.getOriginalSize().height
        }
        if(wordMusic){
            this.wordMusic = wordMusic
        }
        this.node.getChildByName("word").getComponent(cc.Label).string = lb
    }
    playWordEffect(){
        cc.audioEngine.playEffect(this.wordMusic,false)
    }
    start () {

    }

    // update (dt) {}
}
