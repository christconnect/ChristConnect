export interface Profile {
  id: string;
  name: string;
  age: number;
  verified: boolean;
  profession: string;
  location: string;
  imageUrl: string;
  gallery: string[];
  bio: string;
  followers: number;
  following: number;
  matchesCount: number;
  interests: string[];
  category: 'Online' | 'New' | 'Premium' | 'Nearby' | 'All';
  email: string;
  height: string;
  motherTongue: string;
  religion: string;
}

export interface PostComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  time: string;
  text: string;
  images: string[];
  videoThumbnail?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  likedByMe: boolean;
  comments: PostComment[];
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  text?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  profileId: string;
  profileName: string;
  profileAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
}

// 30 High-Quality Profiles with premium Unsplash photos
export const MOCK_PROFILES: Profile[] = Array.from({ length: 30 }, (_, index) => {
  const id = `profile_${index + 1}`;
  const names = [
    'Aarav Sharma', 'Ananya Patel', 'Kabir Mehta', 'Diya Iyer', 'Rohan Verma',
    'Ishaan Gupta', 'Mira Nair', 'Aditya Reddy', 'Sanya Kapoor', 'Dev Sen',
    'Kavya Rao', 'Arjun Singh', 'Rhea Malhotra', 'Neil Joshi', 'Pooja Trivedi',
    'Siddharth Bose', 'Tara Deshmukh', 'Vikram Gill', 'Nisha Roy', 'Rahul Saxena',
    'Zoya Khan', 'Varun Bhatia', 'Avani Kulkarni', 'Karan Johar', 'Meera Singhal',
    'Rishabh Pant', 'Kriti Sanon', 'Ayushmann Khurrana', 'Shraddha Kapoor', 'Hrithik Roshan'
  ];
  
  const professions = [
    'Software Architect', 'Product Manager', 'Data Scientist', 'Pediatrician', 'Investment Banker',
    'UX Designer', 'Creative Director', 'Cardiologist', 'Marketing Head', 'Aerospace Engineer',
    'Research Scientist', 'Chartered Accountant', 'Fashion Designer', 'Management Consultant', 'Architect',
    'Biotech Consultant', 'Dentist', 'Civil Servant', 'Journalist', 'Entrepreneur',
    'Digital Marketer', 'Content Creator', 'Chef & Restaurateur', 'Corporate Lawyer', 'UX Researcher',
    'FinTech Analyst', 'Environmentalist', 'AI Engineer', 'Strategy Lead', 'Product Designer'
  ];

  const locations = [
    'Mumbai, MH', 'Bengaluru, KA', 'Delhi, DL', 'Hyderabad, TG', 'Pune, MH',
    'Chennai, TN', 'Kolkata, WB', 'Ahmedabad, GJ', 'Gurugram, HR', 'Noida, UP'
  ];

  const religions = ['Hindu', 'Sikh', 'Muslim', 'Christian', 'Jain'];
  const tongues = ['Hindi', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'English'];

  const categories: Profile['category'][] = ['Online', 'New', 'Premium', 'Nearby'];
  const currentCategory = categories[index % categories.length];

  const imageIds = [
    'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330',
    'photo-1500648767791-00dcc994a43e', 'photo-1438761681033-6461ffad8d80',
    'photo-1472099645785-5658abf4ff4e', 'photo-1544005313-94ddf0286df2',
    'photo-1517841905240-472988babdf9', 'photo-1539571696357-5a69c17a67c6',
    'photo-1534528741775-53994a69daeb', 'photo-1506794778202-cad84cf45f1d',
    'photo-1524504388940-b1c1722653e1', 'photo-1501196354995-cbb51c65aaea',
    'photo-1488426862026-3ee34a7d66df', 'photo-1519085360753-af0119f7cbe7',
    'photo-1522075469751-3a6694fb2f61', 'photo-1548142813-c348350df52b',
    'photo-1508214751196-bcfd4ca60f91', 'photo-1519345182560-3f2917c472ef',
    'photo-1531746020798-e6953c6e8e04', 'photo-1506803682981-6e718a9dd3ee',
    'photo-1500048993953-d23a436266cf', 'photo-1513956589380-bad6acb9b9d4',
    'photo-1554151228-14d9def656e4', 'photo-1537368910025-700350fe46c7',
    'photo-1519699047748-de8e457a634e', 'photo-1529626455594-4ff0802cfb7e',
    'photo-1492562080023-ab3db95bfbce', 'photo-1489980508314-941910ded1f4',
    'photo-1521119989659-a83eee488004', 'photo-1527980965255-d3b416303d12'
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400'
  ];

  return {
    id,
    name: names[index],
    age: 24 + (index % 8),
    verified: index % 3 !== 2,
    profession: professions[index],
    location: locations[index % locations.length],
    imageUrl: `https://images.unsplash.com/${imageIds[index % imageIds.length]}?q=80&w=500&auto=format&fit=crop`,
    gallery: galleryImages,
    bio: `Dynamic professional passionate about my career, fitness, and reading. Looking for a life partner who values mutual support, laughter, and building a meaningful future together. Let's connect!`,
    followers: 120 + (index * 12),
    following: 95 + (index * 8),
    matchesCount: 15 + (index * 2),
    interests: ['Travel', 'Cooking', 'Fitness', 'Music', 'Photography', 'Technology', 'Reading'].slice(0, 3 + (index % 4)),
    category: currentCategory,
    email: `${names[index].toLowerCase().replace(/\s/g, '')}@gmail.com`,
    height: `${5 + (index % 2)}'${6 + (index % 6)}"`,
    motherTongue: tongues[index % tongues.length],
    religion: religions[index % religions.length],
  };
});

