# MongoDB Atlas - Quick Setup (5 Minutes)

## ⚡ Fast Track Setup:

### 1️⃣ Account (1 min)
- Go to: https://www.mongodb.com/cloud/atlas
- Click **"Try Free"** → Sign up with Google

### 2️⃣ Create Database (2 min)
- Click **"Build a Database"**
- Select **M0 FREE** tier
- Choose **Mumbai** or **Singapore** region
- Click **"Create Deployment"**

### 3️⃣ Create User (1 min)
**Left Sidebar → Security → Database Access**
- Click **"Add New Database User"**
- Set Username: `oilworks`
- Set Password: `Pass1234` (ya koi bhi)
- **Database User Privileges** section mein:
  - Select **"Read and write to any database"**
- Click **"Add User"**

### 4️⃣ Allow Network (30 sec)
**Left Sidebar → Security → Network Access**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- Click **"Confirm"**

### 5️⃣ Get Connection String (1 min)
**Left Sidebar → Deployment → Database**
- Click **"Connect"** button
- Select **"Drivers"**
- Copy the connection string
- Replace `<password>` with your actual password

**Example:**
```
mongodb+srv://oilworks:Pass1234@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6️⃣ Add to Project
Open `the-oil-works/.env.local` and paste:
```
MONGODB_URI=mongodb+srv://oilworks:Pass1234@cluster0.xxxxx.mongodb.net/oil-works?retryWrites=true&w=majority
```

## ✅ Done! Run the project:
```bash
cd the-oil-works
npm run dev
```

---

## 🎯 Where to Find Things:

| What | Where |
|------|-------|
| Create User | Left Sidebar → **Security** → **Database Access** |
| Allow IPs | Left Sidebar → **Security** → **Network Access** |
| Connection String | Left Sidebar → **Deployment** → **Database** → **Connect** |
| Built-in Role | In "Add User" form → Scroll down → **Database User Privileges** |

---

## 🚨 Common Issues:

**"Built-in Role" nahi mil raha?**
→ "Add User" form mein neeche scroll karein, "Database User Privileges" section mein hoga

**Connection error?**
→ Check karo password mein special characters to nahi (@, #, $ etc)
→ Agar hain to URL encode karo ya simple password use karo

**Network error?**
→ Network Access mein 0.0.0.0/0 add kiya hai?

---

**Need detailed guide?** → Check `SETUP-GUIDE-URDU.md`
