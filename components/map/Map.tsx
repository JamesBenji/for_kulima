'use client'
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface Cordinate {
  lat: number;
  lng: number;
}

export interface Props {
  cordinates: Cordinate[];
  showMarkers?: boolean;
  height: number | string;
  width: number | string;
}

function calculateCenter(coordinates: Cordinate[]): Cordinate {
  const total: Cordinate = coordinates.reduce(
    (acc: Cordinate, coord: Cordinate) => {
      acc.lat += coord.lat;
      acc.lng += coord.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  const count: number = coordinates.length;
  return {
    lat: total.lat / count,
    lng: total.lng / count,
  };
}

interface preFormatedCoords {
  lat: number;
  lon: number;
}

const getFormattedCoords = (coords: any) => {
  return coords.map((coord: any) => {
    return {
      lat: coord.lat,
      lng: coord.lon,
    };
  });

};

const Map = (props: Props) => {
  const coords = getFormattedCoords(props?.cordinates);

  return (
    // Important! Always set the container height explicitly
    <MapContainer
      center={calculateCenter(coords)}
      zoom={6}
      style={{ height: props?.height, width: props?.width }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {coords?.map((_: any, index: any) =>
        index != coords?.length - 1 ? (
          <Polyline
            key={index}
            positions={[coords[index], coords[index + 1]]}
          />
        ) : (
          <Polyline
            key={index}
            positions={[
              coords[coords?.length - 1],
              coords[0],
            ]}
          />
        )
      )}

      {props?.showMarkers &&
        coords?.map((cordinate: any, index: any) => (
          <Marker key={index} position={cordinate} />
        ))}
    </MapContainer>
  );
};

export default Map;
