# 🔐 Login Information

## Default Login Credentials:

```
Username: admin
Password: admin123
```

## Features Added:

### ✅ Login System
- Secure login page with logo
- Session management with localStorage
- Auto-redirect to dashboard after login
- Logout button on dashboard

### ✅ Low Stock Notifications
- **Popup Alert**: Top-right corner mein animated notification
- **Dashboard Banner**: Red warning banner with item count
- **Badge**: Stock card pe notification badge
- **Auto-refresh**: Every 30 seconds stock check hota hai
- **Threshold**: 5 ya kam quantity pe alert

## How It Works:

### Login Flow:
1. Open `http://localhost:3000`
2. Auto-redirect to `/login`
3. Enter credentials (admin/admin123)
4. Redirect to `/dashboard`
5. All pages protected - login required

### Stock Notifications:
1. Dashboard load hone pe stock check hota hai
2. Agar koi item 5 ya kam hai:
   - Popup notification show hota hai (top-right)
   - Dashboard pe red banner dikhta hai
   - Stock card pe badge number dikhta hai
3. Notification close kar sakte hain (X button)
4. "Check Stock" button se direct stock page pe ja sakte hain

## Customization:

### Change Login Credentials:
File: `app/login/page.tsx`
Line 14-17:
```typescript
if (credentials.username === 'admin' && credentials.password === 'admin123') {
  // Change 'admin' and 'admin123' to your desired credentials
}
```

### Change Stock Alert Threshold:
Current: 5 items or less

To change, update in these files:
- `app/dashboard/page.tsx` (line 32): `item.quantity <= 5`
- `app/stock/page.tsx` (line 73): `item.quantity <= 5`

### Change Notification Check Interval:
File: `app/dashboard/page.tsx`
Line 26:
```typescript
const interval = setInterval(fetchLowStock, 30000); // 30 seconds
// Change 30000 to desired milliseconds (e.g., 60000 = 1 minute)
```

## Logo Setup:

### Option 1: Use Your Own Logo
1. Save your logo as `logo.png` or `logo.svg`
2. Place in `public/` folder
3. Recommended size: 512x512 pixels
4. Update image path in:
   - `app/login/page.tsx`
   - `app/dashboard/page.tsx`

### Option 2: Current Default
- Using SVG placeholder logo
- Located at: `public/logo.svg`
- You can edit this SVG or replace it

## Security Notes:

⚠️ **Important**: Current implementation uses localStorage for authentication.

For production, consider:
- JWT tokens
- Server-side sessions
- Database user authentication
- Password hashing (bcrypt)
- Environment variables for credentials

## Testing:

1. **Login Test**:
   - Try wrong credentials → Should show error
   - Try correct credentials → Should redirect to dashboard

2. **Stock Alert Test**:
   - Add stock item with quantity ≤ 5
   - Check dashboard → Should see notification
   - Click "Check Stock" → Should go to stock page

3. **Logout Test**:
   - Click logout button
   - Should redirect to login
   - Try accessing `/dashboard` → Should redirect to login

---

**All features working!** 🎉
