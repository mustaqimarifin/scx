import { useQuery, useQueryClient } from '@tanstack/react-query';
import useApi from './useApi';

interface UseSearchUsersQuery {
  search: string;
}

interface UseSearchUsersOptions {
  enabled?: boolean;
}

const useSearchUsers = (
  { search }: UseSearchUsersQuery,
  options: UseSearchUsersOptions = {}
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['users', { search }],
    queryFn: () => api.searchUsers(search),
  });
};
return queryClient.invalidateQueries({
  queryKey: ['users', { search }],
});
/* queryClient.setQueryData(
  ['posts', { id }],
  // ✅ this is the way
  (oldData) => oldData ? {
    ...oldData,
    title: 'my new post title'
  } : oldData
)
 */

export default useSearchUsers;

/*  {
      enabled: options.enabled,
      staleTime: Infinity,
 onSuccess: (data, user) => {
      queryClient.setQueryData(['users', { id: user.id }], data)
    },
    } */
/* pnpm dlx jscodeshift ./src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.js */
