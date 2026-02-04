import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

interface Match {
  id: number;
  userId: number;
  name: string;
  lastMessage: string;
  profilePhoto: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessageTime: string;
}

export default function MatchesScreen() {
  const colors = useColors();
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      userId: 101,
      name: "Sofia",
      lastMessage: "¡Hola! ¿Cómo estás?",
      profilePhoto: "https://via.placeholder.com/100x100?text=Sofia",
      isOnline: true,
      unreadCount: 2,
      lastMessageTime: "Hace 5 min",
    },
    {
      id: 2,
      userId: 102,
      name: "Martina",
      lastMessage: "Me encantó tu perfil 😊",
      profilePhoto: "https://via.placeholder.com/100x100?text=Martina",
      isOnline: true,
      unreadCount: 0,
      lastMessageTime: "Hace 1 hora",
    },
    {
      id: 3,
      userId: 103,
      name: "Lucía",
      lastMessage: "¿Quieres tomar algo?",
      profilePhoto: "https://via.placeholder.com/100x100?text=Lucia",
      isOnline: false,
      unreadCount: 1,
      lastMessageTime: "Ayer",
    },
    {
      id: 4,
      userId: 104,
      name: "Valentina",
      lastMessage: "Jajaja, eso es muy divertido",
      profilePhoto: "https://via.placeholder.com/100x100?text=Valentina",
      isOnline: true,
      unreadCount: 0,
      lastMessageTime: "Hace 2 horas",
    },
  ]);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const renderMatchItem = ({ item }: { item: Match }) => (
    <Pressable
      onPress={() => setSelectedMatch(item)}
      className="flex-row items-center gap-3 p-4 border-b border-border"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Profile Photo */}
      <View className="relative">
        <Image
          source={{ uri: item.profilePhoto }}
          className="w-16 h-16 rounded-full bg-border"
        />
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-background" />
        )}
      </View>

      {/* Match Info */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-base font-semibold text-foreground flex-1">
            {item.name}
          </Text>
          <Text className="text-xs text-muted">{item.lastMessageTime}</Text>
        </View>
        <Text
          className={`text-sm ${
            item.unreadCount > 0 ? "text-foreground font-semibold" : "text-muted"
          }`}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );

  if (selectedMatch) {
    return (
      <ScreenContainer className="bg-background">
        {/* Chat Header */}
        <View className="flex-row items-center gap-3 p-4 border-b border-border mb-4">
          <Pressable onPress={() => setSelectedMatch(null)}>
            <Ionicons name="chevron-back" size={28} color={colors.foreground} />
          </Pressable>
          <Image
            source={{ uri: selectedMatch.profilePhoto }}
            className="w-12 h-12 rounded-full bg-border"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">
              {selectedMatch.name}
            </Text>
            <Text className="text-xs text-muted">
              {selectedMatch.isOnline ? "En línea" : "Desconectada"}
            </Text>
          </View>
          <Pressable>
            <Ionicons name="call" size={24} color={colors.primary} />
          </Pressable>
          <Pressable>
            <Ionicons name="videocam" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingVertical: 16 }}>
          {/* Sample Messages */}
          <View className="mb-4">
            <View className="bg-surface rounded-2xl rounded-tl-none px-4 py-3 mr-12 mb-2">
              <Text className="text-foreground">¡Hola! ¿Cómo estás?</Text>
            </View>
            <Text className="text-xs text-muted ml-4">Hace 5 min</Text>
          </View>

          <View className="mb-4 items-end">
            <View className="bg-primary rounded-2xl rounded-tr-none px-4 py-3 ml-12 mb-2">
              <Text className="text-white">¡Hola! Muy bien, ¿y tú?</Text>
            </View>
            <Text className="text-xs text-muted mr-4">Hace 4 min</Text>
          </View>

          <View className="mb-4">
            <View className="bg-surface rounded-2xl rounded-tl-none px-4 py-3 mr-12 mb-2">
              <Text className="text-foreground">Me encantó tu perfil 😊</Text>
            </View>
            <Text className="text-xs text-muted ml-4">Hace 2 min</Text>
          </View>
        </ScrollView>

        {/* Message Input */}
        <View className="flex-row items-center gap-3 p-4 border-t border-border">
          <Pressable className="w-10 h-10 rounded-full bg-surface items-center justify-center">
            <Ionicons name="add" size={24} color={colors.primary} />
          </Pressable>
          <View className="flex-1 bg-surface rounded-full px-4 py-3 flex-row items-center">
            <Text className="text-muted flex-1">Escribe un mensaje...</Text>
            <Ionicons name="happy" size={20} color={colors.muted} />
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <Ionicons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground">Matches</Text>
          <Text className="text-sm text-muted mt-1">{matches.length} conexiones</Text>
        </View>

        {/* Matches List */}
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
