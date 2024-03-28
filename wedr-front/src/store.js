// wsStore.js
import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';

export const useWebSocketStore = defineStore({
  id: 'webSocketStore',
  state: () => ({
    completed_tasks: js_vars.completed_tasks,
    remaining_time: js_vars.remaining_time,
    word: js_vars.word,
    encoded_word: js_vars.encoded_word,
    dictionary: js_vars.dictionary,
    send: null, // Initialize 'send' as null
  }),
  actions: {

    handle_new_task(newMessage) {
      const { word, encoded_word, dictionary, completed_tasks } = newMessage.data;
      this.word = word;
      this.encoded_word = encoded_word;
      this.dictionary = dictionary;
      this.completed_tasks = completed_tasks;

    },

    initializeWebSocket() {
      const that = this;
      const { status, data, send } = useWebSocket(window.fullPath, {
        autoReconnect: true,
        onMessage: (e) => {
          const json_data = JSON.parse(data.value);
          console.debug("Message received!", json_data);
          this.data = data.value;

          if (json_data) {
            const newMessage = json_data;
            // Dynamically call the appropriate handler based on the message type
            const handlerName = `handle_${newMessage.type}`;
            if (this[handlerName] && typeof this[handlerName] === 'function') {
              this[handlerName](newMessage);
            } else {
              console.warn(`No handler defined for message type: ${newMessage.type}`);
            }
          }
        },
        onConnected: async () => {
          console.debug("Connected!");
          that.status = 'connected';
        },
      });
      that.status = status;
    },
    async sendMessage(type, data) {
      console.log('Sending message:', type, data);
      // Use the 'send' function from the state
      liveSend({
        type,
        data,
      });
    },
  },
});
