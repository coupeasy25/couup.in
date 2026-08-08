"use client";

import React from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet icon issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[];
  onChange?: (value: { lat: number; lng: number }) => void;
  interactive?: boolean;
}

const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null, setPosition: any }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const Map: React.FC<MapProps> = ({ center, onChange, interactive = true }) => {
  const defaultCenter = center || [20.5937, 78.9629]; // Default to India
  const [position, setPosition] = React.useState<L.LatLng | null>(
    center ? new L.LatLng(center[0], center[1]) : null
  );

  const handlePositionChange = (latlng: L.LatLng) => {
    setPosition(latlng);
    if (onChange) {
      onChange({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  return (
    <MapContainer
      center={defaultCenter as L.LatLngExpression}
      zoom={center ? 15 : 4}
      scrollWheelZoom={false}
      className="h-[40vh] rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {interactive && <LocationMarker position={position} setPosition={handlePositionChange} />}
      {!interactive && center && <Marker position={defaultCenter as L.LatLngExpression} />}
    </MapContainer>
  );
};

export default Map;
