'use server'

import { AIResponse, PastQuestionDetailResponse, SearchFilterMap, SearchResults } from "@/types/db"
import { PaginatedStackResponse, StackResponse } from "@/types/generics"
import { AIRequest, SearchParams } from "@/types/params"
import { stackbase } from "./stackbase"
import { handleError } from "./utils"

export const getAgentResponse = async (params: AIRequest): Promise<StackResponse<AIResponse | null>> => {
    try {
        const response = await stackbase.post<StackResponse<AIResponse>>('/open/chat/message/', params)
        return response.data
    } catch (error) {
        console.error("Error fetching agent response:", error)
        return handleError(error)
    }
}

export const getSearchResults = async (params: SearchParams): Promise<PaginatedStackResponse<SearchResults | null>> => {
    try {
        const response = await stackbase.get<PaginatedStackResponse<SearchResults>>('/open/past-questions/', { params })
        return response.data
    } catch (error) {
        console.error("Error fetching search results:", error)
        return handleError(error, true) as any
    }
}

export const getPastQuestionDetails = async (id: string): Promise<StackResponse<PastQuestionDetailResponse | null>> => {
    try {
        const response = await stackbase.get<StackResponse<any>>(`/open/past-questions/${id}/`)
        return response.data
    } catch (error) {
        console.error("Error fetching past question details:", error)
        return handleError(error)
    }
}

export const getSearchFilters = async (): Promise<StackResponse<SearchFilterMap | null>> => {
    try {
        const response = await stackbase.get<StackResponse<any>>('/open/past-questions/filter-map/')
        return response.data
    } catch (error) {
        console.error("Error fetching search filters:", error)
        return handleError(error)
    }
}