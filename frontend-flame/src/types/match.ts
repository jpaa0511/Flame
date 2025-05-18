import { User } from './user';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
}

export interface Match {
  id: string;
  matchedUser: User;
  messages: Message[];
  lastMessage: string;
  lastMessageAt: Date;
  isActive: boolean;
} 