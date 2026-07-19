import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Button from '../../components/Buttons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  illustration: () => React.ReactNode;
}

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const slides: Slide[] = [
    {
      id: '1',
      title: 'Find Your Perfect Match',
      description: 'Discover verified profiles of like-minded individuals in your community. Swipe right to like or left to pass.',
      iconName: 'heart-circle-outline',
      iconColor: Colors.primary,
      bgColor: '#FFF5F7',
      illustration: () => (
        <View style={styles.cardIllustration}>
          <View style={[styles.illCard, styles.illCardBack]}>
            <View style={styles.illAvatarPlaceholder} />
            <View style={styles.illLineShort} />
            <View style={styles.illLineLong} />
          </View>
          <View style={[styles.illCard, styles.illCardFront]}>
            <View style={[styles.illAvatarPlaceholder, { backgroundColor: '#FFD1DC' }]} />
            <View style={[styles.illLineShort, { width: '50%' }]} />
            <View style={styles.illLineLong} />
            <View style={styles.illCardBadge}>
              <Icon name="checkmark-circle" size={16} color="#00BCD4" />
              <Text style={styles.illBadgeText}>Verified</Text>
            </View>
          </View>
          <View style={styles.swipeIconCircle}>
            <Icon name="heart" size={24} color={Colors.primary} />
          </View>
        </View>
      ),
    },
    {
      id: '2',
      title: 'Real & Verified Profiles',
      description: 'Trust is our top priority. We double-check each profile detail and verification badge, so you can connect safely.',
      iconName: 'shield-checkmark-outline',
      iconColor: '#00BCD4',
      bgColor: '#F0FDFA',
      illustration: () => (
        <View style={styles.shieldIllustration}>
          <View style={styles.pulseCircle} />
          <View style={styles.shieldIconContainer}>
            <Icon name="shield-checkmark" size={60} color="#00BCD4" />
          </View>
          <View style={[styles.verifiedMiniBadge, { top: 40, left: 30 }]}>
            <Icon name="checkmark" size={14} color="#FFF" />
          </View>
          <View style={[styles.verifiedMiniBadge, { bottom: 30, right: 20, backgroundColor: Colors.primary }]}>
            <Icon name="heart" size={12} color="#FFF" />
          </View>
        </View>
      ),
    },
    {
      id: '3',
      title: 'Share Your Moments',
      description: 'Join community groups, post photos or video updates, and celebrate your journey with family and friends.',
      iconName: 'people-outline',
      iconColor: '#4CAF50',
      bgColor: '#F4FBF7',
      illustration: () => (
        <View style={styles.feedIllustration}>
          <View style={styles.illPostCard}>
            <View style={styles.illPostHeader}>
              <View style={styles.illPostAvatar} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <View style={[styles.illLineShort, { width: '40%', height: 8 }]} />
                <View style={[styles.illLineShort, { width: '25%', height: 6, marginTop: 4 }]} />
              </View>
            </View>
            <View style={[styles.illLineLong, { height: 8, marginTop: 8 }]} />
            <View style={[styles.illLineLong, { width: '80%', height: 8, marginTop: 4 }]} />
            <View style={styles.illPostImagePlaceholder}>
              <Icon name="image-outline" size={24} color="#CBD5E1" />
            </View>
            <View style={styles.illPostFooter}>
              <Icon name="heart" size={14} color={Colors.primary} />
              <Icon name="chatbubble" size={12} color="#94A3B8" style={{ marginLeft: 12 }} />
            </View>
          </View>
        </View>
      ),
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
        <View style={styles.illustrationContainer}>
          {item.illustration()}
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Icon name={item.iconName} size={28} color={item.iconColor} />
            <Text style={styles.slideTitle}>{item.title}</Text>
          </View>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Icon name="heart" size={22} color={Colors.primary} />
          <Text style={styles.logoText}>Christ Connect</Text>
        </View>
        {activeIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FlatList slider */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.sliderList}
      />

      {/* Footer Indicators and Actions */}
      <View style={styles.footer}>
        {/* Dot Pagination indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicatorDot,
                activeIndex === idx ? styles.indicatorActive : {},
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={activeIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={styles.actionBtn}
          textStyle={{ fontWeight: 'bold' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
    color: Colors.text,
  },
  skipBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sliderList: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  illustrationContainer: {
    width: screenWidth - Spacing.xxxl * 2,
    height: screenHeight * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  slideTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h2,
    marginLeft: Spacing.sm,
    textAlign: 'center',
  },
  slideDescription: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  actionBtn: {
    width: '100%',
  },

  // Slide 1 Custom Card Illustration CSS
  cardIllustration: {
    position: 'relative',
    width: 200,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illCard: {
    width: 150,
    height: 190,
    borderRadius: Sizes.radiusLg,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    position: 'absolute',
    ...Shadows.medium,
  },
  illCardBack: {
    transform: [{ rotate: '-8deg' }, { translateX: -15 }],
    opacity: 0.5,
    zIndex: 1,
  },
  illCardFront: {
    transform: [{ rotate: '4deg' }],
    zIndex: 2,
  },
  illAvatarPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: Sizes.radiusSm,
    backgroundColor: '#FFECEF',
    marginBottom: Spacing.sm,
  },
  illLineShort: {
    width: '60%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    marginBottom: Spacing.xs,
  },
  illLineLong: {
    width: '90%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  illCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: Spacing.md + 4,
    left: Spacing.md + 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Sizes.radiusRound,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  illBadgeText: {
    ...Typography.body,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginLeft: 2,
  },
  swipeIconCircle: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    ...Shadows.dark,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Slide 2 Shield Illustration CSS
  shieldIllustration: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    position: 'absolute',
  },
  shieldIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  verifiedMiniBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Slide 3 Feed Illustration CSS
  feedIllustration: {
    width: 220,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illPostCard: {
    width: 180,
    borderRadius: Sizes.radiusLg,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.medium,
  },
  illPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  illPostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  illPostImagePlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: Sizes.radiusSm,
    backgroundColor: '#F8FAFC',
    marginTop: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  illPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: Spacing.sm,
  },
});

export default OnboardingScreen;
