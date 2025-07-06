from typing import Tuple

def get_verification_email_content(username: str, verification_url: str, language: str = 'zh') -> Tuple[str, str]:
    if language == 'en':
        html_content = f"""
        <!DOCTYPE html>
        <html><head><meta charset='utf-8'><title>Verify your GenStoryAI account</title><style>body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}.container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}.header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}.content {{ padding: 20px; background-color: #f9f9f9; }}.button {{ display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}.footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}</style></head><body><div class='container'><div class='header'><h1>Welcome to GenStoryAI!</h1></div><div class='content'><h2>Hello {username},</h2><p>Thank you for registering. Please click the button below to verify your email address:</p><div style='text-align: center;'><a href='{verification_url}' class='button'>Verify Email</a></div><p>Or copy the following link into your browser:</p><p style='word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;'>{verification_url}</p><p>This link will expire in 24 hours.</p><p>If you did not register, please ignore this email.</p></div><div class='footer'><p>This email was sent automatically by GenStoryAI, please do not reply.</p><p>© 2024 GenStoryAI. All rights reserved.</p></div></div></body></html>
        """
        text_content = f"""
        Welcome to GenStoryAI!
        
        Hello {username},
        
        Thank you for registering. Please click the link below to verify your email address:
        {verification_url}
        
        This link will expire in 24 hours.
        If you did not register, please ignore this email.
        
        © 2024 GenStoryAI. All rights reserved.
        """
    elif language == 'ja':
        html_content = f"""
        <!DOCTYPE html>
        <html><head><meta charset='utf-8'><title>GenStoryAIアカウントの認証</title><style>body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}.container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}.header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}.content {{ padding: 20px; background-color: #f9f9f9; }}.button {{ display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}.footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}</style></head><body><div class='container'><div class='header'><h1>GenStoryAIへようこそ！</h1></div><div class='content'><h2>{username}様、</h2><p>ご登録ありがとうございます。下のボタンをクリックしてメールアドレスを認証してください：</p><div style='text-align: center;'><a href='{verification_url}' class='button'>メール認証</a></div><p>または、以下のリンクをブラウザにコピーしてください：</p><p style='word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;'>{verification_url}</p><p>このリンクは24時間後に無効になります。</p><p>このメールに心当たりがない場合は無視してください。</p></div><div class='footer'><p>このメールはGenStoryAIシステムから自動送信されています。返信しないでください。</p><p>© 2024 GenStoryAI. All rights reserved.</p></div></div></body></html>
        """
        text_content = f"""
        GenStoryAIへようこそ！
        
        {username}様、
        
        ご登録ありがとうございます。下記リンクをクリックしてメールアドレスを認証してください：
        {verification_url}
        
        このリンクは24時間後に無効になります。
        このメールに心当たりがない場合は無視してください。
        
        © 2024 GenStoryAI. All rights reserved.
        """
    elif language == 'kr':
        html_content = f"""
        <!DOCTYPE html>
        <html><head><meta charset='utf-8'><title>GenStoryAI 계정 인증</title><style>body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}.container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}.header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}.content {{ padding: 20px; background-color: #f9f9f9; }}.button {{ display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}.footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}</style></head><body><div class='container'><div class='header'><h1>GenStoryAI에 오신 것을 환영합니다!</h1></div><div class='content'><h2>{username}님,</h2><p>회원가입해 주셔서 감사합니다. 아래 버튼을 클릭하여 이메일을 인증해 주세요:</p><div style='text-align: center;'><a href='{verification_url}' class='button'>이메일 인증</a></div><p>또는 아래 링크를 브라우저에 복사해 주세요:</p><p style='word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;'>{verification_url}</p><p>이 링크는 24시간 후 만료됩니다.</p><p>본인이 가입하지 않았다면 이 메일을 무시해 주세요.</p></div><div class='footer'><p>이 메일은 GenStoryAI 시스템에서 자동 발송되었습니다. 회신하지 마세요.</p><p>© 2024 GenStoryAI. All rights reserved.</p></div></div></body></html>
        """
        text_content = f"""
        GenStoryAI에 오신 것을 환영합니다!
        
        {username}님,
        
        회원가입해 주셔서 감사합니다. 아래 링크를 클릭하여 이메일을 인증해 주세요:
        {verification_url}
        
        이 링크는 24시간 후 만료됩니다.
        본인이 가입하지 않았다면 이 메일을 무시해 주세요.
        
        © 2024 GenStoryAI. All rights reserved.
        """
    else:  # 默认中文
        html_content = f"""
        <!DOCTYPE html>
        <html><head><meta charset='utf-8'><title>验证您的 GenStoryAI 账户</title><style>body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}.container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}.header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}.content {{ padding: 20px; background-color: #f9f9f9; }}.button {{ display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}.footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}</style></head><body><div class='container'><div class='header'><h1>欢迎加入 GenStoryAI!</h1></div><div class='content'><h2>您好 {username}，</h2><p>感谢您注册 GenStoryAI 账户。请点击下面的按钮验证您的邮箱地址：</p><div style='text-align: center;'><a href='{verification_url}' class='button'>验证邮箱</a></div><p>或者复制以下链接到浏览器地址栏：</p><p style='word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;'>{verification_url}</p><p>此链接将在24小时后失效。</p><p>如果您没有注册 GenStoryAI 账户，请忽略此邮件。</p></div><div class='footer'><p>此邮件由 GenStoryAI 系统自动发送，请勿回复。</p><p>© 2024 GenStoryAI. 保留所有权利。</p></div></div></body></html>
        """
        text_content = f"""
        欢迎加入 GenStoryAI!
        
        您好 {username}，
        
        感谢您注册 GenStoryAI 账户。请点击以下链接验证您的邮箱地址：
        {verification_url}
        
        此链接将在24小时后失效。
        如果您没有注册 GenStoryAI 账户，请忽略此邮件。
        
        © 2024 GenStoryAI. 保留所有权利。
        """
    return html_content, text_content 