import createTransporter from "../config/email.js";

const welcomeEmailTemplate = (userName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 40px 30px;
            }
            .content h2 {
                color: #667eea;
                margin-top: 0;
            }
            .features {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .features ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .features li {
                margin: 10px 0;
            }
            .button {
                display: inline-block;
                padding: 15px 40px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                background: #f4f4f4;
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Nostalgia!</h1>
            </div>
            <div class="content">
                <h2>Hi ${userName}!</h2>
                <p>Thank you for joining <strong>Nostalgia</strong> - your destination for timeless fashion and sustainable style.</p>
                
                <p>We're thrilled to have you as part of our community! Your account has been successfully created.</p>
                
                <div class="features">
                    <h3>🌟 What You Can Do Now:</h3>
                    <ul>
                        <li>🛍️ Browse our curated collections</li>
                        <li>♻️ Join our Rewear program</li>
                        <li>🪙 Earn coins and get discounts</li>
                        <li>📦 Track your orders</li>
                        <li>👤 Manage your profile</li>
                    </ul>
                </div>
                
                <center>
                    <a href="http://localhost:5173" class="button">Start Shopping Now</a>
                </center>
                
                <p>If you have any questions, our support team is here to help.</p>
                
                <p>Happy Shopping! 🛒✨</p>
                
                <p><strong>The Nostalgia Team</strong></p>
            </div>
            <div class="footer">
                <p><strong>Nostalgia - Timeless Fashion</strong></p>
                <p>© 2025 Nostalgia. All rights reserved.</p>
                <p>You received this email because you created an account with us.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Nostra Store',
                address: process.env.EMAIL_USER
            },
            to: userEmail,
            subject: '🎉 Welcome to Nostalgia - Your Account is Ready!',
            html: welcomeEmailTemplate(userName),
            text: `Hi ${userName}!\n\nWelcome to Nostalgia! Your account has been successfully created.\n\nStart shopping at http://localhost:5173\n\nBest regards,\nThe Nostalgia Team` 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent to:', userEmail);
        console.log('📧 Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        return { success: false, error: error.message };
    }
};


const otpEmailTemplate = (userName, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .otp-box {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 10px;
                margin: 30px 0;
                border: 2px dashed #667eea;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                margin: 10px 0;
            }
            .warning {
                color: #ff6b6b;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                background: #f4f4f4;
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hi ${userName}!</h2>
                <p>You requested to reset your password. Use the OTP below:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 0; color: #999; font-size: 12px;">Valid for 5 minutes</p>
                </div>
                
                <p class="warning">⚠️ This code expires in 5 minutes</p>
                
                <p>If you didn't request this, please ignore this email.</p>
                
                <p style="color: #999; font-size: 14px; margin-top: 30px;">For security reasons, never share this code with anyone.</p>
            </div>
            <div class="footer">
                <p><strong>Nostalgia - Timeless Fashion</strong></p>
                <p>© 2025 Nostalgia. All rights reserved.</p>
                <p style="margin-top:8px; color:#9ca3af;">This is a system-generated email; please do not reply to this mailbox.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


export const sendOtpEmail = async (userEmail, userName, otp) => {
    try {
        

        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Nostra Store',
                address: process.env.EMAIL_USER
            },
            to: userEmail,
            subject: '🔒 Password Reset OTP - Nostalgia',
            html: otpEmailTemplate(userName, otp),
            text: `Hi ${userName}!\n\nYour password reset OTP is: ${otp}\n\nThis code is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.\n\nThis is a system-generated email; please do not reply to this mailbox.\n\nBest regards,\nThe Nostalgia Team`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent to:', userEmail);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send OTP email:', error.message);
        return { success: false, error: error.message };
    }
};