import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  Pressable, 
  StyleProp, 
  ViewStyle, 
  TouchableOpacity 
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Colors, Spacing, Sizes, Shadows, Typography } from '../../theme/theme';
import Avatar from '../Avatar';
import { Profile, CommunityPost, ChatThread } from '../../constants/mockData';

const { width: screenWidth } = Dimensions.get('window');

// 1. PROFILE SWIPER CARD
interface ProfileCardProps {
  profile: Profile;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={[styles.profileCard, style]}>
      {/* Cover Image */}
      <FastImage
        source={{ uri: profile.imageUrl, priority: FastImage.priority.high }}
        style={styles.profileCardImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      {/* SVG Gradient Overlay for text readability */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.5" stopColor={Colors.gradientStart} stopOpacity="0" />
              <Stop offset="0.9" stopColor={Colors.gradientEnd} stopOpacity="0.85" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      {/* Top Badges */}
      <View style={styles.profileCardTopRow}>
        <View style={[styles.badge, profile.category === 'Online' ? styles.badgeOnline : styles.badgeNew]}>
          <Text style={styles.badgeText}>{profile.category === 'Online' ? 'Online' : 'New'}</Text>
        </View>
        <TouchableOpacity style={styles.heartButton} activeOpacity={0.8}>
          <Icon name="heart" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Content Overlay */}
      <View style={styles.profileCardBottom}>
        <View style={styles.profileCardNameRow}>
          <Text style={styles.profileCardName}>{profile.name}, {profile.age}</Text>
          {profile.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark-circle" size={18} color={Colors.primary} />
            </View>
          )}
        </View>
        <Text style={styles.profileCardProfession}>{profile.profession}</Text>
        <View style={styles.profileCardLocationRow}>
          <Icon name="location-outline" size={14} color={Colors.white} />
          <Text style={styles.profileCardLocation}>{profile.location}</Text>
        </View>
      </View>
    </Pressable>
  );
};

// 2. COMMUNITY POST CARD
interface PostCardProps {
  post: CommunityPost;
  onLike: () => void;
  onCommentPress: () => void;
  onShare: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onCommentPress, onShare }) => {
  const renderImageGrid = () => {
    if (!post.images || post.images.length === 0) return null;

    const count = post.images.length;
    if (count === 1) {
      return (
        <FastImage 
          source={{ uri: post.images[0] }} 
          style={styles.postSingleImage} 
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }

    if (count === 2) {
      return (
        <View style={styles.postImageGridTwo}>
          <FastImage 
            source={{ uri: post.images[0] }} 
            style={styles.postGridHalf} 
            resizeMode={FastImage.resizeMode.cover}
          />
          <FastImage 
            source={{ uri: post.images[1] }} 
            style={styles.postGridHalf} 
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      );
    }

    // Split Layout for count >= 3
    const showMore = count > 3;
    return (
      <View style={styles.splitGridContainer}>
        {/* Left Side: Large Image */}
        <FastImage 
          source={{ uri: post.images[0] }} 
          style={styles.splitGridLeft} 
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Right Side: Two Stacked Images */}
        <View style={styles.splitGridRight}>
          <FastImage 
            source={{ uri: post.images[1] }} 
            style={styles.splitGridRightItem} 
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.splitGridRightItemContainer}>
            <FastImage 
              source={{ uri: post.images[2] }} 
              style={styles.splitGridRightItem} 
              resizeMode={FastImage.resizeMode.cover}
            />
            {showMore && (
              <View style={styles.moreOverlay}>
                <Text style={styles.moreOverlayText}>+{count - 3}</Text>
              </View>
            )}
            {!showMore && (
              <View style={styles.moreOverlay}>
                <Text style={styles.moreOverlayText}>+3</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Avatar imageUrl={post.userAvatar} size={42} />
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postAuthorName}>{post.userName}</Text>
          <View style={styles.postTimeRow}>
            <Text style={styles.postTime}>{post.time}</Text>
            <Icon name="globe-outline" size={12} color={Colors.textLight} style={{ marginLeft: 4 }} />
          </View>
        </View>
        <TouchableOpacity style={styles.postMenuBtn}>
          <Icon name="ellipsis-horizontal" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Text Body */}
      <Text style={styles.postText}>{post.text}</Text>

      {/* Media Content */}
      {renderImageGrid()}

      {/* Video Thumbnail (Fallback preview) */}
      {post.videoThumbnail && (
        <View style={styles.videoContainer}>
          <FastImage 
            source={{ uri: post.videoThumbnail }} 
            style={styles.postVideoThumbnail} 
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.playButtonOverlay}>
            <Icon name="play" size={30} color={Colors.white} />
          </View>
        </View>
      )}

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Action Footer */}
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.postAction} onPress={onLike}>
          <Icon 
            name={post.likedByMe ? "heart" : "heart-outline"} 
            size={22} 
            color={post.likedByMe ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[styles.postActionText, post.likedByMe && { color: Colors.primary }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} onPress={onCommentPress}>
          <Icon name="chatbubble-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.postActionText}>{post.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} onPress={onShare}>
          <Icon name="share-social-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.postActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 3. MUTUAL MATCH GRID CARD
interface MatchCardProps {
  profile: Profile;
  matchedAt: string;
  onPress: () => void;
  onChatPress: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ profile, matchedAt, onPress, onChatPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.matchCard}>
      <FastImage
        source={{ uri: profile.imageUrl }}
        style={styles.matchCardImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.matchCardBottom}>
        <Text style={styles.matchCardName} numberOfLines={1}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.matchCardProfession} numberOfLines={1}>
          {profile.profession}
        </Text>
        <View style={styles.matchCardFooter}>
          <Text style={styles.matchCardDate}>{matchedAt}</Text>
          <TouchableOpacity style={styles.matchChatButton} onPress={onChatPress}>
            <Icon name="chatbubble" size={12} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

