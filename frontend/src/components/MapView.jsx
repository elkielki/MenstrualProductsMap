import React, { useContext } from 'react';
import { Text, Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { UserContext } from '../context/userContext';
import MapSearchBar from './MapSearchBar';

// Returns the map container
export default function MapView() {
    
    // Gets the user and station info
    const {
        user, setUser, 
        loggedIn, setLoggedIn, 
        stationList, setStationList
    } =  useContext(UserContext);

    return (
        <Box height='40vh' width='90vw' marginBottom='2vh'>
            <MapContainer center={[32.88103, -117.23758]} zoom={70} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                {/* The map and search bar */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapSearchBar />

                {/* Adds a marker on the map for each station */}
                {stationList.map((station, idx) => (
                    <Marker key={'mapMarker' + idx} position={[station.location.coordinates[1], station.location.coordinates[0]]}>
                        <Popup>
                            <Text>{station.locationName}</Text>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    )
}