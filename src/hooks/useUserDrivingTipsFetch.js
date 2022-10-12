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

export const useUserDrivingTipsFetch = (username, text) => {

    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState(notificationState);
    const [loadAgain, setLoadAgain] = useState(false);
    const apiProxy = APIProxy.getInstance()

    const fetchDrivingTips = useCallback(async (username) => {
        try {
            setLoading(true)
            const result = await apiProxy.fetchUserDrivingTips(username, text)
            if (result.error === false) {
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

    // Initial
    useEffect(() => {
        const sessionState = isPersistedSessionStorageState(`drivingTips-${username}`)
        if (sessionState) {
            setState(sessionState)
            return;
        }

        console.log("Fetching driving tips")
        fetchDrivingTips(username)
    }, [fetchDrivingTips, username]) //runs only once with empty dependencies

    //Load Again
    useEffect(() => {
        if (!loadAgain)
            return;

        console.log("Fetching driving tips")
        fetchDrivingTips(username)
        setLoadAgain(false);
    }, [fetchDrivingTips, loadAgain, username])

    //Write to sessionStorage
    useEffect(() => {
        console.log("Writing driving tips to storage")
        sessionStorage.setItem(`drivingTips-${username}`, JSON.stringify(state))
    }, [state, username])

    return {state, loading, errorNotification, setLoadAgain}
}