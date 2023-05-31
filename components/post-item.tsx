'use client'

import { FC, MouseEventHandler, SyntheticEvent } from "react";
import { Post } from "@/types/post";
import dateToString from "@/util/date";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface Props {
    post: Post;
}

 function PostItem({post}: Props){
  const { category, title, content, cuser, cdate, view, comments, likes } = post;

  const deletePost: MouseEventHandler = (event) => {
    axios.delete(`/api/post/${post._id}`)
      .then((res: AxiosResponse) => {
        console.log(res);
        const target = event.target as HTMLElement;
        console.log(target.parentElement?.parentElement?.parentElement);
        target.parentElement?.parentElement?.parentElement?.classList.add("opacity-0");
        setTimeout(() => {
          target.parentElement?.parentElement?.parentElement?.classList.add("hidden");
        }, 500);
      });
  };

  return (
    <div className="container px-4 py-8 mx-auto transition bg-white grid-flow-dense">
      <div className="flex justify-between">
        <div>
          <span className="px-2 py-1 mx-2 text-sm text-gray-200 bg-gray-800 rounded-md">{category}</span>
          {/* <span className="text-2xl font-bold text-gray-700">{title}</span> */}
          <Link prefetch={false} href={`/post/${post._id}`}><span className="text-xl font-bold text-gray-700 rounded-md">{title}</span></Link>
          {comments > 0 && <span className="px-2 py-1 ml-2 text-sm text-gray-200 bg-gray-800 rounded-md">[{comments}]</span>}
          <Link href={`/post/edit/${post._id}`}>🖊️</Link>
          <span className="hover:cursor-pointer" onClick={deletePost}>🗑️</span>
        </div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-700 ">{dateToString(cdate, "MM-dd")}</span>
          <span className="text-sm text-gray-700 ">{view}</span>
          <span className="text-sm text-gray-700 ">{likes}</span>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} className="mt-2 overflow-hidden text-gray-700 line-clamp-1 text-ellipsis" />
    </div>
  );
}

export default PostItem;