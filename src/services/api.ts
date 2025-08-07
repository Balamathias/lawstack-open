'use server'

import { AIResponse } from "@/types/db"
import { StackResponse } from "@/types/generics"
import { AIRequest } from "@/types/params"
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