// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class testRemote extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Sprite)
    remote:cc.Sprite = null;

    @property(cc.Node)
    
    loadRes:cc.Node = null
    


    total:number = 0
    curent:number = 0 

    isremote = false

    cache:any = {}

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let self = this 
//         cc.assetManager.loadRemote('http://www.xzylxx.com/image/log.png', function (err,cc.Asset:) {
//         // var tempPath = cc.assetManager.cacheManager.getTemp(texture.nativeUrl);
//         //console.log(tempPath);
//         //let spf = new cc.SpriteFrame(texture)

//         ??self.remote.spriteFrame = spriteframe


       // cc.assetManager.cacheAsset.
// });

        cc.assetManager.cacheManager.clearCache()
        let testConfig:any = {
            iconremotepath:"http://www.xzylxx.com:80/image/images/1.jpg",
            pictureremotepath:"http://www.xzylxx.com:80/image/images/2.jpg",
            musicremotepath:"http://www.xzylxx.com:80/image/bgm.wav",
            icon:"http://www.xzylxx.com:80/image/images/5.png",
            apple:"http://www.xzylxx.com:80/image/apple.wav",
            bgm:"http://www.xzylxx.com:80/image/bgm.wav"
        }
//loadRemote<T extends cc.Asset>(url: string, onComplete: (err: Error, asset: T) => void): void;
        // cc.assetManager.loadRemote("http://www.xzylxx.com:80/image/log.png",(err,asset:cc.Texture2D)=>{
        //     this.remote.spriteFrame = new cc.SpriteFrame(asset)
        // })

        //cc.assetManager.loadRemote()
        //let total = 0;
        this.total = 0
        this.curent = 0 
        this.isremote = true
        this.loadRes.active = true
        // for(var k in testConfig){
        //     this
        // }

        this.getTotal(testConfig)
       
        for(var k in testConfig){
            ((k)=>{
                this.loadRemote(testConfig[k],(asset)=>{
                    this.curent++
                    this.cache[k] = asset
                    console.log("k值")
                    console.log(k)
                    console.log(this.curent)
                    this.loadRes.getComponent("loadRes").updateVaule(this.curent / this.total)
                    if(this.curent >= this.total){
                        this.scheduleOnce(()=>{
                            this.loadRes.active = false
                        },1)
                        console.log("缓存目录")
                        this.isremote = false
                        //JSON.stringify(this.cace)
                        //console.log( JSON.stringify(this.cace))
                        for(let k in this.cache){
                            console.log(k)
                        }
                        this.remote.spriteFrame = new cc.SpriteFrame(this.cache["icon"])
                        cc.audioEngine.playMusic(this.cache["bgm"],true)
                    }
                })
            })(k)
        
        }
       
    }

    getTotal(list:any[]){
        for(var v of list){
            if( (typeof v=='object')&&v.constructor==Array ){
                this.getTotal(v)
            }else{
                this.total ++;
            }
        }
    }

    // update (dt) {}js
  

    loadRemote(url,endFun){
        cc.assetManager.loadRemote(url,(err,asset:any)=>{

            if(endFun){
                console.log("endFun")
                endFun(asset)
            }
        })
    }

    playapple(){
        if(this.isremote){
            return 
        }
        //cc.audioEngine.playMusic(this.cache["bgm"],true)
        cc.audioEngine.playEffect(this.cache["apple"],false)
    }
    
}
