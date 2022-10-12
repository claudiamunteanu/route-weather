import React from 'react';
import {View } from '@react-pdf/renderer';
import {styles} from "./DocumentRouteTable.styles";
import DocumentRouteTableHeader from "../DocumentRouteTableHeader";
import DocumentRouteTableRows from "../DocumentRouteTableRows";
import PropTypes from "prop-types";

const DocumentRouteTable = ({text, data, routeIndex, temperatureUnit, windSpeedUnit}) => {
    return (
        <View style={styles.tableContainer}>
            <DocumentRouteTableHeader text={text}/>
            <DocumentRouteTableRows temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} items={data.routes[routeIndex]?.route.routeForecast}/>
        </View>
    )
};

DocumentRouteTable.propTypes = {
    data: PropTypes.object,
    text: PropTypes.object,
    routeIndex: PropTypes.number,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default DocumentRouteTable