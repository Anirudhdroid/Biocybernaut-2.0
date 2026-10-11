// Biocybernaut AI Assistant — Edge Function integration layer
//
// This edge function provides a secure backend for the AI assistant chat.
// It forwards visitor questions to a Generative AI model (e.g. OpenAI)
// while keeping API keys server-side.
//
// CONFIGURATION:
//   1. Set these secrets in your Supabase project:
//      - AI_API_KEY       (your LLM provider API key)
//      - AI_API_ENDPOINT   (e.g. https://api.openai.com/v1/chat/completions)
//      - AI_MODEL          (e.g. gpt-4o-mini)
//   2. The frontend automatically calls this function — no VITE_ env needed.
//
// If no AI_API_KEY is configured, the function returns a 503 so the
// frontend falls back to its local knowledge base gracefully.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the AI assistant for a Biocybernaut-style brainwave training website.

Your role is to help visitors understand neurofeedback, explore training programs, review the scientific evidence, and guide interested visitors toward a consultation.

## Knowledge Base

You must ground your answers in the information below. Do not invent details beyond what is provided.

### Programs Available
1. Alpha Brainwave Rebalancing (Neurofeedback, 5-day) — relaxation and stress reduction through alpha wave training
2. Peak Performance Training (Performance, 7-day) — focus, mental clarity, and cognitive performance
3. Meditation Enhancement (Mindfulness, 4-day) — deepening meditation with real-time EEG feedback
4. Sleep Optimization (Wellness, 6-day) — supporting healthier sleep patterns
5. Focus & Attention Training (Neurofeedback, 5-day) — sustained attention and reduced distractibility
6. Creativity Enhancement (Performance, 4-day) — fostering creative thinking through brainwave training

### How Training Works
Three steps: Measure (EEG sensors detect brainwave activity in real time) → Observe (visual and audio feedback shows patterns live) → Train (through guided sessions, you learn to recognize and influence brainwave states).

### Brainwave Bands
- Delta (0.5–4 Hz): deep sleep
- Theta (4–8 Hz): drowsiness/meditation
- Alpha (8–13 Hz): relaxed alertness
- Beta (13–30 Hz): active thinking
- Gamma (30+ Hz): high-level processing

### Science & Evidence
- What Is Neurofeedback? [established]: EEG-based real-time brainwave feedback
- EEG and Brainwave Bands [established]: frequency-band measurement is well-established
- Alpha Brainwave Training [emerging]: may help relaxation/stress reduction; evidence varies
- Neurofeedback for Peak Performance [requires-further-evidence]: mixed results, needs larger studies
- Neurofeedback and Sleep [requires-further-evidence]: preliminary, not yet strong enough for clinical claims

### Benefits (research interest, not guaranteed)
- Self-awareness: observing your own brainwave patterns
- Relaxation: alpha training for calm and stress reduction
- Focus & attention: training sustained concentration
- Meditation depth: recognizing mental states

### Intended Audience
Professionals seeking sharper focus, athletes exploring mental performance, meditators deepening their practice, and anyone curious about self-awareness through EEG feedback.

### Key Rules
- Never invent prices, testimonials, scientific citations, or medical claims.
- If you don't know something, say so and suggest using the Enquiry form.
- Keep responses concise and helpful (2–4 sentences unless more detail is clearly needed).
- Do not provide medical advice, diagnosis, or treatment. Direct medical questions to a healthcare professional.
- Do not claim to book appointments, accept payments, or access live brainwave data.
- The site has these pages: Home, Programs, Science, Enquiry. When recommending a page, mention it by name.
- For consultation or enrolment questions, guide visitors to the Enquiry page.`;

interface ChatRequestBody {
  query: string;
  history?: { role: string; text: string }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("AI_API_KEY");
  const apiEndpoint = Deno.env.get("AI_API_ENDPOINT") ?? "https://api.openai.com/v1/chat/completions";
  const model = Deno.env.get("AI_MODEL") ?? "gpt-4o-mini";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI service not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body: ChatRequestBody = await req.json();
    const { query, history } = body;

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing query" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: query },
    ];

    const aiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: 500, temperature: 0.7 }),
    });

    if (!aiResponse.ok) {
      const errBody = await aiResponse.text().catch(() => "");
      console.error(`AI API ${aiResponse.status}: ${errBody.slice(0, 500)}`);
      throw new Error(`AI API returned ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const text = aiData.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No content in AI response");
    }

    return new Response(
      JSON.stringify({ text: text.trim() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("AI chat error:", msg);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
