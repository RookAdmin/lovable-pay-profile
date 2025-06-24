
// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    console.log("Sending paym email via EmailJS to:", to);

    const expiryText = expiresAt
      ? `Expires on ${new Date(expiresAt).toLocaleDateString()}`
      : "No expiration date";

    // EmailJS API call
    const emailJSPayload = {
      service_id: "service_9dxsewl",
      template_id: "template_p6wkvnr",
      user_id: "NCttFpe_PZtgHbL88",
      template_params: {
        to_email: to,
        from_name: senderName,
        paym_title: paymTitle,
        amount: `${currency}${amount}`,
        payment_link: paymLink,
        expiry_text: expiryText,
        sender_name: senderName,
      },
    };

    console.log("EmailJS payload:", emailJSPayload);

    const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailJSPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("EmailJS API error:", errorText);
      throw new Error(`EmailJS API error: ${emailResponse.status} ${errorText}`);
    }

    const result = await emailResponse.text();
    console.log("EmailJS response:", result);

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
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
