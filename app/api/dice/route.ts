// app/api/dice/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { betAmount, chance } = body;

    if (typeof betAmount !== 'number' || typeof chance !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (chance <= 0 || chance >= 100) {
      return NextResponse.json({ error: 'Chance must be between 1 and 99' }, { status: 400 });
    }

   const rolled = Math.floor(Math.random() * 100) + 1;
    const win = rolled <= chance;
    const payoutMultiplier = parseFloat((99 / chance).toFixed(2));
    const payout = win ? parseFloat((betAmount * payoutMultiplier).toFixed(2)) : 0;

    return NextResponse.json({
      win,
      rolled,
      payout,
      payoutMultiplier,
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}