import { useQuery } from '@tanstack/react-query';
import useApi from './useApi';

interface UseReactionQuery {
  type: string;
}

interface UseReactionOptions {
  enabled?: boolean;
}

const useReaction = (
  { type }: UseReactionQuery,
  options: UseReactionOptions = {}
) => {
  const api = useApi();

  return useQuery({
    queryKey: ['reactions', type],
    queryFn: () => api.getReaction(type),
  });
};

export default useReaction;
