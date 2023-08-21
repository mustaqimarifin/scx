import { useQuery } from '@tanstack/react-query';
import useApi from './useApi';

interface UseUserQuery {
  id: string;
}

const useUser = ({ id }: UseUserQuery) => {
  const api = useApi();

  return useQuery({
    queryKey: ['users', id],
    queryFn: () => {
      return api.getUser(id);
    },
  });
};

export default useUser;
