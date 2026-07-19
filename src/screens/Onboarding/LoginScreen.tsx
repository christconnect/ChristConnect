import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Button from '../../components/Buttons';
import { TextInput } from '../../components/Inputs';

export const LoginScreen: React.FC = () => {
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const validate = () => {
    let isValid = true;
    if (!email) {
      setErrorEmail('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail('Email format is invalid');
      isValid = false;
    } else {
      setErrorEmail('');
    }

    if (!password) {
      setErrorPassword('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setErrorPassword('Password must be at least 6 characters');
      isValid = false;
    } else {
      setErrorPassword('');
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validate()) {
      login(email);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Welcome Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Icon name="heart" size={36} color={Colors.white} />
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your search for the perfect life partner
            </Text>
          </View>

          {/* Form Fields Card */}
          <View style={styles.formCard}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorEmail) setErrorEmail('');
              }}
              placeholder="Enter your email"
              icon="mail-outline"
              error={errorEmail}
              inputStyle={styles.inputField}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorPassword) setErrorPassword('');
              }}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errorPassword}
              inputStyle={styles.inputField}
            />

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              style={styles.signInBtn}
              textStyle={{ fontWeight: 'bold' }}
            />
          </View>

          {/* Social Sign In Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Icon name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Icon name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Icon name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9', // Subtle light pink background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  welcomeTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusXl,
    padding: Spacing.lg,
    ...Shadows.soft,
  },
  inputField: {
    fontSize: Typography.sizes.bodyMedium,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.xs,
  },
  forgotText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  signInBtn: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.body,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginHorizontal: Spacing.md,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
  },
  signUpLink: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
