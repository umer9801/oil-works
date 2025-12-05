import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Receipt from '@/models/Receipt';

export async function GET() {
  try {
    await dbConnect();
    const receipts = await Receipt.find({}).sort({ createdAt: -1 });
    return NextResponse.json(receipts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const receipt = await Receipt.create(body);
    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create receipt' }, { status: 500 });
  }
}
