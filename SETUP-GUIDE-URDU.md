# The Oil Works - Complete Setup Guide (Roman Urdu)

## Step 1: MongoDB Atlas Setup (Free)

### 📝 Account Banana:
1. Browser mein jao: https://www.mongodb.com/cloud/atlas
2. **"Try Free"** button (top right corner) pe click karein
3. Email se sign up karein (ya **"Sign up with Google"** button use karein - easy!)
4. Email verify karein agar zaroori ho

### 🗄️ Database Cluster Setup:
1. Login karne ke baad **"Create"** button ya **"Build a Database"** option milega
2. **Deployment Option** choose karein:
   - **M0 (FREE)** select karein - ye hamesha free rahega!
   - "Shared" option hoga with "FREE" tag
3. **Cloud Provider & Region**:
   - Provider: AWS (recommended) ya Google Cloud
   - Region: **ap-south-1 (Mumbai)** ya **ap-southeast-1 (Singapore)** - Pakistan ke liye closest
4. **Cluster Name**: 
   - Neeche "Cluster Name" field mein "oil-works" type karein
   - (Default "Cluster0" bhi chal sakta hai)
5. **"Create Deployment"** button click karein
6. Wait karein 2-3 minutes - cluster create ho raha hai

### Database User Banana:
1. **Left sidebar** mein "Database Access" pe click karein (Security section ke andar)
2. **"Add New Database User"** button (green color) click karein
3. Ek popup/form open hoga, usme:
   - **Authentication Method**: "Password" selected rakhen
   - **Username**: Koi bhi naam (jaise: oilworks_user)
   - **Password**: Strong password (ya "Autogenerate Secure Password" button use karein)
   - **Password ko copy karke safe jagah save kar lein!**
4. Neeche **"Database User Privileges"** section mein:
   - **"Built-in Role"** dropdown mein se
   - **"Read and write to any database"** select karein
   - (Ya "Atlas admin" bhi select kar sakte hain - full access)
5. Sab se neeche **"Add User"** button (green) click karein
6. User successfully create ho jayega!

### 🌐 Network Access Setup (Important!):
1. **Left sidebar** mein **"Network Access"** pe click karein (Security section ke andar)
2. **"Add IP Address"** button (green) click karein
3. Popup mein **"Allow Access from Anywhere"** button click karein
   - Ye automatically **0.0.0.0/0** add kar dega
   - Iska matlab: Kisi bhi internet connection se access ho sakta hai
4. **"Confirm"** button click karein
5. Status "Active" hone ka wait karein (few seconds)

### 🔗 Connection String Lena (Sabse Important Step!):
1. **Left sidebar** mein **"Database"** pe click karein (Deployment section)
2. Apne cluster ke saamne **"Connect"** button click karein
3. Popup mein **"Drivers"** ya **"Connect your application"** option select karein
4. **Driver** dropdown mein:
   - **Node.js** select karein
   - Version: Latest (5.5 or above)
5. Neeche **connection string** dikhega - ye aisa hoga:
   ```
   mongodb+srv://oilworks_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Copy button** click karke string copy karein
7. **IMPORTANT**: `<password>` ko apne actual password se replace karna hoga!
   
   **Example**:
   - Agar username: `oilworks_user`
   - Agar password: `MyPass123`
   - To final string:
   ```
   mongodb+srv://oilworks_user:MyPass123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 📍 MongoDB Atlas - Quick Navigation Guide:

**Left Sidebar mein ye sections milenge:**

```
DEPLOYMENT
  └─ Database          ← Yahan se "Connect" button milega

SECURITY  
  ├─ Database Access   ← Yahan user create karein
  └─ Network Access    ← Yahan IP whitelist karein

DATA SERVICES
  └─ ...
```

**Agar koi section nahi mil raha:**
- Left sidebar mein scroll karein
- Ya top pe "Security" heading ke neeche dekhen

---

## Step 2: Project Setup

### Terminal mein ye commands run karein:

