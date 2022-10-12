import {API} from './API'
import {CitiesAPI} from "./CitiesAPI";
import {ForecastAPI} from "./ForecastAPI";
import {GoogleMapsAPI} from "./GoogleMapsAPI";
import {RouteSubscriptionAPI} from "./RouteSubscriptionAPI";
import UserAPI from "./UserAPI";
import {DrivingTipsAPI} from "./DrivingTipsAPI";
import {capitalizeFirstLetter, daysOfWeek, timestampToDate} from "../helpers";

export class APIFacade {
    constructor() {
        this.api = new API()
        this.citiesAPI = new CitiesAPI(this.api)
        this.forecastAPI = new ForecastAPI(this.api)
        this.googleMapsAPI = new GoogleMapsAPI(this.api)
        this.routeSubscribeAPI = new RouteSubscriptionAPI(this.api)
        this.userAPI = new UserAPI(this.api)
        this.drivingTipsAPI = new DrivingTipsAPI(this.api)

        this.text = this.fetchText()
    }

    async fetchText(){
        const endpoint = `./languageJSON.json`
        return await this.api.get(endpoint)
    }

    async fetchUnitsOfMeasure(){
        const endpoint = `./unitsOfMeasureJSON.json`
        return await this.api.get(endpoint)
    }

    async fetchData(startCity, destCity, startTime, mode, language, text) {
        return this.googleMapsAPI.fetchRoutesPlaces(startCity, destCity, startTime, mode, text.lang)
            .then(coords => {
                return this.citiesAPI.fetchRoutesCities(coords, language)
            })
            .then(places => {
                return this.forecastAPI.fetchRoutesForecasts(places, text.lang)
            })
            .then((result) => {
                console.log(result)
                return {error: false, result: result}
            })
            .catch(() => {
                return {error: true, message: text.messages.route.genericError}
            });
    }

    async subscribeToRoute(startCityName, destCityName, emailAddress, cities, startTime, frequency, language, text) {
        try {
            const startCity = await this.citiesAPI.fetchCityByName(startCityName)
                .catch((error) => {
                    throw error.statusText
                });
            const destCity = await this.citiesAPI.fetchCityByName(destCityName)
                .catch((error) => {
                    throw error.statusText
                });
            return this.routeSubscribeAPI.subscribe(startCity, destCity, emailAddress, cities, startTime, frequency, language)
                .then(() => {
                    return {error: false, message: text.messages.subscribe.success}
                }).catch((error) => {
                    let message = error.statusText + text.messages.subscribe.fail
                    if (message === '')
                        return {error: true, message: text.messages.subscribe.genericError};
                    return {error: true, message: message};
                });
        } catch (error) {
            if (error === '')
                return {error: true, message: text.messages.subscribe.genericError};
            return {error: true, message: error + text.messages.subscribe.fail};
        }
    }

