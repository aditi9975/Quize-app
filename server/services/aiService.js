import Together from "together-ai";
import dotenv from 'dotenv';

dotenv.config();

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export const generateQuiz = async (topic, difficulty = 'medium', numQuestions = 5) => {
  try {
    console.log('Generating quiz with params:', { topic, difficulty, numQuestions });

    if (!process.env.TOGETHER_API_KEY) {
      console.error('Missing TOGETHER_API_KEY');
      return { success: false, error: 'API key missing' };
    }

    const prompt = `Generate a ${difficulty} difficulty quiz about ${topic} with ${numQuestions} multiple choice questions. 
Format each question as a JSON object like:
{
  "question": "The question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "option1",
  "explanation": "Brief explanation of the correct answer"
}
Return only the JSON array.`;

    console.log('Sending request to Together AI...');

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      temperature: 0.7,
      max_tokens: 2048
    });

    console.log('Received response from Together AI');

    const content = response.choices[0].message.content;
    console.log('Raw AI response:', content);

    // Try to parse the content directly first
    try {
      const questions = JSON.parse(content);
      if (Array.isArray(questions)) {
        console.log('Successfully parsed questions directly');
        return {
          success: true,
          questions: questions
        };
      }
    } catch (parseError) {
      console.log('Direct parse failed, trying to extract JSON from content');
    }

    // If direct parse fails, try to extract JSON from the content
    const jsonRegex = /\[\s*\{.*?\}\s*\]/s;
    const jsonMatch = content.match(jsonRegex);
    if (!jsonMatch) {
      console.error('Failed to extract JSON array from model output');
      throw new Error("Failed to extract JSON array from model output");
    }

    const questions = JSON.parse(jsonMatch[0]);
    console.log('Successfully extracted and parsed questions');

    return {
      success: true,
      questions: questions
    };

  } catch (error) {
    console.error('Error in generateQuiz:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};
