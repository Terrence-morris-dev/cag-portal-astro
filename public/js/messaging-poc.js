// Messaging POC - localStorage Implementation
// 5 Test Users - Fully Functional Messaging

class MessagingPOC {
  constructor() {
    this.currentUserId = this.getCurrentUser();
    this.activeConversationId = null;
    this.users = this.initializeUsers();
    this.conversations = this.loadConversations();
    this.setupEventListeners();
    this.render();
  }

  // Test Users
  initializeUsers() {
    return {
      'user-1': {
        id: 'user-1',
        name: 'John Smith',
        role: 'Senior Security Engineer',
        company: 'Lockheed Martin',
        clearance: 'TS/SCI',
        avatar: '/images/avatars/default-avatar.png',
        avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        initials: 'JS',
        isOnline: true
      },
      'user-2': {
        id: 'user-2',
        name: 'Sarah Johnson',
        role: 'HR Manager',
        company: 'Northrop Grumman',
        clearance: 'Secret',
        avatar: '/images/avatars/default-avatar.png',
        avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        initials: 'SJ',
        isOnline: true
      },
      'user-3': {
        id: 'user-3',
        name: 'Mike Davis',
        role: 'Security Officer',
        company: 'Raytheon',
        clearance: 'Top Secret',
        avatar: '/images/avatars/default-avatar.png',
        avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        initials: 'MD',
        isOnline: false
      },
      'user-4': {
        id: 'user-4',
        name: 'Lisa Chen',
        role: 'Technical Recruiter',
        company: 'CAG Advisory',
        clearance: 'Secret',
        avatar: '/images/avatars/default-avatar.png',
        avatarColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        initials: 'LC',
        isOnline: true
      },
      'user-5': {
        id: 'user-5',
        name: 'Tom Wilson',
        role: 'Hiring Manager',
        company: 'General Dynamics',
        clearance: 'TS/SCI',
        avatar: '/images/avatars/default-avatar.png',
        avatarColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        initials: 'TW',
        isOnline: true
      }
    };
  }

  getCurrentUser() {
    const stored = localStorage.getItem('cag_current_user');
    return stored || 'user-1';
  }

  setCurrentUser(userId) {
    this.currentUserId = userId;
    localStorage.setItem('cag_current_user', userId);
    this.conversations = this.loadConversations();
    this.render();
  }

  loadConversations() {
    const stored = localStorage.getItem('cag_conversations');
    if (!stored) {
      return this.initializeDefaultConversations();
    }
    return JSON.parse(stored);
  }

  saveConversations() {
    localStorage.setItem('cag_conversations', JSON.stringify(this.conversations));
  }

  initializeDefaultConversations() {
    const defaultConversations = {
      'conv-1-2': {
        id: 'conv-1-2',
        participants: ['user-1', 'user-2'],
        messages: [
          {
            id: 'msg-1',
            senderId: 'user-2',
            content: 'Hi John! I saw your profile and think you\'d be perfect for a Senior Security role we have open. Are you available for a quick call this week?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false
          },
          {
            id: 'msg-2',
            senderId: 'user-1',
            content: 'Hi Sarah! Yes, I\'d be very interested. I have availability on Wednesday or Thursday afternoon. What times work best for you?',
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            read: true
          },
          {
            id: 'msg-3',
            senderId: 'user-2',
            content: 'Perfect! How about Thursday at 2pm EST? I\'ll send you a calendar invite.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false
          }
        ],
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isStarred: false,
        isArchived: false
      },
      'conv-1-4': {
        id: 'conv-1-4',
        participants: ['user-1', 'user-4'],
        messages: [
          {
            id: 'msg-4',
            senderId: 'user-4',
            content: 'John, great to connect! I have several DoD contractor positions that match your TS/SCI clearance. Would love to discuss your career goals.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: true
          }
        ],
        lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isStarred: true,
        isArchived: false
      },
      'conv-1-5': {
        id: 'conv-1-5',
        participants: ['user-1', 'user-5'],
        messages: [
          {
            id: 'msg-5',
            senderId: 'user-5',
            content: 'Hi John, we reviewed your application for the Cybersecurity position. Very impressed! Can we schedule a technical interview?',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            read: true
          }
        ],
        lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isStarred: false,
        isArchived: false
      }
    };

    this.saveConversations();
    return defaultConversations;
  }

