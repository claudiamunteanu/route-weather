import React from 'react';
import {Page, Text, View, Document, Image, Font} from '@react-pdf/renderer';
import logo from '../../images/logo.png'
import OpenSans from "../../fonts/open-sans/OpenSans-Regular.ttf";
import OpenSansSemiBold from "../../fonts/open-sans/OpenSans-Semibold.ttf";
import {styles} from "./RouteDocument.styles";
import DocumentTitle from "./DocumentTitle";
import DocumentRouteData from "./DocumentRouteData";
import DocumentRouteTable from "./DocumentRouteTable";
import PropTypes from "prop-types";

Font.register({
    family: 'Open-Sans',
    fonts: [
        {src: OpenSans},
        {src: OpenSansSemiBold, fontWeight: 'semibold'}
    ]
});

const RouteDocument = ({data, routeIndex, text, temperatureUnit, windSpeedUnit}) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo}/>
                <DocumentTitle title={text?.routePDF.title}/>
                <DocumentRouteData data={data} text={text}/>
                <DocumentRouteTable temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} text={text} data={data} routeIndex={routeIndex}/>
                <View style={styles.pageNumberContainer} fixed>
                    <Text render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )
                    } fixed />
                </View>
            </Page>
        </Document>
)

RouteDocument.propTypes = {
    data: PropTypes.object,
    routeIndex: PropTypes.number,
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default RouteDocument