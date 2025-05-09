import { Together } from '@together-ai/sdk';

// Initialize TogetherAI client
const togetherAi = new Together(process.env.TOGETHER_AI_API_KEY || 'default-key');

/**
 * Generate multiple-choice questions using TogetherAI
 * @param {string} topic - The topic to generate questions about
 * @param {number} numQuestions - Number of questions to generate
 * @returns {Array} - Array of question objects
 */
export const generateQuestionsWithTogetherAI = async (topic, numQuestions = 10) => {
  try {
    // Create prompt for TogetherAI
    const prompt = `
Generate ${numQuestions} multiple-choice questions about ${topic}.
For each question:
1. The question should test understanding, not just memorization
2. Provide four possible answer options (A, B, C, D)
3. Indicate the correct answer
4. Ensure all options are plausible but only one is correct

Format your response as a valid JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option that is correct"
  }
]
`;

    // Call TogetherAI API
    const response = await togetherAi.complete({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      prompt: [
        { role: 'system', content: 'You are a helpful AI assistant skilled at creating educational quizzes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Extract and parse JSON response
    const responseText = response.output.choices[0].text;
    const jsonRegex = /\[\s*\{.*\}\s*\]/s;
    const jsonMatch = responseText.match(jsonRegex);
    
    if (!jsonMatch) {
      throw new Error('Failed to extract valid JSON from AI response');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format');
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
};