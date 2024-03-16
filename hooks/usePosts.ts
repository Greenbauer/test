'use client'

import { Comment, Post } from "@/types";
import { get, getBaseUrl, patch } from "@/utils/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GetPostsRequest {
  page?: number;
}

interface UpdatePostRequest {
  postId: string;
  data: Record<string, unknown>;
}

interface UsePostsReturn {
  getPosts: ({ page }: { page: number }) => Promise<Post[]>;
  updatePost: ({ postId, data }: UpdatePostRequest) => Promise<void>;
}

export default function usePosts(): UsePostsReturn {
  const baseUrl = getBaseUrl();
  const queryClient = useQueryClient();

  const getPosts = async ({ page = 1 }: GetPostsRequest = {}): Promise<Post[]> => {
    const data = await get<Record<string, unknown>[]>({ url: `${baseUrl}/api/data?page=${page}&limit=10` });

    return data.map((post) => {
      let comments = [] as Comment[];
      
      if (post?.comments) {
        comments = Object.values(post?.comments).map((comment: Record<string, unknown>) => {
          return {
            commentId: comment.id as string,
            parentId: comment.parent_id as string,
            displayName: comment.display_name as string,
            text: comment.text as string,
            createdAt: comment.created_at as string,
          };
        });
      }

      return {
        postId: post.post_id as string,
        postUrl: post.post_url as string,
        title: post.title as string,
        createdAt: post.created_at as string,
        numHugs: post.num_hugs as number,
        patientDescription: post.patient_description as string,
        assessment: post.assessment as string,
        question: post.question as string,
        comments,
      };
    });
  }

  const update = async ({ postId, data }: UpdatePostRequest): Promise<void> => {
    await patch<Post>({ url: `${baseUrl}/api/data/${postId}`, data });
  }

  const { mutateAsync: updatePost } = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  })

  return {
    getPosts,
    updatePost,
  }
}
