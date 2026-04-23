import apiClient from "./apiClient";

export const chatService = {
  /** Get chat list */
  getChats: async () => {
    const res = await apiClient.get("/chat-list");
    return res.data;
  },

  /** Get messages in a chat */
  getMessages: async (chatId: number) => {
    const res = await apiClient.get("/chat-messages", { params: { chat_id: chatId } });
    return res.data;
  },

  /** Send message */
  send: async (chatId: number, message: string) => {
    const res = await apiClient.post("/send-message", { chat_id: chatId, message });
    return res.data;
  },

  /** Start chat / make offer on an item */
  startChat: async (itemId: number, message: string) => {
    const res = await apiClient.post("/item-offer", { item_id: itemId, message });
    return res.data;
  },
};
