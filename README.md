# ShareKit 🗂️

A cloud-based file sharing and storage platform built with Node.js, Express, MongoDB, and Supabase Storage.


---

## ✨ Features

- 📁 **File Upload & Management** — Upload, view, and delete files
- 📤 **File Sharing** — Share files via email with secure download links
- 👤 **User Authentication** — Secure JWT-based login and signup
- 🖼️ **Profile Picture** — Upload and update profile pictures
- 💳 **Payment Integration** — Razorpay payment gateway for plan upgrades
- 📊 **Storage Dashboard** — Visual storage usage tracker
- 📧 **Email Notifications** — Nodemailer + Gmail for file sharing emails
- 🔐 **Authorization Middleware** — Protected private routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **File Storage** | Supabase Storage |
| **Authentication** | JWT (jsonwebtoken) |
| **Payment** | Razorpay |
| **Email** | Nodemailer + Gmail |
| **Deployment** | Render |

---

## 📁 Project Structure

```
sharekit/
├── controller/
│   ├── dashboard.controller.js
│   ├── file.controller.js
│   ├── plan.controller.js
│   ├── razorpay.controller.js
│   ├── token.controller.js
│   └── user.controller.js
├── middleware/
│   ├── authorization.middleware.js
│   └── download.middleware.js
├── model/
│   ├── file.model.js
│   ├── plan.model.js
│   └── user.model.js
├── config/
│   └── supabase.js
├── view/
│   ├── apps/
│   │   ├── dashboard.html
│   │   └── files.html
│   ├── images/
│   ├── js/
│   │   ├── common.js
│   │   ├── dashboard.js
│   │   ├── files.js
│   │   ├── login.js
│   │   ├── session.js
│   │   └── signup.js
│   ├── admin.html
│   ├── index.html
│   ├── login.html
│   └── signup.html
├── .env
├── .gitignore
├── index.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Supabase account
- Razorpay account
- Gmail account with App Password

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AjayNarera2k1/s_harekit.git
cd s_harekit
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
NODE_ENV=dev
PORT=8080
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/sharekit
JWT_SECRET=your_jwt_secret
JWT_FILE_SECRET=your_jwt_file_secret
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SERVER=http://localhost:8080
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

4. **Seed the database with plans**

Start your server and run this in browser console:
```js
// Starter Plan (Free)
fetch("http://localhost:8080/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "starter", storage: 1073741824, price: 0 })
}).then(r => r.json()).then(console.log)

// Basic Plan
fetch("http://localhost:8080/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "basic", storage: 5368709120, price: 499 })
}).then(r => r.json()).then(console.log)

// Pro Plan
fetch("http://localhost:8080/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "pro", storage: 10737418240, price: 999 })
}).then(r => r.json()).then(console.log)
```

5. **Start the server**
```bash
npm start
```

6. **Open in browser**
```
http://localhost:8080
```

---

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/signup` | Register new user |
| POST | `/api/login` | Login user |
| POST | `/api/verify-token` | Verify JWT token |
| GET | `/api/plan` | Fetch all plans |

### Private (Requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload-profile-picture` | Upload profile picture |
| POST | `/api/file` | Upload file |
| GET | `/api/file` | Fetch all files |
| DELETE | `/api/file/:id` | Delete file |
| POST | `/api/file/download` | Download file |
| POST | `/api/file/share` | Share file via email |
| GET | `/api/dashboard` | Fetch dashboard data |
| GET | `/api/storage` | Fetch storage usage |

### Payment
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/razorpay/order` | Create payment order |
| POST | `/api/razorpay/webhook` | Razorpay webhook handler |

---

## ☁️ Deployment

This project is deployed on **Render** with the following configuration:

| Field | Value |
|---|---|
| **Runtime** | Node.js |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Region** | Singapore |

### Environment Variables on Render
Add all variables from `.env` to Render's Environment settings.

---

## 📦 Storage Plans

| Plan | Storage | Price |
|---|---|---|
| Starter | 1 GB | Free |
| Basic | 5 GB | ₹499 |
| Pro | 10 GB | ₹999 |

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Ajay Narera**
- GitHub: [@AjayNarera2k1](https://github.com/AjayNarera2k1)
