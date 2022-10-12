import {APIFacade} from "./APIFacade";

export class APIProxy{

    static getInstance(){
        if (this.instance === undefined){
            console.log("Initializing Proxy instance")
            this.instance = new APIProxy()
        }
        return this.instance
    }

    initializeFacade(){
        if (this.apiFacade === undefined){
            console.log("Initializing facade")
            this.apiFacade = new APIFacade()
        }
    }

    async fetchText(language){
        this.initializeFacade()
        const text = await this.apiFacade.fetchText()
        return text[language]
    }

    async fetchUnitsOfMeasure(){
        this.initializeFacade()
        return await this.apiFacade.fetchUnitsOfMeasure();
    }

    async fetchData(startCity, destCity, startTime, mode, text, language) {
        this.initializeFacade()
        return await this.apiFacade.fetchData(startCity, destCity, startTime, mode, language, text)
    }

    async subscribeToRoute(startCityName, destCityName, emailAddress, cities, startTime, frequency, text, language) {
        this.initializeFacade()
        return await this.apiFacade.subscribeToRoute(startCityName, destCityName, emailAddress, cities, startTime, frequency, language, text)
    }

    async unsubscribeFromRoute(startCityName, destCityName, emailAddress, hash, text, language) {
        this.initializeFacade()
        return await this.apiFacade.unsubscribeFromRoute(startCityName, destCityName, emailAddress, hash, language, text)
    }

    async fetchAutocompleteSuggestion(text, textJSON){
        this.initializeFacade()
        return await this.apiFacade.fetchAutocompleteSuggestion(text, textJSON)
    }

    async login(email, password, language){
        this.initializeFacade()
        return await this.apiFacade.login(email, password, language)
    }

    async newUser(email, username, password, text, language){
        this.initializeFacade()
        return await this.apiFacade.newUser(email, username, password, language, text)
    }

    async fetchUserDrivingTips(username, text, weatherTypes = []){
        this.initializeFacade()
        return await this.apiFacade.fetchUserDrivingTips(username, weatherTypes, text)
    }

    async saveUserDrivingTip(drivingTip, username, text){
        this.initializeFacade()
        return await this.apiFacade.saveUserDrivingTip(drivingTip, username, text)
    }

    async deleteUserDrivingTip(drivingTipId, language){
        this.initializeFacade()
        return await this.apiFacade.deleteUserDrivingTip(drivingTipId, language)
    }

    async updateUserDrivingTip(drivingTip, language){
        this.initializeFacade()
        return await this.apiFacade.updateUserDrivingTip(drivingTip, language)
    }

    async undoDrivingTip(text, language){
        this.initializeFacade()
        return await this.apiFacade.undoDrivingTip(language, text)
    }

    async redoDrivingTip(text, language){
        this.initializeFacade()
        return await this.apiFacade.redoDrivingTip(language, text)
    }

    getRoutesCities(routes){
        this.initializeFacade()
        return this.apiFacade.getRoutesCities(routes)
    }

    async fetchHistoricalForecast(cityName, start, end, text, language){
        this.initializeFacade()
        return await this.apiFacade.fetchHistoricalForecast(cityName, start, end, language, text);
    }

    sixHourData(data){
        this.initializeFacade()
        return this.apiFacade.sixHourData(data)
    }

    averageValuesHistoricalData(data){
        this.initializeFacade()
        return this.apiFacade.averageValuesHistoricalData(data)
    }
}