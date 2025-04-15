// Simulated backend API for messages
// In a real application, this would make HTTP requests to a backend server

// Get conversations from localStorage or initialize with sample data
const getConversationsFromStorage = () => {
    const storedData = localStorage.getItem("conversations")
  
    if (storedData) {
      return JSON.parse(storedData)
    }
  
    // Sample data if none exists in storage
    const sampleData = [
      {
        id: "conv1",
        participant: {
          id: "user1",
          name: "Renuka Singh",
          email: "renuka@example.com",
          role: "Sprinter",
        },
        lastMessage: "Good point!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        unreadCount: 0,
        archived: false,
      },
      {
        id: "conv2",
        participant: {
          id: "user2",
          name: "Thanusha K",
          email: "thanusha@example.com",
          role: "Sprinter",
        },
        lastMessage: "Hi, How are you today?",
        lastMessageTime: new Date(Date.now() - 1000 * 60).toISOString(), // 1 minute ago
        unreadCount: 2,
        archived: false,
      },
      {
        id: "conv3",
        participant: {
          id: "user3",
          name: "Personal Trainer",
          email: "coach@example.com",
          role: "Coach",
        },
        lastMessage: "I hope you are doing well!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        unreadCount: 1,
        archived: false,
      },
      {
        id: "conv4",
        participant: {
          id: "user4",
          name: "Amlan Borgohain",
          email: "amlan@example.com",
          role: "Sprinter",
        },
        lastMessage: "I hope you will win this match",
        lastMessageTime: new Date().toISOString(), // now
        unreadCount: 0,
        archived: false,
      },
      {
        id: "conv5",
        participant: {
          id: "user5",
          name: "Milkah sir Coach2",
          email: "milkah@example.com",
          role: "Coach",
        },
        lastMessage: "You: you are absolutely right!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        unreadCount: 0,
        archived: false,
      },
      {
        id: "conv6",
        participant: {
          id: "user6",
          name: "Priya",
          email: "priya@example.com",
          role: "Sprinter",
        },
        lastMessage: "Hi, How was your match",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        unreadCount: 0,
        archived: false,
      },
      {
        id: "conv7",
        participant: {
          id: "user7",
          name: "Zenia Ayrton",
          email: "zenia@example.com",
          role: "Sprinter",
        },
        lastMessage: "Okay, Great!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        unreadCount: 0,
        archived: false,
      },
    ]
  
    // Save sample data to localStorage
    localStorage.setItem("conversations", JSON.stringify(sampleData))
  
    return sampleData
  }
  
  // Get messages from localStorage or initialize with sample data
  const getMessagesFromStorage = () => {
    const storedData = localStorage.getItem("messages")
  
    if (storedData) {
      return JSON.parse(storedData)
    }
  
    // Sample data if none exists in storage
    const now = new Date()
    const sampleData = {
      conv1: [
        {
          id: "msg1",
          conversationId: "conv1",
          sender: "renuka@example.com",
          receiver: "athlete@example.com",
          content: "My sprint times aren't improving. Any tips",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: true,
        },
        {
          id: "msg2",
          conversationId: "conv1",
          sender: "athlete@example.com",
          receiver: "renuka@example.com",
          content: "Check your acceleration and recovery",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
          read: true,
        },
        {
          id: "msg3",
          conversationId: "conv1",
          sender: "renuka@example.com",
          receiver: "athlete@example.com",
          content: "Good point!",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          read: true,
        },
      ],
      conv2: [
        {
          id: "msg4",
          conversationId: "conv2",
          sender: "thanusha@example.com",
          receiver: "athlete@example.com",
          content: "Hi, How are you today?",
          timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          read: false,
        },
      ],
      conv3: [
        {
          id: "msg5",
          conversationId: "conv3",
          sender: "coach@example.com",
          receiver: "athlete@example.com",
          content: "Hi @Angel, I hope you are doing well!",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
        },
      ],
      conv4: [
        {
          id: "msg6",
          conversationId: "conv4",
          sender: "amlan@example.com",
          receiver: "athlete@example.com",
          content: "I hope you will win this match",
          timestamp: new Date().toISOString(), // now
          read: true,
        },
      ],
      conv5: [
        {
          id: "msg7",
          conversationId: "conv5",
          sender: "milkah@example.com",
          receiver: "athlete@example.com",
          content: "You are absolutely right!",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          read: true,
        },
        {
          id: "msg8",
          conversationId: "conv5",
          sender: "athlete@example.com",
          receiver: "milkah@example.com",
          content: "you are absolutely right!",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60).toISOString(), // 7 days ago + 1 minute
          read: true,
        },
      ],
      conv6: [
        {
          id: "msg9",
          conversationId: "conv6",
          sender: "priya@example.com",
          receiver: "athlete@example.com",
          content: "Hi, How was your match",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          read: true,
        },
      ],
      conv7: [
        {
          id: "msg10",
          conversationId: "conv7",
          sender: "zenia@example.com",
          receiver: "athlete@example.com",
          content: "Okay, Great!",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          read: true,
        },
      ],
    }
  
    // Save sample data to localStorage
    localStorage.setItem("messages", JSON.stringify(sampleData))
  
    return sampleData
  }
  
  // Save conversations to localStorage
  const saveConversationsToStorage = (conversations) => {
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }
  
  // Save messages to localStorage
  const saveMessagesToStorage = (messages) => {
    localStorage.setItem("messages", JSON.stringify(messages))
  }
  
  // Get all conversations for a user
  export const getConversations = async (userEmail) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const conversations = getConversationsFromStorage()
  
    // In a real app, we would filter conversations by user
    // For demo, return all conversations
    return conversations
  }
  
  // Get messages for a conversation
  export const getMessages = async (conversationId) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const allMessages = getMessagesFromStorage()
    return allMessages[conversationId] || []
  }
  
  // Send a message
  export const sendMessage = async (messageData) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const allMessages = getMessagesFromStorage()
    const conversations = getConversationsFromStorage()
  
    // Add message to conversation
    if (!allMessages[messageData.conversationId]) {
      allMessages[messageData.conversationId] = []
    }
  
    allMessages[messageData.conversationId].push(messageData)
  
    // Update conversation last message
    const conversationIndex = conversations.findIndex((c) => c.id === messageData.conversationId)
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage =
        messageData.content.length > 30 ? messageData.content.substring(0, 30) + "..." : messageData.content
      conversations[conversationIndex].lastMessageTime = messageData.timestamp
  
      // If the sender is the current user, prepend "You: " to the last message
      if (messageData.sender !== messageData.receiver) {
        conversations[conversationIndex].lastMessage = `You: ${conversations[conversationIndex].lastMessage}`
      }
    }
  
    // Save updated data
    saveMessagesToStorage(allMessages)
    saveConversationsToStorage(conversations)
  
    return messageData
  }
  
  // Mark messages as read
  export const markAsRead = async (conversationId, userEmail) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const allMessages = getMessagesFromStorage()
    const conversations = getConversationsFromStorage()
  
    // Mark all messages in the conversation as read
    if (allMessages[conversationId]) {
      allMessages[conversationId] = allMessages[conversationId].map((message) => {
        if (message.receiver === userEmail && !message.read) {
          return { ...message, read: true }
        }
        return message
      })
    }
  
    // Update conversation unread count
    const conversationIndex = conversations.findIndex((c) => c.id === conversationId)
    if (conversationIndex !== -1) {
      conversations[conversationIndex].unreadCount = 0
    }
  
    // Save updated data
    saveMessagesToStorage(allMessages)
    saveConversationsToStorage(conversations)
  
    return true
  }
  
  // Archive/unarchive a conversation
  export const toggleArchiveConversation = async (conversationId) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const conversations = getConversationsFromStorage()
  
    // Toggle archive status
    const conversationIndex = conversations.findIndex((c) => c.id === conversationId)
    if (conversationIndex !== -1) {
      conversations[conversationIndex].archived = !conversations[conversationIndex].archived
    }
  
    // Save updated data
    saveConversationsToStorage(conversations)
  
    return conversations[conversationIndex]
  }
  
  // Create a new conversation
  export const createConversation = async (userEmail, participantData) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const conversations = getConversationsFromStorage()
    const allMessages = getMessagesFromStorage()
  
    // Create new conversation
    const newConversation = {
      id: `conv${Date.now()}`,
      participant: participantData,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      archived: false,
    }
  
    // Add to conversations
    conversations.push(newConversation)
  
    // Initialize empty messages array for this conversation
    allMessages[newConversation.id] = []
  
    // Save updated data
    saveConversationsToStorage(conversations)
    saveMessagesToStorage(allMessages)
  
    return newConversation
  }
  