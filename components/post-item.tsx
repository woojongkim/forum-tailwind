import { FC } from "react";
import { Post } from "@/types/post";
import dateToString from "@/util/date";
import Link from "next/link";

interface Props {
    post: Post;
}

const PostItem : FC<Props> = ({ post }) => {
    const { category, title, content, cuser, cdate, view, comments, likes } = post;
    return (
        <div className="container px-4 py-8 mx-auto bg-white rounded-xl ">
            <div className="flex justify-between">
                <div>
                    <span className="px-2 py-1 mx-2 text-sm text-gray-200 bg-gray-800 rounded-md">{category}</span>
                    {/* <span className="text-2xl font-bold text-gray-700">{title}</span> */}
                    <Link prefetch={false} href={`/post/${post._id}`}><span className="text-xl font-bold text-gray-700 rounded-md">{title}</span></Link>
                    {comments >0 && <span className="px-2 py-1 ml-2 text-sm text-gray-200 bg-gray-800 rounded-md">[{comments}]</span>}
                </div>
                <div className="flex gap-4">
                <span className="text-sm text-gray-700 ">{dateToString(cdate, "MM-dd")}</span>
                <span className="text-sm text-gray-700 ">{view}</span>
                <span className="text-sm text-gray-700 ">{likes}</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} className="mt-2 overflow-hidden text-gray-700 line-clamp-1 text-ellipsis"/>
          {/* <div className="flex items-center mt-4">
            <span className="text-sm">{dateToString(cdate)}</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-sm">{cuser}</span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm">{category}</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-sm">{view} views</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-sm">{comments} comments</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-sm">{likes} likes</span>
          </div>
          <hr className="my-4" /> */}
          
        </div>
      );
};

export default PostItem;