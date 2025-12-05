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
    console.log('Creating receipt:', body);
    const receipt = await Receipt.create(body);
    return NextResponse.json({ success: true, receipt }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create receipt:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to create receipt' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Receipt.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Receipt deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete receipt:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to delete receipt' 
    }, { status: 500 });
  }
}
