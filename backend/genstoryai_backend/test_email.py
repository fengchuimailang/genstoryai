#!/usr/bin/env python3
"""
邮件发送测试脚本
用于测试邮件配置是否正确
"""

import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# 添加项目路径到 Python 路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from genstoryai_backend.config import settings

def test_email_sending():
    """测试邮件发送功能"""
    
    # 测试邮件内容
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>邮件测试</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>邮件测试</h1>
            </div>
            <div class="content">
                <h2>GenStoryAI 邮件配置测试</h2>
                <p>如果您收到这封邮件，说明邮件配置正确！</p>
                <p>时间: {current_time}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    GenStoryAI 邮件配置测试
    
    如果您收到这封邮件，说明邮件配置正确！
    
    时间: {current_time}
    """
    
    # 创建邮件
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "GenStoryAI 邮件配置测试"
    msg['From'] = settings.SMTP_USERNAME
    msg['To'] = "test@example.com"  # 替换为您的测试邮箱
    
    # 添加纯文本和HTML内容
    text_part = MIMEText(text_content, 'plain', 'utf-8')
    html_part = MIMEText(html_content, 'html', 'utf-8')
    
    msg.attach(text_part)
    msg.attach(html_part)
    
    try:
        print("正在测试邮件发送...")
        print(f"SMTP 服务器: {settings.SMTP_SERVER}")
        print(f"SMTP 端口: {settings.SMTP_PORT}")
        print(f"用户名: {settings.SMTP_USERNAME}")
        
        # 根据端口选择SSL或TLS连接
        if settings.SMTP_PORT == 465:
            # SSL连接
            with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            # TLS连接
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        
        print("✅ 邮件发送成功！")
        print("请检查您的邮箱收件箱。")
        
    except Exception as e:
        print("❌ 邮件发送失败！")
        print(f"错误信息: {str(e)}")
        print("\n请检查以下配置：")
        print("1. SMTP 服务器地址和端口是否正确")
        print("2. 邮箱用户名和密码是否正确")
        print("3. 是否开启了两步验证（Gmail）")
        print("4. 是否使用了应用专用密码（Gmail）")
        print("5. 网络连接是否正常")

if __name__ == "__main__":
    from datetime import datetime
    
    print("=" * 50)
    print("GenStoryAI 邮件配置测试")
    print("=" * 50)
    
    
    print(settings.SMTP_SERVER)
    print(settings.SMTP_PORT)
    print(settings.SMTP_USERNAME)

    print(settings.EMAIL_FROM_NAME)
    print(settings.EMAIL_FROM_ADDRESS)
    test_email_sending() 