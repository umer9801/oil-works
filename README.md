# The Oil Works - POS System

Oil changing shop ke liye complete Point of Sale system with mobile app support.

## Features

✅ **Customer Management** - Add aur view customers
✅ **Stock Management** - Inventory tracking with low stock alerts (5 se kam)
✅ **Receipt Generation** - Professional receipts with print support
✅ **Data Storage** - MongoDB ke saath 30 days data retention
✅ **Responsive UI** - Mobile aur laptop dono ke liye optimized
✅ **PWA Support** - Phone pe app ki tarah install ho sakta hai

## Setup Instructions

### 1. MongoDB Setup

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) pe free account banayein
2. New cluster create karein (free tier)
3. Database user create karein
4. Connection string copy karein
5. `.env.local` file mein paste karein:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oil-works?retryWrites=true&w=majority
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Browser mein open karein: `http://localhost:3000`

### 4. Phone Pe Install Karne Ke Liye

1. Mobile browser mein website open karein
2. Browser menu mein "Add to Home Screen" option select karein
3. App install ho jayega

## Usage

- **Home Page**: Main dashboard with all options
- **Add Customer**: Naye customers register karein
- **Manage Stock**: Inventory add/view karein, low stock alerts dekhein
- **New Receipt**: Service receipt create aur print karein
- **View Receipts**: Past receipts history

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Database**: MongoDB with Mongoose
- **PWA**: Progressive Web App support

## Notes

- Customer aur receipt data automatically 30 days baad delete ho jata hai
- Stock 5 se kam hone pe red alert show hota hai
- Receipt print ke liye browser ka print function use hota hai
- Mobile aur desktop dono pe fully responsive

## Contact

For support: [Your Contact Info]
