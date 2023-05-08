import PostItem from "@/components/post-item";
import { Post } from "@/types/post";
import { clientPromise } from "@/util/database";
import dateToString from "@/util/date";
import { ObjectId } from "mongodb";
import Link from "next/link";
import List from "../page";

type Props = {
  params: {
    id: string;
  };
};

export default async function Detail(props: Props) {
  console.debug("List props", props);
  const id = props.params.id;
  const client = await clientPromise;
  const db = client.db("forum");
  const postDoc = await db
    .collection("post")
    .findOne({ _id: new ObjectId(id) });
  console.debug("postDocs", postDoc);

  if (postDoc == null) return <div>Not found</div>;

  const { _id, category, title, content, cuser, cdate, view, comments, likes } =
  postDoc;

    const postDocs  = await db.collection("post").find().toArray();
    const posts = postDocs.map(postDoc => {
      const {_id, category, title, content, cuser, cdate, view, comments, likes } = postDoc;
      return new Post(_id.toString(), category, title, content, cuser, cdate, view, comments, likes);
    });

  return (
    <div>
      <div className="p-6 text-gray-700 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <span className="text-2xl font-bold ">{title}</span>
          <Link href={`/post/edit/${_id}`}>🖊️</Link>
          <Link href={`/post/delete/${_id}`}>🗑️</Link>
        </div>
        <div className="mb-4">
          <span className="font-bold">Category:</span> {category}
        </div>
        <div className="mb-4">
          <span className="font-bold">Content:</span> {content}
        </div>
        <div className="mb-4">
          <span className="font-bold">Created by:</span> {cuser}
        </div>
        <div className="mb-4">
          <span className="font-bold">Created on:</span>{" "}
          {dateToString(cdate, "yyyy-mm-dd hh:mm:ss")}
        </div>
        <div className="mb-4">
          <span className="font-bold">Views:</span> {view}
        </div>
        <div className="mb-4">
          <span className="font-bold">Likes:</span> {likes}
        </div>
      </div>

      <div className='flex flex-col gap-5 px-4 py-8'>
        <section className='ml-3'>
          <Link href="/post/write"><span className='p-2 font-bold text-gray-800 bg-gray-200 rounded-xl'>글쓰기</span></Link>
        </section>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {posts.map((post) => {
            return (
              <PostItem key={post._id} post={post} />
            );
          })}
        </section>
      </div>
    </div>
  );
}
