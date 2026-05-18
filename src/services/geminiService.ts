import { CRMData } from "../types/crm";

export async function getAIInsight(data: CRMData[], query: string, language: string = 'en') {
  try {
    const response = await fetch("/api/web/gemini/predict", { // Fixed path if needed, usually /api/gemini/predict
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, query, mode: 'chat', language }),
    });
    const result = await response.json();
    return result.text || "I'm sorry, I couldn't generate an insight at this time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error communicating with AI service. Please check your connection.";
  }
}

export async function getForecastingInsights(data: CRMData[], language: string = 'en') {
  try {
    const response = await fetch("/api/gemini/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, mode: 'forecast', language }),
    });
    const result = await response.json();
    return result.text || "No forecasting data available.";
  } catch (error) {
    console.error("Forecasting Error:", error);
    return "Error generating forecast.";
  }
}

export async function getAbsolutePredictions(data: CRMData[], mode: string = 'predictions', language: string = 'en') {
  try {
    const response = await fetch("/api/gemini/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, mode, language }),
    });
    const result = await response.json();
    return result.text || "Absolute predictions unavailable for this dataset.";
  } catch (error) {
    console.error("Predictions Error:", error);
    return "Error generating absolute predictions.";
  }
}

export async function translateText(text: string, language: string = 'en') {
  try {
    const response = await fetch("/api/gemini/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, data: [], mode: 'translate', language }),
    });
    const result = await response.json();
    return result.text || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}
