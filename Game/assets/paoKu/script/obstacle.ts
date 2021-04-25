// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import constant from "./constant";
import icon from "./icon"
const {ccclass, property} = cc._decorator;

@ccclass
export default class obstacle extends cc.Component {


    public _hasCollider = false
    public _prefabIndex = -1
    onLoad () {}

    start () {

    }
  
    
   public setIconMusicWord(icon:cc.SpriteFrame,music:cc.AudioClip,word:string){
        const children = this.node.children
        if(children && children.length > 0){
            children.forEach(v=>{
                v.name = word
                v.active = true
                const script:icon = v.getComponent("icon")
                script.setType(constant.iconType.OBSTACLE)
                script.setIconMusicWord(icon,music,word)
            })
        }
    }
    update (dt) {}
}
