import {useEffect, useState, useContext, useCallback} from "react";
import {Content, Wrapper} from "./ShowRoute.styles";
import {useSearchParams} from "react-router-dom";
import {useRouteDataFetch} from "../../hooks/useRouteDataFetch";
import Table from "../../components/Table";
import {BsTable, BsMap} from "react-icons/bs";
import Map from "../../components/Map";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BlobProvider} from '@react-pdf/renderer';
import RouteDocument from "../../components/RouteDocument/RouteDocument";
import DrivingTipsModal from "../../components/Modals/DrivingTipsModal";
import {Context} from "../../context";
import {isPersistedLocalStorageState} from "../../helpers";
import Spinner from "../../components/Spinner";
import PropTypes from "prop-types";

const ShowRoute = ({text, temperatureUnit, windSpeedUnit}) => {
    const [searchParams] = useSearchParams();
    const startCity = searchParams.get('startCity');
    const destCity = searchParams.get('destCity');
    const startDate = searchParams.get('startDate');
    const mode = searchParams.get('mode');
    const emailAddress = searchParams.get('emailAddress');
    const startTime = searchParams.get('startTime');
    const frequency = searchParams.get('frequency');

    const {
        state,
        loading,
        notification
    } = useRouteDataFetch(startCity, destCity, startDate, mode, emailAddress, startTime, frequency, text);

    const [routeIndex, setRouteIndex] = useState(0)
    const [displayMode, setDisplayMode] = useState('table');
    const [displayRoute, setDisplayRoute] = useState(<div/>);
    const [columns, setColumns] = useState([]);

    const [user, setUser] = useContext(Context)

    const getUserFromLocalStorage = useCallback(() => {
        setUser(isPersistedLocalStorageState('user'));
    }, [setUser])

    useEffect(() => {
        if(text !==null){
            setColumns( [
                {heading: text.headers.cityName, value: 'city.name'},
                {heading: text.headers.time, value: 'time'},
                {heading: 'Temp.', value: 'forecast.main.temp'},
                {heading: '', value: 'forecast.weather[0].icon'},
                {heading: text.headers.weather, value: 'forecast.weather[0].description'},
                {heading: text.headers.clouds, value: 'forecast.clouds.all'},
                {heading: text.headers.wind, value: 'forecast.wind.speed'},
                {heading: 'Precip.', value: 'forecast.pop'}
            ])
        }
    }, [text])
    
    useEffect(() => {
        if (user === undefined || user === null)
            getUserFromLocalStorage()
    }, [getUserFromLocalStorage, user])

    const handleChange = e => {
        const value = e.target.value;
        const name = e.target.name;

        switch (name) {
            case 'displayMode':
                setDisplayMode(value);
                break;
            case 'routeOption':
                setRouteIndex(parseInt(value));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        switch (displayMode) {
            case 'table':
                setDisplayRoute(<Table temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} text={text} data={state.routes[routeIndex]?.route.routeForecast} column={columns}/>);
                break;
            case 'map':
                setDisplayRoute(<Map temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} text={text} route={state.routes[routeIndex]} columns={columns}/>);
                break;
            default:
                setDisplayRoute(<Table temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} text={text} data={state.routes[routeIndex]?.route.routeForecast} column={columns}/>);
                break;
        }
    }, [routeIndex, displayMode, state.routes, columns, temperatureUnit, windSpeedUnit, text])

    useEffect(() => {
        if (notification.isError) {
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
            if (notification.message !== '') {
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
        }
    }, [notification])

    return (
        <>
            <Wrapper> {
                text &&
                <Content>
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
                    <div className="buttons-group">
                        <label>
                            <input type="radio" name="displayMode" value="table" onChange={handleChange}
                                   checked={displayMode === 'table'}/>
                            <BsTable className="icon"/>
                        </label>
                        <label>
                            <input type="radio" name="displayMode" value="map" onChange={handleChange}
                                   checked={displayMode === 'map'}/>
                            <BsMap className="icon"/>
                        </label>
                        {state.routes[routeIndex]?.route.routeForecast &&
                            <BlobProvider document={<RouteDocument temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} text={text} data={state} routeIndex={routeIndex}/>}>
                                {({url}) => (
                                    <a className="buttonLink" name="generatePDFButton" href={url} target="_blank" rel="noopener noreferrer">
                                        {text?.showRoute.generatePDF}
                                    </a>
                                )}
                            </BlobProvider>
                        }
                        {state.routes[routeIndex]?.route.weatherTypes && user &&
                            <DrivingTipsModal text={text} user={user}
                                              weatherTypes={state.routes[routeIndex]?.route.weatherTypes}/>}
                    </div>
                    {loading && <Spinner name="spinner"/>}
                    <div className="routes">
                        {
                            state.routes.map(route => {
                                    let duration = route.duration
                                        .replace("hours",text.showRoute.hours)
                                        .replace("hour",text.showRoute.hour)
                                        .replace("mins",text.showRoute.minutes)
                                        .replace("min",text.showRoute.minute)
                                    return (
                                        <label key={route.id} id={"route-"+(route.id+1)}>
                                            <input key={route.id} type="radio" name="routeOption" value={route.id}
                                                   onChange={handleChange}
                                                   checked={routeIndex === route.id}/>
                                            <div className="description">
                                                <b>{route.summary}</b>; {route.distance}; {text.showRoute.approximately} {duration}
                                            </div>
                                        </label>
                                    )
                                }
                            )
                        }
                    </div>
                    {displayRoute}
                </Content>
            }
            </Wrapper>
        </>
    )
}

ShowRoute.propTypes = {
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string,
}

export default ShowRoute;