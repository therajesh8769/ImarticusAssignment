import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/summarize-pdf', async (req, res) => {
  try {
    const { pdfUrl, title } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'PDF URL is required'
      });
    }

    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `I as an Admin, upload a document,You are an expert at summarizing academic and educational documents.

Please provide a comprehensive summary of the document titled "${title || 'this document'}". The document is from: ${pdfUrl}

Create a well-structured summary that includes:
1. Main topics and key concepts
2. Important findings or insights
3. Practical applications or takeaways
4. Any notable conclusions

Keep the summary informative yet concise (around 200-300 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({
      success: true,
      summary,
      title: title || 'Document Summary'
    });
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message
    });
  }
});

export default router;
