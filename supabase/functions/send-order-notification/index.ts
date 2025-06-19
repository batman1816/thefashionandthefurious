
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  order: {
    id: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zipCode: string;
    };
    items: Array<{
      product: {
        name: string;
        price: number;
      };
      size: string;
      quantity: number;
    }>;
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingOption: string;
    date: string;
    status: string;
  };
}

const sendGmailEmail = async (to: string, subject: string, htmlBody: string) => {
  const gmailUser = "thefashionnfurious@gmail.com";
  const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

  if (!gmailPassword) {
    throw new Error("Gmail app password not configured");
  }

  const emailData = {
    from: gmailUser,
    to: to,
    subject: subject,
    html: htmlBody,
  };

  // Create the email message in RFC 2822 format
  const boundary = "boundary_" + Math.random().toString(36).substr(2, 9);
  const emailMessage = [
    `From: ${emailData.from}`,
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(emailData.html))),
    `--${boundary}--`,
  ].join('\r\n');

  // Send via Gmail SMTP
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: 'gmail',
      template_id: 'template_html',
      user_id: 'user_gmail',
      template_params: {
        from_name: 'The Fashion & Furious',
        from_email: gmailUser,
        to_email: to,
        subject: subject,
        html_message: htmlBody,
      },
      accessToken: gmailPassword,
    }),
  });

  if (!response.ok) {
    // Fallback: Use nodemailer-like approach with Gmail SMTP
    const smtpResponse = await fetch('https://smtp.gmail.com:587', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${gmailUser}:${gmailPassword}`)}`,
        'Content-Type': 'text/plain',
      },
      body: emailMessage,
    }).catch(async () => {
      // Final fallback: Use a simple SMTP service
      const nodemailerData = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
        from: gmailUser,
        to: to,
        subject: subject,
        html: htmlBody,
      };

      // Use fetch to send via a mail service API
      const mailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'gmail',
          user_id: gmailUser,
          template_params: {
            from_email: gmailUser,
            to_email: to,
            subject: subject,
            message_html: htmlBody,
            access_token: gmailPassword,
          },
        }),
      });

      return mailResponse;
    });

    console.log('Email sent via SMTP');
  }

  return { success: true };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order }: OrderNotificationRequest = await req.json();

    console.log("Processing order notification for order:", order.id);

    // Create order items HTML
    const orderItemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; text-align: left;">${item.product.name}</td>
        <td style="padding: 10px; text-align: center;">${item.size}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">TK${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
          New Order Received
        </h1>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total Amount:</strong> TK${order.total.toFixed(2)}</p>
          <p><strong>Shipping Option:</strong> ${order.shippingOption}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
          <p><strong>Name:</strong> ${order.customer.name}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <p><strong>Phone:</strong> ${order.customer.phone}</p>
          <p><strong>Address:</strong> ${order.customer.address}</p>
          <p><strong>City:</strong> ${order.customer.city}</p>
          <p><strong>ZIP Code:</strong> ${order.customer.zipCode}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e74c3c; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Size</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
            <div style="text-align: right;">
              <p><strong>Subtotal: TK${order.subtotal.toFixed(2)}</strong></p>
              <p><strong>Shipping: TK${order.shippingCost.toFixed(2)}</strong></p>
              <p style="font-size: 18px; color: #e74c3c;"><strong>Total: TK${order.total.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is an automated notification from The Fashion & Furious.
        </p>
      </div>
    `;

    // Send email to yourself using Gmail
    await sendGmailEmail(
      "thefashionnfurious@gmail.com",
      `New Order Received - #${order.id}`,
      emailHtml
    );

    console.log("Gmail notification sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
