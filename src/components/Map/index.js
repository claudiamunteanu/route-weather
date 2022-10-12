import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';
import {Content, Wrapper} from './Map.styles'
import Marker from "../Marker";
import {GOOGLE_API_KEY} from "../../config";
import decodePolyline from 'decode-google-map-polyline'
import PropTypes from "prop-types";

function Map({route, columns,text, temperatureUnit, windSpeedUnit}) {
    const [coordinates, setCoordinates] = useState([45.65, 25.6]);
    const [map, setMap] = useState(undefined)
    const [maps, setMaps] = useState(undefined)
    const [polyline, setPolyline] = useState(undefined)

    const renderPolyline = (map, maps, routePolyline) => {
        if(typeof map !== 'undefined'  && typeof maps !== 'undefined'){
            console.log("Rendering polyline" )
            let decodedPolyline = decodePolyline(routePolyline);
            let newPolyline = new maps.Polyline({
                path: decodedPolyline,
                geodesic: true,
                strokeColor: "#0047AB",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                fillColor: "#0047AB",
                fillOpacity: 0.35
            })
            newPolyline.setMap(map)
            setPolyline(newPolyline)
        }
    }

    useEffect(()=>{
        console.log("Rendering new polyline" )
        if(typeof polyline !== 'undefined'){
            polyline.setPath(decodePolyline(route.polyline));
        }
    }, [polyline, route.polyline])

    return (
        <Wrapper>
            <Content>
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals={true}
                    bootstrapURLKeys={{key: GOOGLE_API_KEY}}
                    defaultZoom={7}
                    center={coordinates}
                    onGoogleApiLoaded={({map, maps}) => {
                        setMap(map)
                        setMaps(maps)
                        renderPolyline(map, maps, route.polyline)
                    }}
                >
                    {
                        route.route.routeForecast.map((location, index) =>
                            <Marker
                                key={location.city.id}
                                lat={location.city.latitude}
                                lng={location.city.longitude}
                                location={location}
                                columns={columns}
                                text={text}
                                temperatureUnit={temperatureUnit}
                                windSpeedUnit={windSpeedUnit}
                            />
                        )
                    }
                </GoogleMapReact>
            </Content>
        </Wrapper>
    )
}

Map.propTypes = {
    route: PropTypes.object,
    columns: PropTypes.array,
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default Map