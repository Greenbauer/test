'use client'

import { Post } from "@/types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CircularProgress, Typography } from "@mui/material";
import { getTimeFromNow } from "@/utils/format";
import { Fragment, Suspense, useState } from "react";
import CommentSections from "@/components/CommentSections";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import usePosts from "@/hooks/usePosts";
import { Bookmark, Favorite, QuestionAnswer } from "@mui/icons-material";

export default function Home() {
  const { updatePost, getPosts } = usePosts();
  const { infiniteScrollRef, items: posts, isFetching, error } = useInfiniteScroll<Post>({
    queryKey: ['posts'],
    getItems: getPosts,
  });

  const [showComments, setShowComments] = useState<boolean>(false);

  const handleAddHug = async ({ postId, post }: { postId: string, post: Post }): Promise<void> => {
    await updatePost({ postId, data: { num_hugs: post.numHugs + 1 } });
  }

  const handleShowComments = (): void => {
    setShowComments(!showComments);
  }

  if (error) return <Typography variant="h5">Error</Typography>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<CircularProgress />}>
            {posts?.map((post) => {
              const { postId, title, createdAt, numHugs, patientDescription, comments } = post;

              const numComments = comments.length;
              const timeFromNow = getTimeFromNow(createdAt); 
              const parentComments = comments.filter(({ parentId }) => !parentId);

              return (
                <Fragment key={postId}>
                  <Card  raised className="bg-light" ref={infiniteScrollRef}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {title}
                      </Typography>
                      <Typography color="text.secondary">
                        {patientDescription}
                      </Typography>
                      <div className="flex flex-row justify-between align-middle pt-4">
                        <div className="flex flex-row gap-4">
                          <Button size="small" className="bg-grey border-red" onClick={() => handleAddHug({ postId, post })}>
                            <div className="flex flex-row gap-2 text-accent">
                              <Favorite fontSize="small" />
                              {`${numHugs} Hugs`}
                            </div>
                          </Button>
                          <Button size="small" onClick={handleShowComments}>
                            <div className="flex flex-row gap-2">
                              <QuestionAnswer fontSize="small" />
                              {`${numComments} Comments`}
                            </div>
                          </Button>
                          <Button size="small">
                            <div className="flex flex-row gap-2">
                              <Bookmark fontSize="small" />
                              Save
                            </div>
                          </Button>
                        </div>
                        <Typography color="text.secondary">
                            {timeFromNow}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                  {showComments && !!parentComments.length && (
                    <Card raised className="bg-light">
                      <CommentSections parentComments={parentComments} comments={comments} />
                    </Card>
                  )}
                  {/* TODO: use react-hook-form to build reusable form field components and build an add comment section */}
                </Fragment>
              )
            })}
          </Suspense>
          {isFetching && <CircularProgress />}
        </div>
      </div>
    </main>
  );
}