  getConversationsForCurrentUser() {
    const userConvs = [];

    for (const convId in this.conversations) {
      const conv = this.conversations[convId];
      if (conv.participants.includes(this.currentUserId)) {
        const otherUserId = conv.participants.find(id => id !== this.currentUserId);
        const otherUser = this.users[otherUserId];
        const lastMessage = conv.messages[conv.messages.length - 1];
        const unreadCount = conv.messages.filter(
          m => m.senderId !== this.currentUserId && !m.read
        ).length;

        userConvs.push({
          ...conv,
          otherUser: otherUser,
          lastMessage: lastMessage,
          unreadCount: unreadCount
        });
      }
    }

    return userConvs.sort((a, b) =>
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  }

  selectConversation(convId) {
    this.activeConversationId = convId;

    // Mark messages as read
    const conv = this.conversations[convId];
    if (conv) {
      conv.messages.forEach(msg => {
        if (msg.senderId !== this.currentUserId) {
          msg.read = true;
        }
      });
      this.saveConversations();
    }

    this.renderConversations();
    this.renderMessages();
  }

  sendMessage(content) {
    if (!this.activeConversationId || !content.trim()) return;

    const conv = this.conversations[this.activeConversationId];
    const newMessage = {
      id: 'msg-' + Date.now(),
      senderId: this.currentUserId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    conv.messages.push(newMessage);
    conv.lastMessageTime = newMessage.timestamp;
    this.saveConversations();

    this.renderConversations();
    this.renderMessages();

    // Simulate other user coming online and reading
    setTimeout(() => {
      newMessage.read = true;
      this.saveConversations();
      this.renderMessages();
    }, 2000);
  }

  createConversation(otherUserId) {
    // Check if conversation already exists
    for (const convId in this.conversations) {
      const conv = this.conversations[convId];
      if (conv.participants.includes(this.currentUserId) &&
          conv.participants.includes(otherUserId)) {
        this.selectConversation(convId);
        return;
      }
    }

    // Create new conversation
    const newConvId = 'conv-' + this.currentUserId + '-' + otherUserId;
    this.conversations[newConvId] = {
      id: newConvId,
      participants: [this.currentUserId, otherUserId],
      messages: [],
      lastMessageTime: new Date().toISOString(),
      isStarred: false,
      isArchived: false
    };

    this.saveConversations();
    this.selectConversation(newConvId);
    this.renderConversations();
  }

  searchConversations(query) {
    if (!query.trim()) {
      this.renderConversations();
      return;
    }

    const filtered = this.getConversationsForCurrentUser().filter(conv => {
      const searchText = query.toLowerCase();
      return (
        conv.otherUser.name.toLowerCase().includes(searchText) ||
        conv.otherUser.role.toLowerCase().includes(searchText) ||
        conv.otherUser.company.toLowerCase().includes(searchText) ||
        conv.messages.some(m => m.content.toLowerCase().includes(searchText))
      );
    });

    this.renderConversations(filtered);
  }

  setupEventListeners() {
    // Send message
    const sendBtn = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage(messageInput.value);
        messageInput.value = '';
      });
    }

    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage(messageInput.value);
          messageInput.value = '';
        }
      });
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchConversations(e.target.value);
      });
    }

    // User switcher (for testing)
    this.createUserSwitcher();
  }

  createUserSwitcher() {
    const existingSwitcher = document.getElementById('userSwitcher');
    if (existingSwitcher) return;

    const switcher = document.createElement('div');
    switcher.id = 'userSwitcher';
    switcher.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      min-width: 200px;
    `;

    const currentUser = this.users[this.currentUserId];
    switcher.innerHTML = `
      <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; font-weight: 600;">TEST MODE - Switch User:</div>
      <select id="userSelect" style="width: 100%; padding: 0.5rem; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 0.9rem;">
        ${Object.values(this.users).map(user => `
          <option value="${user.id}" ${user.id === this.currentUserId ? 'selected' : ''}>
            ${user.name}
          </option>
        `).join('')}
      </select>
      <div style="font-size: 0.7rem; color: #9ca3af; margin-top: 0.5rem;">Currently: ${currentUser.name}</div>
    `;

    document.body.appendChild(switcher);

    document.getElementById('userSelect').addEventListener('change', (e) => {
      this.setCurrentUser(e.target.value);
      this.createUserSwitcher(); // Update display
    });
  }

  renderConversations(conversations = null) {
    const conversationsList = document.querySelector('.conversations-list');
    if (!conversationsList) return;

    const convs = conversations || this.getConversationsForCurrentUser();

    conversationsList.innerHTML = convs.map(conv => {
      const isActive = conv.id === this.activeConversationId;
      const timeAgo = this.formatTimeAgo(new Date(conv.lastMessageTime));

      return `
        <div class="conversation-item ${isActive ? 'active' : ''}"
             onclick="messaging.selectConversation('${conv.id}')">
          <div class="conversation-avatar">
            <div class="avatar" style="background: ${conv.otherUser.avatarColor}">
              ${conv.otherUser.initials}
            </div>
            ${conv.otherUser.isOnline ? '<span class="online-indicator"></span>' : ''}
          </div>

          <div class="conversation-content">
            <div class="conversation-header-row">
              <span class="conversation-name">${conv.otherUser.name}</span>
              <span class="conversation-time">${timeAgo}</span>
            </div>

            <div class="conversation-preview">
              <span class="conversation-role">${conv.otherUser.role} • ${conv.otherUser.company}</span>
              <p class="conversation-last-message">${conv.lastMessage?.content || 'No messages yet'}</p>
            </div>
          </div>

          <div class="conversation-meta">
            ${conv.unreadCount > 0 ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
            <span class="clearance-badge">${conv.otherUser.clearance}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderMessages() {
    const messagesArea = document.querySelector('.messages-area');
    const conversationHeader = document.querySelector('.conversation-header-info');

    if (!messagesArea || !this.activeConversationId) return;

    const conv = this.conversations[this.activeConversationId];
    if (!conv) return;

    const otherUserId = conv.participants.find(id => id !== this.currentUserId);
    const otherUser = this.users[otherUserId];

    // Update header
    if (conversationHeader) {
      conversationHeader.innerHTML = `
        <div class="header-left">
          <div class="header-avatar">
            <div class="avatar" style="background: ${otherUser.avatarColor}">
              ${otherUser.initials}
            </div>
            ${otherUser.isOnline ? '<span class="online-indicator"></span>' : ''}
          </div>
          <div class="header-info">
            <h3 class="header-name">${otherUser.name}</h3>
            <p class="header-role">${otherUser.role} • ${otherUser.company}</p>
            <span class="header-status">${otherUser.isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      `;
    }

    // Render messages
    messagesArea.innerHTML = conv.messages.map(msg => {
      const isSent = msg.senderId === this.currentUserId;
      const sender = this.users[msg.senderId];
      const time = this.formatTime(new Date(msg.timestamp));

      return `
        <div class="message ${isSent ? 'sent' : 'received'}">
          ${!isSent ? `
            <div class="message-avatar">
              <div class="avatar-small" style="background: ${sender.avatarColor}">
                ${sender.initials}
              </div>
            </div>
          ` : ''}

          <div class="message-content">
            <div class="message-bubble">
              <p>${msg.content}</p>
            </div>
            ${isSent ? `
              <div class="message-meta">
                <span class="message-time">${time}</span>
                ${msg.read ? `
                  <svg class="read-receipt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                    <polyline points="20 6 9 17 4 12" transform="translate(4, 0)"/>
                  </svg>
                ` : ''}
              </div>
            ` : `
              <span class="message-time">${time}</span>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';

    return date.toLocaleDateString();
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  render() {
    this.renderConversations();

    // Select first conversation by default
    if (!this.activeConversationId) {
      const convs = this.getConversationsForCurrentUser();
      if (convs.length > 0) {
        this.selectConversation(convs[0].id);
      }
    } else {
      this.renderMessages();
    }
  }
}

// Initialize
let messaging;
document.addEventListener('DOMContentLoaded', () => {
  messaging = new MessagingPOC();
});
