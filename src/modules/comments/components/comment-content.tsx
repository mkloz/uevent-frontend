interface CommentContentProps {
  content: string;
  isReply?: boolean;
}

export const CommentContent = ({ content, isReply = false }: CommentContentProps) => {
  return <p className={`text-sm whitespace-pre-line ${isReply ? 'mt-1' : ''}`}>{content}</p>;
};
