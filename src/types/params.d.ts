export interface AIRequest {
    message: string;
    messages?: { role: 'user' | 'assistant'; content: string }[];
    file_urls?: string[];
    context?: {
        chat_type?: 'past_question' | 'course_specific' | 'general';
        course_id?: string;
        past_question_id?: string;
    },
    config?: {
        model?: string;
        temperature?: number;
        enable_tools?: boolean;
        enable_follow_up?: boolean;
        enable_smart_actions?: boolean;
        enable_file_processing?: boolean;
        max_file_size_mb?: number;
    }
}

export interface SearchParams {
    q?: string;
    query?: string;
    course_id?: string;
    institution_id?: string;
    year?: string;
    semester?: string;
    session?: string;
    exam_type?: string;
    type?: 'mcq' | 'essay';
    tags?: string;
}