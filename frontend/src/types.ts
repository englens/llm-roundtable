export interface ConversationMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  topic: string;
  summary: string;
  updatedAt?: string;
  messages: ConversationMessage[];
}

export interface ConversationResponse {
  conversations: ConversationSummary[];
}
