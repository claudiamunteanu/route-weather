import {GOOGLE_API_KEY, GOOGLE_API_URL, PROXY} from "../config";

export class GoogleMapsAPI {
    constructor(api) {
        this.api = api
    }

    async fetchRoute(startCity, destCity, startTime, mode, language) {
        const endpoint = `${PROXY}${GOOGLE_API_URL}/directions/json?departureTime=${startTime}&destination=${destCity}&mode=${mode}&origin=${startCity}&alternatives=true&key=${GOOGLE_API_KEY}&language=${language}`
        return await this.api.get(endpoint)
    }

    fetchPlaces(currentRoute, startTime) {
        let stepList = []
        Array.from(currentRoute.legs).forEach(leg => {
            stepList.push(...leg.steps);
        });
        let routeCoords = []
        let time = Number.parseInt(startTime);
        stepList.forEach(e => {
            routeCoords.push({lat: e.start_location.lat, lng: e.start_location.lng, startTime: time});
            time += e.duration.value;
        });
        let lastStep = stepList[stepList.length - 1]
        routeCoords.push({lat: lastStep.end_location.lat, lng: lastStep.end_location.lng, startTime: time})

        return routeCoords
    }

    async fetchRoutesPlaces(startCity, destCity, startTime, mode, language) {
        return this.fetchRoute(startCity, destCity, startTime, mode, language).then(route => {
                let coords = []
                route.routes.forEach((currentRoute, index) => {
                    let routeCoords = this.fetchPlaces(currentRoute, startTime)
                    coords.push({routeCoordinates: routeCoords, summary: currentRoute.summary, polyline: currentRoute.overview_polyline.points, distance: currentRoute.legs[0].distance.text, duration: currentRoute.legs[0].duration.text})
                })
                console.log(coords)
                return coords
            }
        );
    }

    async fetchSuggestion(text) {
        const endpoint = `${PROXY}${GOOGLE_API_URL}/place/queryautocomplete/json?input=${text}&key=${GOOGLE_API_KEY}`
        return await this.api.get(endpoint)
    }
}