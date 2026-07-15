import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { Zone } from "@/types";
import { getStatusColor } from "@/utils/radiation";
import { buildDynamicZonePolygon } from "@/utils/polygon";

const COUNTRY_REGION = {
  latitude: 40.15,
  longitude: 44.7,
  latitudeDelta: 2.2,
  longitudeDelta: 2.2,
};

interface Props {
  zones: Zone[];
  tick: number;
  onZonePress: (zone: Zone) => void;
  pointerEventsNone?: boolean;
}

export const ZoneMapView: React.FC<Props> = ({ zones, tick, onZonePress, pointerEventsNone }) => {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={COUNTRY_REGION}
      provider={PROVIDER_GOOGLE}
      pointerEvents={pointerEventsNone ? "none" : "auto"}
    >
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          coordinates={buildDynamicZonePolygon({
            zoneId: zone.id,
            centerLat: zone.centerLat,
            centerLon: zone.centerLon,
            level: zone.level,
            tick,
          })}
          fillColor={`${getStatusColor(zone.status)}55`}
          strokeColor={getStatusColor(zone.status)}
          strokeWidth={2}
          tappable
          onPress={() => onZonePress(zone)}
        />
      ))}
    </MapView>
  );
};
