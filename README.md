# Mimimood - Mental Health Tracking Website

## 1. Purpose of the Project

Mimimood is a web application designed to help users track their mental health and well-being. Users can log their daily moods, add notes, view their mood history and statistics, and get a daily dose of motivation through inspirational quotes. The project aims to provide a simple, user-friendly interface for individuals to become more aware of their emotional patterns and promote mental wellness.


## 2. Implementation Details

### 2.1. Technical Stack

*   **Frontend:** SvelteKit, TypeScript
*   **Styling:** CSS (global `app.css` and component-specific styles), with a blue and pink color scheme.
*   **Backend & API:** SvelteKit API routes, TypeScript
*   **Database ORM:** Prisma
*   **Database:** SQLite (configured in `prisma/schema.prisma`, can be changed to PostgreSQL, MySQL, etc.)
*   **Password Hashing:** bcryptjs
*   **External API for Quotes:** ZenQuotes.io API (`https://zenquotes.io/api/today`)

### 2.2. Key Features Implemented

*   **User Authentication:**
    *   User registration with email, username, and hashed password.
    *   User login with email and password.
    *   User logout (session/cookie management would be needed for full implementation, currently placeholder).
*   **Mood Tracking:**
    *   Users can log their mood for a specific day (e.g., Happy, Sad, Neutral).
    *   Optional notes can be added to each mood entry.
    *   A date picker allows logging moods for past dates.
    *   Indication if a mood has already been logged for the selected day.
*   **Mood Statistics:**
    *   Users can view their mood history.
    *   Filtering options for statistics (e.g., last 30 days, last 90 days, custom date range - UI placeholders, backend supports date range).
    *   Display of mood entries with dates and notes.
    *   Placeholder for visual charts.
*   **Motivational Quotes:**
    *   The dashboard displays a daily motivational quote fetched from the ZenQuotes.io API.
    *   Attribution to ZenQuotes.io is provided as per their terms.
*   **User Interface:**
    *   Responsive design (conceptual, further testing needed for various devices).
    *   User-friendly navigation and layout based on provided wireframes.
    *   Custom logo integration.
    *   Color scheme: Blue primary with pink accents.

## 3. Structure of the Codebase

The project follows a standard SvelteKit project structure:

```
/mimimood-app
├── /prisma
│   └── schema.prisma       # Prisma database schema
├── /src
│   ├── /app.html           # Main HTML shell
│   ├── /app.css            # Global CSS styles
│   ├── /hooks.server.ts    # (Optional) Server-side hooks (not extensively used in this version)
│   ├── /lib
│   │   ├── /components     # Reusable Svelte components (e.g., Navbar.svelte)
│   │   └── /server         # Server-side utilities (e.g., prisma.ts client instance)
│   ├── /routes             # Application pages and API endpoints
│   │   ├── +layout.svelte  # Main layout for all pages
│   │   ├── +page.svelte    # Landing page
│   │   ├── /login
│   │   │   └── +page.svelte # Login page
│   │   ├── /register
│   │   │   └── +page.svelte # Registration page
│   │   ├── /dashboard
│   │   │   ├── +layout.svelte # Layout specific to dashboard routes
│   │   │   ├── +page.svelte    # Dashboard overview/home page (with quotes)
│   │   │   ├── /mood-tracker
│   │   │   │   └── +page.svelte # Mood tracking page
│   │   │   └── /stats
│   │   │       └── +page.svelte # Mood statistics page
│   │   └── /api                # Backend API endpoints
│   │       └── /auth
│   │           ├── /register
│   │           │   └── +server.ts # Registration API
│   │           ├── /login
│   │           │   └── +server.ts # Login API
│   │           └── /logout
│   │               └── +server.ts # Logout API
│   │       └── /moods
│   │           └── +server.ts     # API for creating and fetching mood entries
│   └── vite-env.d.ts     # Vite environment types
├── /static                 # Static assets (e.g., logo.png, favicon)
├── package.json            # Project dependencies and scripts
├── svelte.config.js        # SvelteKit configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 4. Description of APIs

### 4.1. Internal APIs (Backend Endpoints)

All internal APIs are located under `/src/routes/api/`.

*   **`POST /api/auth/register`**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "email": "user@example.com", "password": "securepassword123", "username": "optional_username" }`
    *   **Response:** Success (201) with user data (excluding password), or error (400, 409, 500).
