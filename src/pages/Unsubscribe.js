import {useCallback, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {APIProxy} from "../apis/APIProxy";

const Unsubscribe = ({text}) => {
    const apiProxy = APIProxy.getInstance()
    const [searchParams] = useSearchParams();
    const startCity = searchParams.get('startingCity');
    const destCity = searchParams.get('destinationCity');
    const emailAddress = searchParams.get('email');
    const hash = searchParams.get('hash');

    let navigate = useNavigate()
    const notify = useCallback((notification) => {
        if (notification.error) {
            toast.error(notification.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.success(notification.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setTimeout(() => {
            navigate("/")
        }, 3000);
    },[navigate])

    // Initial
    useEffect(() => {
        console.log("Unsubscribing...")

        const language = sessionStorage.getItem("language")
        apiProxy.unsubscribeFromRoute(startCity, destCity, emailAddress, hash, text, language)
            .then(result => {
                notify(result)
            });

    }, [apiProxy, destCity, emailAddress, hash, notify, startCity, text])
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default Unsubscribe