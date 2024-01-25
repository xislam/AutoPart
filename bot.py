import os
from telegram.ext import Updater, CommandHandler, CallbackContext
from telegram import Update, Bot
from django import setup
from django.conf import settings  # Import settings module

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'root.settings')
# Call the setup() function to configure Django


# Check if Django is configured and configure it if not
if not settings.configured:
    settings.configure()

from accounts.models import ChatId

# Replace 'YOUR_TOKEN' with your actual bot token
TOKEN = '6855005075:AAEQbNP8rnCBtWunhd73Dglt2uZb5lzVCrw'


def start(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    update.message.reply_text(f'Привет! Я ваш телеграм-бот. Ваш Chat ID: {user_id}')


def get_chat_id(update: Update, context: CallbackContext):
    user_id = update.message.from_user.id
    update.message.reply_text(f'Ваш Chat ID: {user_id}')


def send_message_to_all_users(message_text):
    # Get all chat_ids from the database
    chat_ids = ChatId.objects.values_list('chat_id', flat=True)

    # Initialize the bot object
    bot = Bot(token=TOKEN)

    # Send a message to each chat
    for chat_id in chat_ids:
        # Send the message
        bot.send_message(chat_id=chat_id, text=message_text)


def send_order_notification(order):
    # Get order information
    order_info = f"New order: ID {order.id} \n\n"
    order_info += f"User: {order.user.name} {order.user.surname} \n"
    order_info += "Products:\n"
    for item in order.product.all():
        order_info += f"{item.name_product} .\n"  # Используем атрибут 'name' из модели Product
    order_info += f"\nTotal price: {order.total} $.\n"
    order_info += f"Order date: {order.create_date}\n"
    chat_ids = ChatId.objects.values_list('chat_id', flat=True)

    # Send the notification to the bot
    bot = Bot(token=TOKEN)
    for chat_id in chat_ids:
        # Send the message
        bot.send_message(chat_id=chat_id, text=order_info)


def main():
    updater = Updater(token=TOKEN, use_context=True)
    dp = updater.dispatcher

    # Handle the /start command
    dp.add_handler(CommandHandler("start", start))

    # Handle the /get_chat_id command
    dp.add_handler(CommandHandler("get_chat_id", get_chat_id))

    # Start the bot
    updater.start_polling()

    # Stop the bot on Ctrl+C
    updater.idle()


if __name__ == '__main__':
    main()
