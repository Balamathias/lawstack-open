export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

import { AxiosError } from 'axios';

interface ErrorResponsePaginated {
    message: string;
    error: any;
    status: number;
    data: [];
    count: number;
    next?: string;
    previous?: string;
}

interface ErrorResponseSingle {
    message: string;
    error: any;
    status: number;
    data: null;
}

export function handleError(error: unknown, paginated: true): ErrorResponsePaginated;
export function handleError(error: unknown, paginated?: false): ErrorResponseSingle;
export function handleError(error: unknown, paginated = false): ErrorResponsePaginated | ErrorResponseSingle {
    if (error instanceof AxiosError) {
        if (error.response) {
            return {
                message: error.response.data?.message || error.response.data?.detail || "Server error occurred.",
                error: error.response.data,
                status: error.response.status,
                data: paginated ? [] : null,
                count: paginated ? error.response.data?.count || 0 : undefined
            } as any;
        }
        
        if (error.request) {
            return {
                message: "Network error - no response received.",
                error: { request: error.request, message: error.message },
                status: 0,
                data: paginated ? [] : null,
                count: paginated ? 0 : undefined
            } as any;
        }
    }
    
    return {
        message: "An unexpected error occurred.",
        error: { message: (error as Error).message || "Unknown error" },
        status: 500,
        data: paginated ? [] : null,
        count: paginated ? 0 : undefined
    } as any;
}