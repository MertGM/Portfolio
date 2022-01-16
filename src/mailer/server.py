import websockets
import asyncio
from smtplib import SMTP
import ssl
import os
from email.mime.text import MIMEText

port = 587
mail_server = "smtp.office365.com"
login_username = os.getenv("OUTLOOK_USERNAME")
login_password = os.getenv("OUTLOOK_PASSWORD")

context = ssl.create_default_context()

async def send_mail(message):
    # Todo: Check which mail server the user uses
    message_content = f"""RE Subject: {message[2]} \n
    Hi {message[0]}, \n
    thanks for reaching out to me, I will read your mail and respond as soon as possible. \n

    Sincerely,
    Mert Dalkiran"""
    print(f"{message=}")
    print(f"sending message to {message[0]}")
    print(f"message sender {message[0]}")
    print(f"message email {message[1]}")
    print(f"message subject {message[2]}")
    print(f"message content beginning {message[3]}")
    message_for_me = "Subject: " + message[2] + "\n" + "\n"
    for m in message[3::]:
        print(f"{m=}")
        message_for_me += str(m)

    message_for_me += "."

    with SMTP(mail_server, port) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(login_username, login_password)
        # Confirmation mail to sender
        success = server.sendmail(login_username, message[1], message_content)
        print("{success=}")
        # Send to myself
        success = server.sendmail(login_username, login_username, message_for_me)
        print("{success=}")



async def handler(websocket):
    while True:
        async for message in websocket:
            await send_mail(message.split(','));
            await websocket.send("OK")



async def main():
    async with websockets.serve(handler, "", 9999):
        print("Server running")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
