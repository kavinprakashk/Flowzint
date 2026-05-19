-- ==========================================
-- AI YOUTUBE AUTOMATION ECOSYSTEM SCHEMA
-- ==========================================
-- Includes: Tables, Relationships, Indexes, RLS Policies, and Triggers

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. YOUTUBE_CHANNELS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.youtube_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    channel_id TEXT UNIQUE NOT NULL, -- YouTube ID
    channel_name TEXT NOT NULL,
    description TEXT,
    subscriber_count INT DEFAULT 0,
    niche TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_yt_channels_user_id ON public.youtube_channels(user_id);

-- RLS
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own channels" ON public.youtube_channels FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 3. VIDEOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
    video_id TEXT UNIQUE NOT NULL, -- YouTube Video ID
    title TEXT NOT NULL,
    description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_videos_channel_id ON public.videos(channel_id);

-- RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own videos" ON public.videos FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.youtube_channels yc 
        WHERE yc.id = public.videos.channel_id AND yc.user_id = auth.uid()
    )
);

-- ==========================================
-- 4. VIDEO_ANALYTICS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.video_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    watch_time_hours NUMERIC DEFAULT 0,
    retention_rate NUMERIC DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (For time-series and fast analytical queries)
CREATE INDEX idx_video_analytics_video_id_time ON public.video_analytics(video_id, recorded_at DESC);

-- RLS
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analytics for own videos" ON public.video_analytics FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.videos v 
        JOIN public.youtube_channels yc ON v.channel_id = yc.id
        WHERE v.id = public.video_analytics.video_id AND yc.user_id = auth.uid()
    )
);

-- ==========================================
-- 5. EMAILS
-- ==========================================
-- Integrates with existing Gmail agent.
CREATE TABLE IF NOT EXISTS public.emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE NOT NULL,
    sender TEXT NOT NULL,
    subject TEXT,
    body_snippet TEXT,
    full_body TEXT,
    category TEXT DEFAULT 'uncategorized', -- e.g., sponsor, fan, inquiry
    ai_summary TEXT,
    intent TEXT,
    status TEXT DEFAULT 'unread',
    received_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_emails_user_id_category ON public.emails(user_id, category);

-- RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own emails" ON public.emails FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 6. BOOKINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email_id UUID REFERENCES public.emails(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    meeting_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, canceled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_user_id_time ON public.bookings(user_id, meeting_time);

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 7. CHATBOT_CONVERSATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL, -- Contains role (user/ai) and content
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chatbot_conv_user_session ON public.chatbot_conversations(user_id, session_id);

-- RLS
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own conversations" ON public.chatbot_conversations FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 8. AGENT_MEMORY
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agent_type TEXT NOT NULL, -- e.g., 'gmail_parser', 'yt_analyst'
    memory_key TEXT NOT NULL,
    memory_value JSONB NOT NULL,
    importance_score INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_memory_user_agent ON public.agent_memory(user_id, agent_type);

-- RLS
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own agent memory" ON public.agent_memory FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 9. AI_RECOMMENDATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL, -- 'script', 'title', 'thumbnail', 'strategy'
    content JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_rec_user_channel ON public.ai_recommendations(user_id, channel_id);

-- RLS
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own recommendations" ON public.ai_recommendations FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 10. AGENT_TASKS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agent_type TEXT NOT NULL,
    task_name TEXT NOT NULL,
    payload JSONB,
    status TEXT DEFAULT 'queued', -- queued, running, completed, failed
    result JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_tasks_status ON public.agent_tasks(status);

-- RLS
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON public.agent_tasks FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 11. SYSTEM_LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL, -- info, warn, error
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sys_logs_level_service ON public.system_logs(level, service);

-- RLS: Service role only usually, but let admins read
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service roles can insert logs" ON public.system_logs FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 12. AUTOMATION_LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_auto_logs_task ON public.automation_logs(task_id);

-- RLS
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own automation logs" ON public.automation_logs FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 13. WORKFLOW_HISTORY
-- ==========================================
CREATE TABLE IF NOT EXISTS public.workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    workflow_name TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    execution_data JSONB,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflow_history_user ON public.workflow_history(user_id);

-- RLS
ALTER TABLE public.workflow_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workflow history" ON public.workflow_history FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 14. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- info, alert, success
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_yt_channels_modtime BEFORE UPDATE ON public.youtube_channels FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_videos_modtime BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_emails_modtime BEFORE UPDATE ON public.emails FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_agent_memory_modtime BEFORE UPDATE ON public.agent_memory FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_ai_recs_modtime BEFORE UPDATE ON public.ai_recommendations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
