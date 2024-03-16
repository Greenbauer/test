import { Comment } from "@/types";
import CardContent from '@mui/material/CardContent';
import { Button, Typography } from "@mui/material";
import { getTimeFromNow } from "@/utils/format";
import { QuestionAnswer } from "@mui/icons-material";

interface CommentSectionProps {
  comment: Comment;
}

function CommentSection({ comment }: CommentSectionProps) {
  const { displayName, text, createdAt } = comment;

  const timeFromNow = getTimeFromNow(createdAt); 

  return (
    <CardContent>
      <div className="flex flex-row align-middle gap-4">
        <Typography variant="h6">
          {displayName}
        </Typography>
        <Typography color="text.secondary" style={{ display: 'flex', alignItems: 'center'}}>
          {timeFromNow}
        </Typography>
      </div>
      <Typography color="text.secondary">
        {text}
      </Typography>
      <div className="flex flex-row justify-between align-middle pt-4">
        <div className="flex flex-row gap-4">
          <Button size="small">
            <div className="flex flex-row gap-2">
              <QuestionAnswer fontSize="small" />
              Reply
            </div>
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

interface CommentSectionsProps {
  parentComments: Comment[];
  comments: Comment[];
}

export default function CommentSections({ parentComments, comments }: CommentSectionsProps) {
  return (
    <>
      {parentComments?.map((parentComment) => {
        const { commentId } = parentComment;
        const childrenComments = comments.filter(({ parentId }) => parentId === commentId);

        return (
          <>
            <CommentSection key={commentId} comment={parentComment} />
            <div className="pl-8">
              <CommentSections parentComments={childrenComments} comments={comments} />
            </div>
          </>
        )
      })}
    </>
  )
}

