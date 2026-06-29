import { sendResponse } from '../utils/response.js';

export const generateBio = async (req, res, next) => {
  try {
    const { prompt, tone = 'professional' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'OpenAI API key is not configured' });
    }

    const systemPrompt = `You are an expert bio writer for personal websites. Write a short, engaging, and ${tone} bio based on the user's prompt. Keep it under 3 sentences. Do not use quotes or introductory phrases, just output the bio itself.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return res.status(500).json({ success: false, message: 'Failed to generate bio from AI' });
    }

    const data = await response.json();
    const bio = data.choices[0].message.content.trim();

    sendResponse(res, 200, true, 'Bio generated successfully', { bio });
  } catch (error) {
    next(error);
  }
};
