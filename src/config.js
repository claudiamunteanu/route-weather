const PROXY = `PROXY_URL`;

const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;


const WEATHER_API_URL = 'http://pro.openweathermap.org/data/2.5'
const HISTORY_WEATHER_API_URL = 'http://history.openweathermap.org/data/2.5'
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY
const WEATHER_ICON_URL = 'http://openweathermap.org/img/wn/'

const SERVER_URL = 'http://localhost:8080/prognozaMeteo';

export {
    GOOGLE_API_URL,
    GOOGLE_API_KEY,
    WEATHER_API_URL,
    HISTORY_WEATHER_API_URL,
    WEATHER_API_KEY,
    WEATHER_ICON_URL,
    SERVER_URL,
    PROXY
};
