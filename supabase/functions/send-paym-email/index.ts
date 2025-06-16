
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymEmailRequest {
  recipientEmail: string;
  recipientName?: string;
  paymTitle: string;
  amount: number;
  currency: string;
  paymentLink: string;
  expiresAt?: string;
  invoiceId?: string;
  senderName?: string;
  upiId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipientEmail,
      recipientName,
      paymTitle,
      amount,
      currency,
      paymentLink,
      expiresAt,
      invoiceId,
      senderName,
      upiId
    }: PaymEmailRequest = await req.json();

    // Format expiration date if provided
    const expirationText = expiresAt 
      ? `Please complete payment before ${new Date(expiresAt).toLocaleDateString()}.`
      : '';

    // Generate UPI payment link
    const upiPaymentLink = upiId 
      ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(senderName || 'Paym.me')}&am=${amount}&cu=${currency === '₹' ? 'INR' : 'USD'}&tn=${encodeURIComponent(paymTitle)}`
      : paymentLink;

    // Create email content with enhanced design and Pay button
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Request</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
            }
            .header { 
              background: linear-gradient(135deg, #dc2e3e 0%, #ff4757 100%); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 600; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .amount { 
              font-size: 36px; 
              font-weight: 700; 
              color: #dc2e3e; 
              text-align: center; 
              margin: 30px 0; 
              padding: 20px; 
              background: #f8f9fa; 
              border-radius: 8px; 
              border-left: 4px solid #dc2e3e; 
            }
            .pay-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-size: 18px; 
              font-weight: 600; 
              text-align: center; 
              margin: 30px 0; 
              box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3); 
              transition: transform 0.2s; 
            }
            .pay-button:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4); 
            }
            .button-container { 
              text-align: center; 
              margin: 30px 0; 
            }
            .info-box { 
              background: #e3f2fd; 
              border: 1px solid #2196f3; 
              border-radius: 8px; 
              padding: 20px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              padding-top: 30px; 
              border-top: 1px solid #e9ecef; 
              color: #6c757d; 
              font-size: 14px; 
            }
            .logo { 
              font-size: 24px; 
              font-weight: 700; 
              color: #dc2e3e; 
              margin-bottom: 10px; 
            }
            .payment-methods { 
              margin: 20px 0; 
              text-align: center; 
            }
            .payment-methods p { 
              color: #6c757d; 
              font-size: 14px; 
              margin: 10px 0; 
            }
            @media (max-width: 600px) {
              .container { margin: 10px; }
              .content { padding: 30px 20px; }
              .amount { font-size: 28px; }
              .pay-button { padding: 14px 24px; font-size: 16px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Paym.me</div>
              <h1>Payment Request</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hello${recipientName ? ` ${recipientName}` : ''},</p>
              
              <p style="font-size: 16px; color: #6c757d;">You have received a payment request${senderName ? ` from <strong>${senderName}</strong>` : ''}:</p>
              
              <h2 style="color: #333; margin: 20px 0; font-size: 22px;">${paymTitle}</h2>
              ${invoiceId ? `<p style="margin: 10px 0;"><strong>Invoice ID:</strong> <span style="color: #dc2e3e; font-family: monospace;">${invoiceId}</span></p>` : ''}
              
              <div class="amount">${currency}${amount}</div>
              
              <div class="button-container">
                <a href="${upiPaymentLink}" class="pay-button">
                  💳 Pay Now
                </a>
              </div>
              
              <div class="payment-methods">
                <p><strong>Supported Payment Methods:</strong></p>
                <p>💳 UPI • 🏦 Net Banking • 💰 Wallets • 📱 QR Code</p>
                <p style="font-size: 12px; color: #adb5bd;">Works with GPay, PhonePe, Paytm, BHIM, and all UPI apps</p>
              </div>
              
              <div class="info-box">
                <p style="margin: 0; font-size: 14px;"><strong>Alternative Payment Link:</strong></p>
                <p style="margin: 10px 0 0 0; word-break: break-all;">
                  <a href="${paymentLink}" style="color: #2196f3; text-decoration: none;">${paymentLink}</a>
                </p>
              </div>
              
              ${expirationText ? `<p style="color: #ff6b6b; font-weight: 500; text-align: center; margin: 20px 0;"><em>⏰ ${expirationText}</em></p>` : ''}
              
              <div class="footer">
                <p><strong>Paym.me</strong> - Secure Payment Links</p>
                <p>If you have any questions, please contact the sender directly.</p>
                <p style="font-size: 12px; margin-top: 20px;">This email was sent automatically. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Paym.me <noreply@resend.dev>",
      to: [recipientEmail],
      subject: `💰 Payment Request: ${paymTitle} - ${currency}${amount}`,
      html: emailHtml,
    });

    console.log("Invoice email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invoice email:", error);
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
