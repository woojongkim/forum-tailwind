"use client";

import { Comment } from "@/types/comment";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns-tz";
import CommentWrite from "./comment_write";
import { comment } from "postcss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDeleteLeft, faReply } from "@fortawesome/free-solid-svg-icons";
import CommentItem from "./comment_item";
import { set } from "react-hook-form";

interface Props {
  post_id: string;
}

const CommentPage = ({ post_id }: Props) => {
  let [comments, setComments] = useState([] as Comment[]);
  let [dataMap, setDataMap] = useState(new Map<string, Comment>());
  const inputRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    axios.get(`/api/post/${post_id}/comment`).then((res) => {
      console.log("res.data", res.data);
      let dataList = [] as Comment[];

      res.data.filter((item: any) => item.parent_id === null).forEach((item: Comment) => {
        const { cdate, ...etc } = item;
        const comment = {
          ...etc,
          cdate: new Date(item.cdate),
        };
        dataList.push(comment);
        dataMap.set(comment._id, comment);
      });

      res.data.filter((item: any) => item.parent_id != null).forEach((item: Comment) => {
        console.log("comment item", item);
        const { cdate, ...etc } = item;
        const comment = {
          ...etc,
          cdate: new Date(item.cdate),
        };

        dataMap.set(comment._id, comment);

        const parent = dataMap.get(comment.parent_id);
        if (parent) {
          if (!parent.comments) {
            parent.comments = [];
          }
          parent.comments.push(comment);
        }
      })

      setDataMap(new Map<string,Comment>(dataMap));
      setComments(dataList);
    });
  }, []);

  const addComment = (comment: Comment, parent: string | null) => {
    setDataMap(new Map<string, Comment>(dataMap).set(comment._id, comment));
    if (parent) {
      const parentComment = dataMap.get(parent);
      if (parentComment) {
        if (!parentComment.comments) {
          parentComment.comments = [];
        }
        parentComment.comments.push(comment);
        setComments([...comments]);
      }
    } else {
      setComments([...comments, comment]);
    }
  };

  return (
    <div className="flex-col ">
      <div className="flex-col divide-y divide-dashed">
        {comments.map((item: Comment) => {
          return <CommentItem key={item._id} post_id={post_id} comment={item} level={1} addComment={addComment} />
        })}
      </div>
      <CommentWrite post_id={post_id} addComment={addComment} parent_id={null} />
    </div>
  );
};

export default CommentPage;
