import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(customers || []);
  } catch (error: any) {
    console.error('Customer fetch error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch customers',
      customers: [] 
    }, { status: 200 }); // Return 200 with empty array instead of 500
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('Creating customer:', body);
    const customer = await Customer.create(body);
    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create customer:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to create customer' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Customer.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
