import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendAdminNotification(inquiry: {
    name: string;
    email: string;
    phone: string;
    message: string;
    productName?: string;
}) {
    if (!process.env.SMTP_HOST) return;

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #1F3D2B; padding: 24px; color: white;">
                <h2 style="margin: 0; font-size: 20px;">New Inquiry Received</h2>
            </div>
            <div style="padding: 24px;">
                <p>Hello Admin,</p>
                <p>You have received a new inquiry from the website:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 120px;">Name:</td>
                        <td style="padding: 8px 0;">${inquiry.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone:</td>
                        <td style="padding: 8px 0;">${inquiry.phone}</td>
                    </tr>
                    ${inquiry.productName ? `
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Product:</td>
                        <td style="padding: 8px 0;">${inquiry.productName}</td>
                    </tr>
                    ` : ''}
                </table>
                <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #C9A24D;">
                    <p style="margin: 0; font-weight: bold; margin-bottom: 8px;">Message:</p>
                    <p style="margin: 0; color: #334155;">${inquiry.message}</p>
                </div>
                <div style="margin-top: 32px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/admin/dashboard/inquiries" 
                       style="background: #C9A24D; color: #1F3D2B; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                       View in Dashboard
                    </a>
                </div>
            </div>
        </div>
    `;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Inquiry: ${inquiry.name}`,
        html,
    });
}

export async function sendCustomerAutoReply(customerEmail: string, customerName: string, lang: 'en' | 'fr' = 'en') {
    if (!process.env.SMTP_HOST) return;

    const content = lang === 'fr' ? {
        subject: 'Merci pour votre demande - Umbrella Import & Export',
        title: 'Nous avons bien reçu votre message',
        body: `Bonjour ${customerName},<br><br>Merci de nous avoir contactés. Nous avons bien reçu votre demande et l'un de nos administrateurs vous répondra dans les plus brefs délais (généralement sous 24 heures).`,
        signature: 'Cordialement,<br>L\'Équipe Umbrella Import & Export'
    } : {
        subject: 'Thank you for your inquiry - Umbrella Import & Export',
        title: 'We received your message',
        body: `Hello ${customerName},<br><br>Thank you for reaching out to us. We have received your inquiry and one of our administrators will get back to you shortly (typically within 24 hours).`,
        signature: 'Best Regards,<br>The Umbrella Import & Export Team'
    };

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #1F3D2B; padding: 24px; color: white; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">Umbrella Import & Export</h2>
            </div>
            <div style="padding: 24px; border-bottom: 4px solid #C9A24D;">
                <h3 style="color: #1F3D2B;">${content.title}</h3>
                <p style="color: #334155; line-height: 1.6;">${content.body}</p>
                <p style="margin-top: 24px; color: #64748b;">${content.signature}</p>
            </div>
        </div>
    `;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: customerEmail,
        subject: content.subject,
        html,
    });
}
