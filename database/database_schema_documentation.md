# Database Architecture Documentation

## 1. Table Explanations

1.  **`users`**: The core authentication and identity table. Links to Supabase Auth (`auth.uid()`) and stores high-level status and role data for the user.
2.  **`youtube_channels`**: Represents YouTube channels managed by the platform. Tracks high-level channel metadata, subscriber counts, and links back to the user.
3.  **`videos`**: Represents individual video assets belonging to a channel. Includes publishing status and core metadata required for content management.
4.  **`video_analytics`**: A time-series-friendly table to store historical performance data for videos (views, likes, retention). Crucial for AI trend analysis and anomaly detection.
5.  **`emails`**: The core integration point for the Gmail agent. Stores parsed emails, their AI-generated summaries, detected intents, and categorization (e.g., "sponsor", "fan").
6.  **`bookings`**: Stores scheduled meetings derived from email parsing or direct input. Links directly to the source email that initiated the booking.
7.  **`chatbot_conversations`**: Maintains chat history for the memory-heavy AI assistant. Uses `JSONB` for flexible storage of role/content message blocks.
8.  **`agent_memory`**: A flexible key-value store (`JSONB`) allowing autonomous agents (e.g., "gmail_parser", "yt_analyst") to persist long-term context, learnings, and preferences.
9.  **`ai_recommendations`**: Stores actionable AI outputs (e.g., script ideas, thumbnail concepts) waiting for user approval or rejection.
10. **`agent_tasks`**: A task queue and state management table for background AI operations. Tracks payload, status, and eventual results of automated jobs.
11. **`system_logs`**: General application-level logging (errors, warnings) for observability and debugging.
12. **`automation_logs`**: High-granularity audit trails for specific actions taken by agents (e.g., "Drafted email reply", "Scraped channel data"). Links to the parent task.
13. **`workflow_history`**: Records the execution of complex orchestrations (e.g., "New Sponsor Pipeline"). Useful for debugging automation triggers and states.
14. **`notifications`**: User-facing alerts triggered by agents or system events (e.g., "Meeting booked", "Video viral alert").

## 2. Relationship Explanations

*   **Users as the Root Node**: Almost all tables (`youtube_channels`, `emails`, `bookings`, `agent_memory`, `agent_tasks`) have a direct `user_id` foreign key with `ON DELETE CASCADE`. This ensures a multi-tenant architecture where deleting a user purges all their associated data cleanly.
*   **Hierarchical YouTube Data**: `users` -> `youtube_channels` -> `videos` -> `video_analytics`. This strict hierarchy maintains data integrity and makes it easy to aggregate analytics at the channel or user level.
*   **Email to Booking Pipeline**: The `bookings` table has an optional `email_id` foreign key (`ON DELETE SET NULL`). This allows the system to trace a scheduled meeting back to the exact email thread that initiated it without losing the booking if the email is later deleted.
*   **Task to Log Traceability**: `agent_tasks` -> `automation_logs`. Each background job can generate multiple log entries, providing a detailed trace of what the agent did during execution.

## 3. Index Explanations

Indexes have been strategically placed to optimize the heaviest query paths:

*   **Foreign Keys**: `user_id` and `channel_id` are indexed across the board to speed up JOINs and RLS evaluations.
*   **Time-Series Optimization**: `idx_video_analytics_video_id_time` on `video_analytics(video_id, recorded_at DESC)` ensures lightning-fast retrieval of the most recent performance metrics for charts.
*   **Queue Polling**: `idx_agent_tasks_status` on `agent_tasks(status)` prevents sequential scans when the backend agent orchestrator polls for "queued" or "running" tasks.
*   **Categorization Lookups**: `idx_emails_user_id_category` on `emails(user_id, category)` optimizes queries like "Show me all unread sponsor emails for this user".
*   **Temporal Lookups**: `idx_bookings_user_id_time` ensures the calendar UI can quickly fetch upcoming meetings for a user.

## 4. RLS (Row Level Security) Policies

Security is built directly into the database layer to prevent cross-tenant data leakage:

*   **Authentication Dependency**: All user-facing tables rely on `auth.uid() = user_id`. This means even if the FastAPI backend has a vulnerability, the database will refuse to serve data belonging to another user.
*   **Cascading RLS**: For nested tables like `videos` and `video_analytics`, the policies use `EXISTS` subqueries to verify ownership via the parent `youtube_channels` table.
    *   *Example*: A user can only see analytics for a video if they own the parent channel.
*   **System Logs Exemption**: The `system_logs` table allows blanket inserts for service roles/backend systems to ensure logging is never blocked by user context.

## 5. Supabase Execution Instructions

To deploy this schema to your Supabase instance, follow these steps:

1.  **Access the SQL Editor**: Log in to your Supabase Dashboard, select your project, and navigate to the **SQL Editor** on the left sidebar.
2.  **Create a New Query**: Click "New query".
3.  **Paste and Run**: Copy the entire contents of the generated `schema.sql` file and paste it into the editor. Click the **Run** button.
4.  **Verify**: Navigate to the **Table Editor** to confirm all 14 tables have been created.
5.  **Enable Webhooks/Realtime (Optional but Recommended)**: For tables like `agent_tasks` and `notifications`, go to Database -> Replication and enable Realtime so your frontend can listen for status changes immediately.
6.  **Service Role Key**: Ensure your FastAPI backend is using the `SUPABASE_SERVICE_ROLE_KEY` for backend operations (like background agents updating tasks) to bypass RLS when performing autonomous system-level updates on behalf of users. Use the standard `SUPABASE_ANON_KEY` combined with JWTs for client-initiated requests.
