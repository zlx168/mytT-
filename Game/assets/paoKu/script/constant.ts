// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


enum PlayerState{
    RUNGING,
    STOP,
    JUMP
}

enum Event{
    CREATE_OBSTACLE = "create_obstacle",
    GAME_OVER = "game_over",
    PAUSE_ANIMATION = "pause_animation",
    RESERME_AIMATION = "reserme_animtion",
    ADD_SCORE = "add_score",
}
export default class constant  {
    // public static playerState:PlayerState = PlayerState
    public static playerState = PlayerState
    public static event = Event
}
