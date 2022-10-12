import {useEffect, useState, useCallback} from "react";
import {isPersistedSessionStorageState} from "../helpers";
import {APIProxy} from "../apis/APIProxy";

const initialState = {
    startCity: '',
    destCity: '',
    startDate: 0,
    mode: '',
    routes: [],
};

const notificationState = {
    isError: false,
    message: ''
}

export const useRouteDataFetch = (startCity, destCity, startDate, mode, emailAddress, startTime, frequency, text) => {
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(notificationState);
    const apiProxy = APIProxy.getInstance()

    const fetchRouteForecast = useCallback(async (startCity, destCity, startDate, mode) => {
        try {
            setLoading(true)
            const language = sessionStorage.getItem("language")
            const result = await apiProxy.fetchData(startCity, destCity, startDate, mode, text, language)
            if (result.error === false) {
                setNotification({
                    isError: false,
                    message: ''
                })
                setState({
                    startCity: startCity,
                    destCity: destCity,
                    startDate: startDate,
                    mode: mode,
                    routes: result.result
                })
            } else {
                setNotification({
                    isError: true,
                    message: result.message
                })
            }
            return result.result
        } catch (error) {
            setNotification({
                isError: true,
                message: error.message
            })
        } finally {
            setLoading(false)
        }
    }, [apiProxy, text]);


    // Initial
    useEffect(() => {
        const sessionState = isPersistedSessionStorageState(`route-${startCity}-${destCity}-${startDate}-${mode}-${text?.lang}`)
        if (sessionState) {
            setState(sessionState)
            return;
        }

        console.log("Fetching data")
        fetchRouteForecast(startCity, destCity, startDate, mode).then(routes => {
            const cities = apiProxy.getRoutesCities(routes)
            console.log(cities)
            if (emailAddress != null) {
                console.log("subscribing...")
                const language = sessionStorage.getItem("language")
                apiProxy.subscribeToRoute(startCity, destCity, emailAddress, cities, startTime, frequency, text, language).then(result => {
                    setLoading(true)
                    setNotification({
                        isError: result.error,
                        message: result.message
                    })
                    setLoading(false)
                });
            }
        });
    }, [apiProxy, destCity, emailAddress, fetchRouteForecast, frequency, mode, startCity, startDate, startTime, text]) //runs only once with empty dependencies

    //Write to sessionStorage
    useEffect(() => {
        if (notificationState.isError === false){
            console.log("Writing route data to storage")
            sessionStorage.setItem(`route-${startCity}-${destCity}-${startDate}-${mode}-${text?.lang}`, JSON.stringify(state))
        }
    }, [destCity, mode, startCity, startDate, state, text?.lang])

    return {state, loading, notification}
}