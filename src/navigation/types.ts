import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Community: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ChatRoom: { chatId: string; profileName: string; profileAvatar: string };
  Settings: undefined;
  EditProfile: undefined;
};
