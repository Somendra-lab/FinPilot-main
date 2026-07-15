# FinPilot AI - Smart Personal Finance Analyzer & Self-Manager

A comprehensive full-stack application for personal finance management with AI-powered analytics and insights.

## Features

### Core Finance Management
- **Transaction Tracking** - Record and categorize income and expenses
- **Budget Management** - Set spending limits by category and track progress
- **Financial Goals** - Create and monitor savings and investment goals
- **Subscription Tracking** - Monitor recurring payments and subscriptions
- **Intelligent Dashboard** - Real-time overview of financial status

### AI Analytics & Insights
- **Spending Analysis** - Track spending trends over time
- **Smart Recommendations** - AI-generated insights based on spending patterns
- **Category Breakdown** - Visual analysis of spending by category
- **Savings Rate Calculation** - Monitor your savings percentage
- **Monthly Comparisons** - Compare spending month-over-month

### Security & Authentication
- **User Authentication** - Secure JWT-based authentication
- **Password Security** - Bcrypt hashing with salt rounds
- **Rate Limiting** - Request throttling to prevent abuse
- **Data Validation** - Input validation and sanitization
- **CORS Protection** - Cross-origin security

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **CSS3** - Responsive styling

### Backend
- **Express.js** - REST API framework
- **Node.js** - Runtime environment
- **MongoDB** - Document database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin handling

### Shared
- **TypeScript** - Type definitions
- **Shared Types** - Common interfaces

## Project Structure

```
finpilot-ai/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── store/              # State management
│   │   ├── api/                # API client
│   │   └── App.jsx             # Main component
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── models/             # MongoDB models
│   │   ├── middleware/         # Custom middleware
│   │   ├── services/           # Business logic
│   │   └── index.js            # Server entry
│   └── package.json
│
├── docs/                        # Project reports & checklists
│   ├── ABOUT_PAGE_COMPLETION.md
│   ├── PROJECT_HEALTH_AUDIT.md
│   └── ...
│
├── shared/                      # Shared types
│   └── types/
│       └── index.ts
│
└── package.json                 # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard` - Get dashboard summary

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `PATCH /api/subscriptions/:id/cancel` - Cancel subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Analytics
- `GET /api/analytics/insights` - Get AI insights and analytics

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (Atlas or local)
- pnpm package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd finpilot-ai
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finpilot
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development servers
```bash
pnpm dev
```

This will start both backend (port 5000) and frontend (port 5173) simultaneously.

### Building for Production

```bash
pnpm build
```

Frontend builds to `frontend/dist/`
Backend builds to `backend/dist/`

## Authentication

The app uses JWT-based authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. Backend validates token before processing requests

## Data Models

### User
- email (unique)
- password (hashed)
- name
- settings (currency, theme, notifications)

### Transaction
- userId
- type (income/expense)
- amount
- category
- description
- date
- tags

### Budget
- userId
- category
- limit
- spent
- month
- alerts

### Goal
- userId
- title
- targetAmount
- currentAmount
- deadline
- priority
- status

### Subscription
- userId
- name
- amount
- frequency
- startDate
- active

## Deployment

### Frontend Deployment (Vercel)
```bash
vercel deploy
```

### Backend Deployment (Render, Railway, etc.)
```bash
git push origin main
```

Configure environment variables on your hosting platform.

## Security Best Practices

- ✅ Password hashing with bcryptjs
- ✅ JWT token validation
- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ CORS enabled for frontend only
- ✅ Helmet for security headers
- ✅ Request size limits

## Performance Optimizations

- MongoDB indexing on frequently queried fields
- Request caching with SWR
- Lazy loading of components
- Optimized CSS and bundling
- API response pagination
- Efficient state management with Zustand

## Future Enhancements

- [ ] Multi-currency support
- [ ] Expense categorization with ML
- [ ] Bill reminders and notifications
- [ ] Investment portfolio tracking
- [ ] Recurring expense automation
- [ ] Data export (PDF, CSV)
- [ ] Mobile app
- [ ] Social features (shared budgets)
- [ ] Dark mode
- [ ] Two-factor authentication

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, open an issue on GitHub or contact the development team.
