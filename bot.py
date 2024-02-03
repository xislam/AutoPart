import os

from telegram.ext import Updater, CommandHandler, CallbackContext
from telegram import Update, Bot
from django import setup



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'root.settings')

# Вызовите функцию setup() для настройки Django
setup()
# Замените 'YOUR_TOKEN' на фактический токен вашего бота
from accounts.models import ChatId

TOKEN = '6479146986:AAF-PEs-K7Wl9kYnwoxWWkGKPrcQdVaErBY'


def start(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    update.message.reply_text(f'Привет! Я ваш телеграм-бот. Ваш Chat ID: {user_id}')


def get_chat_id(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    update.message.reply_text(f'Ваш Chat ID: {user_id}')


def send_message_to_all_users(message_text):
    # Получите все чаты из базы данных
    chat_ids = ChatId.objects.values_list('chat_id', flat=True)

    # Инициализируйте объект бота
    bot = Bot(token=TOKEN)

    # Отправьте сообщение каждому чату
    for chat_id in chat_ids:
        message_text = message_text

        # Отправить сообщение
        bot.send_message(chat_id=chat_id, text=message_text)


def main():
    updater = Updater(token=TOKEN, use_context=True)
    dp = updater.dispatcher

    # Обработка команды /start
    dp.add_handler(CommandHandler("start", start))

    # Обработка команды /get_chat_id
    dp.add_handler(CommandHandler("get_chat_id", get_chat_id))

    # Запуск бота
    updater.start_polling()

    # Остановка бота при нажатии Ctrl+C
    updater.idle()


if __name__ == '__main__':
    main()