import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Lazy initialization to prevent crash on missing env vars
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (transporter) return transporter;

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
        console.warn('⚠️ SMTP Configuration missing. Email sending disabled.');
        return null;
    }

    try {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return transporter;
    } catch (error) {
        console.error('Failed to create mail transporter:', error);
        return null;
    }
}

const COMPANY_NAME = "Umbrella Import & Export";
const COMPANY_ADDRESS = "Global Logistics Hub, Sector 4, Port Area"; // Placeholder for real address
const EMAIL_FOOTER_HTML = `
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0; font-weight: bold;">${COMPANY_NAME}</p>
        <p style="margin: 4px 0;">${COMPANY_ADDRESS}</p>
        <p style="margin: 4px 0;">Managing Global Agricultural Trade with Integrity.</p>
        <p style="margin: 16px 0 0 0; font-size: 11px; opacity: 0.7;">This is a system-generated transactional email. Please do not reply directly to this address.</p>
    </div>
`;

export async function sendAdminNotification(inquiry: {
    name: string;
    email: string;
    phone: string;
    message: string;
    productName?: string;
}) {
    if (!process.env.SMTP_HOST) return;

    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            <div style="background: #1F3D2B; padding: 24px; color: white;">
                <h2 style="margin: 0; font-size: 18px; letter-spacing: 0.5px;">SYSTEM ALERT: New Sales Inquiry</h2>
            </div>
            <div style="padding: 24px;">
                <p style="color: #334155;">A new lead has been captured via the Umbrella platform. Prompt follow-up is recommended to maximize conversion.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
                    <tr>
                        <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 130px; border-bottom: 1px solid #f1f5f9;">Customer Name:</td>
                        <td style="padding: 10px 0; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${inquiry.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; font-weight: bold; color: #64748b; border-bottom: 1px solid #f1f5f9;">Contact Email:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${inquiry.email}" style="color: #C9A24D; text-decoration: none;">${inquiry.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; font-weight: bold; color: #64748b; border-bottom: 1px solid #f1f5f9;">Contact Phone:</td>
                        <td style="padding: 10px 0; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${inquiry.phone}</td>
                    </tr>
                    ${inquiry.productName ? `
                    <tr>
                        <td style="padding: 10px 0; font-weight: bold; color: #64748b; border-bottom: 1px solid #f1f5f9;">Target Interest:</td>
                        <td style="padding: 10px 0; color: #1f2937; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${inquiry.productName}</td>
                    </tr>
                    ` : ''}
                </table>
                <div style="margin-top: 24px; padding: 18px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #C9A24D;">
                    <p style="margin: 0; font-weight: bold; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #64748b;">Inquiry Details:</p>
                    <p style="margin: 0; color: #334155; font-style: italic; line-height: 1.5;">"${inquiry.message}"</p>
                </div>
                <div style="margin-top: 32px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/admin/dashboard/inquiries" 
                       style="background: #1F3D2B; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                       Review Lead in Dashboard
                    </a>
                </div>
                ${EMAIL_FOOTER_HTML}
            </div>
        </div>
    `;

    const transporter = getTransporter();
    if (!transporter) return;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `[INQUIRY] Action Required: ${inquiry.name} - ${inquiry.productName || 'General'}`,
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
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            <div style="background: #1F3D2B; padding: 32px 24px; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px; text-transform: uppercase;">${COMPANY_NAME}</h1>
            </div>
            <div style="padding: 32px 24px; border-bottom: 6px solid #C9A24D;">
                <h3 style="color: #1F3D2B; font-size: 18px; margin-top: 0;">${content.title}</h3>
                <p style="color: #334155; line-height: 1.6; font-size: 15px;">${content.body}</p>
                <div style="margin-top: 32px; padding: 20px; border-radius: 6px; background-color: #f8fafc; text-align: center; border: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Inquiry Reference: <b>UMB-${Math.floor(Date.now() / 100000)}</b></p>
                </div>
                <p style="margin-top: 32px; color: #1F3D2B; font-weight: 600; font-size: 15px;">
                    ${content.signature}
                </p>
                ${EMAIL_FOOTER_HTML}
            </div>
        </div>
    `;

    const transporter = getTransporter();
    if (!transporter) return;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: customerEmail,
        subject: content.subject,
        html,
    });
}

