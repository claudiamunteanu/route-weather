import {useCallback, useEffect, useState} from "react";
import {APIProxy} from "../apis/APIProxy";
import {isPersistedSessionStorageState} from "../helpers";

const initialState = {
    filteredData: [],
    avgData: []
};

const notificationState = {
    isError: false,
    message: '',
}

export const useHistoricalDataFetch = (text) => {
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [errorNotification, setErrorNotification] = useState(notificationState);

    const [city, setCity] = useState('')
    const [startDate, setStartDate] = useState(0)
    const [endDate, setEndDate] = useState(0)

    const apiProxy = APIProxy.getInstance()

    const fetchHistoricalData = useCallback(async (city, startDate, endDate) => {
        try {
            const language = sessionStorage.getItem("language")
            const result = await apiProxy.fetchHistoricalForecast(city, startDate, endDate, text, language);
            console.log(result)
            if(result.error === false){
                const data = result.result
                const filteredData = apiProxy.sixHourData(data)
                const avgData = apiProxy.averageValuesHistoricalData(data)
                setErrorNotification({
                    isError: false,
                    message: ''
                })
                setState({
                    filteredData: filteredData,
                    avgData: avgData
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
        } finally {
            setLoading(false)
            setLoad(false)
        }
    }, [apiProxy, text]);
    
    //Load
    useEffect(() => {
        console.log("Statistics load")
        if(!load){
            return;
        }
        setLoading(true)
        setState(initialState)
        const sessionState = isPersistedSessionStorageState(`historicalData-${city}-${startDate}-${endDate}-${text?.lang}`)
        if (sessionState) {
            setLoad(false)
            setLoading(false)
            setState(sessionState)
            return;
        }

        console.log("Fetching historical data")
        fetchHistoricalData(city,startDate, endDate)
    }, [city, endDate, fetchHistoricalData, load, startDate, text?.lang])
    
    //Write to sessionStorage
    useEffect(() => {
        if(state.filteredData.length!==0 && state.avgData.length!==0) {
            console.log("Writing historical data to storage")
            sessionStorage.setItem(`historicalData-${city}-${startDate}-${endDate}-${text?.lang}`, JSON.stringify(state))
        }
    }, [city, endDate, startDate, state, text?.lang])

    return {state, loading, errorNotification, setLoad, setCity, setStartDate, setEndDate}
}