import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/models/Stock';

export async function GET() {
  try {
    await dbConnect();
    const stock = await Stock.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const stock = await Stock.create(body);
    return NextResponse.json(stock, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stock' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, quantity } = body;
    const stock = await Stock.findByIdAndUpdate(id, { quantity, updatedAt: new Date() }, { new: true });
    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
