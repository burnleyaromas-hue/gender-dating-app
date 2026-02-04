import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        Alert.alert(
          "Permiso requerido",
          "Gender necesita acceso a tu ubicación para encontrar perfiles cercanos. Por favor, habilita los permisos en la configuración."
        );
        setLoading(false);
        return false;
      }

      return true;
    } catch (err) {
      setError("Error al solicitar permiso de ubicación");
      setLoading(false);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: UserLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || 0,
        timestamp: currentLocation.timestamp,
      };

      setLocation(userLocation);
      setLoading(false);
      return userLocation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, [requestLocationPermission]);

  const startLocationTracking = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      // Obtener ubicación inicial
      await getCurrentLocation();

      // Configurar actualización de ubicación cada 30 segundos
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // 30 segundos
          distanceInterval: 100, // 100 metros
        },
        (newLocation) => {
          const userLocation: UserLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || 0,
            timestamp: newLocation.timestamp,
          };
          setLocation(userLocation);
        }
      );

      return subscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return null;
    }
  }, [requestLocationPermission, getCurrentLocation]);

  // Calcular distancia entre dos puntos usando la fórmula de Haversine
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    startLocationTracking,
    calculateDistance,
    requestLocationPermission,
  };
}
