# The Oil Works - POS System

Point of Sale system for oil changing shop.

## Features

- Customer Management (Add, Edit, Delete)
- Stock Management with Low Stock Alerts
- Itemized Receipt Generation & Printing
- Excel Export (Customers & Receipts)
- Profit/Loss Reports
- Login System
- Responsive Design (Mobile & Desktop)
- PWA Support

## Quick Start

1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your MongoDB URI in `.env.local`
5. Run: `npm run dev`

## Default Login

- Username: `admin`
- Password: `admin123`

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project on Vercel
3. Add environment variable: `MONGODB_URI`
4. Deploy

### Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
```

## Tech Stack

- Next.js 16
- MongoDB with Mongoose
- TypeScript
- Tailwind CSS
- XLSX for Excel export

## Repository

https://github.com/umer9801/oil-works
