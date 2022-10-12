import React from 'react';
import {Text, View } from '@react-pdf/renderer';
import {styles} from "./DocumentTitle.styles";
import PropTypes from "prop-types";

const DocumentTitle = ({title}) => (
    <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{title}</Text>
    </View>
);

DocumentTitle.propTypes = {
    title: PropTypes.string
}

export default DocumentTitle