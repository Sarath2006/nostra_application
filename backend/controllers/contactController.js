import contactModel from "../models/contactModel.js";
import createTransporter from '../config/email.js';


const contactSubmissionTemplate = ({ name, email, subject, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Submission</title>
    <style>
        /* Email-safe inline styles */
        body { margin:0; padding:0; background:#f4f6f8; font-family: Arial, Helvetica, sans-serif; color:#111; }
        .container { width:100%; max-width:680px; margin:0 auto; background:#ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; padding:24px; text-align:center; }
        .header h1 { margin:0; font-size:22px; }
        .content { padding:24px; }
        .pretitle { color:#6b7280; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 8px; }
        .title { font-size:18px; margin:0 0 16px; }
        .card { border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; }
        .row { display:flex; border-bottom:1px solid #e5e7eb; }
        .row:last-child { border-bottom:none; }
        .label { width:160px; background:#f9fafb; padding:12px 16px; font-weight:bold; color:#374151; }
        .value { flex:1; padding:12px 16px; color:#111827; }
        .message { padding:16px; background:#f9fafb; border-radius:8px; white-space:pre-wrap; }
        .footer { padding:20px; text-align:center; color:#6b7280; font-size:12px; }
        .btn { display:inline-block; margin-top:16px; padding:10px 16px; background:#667eea; color:#fff !important; text-decoration:none; border-radius:6px; }
    </style>
</head>
<body>
    <div style="padding:16px 12px;">
        <div class="container" style="border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,0.08)">
            <div class="header">
                <h1>New Contact Form Submission</h1>
                <div style="margin-top:6px; font-size:13px; opacity:0.9;">Nostalgia — Timeless Fashion</div>
            </div>
            <div class="content">
                <p class="pretitle">Submission Details</p>
                <h2 class="title">${subject || 'No Subject'}</h2>
                <div class="card">
                    <div class="row"><div class="label">Name</div><div class="value">${name || '-'}</div></div>
                    <div class="row"><div class="label">Email</div><div class="value">${email || '-'}</div></div>
                    <div class="row"><div class="label">Subject</div><div class="value">${subject || '-'}</div></div>
                </div>
                <h3 style="margin:20px 0 8px; font-size:16px;">Message</h3>
                <div class="message">${(message || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
                <a class="btn" href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject || '')}">Reply to Sender</a>
            </div>
            <div class="footer">
                © ${new Date().getFullYear()} Nostalgia. This notification was sent to you because someone submitted the contact form.
            </div>
        </div>
    </div>
  
</body>
</html>`;


const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Save to database
        const newContact = new contactModel({
            name,
            email,
            subject,
            message
        });
        await newContact.save();

        // Initialize transporter
        const transporter = createTransporter();

        // Send email notification
        const mailOptions = {
            from: {
                name: 'Nostalgia Support',
                address: process.env.EMAIL_USER
            },
            to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Contact Form: ${subject}`,
            html: contactSubmissionTemplate({ name, email, subject, message })
            ,
            text: `New Contact Form Submission\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { submitContact };