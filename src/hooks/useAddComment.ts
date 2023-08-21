import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from './useApi';

interface UseAddCommentPayload {
  comment: string;
  topic: string;
  parentId: string | null;
  mentionedUserIds: string[];
}

const useAddComment = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation(
    ({ comment, topic, parentId, mentionedUserIds }: UseAddCommentPayload) => {
      return api.addComment({
        comment,
        topic,
        parent_id: parentId,
        mentioned_user_ids: mentionedUserIds,
      });
    },
    {
      onSuccess: (data: any, params: { topic: any; parentId: any }) => {
        queryClient.invalidateQueries({
          queryKey: [
            'comments',
            { topic: params.topic, parentId: params.parentId },
          ],
        });
      },
    }
  );
};

export default useAddComment;
