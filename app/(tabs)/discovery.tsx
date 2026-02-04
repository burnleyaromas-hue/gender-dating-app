import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Image, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface Profile {
  id: number;
  userId: number;
  age: number;
  bio: string;
  profilePhotoUrl: string;
  interests: string;
  latitude: string;
  longitude: string;
  isOnline: boolean;
}

export default function DiscoveryScreen() {
  const colors = useColors();
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 1,
      userId: 101,
      age: 26,
      bio: "Aventurera y amante de la naturaleza 🏔️",
      profilePhotoUrl: "https://via.placeholder.com/400x500?text=Profile+1",
      interests: "hiking,travel,art",
      latitude: "40.7128",
      longitude: "-74.0060",
      isOnline: true,
    },
    {
      id: 2,
      userId: 102,
      age: 28,
      bio: "Artista y amante de la música indie",
      profilePhotoUrl: "https://via.placeholder.com/400x500?text=Profile+2",
      interests: "music,art,coffee",
      latitude: "40.7580",
      longitude: "-73.9855",
      isOnline: true,
    },
    {
      id: 3,
      userId: 103,
      age: 24,
      bio: "Fotógrafa de viajes 📸",
      profilePhotoUrl: "https://via.placeholder.com/400x500?text=Profile+3",
      interests: "photography,travel,food",
      latitude: "40.7489",
      longitude: "-73.9680",
      isOnline: false,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    Alert.alert("¡Me gusta!", `Te gustó el perfil de ${currentProfile.bio}`);
    moveToNextProfile();
  };

  const handleSuperLike = () => {
    Alert.alert("¡Super me gusta!", `¡Super like a ${currentProfile.bio}!`);
    moveToNextProfile();
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

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
        <View className="flex-1 justify-center items-center px-4 py-6">
          {/* Header */}
          <View className="w-full mb-6">
            <Text className="text-3xl font-bold text-foreground">Descubre</Text>
            <Text className="text-sm text-muted mt-1">Personas cercanas a ti</Text>
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
              <View className="p-4 border-t border-border">
                <Text className="text-sm text-muted">
                  📍 A {Math.floor(Math.random() * 5) + 1} km de ti
                </Text>
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
