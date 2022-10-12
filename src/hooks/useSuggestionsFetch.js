import {useCallback, useEffect, useState} from "react";
import {APIProxy} from "../apis/APIProxy";

export const useSuggestionsFetch = (city, textJSON) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const apiProxy = APIProxy.getInstance()

    const fetchSuggestions = useCallback(async (text) => {
        try {
            const result = await apiProxy.fetchAutocompleteSuggestion(text, textJSON)
            if (result.error === false) {
                setSuggestions(result.result)
            }
        } catch (error) {
        }
    }, [apiProxy, textJSON])

    useEffect(() => {
        if (city !== '' && showSuggestions) {
            fetchSuggestions(city)
        } else {
            setSuggestions([])
        }
    }, [city, fetchSuggestions, showSuggestions])

    return {suggestions, setShowSuggestions}
}