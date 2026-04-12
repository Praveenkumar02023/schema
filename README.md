# SchemaStudio (drawdb)

SchemaStudio is a visual database design and data modeling tool built for team collaboration. It provides an intuitive, interactive canvas to construct entity-relationship (ER) diagrams, manage database schemas, and visualize relationships between tables.

## 🚀 Key Features

- **Visual ER Diagram Builder**: Drag-and-drop interactive canvas powered by React Flow (`@xyflow/react`).
- **Real-Time Modeling**: Add tables, define columns, assign primary keys, nullability, and data types seamlessly.
- **Relational Integrity**: Visually draw relationships (1-1, 1-N, N-N) directly between tables and columns.
- **State History**: Robust local state management with undo/redo capabilities using `zustand`.
- **Project Collaboration**: Role-based access control (OWNER, EDITOR, VIEWER) allowing teams to safely view or co-edit database schemas.
- **Secure Authentication**: Built with NextAuth.js to handle user sessions and OAuth flows (e.g., Google authentication).
- **Persistent Storage**: Fully integrated with PostgreSQL using Prisma ORM.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Visual Canvas**: React Flow (`@xyflow/react`)
- **State Management**: Zustand
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js

## 📂 Project Structure

- `/app` - Next.js App Router entry points (pages, layouts, API routes).
- `/components` - Reusable UI components.
- `/prisma` - Database schema definition (`schema.prisma`).
- `/store` - Zustand stores for schema state (`useSchemaStore.ts`) and project state (`useProjectStore.ts`).

## ⚙️ Getting Started

### Prerequisites

Ensure you have Node.js 20+ and npm/yarn/pnpm/bun installed.

### 1. Configure Environment Variables

Create a `.env.local` file at the root of the project:

```env
# Database configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret_token"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 2. Setup Database & Start Server

Run the development server:

```bash
# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Start Next.js
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 Database Models Overview

- **User / Account / Session**: NextAuth authentication models.
- **Project**: Represents a database schema diagram workspace.
- **Collaborator**: Manages Project Role-Based Access Control (VIEWER, EDITOR).
- **Table**: Represents an SQL table on the canvas.
- **Column**: Represents a column within a Table.
- **Relation**: Represents links (foreign keys) between tables/columns.

---

*This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).*
