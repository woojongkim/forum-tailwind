import { Post } from '@/types/post';
import { readRequestBody } from '@/util/api';
import { clientPromise } from '@/util/database';
import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if(req.method === 'GET') {
      const client = await clientPromise;
      const db = client.db("forum");
      const postDocs  = await db.collection("post").find().toArray();
      const posts = postDocs.map(postDoc => {
        const {_id, category, title, content, cuser, cdate, view, comments, likes } = postDoc;
        return new Post(_id.toString(), category, title, content, cuser, cdate, view, comments, likes);
      });
      
      return res.status(200).json(posts);
    }else if(req.method === 'POST'){
      const {_id, ...post} = Post.from(req.body);

      if(post.title === undefined || post.title === ''){
        return res.status(400).json("제목을 입력해주세요.");
      }

      if(post.content === undefined || post.content === ''){
        return res.status(400).json("내용을 입력해주세요.");
      }
      
      const client = await clientPromise;
      const db = client.db("forum");
      const col = db.collection("post");

      col.insertOne(post);
      return res.redirect(302, '/post');
    }else if(req.method === 'PUT'){
      const {_id, title, content} = Post.from(req.body);
      const post = {title, content};

      if(post.title === undefined || post.title === ''){
        return res.status(400).json("제목을 입력해주세요.");
      }

      if(post.content === undefined || post.content === ''){
        return res.status(400).json("내용을 입력해주세요.");
      }

      const client = await clientPromise;
      const db = client.db("forum");
      const col = db.collection("post");

      try{
        const result = await col.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: post});
        console.log(result);
      }catch(e : any){
        console.log(e.toString());
        return res.status(400).json(e.toString());
      }

      return res.status(200).json("수정되었습니다.");
    }else if(req.method === 'DELETE'){
      const {_id} = Post.from(req.body);

      const client = await clientPromise;
      const db = client.db("forum");
      const col = db.collection("post");

      col.deleteOne({_id: new ObjectId(_id)});

      return res.status(200).json("삭제되었습니다.");
    }
    else{
       // Handle unsupported HTTP methods
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  }