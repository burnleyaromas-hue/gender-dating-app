import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface Photo {
  id: number;
  uri: string;
  displayOrder: number;
  isUploading?: boolean;
}

export default function PhotosScreen() {
  const colors = useColors();
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      uri: "https://via.placeholder.com/300x400?text=Photo+1",
      displayOrder: 0,
    },
  ]);
  const [uploading, setUploading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploading(true);

        // Simular subida de foto
        setTimeout(() => {
          const newPhoto: Photo = {
            id: Date.now(),
            uri: asset.uri,
            displayOrder: photos.length,
          };
          setPhotos([...photos, newPhoto]);
          setUploading(false);
          Alert.alert("Éxito", "Foto subida correctamente");
        }, 1500);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la foto");
      setUploading(false);
    }
  }, [photos.length]);

  const takePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploading(true);

        setTimeout(() => {
          const newPhoto: Photo = {
            id: Date.now(),
            uri: asset.uri,
            displayOrder: photos.length,
          };
          setPhotos([...photos, newPhoto]);
          setUploading(false);
          Alert.alert("Éxito", "Foto capturada y subida correctamente");
        }, 1500);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la foto");
      setUploading(false);
    }
  }, [photos.length]);

  const deletePhoto = (id: number) => {
    Alert.alert("Eliminar foto", "¿Estás segura de que deseas eliminar esta foto?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Eliminar",
        onPress: () => {
          setPhotos(photos.filter((p) => p.id !== id));
          Alert.alert("Foto eliminada", "La foto ha sido eliminada correctamente");
        },
      },
    ]);
  };

  const movePhotoUp = (index: number) => {
    if (index > 0) {
      const newPhotos = [...photos];
      [newPhotos[index], newPhotos[index - 1]] = [newPhotos[index - 1], newPhotos[index]];
      setPhotos(newPhotos);
    }
  };

  const movePhotoDown = (index: number) => {
    if (index < photos.length - 1) {
      const newPhotos = [...photos];
      [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
      setPhotos(newPhotos);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground">Mis Fotos</Text>
          <Text className="text-sm text-muted mt-1">
            Sube hasta 6 fotos para que otros usuarios te conozcan mejor
          </Text>
        </View>

        {/* Upload Buttons */}
        <View className="px-4 gap-3 mb-6">
          <Pressable
            onPress={pickImage}
            disabled={uploading || photos.length >= 6}
            className="bg-primary rounded-lg py-4 flex-row items-center justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="image" size={20} color="white" />
            <Text className="text-white font-semibold text-base">Seleccionar de Galería</Text>
          </Pressable>

          <Pressable
            onPress={takePhoto}
            disabled={uploading || photos.length >= 6}
            className="bg-primary/70 rounded-lg py-4 flex-row items-center justify-center gap-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text className="text-white font-semibold text-base">Tomar Foto</Text>
          </Pressable>
        </View>

        {/* Upload Progress */}
        {uploading && (
          <View className="px-4 mb-6 bg-surface rounded-lg p-4 flex-row items-center gap-3">
            <ActivityIndicator size="small" color={colors.primary} />
            <Text className="text-foreground font-semibold">Subiendo foto...</Text>
          </View>
        )}

        {/* Photos Grid */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-foreground mb-4">
            {photos.length} de 6 fotos
          </Text>

          <View className="gap-4">
            {photos.map((photo, index) => (
              <View key={photo.id} className="bg-surface rounded-2xl overflow-hidden">
                {/* Photo */}
                <View className="relative h-64 bg-border">
                  <Image
                    source={{ uri: photo.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Order Badge */}
                  <View className="absolute top-4 left-4 bg-primary rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-white font-bold text-sm">{index + 1}</Text>
                  </View>

                  {/* Primary Badge */}
                  {index === 0 && (
                    <View className="absolute top-4 right-4 bg-success rounded-full px-3 py-1">
                      <Text className="text-white text-xs font-semibold">Principal</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View className="p-4 flex-row gap-2 justify-between">
                  <Pressable
                    onPress={() => movePhotoUp(index)}
                    disabled={index === 0}
                    className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons
                      name="arrow-up"
                      size={20}
                      color={index === 0 ? colors.muted : colors.primary}
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => movePhotoDown(index)}
                    disabled={index === photos.length - 1}
                    className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons
                      name="arrow-down"
                      size={20}
                      color={index === photos.length - 1 ? colors.muted : colors.primary}
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => deletePhoto(photo.id)}
                    className="flex-1 bg-error/10 rounded-lg py-3 items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons name="trash" size={20} color={colors.error} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {/* Empty State */}
          {photos.length === 0 && (
            <View className="bg-surface rounded-2xl p-8 items-center">
              <Ionicons name="image-outline" size={48} color={colors.muted} />
              <Text className="text-foreground font-semibold mt-4 text-center">
                No tienes fotos aún
              </Text>
              <Text className="text-muted text-center mt-2 text-sm">
                Sube al menos una foto para que otros usuarios puedan verte
              </Text>
            </View>
          )}

          {/* Max Photos Warning */}
          {photos.length >= 6 && (
            <View className="bg-warning/10 rounded-lg p-4 flex-row gap-3 items-start">
              <Ionicons name="information-circle" size={20} color={colors.warning} />
              <Text className="text-warning text-sm flex-1">
                Has alcanzado el máximo de 6 fotos. Elimina una para agregar otra.
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View className="px-4 mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">Consejos para mejores fotos</Text>
          <View className="bg-surface rounded-lg p-4 gap-3">
            <View className="flex-row gap-3">
              <Text className="text-primary font-bold">✓</Text>
              <Text className="text-foreground flex-1 text-sm">
                Usa una foto clara donde se vea bien tu cara
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="text-primary font-bold">✓</Text>
              <Text className="text-foreground flex-1 text-sm">
                La primera foto es la más importante
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="text-primary font-bold">✓</Text>
              <Text className="text-foreground flex-1 text-sm">
                Evita fotos borrosas o con filtros excesivos
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="text-primary font-bold">✓</Text>
              <Text className="text-foreground flex-1 text-sm">
                Muestra tu personalidad con diferentes fotos
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 pb-6">
          <Pressable
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
