import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 55,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    logo: {
        width: 120,
        height: 33,
    },
    pageNumberContainer:{
        position: 'absolute',
        bottom:20,
        left: '50%',
        right: '50%',
    }
});