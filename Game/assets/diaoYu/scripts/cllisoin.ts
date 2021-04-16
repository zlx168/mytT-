// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import fish, { State } from "./fish";
import gameSceneDiaoYu from "./gameSceneDiaoYu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class collision extends cc.Component {


    onCollisionEnter(other:cc.Collider, self:cc.Collider) {
        //console.log('on collision enter');
         
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
       // var world = self.world;
    //
       // // 碰撞组件的 aabb 碰撞框
       // var aabb = world.aabb;
    //
       // // 节点碰撞前上一帧 aabb 碰撞框的位置
       // var preAabb = world.preAabb;
    //
       // // 碰撞框的世界矩阵
       // var t = world.transform;
    //
       // // 以下属性为圆形碰撞组件特有属性
       // var r = world.radius;
       // var p = world.position;
    //
       // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
       // var ps = world.points;
       if(self.node.name === "gou" && other.node.name === "yu"){ 
            let gameScene:gameSceneDiaoYu = cc.find("Canvas").getComponent("gameSceneDiaoYu")
            if(gameScene.isCatching){
                return
            }
            let selfNode = self.node
            let otherNode = other.node
            let fishScript:fish = otherNode.getComponent("fish")
            gameScene.isCatching = true
            //已经碰到鱼了
            if(fishScript.state == State.NOMAL){
                //otherNode.getComponent(cc.Collider).enabled = false ///去掉鱼的碰撞
                fishScript.stopMoveAction()
                gameScene.stopGouAction()//停止钩旋转
                otherNode.setPosition(0,0)//鱼上钩
                otherNode.parent = selfNode
                cc.find("audioManager").getComponent("audioManager").playCatchFish()
                gameScene.takeInHook(0.5,()=>{
                    fishScript.addScoreAction()
                    gameScene.isCatching = false
                    selfNode.destroyAllChildren()
                    gameScene.startGouRotate()
                })
            }
            else if(fishScript.state == State.PROTECT){
                gameScene.stopGouAction()//停止钩旋转
                fishScript.hidePao()//鱼隐藏气泡
                //收钩
                gameScene.takeInHook(0.5,()=>{
                    gameScene.startGouRotate()
                    gameScene.isCatching = false
                })
            }
          
       }
    }
    onCollisionStay (other:cc.Collider, self:cc.Collider) {
        console.log('on collision stay');
    }
    onCollisionExit (other:cc.Collider, self:cc.Collider) {
        console.log('on collision exit');
    }
}
