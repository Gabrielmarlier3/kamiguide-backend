export function emailDesing(userName: string, recoveryKey: string): string {
  return ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KamiGuide - Authentication Code</title>
  <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }

      body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #0f1419;
          color: #e5e7eb;
          line-height: 1.6;
          padding: 20px;
      }

      .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #1a202c;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      }

      .header {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid #2d3748;
      }

      .logo {
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 8px;
      }

      .logo-accent {
          color: #8b5cf6;
      }

      .tagline {
          color: #9ca3af;
          font-size: 14px;
      }

      .content {
          padding: 40px 30px;
      }

      .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
      }

      .message {
          color: #d1d5db;
          margin-bottom: 30px;
          font-size: 16px;
      }

      .code-container {
          background-color: #374151;
          border: 2px solid #8b5cf6;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          margin: 30px 0;
      }

      .code-label {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
      }

      .auth-code {
          font-size: 32px;
          font-weight: bold;
          color: #8b5cf6;
          font-family: 'Courier New', monospace;
          letter-spacing: 4px;
          margin: 10px 0;
      }

      .code-note {
          color: #9ca3af;
          font-size: 12px;
          margin-top: 10px;
      }

      .warning {
          background-color: #451a03;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 25px 0;
          border-radius: 4px;
      }

      .warning-text {
          color: #fbbf24;
          font-size: 14px;
      }

      .footer-message {
          color: #9ca3af;
          font-size: 14px;
          margin-top: 25px;
      }

      .footer {
          background-color: #111827;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #2d3748;
      }

      .footer-text {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 10px;
      }

      .footer-links {
          margin-top: 15px;
      }

      .footer-link {
          color: #8b5cf6;
          text-decoration: none;
          margin: 0 10px;
          font-size: 12px;
      }

      .footer-link:hover {
          color: #a78bfa;
      }

      @media (max-width: 600px) {
          .email-container {
              margin: 10px;
              border-radius: 8px;
          }

          .header, .content, .footer {
              padding: 20px;
          }

          .auth-code {
              font-size: 24px;
              letter-spacing: 2px;
          }
      }
  </style>
</head>
<body>
<div class="email-container">
  <div class="header">
    <div class="logo">Kami<span class="logo-accent">Guide</span></div>
    <div class="tagline">Your ultimate anime destination</div>
  </div>

  <div class="content">
    <div class="greeting">Hello, ${userName}!</div>

    <div class="message">
      We received a request to authenticate your KamiGuide account. Here is your verification code to complete the process:
    </div>

    <div class="code-container">
      <div class="code-label">Authentication Code</div>
      <div class="auth-code">${recoveryKey}</div>
      <div class="code-note">This code expires in 10 minutes</div>
    </div>

    <div class="warning">
      <div class="warning-text">
        <strong>Security Notice:</strong> If you did not request this authentication code, please ignore this email. Never share this code with anyone.
      </div>
    </div>

    <div class="footer-message">
      This code was generated for your account security. If you're having trouble accessing your account or didn't request this code, please contact our support team.
      <br><br>
      Thank you for being part of the KamiGuide community!
    </div>
  </div>

  <div class="footer">
    <div class="footer-text">
      © 2025 KamiGuide. All rights reserved.
    </div>
    <div class="footer-text">
      This is an automated message, please do not reply to this email.
    </div>
    <div class="footer-links">
      <a href="#" class="footer-link">Help Center</a>
      <a href="#" class="footer-link">Privacy Policy</a>
      <a href="#" class="footer-link">Unsubscribe</a>
    </div>
  </div>
</div>
</body>
</html>`;
}
