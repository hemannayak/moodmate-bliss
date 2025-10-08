import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalAPI } from '@/lib/api';
import { toast } from 'sonner';

export const useJournal = (searchQuery?: string) => {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journalEntries', searchQuery],
    queryFn: () => journalAPI.getAll(searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: journalAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast.success('Journal entry saved!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save entry');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      journalAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast.success('Entry updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update entry');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: journalAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast.success('Entry deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete entry');
    },
  });

  return {
    entries,
    isLoading,
    createEntry: createMutation.mutate,
    updateEntry: updateMutation.mutate,
    deleteEntry: deleteMutation.mutate,
  };
};
