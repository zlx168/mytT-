import webapi from "../http"
import * as components from "./g1Components"
export * from "./g1Components"

/**
 * @description 
 * @param params
 */
export function getWord(params: components.ReqParams, withoutDefaultReject?: boolean): Promise<components.GetWordRes> {
	return webapi.get("/v1/word/:id", params, withoutDefaultReject)
}

/**
 * @description 
 * @param params
 */
export function getGameDds(params: components.ReqParams, withoutDefaultReject?: boolean): Promise<components.GetGameDdsRes> {
	return webapi.get("/v1/game/dds/:id", params, withoutDefaultReject)
}

/**
 * @description 
 * @param params
 */
export function getGameDy(params: components.ReqParams, withoutDefaultReject?: boolean): Promise<components.GetGameDyRes> {
	return webapi.get("/v1/game/dy/:id", params, withoutDefaultReject)
}
