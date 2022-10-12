import {SERVER_URL} from "../config";

export class DrivingTipsAPI {
    constructor(api) {
        this.api = api
    }

    async fetchUserDrivingTips(username) {
        const endpoint = `${SERVER_URL}/drivingTips/filter?username=${username}`
        return await this.api.get(endpoint);
    }

    async saveDrivingTip(drivingTip, username){
        const endpoint = `${SERVER_URL}/drivingTips/save?username=${username}`
        return await this.api.post(endpoint, drivingTip);
    }

    async deleteDrivingTip(drivingTipId, language){
        const endpoint = `${SERVER_URL}/drivingTips/delete?id=${drivingTipId}&language=${language}`
        return await this.api.delete(endpoint);
    }

    async updateDrivingTip(drivingTip, language){
        const endpoint = `${SERVER_URL}/drivingTips?language=${language}`
        return await this.api.put(endpoint, drivingTip)
    }

    async undo(username, language){
        const endpoint = `${SERVER_URL}/drivingTips/undo?username=${username}&language=${language}`
        return await this.api.patch(endpoint)
    }

    async redo(username, language){
        const endpoint = `${SERVER_URL}/drivingTips/redo?username=${username}&language=${language}`
        return await this.api.patch(endpoint)
    }
}