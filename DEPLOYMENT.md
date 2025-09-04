# Carbomatic - Deployment Guide

## 🚀 Deploy to Vercel

This project is configured for easy deployment on Vercel with both Next.js frontend and Python serverless functions.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Claude API Key**: Get from [console.anthropic.com](https://console.anthropic.com)
3. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket

### Step 1: Environment Variables

In your Vercel dashboard, add the following environment variable:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Step 2: Deploy

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will automatically detect it's a Next.js project
4. Add your environment variable
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add ANTHROPIC_API_KEY
```

### Step 3: Verify Deployment

Your app will be available at `https://your-project-name.vercel.app`

Test the endpoints:
- `https://your-domain.vercel.app/api/calculate-carbs`
- `https://your-domain.vercel.app/api/generate-meal-plan`

## 📁 Project Structure

```
carbomatic/
├── api/                          # Vercel serverless functions
│   ├── calculate-carbs.py       # Carb calculation endpoint
│   └── generate-meal-plan.py    # Claude AI meal plan endpoint
├── src/app/                     # Next.js frontend
│   ├── page.tsx                # Main application
│   └── layout.tsx              # App layout
├── vercel.json                 # Vercel configuration
├── requirements.txt            # Python dependencies
└── package.json               # Node.js dependencies
```

## 🔧 Local Development

```bash
# Frontend
npm run dev

# Backend (for local testing)
cd backend
source venv/bin/activate
python main.py
```

## 🌍 Environment Configuration

- **Development**: Uses `http://localhost:8000`
- **Production**: Uses Vercel's serverless functions at `/api/*`

## 💰 Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 100 serverless function invocations/day
- **Claude API**: Pay per API call (check Anthropic pricing)

## 🔒 Security Notes

- Environment variables are secure in Vercel
- CORS is configured for your domain only
- API keys are never exposed to the client

## 🐛 Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Verify `ANTHROPIC_API_KEY` is set in Vercel environment variables
   - Check you have sufficient Claude API credits

2. **CORS Errors**
   - Ensure your domain is properly configured
   - Check Vercel function logs

3. **Function Timeouts**
   - Claude API calls can take 10-30 seconds
   - Vercel has a 10-second timeout on free tier

### Vercel Function Logs

```bash
vercel logs your-deployment-url
```