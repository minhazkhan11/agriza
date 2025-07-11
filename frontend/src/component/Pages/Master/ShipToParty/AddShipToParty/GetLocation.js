import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Button, TextField, Typography, Box } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139, // Default location (New Delhi)
  lng: 77.209,
};

const GetLocation = () => {
  const [location, setLocation] = useState(defaultCenter);

  const handleMapClick = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleMarkerDragEnd = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h6">Select a Location</Typography>

      <LoadScript googleMapsApiKey="AIzaSyAtNsOpIggRDEW8eVBJQ-J921c6osUhzaE">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={10}
          onClick={handleMapClick}
        >
          <Marker
            position={location}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </LoadScript>

      <TextField
        label="Latitude"
        value={location.lat}
        variant="outlined"
        margin="normal"
        fullWidth
        disabled
      />
      <TextField
        label="Longitude"
        value={location.lng}
        variant="outlined"
        margin="normal"
        fullWidth
        disabled
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => console.log("Selected Location:", location)}
        sx={{ mt: 2 }}
      >
        Confirm Location
      </Button>
    </Box>
  );
};

export default GetLocation;
