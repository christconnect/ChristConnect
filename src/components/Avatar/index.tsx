import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../theme/theme';

interface AvatarProps {
  imageUrl?: string;
  size?: number;
  isOnline?: boolean;
  hasBorder?: boolean;
  borderColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  size = 50,
  isOnline = false,
  hasBorder = false,
  borderColor = Colors.primary,
  style,
}) => {
  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2 },
    hasBorder && { borderWidth: 2, borderColor },
    style,
  ];

  const dotSize = Math.max(10, size * 0.22);

  return (
    <View style={containerStyle}>
      {imageUrl ? (
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.high }}
          style={[styles.image, { borderRadius: size / 2 }]}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Icon name="person" size={size * 0.5} color={Colors.textLight} />
      )}
      {isOnline && (
        <View 
          style={[
            styles.onlineDot, 
            { 
              width: dotSize, 
              height: dotSize, 
              borderRadius: dotSize / 2,
              bottom: 0,
              right: 0,
            }
          ]} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: '#4CAF50', // Success green
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Avatar;
