// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import wordIcon from "../../beatDiShu/script/wordIcon";


const {ccclass, property} = cc._decorator;

@ccclass
export default class jieSuan extends cc.Component {

    @property(cc.Node)
    wordLayoutList:cc.Node = null;
    @property(cc.Prefab)
    itemPrefab:cc.Node = null;


    @property(cc.Label)
    score:cc.Label = null
    destNation:any = null

    @property(cc.AudioClip)

    starEffect:cc.AudioClip = null

    private numScore = 0 

    gameSceneName = null
    onLoad(){
        this.node.width = cc.director.getWinSize().width
        this.node.height = cc.director.getWinSize().height
    }
    start () {
        this.node.getChildByName("starCount").getComponent(cc.Widget).updateAlignment()
        this.destNation = this.node.getChildByName("starCount").position
    }

    show(tongJi:{},wordIconList:any[],starNumber:number,gameSceneName?:string){
        let i = 0;
        for(let key in tongJi){
            let node = cc.instantiate(this.itemPrefab)
            let script:wordIcon = node.getComponent("wordIcon")
            script.setIconAndScore(wordIconList[i],tongJi[key])
            console.log("tongji",tongJi)
            this.wordLayoutList.addChild(node)
            i++
        }
        this.showAllStar(starNumber)
        if(gameSceneName){
            this.gameSceneName = gameSceneName
        }
    }
    async showAllStar(num:number){
        // let curentScore = parseInt(this.score.string)
        // curentScore += num
        // this.score.string = curentScore.toString()

        let tempNode = this.node.getChildByName("tempStar")
        let starLayout = this.node.getChildByName("starLayout")
        for(let i = 0 ; i < num ; ++i){
            let node = cc.instantiate(tempNode)
            node.active = true
            node.opacity = 0
            starLayout.addChild(node)
            starLayout.getComponent(cc.Layout).updateLayout()
        }

        for(let i = 0 ; i < starLayout.children.length; ++i){
             await this.showSingleStar(starLayout.children[i])
        }

        this.scheduleOnce(async()=>{
            starLayout.getComponent(cc.Layout).enabled = false
            for(let i = 0 ; i < starLayout.children.length; ++i){
                await this.runToStar(starLayout.children[i])
            }
            starLayout.destroyAllChildren()
        },1)
       
    }
 
    async showSingleStar(node:cc.Node){
        // let p = new Promise(resolve=>{
        //     node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
        //         node.active = true
        //         resolve(0)}))
        //     )
        // return p 
        let p = new Promise(resolve=>{ 
            node.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(()=>{
                cc.audioEngine.playEffect(this.starEffect,false)
                node.opacity = 255,
                resolve(0)
            })))
        })
        return p
    }

    async runToStar(node:cc.Node){
        // let p = new Promise(resolve=>{
        //     node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
        //         node.active = true
        //         resolve(0)}))
        //     )
        // return p 
        let destnation = node.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.destNation))
        let p = new Promise(resolve=>{ 
           node.runAction(cc.sequence(cc.moveTo(0.5,destnation),cc.callFunc(()=>{
               this.numScore += 1
               this.score.string = this.numScore.toString()
               node.opacity = 0
               resolve(0)
           })))
        })
        return p
    }
    
    onClickStartGame(){
        if(this.gameSceneName){
            cc.director.loadScene(this.gameSceneName)
        }
    }
    // update (dt) {}
}