    async unsubscribeFromRoute(startCityName, destCityName, emailAddress, hash, language, text) {
        return this.routeSubscribeAPI.unsubscribe(startCityName, destCityName, emailAddress, hash, language)
            .then(() => {
                return {error: false, message: text.messages.unsubscribe.success}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async fetchAutocompleteSuggestion(text, textJSON) {
        return this.googleMapsAPI.fetchSuggestion(text)
            .then((result) => {
                let matches = result.predictions.filter(prediction => prediction.types.includes('locality') && prediction.terms.filter(term => term.value === 'Romania').length > 0)
                return {error: false, result: matches}
            })
            .catch(() => {
                return {error: true, message: textJSON.messages.suggestions.genericError}
            });
    }

    async login(email, password, language) {
        return this.userAPI.login(email, password, language)
            .then(data => {
                return {error: false, data: data}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async newUser(email, username, password, language, text) {
        return this.userAPI.newUser(email, username, password, language)
            .then(() => {
                return {error: false, message: text.messages.newUser.success}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    filterDrivingTips(drivingTips, weatherTypes) {
        let filteredDrivingTips = new Map()
        drivingTips.forEach(tip => {
            for (const category of tip.categories) {
                const cat = capitalizeFirstLetter(category.toLowerCase())
                if (weatherTypes.includes(cat)) {
                    if (filteredDrivingTips.has(cat))
                        filteredDrivingTips.get(cat).push(tip)
                    else
                        filteredDrivingTips.set(cat, [tip])
                    break;
                }
            }
        })
        return filteredDrivingTips
    }

    getRoutesCities(routes) {
        let cities = []
        routes.forEach(route => {
            let description = `${route.summary}; ${route.distance}; Approximately ${route.duration}`
            let routeCities = {}
            let secondsPassed = 0
            route.route.routeForecast.forEach(forecast => {
                routeCities[secondsPassed] = forecast.city;
                secondsPassed += forecast.duration
            })
            cities.push({cities: routeCities, description: description})
        })
        return cities
    }

    async fetchUserDrivingTips(username, weatherTypes, text) {
        return this.drivingTipsAPI.fetchUserDrivingTips(username)
            .then(data => {
                if (weatherTypes.length !== 0)
                    data = this.filterDrivingTips(data, weatherTypes)
                return {error: false, data: data}
            }).catch((error) => {
                return {error: true, message: text.messages.fetchDrivingTips.genericError};
            });
    }

    async saveUserDrivingTip(drivingTip, username, text) {
        return this.drivingTipsAPI.saveDrivingTip(drivingTip, username)
            .then(data => {
                return {error: false, data: data}
            }).catch((error) => {
                return {error: true, message: text.messages.addDrivingTip.genericError};
            });
    }

    async deleteUserDrivingTip(drivingTipId, language) {
        return this.drivingTipsAPI.deleteDrivingTip(drivingTipId, language)
            .then(data => {
                return {error: false, data: data}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async updateUserDrivingTip(drivingTip, language) {
        return this.drivingTipsAPI.updateDrivingTip(drivingTip, language)
            .then(data => {
                return {error: false, data: data}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async undoDrivingTip(username, language, text) {
        return this.drivingTipsAPI.undo(username, language)
            .then(() => {
                return {error: false, message: text.messages.undo.success}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async redoDrivingTip(username, language, text) {
        return this.drivingTipsAPI.redo(username, language)
            .then(() => {
                return {error: false, message: text.messages.redo.success}
            }).catch((error) => {
                return {error: true, message: error.statusText};
            });
    }

    async fetchHistoricalForecast(cityName, start, end, language, text) {
        try {
            const city = await this.citiesAPI.fetchCityByName(cityName, language)
                .catch((error) => {
                    throw error.statusText
                });

            return this.forecastAPI.fetchHistoricalForecast(city.latitude, city.longitude, start, end)
                .then(result => {
                    return {error: false, result: result}
                }).catch((error) => {
                    return {error: true, message: text.messages.fetchHistoricalData.genericError}
                });
        } catch (error) {
            if (error === '')
                return {error: true, message: text.messages.fetchHistoricalData.genericError};
            return {error: true, message: error};
        }
    }

    formatHistoricalData(data) {
        const days = daysOfWeek
        return data.map(entry => {
            const date = new Date(entry.dt * 1000);
            const hour = date.getHours();
            const day = days[date.getDay()]
            const obj = {
                temp: entry.main.temp,
                pressure: entry.main.pressure,
                temp_min: entry.main.temp_min,
                temp_max: entry.main.temp_max,
                humidity: entry.main.humidity,
                wind_speed: entry.wind.speed,
                wind_deg: entry.wind.deg,
                clouds: entry.clouds.all,
                weather: entry.weather[0].main,
                dt: entry.dt,
                day: day,
                hour: hour === 0 ? day : hour
            }
            if (entry.rain !== undefined) {
                const rain = entry.rain
                if (rain["1h"] !== undefined)
                    obj.rain = rain["1h"]
                else {
                    obj.rain = 0
                }
            } else {
                obj.rain = 0
            }
            return obj
        })
    }

    sixHourData(data) {
        const filteredData = data.list.filter(entry => {
            const date = new Date(entry.dt * 1000);
            return date.getHours() % 6 === 0
        })
        return this.formatHistoricalData(filteredData)
    }

    averageValuesHistoricalData(data) {
        const formattedData = this.formatHistoricalData(data.list)
        const days = daysOfWeek
        let avgData = [];
        for (const day of days) {
            const filteredData = formattedData.filter(entry => entry.day === day)
            const sum = (prev, cur) => ({
                temp: prev.temp + cur.temp,
                pressure: prev.pressure + cur.pressure,
                temp_min: prev.temp_min + cur.temp_min,
                temp_max: prev.temp_max + cur.temp_max,
                humidity: prev.humidity + cur.humidity,
                wind_speed: prev.wind_speed + cur.wind_speed,
                wind_deg: prev.wind_deg + cur.wind_deg,
                clouds: prev.clouds + cur.clouds,
                rain: prev.rain + cur.rain
            });
            const avgDataFiltered = {
                temp: (filteredData.reduce(sum).temp / filteredData.length).toFixed(2),
                pressure: (filteredData.reduce(sum).pressure / filteredData.length).toFixed(2),
                temp_min: (filteredData.reduce(sum).temp_min / filteredData.length).toFixed(2),
                temp_max: (filteredData.reduce(sum).temp_max / filteredData.length).toFixed(2),
                humidity: (filteredData.reduce(sum).humidity / filteredData.length).toFixed(2),
                wind_speed: (filteredData.reduce(sum).wind_speed / filteredData.length).toFixed(2),
                wind_deg: (filteredData.reduce(sum).wind_deg / filteredData.length).toFixed(2),
                clouds: (filteredData.reduce(sum).clouds / filteredData.length).toFixed(2),
                rain: (filteredData.reduce(sum).rain / filteredData.length).toFixed(2)
            };

            filteredData.sort((a, b) => (a.weather > b.weather) ? 1 : -1)

            let max_count = 1, res = filteredData[0].weather;
            let curr_count = 1;

            for (let i = 1; i < filteredData.length; i++) {
                if (filteredData[i].weather === filteredData[i - 1].weather)
                    curr_count++;
                else
                    curr_count = 1;

                if (curr_count > max_count) {
                    max_count = curr_count;
                    res = filteredData[i - 1];
                }
            }

            avgDataFiltered.weather = res.weather;
            avgDataFiltered.day = day
            avgDataFiltered.dt = filteredData[0].dt

            avgData = avgData.concat(avgDataFiltered);
        }
        avgData.sort((a, b) => (a.dt > b.dt) ? 1 : -1)
        avgData = avgData.map(entry => {
            entry.day = entry.day + " " + timestampToDate(entry.dt)
            delete entry.dt
            return entry
        })
        return avgData
    }
}