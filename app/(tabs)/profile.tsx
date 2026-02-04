import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Switch, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sofia García",
    age: 26,
    bio: "Aventurera y amante de la naturaleza 🏔️",
    interests: ["hiking", "travel", "art", "photography"],
    photos: [
      "https://via.placeholder.com/300x400?text=Photo+1",
      "https://via.placeholder.com/300x400?text=Photo+2",
      "https://via.placeholder.com/300x400?text=Photo+3",
    ],
    isVerified: true,
    isOnline: true,
  });

  const [preferences, setPreferences] = useState({
    minAge: 21,
    maxAge: 35,
    maxDistance: 50,
    showProfile: true,
    allowMessages: true,
  });

  const handleSaveProfile = () => {
    Alert.alert("Perfil guardado", "Tu perfil ha sido actualizado correctamente");
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás segura de que deseas cerrar sesión?", [
      { text: "Cancelar", onPress: () => {} },
      { text: "Cerrar sesión", onPress: () => Alert.alert("Sesión cerrada") },
    ]);
  };

  if (isEditing) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-6">
            <Text className="text-2xl font-bold text-foreground">Editar Perfil</Text>
            <Pressable onPress={() => setIsEditing(false)}>
              <Ionicons name="close" size={28} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Edit Form */}
          <View className="px-4 gap-6 pb-6">
            {/* Name */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Nombre</Text>
              <TextInput
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Age */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Edad</Text>
              <TextInput
                value={profile.age.toString()}
                onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || 0 })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Bio */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Biografía</Text>
              <TextInput
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground h-24"
                multiline
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Preferences */}
            <View className="bg-surface rounded-lg p-4">
              <Text className="text-base font-semibold text-foreground mb-4">Preferencias</Text>

              <View className="mb-4">
                <Text className="text-sm text-muted mb-2">Edad mínima: {preferences.minAge}</Text>
                <View className="bg-border rounded-lg h-2" />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-muted mb-2">Edad máxima: {preferences.maxAge}</Text>
                <View className="bg-border rounded-lg h-2" />
              </View>

              <View>
                <Text className="text-sm text-muted mb-2">Distancia máxima: {preferences.maxDistance} km</Text>
                <View className="bg-border rounded-lg h-2" />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSaveProfile}
              className="bg-primary rounded-lg py-4 items-center"
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Text className="text-white font-semibold text-base">Guardar Cambios</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground">Mi Perfil</Text>
        </View>

        {/* Profile Photos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-6">
          {profile.photos.map((photo, idx) => (
            <View key={idx} className="mr-3 relative">
              <Image
                source={{ uri: photo }}
                className="w-32 h-48 rounded-2xl bg-border"
              />
              <Pressable className="absolute top-2 right-2 bg-error rounded-full p-2">
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
          ))}
          <Pressable className="w-32 h-48 rounded-2xl bg-surface border-2 border-dashed border-border items-center justify-center">
            <Ionicons name="add" size={40} color={colors.primary} />
          </Pressable>
        </ScrollView>

        {/* Profile Info */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">{profile.name}</Text>
            {profile.isVerified && (
              <View className="bg-primary rounded-full p-1">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
          <Text className="text-base text-muted mb-4">{profile.age} años</Text>
          <Text className="text-base text-foreground leading-relaxed mb-4">{profile.bio}</Text>

          {/* Interests */}
          <View className="flex-row gap-2 flex-wrap">
            {profile.interests.map((interest, idx) => (
              <View key={idx} className="bg-primary/20 rounded-full px-4 py-2">
                <Text className="text-sm font-semibold text-primary">{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Configuración</Text>

          {/* Show Profile */}
          <View className="flex-row items-center justify-between bg-surface p-4 rounded-lg mb-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="eye" size={24} color={colors.primary} />
              <Text className="text-base text-foreground">Mostrar perfil</Text>
            </View>
            <Switch
              value={preferences.showProfile}
              onValueChange={(value) => setPreferences({ ...preferences, showProfile: value })}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* Allow Messages */}
          <View className="flex-row items-center justify-between bg-surface p-4 rounded-lg mb-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail" size={24} color={colors.primary} />
              <Text className="text-base text-foreground">Permitir mensajes</Text>
            </View>
            <Switch
              value={preferences.allowMessages}
              onValueChange={(value) => setPreferences({ ...preferences, allowMessages: value })}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* Online Status */}
          <View className="flex-row items-center justify-between bg-surface p-4 rounded-lg mb-3">
            <View className="flex-row items-center gap-3">
              <View className="w-3 h-3 bg-success rounded-full" />
              <Text className="text-base text-foreground">Estado en línea</Text>
            </View>
            <Switch
              value={profile.isOnline}
              onValueChange={(value) => setProfile({ ...profile, isOnline: value })}
              trackColor={{ false: colors.border, true: colors.success }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 gap-3 pb-6">
          <Pressable
            onPress={() => setIsEditing(true)}
            className="bg-primary rounded-lg py-4 items-center flex-row justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="pencil" size={20} color="white" />
            <Text className="text-white font-semibold text-base">Editar Perfil</Text>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Bloqueados", "Aquí verás los usuarios que has bloqueado")}
            className="bg-surface border border-border rounded-lg py-4 items-center flex-row justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="ban" size={20} color={colors.foreground} />
            <Text className="text-foreground font-semibold text-base">Usuarios Bloqueados</Text>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Ayuda", "Contacta con nuestro equipo de soporte")}
            className="bg-surface border border-border rounded-lg py-4 items-center flex-row justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="help-circle" size={20} color={colors.foreground} />
            <Text className="text-foreground font-semibold text-base">Ayuda y Soporte</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="bg-error/10 rounded-lg py-4 items-center flex-row justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text className="text-error font-semibold text-base">Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
