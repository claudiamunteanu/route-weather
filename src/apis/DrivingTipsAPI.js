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

    async undo(language){
        const endpoint = `${SERVER_URL}/drivingTips/undo?language=${language}`
        return await this.api.patch(endpoint)
    }

    async redo(language){
        const endpoint = `${SERVER_URL}/drivingTips/redo?language=${language}`
        return await this.api.patch(endpoint)
    }
}