// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class poolManager  {

    static _poolManager:poolManager = null

    static instance(){
        if(!this._poolManager){
            this._poolManager = new poolManager()
        }
        return this._poolManager
    }

    private _obstacleNodePoolList:cc.NodePool[] = []
    private _iconNodePool:cc.NodePool = null
    private _obstaclePrefabList:cc.Prefab[] = []
    private _iconPrefab = null
    initObstacleNodePoolList(prefebList:cc.Prefab[],numList:number[]){
        prefebList.forEach((v,index)=>{
            this._obstaclePrefabList.push(v)
            this._obstacleNodePoolList[index] = new cc.NodePool()
        })
        if(numList.length < 0){
            console.warn("请传入对应初始化的数组数据")
            return
        }
        for(let k = 0 ; k < this._obstacleNodePoolList.length; ++k){
            for(let i = 0 ; i < numList.length ; ++i){
                let count = i 
                for(let j = 0 ; j < count ; ++ j){
                    let node = cc.instantiate(this._obstaclePrefabList[k])
                    this._obstacleNodePoolList[k].put(node) 
                }
            }
        }
       
    }

    initIconNodePool(prefeb:cc.Prefab,num:number){
        this._iconPrefab = prefeb
        if(!this._iconNodePool){
            this._iconNodePool = new cc.NodePool()
        }
        for(let i = 0 ; i < num; ++i){
            let node = cc.instantiate(this._iconPrefab)
            this._iconNodePool.put(node)
        }
    }


    getObstaclNodePool(index:number){
        return this._obstacleNodePoolList[index]
    }

    getIconNodePool(){
        return this._iconNodePool
    }

    public getObstacleNode(index){
        let node = null;
        if (this._obstacleNodePoolList[index].size() <= 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            let node = cc.instantiate(this._obstaclePrefabList[index])
            this._obstacleNodePoolList[index].put(node)
        } 
        node = this._obstacleNodePoolList[index].get();
        return node
    }

    public getIconNode(){
        let node = null;
        if (this._iconNodePool.size() <= 0) { // 通过 size 接口判断对象池中是否有空闲的对象
           let node = cc.instantiate(this._iconPrefab)
           this._iconNodePool.put(node)
        } 
        node = this._iconNodePool.get();
        return node
    }

    public putIconNode(node:cc.Node){
        this._iconNodePool.put(node)
    }

    public putObstacleNode(index:number,node:cc.Node){
        this._obstacleNodePoolList[index].put(node)
    }

    clearAll(){
        this._obstacleNodePoolList.forEach(v=>{
            v.clear()
        })
        this._iconNodePool.clear()
    }




    // update (dt) {}
}
