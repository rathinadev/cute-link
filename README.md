# Cute Date Link 💕

A cute Next.js application to create shareable links for asking someone out on a date. Built with Next.js 14, Upstash Redis, and Resend.

## Features

- 🎨 Super cute UI with adorable cats, dolls, and animations
- 🔗 Generate unique, shareable links
- 📧 Email notifications when someone responds
- ⏰ Automatic link expiration after 7 days
- 🎭 Interactive "No" button with progressive text changes
- 🔧 Development mode to skip email/storage (save free tier limits!)
- 🚀 Ready for Vercel deployment

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Upstash Redis** for data storage
- **Resend** for email notifications
- **Tailwind CSS** for styling
- **nanoid** for unique link generation

## Prerequisites

- Node.js 18+ installed
- An Upstash Redis account (free tier available)
- A Resend account (free tier available)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 3. Set Up Resend

1. Go to [Resend](https://resend.com/)
2. Sign up and verify your account
3. Create an API key from the dashboard
4. Copy the `RESEND_API_KEY`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DEV_MODE=true
```

**Development Mode**: Set `DEV_MODE=true` to skip email sending and Redis storage during development. This helps you test without using your free tier limits! You can also toggle it in the UI on the homepage.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` (set to your Vercel domain, e.g., `https://your-app.vercel.app`)

### 3. Update Resend Domain (Optional)

For production, you may want to:
1. Add and verify your domain in Resend
2. Update the `from` email in `app/api/respond/route.ts` to use your verified domain

## Project Structure

```
cute-date-link/
├── app/
│   ├── api/
│   │   ├── create-link/     # API to create new links
│   │   ├── check-link/      # API to check link status
│   │   └── respond/         # API to submit responses
│   ├── ask/
│   │   └── [id]/            # Dynamic route for asking page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── lib/
│   ├── redis.ts             # Redis client setup
│   └── resend.ts            # Resend client setup
└── ...
```

## API Endpoints

### POST `/api/create-link`

Creates a new link.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "url": "http://localhost:3000/ask/abc123",
  "id": "abc123"
}
```

### GET `/api/check-link?id={id}`

Checks the status of a link.

**Response:**
```json
{
  "email": "user@example.com",
  "status": "pending",
  "createdAt": 1234567890
}
```

### POST `/api/respond`

Submits a response to a link.

**Request:**
```json
{
  "id": "abc123",
  "answer": "yes" | "no"
}
```

**Response:**
```json
{
  "success": true
}
```

## How It Works

1. **Create Link**: User enters their email and gets a unique shareable link
2. **Share Link**: User shares the link with the person they want to ask out
3. **Respond**: The recipient visits the link and can respond with YES or NO
4. **Notification**: The creator receives an email notification with the response
5. **Expiration**: Links automatically expire after 7 days

## Notes

- Links are stored in Upstash Redis with a 7-day TTL
- Email notifications are sent via Resend
- No authentication required (links are public but have unique IDs)
- The "No" button changes text progressively: "No" → "Please 🥺" → "Pretty please?" → "Okay fine 😔"
- **Development Mode**: When `DEV_MODE=true`, the app skips email validation, Redis storage, and email sending. Perfect for testing without using free tier limits!

## License

MIT

