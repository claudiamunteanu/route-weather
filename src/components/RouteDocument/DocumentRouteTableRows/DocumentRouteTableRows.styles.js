import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        height: 49,
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'Open-Sans',
        backgroundColor: '#ffffff',
    },
    cityName: {
        width: '17%',
    },
    time: {
        width: '12.5%',
    },
    temp: {
        width: '12.5%',
    },
    icon: {
        width: '8%',
    },
    weather: {
        width: '14%',
    },
    clouds: {
        width: '10%',
    },
    wind: {
        width: '16%',
    },
    precip: {
        width: '10%',
    },
});