import { io, Socket } from 'socket.io-client';
import api from '../lib/axios';
import { authService } from './authService';

export interface Message {
  _id: string;
  match: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatHistory {
  messages: Message[];
  matchInfo: {
    user1: {
      _id: string;
      name: string;
      email: string;
    };
    user2: {
      _id: string;
      name: string;
      email: string;
    };
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    messages: Message[];
  };
}

class ChatService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket) return;

    const token = authService.getToken();
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de chat');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de chat');
    });

    this.socket.on('error', (error) => {
      console.error('Error en el socket:', error);
    });

    this.socket.on('receive-message', (message: Message) => {
      this.notifyListeners('message', message);
    });

    this.socket.on('chat-history', (data: ChatHistory) => {
      this.notifyListeners('history', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(matchId: string, userId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit('join-chat', { matchId, userId });
  }

  sendMessage(matchId: string, senderId: string, content: string) {
    if (!this.socket) this.connect();
    this.socket?.emit('send-message', { matchId, senderId, content });
  }

  addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  removeListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  async getChatHistory(matchId: string): Promise<ChatHistoryResponse> {
    try {
      const token = authService.getToken();
      const response = await api.get<ChatHistoryResponse>(`/chat/history/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial del chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService(); 