import { SupabaseClient, User } from '@supabase/supabase-js';

export type CommentReactionMetadata = {
  comment_id: string;
  reaction_type: string;
  reaction_count: number;
  active_for_user: boolean;
};

export type DisplayUser = {
  id: string;
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  user_id: string;
  parent_id: string | null;
  topic: string;
  comment: string;
  created_at: string;
  replies_count: number;
  reactions_metadata: CommentReactionMetadata[];
  user: DisplayUser;
  mentioned_user_ids: string[];
};

export type Reaction = {
  type: string;
  created_at: string;
  label: string;
  url: string;
  metadata: JSON;
};

export type CommentReaction = {
  id: string;
  user_id: string;
  comment_id: string;
  reaction_type: string;
  created_at: string;
  user: DisplayUser;
};

export const assertResponseOk = (response: { error }) => {
  if (response.error) {
    throw new ApiError(response.error);
  }
};

export class ApiError extends Error {
  type = 'ApiError';
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  constructor(error) {
    super(error.message);
    this.message = error.message;
    this.details = error.details;
    this.hint = error.hint;
    this.code = error.code;
  }
}

export type GetCommentsOptions = {
  topic: string;
  parentId: string | null;
};

export type AddCommentPayload = {
  comment: string;
  topic: string;
  parent_id: string | null;
  mentioned_user_ids: string[];
};

export type UpdateCommentPayload = {
  comment: string;
  mentioned_user_ids: string[];
};

export type GetCommentReactionsOptions = {
  reaction_type: string;
  comment_id: string;
};

export type AddCommentReactionPayload = {
  reaction_type: string;
  comment_id: string;
};

export type RemoveCommentReactionPayload = {
  reaction_type: string;
  comment_id: string;
};

export const createApiClient = (
  supabase: SupabaseClient,
  userId?: User['id']
) => {
  /*   const userId = supabase.auth.getUser().then(() => {
        setIsEditing(false)
      }) */
  const getComments = async ({
    topic,
    parentId = null,
  }: GetCommentsOptions): Promise<Comment[]> => {
    const query = supabase
      .from('comments_with_metadata')
      .select(
        '*,user:display_users!user_id(*),reactions_metadata:comment_reactions_metadata(*)'
      )
      .eq('topic', topic)
      .order('created_at', { ascending: true });

    if (parentId) {
      query.eq('parent_id', parentId);
    } else {
      query.is('parent_id', null);
    }
    const response = await query;
    assertResponseOk(response);
    return response.data as Comment[];
  };

  const getComment = async (id: string): Promise<Comment> => {
    const query = supabase
      .from('comments_with_metadata')
      .select(
        '*,user:display_users!user_id(*),reactions_metadata:comment_reactions_metadata(*)'
      )
      .eq('id', id)
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as Comment;
  };

  const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
    const query = supabase
      .from('comments')
      .insert({
        ...payload,
        user_id: userId,
      })
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as unknown as Comment;
  };

  const updateComment = async (
    id: string,
    payload: UpdateCommentPayload
  ): Promise<Comment> => {
    const query = supabase
      .from('comments')
      .update(payload)
      .match({ id })
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data;
  };

  const deleteComment = async (id: string): Promise<Comment> => {
    const query = supabase.from('comments').delete().match({ id }).single();

    const response = await query;
    assertResponseOk(response);
    return response.data as unknown as Comment;
  };

  const getReactions = async (): Promise<Reaction[]> => {
    const query = supabase
      .from('reactions')
      .select('*')
      .order('type', { ascending: true });

    const response = await query;
    assertResponseOk(response);
    return response.data as Reaction[];
  };

  const getReaction = async (type: string): Promise<Reaction> => {
    const query = supabase
      .from('reactions')
      .select('*')
      .eq('type', type)
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as Reaction;
  };

  const getCommentReactions = async ({
    reaction_type,
    comment_id,
  }: GetCommentReactionsOptions): Promise<CommentReaction[]> => {
    const query = supabase
      .from('comment_reactions')
      .select('*,user:display_users!user_id(*)')
      .eq('comment_id', comment_id)
      .eq('reaction_type', reaction_type);

    const response = await query;
    assertResponseOk(response);
    return response.data as CommentReaction[];
  };

  const addCommentReaction = async (
    payload: AddCommentReactionPayload
  ): Promise<CommentReaction> => {
    const query = supabase
      .from('comment_reactions')
      .insert({
        ...payload,
        user_id: userId, //(await supabase.auth.getUser()).data.user?.id
      })
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as unknown as CommentReaction;
  };

  const removeCommentReaction = async ({
    reaction_type,
    comment_id,
  }: RemoveCommentReactionPayload): Promise<CommentReaction> => {
    const query = supabase
      .from('comment_reactions')
      .delete({ count: 'estimated' })
      .match({ reaction_type, comment_id, user_id: userId }) //supabase.auth.user()?.id })
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as unknown as CommentReaction;
  };

  const searchUsers = async (search: string): Promise<DisplayUser[]> => {
    const query = supabase
      .from('display_users')
      .select('*')
      .ilike('name', `%${search}%`)
      .limit(5);

    const response = await query;
    assertResponseOk(response);
    return response.data as DisplayUser[];
  };

  const getUser = async (id: string): Promise<DisplayUser> => {
    const query = supabase
      .from('display_users')
      .select('*')
      .eq('id', id)
      .single();

    const response = await query;
    assertResponseOk(response);
    return response.data as DisplayUser;
  };

  return {
    getComments,
    getComment,
    addComment,
    updateComment,
    deleteComment,
    getReactions,
    getReaction,
    getCommentReactions,
    addCommentReaction,
    removeCommentReaction,
    searchUsers,
    getUser,
  };
};
