import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodLogsAPI } from '@/lib/api';
import { toast } from 'sonner';

export const useMoodLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['moodLogs'],
    queryFn: moodLogsAPI.getAll,
  });

  const { data: aiInsights, isLoading: aiInsightsLoading } = useQuery({
    queryKey: ['moodLogs', 'ai-insights'],
    queryFn: moodLogsAPI.getAIInsights,
    retry: (failureCount, error: any) => {
      // Don't retry if no data yet (expected for new users)
      if (error?.message?.includes('Not enough data')) return false;
      return failureCount < 3;
    },
  });

  const createMutation = useMutation({
    mutationFn: moodLogsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodLogs'] });
      queryClient.invalidateQueries({ queryKey: ['moodLogs', 'ai-insights'] });
      toast.success('Mood logged successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to log mood');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      moodLogsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodLogs'] });
      queryClient.invalidateQueries({ queryKey: ['moodLogs', 'ai-insights'] });
      toast.success('Mood log updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update mood log');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: moodLogsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodLogs'] });
      queryClient.invalidateQueries({ queryKey: ['moodLogs', 'ai-insights'] });
      toast.success('Mood log deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete mood log');
    },
  });

  return {
    logs,
    isLoading,
    aiInsights,
    aiInsightsLoading,
    createMoodLog: createMutation.mutate,
    updateMoodLog: updateMutation.mutate,
    deleteMoodLog: deleteMutation.mutate,
  };
};
