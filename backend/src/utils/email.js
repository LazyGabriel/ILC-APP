const nodemailer = require('nodemailer');

const createTransporter = () => {
  // If no real email config, use Ethereal (fake SMTP for dev)
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'ethereal_test', pass: 'ethereal_test' },
    });
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateOrderEmailHtml = (order) => {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${(item.price * item.qty).toLocaleString()} CZK</td>
      </tr>`
    )
    .join('');

  const trackingUrl = `${process.env.FRONTEND_URL}/track?token=${order.trackingToken}&id=${order.orderId}`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f,#2d5282);padding:32px 40px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">📚</div>
      <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">ILC International House</h1>
      <p style="color:#93c5fd;margin:4px 0 0;font-size:14px;">Order Confirmation</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:16px;">Dear <strong>${order.contactName}</strong>,</p>
      <p style="color:#6b7280;">Thank you for your order! We have received your request and will send you an invoice shortly.</p>

      <!-- Order ID box -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 24px;margin:24px 0;text-align:center;">
        <p style="color:#6b7280;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em;">Your Order ID</p>
        <p style="color:#1e3a5f;font-size:24px;font-weight:700;margin:0;">${order.orderId}</p>
      </div>

      <!-- Institution -->
      <div style="margin-bottom:24px;">
        <h3 style="color:#1e3a5f;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Institution</h3>
        <p style="color:#374151;margin:2px 0;">${order.schoolName}</p>
        <p style="color:#6b7280;margin:2px 0;font-size:14px;">${order.address}, ${order.zip} ${order.city}, ${order.country}</p>
        ${order.vat ? `<p style="color:#6b7280;margin:2px 0;font-size:14px;">VAT: ${order.vat}</p>` : ''}
      </div>

      <!-- Items table -->
      <h3 style="color:#1e3a5f;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Book</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px;text-align:right;font-weight:700;color:#1e3a5f;">Total:</td>
            <td style="padding:12px;text-align:right;font-weight:700;color:#1e3a5f;font-size:18px;">${order.total.toLocaleString()} CZK</td>
          </tr>
        </tfoot>
      </table>

      <p style="color:#6b7280;font-size:13px;">An invoice will be sent separately. Payment is due within 14 days of invoice date.</p>

      <!-- Track button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${trackingUrl}" style="display:inline-block;background:#1e3a5f;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
          📦 Track Your Order
        </a>
      </div>

      ${order.notes ? `<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-top:16px;"><p style="color:#92400e;font-size:13px;margin:0;"><strong>Your notes:</strong> ${order.notes}</p></div>` : ''}
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">ILC International House Brno · Náměstí Svobody 17, 602 00 Brno · books@ilc.cz</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">Member of International House World Organisation</p>
    </div>
  </div>
</body>
</html>`;
};

const sendOrderConfirmation = async (order) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ILC Books <books@ilc.cz>',
      to: order.email,
      subject: `Order Confirmed – ${order.orderId} | ILC Books`,
      html: generateOrderEmailHtml(order),
    });

    // Also notify admin
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'ILC Books <books@ilc.cz>',
        to: process.env.ADMIN_EMAIL,
        subject: `New Order: ${order.orderId} from ${order.schoolName}`,
        html: `<p>New order received from <strong>${order.schoolName}</strong>.</p><p>Total: ${order.total.toLocaleString()} CZK</p><p>Email: ${order.email}</p>${generateOrderEmailHtml(order)}`,
      });
    }
    return true;
  } catch (err) {
    console.error('[Email] Failed to send order confirmation:', err.message);
    return false;
  }
};

const sendContactNotification = async (msg) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ILC Books <books@ilc.cz>',
      to: process.env.ADMIN_EMAIL || 'admin@ilc.cz',
      replyTo: msg.email,
      subject: `Contact Form: ${msg.subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${msg.name} &lt;${msg.email}&gt;</p>
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <hr/>
        <p>${msg.message.replace(/\n/g, '<br/>')}</p>
      `,
    });
    return true;
  } catch (err) {
    console.error('[Email] Failed to send contact notification:', err.message);
    return false;
  }
};

module.exports = { sendOrderConfirmation, sendContactNotification };
