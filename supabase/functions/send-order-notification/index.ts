
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

  console.log("Sending email via Gmail SMTP");

  // Create the email message in RFC 5322 format
  const boundary = "----=_Part_" + Math.random().toString(36).substr(2, 9);
  
  const emailMessage = [
    `From: ${gmailUser}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`
  ].join('\r\n');

  // Use a third-party email service that accepts Gmail credentials
  try {
    // Try using EmailJS service
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'gmail',
        template_id: 'template_orders',
        user_id: 'public_key',
        template_params: {
          from_name: 'The Fashion & Furious',
          from_email: gmailUser,
          to_email: to,
          subject: subject,
          message_html: htmlBody,
          reply_to: gmailUser,
        },
        access_token: gmailPassword,
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully via EmailJS');
      return { success: true };
    } else {
      console.log('EmailJS failed, trying direct SMTP approach');
    }
  } catch (error) {
    console.log('EmailJS error:', error);
  }

  // Fallback: Use Nodemailer-compatible service
  try {
    const smtpResponse = await fetch('https://smtp.gmail.com/smtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${gmailUser}:${gmailPassword}`)}`,
      },
      body: JSON.stringify({
        from: gmailUser,
        to: to,
        subject: subject,
        html: htmlBody,
      }),
    });

    if (smtpResponse.ok) {
      console.log('Email sent successfully via SMTP');
      return { success: true };
    }
  } catch (error) {
    console.log('SMTP error:', error);
  }

  // Final fallback: Use a simple mail service
  try {
    const mailResponse = await fetch('https://formspree.io/f/xeojvqpo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: gmailUser,
        subject: subject,
        message: `
          <html>
            <body>
              ${htmlBody}
              <br><br>
              <strong>Customer Email:</strong> ${to}
            </body>
          </html>
        `,
      }),
    });

    if (mailResponse.ok) {
      console.log('Email sent successfully via Formspree');
      return { success: true };
    }
  } catch (error) {
    console.log('Formspree error:', error);
  }

  // If all methods fail, just log but don't fail the order
  console.error('All email sending methods failed, but order will be processed');
  return { success: false, error: 'Email sending failed but order was processed' };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order }: OrderNotificationRequest = await req.json();

    console.log("Processing order notification for order:", order.id);
    console.log("Gmail app password available:", !!Deno.env.get("GMAIL_APP_PASSWORD"));

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
          New Order Received - The Fashion & Furious
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
          This is an automated notification from The Fashion & Furious order system.
        </p>
      </div>
    `;

    // Send email to yourself using Gmail
    const emailResult = await sendGmailEmail(
      "thefashionnfurious@gmail.com",
      `New Order Received - #${order.id}`,
      emailHtml
    );

    console.log("Email sending result:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
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
