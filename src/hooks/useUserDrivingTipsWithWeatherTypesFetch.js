import {useCallback, useEffect, useState} from "react";
import {APIProxy} from "../apis/APIProxy";
import {isPersistedSessionStorageState} from "../helpers";

const initialState = {
    username: '',
    drivingTips: []
};

const notificationState = {
    isError: false,
    message: ''
}

export const useUserDrivingTipsWithWeatherTypesFetch = (username, text, weatherTypes ) => {
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState(notificationState);
    const apiProxy = APIProxy.getInstance()

    const fetchDrivingTips = useCallback(async (username, weatherTypes) => {
        try {
            setLoading(true)
            const result = await apiProxy.fetchUserDrivingTips(username, text, weatherTypes)
            console.log(result)
            if(result.error ===false){
                setErrorNotification({
                    isError: false,
                    message: ''
                })
                setState({
                    username: username,
                    drivingTips: result.data
                })
            } else {
                setErrorNotification({
                    isError: true,
                    message: result.message
                })
            }

        } catch (error) {
            setErrorNotification({
                isError: true,
                message: error.message
            })
        }
        setLoading(false)
    }, [apiProxy, text]);

    const replacer = (key, value) => {
        if(value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }

    // Initial
    useEffect(() => {
        const sessionState = isPersistedSessionStorageState(`drivingTips-${username}-${weatherTypes}`)
        if (sessionState) {
            setState(sessionState)
            return;
        }

        console.log("Fetching driving tips with weather types")
        fetchDrivingTips(username, weatherTypes)
    }, [fetchDrivingTips, username, weatherTypes]) //runs only once with empty dependencies

    //Write to sessionStorage
    useEffect(() => {
        console.log("Writing driving tips with weather types to storage")
        sessionStorage.setItem(`drivingTips-${username}-${weatherTypes}`, JSON.stringify(state, replacer))
    }, [state, username, weatherTypes])

    return {state, loading, errorNotification}
}