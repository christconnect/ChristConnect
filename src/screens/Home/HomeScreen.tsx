import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { 
  GestureHandlerRootView, 
  GestureDetector, 
  Gesture 
} from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS, 
  withTiming 
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Typography, Shadows } from '../../theme/theme';
import { ScreenDimensions } from '../../utils/dimensions';
import Header from '../../components/Header';
import SearchBar from '../../components/Inputs';
import { ProfileCard } from '../../components/Cards';
import { MatchModal } from '../../components/Modal';

const SWIPE_THRESHOLD = ScreenDimensions.width * 0.45;

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { 
    profiles, 
    swipedProfileIds, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery, 
    swipeLeft, 
    swipeRight,
    currentUser
  } = useAppStore();

  const [matchVisible, setMatchVisible] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);

  // Filter profiles based on search query, active category, and exclusion of swiped ids
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // 1. Exclude swiped profiles
      if (swipedProfileIds.includes(profile.id)) return false;
      
      // 2. Filter by Category
      if (activeCategory !== 'All' && profile.category !== activeCategory) return false;
      
      // 3. Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = profile.name.toLowerCase().includes(query);
        const matchesProfession = profile.profession.toLowerCase().includes(query);
        const matchesLoc = profile.location.toLowerCase().includes(query);
        return matchesName || matchesProfession || matchesLoc;
      }
      
      return true;
    });
  }, [profiles, swipedProfileIds, activeCategory, searchQuery]);

  // Card Swiper States
  const currentCard = filteredProfiles[filteredProfiles.length - 1]; // Top of stack
  const nextCard = filteredProfiles[filteredProfiles.length - 2]; // Underneath card

  // Gesture shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipeAction = (direction: 'left' | 'right', profileId: string) => {
    if (direction === 'left') {
      swipeLeft(profileId);
    } else {
      const res = swipeRight(profileId);
      if (res?.isMatch && res.matchedProfile) {
        setMatchedProfile(res.matchedProfile);
        setMatchVisible(true);
      }
    }
    // Reset position values
    translateX.value = 0;
    translateY.value = 0;
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        // Animate off screen
        translateX.value = withTiming(
          event.translationX > 0 ? ScreenDimensions.width * 1.5 : -ScreenDimensions.width * 1.5,
          { duration: 200 },
          () => {
            if (currentCard) {
              runOnJS(handleSwipeAction)(direction, currentCard.id);
            }
          }
        );
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = `${(translateX.value / ScreenDimensions.width) * 20}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate },
      ],
    };
  });

  const triggerSwipeBtn = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    
    translateX.value = withTiming(
      direction === 'right' ? ScreenDimensions.width * 1.5 : -ScreenDimensions.width * 1.5,
      { duration: 250 },
      () => {
        runOnJS(handleSwipeAction)(direction, currentCard.id);
      }
    );
  };

  // Categories configurations matching Figma style
  const categories = [
    { name: 'All', icon: 'people', isIcon: true },
    { name: 'Online', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', badgeColor: '#4CAF50' },
    { name: 'New', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', badgeColor: '#FF5A7D' },
    { name: 'Premium', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
    { name: 'Nearby', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Home" 
        notificationCount={2}
        onRightPress={() => navigation.navigate('Messages')}
      />

      <View style={styles.content}>
        {/* Search Input bar */}
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

        {/* Categories Avatar List */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={styles.categoryItem}
                  onPress={() => setActiveCategory(cat.name)}
                >
                  <View 
                    style={[
                      styles.categoryCircle,
                      isActive && styles.categoryCircleActive,
                    ]}
                  >
                    {cat.isIcon ? (
                      <Icon 
                        name={cat.icon || ''} 
                        size={24} 
                        color={isActive ? Colors.primary : Colors.textSecondary} 
                      />
                    ) : (
                      <FastImage 
                        source={{ uri: cat.imageUrl }} 
                        style={styles.categoryAvatarImage}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                    {cat.badgeColor && (
                      <View style={[styles.categoryBadgeDot, { backgroundColor: cat.badgeColor }]} />
                    )}
                  </View>
                  <Text 
                    style={[
                      styles.categoryLabel, 
                      isActive && styles.categoryLabelActive,
                      cat.name === 'Online' && { color: '#4CAF50' }
                    ]}
                  >
                    {cat.name === 'Online' ? '• Online' : cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Swiper Deck Frame */}
        <GestureHandlerRootView style={styles.swiperFrame}>
          {currentCard ? (
            <View style={styles.cardContainer}>
              {/* Back Card (Shows next profile card under current one) */}
              {nextCard && (
                <View style={[styles.backCardWrapper, StyleSheet.absoluteFill]}>
                  <ProfileCard
                    profile={nextCard}
                    onPress={() => {}}
                  />
                </View>
              )}

              {/* Front Card (Active swipe gesture) */}
              <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.frontCardWrapper, StyleSheet.absoluteFill, animatedCardStyle]}>
                  <ProfileCard
                    profile={currentCard}
                    onPress={() => {}}
                  />
                </Animated.View>
              </GestureDetector>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="search-circle-outline" size={80} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No more profiles found</Text>
              <Text style={styles.emptySubtitle}>
                Try widening your search or changing categories to find more connections.
              </Text>
            </View>
          )}
        </GestureHandlerRootView>

        {/* Bottom Floating Control Actions */}
        {currentCard && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionCross]} 
              onPress={() => triggerSwipeBtn('left')}
            >
              <Icon name="close" size={28} color="#FF3B30" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionChat]} 
              onPress={() => {
                navigation.navigate('ChatRoom', {
                  chatId: `chat_${currentCard.id}`,
                  profileName: currentCard.name,
                  profileAvatar: currentCard.imageUrl,
                });
              }}
            >
              <Icon name="chatbubble" size={24} color="#00BCD4" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionLike]} 
              onPress={() => triggerSwipeBtn('right')}
            >
              <Icon name="heart" size={28} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Match Confirmation Modal */}
      {matchedProfile && (
        <MatchModal
          visible={matchVisible}
          onClose={() => setMatchVisible(false)}
          onChat={() => {
            setMatchVisible(false);
            navigation.navigate('ChatRoom', {
              chatId: `chat_${matchedProfile.id}`,
              profileName: matchedProfile.name,
              profileAvatar: matchedProfile.imageUrl,
            });
          }}
          myAvatar={currentUser.imageUrl}
          partnerAvatar={matchedProfile.imageUrl}
          partnerName={matchedProfile.name}
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
  content: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.lg,
  },
  categoriesContainer: {
    marginVertical: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.lg + 2,
  },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
    position: 'relative',
  },
  categoryCircleActive: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  categoryAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryBadgeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  categoryLabel: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  categoryLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  swiperFrame: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  backCardWrapper: {
    transform: [{ scale: 0.96 }, { translateY: 10 }],
    opacity: 0.85,
  },
  frontCardWrapper: {
    zIndex: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  actionCross: {
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionChat: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.1)',
  },
  actionLike: {
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
});

export default HomeScreen;
