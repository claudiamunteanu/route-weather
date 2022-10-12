import {HISTORY_WEATHER_API_URL, WEATHER_API_KEY, WEATHER_API_URL} from "../config";

export class ForecastAPI{
    constructor(api) {
        this.api = api;
    }

    async fetchHourlyForecast(latitude, longitude, language) {
        let endpoint = `${WEATHER_API_URL}/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        if(language === "ro")
            endpoint = endpoint + `&lang=${language}`;
        return await this.api.get(endpoint);
    }


    async hourPlaceForecast(place, language){
        return this.fetchHourlyForecast(place.city.latitude, place.city.longitude, language).then(forecastJSON=>{
            let time = place.time
            let hourlyForecast = forecastJSON.list
            let forecast = hourlyForecast[0]
            for (let i = 0; i < hourlyForecast.length - 1; i++) {
                let prevForecast = hourlyForecast[i]
                let nextForecast = hourlyForecast[i+1]
                if (prevForecast.dt <= time && nextForecast.dt > time) {
                    if(time - prevForecast.dt < nextForecast.dt - time)
                        forecast = prevForecast
                    else
                        forecast = nextForecast
                    break
                }
            }
            return forecast;
        })
    }

    async fetchForecast(places, language){
        let routeForecast = []
        let weatherTypes = []
        for (const place of places) {
            const cityForecast = await this.hourPlaceForecast(place, language)
            routeForecast.push({city: place.city, time: place.time, duration: place.duration, forecast: cityForecast})
            const weatherType = cityForecast.weather[0].main
            if(!weatherTypes.includes(weatherType))
                weatherTypes.push(weatherType)
        }
        return {routeForecast: routeForecast, weatherTypes: weatherTypes};
    }

    async fetchRoutesForecasts(routesPlaces, language){
        let routesForecasts = []
        let index = 0
        for (const places of routesPlaces){
            let routeForecast = await this.fetchForecast(places.cities, language)
            routesForecasts.push({id: index, route: routeForecast, summary: places.summary, polyline: places.polyline, distance: places.distance, duration: places.duration})
            index = index + 1
        }

        return routesForecasts
    }

    async fetchHistoricalForecast(latitude, longitude, start, end){
        const endpoint = `${HISTORY_WEATHER_API_URL}/history/city?lat=${latitude}&lon=${longitude}&start=${start}&end=${end}&appid=${WEATHER_API_KEY}&units=metric`
        return await this.api.get(endpoint);
    }
}