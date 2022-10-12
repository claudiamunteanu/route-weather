import React, { Fragment } from 'react';
import {Text, View} from '@react-pdf/renderer';
import {timestampToFormattedDateTime} from "../../../helpers";
import {styles} from "./DocumentRouteData.styles";
import PropTypes from "prop-types";


const DocumentRouteData = ({data, text}) => (
    <Fragment>
        <View style={styles.startingCityContainer}>
            <Text style={styles.label}>{text?.routePDF.startingCityPrompt} </Text>
            <Text style={styles.text}>{data.startCity}</Text>
        </View >
        <View style={styles.destinationCityContainer}>
            <Text style={styles.label}>{text?.routePDF.destinationCityPrompt} </Text>
            <Text style={styles.text}>{data.destCity}</Text>
        </View >
        <View style={styles.startingTimeContainer}>
            <Text style={styles.label}>{text?.routePDF.startingTimePrompt} </Text>
            <Text style={styles.text}>{timestampToFormattedDateTime(data.startDate)}</Text>
        </View >
        <View style={styles.modeContainer}>
            <Text style={styles.label}>{text?.routePDF.mode} </Text>
            <Text style={styles.text}>{text?.modeOfTransport[data.mode]}</Text>
        </View >
    </Fragment>
);

DocumentRouteData.propTypes = {
    data: PropTypes.object,
    text: PropTypes.object
}

export default DocumentRouteData