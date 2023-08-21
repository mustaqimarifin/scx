import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from './useApi';

interface UseDeleteCommentPayload {
  id: string;
}

const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation(
    ({ id }: UseDeleteCommentPayload) => {
      return api.deleteComment(id);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [
            'comments',
            { topic: data.topic, parentId: data.parent_id },
          ],
        });
      },
    }
  );
};

export default useDeleteComment;
