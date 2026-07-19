import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, Typography } from '../../theme/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  onMenuPress,
  onRightPress,
  rightIcon = 'notifications-outline',
  notificationCount = 0,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Left Side */}
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
            <Icon name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
            <Icon name="menu" size={26} color={Colors.text} />
          </TouchableOpacity>
        )}

        {/* Center Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {/* Right Side */}
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
          <Icon name={rightIcon} size={24} color={Colors.text} />
          {rightIcon === 'notifications-outline' && notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
    color: Colors.text,
  },
  badgeContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    ...Typography.heading,
    fontSize: 9,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default Header;
