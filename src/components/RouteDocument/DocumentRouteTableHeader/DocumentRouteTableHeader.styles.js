import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 30,
        textAlign: 'center',
        fontWeight: 'semibold',
        flexGrow: 1,
        fontFamily: 'Open-Sans'
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