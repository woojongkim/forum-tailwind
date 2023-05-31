"use client";

import { Comment } from "@/types/comment";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns-tz";

interface Props {
  post_id: string;
}

const CommentPage = ({ post_id }: Props) => {
  let [comments, setComments] = useState([]);
  const inputRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    axios.get(`/api/post/${post_id}/comment`).then((res) => {
      console.log("res.data", res.data);
      setComments(
        res.data.map((comment: Comment) => {
            const {cdate, ...etc} = comment;
          return {
            ...etc,
            cdate: new Date(comment.cdate),
          };
        })
      );
    });
  }, []);

  return (
    <div className="flex-col ">
      <div className="flex-col divide-y divide-dashed">
        {comments.map((comment: Comment) => {
          return (
            <div key={comment._id} className="flex-col p-1 bg-gray-100 ">
              <div className="flex justify-between">
                <div className="text-sm">ㅇㅇ</div>
                <div className="flex">
                  <div className="text-sm font-bold text-gray-700">{format(comment.cdate, 'yyyy.MM.dd')}</div>
                  <div className="ml-1 text-sm text-gray-700">{format(comment.cdate, 'HH:mm')}</div>
                  <div></div>
                </div>
              </div>
              <div className="pl-2 my-1 whitespace-pre-line">
                {comment.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex my-3">
        <textarea
          ref={inputRef}
          className="w-full p-5 border border-black rounded-md"
        ></textarea>
        <button
          className="px-4 ml-2 text-sm text-white bg-blue-500 rounded-md whitespace-nowrap"
          onClick={() => {
            axios.post(`/api/post/${post_id}/comment`, { content: inputRef.current?.value }).then((res) =>{
                if(res.status === 200){
                    setComments([...comments, {
                        ...res.data.data,
                        cdate: new Date(res.data.data.cdate)
                    }]);
                    
                    // set textarea value to empty
                    inputRef.current.value = "";
                }
            });
          }}
        >
          댓글등록
        </button>
      </div>
    </div>
  );
};

export default CommentPage;