*   **`POST /api/auth/login`**
    *   **Description:** Logs in an existing user.
    *   **Request Body:** `{ "email": "user@example.com", "password": "securepassword123" }`
    *   **Response:** Success (200) with user data (excluding password) and sets a session cookie (conceptual, full session management to be implemented), or error (400, 401, 500).
*   **`POST /api/auth/logout`**
    *   **Description:** Logs out the current user (clears session cookie).
    *   **Response:** Success (200).
*   **`POST /api/moods`**
    *   **Description:** Creates a new mood entry for a user.
    *   **Request Body:** `{ "date": "YYYY-MM-DD", "mood": "Happy", "notes": "Optional notes", "userId": 1 }` (Note: `userId` would typically come from an authenticated session).
    *   **Response:** Success (201) with the created mood entry, or error (400, 401, 500).
*   **`GET /api/moods?userId=<ID>&startDate=<YYYY-MM-DD>&endDate=<YYYY-MM-DD>`**
    *   **Description:** Retrieves mood entries for a specified user, optionally filtered by a date range.
    *   **Query Parameters:** `userId` (required), `startDate` (optional), `endDate` (optional).
    *   **Response:** Success (200) with an array of mood entries, or error (400, 500).

### 4.2. External API

*   **ZenQuotes.io API**
    *   **Endpoint Used:** `https://zenquotes.io/api/today`
    *   **Description:** Fetches the quote of the day.
    *   **Usage:** Integrated into the dashboard home page (`/src/routes/dashboard/+page.svelte`) to display a daily motivational quote.
    *   **Attribution:** Provided on the dashboard page as required by ZenQuotes.io.

## 5. Description of Stored Data (Prisma Schema)

Data is managed using Prisma with an SQLite database. The schema is defined in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // DATABASE_URL=file:./dev.db in .env
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  username    String?
  password    String       // Hashed password
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  moodEntries MoodEntry[]
}

model MoodEntry {
  id        Int      @id @default(autoincrement())
  date      DateTime // The specific date for which the mood is logged
  mood      String   // e.g., "happy", "sad", "neutral"
  notes     String?  // Optional notes from the user
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    Int
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId, date])
}
```

*   **User Table:** Stores user credentials and information.
*   **MoodEntry Table:** Stores individual mood logs linked to a user.

## 6. Communication Method Between Components/Services

*   **Svelte Components:** Communicate via props (parent to child) and events (child to parent). Svelte stores (`$app/stores`) like `$page` are used for accessing route data and page state.
*   **Frontend to Backend:** The SvelteKit frontend makes API calls to its own backend API routes (defined in `/src/routes/api/`) using the `fetch` API. These API routes then interact with the Prisma client to perform database operations.
*   **External API:** The ZenQuotes API is called directly from the frontend component (`dashboard/+page.svelte`) using `fetch` on component mount.

## 7. Setting Up and Running the Project

1.  **Clone the repository (or extract the provided project files).**
2.  **Navigate to the project directory:**
    ```bash
    cd mimimood-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root of the `mimimood-app` directory and add the database URL:
    ```env
    DATABASE_URL="file:./dev.db"
    ```
5.  **Apply database migrations:**
    This will create the SQLite database file (`dev.db`) and the tables based on your `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev --name init
    ```
    (If you make changes to `schema.prisma` later, run `npx prisma migrate dev --name <migration_name>` again.)
6.  **Generate Prisma Client:** (Usually run automatically after `migrate dev`, but can be run manually)
    ```bash
    npx prisma generate
    ```
7.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

## 8. External Node.js Modules Used

*   **`@prisma/client`**: Prisma's database client for interacting with the database.
*   **`bcryptjs`**: For hashing user passwords securely.
*   (SvelteKit, TypeScript, Vite, etc., are core development tools/frameworks)

## 9. Custom Svelte Components

The project utilizes several custom Svelte components, including but not limited to:

1.  `Navbar.svelte`: Main navigation bar.
2.  Login Form elements (within `login/+page.svelte`)
3.  Register Form elements (within `register/+page.svelte`)
4.  Mood Selection buttons (within `dashboard/mood-tracker/+page.svelte`)
5.  Date Picker (standard HTML input, could be wrapped in a custom component)
6.  Notes Text Area (standard HTML input)
7.  Stats Period Selector (within `dashboard/stats/+page.svelte`)
8.  Mood Entry Display Card (within `dashboard/stats/+page.svelte`)
9.  Quote Display section (within `dashboard/+page.svelte`)


