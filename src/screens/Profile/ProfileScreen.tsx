import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import { ScreenDimensions } from '../../utils/dimensions';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import BottomSheet from '../../components/BottomSheet';
import Button from '../../components/Buttons';
import { TextInput } from '../../components/Inputs';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, updateCurrentUser } = useAppStore();

  const [editVisible, setEditVisible] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio);
  const [profession, setProfession] = useState(currentUser.profession);

  const handleSave = () => {
    updateCurrentUser({ name, email, bio, profession });
    setEditVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="My Profile" 
        rightIcon="settings-outline"
        onRightPress={() => navigation.navigate('Settings')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <Avatar imageUrl={currentUser.imageUrl} size={110} hasBorder borderColor={Colors.primary} />
          
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{currentUser.name}</Text>
            <Icon name="checkmark-circle" size={20} color="#00BCD4" style={styles.verifiedIcon} />
          </View>
          
          <Text style={styles.professionText}>{currentUser.profession}</Text>
          <Text style={styles.locationText}>{currentUser.location}</Text>

          {/* Edit Profile Button */}
          <Button
            title="Edit Profile"
            onPress={() => {
              // Pre-fill form fields
              setName(currentUser.name);
              setEmail(currentUser.email);
              setBio(currentUser.bio);
              setProfession(currentUser.profession);
              setEditVisible(true);
            }}
            variant="outline"
            size="sm"
            style={styles.editBtn}
          />
        </View>

        {/* Statistics Dashboard counts */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{currentUser.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{currentUser.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{currentUser.matchesCount}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        {/* About section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>{currentUser.bio}</Text>
        </View>

        {/* Interest tags */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsGrid}>
            {currentUser.interests.map((interest, idx) => (
              <View key={idx} style={styles.interestChip}>
                <Text style={styles.interestChipLabel}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Photo Gallery */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Gallery</Text>
          <View style={styles.galleryGrid}>
            {currentUser.gallery.map((photo, idx) => (
              <FastImage
                key={idx}
                source={{ uri: photo }}
                style={styles.galleryImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile drawer */}
      <BottomSheet 
        visible={editVisible} 
        onClose={() => setEditVisible(false)}
        height={ScreenDimensions.height * 0.65}
      >
        <View style={styles.editHeader}>
          <Text style={styles.editTitle}>Edit Details</Text>
          <TouchableOpacity onPress={() => setEditVisible(false)}>
            <Icon name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.editForm}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Rahul Khanna"
          />

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="rahul.khanna@company.com"
          />

          <TextInput
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            placeholder="UX Researcher"
          />

          <TextInput
            label="About bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Short details about yourself..."
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={styles.saveBtn}
          />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  profileHeaderCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.soft,
    marginBottom: Spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  nameText: {
    ...Typography.heading,
    fontSize: Typography.sizes.h3,
  },
  verifiedIcon: {
    marginLeft: Spacing.sm,
  },
  professionText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  locationText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textLight,
    marginTop: 2,
  },
  editBtn: {
    marginTop: Spacing.lg,
    minWidth: 140,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    paddingVertical: Spacing.lg,
    ...Shadows.soft,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statCount: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '60%',
    alignSelf: 'center',
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.lg,
    ...Shadows.soft,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
    marginBottom: Spacing.md,
  },
  aboutText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.secondary,
    borderRadius: Sizes.radiusRound,
  },
  interestChipLabel: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.primary,
    fontWeight: '500',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  galleryImage: {
    width: (ScreenDimensions.width - Spacing.lg * 2 - Spacing.lg * 2 - Spacing.sm * 2) / 3,
    height: 100,
    borderRadius: Sizes.radiusSm,
  },

  // Edit sheet styles
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  editTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
  },
  editForm: {
    flex: 1,
    marginTop: Spacing.lg,
  },
  saveBtn: {
    marginVertical: Spacing.xl,
  },
});

export default ProfileScreen;
