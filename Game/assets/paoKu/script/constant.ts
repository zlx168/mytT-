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

enum IconType{
    NOMALE,
    OBSTACLE
}
enum Event{
    CREATE_OBSTACLE = "create_obstacle",
    GAME_OVER = "game_over",
    PAUSE_ACTION = "pause_action",
    RESERME_ACTION = "resume_aciton",
    ADD_SCORE = "add_score",
}
export default class constant  {
    // public static playerState:PlayerState = PlayerState
    public static playerState = PlayerState
    public static iconType = IconType
    public static event = Event
}
