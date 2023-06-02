'use client';

import axios from "axios";
import { useRef } from "react";
import { Comment } from "@/types/comment";
import { ObjectId } from "mongodb";

interface Props{
    post_id: string;
    parent_id: string | null;
    addComment: (comment: Comment, parent: string | null) => void,
}


const CommentWrite = ({post_id, parent_id, addComment} : Props ) => {
    const inputRef = useRef<HTMLTextAreaElement>();
    return (
        <div className="flex my-3">
            <textarea
                ref={inputRef}
                className="w-full p-5 border border-black rounded-md"
            ></textarea>
            <button
                className="px-4 ml-2 text-sm text-white bg-blue-500 rounded-md whitespace-nowrap"
                onClick={() => {
                    axios.post(`/api/post/${post_id}/comment`, {content: inputRef.current?.value, parent_id}).then((res) => {
                        if (res.status === 200) {

                            addComment({
                                ...res.data.data,
                                cdate: new Date(res.data.data.cdate)
                            }, parent_id);

                            // set textarea value to empty
                            inputRef.current.value = "";
                        }
                    });
                }}
            >
                댓글등록
            </button>
        </div>
    )
}

export default CommentWrite;