import PostItem from '@/components/post-item';
import { Post } from '@/types/post';
import { clientPromise } from '@/util/database';
import Link from 'next/link';

interface Props {
  post: Post;
}

  export default async function List() {
    const client = await clientPromise;
    const db = client.db("forum");
    const postDocs  = await db.collection("post").find().toArray();
    const posts = postDocs.map(postDoc => {
      return {
        _id: postDoc._id.toString(),
        category: postDoc.category,
        title: postDoc.title,
        content: postDoc.content,
        cdate: postDoc.cdate,
        cuser: postDoc.cuser,
        view: postDoc.view,
        comments: postDoc.comments,
        likes: postDoc.likes,
      };
    });
    
    return (
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
      );
  }