// 4. CHAT ITEM CARD
interface ChatItemCardProps {
  chat: ChatThread;
  onPress: () => void;
}

export const ChatItemCard: React.FC<ChatItemCardProps> = ({ chat, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.chatCard}>
      <Avatar imageUrl={chat.profileAvatar} size={54} isOnline={chat.isOnline} />
      <View style={styles.chatCardContent}>
        <View style={styles.chatCardHeader}>
          <Text style={styles.chatCardName} numberOfLines={1}>{chat.profileName}</Text>
          <Text style={styles.chatCardTime}>{chat.lastMessageTime}</Text>
        </View>
        <View style={styles.chatCardSubrow}>
          {chat.isTyping ? (
            <Text style={styles.typingIndicator}>Typing...</Text>
          ) : (
            <Text style={styles.chatCardLastMsg} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
          )}
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Swiper Profile Card Styles
  profileCard: {
    width: '100%',
    height: '100%',
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    ...Shadows.dark,
  },
  profileCardImage: {
    width: '100%',
    height: '100%',
  },
  profileCardTopRow: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Sizes.radiusRound,
  },
  badgeOnline: {
    backgroundColor: '#4CAF50',
  },
  badgeNew: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.white,
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  profileCardBottom: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: Spacing.xl,
    right: Spacing.xl,
    zIndex: 10,
  },
  profileCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCardName: {
    ...Typography.heading,
    color: Colors.white,
    fontSize: Typography.sizes.h2,
  },
  verifiedBadge: {
    marginLeft: Spacing.sm,
  },
  profileCardProfession: {
    ...Typography.body,
    color: '#DDDDDD',
    fontSize: Typography.sizes.bodyLarge,
    marginTop: Spacing.xs,
  },
  profileCardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  profileCardLocation: {
    ...Typography.body,
    color: Colors.white,
    fontSize: Typography.sizes.bodyMedium,
    marginLeft: Spacing.xs,
  },

  // Post Card Styles
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.soft,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  postAuthorName: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
  },
  postTime: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textLight,
  },
  postMenuBtn: {
    padding: Spacing.xs,
  },
  postText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.text,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  postSingleImage: {
    width: '100%',
    height: 200,
    borderRadius: Sizes.radiusMd,
    marginTop: Spacing.md,
  },
  postImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  postGridImage: {
    borderRadius: Sizes.radiusSm,
  },
  postGridHalf: {
    flex: 1,
    height: '100%',
  },
  postGridQuarter: {
    width: (screenWidth - Spacing.lg * 2 - Spacing.md * 2 - Spacing.sm * 2) / 3 - 2,
    height: 90,
  },
  postTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  splitGridContainer: {
    flexDirection: 'row',
    height: 180,
    marginTop: Spacing.md,
    borderRadius: Sizes.radiusMd,
    overflow: 'hidden',
    gap: 4,
  },
  splitGridLeft: {
    flex: 1.2,
    height: '100%',
  },
  splitGridRight: {
    flex: 1,
    height: '100%',
    gap: 4,
  },
  splitGridRightItem: {
    flex: 1,
    width: '100%',
  },
  splitGridRightItemContainer: {
    flex: 1,
    position: 'relative',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOverlayText: {
    ...Typography.heading,
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
  },
  postImageGridTwo: {
    flexDirection: 'row',
    height: 140,
    marginTop: Spacing.md,
    borderRadius: Sizes.radiusMd,
    overflow: 'hidden',
    gap: 6,
  },
  videoContainer: {
    position: 'relative',
    marginTop: Spacing.md,
    borderRadius: Sizes.radiusMd,
    overflow: 'hidden',
  },
  postVideoThumbnail: {
    width: '100%',
    height: 200,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    marginLeft: Spacing.sm,
  },

  // Match Grid Card Styles
  matchCard: {
    width: (screenWidth - Spacing.lg * 3) / 2, // 2 column layout
    borderRadius: Sizes.radiusLg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    marginBottom: Spacing.lg,
    ...Shadows.soft,
  },
  matchCardImage: {
    width: '100%',
    height: 150,
  },
  matchCardBottom: {
    padding: Spacing.md,
  },
  matchCardName: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyMedium,
  },
  matchCardProfession: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    marginTop: Spacing.xs,
  },
  matchCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  matchCardDate: {
    ...Typography.body,
    fontSize: Typography.sizes.caption,
    color: Colors.textLight,
  },
  matchChatButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chat Item Card Styles
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatCardContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chatCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatCardName: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
    maxWidth: '70%',
  },
  chatCardTime: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textLight,
  },
  chatCardSubrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  chatCardLastMsg: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
    maxWidth: '85%',
  },
  typingIndicator: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.primary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Sizes.radiusRound,
  },
  unreadBadgeText: {
    ...Typography.heading,
    fontSize: Typography.sizes.caption,
    color: Colors.white,
  },
});

export default ProfileCard;
