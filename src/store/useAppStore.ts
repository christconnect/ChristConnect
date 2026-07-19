import { create } from 'zustand';
import { 
  Profile, 
  CommunityPost, 
  Match, 
  ChatThread, 
  ChatMessage, 
  MOCK_PROFILES, 
  MOCK_POSTS, 
  MOCK_MATCHES, 
  MOCK_CHATS 
} from '../constants/mockData';

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
  bio: string;
  followers: number;
  following: number;
  matchesCount: number;
  interests: string[];
  height: string;
  religion: string;
  motherTongue: string;
  profession: string;
  location: string;
  gallery: string[];
}

interface AppState {
  // Data lists
  profiles: Profile[];
  posts: CommunityPost[];
  matches: Match[];
  chats: ChatThread[];
  
  // Active states
  swipedProfileIds: string[];
  currentUser: UserProfile;
  activeCategory: string;
  searchQuery: string;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  completeOnboarding: () => void;
  login: (email: string) => void;
  logout: () => void;
  
  // Home swipe actions
  swipeLeft: (profileId: string) => void;
  swipeRight: (profileId: string) => { isMatch: boolean; matchedProfile?: Profile } | void;
  
  // Community actions
  createPost: (text: string, images: string[]) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, commentText: string) => void;
  
  // Message actions
  sendMessage: (chatId: string, text?: string, isVoice?: boolean, voiceDuration?: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  
  // Profile actions
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profiles: MOCK_PROFILES,
  posts: MOCK_POSTS,
  matches: MOCK_MATCHES,
  chats: MOCK_CHATS,
  swipedProfileIds: [],
  currentUser: {
    name: 'Neha Singh',
    email: 'neha.singh123@gmail.com',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500',
    bio: 'Lead UX Researcher, coffee enthusiast, and amateur photographer. Looking for an independent, smart, and caring partner to share life\'s adventures.',
    followers: 245,
    following: 180,
    matchesCount: 20,
    interests: ['Photography', 'Coffee Tasting', 'Hiking', 'Jazz Music', 'Indian Cuisine'],
    height: '5\'4"',
    religion: 'Hindu',
    motherTongue: 'Hindi',
    profession: 'Software Engineer',
    location: 'Bangalore, Karnataka',
    gallery: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400'
    ]
  },
  activeCategory: 'All',
  searchQuery: '',
  hasCompletedOnboarding: false,
  isAuthenticated: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  login: (email) => set((state) => ({ 
    isAuthenticated: true,
    currentUser: {
      ...state.currentUser,
      email: email || state.currentUser.email
    }
  })),
  logout: () => set({ isAuthenticated: false }),

  swipeLeft: (profileId) => {
    set((state) => ({
      swipedProfileIds: [...state.swipedProfileIds, profileId],
    }));
  },

  swipeRight: (profileId) => {
    const profile = get().profiles.find((p) => p.id === profileId);
    if (!profile) return;

    set((state) => ({
      swipedProfileIds: [...state.swipedProfileIds, profileId],
    }));

    // Trigger match on every alternate swipe for mock interactivity
    const isMatch = Math.random() > 0.3; // 70% match probability
    if (isMatch) {
      const newMatch: Match = {
        id: `match_${Date.now()}`,
        profile,
        matchedAt: 'Just now',
      };

      // Add corresponding chat thread if it doesn't exist
      const existingChat = get().chats.find((c) => c.profileId === profileId);
      let updatedChats = [...get().chats];
      
      if (!existingChat) {
        const newChat: ChatThread = {
          id: `chat_${Date.now()}`,
          profileId: profile.id,
          profileName: profile.name,
          profileAvatar: profile.imageUrl,
          lastMessage: 'You matched! Say hello.',
          lastMessageTime: 'Just now',
          unreadCount: 0,
          isOnline: true,
          isTyping: false,
          messages: [
            {
              id: `m_${Date.now()}`,
              senderId: 'system',
              text: `You matched with ${profile.name}!`,
              timestamp: 'Just now',
            }
          ]
        };
        updatedChats = [newChat, ...updatedChats];
      }

      set((state) => ({
        matches: [newMatch, ...state.matches],
        chats: updatedChats,
        currentUser: {
          ...state.currentUser,
          matchesCount: state.currentUser.matchesCount + 1,
        }
      }));

      return { isMatch: true, matchedProfile: profile };
    }
    
    return { isMatch: false };
  },

  createPost: (text, images) => {
    const user = get().currentUser;
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: 'me',
      userName: user.name,
      userAvatar: user.imageUrl,
      time: 'Just now',
      text,
      images,
      likes: 0,
      commentsCount: 0,
      shares: 0,
      likedByMe: false,
      comments: [],
    };

    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likedByMe: !post.likedByMe,
            likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    }));
  },

  addComment: (postId, commentText) => {
    const user = get().currentUser;
    const newComment = {
      id: `c_${Date.now()}`,
      userName: user.name,
      userAvatar: user.imageUrl,
      text: commentText,
      time: 'Just now',
    };

    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    }));
  },

  sendMessage: (chatId, text, isVoice, voiceDuration) => {
    const messageId = `msg_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: messageId,
      senderId: 'me',
      text,
      isVoice,
      voiceDuration,
      timestamp,
    };

    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: isVoice ? `Voice Message (${voiceDuration})` : (text || ''),
            lastMessageTime: timestamp,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      }),
    }));

    // Trigger typing simulator and mock reply after 1.5 seconds
    setTimeout(() => {
      get().setTyping(chatId, true);
      
      setTimeout(() => {
        get().setTyping(chatId, false);
        const replyId = `msg_${Date.now()}`;
        const replyTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const replies = [
          'Wow, that sounds interesting! Tell me more.',
          'Haha that is so cool! 😄',
          'I would love to meet up or call sometimes. When are you free?',
          'Thanks! How about you?',
          'Sounds good to me.',
          'Let me think about it and get back to you! 👍'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMessage: ChatMessage = {
          id: replyId,
          senderId: 'partner', // Representing the other user
          text: randomReply,
          timestamp: replyTimestamp,
        };

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                lastMessage: randomReply,
                lastMessageTime: replyTimestamp,
                messages: [...chat.messages, replyMessage],
              };
            }
            return chat;
          }),
        }));
      }, 1500);
    }, 1000);
  },

  setTyping: (chatId, isTyping) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, isTyping };
        }
        return chat;
      }),
    }));
  },

  updateCurrentUser: (updates) => {
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        ...updates,
      },
    }));
  },
}));
