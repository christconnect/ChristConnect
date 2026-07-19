import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  SafeAreaView, 
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing } from '../../theme/theme';
import Header from '../../components/Header';
import SearchBar from '../../components/Inputs';
import { ChatItemCard } from '../../components/Cards';
import EmptyState from '../../components/EmptyState';

export const MessagesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { chats } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chat threads based on search query
  const filteredChats = useMemo(() => {
    if (searchQuery.trim() === '') return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter((c) => c.profileName.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" />

      <View style={styles.searchBarWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search recent conversations..."
        />
      </View>

      {/* Chats List */}
      {filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChatItemCard
              chat={item}
              onPress={() => {
                navigation.navigate('ChatRoom', {
                  chatId: item.id,
                  profileName: item.profileName,
                  profileAvatar: item.profileAvatar,
                });
              }}
            />
          )}
        />
      ) : (
        <EmptyState
          icon="chatbubbles-outline"
          title="No Chats Found"
          description="It looks like you don't have any chat logs matching your query. Explore matches on Home!"
          actionTitle={searchQuery ? "Clear Search" : undefined}
          onActionPress={() => setSearchQuery('')}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
});

export default MessagesScreen;
