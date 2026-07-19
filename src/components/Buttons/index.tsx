import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TextStyle, 
  ViewStyle, 
  Pressable, 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Colors, Spacing, Sizes, Shadows, Typography } from '../../theme/theme';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeScale?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  activeScale = 0.94,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(activeScale, { damping: 10, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    }
  };

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    
    // Variant styles
    if (variant === 'primary') {
      list.push(styles.primary);
    } else if (variant === 'secondary') {
      list.push(styles.secondary);
    } else if (variant === 'outline') {
      list.push(styles.outline);
    } else if (variant === 'icon') {
      list.push(styles.iconOnly);
    }

    // Size styles
    if (variant !== 'icon') {
      if (size === 'sm') {
        list.push(styles.sm);
      } else if (size === 'lg') {
        list.push(styles.lg);
      } else {
        list.push(styles.md);
      }
    }

    if (disabled) {
      list.push(styles.disabled);
    }

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];
    
    if (variant === 'primary') {
      list.push(styles.textPrimary);
    } else if (variant === 'secondary') {
      list.push(styles.textSecondary);
    } else if (variant === 'outline') {
      list.push(styles.textOutline);
    }

    if (size === 'sm') {
      list.push(styles.textSm);
    } else if (size === 'lg') {
      list.push(styles.textLg);
    }

    return list;
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[getContainerStyle(), animatedStyle, style]}
    >
      {icon && icon}
      {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.radiusLg,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.soft,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  iconOnly: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    ...Shadows.soft,
  },
  md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Sizes.radiusMd,
  },
  lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Sizes.radiusXl,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
    textAlign: 'center',
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.primary,
  },
  textOutline: {
    color: Colors.primary,
  },
  textSm: {
    fontSize: Typography.sizes.bodyMedium,
  },
  textLg: {
    fontSize: Typography.sizes.h4,
  },
});

export default Button;
