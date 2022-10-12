import {SERVER_URL} from "../config";

export class RouteSubscriptionAPI {
    constructor(api) {
        this.api = api;
    }

    async subscribe(startCity, endCity, emailAddress, cities, startTime, frequency, language) {
        let routes = cities.map(routeCities => {
            return {
                startingCity: startCity,
                destinationCity: endCity,
                cities: routeCities.cities,
                description: routeCities.description
            }
        })
        const subscription = {
            startingCity: startCity,
            destinationCity: endCity,
            email: emailAddress,
            routes: routes,
            notificationFrequency: frequency,
            startTime: startTime
        }
        console.log(subscription)
        const endpoint = `${SERVER_URL}/subscription/subscribe?language=${language}`

        return await this.api.post(endpoint, subscription);
    }

    async unsubscribe(startCity, endCity, emailAddress, hash, language) {
        const endpoint = `${SERVER_URL}/subscription/unsubscribe?email=${emailAddress}&startCity=${startCity}&destinationCity=${endCity}&hash=${hash}&language=${language}`

        return await this.api.delete(endpoint);
    }
}