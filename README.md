# Personal Finance Visualizer - Stage 3 Complete

A comprehensive web application for tracking personal finances with advanced budgeting features.

## 🚀 Features Implemented

### Stage 1: Basic Transaction Tracking ✅

- Add/Edit/Delete transactions (amount, date, description)
- Transaction list view with sorting and filtering
- Monthly expenses bar chart
- Basic form validation

### Stage 2: Categories ✅

- Predefined categories for transactions (Food, Rent, Utilities, Travel, Entertainment)
- Category-wise pie chart
- Dashboard with summary cards: total expenses, category breakdown, most recent transactions

### Stage 3: Budgeting ✅ (NEW!)

- **Monthly category budgets**: Set budgets for each category per month
- **Budget vs Actual comparison chart**: Visual comparison of budgeted vs actual spending
- **Budget insights**: Smart spending analysis and recommendations
- **Enhanced dashboard**: Real-time budget status and utilization tracking
- **Spending alerts**: Warnings when approaching or exceeding budget limits
- **Category-wise budget tracking**: Individual category budget monitoring

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: React hooks
- **HTTP Client**: Axios

## 📁 Project Structure

```
Finance Tracker/
├── Backend/
│   ├── models/
│   │   ├── Budget.js          # Budget model
│   │   └── Transaction.js     # Transaction model
│   ├── routes/
│   │   ├── Budget.js          # Budget API routes
│   │   └── transactionRoutes.js # Transaction API routes
│   └── server.js              # Express server
└── Frontend/
    └── finance-frontend/
        ├── src/
        │   ├── app/
        │   │   ├── budgets/    # Budget management page
        │   │   └── page.tsx    # Main dashboard
        │   ├── components/ui/
        │   │   ├── BudgetChart.tsx      # Budget vs Actual chart
        │   │   ├── BudgetForm.tsx       # Budget creation form
        │   │   ├── BudgetList.tsx       # Budget overview list
        │   │   ├── SpendingInsights.tsx # Smart spending insights
        │   │   ├── SummaryCards.tsx     # Enhanced dashboard cards
        │   │   └── ... (other components)
        │   ├── lib/
        │   │   └── api.ts      # API functions
        │   └── types/
        │       └── index.ts    # TypeScript interfaces
        └── package.json
```

## 🎯 Stage 3 Features in Detail

### 1. Budget Management

- **Set Monthly Budgets**: Create budgets for each category per month
- **Budget Overview**: View all budgets for a selected month
- **Budget Editing**: Update existing budgets easily

### 2. Budget vs Actual Comparison

- **Visual Charts**: Bar charts showing budget vs actual spending
- **Category Breakdown**: Individual category budget tracking
- **Remaining Budget**: Real-time calculation of remaining budget

### 3. Smart Spending Insights

- **Budget Utilization**: Percentage of budget used
- **Over-budget Alerts**: Warnings when exceeding budget limits
- **Spending Patterns**: Analysis of top spending categories
- **Recommendations**: Smart insights for better financial management

### 4. Enhanced Dashboard

- **Real-time Updates**: Live budget status and spending data
- **Month Selection**: View data for any specific month
- **Summary Cards**: Quick overview of financial status
- **Recent Transactions**: Latest spending activity

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
# Create .env file with MONGO_URI
npm start
```

### Frontend Setup

```bash
cd Frontend/finance-frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_BASE=http://localhost:5000/api
npm run dev
```

### Environment Variables

**Backend (.env):**

```
MONGO_URI=your_mongodb_connection_string
```

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## 📊 API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets

- `GET /api/budgets?month=YYYY-MM` - Get budgets for specific month
- `POST /api/budgets` - Create or update budget

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface using shadcn/ui
- **Real-time Updates**: Instant feedback on data changes
- **Error Handling**: Graceful error states and user feedback
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User-friendly success/error messages

## 📈 Charts and Visualizations

1. **Monthly Expenses Trend**: Bar chart showing spending over time
2. **Category Breakdown**: Pie chart of spending by category
3. **Budget vs Actual**: Comparison chart for budget tracking
4. **Budget Insights**: Visual indicators for budget utilization
