# 🌌 Flowzint / YouTube AI Automation Ecosystem
## Master Architecture & Engineering Document

This document outlines the complete system architecture for the AI-powered YouTube Automation Ecosystem. It integrates the existing Email/Gmail Agent system cleanly into a modular, highly scalable foundation.

---

## 🏗️ STEP 1 — SUPABASE SETUP & CONFIGURATION

Supabase serves as the central Nervous System for Database, Authentication, and Storage. 

### 1. Project Creation
*   Navigate to [Supabase Dashboard](https://supabase.com/dashboard).
*   Click **New Project**. Select your organization and deploy in a region closest to your primary user base (e.g., US East).
*   Store the **Database Password** securely (e.g., Bitwarden/1Password). You will need this for direct Postgres connections.

### 2. Authentication Setup
*   Go to **Authentication > Providers**.
*   Enable **Email** auth.
*   Disable "Confirm email" for local development (to speed up testing), but enforce it in production.
*   Set up JWT expiration times (default is 3600s, usually fine).

### 3. API Keys & Environment Variables
*   Go to **Project Settings > API**.
*   You will need three keys for your backend:
    *   `SUPABASE_URL`: The project REST URL.
    *   `SUPABASE_ANON_KEY`: Safe for frontend use.
    *   `SUPABASE_SERVICE_ROLE_KEY`: **NEVER expose this to the frontend.** Use this *only* in your FastAPI backend to bypass Row Level Security (RLS) when agents need full database access.

### 4. Best Practices
*   **Enable Row Level Security (RLS)** on *all* tables immediately.
*   **Database Webhooks**: We will use Supabase Webhooks to trigger FastAPI endpoints when specific database events occur (e.g., a new email arrives or a new video is scraped).

---

## 🗄️ STEP 2 — DATABASE ARCHITECTURE

The database is built on PostgreSQL (via Supabase) and optimized for agentic memory, scalability, and time-series analytics.

### Production-Ready SQL Schema Overview

```sql
-- 1. Users
CREATE TABLE users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    tier TEXT DEFAULT 'free',
    settings JSONB DEFAULT '{}'::jsonb
);

-- 2. YouTube Channels
CREATE TABLE youtube_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel_id TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    subscriber_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_scraped_at TIMESTAMPTZ
);

-- 3. Videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES youtube_channels(id) ON DELETE CASCADE,
    video_id TEXT UNIQUE NOT NULL,
    title TEXT,
    published_at TIMESTAMPTZ,
    status TEXT DEFAULT 'analyzed' -- e.g., 'scraped', 'analyzed', 'archived'
);

-- 4. Video Analytics (Time-Series Friendly)
CREATE TABLE video_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    views INT,
    likes INT,
    comments INT,
    retention_rate DECIMAL(5,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Emails (INTEGRATING EXISTING MODULE)
-- Ties into the existing Gmail Agent module without breaking its internal structure
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    thread_id TEXT,
    sender TEXT,
    subject TEXT,
    body TEXT,
    category TEXT, -- e.g., 'sponsorship', 'collab', 'spam'
    ai_summary TEXT,
    intent_score DECIMAL(3,2),
    received_at TIMESTAMPTZ,
    status TEXT DEFAULT 'unread'
);

-- 6. Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_id UUID REFERENCES emails(id) ON DELETE SET NULL,
    contact_name TEXT,
    meeting_time TIMESTAMPTZ,
    status TEXT DEFAULT 'pending'
);

-- 7. Agent Memory (Vector DB compatible if using pgvector)
CREATE TABLE agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_type TEXT NOT NULL, -- e.g., 'chatbot', 'scraper', 'gmail'
    memory_key TEXT,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Chatbot Conversations
CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI Recommendations & Scripts
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    type TEXT, -- 'script', 'title_idea', 'thumbnail_concept'
    content TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Agent Tasks (Orchestrator Queue)
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type TEXT NOT NULL,
    payload JSONB,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 11. Scraper Logs & 12. Automation Logs & 13. Workflow History
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module TEXT, -- 'playwright', 'api', 'gmail_sync'
    level TEXT, -- 'info', 'error', 'warning'
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Scalability Considerations
*   **Indexes**: Add B-Tree indexes on `user_id`, `video_id`, and `status` fields across tables to speed up dashboard queries.
*   **Modularity**: The `emails` table acts as the connective tissue for your existing Gmail module. Agent tasks interact with this table without requiring a rewrite of your Gmail sync logic.

---

## ⚡ STEP 3 — FASTAPI BACKEND ARCHITECTURE

The backend uses an API-first, service-oriented architecture.

### Core Principles:
*   **Routers**: Handle HTTP requests/responses (No business logic).
*   **Services**: Core business logic (AI calls, complex data formatting).
*   **Repositories/DAL**: Database interactions (Supabase client).
*   **Agents**: Autonomous long-running scripts (LangChain/Custom LLM chains).

### Supabase Integration & Middleware
Authentication is handled via FastAPI dependency injection. The frontend passes the Supabase JWT in the `Authorization` header. The backend verifies it using Supabase's `get_user()` method.

---

## 🔌 STEP 4 — SUPABASE ↔ FASTAPI CONNECTION

### Database Service Layer Implementation
Use the official `supabase-py` client.

```python
# backend/core/database.py
import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Backend uses service role

db: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db():
    return db
```

### Auth Middleware Flow
```python
# backend/api/dependencies.py
from fastapi import Header, HTTPException, Depends
from core.database import get_db

async def get_current_user(authorization: str = Header(...), db=Depends(get_db)):
    try:
        token = authorization.split(" ")[1]
        user_response = db.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")
```

---

## 🤖 STEP 5 — AGENT ARCHITECTURE

The Agent Ecosystem operates on a **Hub-and-Spoke Orchestration** model. An orchestrator (via `agent_tasks` DB queue or FastAPI background tasks) delegates work.

1.  **Gmail Agent (EXISTING)**: Syncs emails, categorizes intents, and updates the `emails` table. Triggers webhooks for the Orchestrator.
2.  **Scraper Agent (Playwright)**: Runs on a cron schedule or via manual trigger. Navigates YouTube, bypasses basic captchas, and dumps raw HTML/JSON into the `scraper_logs` and `videos` tables.
3.  **Analytics Agent (Python/Pandas)**: Consumes raw scraper data. Calculates retention, momentum, and outliers. Feeds data to the `video_analytics` table.
4.  **Proposal & Booking Agent (Gemini/OpenAI)**: Listens for `emails` categorized as 'sponsorship'. Drafts responses using past `agent_memory` (pricing rules, tone). Books slots via standard calendar APIs.
5.  **Script & Idea Agent (LLM)**: Analyzes trending videos from the Scraper Agent and generates hook/body/CTA structures in `ai_recommendations`.
6.  **Chatbot Agent**: The interactive frontend assistant. Queries `agent_memory` and database views to answer user questions ("How much did my last video make?", "Any new sponsorships?").

**Communication Flow:**
`Frontend` ↔ `FastAPI REST` ↔ `Agent Orchestrator` ↔ `Specific Agent` ↔ `Supabase DB`

---

## 📂 STEP 6 — PROJECT STRUCTURE

```text
youtube-ai-ecosystem/
│
├── frontend/                     # Pure HTML, CSS, Vanilla JS
│   ├── index.html                # Master Dashboard
│   ├── css/
│   │   ├── globals.css           # Design tokens, variables
│   │   ├── glassmorphism.css     # Premium UI styling
│   │   └── components/           # Modular CSS (buttons, cards)
│   ├── js/
│   │   ├── app.js                # Main initialization
│   │   ├── api.js                # Fetch wrappers for FastAPI
│   │   ├── utils/                # GSAP animations, formatters
│   │   └── modules/              # UI specific logic
│   │       ├── chatbot.js
│   │       ├── analytics.js
│   │       └── inbox.js          # Existing Gmail UI logic injected here
│   └── assets/                   # Images, SVGs
│
├── backend/                      # FastAPI
│   ├── main.py                   # App entrypoint
│   ├── core/                     # Config, DB connections, Security
│   ├── api/                      # REST Endpoints (routers)
│   │   ├── routes_auth.py
│   │   ├── routes_youtube.py
│   │   └── routes_inbox.py       # Hooks to your existing module
│   ├── services/                 # Business logic
│   ├── models/                   # Pydantic schemas
│   └── utils/                    # Helper functions
│
├── agents/                       # Autonomous Logic
│   ├── orchestrator.py           # Task queue manager
│   ├── scraper/                  # Playwright scripts
│   ├── ai/                       # Gemini/OpenAI API wrappers
│   └── existing_gmail_agent/     # YOUR COMPLETED MODULE (isolated)
│
├── database/                     # Migrations & SQL
│   └── schema.sql                
│
├── prompts/                      # Centralized LLM Prompts
│   ├── system_prompts.yaml
│   └── script_generation.txt
│
└── config/                       # .env templates, Dockerfiles
```

---

## 🗺️ STEP 7 — DEVELOPMENT ROADMAP

*   **Phase 1: Foundation (Current)** - Setup Supabase, FastAPI shell, connect existing Gmail module to the new DB architecture.
*   **Phase 2: Backend Core** - Build authentication flows, establish database schemas, setup Pydantic models.
*   **Phase 3: UI/UX Master Template** - Build the glassmorphism layout, implement sidebar, routing (vanilla JS pushState), and theme systems.
*   **Phase 4: Scraper System** - Integrate Playwright, build the scraping agent to populate YouTube data.
*   **Phase 5: Analytics Engine** - Process scraped data, build FastAPI endpoints, render Chart.js graphs on frontend.
*   **Phase 6: Agent Orchestrator** - Build the task queue system to manage long-running background tasks.
*   **Phase 7: Deep Integration (Gmail & Booking)** - Connect the existing Gmail agent to the orchestrator. Allow it to trigger the Booking agent based on email intent.
*   **Phase 8: AI Chatbot** - Implement the chat interface, connect to Gemini/OpenAI, give it tools to query the DB.
*   **Phase 9: AI Recommendations** - The Script Agent begins generating content based on channel analytics.
*   **Phase 10: Autonomous Features** - Enable cron-based execution. The system runs scraping, analysis, and email drafting automatically overnight.

---

## 🎨 STEP 8 — UI/UX SYSTEM

**Design Direction: Cinematic Glassmorphism**
*   **Colors**: Deep space backgrounds (e.g., `#0A0A0F`), vibrant electric accents (Neon Purple `#8A2BE2`, Cyan `#00E5FF`).
*   **Textures**: Frosted glass panels (`backdrop-filter: blur(16px)`), subtle 1px semi-transparent borders to simulate light catching the edge of glass.
*   **Typography**: `Inter` for data/UI elements, `Outfit` or `Space Grotesk` for headers/hero text.
*   **Animations (GSAP)**: 
    *   Staggered fade-ups for list items (emails, videos).
    *   Smooth transitions between routing states.
    *   Micro-interactions: Buttons glow on hover, charts smoothly draw in on load.
*   **Layout Architecture**: 
    *   Collapsible left navigation.
    *   Top command bar (global search + AI command palette).
    *   Main content area using CSS Grid for dynamic masonry-style widgets.
    *   Floating, collapsible AI Chatbot widget in the bottom right.

---

## 🧠 STEP 9 — AI-ASSISTED DEVELOPMENT STRATEGY

To maintain context across different free AI tools (Claude, ChatGPT, Gemini), you must maintain a **"Project Brain"**.

### Context Preservation System
1.  **`ARCHITECTURE.md`**: (This document). Always upload this first in a new chat. It gives the AI the complete macro-view.
2.  **`CURRENT_TASK.md`**: Keep a small text file detailing exactly what you are working on *today*. Example: "Currently building the Playwright scraper. Backend models are done. Need the Python logic."
3.  **`PROMPTS_LIBRARY/`**: Store reusable prompts.
    *   *Example Prompt*: "You are an expert Python engineer. Review my `backend/services/scraper.py` file. Ensure it strictly follows our `ARCHITECTURE.md` guidelines for modularity and uses the Supabase service role key correctly."
4.  **Strict File Boundaries**: When asking an AI to write code, ask for *one file at a time*. Do not ask it to "build the scraping feature" all at once. Ask it to "Write the Pydantic schema for the Scraper", then "Write the Playwright logic", then "Write the FastAPI endpoint."

### AI Workflow Methodology
1.  **Plan**: Ask AI to outline the logic for a specific file.
2.  **Generate**: Ask AI to write the code based on the outline.
3.  **Integrate**: Copy the code into your IDE, run it, find errors.
4.  **Debug**: Feed the *exact error stack trace* back into the AI. Do not paraphrase.

---
*End of Architecture Document. Ready for implementation.*
