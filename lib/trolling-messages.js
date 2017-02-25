const fs = require('fs');
const path = require('path');
const messages = require('./messages');

function addTrollingMessage(bot, event, message) {
  bot.on(event, msg => bot.sendMessage(msg.chat.id, message));
}

function sendRandomSticker(bot, chatId) {
  return new Promise((resolve) => {
    fs.readdir(path.resolve(__dirname, '../stickers/'), (err, files) => resolve(files));
  })
    .then(files => {
      const randomStickerFile = files[Math.floor(Math.random() * files.length)];
      return bot.sendSticker(chatId, path.resolve(__dirname, '../stickers/', randomStickerFile));
    });
}

module.exports = {
  addTrollingMessages(bot) {
    addTrollingMessage(bot, 'new_chat_title', `Мда...`);

    bot.on('message', (msg) => {
      if (msg.sticker && ['huston007', 'vomixamxam', 'prncd'].includes(msg.from.username)) {
        console.log('[Sending sticker]');
        setTimeout(() => sendRandomSticker(bot, msg.chat.id), 1000);
      }
    });
  },

  reactOnMessage(msg, bot) {
    const nameRegExp = /Ген[аеуы]?/i;

    if (nameRegExp.test(msg.text)) {
      bot.sendChatAction(msg.chat.id, 'typing');

      return setTimeout(() => bot.sendMessage(msg.chat.id, messages.trollingMessages(msg.from)), 1000);
    }
  }
};
