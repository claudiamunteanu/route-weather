import {SERVER_URL} from "../config";

export default class UserAPI{
    constructor(api) {
        this.api = api;
    }

    async login(email, password, language){
        const loginData = {
            email: email,
            password: password
        }
        const endpoint = `${SERVER_URL}/auth?language=${language}`
        return this.api.post(endpoint, loginData)
            .then(response => {
                 if(!response.message){
                     const session = {sessionToken: response.token, emailAddress: response.email, username: response.username}
                     localStorage.setItem("user", JSON.stringify(session));
                 }
                 return response
            })
    }

    async newUser(email, username, password, language){
        const data = {
            email: email,
            username: username,
            password: password
        }
        const endpoint = `${SERVER_URL}/newUser?language=${language}`
        return await this.api.post(endpoint, data)
    }
}