import React, { useEffect, useState } from "react";
import { Text } from '@chakra-ui/react';
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

/* 
  Props:
    coordinates - user's map coordinates
  Finds user's current location on the map
  Returns a marker with a popup at user's coordinates
*/
  export default function CurrentLocationMarker({coordinates}) {

  // Current coordinates of user  
  const [position, setPosition] = useState(null);
  const map = useMap();
  
  useEffect(() => {
    // Finds and flies to user's coordinates when map loads
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      coordinates(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      // Creates the marker for coordinate
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, {radius: radius});
      circle.addTo(map);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} >
      <Popup>
          <Text>Current Location</Text>
      </Popup>
    </Marker>
  );
}