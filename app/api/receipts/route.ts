import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Receipt from '@/models/Receipt';

export async function GET() {
  try {
    await dbConnect();
    const receipts = await Receipt.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(receipts || []);
  } catch (error: any) {
    console.error('Receipts fetch error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch receipts',
      receipts: []
    }, { status: 200 }); // Return 200 with empty array
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
