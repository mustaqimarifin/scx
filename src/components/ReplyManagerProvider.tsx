import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import type * as api from '../api';

type ReplyManagerContextApi = {
  replyingTo: api.Comment | null;
  setReplyingTo: (comment: api.Comment | null) => void;
};

const ReplyManagerContext = createContext<ReplyManagerContextApi | null>(null);

export const useReplyManager = () => {
  return useContext(ReplyManagerContext);
};

const ReplyManagerProvider = ({ children }: { children: ReactNode }) => {
  const [replyingTo, setReplyingTo] = useState<api.Comment | null>(null);

  const api = useMemo(
    () => ({
      replyingTo,
      setReplyingTo,
    }),
    [replyingTo, setReplyingTo]
  );
  return (
    <ReplyManagerContext.Provider value={api}>
      {children}
    </ReplyManagerContext.Provider>
  );
};

export default ReplyManagerProvider;
