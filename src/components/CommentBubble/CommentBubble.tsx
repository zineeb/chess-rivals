import type { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface CommentBubbleProps {
    comment: string;
    isThinking: boolean;
}

export const CommentBubble: FC<CommentBubbleProps> = ({ comment, isThinking }) => {
    if (!comment && !isThinking) return null;

    return (
        <div className="comment-bubble">
            {isThinking ? (
                <Loader2 className="comment-bubble__loader" />
            ) : (
                <p className="comment-bubble__text">{comment}</p>
            )}
        </div>
    );
};
