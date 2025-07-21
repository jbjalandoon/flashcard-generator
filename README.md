# Flashcard Generator

A simple, AI-powered flashcard generator built with the [T3 Stack](https://create.t3.gg/). This web application uses the OpenAI GPT API to turn your study topics into interactive flashcards.

## Features

- **Generate Flashcards**: Enter any topic or question set, and the app will generate Q&A flashcards using GPT.
- **Responsive UI**: Clean and responsive interface styled with Tailwind CSS.
- **Authentication**: Secure login and user sessions handled by NextAuth.js.
- **Data Persistence**: User-generated flashcards are stored safely via Drizzle and a MySQL database.
- **API-driven**: Powered by tRPC for end-to-end typesafe API routes.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Type-safe development experience.
- **tRPC**: Typesafe RPC API layer.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Drizzle**: ORM for database interactions.
- **NextAuth.js**: Authentication solution for Next.js.
- **OpenAI GPT**: AI model for generating flashcard content.

## Getting Started

### Prerequisites

- Node.js (v16 or later)

### Install to you local machine

1. **Clone the repository**

```bash
git clone https://github.com/jbjalandoon/flashcard-generator.git
```

2. **Install Modules**

```bash
npm install
```

3. **Set up environment variables**

4. **Push the database using Drizzle**

```bash
npx run db:push
```

5. **Run the application**

```bash
npm run dev
```
