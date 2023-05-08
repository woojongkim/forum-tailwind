import PostItem from '@/components/post-item';
import { Post } from '@/types/post';
import { clientPromise } from '@/util/database';
import { ObjectId } from 'mongodb';
import Link from 'next/link';

    interface Props {
        posts: Post[];
    }

  export default async function PostList(props : Props) {
    
    return (
      <div className='flex flex-col gap-5 px-4 py-8'>
        <section className='ml-3'>
          <Link href="/post/write"><span className='p-2 font-bold text-gray-800 bg-gray-200 rounded-xl'>글쓰기</span></Link>
        </section>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {props.posts.map((post) => {
            return (
              <PostItem key={post._id} post={post} />
            );
          })}
        </section>
      </div>
      );
  }