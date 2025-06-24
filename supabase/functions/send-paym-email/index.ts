// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { Resend } from "npm:resend@2.0.0";

// @ts-ignore
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymEmailRequest {
  to: string;
  paymTitle: string;
  amount: number;
  currency: string;
  paymLink: string;
  senderName: string;
  expiresAt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      paymTitle,
      amount,
      currency,
      paymLink,
      senderName,
      expiresAt,
    }: PaymEmailRequest = await req.json();

    console.log("Sending paym email to:", to);

    const expiryText = expiresAt
      ? `<p style="color: #666; font-size: 14px; margin: 10px 0;">This payment request expires on ${new Date(
          expiresAt
        ).toLocaleDateString()}.</p>`
      : "";

    const emailResponse = await resend.emails.send({
      from: "Paym <onboarding@resend.dev>",
      to: [to],
      subject: `Payment Request: ${paymTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://yluhgcbluxsnzlyhyabr.supabase.co/storage/v1/object/public/assets/paym-logo.png" alt="Paym" style="height: 60px; width: auto;">
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Payment Request</h2>
            <p style="font-size: 16px;">You have received a payment request from <strong>${senderName}</strong>.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff;">
              <h3 style="margin: 0 0 10px 0; color: #007bff;">${paymTitle}</h3>
              <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">${currency}${amount}</p>
            </div>
            
            ${expiryText}
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${paymLink}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Pay Now
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
            <p>This email was sent by ${senderName} through Paym.</p>
            <p>If you believe this email was sent to you by mistake, please ignore it.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-paym-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