```bash
cd the-oil-works
npm install
```

### .env.local File Update Karein:

File open karein: `the-oil-works/.env.local`

Apna MongoDB connection string paste karein:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/oil-works?retryWrites=true&w=majority
```

**Important**: `your-username` aur `your-password` ko apne actual credentials se replace karein!

## Step 3: Development Server Run Karein

```bash
npm run dev
```

Browser mein open karein: http://localhost:3000

## Step 4: Phone Pe Install Karna (PWA)

### Android:
1. Chrome browser mein website open karein
2. Menu (3 dots) click karein
3. "Add to Home Screen" ya "Install App" select karein
4. "Add" ya "Install" confirm karein
5. App home screen pe aa jayega!

### iPhone:
1. Safari browser mein website open karein
2. Share button (square with arrow) click karein
3. "Add to Home Screen" select karein
4. "Add" click karein

## Step 5: Production Deploy (Optional)

### Vercel Pe Deploy:

1. https://vercel.com pe account banayein
2. GitHub pe project upload karein
3. Vercel mein "Import Project" karein
4. Environment Variables mein `MONGODB_URI` add karein
5. Deploy button click karein

## Features Ka Use:

### 1. Customer Add Karna:
- Home page pe "Add Customer" click karein
- Name, phone, vehicle number aur model enter karein
- "Add Customer" button click karein

### 2. Stock Add Karna:
- Home page pe "Manage Stock" click karein
- "+ Add Stock" button click karein
- Item name, quantity aur category select karein
- "Add Stock" button click karein

### 3. Receipt Banana:
- Home page pe "New Receipt" click karein
- Saari details fill karein
- "Create & Print Receipt" click karein
- Receipt automatically print hoga

### 4. Low Stock Alert:
- Jab kisi item ki quantity 5 ya usse kam hogi
- Stock page pe red alert show hoga
- Item red background mein highlight hoga

## Troubleshooting:

### ❓ "Built-in Role" option nahi mil raha:
- **"Add New Database User"** form mein neeche scroll karein
- "Database User Privileges" heading ke neeche hoga
- Agar "Custom Privileges" selected hai to "Built-in Role" pe switch karein

### ❓ Database Access ya Network Access nahi mil raha:
- Left sidebar mein **"SECURITY"** heading ke neeche dekhen
- Agar sidebar collapse hai to expand karein (hamburger menu)
- Ya directly URL use karein:
  - Database Access: `https://cloud.mongodb.com/v2/[PROJECT-ID]#/security/database/users`
  - Network Access: `https://cloud.mongodb.com/v2/[PROJECT-ID]#/security/network/accessList`

### MongoDB Connection Error:
- Check karein ke `.env.local` mein correct connection string hai
- Password mein special characters hain to URL encode karein:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
- Network Access mein IP whitelist check karein (0.0.0.0/0 hona chahiye)
- Username aur password exactly wahi use karein jo create kiya tha

### App Install Nahi Ho Raha:
- HTTPS connection zaroori hai (localhost pe bhi chalega)
- Browser PWA support karta hai ya nahi check karein
- Cache clear karke try karein

### Print Nahi Ho Raha:
- Browser ka print dialog open hona chahiye
- Print preview mein receipt dikhna chahiye
- PDF save kar sakte hain agar printer nahi hai

## Contact Information Update:

Receipt mein apna phone number add karne ke liye:

File open karein: `the-oil-works/app/receipt/new/page.tsx`

Line 200 pe apna number add karein:
```tsx
<p className="text-sm mt-2">For Information Call: 03XX-XXXXXXX</p>
```

## Data Retention:

- Customer data: 30 days automatically delete
- Receipt data: 30 days automatically delete
- Stock data: Permanent (delete nahi hota)

## Support:

Agar koi problem ho to:
1. README.md file check karein
2. MongoDB Atlas dashboard check karein
3. Browser console errors check karein

---

**Congratulations! 🎉**

Aapka "The Oil Works" POS system ready hai!
