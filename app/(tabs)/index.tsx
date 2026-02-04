import { ScrollView, Text, View, TouchableOpacity } from "react-native";

import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8 justify-center">
          {/* Hero Section */}
          <View className="items-center gap-4">
            <Text className="text-5xl font-bold text-primary">Gender</Text>
            <Text className="text-2xl font-bold text-foreground">Conecta con mujeres cerca de ti</Text>
            <Text className="text-base text-muted text-center">
              Descubre, conecta y encuentra tu próxima conexión
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="gap-4">
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">❤️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground mb-1">Descubre</Text>
                  <Text className="text-sm text-muted">Encuentra mujeres interesantes cerca de ti</Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-2xl p-6 border border-border">
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">💬</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground mb-1">Conecta</Text>
                  <Text className="text-sm text-muted">Chatea con tus matches en tiempo real</Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-2xl p-6 border border-border">
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">🔒</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground mb-1">Seguro</Text>
                  <Text className="text-sm text-muted">Tu privacidad y seguridad son prioritarias</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <View className="items-center gap-2">
            <TouchableOpacity className="bg-primary px-8 py-4 rounded-full w-full items-center active:opacity-80">
              <Text className="text-white font-bold text-lg">Comenzar a Explorar</Text>
            </TouchableOpacity>
            <Text className="text-xs text-muted">Desliza a Descubre para empezar</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
