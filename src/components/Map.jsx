import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities, emojiToFlag } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[matpLat, mapLng]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{emojiToFlag(city.emoji)}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeComponent position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// This function reacts to the changes in the mapLat and mapLng in a way which changes the mapPosition state and to react to that state we have to write custom component that uses the useMap() hook of the leaflet library which tells the Map to change the current center i.e to mapPosition
function ChangeComponent({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) =>
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`, {
        replace: true,
      }),
  });
  return null;
}
export default Map;
