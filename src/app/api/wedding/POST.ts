import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  console.log("🧠 Wedding Agent Task Received:", task);

  return NextResponse.json({
    success: true,
    task,
    message: `Simulated result for wedding task: ${task?.action}`,
  });
}