import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, logout } = useAppStore();

  const menuItems = [
    { id: 'edit_profile', label: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { id: 'account_settings', label: 'Account Settings', icon: 'key-outline' },
    { id: 'preferences', label: 'Preferences', icon: 'color-wand-outline' },
    { id: 'privacy_security', label: 'Privacy & Security', icon: 'shield-checkmark-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'help_support', label: 'Help & Support', icon: 'help-circle-outline' },
    { id: 'about_us', label: 'About Us', icon: 'information-circle-outline' },
  ];

  const handleItemPress = (item: typeof menuItems[0]) => {
    if (item.screen === 'EditProfile') {
      navigation.navigate('Profile'); // Redirect to profile page which hosts editing
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Settings" 
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon="notifications-outline"
        notificationCount={1}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User profile brief card */}
        <TouchableOpacity 
          style={styles.profileRowCard} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Profile')}
        >
          <Avatar imageUrl={currentUser.imageUrl} size={60} />
          <View style={styles.profileRowInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileEmail}>{currentUser.email}</Text>
            <Text style={styles.viewProfileLink}>View Profile &gt;</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        {/* Menu list */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                idx === menuItems.length - 1 ? styles.menuItemLast : {}
              ]}
              onPress={() => handleItemPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <Icon name={item.icon} size={22} color="#555555" style={{ marginRight: Spacing.md }} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Icon name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout action */}
        <TouchableOpacity 
          style={styles.logoutRow} 
          activeOpacity={0.8}
          onPress={() => logout()}
        >
          <Icon name="log-out-outline" size={22} color={Colors.primary} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Matrimonial Community App v1.0.0 (CLI)</Text>
      </ScrollView>
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
  },
  profileRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.lg,
    ...Shadows.soft,
    marginBottom: Spacing.lg,
  },
  profileRowInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
  },
  profileEmail: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textLight,
    marginTop: 2,
  },
  viewProfileLink: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusXl,
    ...Shadows.soft,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.text,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusXl,
    paddingVertical: Spacing.md + 2,
    marginTop: Spacing.md,
    ...Shadows.soft,
  },
  logoutText: {
    ...Typography.heading,
    color: Colors.primary,
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  versionText: {
    ...Typography.body,
    fontSize: Typography.sizes.caption,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
});

export default SettingsScreen;