// 50 Community Posts
export const MOCK_POSTS: CommunityPost[] = Array.from({ length: 50 }, (_, index) => {
  const id = `post_${index + 1}`;
  const profile = MOCK_PROFILES[index % MOCK_PROFILES.length];
  
  const postTexts = [
    'Just captured this beautiful sunrise during my morning run. Wishing everyone a blessed and productive week ahead! 🌅✨ #MorningMotivation #Sunrise',
    'Had an amazing discussion today on scalable software designs. Continuous learning is the key to building robust systems. 🚀💻 #DeveloperLife #TechTalk',
    'Cooked traditional home-style food today! There is a special magic in family recipes. Anyone else loves cooking over the weekend? 🍛❤️ #HomeChef #SundayVibes',
    'Attended a beautiful wedding ceremony last night. Seeing two souls unite in commitment is always so heartwarming! 💍🌸 #Matrimony #LoveAndCommitment',
    'Taking a quick break from corporate life to enjoy this peaceful mountain view. Nature always restores the soul. 🏔️🍂 #Wanderlust #NatureLover',
    'What are the three most important qualities you look for in a life partner? For me, it is honesty, ambition, and a good sense of humor. 🌟 Let’s discuss!',
    'Celebrating a milestone at work today! Hard work pays off. Grateful for an supportive team. 🎉💼 #CareerMilestone #Blessed',
    'A beautiful book quote for today: "The best thing to hold onto in life is each other." Happy reading! 📚❤️ #Inspiration #ReadingList',
    'Spent the evening volunteering at the local community center. Giving back is the greatest joy. 🤝💛 #CommunityFirst #Kindness',
    'Exploring the vibrant local markets in Jaipur this weekend! The colors and culture here are absolutely breathtaking. 🕌🛍️ #TravelDiaries #Culture'
  ];

  const postImages = [
    ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600'],
    ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600'],
    ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=600', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600'],
    [],
  ];

  const selectedImages = postImages[index % postImages.length];
  const commentsList: PostComment[] = [
    {
      id: `c_${id}_1`,
      userName: MOCK_PROFILES[(index + 1) % MOCK_PROFILES.length].name,
      userAvatar: MOCK_PROFILES[(index + 1) % MOCK_PROFILES.length].imageUrl,
      text: 'This is absolutely beautiful! Thanks for sharing.',
      time: '2h ago',
    },
    {
      id: `c_${id}_2`,
      userName: MOCK_PROFILES[(index + 2) % MOCK_PROFILES.length].name,
      userAvatar: MOCK_PROFILES[(index + 2) % MOCK_PROFILES.length].imageUrl,
      text: 'Totally agree with your thoughts on this.',
      time: '1h ago',
    }
  ];

  return {
    id,
    userId: profile.id,
    userName: profile.name,
    userAvatar: profile.imageUrl,
    time: `${(index % 12) + 1}h ago`,
    text: postTexts[index % postTexts.length],
    images: selectedImages,
    videoThumbnail: index % 5 === 0 ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600' : undefined,
    likes: 10 + (index * 5),
    commentsCount: commentsList.length,
    shares: 2 + (index % 3),
    likedByMe: index % 4 === 0,
    comments: commentsList,
  };
});

// 20 Mutual Matches
export const MOCK_MATCHES: Match[] = Array.from({ length: 20 }, (_, index) => {
  const id = `match_${index + 1}`;
  // Pick from the mid-to-late section of profiles
  const profile = MOCK_PROFILES[(index + 5) % MOCK_PROFILES.length];
  return {
    id,
    profile,
    matchedAt: `${(index % 6) + 1} days ago`,
  };
});

// 25 Pre-built Chats
export const MOCK_CHATS: ChatThread[] = Array.from({ length: 25 }, (_, index) => {
  const id = `chat_${index + 1}`;
  const profile = MOCK_PROFILES[index % MOCK_PROFILES.length];
  
  const lastMessages = [
    'Hey! Would love to connect and talk more.',
    'Sounds good. Let me check my schedule for this weekend.',
    'Sure, I will let my parents know as well! 😊',
    'Voice Message (0:12)',
    'Hello! How has your week been?',
    'Awesome, talk to you later.',
    'Yes, I live in Bengaluru.',
    'Are you online? I had a quick question.',
  ];

  const lastMessageText = lastMessages[index % lastMessages.length];
  const messages: ChatMessage[] = [
    {
      id: `${id}_m1`,
      senderId: profile.id,
      text: 'Hello, glad we matched!',
      timestamp: '10:30 AM',
    },
    {
      id: `${id}_m2`,
      senderId: 'me',
      text: 'Hi there! Same here. What do you do?',
      timestamp: '10:32 AM',
    },
    {
      id: `${id}_m3`,
      senderId: profile.id,
      text: lastMessageText.startsWith('Voice') ? undefined : lastMessageText,
      isVoice: lastMessageText.startsWith('Voice'),
      voiceDuration: lastMessageText.startsWith('Voice') ? '0:12' : undefined,
      timestamp: '10:35 AM',
    }
  ];

  return {
    id,
    profileId: profile.id,
    profileName: profile.name,
    profileAvatar: profile.imageUrl,
    lastMessage: lastMessageText,
    lastMessageTime: `${10 + (index % 12)}:${15 + (index * 2 % 45)} ${index % 2 === 0 ? 'AM' : 'PM'}`,
    unreadCount: index % 5 === 0 ? 2 : 0,
    isOnline: index % 3 === 0,
    isTyping: index % 6 === 0,
    messages,
  };
});
