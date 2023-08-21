import { useCommentsContext } from '../components/CommentsProvider';


interface Fetcher {
  getObject(done: (data: unknown, elapsedTime: number) => void): void;
}

// run callback if authenticated
const useAuthUtils = () => {
  const auth = Auth.useUser();
  const { onAuthRequested } = useCommentsContext();

  const isAuthenticated = !!auth.session;

  const runIfAuthenticated = (callback: typeof fn) => {
    if (!isAuthenticated) {
      onAuthRequested?.();
    } else {
      callback();
    }
  };

  return {
    runIfAuthenticated,
    isAuthenticated,
    auth,
  };
};

export default useAuthUtils;
