import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Loan from '@/models/Loan';

export async function GET() {
  try {
    await connectDB();
    const loans = await Loan.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(loans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const loan = await Loan.create({
      ...data,
      remainingAmount: data.totalAmount,
      status: 'pending'
    });
    
    return NextResponse.json({ success: true, loan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, paymentAmount, paymentNote } = await request.json();
    
    const loan = await Loan.findById(id);
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }
    
    // Add payment
    loan.payments.push({
      amount: paymentAmount,
      date: new Date(),
      note: paymentNote || ''
    });
    
    loan.paidAmount += paymentAmount;
    loan.remainingAmount = loan.totalAmount - loan.paidAmount;
    
    // Update status
    if (loan.remainingAmount <= 0) {
      loan.status = 'paid';
      loan.remainingAmount = 0;
    } else if (loan.paidAmount > 0) {
      loan.status = 'partial';
    }
    
    await loan.save();
    
    return NextResponse.json({ success: true, loan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { id, totalAmount, remainingAmount, description, status } = await request.json();
    
    const loan = await Loan.findById(id);
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }
    
    loan.totalAmount = totalAmount;
    loan.remainingAmount = remainingAmount;
    loan.description = description;
    loan.status = status;
    
    await loan.save();
    
    return NextResponse.json({ success: true, loan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Loan ID required' }, { status: 400 });
    }
    
    await Loan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
