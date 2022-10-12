import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {GlobalStyle} from "./GlobalStyle";
import './components/Modals/ConfirmModal/ConfirmModal.styles.css';

import Home from "./pages/Home";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import ShowRoute from "./pages/ShowRoute";
import Unsubscribe from "./pages/Unsubscribe";
import Login from "./pages/Login";
import UserProvider from "./context";
import MyAccount from "./pages/MyAccount";
import Statistics from "./pages/Statistics";
import NewAccount from "./pages/NewAccount";
import {useTextFetch} from "./hooks/useTextFetch";

const App = () => {

    document.title = "RouteWeather"

    if(!sessionStorage.getItem('language')){
        sessionStorage.setItem('language', 'english')
    }
    const [language, setLanguage] = useState(sessionStorage.getItem('language'))

    const {text} = useTextFetch(language)

    if(!sessionStorage.getItem('temperature')){
        sessionStorage.setItem('temperature', '°C')
    }
    if(!sessionStorage.getItem('precipitation')){
        sessionStorage.setItem('precipitation', 'mm')
    }
    if(!sessionStorage.getItem('windSpeed')){
        sessionStorage.setItem('windSpeed', 'km/h')
    }
    if(!sessionStorage.getItem('pressure')){
        sessionStorage.setItem('pressure', 'hPa')
    }
    const [temperature, setTemperature] = useState(sessionStorage.getItem('temperature'))
    const [precipitation, setPrecipitation] = useState(sessionStorage.getItem('precipitation'))
    const [windSpeed, setWindSpeed] = useState(sessionStorage.getItem('windSpeed'))
    const [pressure, setPressure] = useState(sessionStorage.getItem('pressure'))

    return (
        <Router>
            <UserProvider>
                <TopBar text={text}
                        language={language}
                        setLanguage={setLanguage}
                        temperature={temperature}
                        setTemperature={setTemperature}
                        precipitation={precipitation}
                        setPrecipitation={setPrecipitation}
                        windSpeed={windSpeed}
                        setWindSpeed={setWindSpeed}
                        pressure={pressure}
                        setPressure={setPressure}
                />
                {text &&
                    <Routes>
                        <Route path='/' element={<Home text={text}/>}/>
                        <Route path='/route' element={<ShowRoute temperatureUnit={temperature} pressureUnit={pressure} windSpeedUnit={windSpeed} precipUnit={precipitation} text={text}/>}/>
                        <Route path='/unsubscribe' element={<Unsubscribe text={text}/>}/>
                        <Route path={'/login'} element={<Login text={text}/>}/>
                        <Route path={'/newAccount'} element={<NewAccount text={text}/>}/>
                        <Route path={'/myAccount'} element={<MyAccount text={text}/>}/>
                        <Route path={'/statistics'} element={<Statistics temperatureUnit={temperature} pressureUnit={pressure} windSpeedUnit={windSpeed} precipUnit={precipitation} text={text}/>}/>
                    </Routes>
                }
                <Footer/>
                <div id="popup-root" />
                <GlobalStyle/>
            </UserProvider>
        </Router>
    )
}

export default App;
