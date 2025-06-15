import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json();

    if (!task || !task.action) {
      return NextResponse.json({ error: 'Missing task action' }, { status: 400 });
    }

    console.log('💍 Wedding Agent received task:', task);

    if (task.action === 'process_new_lead') {
      const { lead } = task;
      const estimatedValue = (parseInt(lead.groomsmenCount) + 1) * 300;

      // GPT summary
      const systemPrompt = `You are the KCT Wedding AI Agent. Summarize this lead and suggest the next best action for the business owner.`;
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is a new lead: ${JSON.stringify(lead)}` }
      ];

      let gptSummary = '';
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o', // or 'gpt-3.5-turbo'
          messages,
          max_tokens: 120,
        });
        gptSummary = response.choices[0]?.message?.content || '';
      } catch (gptErr) {
        gptSummary = 'Assistant unavailable. Please try again later.';
      }

      return NextResponse.json({
        success: true,
        message: 'Lead processed',
        status: 'new_lead',
        value: `$${estimatedValue}`,
        consultationETA: '24 hours',
        dashboardCTA: 'Schedule Consultation',
        gptSummary
      });
    }

    return NextResponse.json({
      success: true,
      task,
      message: `Simulated result for wedding task: ${task.action}`
    });
  } catch (err: any) {
    console.error('❌ Wedding Agent error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Wedding Agent API is live!" });
} 