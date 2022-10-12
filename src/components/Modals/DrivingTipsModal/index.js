import React, {useCallback, useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import './DrivingTipsModal.styles.css'
import {useUserDrivingTipsWithWeatherTypesFetch} from "../../../hooks/useUserDrivingTipsWithWeatherTypesFetch";
import {Carousel} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import Spinner from "../../Spinner";
import PropTypes from "prop-types";

const contentStyle = {};
const overlayStyle = {background: 'rgba(0,0,0,0.5)'};
const arrowStyle = {color: '#000'};


const DrivingTipsModal = ({text, user, weatherTypes}) => {
    const [open, setOpen] = useState(false);

    const {state, loading, errorNotification} = useUserDrivingTipsWithWeatherTypesFetch(user?.username, text, weatherTypes);

    const showErrorToast = useCallback((message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, [])

    useEffect(()=>{
        if(errorNotification.isError){
            showErrorToast(errorNotification.message)
        }
    }, [errorNotification.isError, errorNotification.message, showErrorToast])

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
            <Popup
                trigger={<button className="trigger-button"  onClick={() => {
                    setOpen(true); console.log(weatherTypes)
                }}>{text?.showRoute.seeDrivingTips}</button>}
                open={open}
                modal
                nested
                contentStyle={contentStyle}
                overlayStyle={overlayStyle}
                arrowStyle={arrowStyle}
                closeOnDocumentClick={true}
                onClose={() => setOpen(false)}
            >
                {close => (
                    <div className="modal-content">
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="text-content">
                            <div className="header"> {text?.drivingTips.title} </div>
                            {loading && <Spinner/>}
                            <div className="content">
                                {
                                    state.drivingTips && Array.from(state?.drivingTips).map(([key, value]) => {
                                        return <>
                                            <h4>{text?.weatherTypes[key.toLowerCase()]}</h4>
                                            <Carousel>
                                                {
                                                    value.map(tip => {
                                                        return  <Carousel.Item>
                                                            <div className="image"/>
                                                            <Carousel.Caption>
                                                                <h3>{tip.text}</h3>
                                                            </Carousel.Caption>
                                                        </Carousel.Item>
                                                    })
                                                }
                                            </Carousel>
                                        </>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </>
    )
}

DrivingTipsModal.propTypes = {
    text: PropTypes.object,
    user: PropTypes.object,
    weatherTypes: PropTypes.array
}

export default DrivingTipsModal