export async function sendAssignmentNotification(staffEmail: string, inquiry: {
    id: string;
    name: string;
    customerEmail: string;
}) {
    if (!process.env.SMTP_HOST) return;

    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            <div style="background: #1F3D2B; padding: 20px; color: white;">
                <h2 style="margin: 0; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">Ownership Assigned</h2>
            </div>
            <div style="padding: 24px;">
                <p style="color: #334155; font-size: 15px;">A primary ownership role for the following inquiry has been assigned to you. Your prompt attention is required to ensure SLA compliance.</p>
                <div style="margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; text-transform: uppercase;">Lead Details</p>
                    <p style="margin: 0; font-size: 16px; color: #1e293b;"><b>Customer:</b> ${inquiry.name}</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #1e293b;"><b>Origin:</b> ${inquiry.customerEmail}</p>
                </div>
                <div style="margin-top: 32px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/admin/dashboard/inquiries?id=${inquiry.id}" 
                       style="background: #C9A24D; color: #1F3D2B; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                       Initialize Contact Plan
                    </a>
                </div>
                ${EMAIL_FOOTER_HTML}
            </div>
        </div>
    `;

    const transporter = getTransporter();
    if (!transporter) return;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: staffEmail,
        subject: `[OWNERSHIP] Action Required: Inquiry from ${inquiry.name}`,
        html,
    });
}

export async function sendStatusUpdateNotification(
    customerEmail: string,
    customerName: string,
    status: 'QUOTED' | 'WON',
    lang: 'en' | 'fr' = 'en'
) {
    if (!process.env.SMTP_HOST) return;

    const content = {
        QUOTED: lang === 'fr' ? {
            subject: 'Nouvelle mise à jour de votre demande - Umbrella Import & Export',
            title: 'Votre devis est prêt',
            body: `Bonjour ${customerName},<br><br>Nous avons le plaisir de vous informer que votre demande a été traitée et qu'un devis a été préparé. Vous recevrez les détails sous peu par email ou via notre équipe commerciale.`,
        } : {
            subject: 'Update on your inquiry - Umbrella Import & Export',
            title: 'Your quote is ready',
            body: `Hello ${customerName},<br><br>We are pleased to inform you that your inquiry has been processed and a quote has been prepared. You will receive the details shortly via email or from our sales team.`,
        },
        WON: lang === 'fr' ? {
            subject: 'Confirmation de commande - Umbrella Import & Export',
            title: 'Bienvenue chez Umbrella !',
            body: `Bonjour ${customerName},<br><br>Nous sommes ravis de confirmer que votre demande a été acceptée. Notre équipe logistique va maintenant prendre le relais pour coordonner l'expédition et les prochaines étapes.`,
        } : {
            subject: 'Inquiry Confirmation - Umbrella Import & Export',
            title: 'Welcome to Umbrella!',
            body: `Hello ${customerName},<br><br>We are excited to confirm that your inquiry has been accepted. Our logistics team will now take over to coordinate the shipment and next steps.`,
        }
    }[status];

    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            <div style="background: #1F3D2B; padding: 32px 24px; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px; text-transform: uppercase;">${COMPANY_NAME}</h1>
            </div>
            <div style="padding: 32px 24px; border-bottom: 6px solid #C9A24D;">
                <h3 style="color: #1F3D2B; font-size: 18px; margin-top: 0;">${content.title}</h3>
                <p style="color: #334155; line-height: 1.7; font-size: 15px;">${content.body}</p>
                <div style="margin-top: 32px; padding: 24px; background: #f8fafc; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1;">
                    <p style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Update Status</p>
                    <p style="margin: 8px 0 0 0; font-size: 18px; color: #1F3D2B; font-weight: bold; letter-spacing: 1px;">${status}</p>
                </div>
                <p style="margin-top: 32px; color: #64748b; font-size: 15px;">
                    ${lang === 'fr' ? 'Cordialement,' : 'Best Regards,'}<br>
                    <span style="color: #1F3D2B; font-weight: bold;">The Umbrella Trade Team</span>
                </p>
                ${EMAIL_FOOTER_HTML}
            </div>
        </div>
    `;

    const transporter = getTransporter();
    if (!transporter) return;

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: customerEmail,
        subject: content.subject,
        html,
    });
}

export async function sendSLADigest(adminEmail: string) {
    if (!process.env.SMTP_HOST) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const overdueInquiries = await prisma.inquiry.findMany({
        where: {
            status: 'NEW',
            createdAt: { lt: yesterday }
        },
        orderBy: { createdAt: 'asc' }
    });

    if (overdueInquiries.length === 0) return { success: true, count: 0 };

    const inquiryListHtml = overdueInquiries.map((inq: any) => `
        <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px;">${new Date(inq.createdAt).toLocaleDateString()}</td>
            <td style="padding: 12px 8px;"><b>${inq.name}</b><br><small>${inq.email}</small></td>
            <td style="padding: 12px 8px;"><span style="background: #fed7d7; color: #9b2c2c; padding: 2px 6px; border-radius: 4px; font-size: 11px;">OVERDUE</span></td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #9b2c2c; padding: 20px; color: white;">
                <h2 style="margin: 0; font-size: 18px;">⚠️ SLA Warning: Pending Inquiries</h2>
                <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">The following leads have been waiting for more than 24 hours.</p>
            </div>
            <div style="padding: 24px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="color: #64748b; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #edf2f7;">
                            <th style="padding: 8px;">Date</th>
                            <th style="padding: 8px;">Customer</th>
                            <th style="padding: 8px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inquiryListHtml}
                    </tbody>
                </table>
                <div style="margin-top: 32px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/admin/dashboard/inquiries" 
                       style="background: #1F3D2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                       Manage Inquiries
                    </a>
                </div>
            </div>
        </div>
    `;

    const transporter = getTransporter();
    if (!transporter) return;

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: adminEmail,
        subject: `🚨 [URGENT] ${overdueInquiries.length} Overdue Inquiries Needing Attention`,
        html,
    });

    return { success: true, count: overdueInquiries.length };
}
