const Gemini_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

export const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(
      `${Gemini_Url}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      throw new Error("Gemini returned empty response");
    }

    // Extract JSON block safely
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response");
    }

    const cleanText = jsonMatch[0];

    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parse failed. Raw Gemini text:", rawText);
      throw new Error("Invalid JSON from Gemini");
    }

  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};
