import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { PostCard } from '../../components/Cards';
import BottomSheet from '../../components/BottomSheet';
import Button from '../../components/Buttons';

export const CommunityScreen: React.FC = () => {
  const { 
    posts, 
    currentUser, 
    likePost, 
    createPost, 
    addComment 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'All' | 'Following' | 'My Posts'>('All');
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedLimit, setFeedLimit] = useState(10);

  // Filter posts based on active top tab
  const filteredPosts = useMemo(() => {
    let list = posts;
    if (activeTab === 'My Posts') {
      list = posts.filter(post => post.userId === 'me');
    } else if (activeTab === 'Following') {
      // Mocked "Following" list using even indexes
      list = posts.filter((_, idx) => idx % 2 === 0);
    }
    return list.slice(0, feedLimit);
  }, [posts, activeTab, feedLimit]);

  // Pull to refresh simulation
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  // Infinite scroll pagination simulation
  const handleLoadMore = () => {
    if (loadingMore || feedLimit >= posts.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setFeedLimit(prev => Math.min(prev + 10, posts.length));
      setLoadingMore(false);
    }, 1000);
  };

  const handleCreatePost = () => {
    if (newPostText.trim() === '') return;
    
    // Add random mock image for visual variety
    const mockImages = [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400'
    ];
    // Random chance of attaching image
    const images = Math.random() > 0.4 ? [mockImages[Math.floor(Math.random() * mockImages.length)]] : [];
    
    createPost(newPostText, images);
    setNewPostText('');
    setCreatorVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Top Tabs (All, Following, My Posts) */}
      <View style={styles.tabContainer}>
        {(['All', 'Following', 'My Posts'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Post Creator Card */}
      <View style={styles.creatorCard}>
        <View style={styles.creatorRow}>
          <Avatar imageUrl={currentUser.imageUrl} size={44} />
          <TouchableOpacity 
            style={styles.creatorInputCue}
            onPress={() => setCreatorVisible(true)}
          >
            <Text style={styles.creatorCueText}>Create a Post...</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.creatorActions}>
          <TouchableOpacity style={styles.creatorActionBtn} onPress={() => setCreatorVisible(true)}>
            <Icon name="image-outline" size={18} color="#4CAF50" />
            <Text style={styles.creatorActionLabel}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.creatorActionBtn} onPress={() => setCreatorVisible(true)}>
            <Icon name="videocam-outline" size={18} color="#FF9800" />
            <Text style={styles.creatorActionLabel}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.creatorActionBtn} onPress={() => setCreatorVisible(true)}>
            <Icon name="document-text-outline" size={18} color="#2196F3" />
            <Text style={styles.creatorActionLabel}>Text</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Community" 
        rightIcon="create-outline"
        onRightPress={() => setCreatorVisible(true)}
      />
      
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => likePost(item.id)}
            onCommentPress={() => {
              // Add mock comment dynamically for interactiveness
              addComment(item.id, 'Wow, that is amazing! Thanks for sharing this post! 😊');
            }}
            onShare={() => {}}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          ) : null
        }
      />

      {/* Post Composer Drawer */}
      <BottomSheet 
        visible={creatorVisible} 
        onClose={() => setCreatorVisible(false)}
        height={320}
      >
        <View style={styles.composerHeader}>
          <Text style={styles.composerTitle}>Create Post</Text>
          <TouchableOpacity onPress={() => setCreatorVisible(false)}>
            <Icon name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TextInput
          value={newPostText}
          onChangeText={setNewPostText}
          placeholder="Share your thoughts, stories, or tips with the matrimonial community..."
          placeholderTextColor={Colors.textLight}
          multiline
          maxLength={280}
          style={styles.composerInput}
          autoFocus
        />

        <View style={styles.composerFooter}>
          <Text style={styles.charCount}>{newPostText.length}/280</Text>
          <Button
            title="Publish Post"
            onPress={handleCreatePost}
            variant="primary"
            size="sm"
            disabled={newPostText.trim() === ''}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  listHeader: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  creatorCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.soft,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorInputCue: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: Sizes.radiusLg,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginLeft: Spacing.md,
  },
  creatorCueText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textLight,
  },
  creatorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  creatorActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  creatorActionLabel: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  loader: {
    marginVertical: Spacing.lg,
  },

  // Composer Drawer Styles
  composerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  composerTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
  },
  composerInput: {
    flex: 1,
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.text,
    textAlignVertical: 'top',
    paddingVertical: Spacing.md,
  },
  composerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  charCount: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textLight,
  },
});

export default CommunityScreen;
