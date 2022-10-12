import {useEffect, useState} from "react";
import {APIProxy} from "../apis/APIProxy";

export const useTextFetch = (language) => {
    const [text, setText] = useState(null);
    const apiProxy = APIProxy.getInstance()


    useEffect(() => {
        apiProxy.fetchText(language).then(result => setText(result))
    }, [apiProxy, language])

    return {text}
}