import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToolFeedbacks, createFeedback } from "@/lib/api/clientApi";
import { Feedback, CreateFeedbackDto } from "@/types/feedback";

type ApiError = {
  message?: string;
};

// Хук для отримання відгуків інструменту
export const useToolFeedbacks = (toolId: string) => {
  return useQuery<Feedback[], ApiError>({
    queryKey: ["feedbacks", toolId],
    queryFn: async () => {
      const { feedbacks } = await getToolFeedbacks(toolId);
      return feedbacks;
    },
  });
};

// Хук для створення нового відгуку
export const useCreateFeedback = (toolId: string, onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, CreateFeedbackDto>({
    mutationFn: (dto) => createFeedback(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks", toolId] });
      onClose();
    },
  });
};
