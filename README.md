# Finance Control AI 💰

A smart financial assistant that helps you track and manage your expenses using AI. This project integrates an AI assistant that can understand natural language queries about your financial data, categorize expenses, and provide insights about your spending habits.

## Features

- 🤖 AI-powered expense tracking and categorization
- 💬 Natural language interface for querying your financial data
- 📊 Filter expenses by category, month, or day
- 📱 Telegram bot integration for on-the-go expense tracking and queries
- 📈 Excel/Google Sheets integration for storing financial data
- 💾 Persistent storage of expense data
- 🔒 User-specific expense tracking

## Tech Stack

- **Backend**: Node.js with Express
- **AI**: Ollama with Llama3.1 model
- **Database**: PostgreSQL with Drizzle ORM
- **Integrations**:
  - Telegram Bot API for messaging interface
  - Google Sheets API for data storage
  - Open IA
- **API**: AI library for text generation with tool integration

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Santosl2/finance-control-ia
   cd finance-control-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env` file:

   ```
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/finance_db
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   GOOGLE_SPREADSHEET_ID=your_google_spreadsheet_id
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   OLLAMA_API_URL=http://127.0.0.1:11434/api/
   OPENAI_API_KEY=your_openai_api_key
   FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET=true

   USE_OLLAMA=false // Set to true if you want to use Ollama for AI processing
   ```

4. Set up Google Sheets credentials:

   - Create a service account in Google Cloud Console
   - Generate credentials and save them to `credentials/credentials.json`
   - Share your Google Sheet with the service account email

5. Set up the database:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. Make sure you have Ollama installed and the Llama3.1:8b model downloaded:
   ```bash
   # If you haven't installed Ollama yet, follow instructions at https://ollama.ai/
   ollama pull llama3.1:8b
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Use the API endpoint:

   ```
   POST /api/v1/ai-assistant
   ```

   Request body:

   ```json
   {
     "userId": "user123",
     "prompt": "How much did I spend on food last month?"
   }
   ```

3. The AI will process your request and return appropriate information about your expenses.

4. Use the Telegram Bot:
   - Start a conversation with your bot on Telegram
   - Send natural language queries about your finances
   - The bot will respond with the requested information

## API Endpoints

- **POST /api/v1/ai-assistant** - Interact with the AI financial assistant

## Database Schema

The project uses Drizzle ORM to manage database operations. The schema includes tables for users and their expenses with appropriate relationships.

## Integrations

### Telegram Bot

The application includes a Telegram bot that allows users to interact with the financial assistant through chat messages. Users can send natural language queries and receive responses about their financial data.

### Google Sheets

Expenses data is stored in Google Sheets, with a new sheet created for each month. The spreadsheet includes columns for tracking:

- ID
- User ID
- Cost
- Category
- Description
- Type (income/expense)
- Creation and update timestamps

## Roadmap

Future enhancements planned for this project:

- 📊 Dashboard with visual representations of spending patterns
- 📅 Scheduled reminders for bill payments
- 📱 Mobile app for a more native experience
- 📈 Machine learning models for predicting future expenses

## License

This project is licensed under the ISC License - see the LICENSE file for details.
