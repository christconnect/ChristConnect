import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal as RNModal, 
  ViewStyle, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Sizes, Spacing, Shadows, Typography } from '../../theme/theme';
import Avatar from '../Avatar';
import Button from '../Buttons';

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  onChat: () => void;
  myAvatar: string;
  partnerAvatar: string;
  partnerName: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  onClose,
  onChat,
  myAvatar,
  partnerAvatar,
  partnerName,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Heart Crown Icon */}
          <View style={styles.iconWrapper}>
            <Icon name="heart-circle" size={80} color={Colors.primary} style={styles.heartIcon} />
          </View>

          {/* Big Header */}
          <Text style={styles.title}>It's a Match!</Text>
          <Text style={styles.subtitle}>
            You and <Text style={styles.boldText}>{partnerName}</Text> have liked each other.
          </Text>

          {/* Overlapping Avatars */}
          <View style={styles.avatarRow}>
            <Avatar imageUrl={myAvatar} size={110} style={styles.myAvatar} hasBorder borderColor={Colors.white} />
            <View style={styles.heartConnector}>
              <Icon name="heart" size={24} color={Colors.white} />
            </View>
            <Avatar imageUrl={partnerAvatar} size={110} style={styles.partnerAvatar} hasBorder borderColor={Colors.white} />
          </View>

          {/* Action Buttons */}
          <Button
            title={`Chat with ${partnerName.split(' ')[0]}`}
            onPress={onChat}
            variant="primary"
            size="lg"
            style={styles.actionButton}
          />

          <Button
            title="Keep Exploring"
            onPress={onClose}
            variant="outline"
            size="md"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </RNModal>
  );
};

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CustomModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.baseModalContainer, style]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

// Internal Touchable wrapper to prevent warning
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusXl,
    padding: Spacing.xxl,
    width: '100%',
    alignItems: 'center',
    ...Shadows.dark,
  },
  iconWrapper: {
    marginBottom: Spacing.sm,
  },
  heartIcon: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    ...Typography.heading,
    fontSize: 32,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.sm,
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xxl,
    width: '100%',
  },
  myAvatar: {
    marginRight: -16,
    ...Shadows.medium,
  },
  partnerAvatar: {
    marginLeft: -16,
    ...Shadows.medium,
  },
  heartConnector: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.soft,
  },
  actionButton: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  cancelButton: {
    width: '100%',
  },

  // Base modal styles
  baseModalContainer: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    padding: Spacing.lg,
    width: '90%',
    maxHeight: '80%',
    ...Shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modalTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h4,
  },
  modalBody: {
    width: '100%',
  },
});

export default MatchModal;
