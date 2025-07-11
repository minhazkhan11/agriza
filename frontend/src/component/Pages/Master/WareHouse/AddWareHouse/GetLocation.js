import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

function TestMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAtNsOpIggRDEW8eVBJQ-J921c6osUhzaE",
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) return <p>❌ Google Maps failed to load</p>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Google Map with Red Marker</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={center}
          icon={{
            url: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
          }}
        />
      </GoogleMap>
    </div>
  );
}

export default React.memo(TestMap);
