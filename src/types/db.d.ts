export interface AIResponse {
    message: string;
    conversation_id: string | null;
    timestamp: string;
    model_used: string;
    context_preserved: boolean;
    tools_used: boolean;
    functions_called: string[];
    total_functions: number;
    files_processed: number;
    user_authenticated: boolean;
    user_id: string | null;
    follow_up_questions: FollowUpQuestion[];
    smart_actions: SmartAction[];
}

export interface FollowUpQuestion {
    text: string;
    type: 'research' | 'examples' | 'clarification' | 'analysis';
}

export interface SmartAction {
    type: 'search' | 'study' | 'practice' | 'bookmark' | 'export' | 'analyze';
    title: string;
    description: string;
    action: string;
    icon: string;
}