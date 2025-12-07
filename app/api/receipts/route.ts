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
    
    // Create receipt
    const receipt = await Receipt.create(body);
    
    // Deduct stock for each item
    if (body.items && Array.isArray(body.items)) {
      const Stock = (await import('@/models/Stock')).default;
      
      for (const item of body.items) {
        const stockItem = await Stock.findById(item.itemId);
        if (stockItem) {
          if (item.category === 'oil' && item.litres) {
            // Deduct litres from oil stock
            const newTotalLitres = (stockItem.totalLitres || 0) - item.litres;
            const newQuantity = newTotalLitres / (stockItem.litresPerGallon || 1);
            await Stock.findByIdAndUpdate(item.itemId, {
              totalLitres: Math.max(0, newTotalLitres),
              quantity: Math.max(0, newQuantity),
              updatedAt: new Date()
            });
          } else {
            // Deduct quantity for filters
            const newQuantity = (stockItem.quantity || 0) - (item.quantity || 0);
            await Stock.findByIdAndUpdate(item.itemId, {
              quantity: Math.max(0, newQuantity),
              updatedAt: new Date()
            });
          }
        }
      }
    }
    
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
