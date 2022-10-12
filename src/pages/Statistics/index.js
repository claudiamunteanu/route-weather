import {Content, Wrapper} from "./Statistics.styles";
import {useCallback, useEffect, useState} from "react";
import {
    celsiusToFahrenheit, meterPerSecToKmPerHour, meterPerSecToMilesPerHour, mmToIn,
    timestampToDate,
    weekBeginning
} from "../../helpers";
import Button from "../../components/Button";
import {useSuggestionsFetch} from "../../hooks/useSuggestionsFetch";
import {toast, ToastContainer} from "react-toastify";
import {
    CartesianGrid,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Label,
    ReferenceArea,
    Area,
    AreaChart,
    Line,
    Legend,
    BarChart, Bar
} from "recharts";
import Table from "../../components/Table";
import {useHistoricalDataFetch} from "../../hooks/useHistoricalDataFetch";
import Spinner from "../../components/Spinner";
import PropTypes from "prop-types";

const Statistics = ({text, temperatureUnit, windSpeedUnit, pressureUnit, precipUnit}) => {
    const [cityInput, setCityInput] = useState('')
    const [cityTitle, setCityTitle] = useState('')

    const {
        state,
        loading,
        errorNotification,
        setLoad,
        setCity,
        setStartDate,
        setEndDate
    } = useHistoricalDataFetch(text);

    const [temperatures, setTemperatures] = useState([])
    const [rainVolumes, setRainVolumes] = useState([])
    const [windSpeeds, setWindSpeeds] = useState([])

    const suggestions = useSuggestionsFetch(cityInput, text);

    const [cityIsSelected, setCityIsSelected] = useState(false)

    const [seeTemp, setSeeTemp] = useState(true)
    const [seeWind, setSeeWind] = useState(true)
    const [seeHumidity, setSeeHumidity] = useState(true)
    const [seeRain, setSeeRain] = useState(true)
    const [seeAvg, setSeeAvg] = useState(true)

    const [columns, setColumns] = useState([]);

    const handleSuggestion = (text) => {
        setCityInput(text)
        suggestions.setShowSuggestions(false)
        setCityIsSelected(true)
    }

    const handleInput = e => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        switch (name) {
            case 'city':
                setCityInput(value);
                suggestions.setShowSuggestions(true)
                setCityIsSelected(false)
                break;
            default:
                break;
        }
    };

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

    const handleGetStatistics = () => {
        const now = Math.round(Date.now() / 1000);
        const endDate = now - now % 3600;
        setEndDate(endDate);
        setStartDate(weekBeginning(endDate))
        setLoad(true)
        setCity(cityInput)
        setCityTitle(cityInput)
    }

    useEffect(() => {
        if (errorNotification.isError) {
            showErrorToast(errorNotification.message)
        }
    }, [errorNotification.isError, errorNotification.message, showErrorToast])

    useEffect(() => {
        if (temperatureUnit === '°F') {
            setTemperatures(() => state.filteredData.map(entry => {
                return {
                    "temp": celsiusToFahrenheit(entry.temp),
                    "hour": entry.hour
                }
            }))
        } else {
            setTemperatures(() => state.filteredData.map(entry => {
                return {
                    "temp": entry.temp,
                    "hour": entry.hour
                }
            }))
        }
    }, [state.filteredData, temperatureUnit])

    useEffect(() => {
        if (precipUnit === 'in') {
            setRainVolumes(() => state.filteredData.map(entry => {
                return {
                    "rain": mmToIn(entry.rain),
                    "hour": entry.hour
                }
            }))
        } else {
            setRainVolumes(() => state.filteredData.map(entry => {
                return {
                    "rain": entry.rain,
                    "hour": entry.hour
                }
            }))
        }
    }, [precipUnit, state.filteredData])

    useEffect(() => {
        switch (windSpeedUnit){
            case 'km/h':{
                setWindSpeeds(() => state.filteredData.map(entry => {
                    return {
                        "wind_speed": meterPerSecToKmPerHour(entry.wind_speed),
                        "hour": entry.hour
                    }
                }))
                break;
            }
            case 'mph':{
                setWindSpeeds(() => state.filteredData.map(entry => {
                    return {
                        "wind_speed": meterPerSecToMilesPerHour(entry.wind_speed),
                        "hour": entry.hour
                    }
                }))
                break;
            }
            default:{
                setWindSpeeds(() => state.filteredData.map(entry => {
                    return {
                        "wind_speed": entry.wind_speed,
                        "hour": entry.hour
                    }
                }))
                break;
            }
        }
    }, [state.filteredData, windSpeedUnit])

    const setReferenceAreas = () => {
        let x1 = 0;
        let x2 = 0;
        let k = 0;
        const referenceAreas = state.filteredData.map((entry, index) => {
            if (entry.hour === 6) {
                x1 = index;
            } else if (entry.hour === 18) {
                x2 = index;
                const returnValue = (<ReferenceArea key={k} x1={x1} x2={x2} strokeDasharray="3 3" fill="yellow">
                    <Label value={entry.day + " " + timestampToDate(entry.dt)} offset={10} position="top"/>
                </ReferenceArea>)
                x1 = 0
                x2 = 0
                k += 1;
                return returnValue
            }
        })
        if (x1 !== 0) {
            x2 = state.filteredData.length - 1
            referenceAreas.push((<ReferenceArea key={k} x1={x1} x2={x2} strokeDasharray="3 3" fill="yellow">
                <Label value={state.filteredData[x2].day + " " + timestampToDate(state.filteredData[x2].dt)} offset={10}
                       position="top"/>
            </ReferenceArea>))
        }
        return referenceAreas
    }

    useEffect(() => {
        if (text !== null) {
            setColumns([
                {heading: text?.statistics.headers.date, value: 'day'},
                {heading: text?.statistics.headers.weather, value: 'weather'},
                {heading: text?.statistics.headers.temp, value: 'temp'},
                {heading: text?.statistics.headers.minTemp, value: 'temp_min'},
                {heading: text?.statistics.headers.maxTemp, value: 'temp_max'},
                {heading: text?.statistics.headers.clouds, value: 'clouds'},
                {heading: text?.statistics.headers.wind, value: 'wind_speed'},
                {heading: text?.statistics.headers.rain, value: 'rain'},
                {heading: text?.statistics.headers.humidity, value: 'humidity'},
                {heading: text?.statistics.headers.pressure, value: 'pressure'}
            ])
        }
    }, [text])

    document.title = "City Statistics"

    return (
        <Wrapper>
            {text &&
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
                    <h3>{text?.statistics.title}</h3>
                    <div className="cityGroup">
                        <label>{text?.city}:</label>
                        <input
                            type='text'
                            value={cityInput}
                            name='city'
                            onChange={handleInput}
                            placeholder={text?.city}
                        />
                        <div className="suggestions">
                            {suggestions.suggestions && suggestions.suggestions.map((suggestion, i) =>
                                <div className="suggestion"
                                     id={"suggestion-" + (i + 1)}
                                     key={i}
                                     onClick={() => handleSuggestion(suggestion.terms[0].value)}
                                >
                                    {suggestion.description}
                                </div>
                            )}
                        </div>
                    </div>
                    <Button name="submitButton" text={text?.statistics.button} callback={() => {
                        handleGetStatistics()
                    }} isEnabled={cityIsSelected} className="submitButton"/>
                    {loading && <Spinner/>}
                    <div className="results">
                        {state.filteredData.length !== 0 &&
                            <>
                                <h3>{text?.statistics.checkDataTitle}</h3>
                                <ul className="categories-list">
                                    <li key={0}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-0`}
                                                name="temp"
                                                value={seeTemp}
                                                checked={seeTemp}
                                                onChange={() => setSeeTemp(prev => !prev)}
                                            />
                                            <label
                                                htmlFor={`checkbox-0`}>{text?.statistics.dataCategories.temperature}</label>
                                        </div>
                                    </li>
                                    <li key={1}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-1`}
                                                name="wind_speed"
                                                value={seeWind}
                                                checked={seeWind}
                                                onChange={() => setSeeWind(prev => !prev)}
                                            />
                                            <label
                                                htmlFor={`checkbox-1`}>{text?.statistics.dataCategories.wind}</label>
                                        </div>
                                    </li>
                                    <li key={2}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-2`}
                                                name="humidity"
                                                value={seeHumidity}
                                                checked={seeHumidity}
                                                onChange={() => setSeeHumidity(prev => !prev)}
                                            />
                                            <label
                                                htmlFor={`checkbox-2`}>{text?.statistics.dataCategories.humidity}</label>
                                        </div>
                                    </li>
                                    <li key={3}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-3`}
                                                name="rain"
                                                value={seeRain}
                                                checked={seeRain}
                                                onChange={() => setSeeRain(prev => !prev)}
                                            />
                                            <label
                                                htmlFor={`checkbox-3`}>{text?.statistics.dataCategories.rain}</label>
                                        </div>
                                    </li>
                                    <li key={4}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-4`}
                                                name="avg"
                                                value={seeAvg}
                                                checked={seeAvg}
                                                onChange={() => setSeeAvg(prev => !prev)}
                                            />
                                            <label
                                                htmlFor={`checkbox-4`}>{text?.statistics.dataCategories.avgData}</label>
                                        </div>
                                    </li>
                                </ul>
                                <div className="results">

                                </div>
                                <h3 className="title">{text?.statistics.subtitle1} {cityTitle}</h3>
                                <div className="graphs">
                                    {seeTemp && <AreaChart
                                        width={1080}
                                        height={320}
                                        data={temperatures}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 10,
                                            bottom: 40
                                        }}
                                        className="graph"
                                    >
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="50%" stopColor="#32CD32" stopOpacity={0.8}/>
                                                <stop offset="100%" stopColor="#00BFFF" stopOpacity={0.8}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        {setReferenceAreas()}
                                        <XAxis dataKey="hour"
                                               label={{
                                                   value: `${text?.statistics.hours}`,
                                                   position: 'bottom',
                                                   textAnchor: 'middle'
                                               }}/>
                                        <YAxis label={{
                                            value: `${text?.statistics.temperatures} ${temperatureUnit}`,
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle'
                                        }}/>
                                        <Tooltip/>
                                        <Legend align="left"/>
                                        <Area type="monotone"
                                              dataKey="temp"
                                              stroke="red" fillOpacity={1}
                                              fill="url(#colorTemp)"/>
                                    </AreaChart>}
                                </div>
                                <div className="graphs">
                                    {seeWind && <LineChart
                                        width={535}
                                        height={320}
                                        data={windSpeeds}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 5,
                                            bottom: 40
                                        }}
                                        className="graph"
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        {setReferenceAreas()}
                                        <XAxis dataKey="hour"
                                               label={{
                                                   value: `${text?.statistics.hours}`,
                                                   position: 'bottom',
                                                   textAnchor: 'middle'
                                               }}/>
                                        <YAxis label={{
                                            value: `${text?.statistics.windSpeed} ${windSpeedUnit}`,
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle'
                                        }}
                                        dataKey="wind_speed"/>
                                        <Tooltip/>
                                        <Legend align="left"/>
                                        <Line type="monotone" dataKey="wind_speed" stroke="gray"/>
                                    </LineChart>}
                                    {seeHumidity && <LineChart
                                        width={535}
                                        height={320}
                                        data={state.filteredData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 5,
                                            bottom: 40
                                        }}
                                        className="graph"
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        {setReferenceAreas()}
                                        <XAxis dataKey="hour"
                                               label={{
                                                   value: `${text?.statistics.hours}`,
                                                   position: 'bottom',
                                                   textAnchor: 'middle'
                                               }}/>
                                        <YAxis label={{
                                            value: `${text?.statistics.humidity} %`,
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle'
                                        }}/>
                                        <Tooltip/>
                                        <Legend align="left"/>
                                        <Line type="monotone" dataKey="humidity" stroke="orange"/>
                                    </LineChart>}
                                </div>
                                <div className="graphs">
                                    {seeRain && <BarChart
                                        width={1080}
                                        height={320}
                                        data={rainVolumes}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 5,
                                            bottom: 40
                                        }}
                                        className="graph"
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        {setReferenceAreas()}
                                        <XAxis dataKey="hour"
                                               label={{
                                                   value: `${text?.statistics.hours}`,
                                                   position: 'bottom',
                                                   textAnchor: 'middle'
                                               }}/>
                                        <YAxis label={{
                                            value: `${text?.statistics.rainVolume} ${precipUnit}`,
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle'
                                        }}/>
                                        <Tooltip/>
                                        <Legend align="left"/>
                                        <Bar dataKey="rain" fill="#1B98E0"/>
                                    </BarChart>}
                                </div>
                            </>
                        }
                        {state.avgData.length !== 0 && seeAvg && <div className="averageTable">
                            <h3 className="title">{text?.statistics.subtitle3}</h3>
                            <Table temperatureUnit={temperatureUnit} pressureUnit={pressureUnit}
                                   windSpeedUnit={windSpeedUnit} precipUnit={precipUnit} data={state.avgData}
                                   column={columns} text={text}/>
                        </div>}
                    </div>
                </Content>
            }
        </Wrapper>
    )
}

Statistics.propTypes = {
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string,
    pressureUnit: PropTypes.string,
    precipUnit: PropTypes.string
}

export default Statistics