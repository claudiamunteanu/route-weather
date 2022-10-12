import {SERVER_URL} from "../config";
import {isEmpty} from "../helpers";

export class CitiesAPI{
    constructor(api) {
        this.api = api
    }

    async fetchCityByCoordinates(latitude, longitude, language) {
        const endpoint = `${SERVER_URL}/cities/closestCity?lat=${latitude}&long=${longitude}&language=${language}`
        return await this.api.get(endpoint);
    }

    async fetchCityByName(name, language) {
        const endpoint = `${SERVER_URL}/cities/city?name=${name}&language=${language}`
        return await this.api.get(endpoint);
    }

    async fetchRoutesCities(coords, language){
        let cities = []
        for (const routeCoords of coords){
            let uniqueCities = await this.fetchCities(routeCoords.routeCoordinates, language)
            cities.push({cities: uniqueCities, summary: routeCoords.summary, polyline: routeCoords.polyline, distance: routeCoords.distance, duration: routeCoords.duration})
        }
        return cities
    }

    async fetchCities(routeCoords, language){
        let cities = []
        for (const coord of routeCoords) {
            const city = await this.fetchCityByCoordinates(coord.lat, coord.lng, language)
            if (!isEmpty(city)) {
                cities.push({city: city, startTime: coord.startTime})
            }
        }

        let uniqueCities = [];
        let currentCity = cities[0].city
        let durationSum = cities[0].startTime
        let duration = 0;
        let count = 1
        for (let i = 1; i < cities.length; i++) {
            if (cities[i].city.id === currentCity.id) {
                durationSum += cities[i].startTime
                duration += cities[i].startTime - cities[i-1].startTime
                count++
            } else {
                duration += cities[i].startTime - cities[i-1].startTime
                uniqueCities.push({city: currentCity, time: Math.round(durationSum / count), duration: duration})
                currentCity = cities[i].city
                durationSum = cities[i].startTime
                duration = 0
                count = 1
            }
        }
        uniqueCities.push({city: currentCity, time: Math.round(durationSum / count), duration: duration})
        return uniqueCities
    }
}