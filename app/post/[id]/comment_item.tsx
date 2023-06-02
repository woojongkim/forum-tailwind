import { Comment } from "@/types/comment";
import { faDeleteLeft, faReply, faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns-tz";
import { useState } from "react";
import CommentWrite from "./comment_write";


interface Props{
    post_id: string,
    comment: Comment,
    addComment: (comment: Comment, parent: string | null) => void,
    level : number
}

const CommentItem = ({comment, level, post_id, addComment} : Props) => {
    const [doReply, setDoReply] = useState(false);

    const whenWrite = (comment: Comment, parent:string|null) => {
        setDoReply(false);
        addComment(comment,parent);
    }

    return <div key={comment._id} className="flex-col p-1 bg-gray-100">
    <div className="flex justify-between">
      <div className={`pl-${level*2}`}>
        {level>1 && <FontAwesomeIcon  icon={faArrowTurnUp} rotation={90} />}
        <span className="ml-2">ㅇㅇ</span>
      </div>
      <div className="flex gap-2">
        <div className="text-sm font-bold text-gray-700">{format(comment.cdate, 'yyyy.MM.dd')}</div>
        <div className="text-sm text-gray-700">{format(comment.cdate, 'HH:mm')}</div>
        <FontAwesomeIcon
          icon={faReply}
          className="hover:cursor-pointer"
          onClick={()=>{
            setDoReply(!doReply);
          }}
        />
        <FontAwesomeIcon
          icon={faDeleteLeft}
        />
      </div>
    </div>
    <div className="pl-2 my-1 whitespace-pre-line">
      {comment.content}
    </div>
    {
        doReply && <CommentWrite  post_id={post_id} parent_id={comment._id} addComment={whenWrite}/>
    }
    {
      (comment.comments && comment.comments.map((item) => {
        return <CommentItem key={item._id} post_id={post_id} comment={item} level={level + 1} addComment={addComment} />
      }))
    }
  </div>
};

export default CommentItem;