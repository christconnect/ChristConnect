import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';

export const ChatScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { chatId, profileName, profileAvatar } = route.params;
  const { chats, sendMessage } = useAppStore();
  
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Retrieve current active chat thread
  const activeChat = chats.find(c => c.id === chatId || c.profileId === chatId.replace('chat_', ''));

  // Scroll to bottom when messages load/change
  useEffect(() => {
    if (activeChat?.messages && activeChat.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeChat?.messages, activeChat?.isTyping]);

  const handleSend = () => {
    if (text.trim() === '') return;
    const threadId = activeChat ? activeChat.id : chatId;
    sendMessage(threadId, text);
    setText('');
  };

  const handleVoiceSend = () => {
    const threadId = activeChat ? activeChat.id : chatId;
    // Mock sending voice message
    sendMessage(threadId, undefined, true, '0:15');
  };

  const renderMessageItem = (msg: any) => {
    const isMe = msg.senderId === 'me';
    const isSystem = msg.senderId === 'system';

    if (isSystem) {
      return (
        <View style={styles.systemMsgContainer}>
          <Text style={styles.systemMsgText}>{msg.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.msgContainer, isMe ? styles.msgRight : styles.msgLeft]}>
        <View style={[styles.msgBubble, isMe ? styles.bubbleMe : styles.bubblePartner]}>
          {msg.isVoice ? (
            <View style={styles.voiceRow}>
              <Icon name="play" size={20} color={isMe ? Colors.white : Colors.primary} />
              <View style={styles.voiceBar} />
              <Text style={[styles.voiceDuration, isMe ? styles.textMe : styles.textPartner]}>
                {msg.voiceDuration}
              </Text>
            </View>
          ) : (
            <Text style={[styles.msgText, isMe ? styles.textMe : styles.textPartner]}>
              {msg.text}
            </Text>
          )}
          <Text style={[styles.msgTime, isMe ? styles.timeMe : styles.timePartner]}>
            {msg.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Customize Header for specific contact name */}
      <Header
        title=""
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon="ellipsis-vertical"
        onRightPress={() => {}}
      />
      
      {/* Embedded Mini-Profile Info bar in Header area */}
      <View style={styles.subHeader}>
        <Avatar imageUrl={profileAvatar} size={36} isOnline={activeChat?.isOnline} />
        <View style={styles.subHeaderInfo}>
          <Text style={styles.subHeaderName}>{profileName}</Text>
          <Text style={styles.subHeaderStatus}>
            {activeChat?.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatArea} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {activeChat?.messages && activeChat.messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={activeChat.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderMessageItem(item)}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              activeChat.isTyping ? (
                <View style={styles.typingBubbleWrapper}>
                  <View style={styles.typingBubble}>
                    <Text style={styles.typingText}>{profileName.split(' ')[0]} is typing...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        ) : (
          <View style={styles.emptyPrompt}>
            <Icon name="chatbox-ellipses-outline" size={50} color={Colors.textLight} />
            <Text style={styles.emptyPromptText}>Start a conversation. Say hello!</Text>
          </View>
        )}

        {/* Input Composer Footer */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton} onPress={handleVoiceSend}>
            <Icon name="mic-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textLight}
            style={styles.input}
            multiline
          />

          <TouchableOpacity 
            style={[styles.sendButton, text.trim() === '' ? styles.sendBtnDisabled : {}]} 
            onPress={handleSend}
            disabled={text.trim() === ''}
          >
            <Icon name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  subHeaderInfo: {
    marginLeft: Spacing.md,
  },
  subHeaderName: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
  },
  subHeaderStatus: {
    ...Typography.body,
    fontSize: Typography.sizes.caption,
    color: '#4CAF50',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messageList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    width: '100%',
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '75%',
    borderRadius: Sizes.radiusLg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    position: 'relative',
    ...Shadows.soft,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },
  bubblePartner: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  msgText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    lineHeight: 20,
  },
  textMe: {
    color: Colors.white,
  },
  textPartner: {
    color: Colors.text,
  },
  msgTime: {
    fontSize: Typography.sizes.caption - 1,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timePartner: {
    color: Colors.textLight,
  },
  systemMsgContainer: {
    alignSelf: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Sizes.radiusSm,
    marginVertical: Spacing.sm,
  },
  systemMsgText: {
    ...Typography.body,
    fontSize: Typography.sizes.caption,
    color: Colors.textSecondary,
  },
  typingBubbleWrapper: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  typingBubble: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.radiusLg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typingText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  emptyPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyPromptText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.textLight,
    marginTop: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: Sizes.radiusXl,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
    height: 24,
  },
  voiceBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#CCCCCC',
    marginHorizontal: Spacing.md,
    borderRadius: 1.5,
  },
  voiceDuration: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
  },
});

export default ChatScreen;
