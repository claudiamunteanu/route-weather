import React, {Fragment} from 'react';
import {Text, View, Image} from '@react-pdf/renderer';
import {
    celsiusToFahrenheit,
    meterPerSecToKmPerHour,
    meterPerSecToMilesPerHour,
    timestampToFormattedDateTime
} from "../../../helpers";
import {WEATHER_ICON_URL} from "../../../config";
import {styles} from "./DocumentRouteTableRows.styles";
import PropTypes from "prop-types";

const DocumentRouteTableRows = ({items, temperatureUnit, windSpeedUnit}) => {
    const rows = items?.map((item, index) => {
            let url = `${WEATHER_ICON_URL}${item.forecast.weather[0].icon}@2x.png`
            let temperature = item.forecast.main.temp
            if(temperatureUnit === '°F')
                temperature = celsiusToFahrenheit(temperature)

            let windSpeed = item.forecast.wind.speed
            switch (windSpeedUnit){
                case 'km/h':
                    windSpeed = meterPerSecToKmPerHour(windSpeed)
                    break
                case 'mph':
                    windSpeed = meterPerSecToMilesPerHour(windSpeed)
                    break
                default:
                    break
            }
            return (
                <View style={styles.row} key={index}>
                    <Text style={styles.cityName}>{item.city.name}</Text>
                    <Text style={styles.time}>{timestampToFormattedDateTime(item.time)}</Text>
                    <Text style={styles.temp}>{temperature + temperatureUnit}</Text>
                    <Image style={styles.icon} src={url}/>
                    <Text style={styles.weather}>{item.forecast.weather[0].description}</Text>
                    <Text style={styles.clouds}>{item.forecast.clouds.all + '%'}</Text>
                    <Text style={styles.wind}>{windSpeed + " " + windSpeedUnit}</Text>
                    <Text style={styles.precip}>{Math.round(item.forecast.pop * 100) + '%'}</Text>
                </View>
            )
        }
    )
    return (<Fragment>{rows}</Fragment>)
};

DocumentRouteTableRows.propTypes = {
    items: PropTypes.array,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default DocumentRouteTableRows