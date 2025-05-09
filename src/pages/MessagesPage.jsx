"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import {
  getAthleteProfile,
  getConversations,
  getMessages,
  markAsRead,
  toggleArchiveConversation,
  createConversation,
} from "../api/messages";
import { Phone, PinIcon, MoreVertical, Smile, Paperclip, Send, X, ChevronDown } from "lucide-react";
import PageHeader from "../components/PageHeader";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
  autoConnect: false,
});

const MessagesPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [athleteData, setAthleteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState("open");
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (currentUser?.email) {
      socket.connect();
      socket.emit("join", currentUser.email);

      socket.on("receive_message", (message) => {
        // Only process messages for the current user
        if (message.sender !== currentUser?.email && message.receiver !== currentUser?.email) {
          return;
        }
        
        // Update messages array if this is for the active conversation
        if (message.conversationId === activeConversation?._id) {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            if (!prev.some((msg) => msg._id === message._id)) {
              // Get stored messages from localStorage
              const { messages: storedMessages } = loadFromLocalStorage();
              // Update localStorage with new message
              saveToLocalStorage(conversations, [...storedMessages, message], activeConversation._id);
              return [...prev, message];
            }
            return prev;
          });
        }

        // Update conversation unread count and last message
        setConversations((prevConversations) =>
          prevConversations.map((conv) => {
            if (conv._id === message.conversationId) {
              // Only increment unread count if not the active conversation
              const newUnreadCount = conv._id !== activeConversation?._id ? (conv.unreadCount || 0) + 1 : conv.unreadCount;
              
              return { 
                ...conv, 
                unreadCount: newUnreadCount,
                lastMessage: message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content,
                lastMessageTime: message.timestamp
              };
            }
            return conv;
          })
        );
      });

      socket.on("user_status", ({ userId, status }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [userId]: status === "online",
        }));
      });

      socket.on("typing", ({ userEmail }) => {
        if (activeConversation?.participants.find((p) => p.email === userEmail)) {
          setTypingUsers((prev) => ({ ...prev, [userEmail]: true }));
        }
      });

      socket.on("stop_typing", () => {
        setTypingUsers((prev) => {
          const newTyping = { ...prev };
          delete newTyping[activeConversation?.participants.find((p) => p.email !== currentUser.email)?.email];
          return newTyping;
        });
      });

      socket.on("messages_read", ({ conversationId }) => {
        if (conversationId === activeConversation?._id) {
          setMessages((prev) =>
            prev.map((msg) => (msg.conversationId === conversationId && !msg.read ? { ...msg, read: true } : msg))
          );
        }
      });

      socket.on("error", ({ message }) => {
        setError(message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [currentUser?.email, activeConversation]);

  // Handle typing events
  useEffect(() => {
    let typingTimeout;

    const handleTyping = () => {
      if (activeConversation && newMessage.trim()) {
        socket.emit("typing", {
          conversationId: activeConversation._id,
          userEmail: currentUser.email,
        });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          socket.emit("stop_typing", { conversationId: activeConversation._id });
        }, 2000);
      }
    };

    const inputElement = messageInputRef.current;
    inputElement?.addEventListener("input", handleTyping);

    return () => {
      inputElement?.removeEventListener("input", handleTyping);
      clearTimeout(typingTimeout);
    };
  }, [newMessage, activeConversation, currentUser.email]);

  // Create default conversations if none exist
  const createDefaultConversations = () => {
    // Define multiple sports personalities and coaches
    const defaultProfiles = [
      {
        id: 'coach-alex',
        email: 'coach.alex@athlixir.com',
        name: 'Coach Alex',
        role: 'Head Fitness Coach',
        specialty: 'general fitness',
        avatar: 'https://ui-avatars.com/api/?name=Coach+Alex&background=0D8ABC&color=fff',
        greeting: 'Welcome to Athlixir! I\'m Coach Alex, your personal fitness assistant.',
        followUp: 'How can I help you today? Feel free to ask about training plans, nutrition advice, or any sports-related questions!',
        additionalMessages: [
          'I noticed you\'ve been making great progress with your training schedule. Keep it up!',
          'By the way, we have a new fitness assessment tool available. Would you like to schedule a session to evaluate your current fitness level?'
        ]
      },
      {
        id: 'coach-priya',
        email: 'priya@athlixir.com',
        name: 'Priya Sharma',
        role: 'Sprint Coach',
        specialty: 'sprinting',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=FF5733&color=fff',
        greeting: 'Hi there! I\'m Priya Sharma, former national sprint champion and now a dedicated sprint coach.',
        followUp: 'Looking to improve your sprint technique or prepare for a competition? I can help you with specialized training programs!',
        additionalMessages: [
          'I just reviewed your last sprint session data. Your start reaction time has improved by 0.15 seconds!',
          'We should focus on your acceleration phase next. I have some specific drills that can help you generate more power in the first 30 meters.'
        ]
      },
      {
        id: 'coach-rahul',
        email: 'rahul@athlixir.com',
        name: 'Rahul Dravid',
        role: 'Cricket Coach',
        specialty: 'cricket',
        avatar: 'https://ui-avatars.com/api/?name=Rahul+Dravid&background=27AE60&color=fff',
        greeting: 'Greetings! I\'m Rahul, your cricket coach and mentor here at Athlixir.',
        followUp: 'Whether you\'re working on your batting technique, bowling skills, or overall cricket strategy, I\'m here to guide you. What aspect of cricket would you like to focus on?',
        additionalMessages: [
          'I analyzed your batting stance from our last session. Your balance looks good, but we could work on your backlift to generate more power.',
          'Have you watched the video analysis I sent you? It shows how slight adjustments to your grip can improve your shot placement.'
        ]
      },
      {
        id: 'coach-sarah',
        email: 'sarah@athlixir.com',
        name: 'Sarah Johnson',
        role: 'Nutrition Specialist',
        specialty: 'nutrition',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=9B59B6&color=fff',
        greeting: 'Hello! I\'m Sarah Johnson, sports nutrition specialist at Athlixir.',
        followUp: 'Proper nutrition is crucial for athletic performance. I can help you develop a personalized nutrition plan that supports your training goals. What sport are you currently focused on?',
        additionalMessages: [
          'I\'ve prepared a new pre-workout meal plan based on your latest metabolic assessment. Would you like me to send it over?',
          'Remember to track your hydration levels during intense training sessions. Proper hydration can significantly impact your performance and recovery.'
        ]
      },
      {
        id: 'coach-mike',
        email: 'mike@athlixir.com',
        name: 'Mike Chen',
        role: 'Strength & Conditioning',
        specialty: 'strength',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=F1C40F&color=fff',
        greeting: 'Hey there! I\'m Mike Chen, your strength and conditioning coach.',
        followUp: 'Ready to build some serious strength and power? I specialize in helping athletes develop the physical capabilities they need to excel in their sport. What are your current strength goals?',
        additionalMessages: [
          'Your squat form has improved significantly! Now let\'s focus on increasing your one-rep max safely over the next few weeks.',
          'I\'ve updated your strength program with some new compound movements that will help develop functional strength for your sport.'
        ]
      }
    ];

    // Create conversations from profiles
    const conversations = [];
    const allMessages = [];
    
    defaultProfiles.forEach((profile, index) => {
      // Create conversation object
      const conversation = {
        _id: `default-conversation-${profile.id}`,
        participants: [
          {
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
            role: profile.role
          },
          {
            email: currentUser?.email || 'user@example.com',
            name: currentUser?.name || 'User',
            avatar: currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=3498DB&color=fff',
            role: 'Athlete'
          }
        ],
        lastMessage: profile.followUp,
        lastMessageTime: new Date(Date.now() - (index * 10 * 60 * 1000)).toISOString(),
        unreadCount: 1
      };
      
      // Create messages for this conversation
      const messages = [
        {
          _id: `default-msg-${profile.id}-1`,
          conversationId: `default-conversation-${profile.id}`,
          sender: profile.email,
          receiver: currentUser?.email || 'user@example.com',
          content: profile.greeting,
          timestamp: new Date(Date.now() - (24 * 60 * 60 * 1000) - (index * 30 * 60 * 1000)).toISOString(),
          read: true
        },
        {
          _id: `default-msg-${profile.id}-2`,
          conversationId: `default-conversation-${profile.id}`,
          sender: profile.email,
          receiver: currentUser?.email || 'user@example.com',
          content: profile.followUp,
          timestamp: new Date(Date.now() - (index * 10 * 60 * 1000)).toISOString(),
          read: false
        }
      ];
      
      // Add additional messages if available
      if (profile.additionalMessages && profile.additionalMessages.length > 0) {
        profile.additionalMessages.forEach((content, msgIndex) => {
          messages.push({
            _id: `default-msg-${profile.id}-additional-${msgIndex + 1}`,
            conversationId: `default-conversation-${profile.id}`,
            sender: profile.email,
            receiver: currentUser?.email || 'user@example.com',
            content: content,
            timestamp: new Date(Date.now() - (index * 5 * 60 * 1000) - (msgIndex * 2 * 60 * 1000)).toISOString(),
            read: false
          });
        });
      }
      
      conversations.push(conversation);
      allMessages.push(...messages);
    });

    // Return all messages along with filtered messages for the first conversation
    return { 
      conversations, 
      messages: allMessages.filter(msg => msg.conversationId === conversations[0]._id),
      allMessages // Return all messages for localStorage
    };
  };

  // Auto-reply function for the default conversations
  const generateAutoReply = (message, coachId) => {
    const messageText = message.toLowerCase();
    
    // Extract coach specialty from the conversation ID
    const getCoachSpecialty = () => {
      if (!coachId) return 'general fitness';
      
      const specialtyMap = {
        'coach-alex': 'general fitness',
        'coach-priya': 'sprinting',
        'coach-rahul': 'cricket',
        'coach-sarah': 'nutrition',
        'coach-mike': 'strength'
      };
      
      return specialtyMap[coachId] || 'general fitness';
    };
    
    const specialty = getCoachSpecialty();
    
    // Common responses for all coaches
    if (messageText.includes('hi') || messageText.includes('hello')) {
      return "Hi there! How can I help you with your training today?";
    } else if (messageText.includes('thank')) {
      return "You're welcome! I'm here to support your athletic journey. Let me know if you need anything else.";
    }
    
    // Specialized responses based on coach expertise
    switch (specialty) {
      case 'general fitness':
        const generalResponses = [
          "That's a great question! I recommend starting with a 10-minute warm-up before any intense training session.",
          "Based on your profile, I think you'd benefit from our new balanced training program. Would you like more details?",
          "Have you tried interval training? It's excellent for improving your endurance and speed.",
          "Remember to stay hydrated during your workouts! Aim for at least 500ml of water per hour of exercise.",
          "Your progress has been impressive! Keep up the good work and consistency.",
          "I've just updated your training schedule for next week. Would you like to review it now?",
          "Rest days are just as important as training days. Make sure you're giving your body time to recover.",
          "Have you considered joining our upcoming virtual fitness challenge? It would be a great way to test your progress!",
          "Let me know if you need any modifications to your current workout plan."
        ];
        
        if (messageText.includes('training') || messageText.includes('workout')) {
          return "I have several training programs that might work for you. What specific goals are you looking to achieve?";
        } else if (messageText.includes('injury') || messageText.includes('pain')) {
          return "I'm sorry to hear that. It's important to address injuries properly. Could you describe what you're experiencing so I can suggest appropriate recovery strategies?";
        } else {
          return generalResponses[Math.floor(Math.random() * generalResponses.length)];
        }
        
      case 'sprinting':
        const sprintResponses = [
          "Sprint training requires proper form. Make sure you're driving your arms and maintaining a slight forward lean.",
          "For sprinters, I recommend focusing on explosive power exercises like plyometrics and Olympic lifts.",
          "Have you tried block starts? They're essential for improving your acceleration phase.",
          "Your stride length and frequency are key factors in sprint performance. We should analyze your running mechanics.",
          "Recovery between sprint sets is crucial. I recommend a 1:4 work-to-rest ratio for maximum performance.",
          "Core strength is vital for sprinters. It helps maintain proper posture and prevents energy leakage during sprints."
        ];
        
        if (messageText.includes('technique') || messageText.includes('form')) {
          return "Sprint technique is all about efficiency. The key elements are a powerful start, high knee drive, proper arm action, and relaxed upper body. Would you like me to analyze your current technique?";
        } else if (messageText.includes('race') || messageText.includes('competition')) {
          return "Pre-race preparation is crucial! Make sure you have a proper warm-up routine, stay hydrated, and visualize your race. How soon is your competition?";
        } else {
          return sprintResponses[Math.floor(Math.random() * sprintResponses.length)];
        }
        
      case 'cricket':
        const cricketResponses = [
          "Cricket is as much mental as it is physical. Developing focus and concentration is key to success.",
          "For batting improvement, I recommend starting with stance and grip fundamentals before moving to more complex shots.",
          "Bowling requires a smooth, repeatable action. Let's work on your run-up and delivery stride for consistency.",
          "Fielding drills should be part of every practice session. Quick reactions and safe hands win matches!",
          "Match strategy varies based on format. Are you focusing on Test, ODI, or T20 cricket?",
          "Recovery between matches is essential, especially for fast bowlers. How's your current recovery protocol?"
        ];
        
        if (messageText.includes('batting') || messageText.includes('bat')) {
          return "Batting is all about watching the ball and making good decisions. Are you having trouble with a specific type of bowling or shot selection?";
        } else if (messageText.includes('bowling') || messageText.includes('bowl')) {
          return "For bowling improvement, we need to focus on your action, line and length, and variations. What type of bowler are you - pace or spin?";
        } else if (messageText.includes('fielding') || messageText.includes('field')) {
          return "Fielding can win matches! Let's work on your ground fielding, catching, and throwing accuracy. Which area do you feel needs the most improvement?";
        } else {
          return cricketResponses[Math.floor(Math.random() * cricketResponses.length)];
        }
        
      case 'nutrition':
        const nutritionResponses = [
          "Protein timing is important for muscle recovery. Try to consume some protein within 30 minutes after your workout.",
          "Carbohydrates are your body's primary energy source for high-intensity activities. Don't cut them out completely!",
          "Hydration affects performance significantly. Even 2% dehydration can reduce your performance by up to 20%.",
          "Micronutrients like vitamins and minerals are just as important as macros. Aim for a colorful diet with plenty of fruits and vegetables.",
          "Pre-workout nutrition should focus on easily digestible carbs and moderate protein about 1-2 hours before training.",
          "Recovery nutrition is key - aim for a 3:1 or 4:1 carb to protein ratio after intense sessions."
        ];
        
        if (messageText.includes('diet') || messageText.includes('meal')) {
          return "A well-balanced diet for athletes typically includes lean proteins, complex carbohydrates, healthy fats, and plenty of fruits and vegetables. Would you like me to create a personalized meal plan based on your training schedule?";
        } else if (messageText.includes('supplement') || messageText.includes('protein')) {
          return "Supplements can be helpful, but they should complement a solid nutrition foundation, not replace it. What specific supplements are you considering?";
        } else if (messageText.includes('weight') || messageText.includes('fat')) {
          return "Body composition changes should be approached carefully for athletes. Rapid weight loss can compromise performance and recovery. What are your specific goals?";
        } else {
          return nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)];
        }
        
      case 'strength':
        const strengthResponses = [
          "Compound movements like squats, deadlifts, and bench press give you the most bang for your buck in strength training.",
          "Progressive overload is key to strength gains. Are you tracking your lifts to ensure you're making progress?",
          "Rest periods between sets are crucial for strength training. For heavy lifts, aim for 3-5 minutes of recovery.",
          "Form is everything in strength training. I'd rather see perfect technique with lighter weights than poor form with heavy ones.",
          "Periodization helps prevent plateaus in your strength training. We should cycle your training intensity and volume.",
          "Don't neglect unilateral exercises - they help correct imbalances and prevent injury."
        ];
        
        if (messageText.includes('lift') || messageText.includes('weight')) {
          return "When it comes to lifting weights, technique should always come before load. What specific lifts are you working on currently?";
        } else if (messageText.includes('muscle') || messageText.includes('build')) {
          return "Building muscle requires a combination of progressive overload, adequate protein intake, and sufficient recovery. How many days per week are you currently training?";
        } else if (messageText.includes('program') || messageText.includes('routine')) {
          return "A well-designed strength program should include push, pull, and leg movements, with appropriate progression and deload periods. Would you like me to review your current routine?";
        } else {
          return strengthResponses[Math.floor(Math.random() * strengthResponses.length)];
        }
        
      default:
        const defaultResponses = [
          "That's an interesting question! Let me know more about your specific goals so I can provide better guidance.",
          "I'm here to help with any aspect of your athletic development. What area would you like to focus on?",
          "Every athlete's journey is unique. What specific challenges are you facing in your training right now?",
          "Success comes from consistency and smart training. How has your training been going lately?",
          "I'd be happy to provide more personalized advice. Could you tell me more about your current fitness routine?"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  };

  // Load conversations and messages from localStorage
  const loadFromLocalStorage = () => {
    try {
      // Load conversations
      const storedConversations = localStorage.getItem('athlixir_conversations');
      const storedMessages = localStorage.getItem('athlixir_messages');
      const storedActiveConversationId = localStorage.getItem('athlixir_active_conversation');
      
      let parsedConversations = storedConversations ? JSON.parse(storedConversations) : [];
      let parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
      
      return {
        conversations: parsedConversations,
        messages: parsedMessages,
        activeConversationId: storedActiveConversationId
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return { conversations: [], messages: [], activeConversationId: null };
    }
  };
  
  // Save conversations and messages to localStorage
  const saveToLocalStorage = (conversations, messages, activeConversationId) => {
    try {
      localStorage.setItem('athlixir_conversations', JSON.stringify(conversations));
      localStorage.setItem('athlixir_messages', JSON.stringify(messages));
      if (activeConversationId) {
        localStorage.setItem('athlixir_active_conversation', activeConversationId);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Fetch athlete data and conversations
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          setLoading(true);
          const athleteProfile = await getAthleteProfile(currentUser.email);
          setAthleteData(athleteProfile);

          // Check localStorage first
          const { conversations: storedConversations, messages: storedMessages, activeConversationId } = loadFromLocalStorage();
          
          if (storedConversations.length > 0) {
            // Use stored conversations and messages
            setConversations(storedConversations);
            
            // Find the active conversation
            const activeConv = storedConversations.find(conv => conv._id === activeConversationId) || storedConversations[0];
            setActiveConversation(activeConv);
            
            // Filter messages for active conversation
            const activeMessages = storedMessages.filter(msg => msg.conversationId === activeConv._id);
            setMessages(activeMessages);
          } else {
            // Try to fetch from API
            try {
              const conversationsData = await getConversations(currentUser.email);
              
              if (conversationsData.length > 0) {
                setConversations(conversationsData);
                setActiveConversation(conversationsData[0]);
              } else {
                // Create default conversations if no conversations exist
                const { conversations, messages, allMessages } = createDefaultConversations();
                setConversations(conversations);
                setActiveConversation(conversations[0]);
                setMessages(messages);
                
                // Save to localStorage
                saveToLocalStorage(conversations, allMessages, conversations[0]._id);
              }
            } catch (apiError) {
              console.error("Error fetching conversations from API:", apiError);
              
              // Create default conversations as fallback
              const { conversations, messages, allMessages } = createDefaultConversations();
              setConversations(conversations);
              setActiveConversation(conversations[0]);
              setMessages(messages);
              
              // Save to localStorage
              saveToLocalStorage(conversations, allMessages, conversations[0]._id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        
        // Create default conversations on error as fallback
        const { conversations, messages, allMessages } = createDefaultConversations();
        setConversations(conversations);
        setActiveConversation(conversations[0]);
        setMessages(messages);
        
        // Save to localStorage
        saveToLocalStorage(conversations, allMessages, conversations[0]._id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        // For default conversations, use local storage or create new ones
        if (activeConversation._id.startsWith('default-conversation')) {
          const { messages: storedMessages } = loadFromLocalStorage();
          const conversationMessages = storedMessages.filter(msg => msg.conversationId === activeConversation._id);
          
          if (conversationMessages.length > 0) {
            setMessages(conversationMessages);
          } else {
            // If no messages in localStorage, create them
            const { allMessages } = createDefaultConversations();
            const newMessages = allMessages.filter(msg => msg.conversationId === activeConversation._id);
            setMessages(newMessages);
            
            // Update localStorage with these messages
            const { messages: existingMessages } = loadFromLocalStorage();
            saveToLocalStorage(conversations, [...existingMessages, ...newMessages], activeConversation._id);
          }
          
          // Mark as read if needed
          if (activeConversation.unreadCount > 0) {
            const updatedConversations = conversations.map(conv => 
              conv._id === activeConversation._id ? { ...conv, unreadCount: 0 } : conv
            );
            setConversations(updatedConversations);
            saveToLocalStorage(updatedConversations, messages, activeConversation._id);
          }
        } else {
          // For real conversations, fetch from API
          try {
            const messagesData = await getMessages(activeConversation._id);
            setMessages(messagesData);

            if (activeConversation.unreadCount > 0) {
              socket.emit("mark_as_read", {
                conversationId: activeConversation._id,
                userEmail: currentUser?.email,
              });
              
              const updatedConversations = conversations.map(conv => 
                conv._id === activeConversation._id ? { ...conv, unreadCount: 0 } : conv
              );
              setConversations(updatedConversations);
              
              // Update localStorage
              saveToLocalStorage(updatedConversations, messagesData, activeConversation._id);
            }
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        }
      }
    };

    fetchMessages();
  }, [activeConversation, conversations, messages, currentUser]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save conversations and messages to localStorage when they change
  useEffect(() => {
    if (conversations.length > 0 && activeConversation) {
      const { messages: storedMessages } = loadFromLocalStorage();
      saveToLocalStorage(conversations, storedMessages, activeConversation._id);
    }
  }, [conversations, activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    // Create message object with unique ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      conversationId: activeConversation._id,
      sender: currentUser?.email || 'user@example.com',
      receiver: activeConversation.participants.find(p => p.email !== (currentUser?.email || 'user@example.com'))?.email,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      _id: messageId,
    };

    // Clear input field immediately to prevent duplicate sends
    setNewMessage("");
    
    // Get stored messages from localStorage
    const { messages: storedMessages } = loadFromLocalStorage();
    
    // Check if this is a default conversation
    if (activeConversation._id.startsWith('default-conversation')) {
      // Extract coach ID from conversation ID
      const coachId = activeConversation._id.split('-').slice(2).join('-');
      // Get coach email from participants
      const coachEmail = activeConversation.participants.find(p => p.email !== (currentUser?.email || 'user@example.com')).email;
      
      // Add message to UI only after checking it doesn't already exist
      setMessages((prev) => {
        if (!prev.some(msg => msg._id === messageData._id)) {
          return [...prev, messageData];
        }
        return prev;
      });
      
      // Update conversation with latest message
      const updatedConversations = conversations.map((conv) =>
        conv._id === activeConversation._id
          ? {
              ...conv,
              lastMessage: newMessage.length > 30 ? newMessage.substring(0, 30) + "..." : newMessage,
              lastMessageTime: messageData.timestamp,
            }
          : conv
      );
      setConversations(updatedConversations);
      
      // Update localStorage with the new message
      saveToLocalStorage(updatedConversations, [...storedMessages, messageData], activeConversation._id);
      
      // Simulate typing indicator
      setTimeout(() => {
        setTypingUsers((prev) => ({
          ...prev,
          [coachEmail]: true,
        }));
      }, 500);

      // Generate auto-reply after delay
      setTimeout(() => {
        // Generate response based on user message and coach specialty
        const responseContent = generateAutoReply(newMessage, coachId);
        
        // Create response message with unique ID
        const responseId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const responseData = {
          conversationId: activeConversation._id,
          sender: coachEmail,
          receiver: currentUser?.email || 'user@example.com',
          content: responseContent,
          timestamp: new Date().toISOString(),
          read: true,
          _id: responseId,
        };

        // Add response to messages if it doesn't already exist
        setMessages((prev) => {
          if (!prev.some(msg => msg._id === responseData._id)) {
            return [...prev, responseData];
          }
          return prev;
        });
        
        // Update conversation with latest message
        const updatedConvs = conversations.map((conv) =>
          conv._id === activeConversation._id
            ? {
                ...conv,
                lastMessage: responseContent.length > 30 ? responseContent.substring(0, 30) + "..." : responseContent,
                lastMessageTime: responseData.timestamp,
              }
            : conv
        );
        setConversations(updatedConvs);

        // Remove typing indicator
        setTypingUsers((prev) => {
          const newTyping = { ...prev };
          delete newTyping[coachEmail];
          return newTyping;
        });
        
        // Update localStorage with both messages
        const { messages: updatedStoredMessages } = loadFromLocalStorage();
        // Check if messages already exist in localStorage before adding
        if (!updatedStoredMessages.some(msg => msg._id === responseData._id)) {
          saveToLocalStorage(updatedConvs, [...updatedStoredMessages, responseData], activeConversation._id);
        }
      }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
    } else {
      // For real conversations, emit via Socket.IO
      try {
        // Add message to UI only after checking it doesn't already exist
        setMessages((prev) => {
          if (!prev.some(msg => msg._id === messageData._id)) {
            return [...prev, messageData];
          }
          return prev;
        });
        
        // Update conversation with latest message
        const updatedConversations = conversations.map((conv) =>
          conv._id === activeConversation._id
            ? {
                ...conv,
                lastMessage: newMessage.length > 30 ? newMessage.substring(0, 30) + "..." : newMessage,
                lastMessageTime: messageData.timestamp,
              }
            : conv
        );
        setConversations(updatedConversations);
        
        // Send message via socket only once
        socket.emit("send_message", messageData);
        
        // Update localStorage if message doesn't already exist
        if (!storedMessages.some(msg => msg._id === messageData._id)) {
          saveToLocalStorage(updatedConversations, [...storedMessages, messageData], activeConversation._id);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message");
        setMessages((prev) => prev.filter((msg) => msg._id !== messageData._id));
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return formatMessageTime(timestamp);
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "numeric", day: "numeric" });
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    
    // If this is a default conversation, filter messages for this conversation
    if (conversation._id.startsWith('default-conversation')) {
      // Get messages from localStorage first
      const { messages: storedMessages } = loadFromLocalStorage();
      const filteredMessages = storedMessages.filter(msg => msg.conversationId === conversation._id);
      
      // If no messages found, fetch them from the default conversations
      if (filteredMessages.length === 0) {
        const { allMessages } = createDefaultConversations();
        const conversationMessages = allMessages.filter(msg => msg.conversationId === conversation._id);
        setMessages(conversationMessages);
        
        // Update localStorage with these messages
        saveToLocalStorage(conversations, [...storedMessages, ...conversationMessages], conversation._id);
      } else {
        setMessages(filteredMessages);
      }
      
      // Mark messages as read when conversation is clicked
      if (conversation.unreadCount > 0) {
        // Update the conversation to remove unread count
        const updatedConversations = conversations.map(conv =>
          conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
        );
        setConversations(updatedConversations);
        
        // Mark messages as read
        const updatedMessages = filteredMessages.map(msg =>
          msg.conversationId === conversation._id ? { ...msg, read: true } : msg
        );
        setMessages(updatedMessages);
        
        // Update localStorage
        const { messages: allStoredMessages } = loadFromLocalStorage();
        const updatedStoredMessages = allStoredMessages.map(msg =>
          msg.conversationId === conversation._id ? { ...msg, read: true } : msg
        );
        saveToLocalStorage(updatedConversations, updatedStoredMessages, conversation._id);
      } else {
        // Just update active conversation in localStorage
        saveToLocalStorage(conversations, storedMessages, conversation._id);
      }
    } else {
      // For real conversations, fetch messages from API
      const fetchMessagesForConversation = async () => {
        try {
          const messagesData = await getMessages(conversation._id);
          setMessages(messagesData);
          
          // Mark messages as read via API
          if (conversation.unreadCount > 0) {
            await markAsRead(conversation._id, currentUser?.email);
            
            // Update the conversation to remove unread count
            const updatedConversations = conversations.map(conv =>
              conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
            );
            setConversations(updatedConversations);
            
            // Update localStorage
            const { messages: storedMessages } = loadFromLocalStorage();
            saveToLocalStorage(updatedConversations, [...storedMessages, ...messagesData], conversation._id);
          } else {
            // Just update localStorage with new messages and active conversation
            const { messages: storedMessages } = loadFromLocalStorage();
            saveToLocalStorage(conversations, [...storedMessages, ...messagesData], conversation._id);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          setError("Failed to load messages");
        }
      };
      
      fetchMessagesForConversation();
    }
  };

  const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);
    });

    return Object.entries(groups).map(([dateKey, messages]) => {
      const date = new Date(messages[0].timestamp);
      let label = "Today";

      if (!isToday(date)) {
        label = date.toLocaleDateString([], { month: "long", day: "numeric" });
      }

      return {
        date: label,
        messages,
      };
    });
  };

  const renderTypingIndicator = () => {
    const otherParticipant = activeConversation?.participants.find(
      (p) => p.email !== (currentUser?.email || 'user@example.com')
    );
    
    // Check if the other participant is typing
    if (otherParticipant && typingUsers[otherParticipant.email]) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic p-2">
          {otherParticipant.name} is typing...
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar activePage="messages" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Messages" athleteData={athleteData} />
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 flex">
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold dark:text-gray-100">Chat</h2>
                <button className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                  <span className="text-sm font-bold">+</span>
                </button>
              </div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-2 text-center ${
                    activeTab === "open" ? "text-gray-800 dark:text-gray-100 border-b-2 border-yellow-400 font-medium" : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setActiveTab("open")}
                >
                  Open
                </button>
                <button
                  className={`flex-1 py-2 text-center ${
                    activeTab === "archived"
                      ? "text-gray-800 dark:text-gray-100 border-b-2 border-yellow-400 font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setActiveTab("archived")}
                >
                  Archived
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations
                .filter((conv) => (activeTab === "open" ? !conv.archived : conv.archived))
                .map((conversation) => {
                  const otherParticipant = conversation.participants.find((p) => p.email !== currentUser.email);
                  return (
                    <div
                      key={conversation._id}
                      className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        activeConversation?._id === conversation._id ? "bg-gray-50 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="relative">
                        <img
                          src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${otherParticipant.name}&background=FFD700&color=fff`}
                          alt={otherParticipant.name}
                          className="h-10 w-10 rounded-full"
                        />
                        {onlineUsers[otherParticipant.email] && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{otherParticipant.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatConversationTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex-shrink-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {activeConversation ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).avatar || 
                          `https://ui-avatars.com/api/?name=${
                            activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name
                          }&background=FFD700&color=fff`
                        }
                        alt={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name}
                        className="h-10 w-10 rounded-full"
                      />
                      {onlineUsers[activeConversation.participants.find((p) => p.email !== currentUser.email).email] && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-gray-100">
                        {activeConversation.participants.find((p) => p.email !== currentUser.email).name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {onlineUsers[activeConversation.participants.find((p) => p.email !== currentUser.email).email]
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <PinIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                      <div className="flex justify-center mb-4">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">{group.date}</span>
                      </div>
                      {group.messages.map((message, index) => {
                        const isCurrentUser = message.sender === currentUser.email;
                        const showAvatar = index === 0 || group.messages[index - 1].sender !== message.sender;

                        return (
                          <div
                            key={message._id}
                            className={`flex items-start mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            {!isCurrentUser && showAvatar && (
                              <img
                                src={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).avatar || 
                                  `https://ui-avatars.com/api/?name=${
                                    activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name
                                  }&background=FFD700&color=fff`
                                }
                                alt={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name}
                                className="h-8 w-8 rounded-full mr-2 flex-shrink-0"
                              />
                            )}
                            {!isCurrentUser && !showAvatar && <div className="w-10 flex-shrink-0"></div>}
                            <div className="max-w-[70%]">
                              {message.content.startsWith("Check your") ? (
                                <div className="bg-yellow-400 text-white p-3 rounded-lg">
                                  <p>{message.content}</p>
                                </div>
                              ) : message.content.startsWith("Try AI-based") ? (
                                <div className="bg-yellow-400 text-white p-3 rounded-lg">
                                  <p>{message.content}</p>
                                  <div className="flex mt-2 space-x-2">
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`p-3 rounded-lg ${
                                    isCurrentUser ? "bg-yellow-400 text-white" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-gray-100"
                                  }`}
                                >
                                  <p>{message.content}</p>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                                {formatMessageTime(message.timestamp)}
                                {isCurrentUser && message.read && <span className="ml-1">✓✓</span>}
                              </div>
                            </div>
                            {isCurrentUser && showAvatar && (
                              <img
                                src={`https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff`}
                                alt="You"
                                className="h-8 w-8 rounded-full ml-2 flex-shrink-0"
                              />
                            )}
                            {isCurrentUser && !showAvatar && <div className="w-10 flex-shrink-0"></div>}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {renderTypingIndicator()}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write your message..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none dark:bg-gray-700 dark:text-gray-100"
                        rows={1}
                      ></textarea>
                      <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-full ${
                        newMessage.trim()
                          ? "bg-yellow-400 text-white hover:bg-yellow-500"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                  <p className="text-gray-500 mt-1">Choose a conversation from the list or start a new one</p>
                </div>
              </div>
            )}
          </div>
          {showUserInfo && activeConversation && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">User Info</h2>
                <button onClick={() => setShowUserInfo(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 flex flex-col items-center">
                <img
                  src={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).avatar || 
                    `https://ui-avatars.com/api/?name=${
                      activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name
                    }&background=FFD700&color=fff&size=128`
                  }
                  alt={activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name}
                  className="h-24 w-24 rounded-full mb-3"
                />
                <h3 className="text-lg font-medium dark:text-gray-100">
                  {activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeConversation.participants.find((p) => p.email !== (currentUser?.email || 'user@example.com')).role || "Sprinter"}
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-500">Athlixir</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium mb-3 dark:text-gray-100">Community</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=RunChamp&background=FFD700&color=fff"
                      alt="RunChamp Community"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">RunChamp Community</h4>
                      <p className="text-xs text-gray-500">Keep Moving!!! Born To Run...</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=ProRunners&background=FFD700&color=fff"
                      alt="ProRunners Club"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">ProRunners Club</h4>
                      <p className="text-xs text-gray-500">Tomorrow Is The Match!!</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=Beyond&background=FFD700&color=fff"
                      alt="Beyond Miles"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">Beyond Miles</h4>
                      <p className="text-xs text-gray-500">Get ready to book this match</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=Runners&background=FFD700&color=fff"
                      alt="Runners Network"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">Runners Network</h4>
                      <p className="text-xs text-gray-500">Choose Comfortable Shoes</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-sm text-yellow-500 hover:text-yellow-600 font-medium">See All</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;