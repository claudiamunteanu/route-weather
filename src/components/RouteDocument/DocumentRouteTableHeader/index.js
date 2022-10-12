import React from 'react';
import {Text, View } from '@react-pdf/renderer';
import {styles} from "./DocumentRouteTableHeader.styles";
import PropTypes from "prop-types";

const DocumentRouteTableHeader = ({text}) => (
    <View style={styles.container} fixed>
        <Text style={styles.cityName}>{text?.headers.cityName}</Text>
        <Text style={styles.time}>{text?.headers.time}</Text>
        <Text style={styles.temp}>Temp.</Text>
        <Text style={styles.icon}/>
        <Text style={styles.weather}>{text?.statistics.headers.weather}</Text>
        <Text style={styles.clouds}>{text?.headers.clouds}</Text>
        <Text style={styles.wind}>{text?.headers.wind}</Text>
        <Text style={styles.precip}>Precip.</Text>
    </View>
);

DocumentRouteTableHeader.propTypes = {
        text: PropTypes.object
}

export default DocumentRouteTableHeader