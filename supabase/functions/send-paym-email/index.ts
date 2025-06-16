
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
      senderName
    }: PaymEmailRequest = await req.json();

    // Format expiration date if provided
    const expirationText = expiresAt 
      ? `Please complete payment before ${new Date(expiresAt).toLocaleDateString()}.`
      : '';

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2e3e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .amount { font-size: 24px; font-weight: bold; color: #dc2e3e; margin: 20px 0; }
            .button { display: inline-block; background: #dc2e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Request</h1>
            </div>
            <div class="content">
              <p>Hello${recipientName ? ` ${recipientName}` : ''},</p>
              
              <p>You have received a payment request${senderName ? ` from ${senderName}` : ''}:</p>
              
              <h3>${paymTitle}</h3>
              ${invoiceId ? `<p><strong>Invoice ID:</strong> ${invoiceId}</p>` : ''}
              
              <div class="amount">${currency}${amount}</div>
              
              <p>Click the button below to complete your payment:</p>
              
              <a href="${paymentLink}" class="button">Pay Now</a>
              
              <p>Or copy and paste this link in your browser:<br>
              <a href="${paymentLink}">${paymentLink}</a></p>
              
              ${expirationText ? `<p><em>${expirationText}</em></p>` : ''}
              
              <div class="footer">
                <p>This payment request was sent via Paym.me</p>
                <p>If you have any questions, please contact the sender directly.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Paym.me <noreply@resend.dev>", // You can customize this with your verified domain
      to: [recipientEmail],
      subject: `Payment Request: ${paymTitle}`,
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
