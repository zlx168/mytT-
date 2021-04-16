// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import *as g1 from "../../utils/api/g1";



var imageUrl = "http://192.168.16.190:5386/anim/beat/dishu_huanpi.png";//http://192.168.16.190:5386/anim/beat/dishu_huanpi.atlas
var skeUrl = "http://192.168.16.190:5386/anim/beat/dishu_huanpi.json";//http://192.168.16.190:5386/anim/beat/dishu_huanpi.json
var atlasUrl = "http://192.168.16.190:5386/anim/beat/dishu_huanpi.atlas"; //http://192.168.16.190:5386/anim/beat/dishu_huanpi.png



const { ccclass, property } = cc._decorator;



enum GameType{
    DDS,
    DIAOYU
}
@ccclass
export default class loadRes extends cc.Component {

    @property(cc.Sprite)
    vaule: cc.Sprite = null;
    @property(cc.Label)
    percent: cc.Label = null;

    total: number = 0
    curent: number = 0

    isDownLoading = false

    cache: any = {}

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let bg = this.node.getChildByName("bg")
        bg.width = cc.winSize.width
        bg.height = cc.winSize.height
    }
    async start() {

    }

    async getGameConfig(gameType:GameType,onFinish:Function){
        let gameConfig = {}
        if(gameType === GameType.DDS){
            let dataConfig = await g1.getGameDds({id:1001})
            let wordConfig = await g1.getWord({id:1})
            
            console.log(dataConfig)
            console.log(wordConfig)
            console.log("配置文件请求结束")

            gameConfig["mouseSkeletonData"] = await this.onLoadSpine('dishu_huanpi.png')
    
            console.log("配置文件请求结束")

            let temData = dataConfig
            let yindao = dataConfig.guideline//引导语
            
            //console.log(JSON.stringify(temData))
    
            gameConfig["totalTime"] = dataConfig.totalTime
            gameConfig["daiJiTime"] = dataConfig.standby
            gameConfig["hp"] = dataConfig.hp
            
            if(dataConfig["hp"] > 1){
                gameConfig["probability"] = dataConfig.probability
            }
            gameConfig["wordList"] = []
            gameConfig["wordIconList"] = []
            gameConfig["wordMusicList"] = []
    
            let downConfig:any = {}
    
            for(let i = 0 ; i < wordConfig.list.length; ++i){
                gameConfig["wordList"].push(wordConfig.list[i]["word"])
                downConfig[wordConfig.list[i]["word"] + "icon"] =  wordConfig.list[i]["icon"] 
                downConfig[wordConfig.list[i]["word"] + "sound"] = wordConfig.list[i]["sound"] 
            }
            downConfig["yindao"] = yindao
    
            console.log(downConfig["yindao"])
    
            console.log('下载配置')
            console.log(JSON.stringify( gameConfig["wordList"]))
            console.log(JSON.stringify(downConfig))
          
            cc.assetManager.cacheManager.clearCache()
    
            this.total = 0
            this.curent = 0
            this.isDownLoading = true
            this.node.active = true
    
            this.getTotal(downConfig)
    
            console.log("total",this.total)
    
            for (var k in downConfig) {
                ((k) => {
                    this.loadRemote(downConfig[k], (asset) => {
                        this.curent++
                        this.cache[k] = asset
                        console.log("k值")
                        console.log(k)
                        console.log(this.curent)
                        this.updateVaule(this.curent / this.total)
                        if (this.curent >= this.total) {
                            this.scheduleOnce(() => {
                                this.node.destroy()
                            }, 1)
                            console.log("缓存目录")
                            this.isDownLoading = false
                            //JSON.stringify(this.cace)
                            //console.log( JSON.stringify(this.cace))
                            for (let k in this.cache) {
                                console.log(k)
                            }
                            for(let i = 0; i < gameConfig["wordList"].length ; ++i){
                                let keyIcon = gameConfig["wordList"][i] + "icon"
                                let keyMusic = gameConfig["wordList"][i] + "sound"
                                gameConfig["wordIconList"].push(new cc.SpriteFrame(this.cache[keyIcon]))
                                gameConfig["wordMusicList"].push(this.cache[keyMusic])
                            }
                            gameConfig["yindao"] = this.cache["yindao"]

                            onFinish(gameConfig)
                            
                            //this.remote.spriteFrame = new cc.SpriteFrame(this.cache["icon"])
                            //cc.audioEngine.playMusic(this.cache["mangosounds"], true)
                            //this.node.getChildByName("testSprite").getComponent(cc.Sprite).spriteFrame =new cc.SpriteFrame(this.cache["appleicon"]) 
                        }
                    })
                })(k)
    
            }
        }else if(gameType == GameType.DIAOYU) {

            console.log("钓鱼")
         
            let  dataConfig = await g1.getGameDy({id:2001})
          
           
            delete dataConfig["_xhr"]

            console.log(JSON.stringify(dataConfig),"dataConfig")
            let wordConfig = await g1.getWord({id:1})
            gameConfig["totalTime"] = dataConfig.totalTime
            gameConfig["throwMaxLen"] = dataConfig.throwMaxLen

            gameConfig["gameLevel"] = dataConfig.gameLevel

            console.log(dataConfig.gameLevel,"难度")
            gameConfig["randPaoMaxNum"] = dataConfig.randPaoMaxNum
            gameConfig["rotateMaxAngle"] = dataConfig.rotateMaxAngle
            gameConfig["speed"] = dataConfig.speed
            gameConfig["maxTime"] = dataConfig.maxTime
            gameConfig["minTime"] = dataConfig.minTime

            gameConfig["wordList"] = []
            gameConfig["wordIconList"] = []
            gameConfig["wordMusicList"] = []

            let downConfig:any = {}
            console.log( dataConfig.guideline,"引导" )
            console.log(dataConfig.bgMusic,"背景音乐")
            downConfig["yindao"]  = dataConfig.guideline
            downConfig["bgMusic"] = dataConfig.bgMusic
            for(let i = 0 ; i < wordConfig.list.length; ++i){
                gameConfig["wordList"].push(wordConfig.list[i]["word"])
                downConfig[wordConfig.list[i]["word"] + "icon"] =  wordConfig.list[i]["icon"] 
                downConfig[wordConfig.list[i]["word"] + "sound"] = wordConfig.list[i]["sound"] 
            }

            cc.assetManager.cacheManager.clearCache()
            this.total = 0
            this.curent = 0
            this.isDownLoading = true
            this.node.active = true
    
            this.getTotal(downConfig)
    
            console.log("total",this.total)
    
            for (var k in downConfig) {
                ((k) => {
                    this.loadRemote(downConfig[k], (asset) => {
                        this.curent++
                        this.cache[k] = asset
                        console.log("k值")
                        console.log(k)
                        console.log(this.curent)
                        this.updateVaule(this.curent / this.total)
                        if (this.curent >= this.total) {
                            this.scheduleOnce(() => {
                                this.node.destroy()
                            }, 1)
                            console.log("缓存目录")
                            this.isDownLoading = false
                            //JSON.stringify(this.cace)
                            //console.log( JSON.stringify(this.cace))
                            for (let k in this.cache) {
                                console.log(k)
                            }
                            for(let i = 0; i < gameConfig["wordList"].length ; ++i){
                                let keyIcon = gameConfig["wordList"][i] + "icon"
                                let keyMusic = gameConfig["wordList"][i] + "sound"
                                gameConfig["wordIconList"].push(new cc.SpriteFrame(this.cache[keyIcon]))
                                gameConfig["wordMusicList"].push(this.cache[keyMusic])
                            }
                            gameConfig["yindao"] = this.cache["yindao"]
                            gameConfig["bgMusic"] = this.cache["bgMusic"]
                            onFinish(gameConfig)
                            
                        }
                    })
                })(k)
            }
        }
    }
    getListByProperty(propertyName:string){

    }
    

    updateVaule(percent) {
        this.percent.string = '加载进度:' + (percent * 100).toFixed(2) + "%";
        this.vaule.getComponent(cc.Sprite).fillRange = percent
    }

    getTotal(list) {
        for (var key in list) {
            this.total++;
        }
    }

    // update (dt) {}js


    loadRemote(url, endFun) {
        cc.assetManager.loadRemote(url, (err, asset: any) => {

            if (endFun) {
                console.log("endFun")
                endFun(asset)
            }
        })
    }


    // onLoadSpine1() {
    //     let p = new Promise(reslove=>{
    //         cc.loader.load(imageUrl, (error, texture) => {
    //             cc.loader.load({ url: atlasUrl, type: 'txt' }, (error, atlasJson) => {
    //                 cc.loader.load({ url: skeUrl, type: 'txt' }, (error, spineJson) => {
    //                     var asset = new sp.SkeletonData();
    //                     asset._uuid = skeUrl + Math.round(Math.random() * new Date().getTime()) ;
    //                     asset.skeletonJson = spineJson;
    //                     asset.atlasText = atlasJson;
    //                     asset.textures = [texture];
    //                     asset.textureNames = ['dishu_huanpi.png'];
    //                     reslove(asset)
    //                 });
    //             });
    //         });
    //     })
    //     return p 
    // }


      /**
     * 
     * @param textureName 骨骼动画图片名字
     * 
     */
       onLoadSpine(textureName:string) {
        let p = new Promise<sp.SkeletonData>(reslove=>{
            cc.assetManager.loadRemote<any>(imageUrl,(error, texture) => {
                cc.assetManager.loadRemote(atlasUrl, (error, atlasJson) => {
                    cc.assetManager.loadRemote(skeUrl, (error, spineJson) => {
                        var asset = new sp.SkeletonData();
                        asset["_uuid"] = skeUrl + Math.round(new Date().getTime()) ;
                        asset.skeletonJson =  spineJson["json"]
                        asset.atlasText = atlasJson["text"] ;
                        asset["textures"] = [texture];
                        asset["textureNames"] = [textureName];
                        reslove(asset)
                    });
                });
            });
        })
        return p 
    }
}
