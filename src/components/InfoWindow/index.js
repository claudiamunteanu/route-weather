import {Wrapper} from "./InfoWindow.styles";
import {Arrow} from "react-laag";
import Table from "../Table";
import PropTypes from "prop-types";

const InfoWindow = ({text, location, arrowProps, layerProps, columns, buttonCallback, temperatureUnit, windSpeedUnit}) => {
    return (
        <Wrapper name = {location.city.name} {...layerProps}>
            <button onClick={buttonCallback}>X</button><br/>
            <b>{text?.city}:</b> {location.city.name} <br/>
            <span><b>{text?.placeData.county}:</b> {location.city.county} <br/> </span>
            <b>{text?.placeData.latitude}:</b> {location.city.latitude} <br/>
            <b>{text?.placeData.longitude}:</b> {location.city.longitude}
            <Table text={text} temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} data={[location]} column={columns.filter((column, index) => index > 0)}/>
            <Arrow {...arrowProps}/>
        </Wrapper>
    )
}

InfoWindow.propTypes = {
    text: PropTypes.object,
    location: PropTypes.object,
    arrowProps: PropTypes.object,
    layerProps: PropTypes.object,
    columns: PropTypes.array,
    buttonCallback: PropTypes.func,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default InfoWindow