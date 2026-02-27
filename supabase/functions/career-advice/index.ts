import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userType, formData } = await req.json();

    let context = "";
    if (userType === "student") {
      context = `Student Profile: Name: ${formData.fullName}, Education: ${formData.educationLevel}, Stream: ${formData.stream}, Interests: ${formData.interests?.join(", ")}, Hobbies: ${formData.hobbies?.join(", ") || "None"}, Preferred Industry: ${formData.preferredIndustry || "Open"}`;
    } else if (userType === "fresher") {
      context = `Fresher Profile: Name: ${formData.fullName}, Degree: ${formData.degree}, Graduation Year: ${formData.graduationYear}, Skills: ${formData.skills?.join(", ")}, Projects: ${formData.projects?.join(", ") || "None"}, Certifications: ${formData.certifications?.join(", ") || "None"}, Preferred Role: ${formData.preferredRole || "Open"}`;
    } else {
      context = `Career Changer Profile: Name: ${formData.fullName}, Current Role: ${formData.currentRole}, Experience: ${formData.yearsOfExperience} years, Current Skills: ${formData.currentSkills?.join(", ")}, Reason for Change: ${formData.reasonForChange || "Not specified"}, Preferred Domain: ${formData.preferredDomain || "Open"}, Education: ${formData.education || "Not specified"}`;
    }

    const prompt = `You are a career guidance AI. Analyze this profile and respond ONLY with valid JSON (no markdown, no code blocks).

${context}

Return this exact JSON structure:
{
  "topCareer": { "title": "string", "alignment": number_0_to_100, "emoji": "single_emoji" },
  "otherCareers": [
    { "title": "string", "alignment": number_0_to_100, "emoji": "single_emoji" },
    { "title": "string", "alignment": number_0_to_100, "emoji": "single_emoji" },
    { "title": "string", "alignment": number_0_to_100, "emoji": "single_emoji" }
  ],
  "skillsYouHave": ["skill1", "skill2", "skill3"],
  "skillsYouNeed": ["skill1", "skill2", "skill3"],
  "skillsToImprove": ["skill1", "skill2", "skill3"],
  "advice": "2-3 sentences of personalized career advice"
}

Be specific and realistic. Alignment scores should reflect genuine fit based on the profile data.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response, stripping markdown code blocks if present
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
