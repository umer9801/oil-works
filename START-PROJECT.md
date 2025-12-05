# 🚀 Project Start Karne Ka Tareeqa

## ✅ Setup Complete!

Aapka MongoDB connection string set ho gaya hai:
- Username: `oil-works`
- Password: `nokia9801`
- Database: `oil-works`

## 🎯 Ab Project Run Karein:

### Terminal mein ye commands run karein:

```bash
cd the-oil-works
npm run dev
```

### Browser mein open karein:
```
http://localhost:3000
```

## 📱 Features Test Karein:

1. **Home Page** - Dashboard with all options
2. **Add Customer** - Naya customer add karein
3. **Manage Stock** - Stock items add karein
4. **New Receipt** - Service receipt create karein
5. **View Receipts** - Past receipts dekhen

## 🔥 First Time Setup:

### 1. Stock Add Karein:
- Home → "Manage Stock"
- "+ Add Stock" click karein
- Example items:
  - Item: "Castrol 5W-30", Quantity: 20, Category: Oil
  - Item: "Mann Filter", Quantity: 15, Category: Oil Filter
  - Item: "K&N Air Filter", Quantity: 8, Category: Air Filter
  - Item: "Cabin Filter", Quantity: 6, Category: A/C Filter

### 2. Customer Add Karein:
- Home → "Add Customer"
- Test customer add karein

### 3. Receipt Banayein:
- Home → "New Receipt"
- Details fill karein
- "Create & Print Receipt" click karein

## 📊 Low Stock Alert Test:

Jab kisi item ki quantity 5 ya kam hogi:
- Stock page pe red alert show hoga
- Item red background mein highlight hoga

## 🔧 Agar Error Aaye:

### MongoDB Connection Error:
```
Error: connect ECONNREFUSED
```
**Solution**: 
- Check karein internet connection
- MongoDB Atlas dashboard mein Network Access check karein
- `.env.local` file mein connection string verify karein

### Port Already in Use:
```
Error: Port 3000 is already in use
```
**Solution**:
```bash
# Different port pe run karein
npm run dev -- -p 3001
```

## 📱 Phone Pe Install:

### Android (Chrome):
1. Mobile browser mein `http://your-ip:3000` open karein
2. Menu (⋮) → "Add to Home Screen"
3. "Install" click karein

### iPhone (Safari):
1. Safari mein site open karein
2. Share button (⬆️) → "Add to Home Screen"

## 🌐 Production Deploy (Optional):

### Vercel pe deploy karne ke liye:
1. GitHub pe project push karein
2. https://vercel.com pe login karein
3. "Import Project" → GitHub repo select karein
4. Environment Variables add karein:
   - Key: `MONGODB_URI`
   - Value: (apni connection string)
5. "Deploy" click karein

---

## 🎉 All Set!

Project ready hai. Enjoy coding! 🚀

**Support ke liye:**
- `README.md` - Technical docs
- `SETUP-GUIDE-URDU.md` - Detailed setup
- `MONGODB-QUICK-SETUP.md` - Quick reference
