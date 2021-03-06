import websockets
import asyncio
import smtplib
import ssl
import os
from getpass import getpass

port = 587
mail_server = "smtp.office365.com"
login_username = "mertdalkiran@hotmail.com"
# Local
login_password = getpass()

context = ssl.create_default_context()

# Server
# server_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# server_context.load_cert_chain("/etc/letsencrypt/live/worldofmine.org/cert.pem", "/etc/letsencrypt/live/worldofmine.org/privkey.pem")

# Server: systemd doesn't allow to take input, instead read pass from file and delete it.
#try:
#    with open("/tmp/secret", "r") as f:
#            login_password = f.readline().strip()
#except FileNotFoundError:
#    print("Missing file /tmp/secret")
#    os._exit(1)
#
#os.remove("/tmp/secret")

async def send_mail(message, websocket):
    # Supported mail servers are Outlook and Gmail, as far as I know; Outlook's smtp can send email to gmail and vice vera.

    # server.sendmail already fills in the 'From' and 'To' headers.
    message_content = f"""Subject: {message[2]}\n
    Hi {message[0]},\n
    thanks for reaching out to me, I will read your mail and respond as soon as possible.\n
    Sincerely,
    Mert Dalkiran"""

    print(f"{message=}")
    print(f"sending message to {message[0]}")
    print(f"message sender {message[1]}")
    print(f"message email {message[1]}")
    print(f"message subject {message[2]}")
    print(f"message content beginning {message[3]}")
    message_for_me = f"Subject: {message[2]}\n\n From: {message[1]}\nName: {message[0]}\n"

    # Include multiple lines from the message body.
    for m in message[3::]:
        #print(f"{m=}")
        message_for_me += str(m)

    message_for_me += "."

    try:
        with smtplib.SMTP(mail_server, port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(login_username, login_password)
            # Confirmation mail to sender.
            server.sendmail(login_username, message[1], message_content.encode('utf-8'))
            # Send to myself.
            server.sendmail(login_username, login_username, message_for_me.encode('utf-8'))
            await websocket.send("1");

    except smtplib.SMTPRecipientsRefused:
        await websocket.send(["0", "Unable to send email to destination.\n Please enter a valid email address."])
        return


async def handler(websocket):
    while True:
        async for message in websocket:
            await send_mail(message.split(','), websocket);


async def main():
    # Local
    async with websockets.serve(handler, "127.0.0.1", 9999):
    # Server
    # async with websockets.serve(handler, "worldofmine.org", 9999):
        print("Server running")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
