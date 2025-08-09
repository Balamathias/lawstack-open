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

export interface PastQuestionDetailResponse {
    id: string;
    text: string;
    text_plain: string;
    year: string;
    semester: string;
    exam_type: string;
    type: string;
    marks: string;
    session: string;
    course: {
        id: string;
        name: string;
        code: string;
    };
    institution: {
        id: string;
        name: string;
    };
    tags: string[];
    views_count: number;
    created_at: string;
    updated_at: string;
    ai_overview: string;
}


export interface SearchResults {
    results: SearchResultItem[];
}

export interface SearchResultItem {
    id: string;
    text: string;
    year: string;
    semester: string;
    exam_type: string;
    type: string;
    course: {
        id: string;
        name: string;
        code: string;
    };
    institution: {
        id: string;
        name: string;
    };
    tags: string[];
    views_count: number;
    created_at: string;
}

export interface SearchFilterMap {
    filters: {
        courses: CourseFilter[];
        institutions: InstitutionFilter[];
        years: YearFilter[];
        semesters: SemesterFilter[];
        sessions: SessionFilter[];
        exam_types: ExamTypeFilter[];
        types: TypeFilter[];
        tags: TagFilter[];
    };
    ordering: {
        default: string;
        allowed: string[];
    };
    meta: {
        total_items: number;
        applied_filters: {
            q: string | null;
            course_id: string | null;
            institution_id: string | null;
            year: string | null;
            semester: string | null;
            session: string | null;
            exam_type: string | null;
            type: string | null;
            tags: string | null;
            tag_ids: string | null;
        };
        generated_at: string;
    };
}

export interface CourseFilter {
    id: string;
    name: string;
    code: string;
    count: number;
}

export interface InstitutionFilter {
    id: string;
    name: string;
    count: number;
}

export interface YearFilter {
    value: string;
    count: number;
}

export interface SemesterFilter {
    value: string;
    label: string;
    count: number;
}

export interface SessionFilter {
    value: string;
    count: number;
}

export interface ExamTypeFilter {
    value: string;
    label: string;
    count: number;
}

export interface TypeFilter {
    value: string;
    label: string;
    count: number;
}

export interface TagFilter {
    id: string;
    name: string;
    count: number;
}