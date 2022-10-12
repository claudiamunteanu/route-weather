import React, {useState} from "react";
import {GiPositionMarker} from 'react-icons/gi'
import {Wrapper} from './Marker.styles'
import InfoWindow from "../InfoWindow";
import {useLayer} from "react-laag";
import PropTypes from "prop-types";

function Marker({ text, location, columns, temperatureUnit, windSpeedUnit }) {
    const [isOpen, setOpen] = useState(false);
    const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
        isOpen,
        triggerOffset: 57,
        auto: true,
        overflowContainer: false,
        onOutsideClick: () => setOpen(false)
    });
    const onClick = () => setOpen((prev) => !prev);
    return (
        <>
            <Wrapper
                {...triggerProps}
                onClick={onClick}
            >
                <GiPositionMarker className="icon"/>
            </Wrapper>
            {isOpen &&
                renderLayer(
                    <InfoWindow text={text} temperatureUnit={temperatureUnit} windSpeedUnit={windSpeedUnit} location={location} arrowProps={arrowProps} layerProps={layerProps} columns={columns} buttonCallback={onClick}/>
                )}
        </>
    );
}

Marker.propTypes = {
    text: PropTypes.object,
    location: PropTypes.object,
    columns: PropTypes.array,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default Marker
