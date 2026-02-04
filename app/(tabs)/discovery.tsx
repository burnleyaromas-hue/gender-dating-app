import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useLocation } from "@/hooks/use-location";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface Profile {
  id: number;
  userId: number;
  name: string;
  age: number;
  bio: string;
  profilePhotoUrl: string;
  interests: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  distance?: number;
}

export default function DiscoveryScreen() {
  const colors = useColors();
  const { location, loading, error, getCurrentLocation, calculateDistance } = useLocation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Cargar perfiles cercanos cuando se obtiene la ubicación
  useEffect(() => {
    const loadNearbyProfiles = async () => {
      if (!location) return;

      // Simular perfiles cercanos (en producción, esto vendría de la API)
      const mockProfiles: Profile[] = [
        {
          id: 1,
          userId: 101,
          name: "Sofia",
          age: 26,
          bio: "Aventurera y amante de la naturaleza 🏔️",
          profilePhotoUrl: "https://via.placeholder.com/400x500?text=Sofia",
          interests: "hiking,travel,art",
          latitude: location.latitude + 0.01,
          longitude: location.longitude + 0.01,
          isOnline: true,
        },
        {
          id: 2,
          userId: 102,
          name: "Martina",
          age: 28,
          bio: "Artista y amante de la música indie",
          profilePhotoUrl: "https://via.placeholder.com/400x500?text=Martina",
          interests: "music,art,coffee",
          latitude: location.latitude - 0.005,
          longitude: location.longitude + 0.015,
          isOnline: true,
        },
        {
          id: 3,
          userId: 103,
          name: "Lucía",
          age: 24,
          bio: "Fotógrafa de viajes 📸",
          profilePhotoUrl: "https://via.placeholder.com/400x500?text=Lucia",
          interests: "photography,travel,food",
          latitude: location.latitude + 0.02,
          longitude: location.longitude - 0.01,
          isOnline: false,
        },
        {
          id: 4,
          userId: 104,
          name: "Valentina",
          age: 25,
          bio: "Amante del yoga y la meditación 🧘‍♀️",
          profilePhotoUrl: "https://via.placeholder.com/400x500?text=Valentina",
          interests: "yoga,wellness,nature",
          latitude: location.latitude - 0.015,
          longitude: location.longitude - 0.005,
          isOnline: true,
        },
      ];

      // Calcular distancia para cada perfil
      const profilesWithDistance = mockProfiles.map((profile) => ({
        ...profile,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          profile.latitude,
          profile.longitude
        ),
      }));

      // Ordenar por distancia
      profilesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setProfiles(profilesWithDistance);
      setLoadingProfiles(false);
    };

    if (location) {
      loadNearbyProfiles();
    }
  }, [location, calculateDistance]);

  // Solicitar ubicación al montar el componente
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    if (currentProfile) {
      Alert.alert("¡Me gusta!", `Te gustó el perfil de ${currentProfile.name}`);
      moveToNextProfile();
    }
  };

  const handleSuperLike = () => {
    if (currentProfile) {
      Alert.alert("¡Super me gusta!", `¡Super like a ${currentProfile.name}!`);
      moveToNextProfile();
    }
  };

  const handlePass = () => {
    moveToNextProfile();
  };

  const moveToNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Sin más perfiles", "No hay más perfiles disponibles por ahora");
      setCurrentIndex(0);
    }
  };

  if (loading || loadingProfiles) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4 text-center">
          {loading ? "Obteniendo tu ubicación..." : "Cargando perfiles cercanos..."}
        </Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="bg-background p-6 items-center justify-center">
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text className="text-foreground text-lg font-semibold mt-4 text-center">
          Error de ubicación
        </Text>
        <Text className="text-muted text-center mt-2">{error}</Text>
        <Pressable
          onPress={getCurrentLocation}
          className="bg-primary rounded-lg py-3 px-6 mt-6"
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  if (profiles.length === 0) {
    return (
      <ScreenContainer className="bg-background p-6 items-center justify-center">
        <Ionicons name="location-outline" size={48} color={colors.muted} />
        <Text className="text-foreground text-lg font-semibold mt-4 text-center">
          No hay perfiles cercanos
        </Text>
        <Text className="text-muted text-center mt-2">
          Intenta más tarde o cambia tu ubicación
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
        <View className="flex-1 justify-center items-center px-4 py-6">
          {/* Header con ubicación */}
          <View className="w-full mb-6">
            <Text className="text-3xl font-bold text-foreground">Descubre</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text className="text-sm text-muted">
                {location
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : "Ubicación no disponible"}
              </Text>
            </View>
          </View>

          {/* Profile Card */}
          {currentProfile && (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              className="w-full bg-surface rounded-3xl overflow-hidden shadow-lg mb-6"
            >
              {/* Profile Photo */}
              <View className="w-full h-96 bg-border relative">
                <Image
                  source={{ uri: currentProfile.profilePhotoUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Online Status Badge */}
                {currentProfile.isOnline && (
                  <View className="absolute top-4 right-4 bg-success rounded-full p-2 flex-row items-center gap-1">
                    <View className="w-2 h-2 bg-white rounded-full" />
                    <Text className="text-xs font-semibold text-white">En línea</Text>
                  </View>
                )}

                {/* Profile Info Overlay */}
                <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <View className="flex-row items-end gap-3 mb-3">
                    <Text className="text-4xl font-bold text-white">
                      {currentProfile.age}
                    </Text>
                    <Text className="text-white text-lg font-semibold mb-1">
                      {currentProfile.name}
                    </Text>
                  </View>
                  <Text className="text-white text-lg font-semibold mb-2">
                    {currentProfile.bio}
                  </Text>
                  <View className="flex-row gap-2 flex-wrap">
                    {currentProfile.interests.split(",").map((interest, idx) => (
                      <View
                        key={idx}
                        className="bg-primary/30 rounded-full px-3 py-1"
                      >
                        <Text className="text-white text-xs">{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Distance Info */}
              <View className="p-4 border-t border-border flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">
                    {currentProfile.distance
                      ? `${currentProfile.distance.toFixed(1)} km de ti`
                      : "Ubicación desconocida"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 bg-success rounded-full" />
                  <Text className="text-xs text-muted">
                    {currentProfile.isOnline ? "En línea" : "Desconectada"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <View className="w-full flex-row justify-center gap-4 mb-6">
            {/* Pass Button */}
            <Pressable
              onPress={handlePass}
              className="w-16 h-16 rounded-full bg-surface border-2 border-border items-center justify-center"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="close" size={32} color={colors.error} />
            </Pressable>

            {/* Super Like Button */}
            <Pressable
              onPress={handleSuperLike}
              className="w-16 h-16 rounded-full bg-primary items-center justify-center"
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            >
              <Ionicons name="star" size={32} color="white" />
            </Pressable>

            {/* Like Button */}
            <Pressable
              onPress={handleLike}
              className="w-16 h-16 rounded-full bg-success items-center justify-center"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="heart" size={32} color="white" />
            </Pressable>
          </View>

          {/* Profile Counter */}
          <View className="w-full flex-row justify-center gap-1 mb-4">
            {profiles.map((_, idx) => (
              <View
                key={idx}
                className={`h-1 rounded-full ${
                  idx === currentIndex ? "bg-primary w-8" : "bg-border w-2"
                }`}
              />
            ))}
          </View>

          {/* Info Text */}
          <Text className="text-center text-sm text-muted">
            {currentIndex + 1} de {profiles.length}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
