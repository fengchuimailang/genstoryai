#!/usr/bin/env python3
"""
Email configuration test script for GenStoryAI
Usage:
    python test_email.py --to test@example.com --lang en

- Supports multi-language email content
- Reads config from .env and settings
- Prints clear result and error hints
"""
import os
import sys
import smtplib
import argparse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import datetime

# Add project path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from genstoryai_backend.config import settings
from genstoryai_backend.utils.email_templates import get_verification_email_content

def test_email_sending(recipient: str, language: str = 'zh'):
    """Test email sending with multi-language support"""
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    username = "TestUser"
    verification_url = f"https://example.com/verify?token=demo_token_{current_time}"
    html_content, text_content = get_verification_email_content(username, verification_url, language)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"GenStoryAI 邮件配置测试 | Email Test | メールテスト | 이메일 테스트 ({language})"
    msg['From'] = settings.SMTP_USERNAME
    msg['To'] = recipient
    msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    try:
        print("--- Email Config ---")
        print(f"SMTP Server: {settings.SMTP_SERVER}")
        print(f"SMTP Port: {settings.SMTP_PORT}")
        print(f"Username: {settings.SMTP_USERNAME}")
        print(f"Recipient: {recipient}")
        print(f"Language: {language}")
        print("--------------------")
        if settings.SMTP_PORT == 465:
            with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        print("✅ Email sent successfully! Please check your inbox.")
    except Exception as e:
        print("❌ Email sending failed!")
        print(f"Error: {str(e)}")
        print("\nCheck:")
        print("1. SMTP server and port")
        print("2. Username and password")
        print("3. App password or 2FA if needed")
        print("4. Network connection")
        print("5. Recipient address is correct")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test GenStoryAI email configuration.")
    parser.add_argument('--to', type=str, required=True, help='Recipient email address')
    parser.add_argument('--lang', type=str, default='zh', choices=['zh','en','ja','kr'], help='Language: zh, en, ja, kr')
    args = parser.parse_args()

    print("=" * 50)
    print("GenStoryAI Email Configuration Test")
    print("=" * 50)
    test_email_sending(args.to, args.lang) 