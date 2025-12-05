import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/models/Stock';

export async function GET() {
  try {
    await dbConnect();
    const stock = await Stock.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(stock || []);
  } catch (error: any) {
    console.error('Stock fetch error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch stock',
      stock: []
    }, { status: 200 }); // Return 200 with empty array
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('Creating stock:', body);
    const stock = await Stock.create(body);
    return NextResponse.json({ success: true, stock }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create stock:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to create stock' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    const stock = await Stock.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: new Date() }, 
      { new: true }
    ).lean();
    return NextResponse.json({ success: true, stock });
  } catch (error: any) {
    console.error('Failed to update stock:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to update stock' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Stock.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Stock deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete stock:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to delete stock' 
    }, { status: 500 });
  }
}
