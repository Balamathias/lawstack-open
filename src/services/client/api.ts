import { AIRequest, SearchParams } from "@/types/params";
import { useMutation } from "@tanstack/react-query";
import { 
    getAgentResponse, 
    getSearchResults,
    getPastQuestionDetails,
    getSearchFilters
} from "../api";


const QUERY_KEYS = {
    chatAgent: 'chatAgent',
    searchResults: 'searchResults',
    pastQuestionDetails: 'pastQuestionDetails',
    searchFilters: 'searchFilters'
} as const;

export const useChatAgent = () => useMutation({
    mutationKey: [QUERY_KEYS.chatAgent],
    mutationFn: async (data: AIRequest) => {
        const response = await getAgentResponse(data);
        if (response.error) {
            throw new Error(response.error.message || 'Error fetching agent response');
        }
        return response.data;
    }
})

export const useSearchResults = () => useMutation({
    mutationKey: [QUERY_KEYS.searchResults],
    mutationFn: async (params: SearchParams) => {
        const response = await getSearchResults(params);
        if (response.error) {
            throw new Error(response.error.message || 'Error fetching search results');
        }
        return response.data;
    }
})


export const usePastQuestionDetails = () => useMutation({
    mutationKey: [QUERY_KEYS.pastQuestionDetails],
    mutationFn: async (id: string) => {
        const response = await getPastQuestionDetails(id);
        if (response.error) {
            throw new Error(response.error.message || 'Error fetching past question details');
        }
        return response.data;
    }
})

export const useSearchFilters = () => useMutation({
    mutationKey: [QUERY_KEYS.searchFilters],
    mutationFn: async () => {
        const response = await getSearchFilters();
        if (response.error) {
            throw new Error(response.error.message || 'Error fetching search filters');
        }
        return response.data;
    }
})