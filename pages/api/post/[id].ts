import { Post } from '@/types/post';
import { readRequestBody } from '@/util/api';
import { clientPromise } from '@/util/database';
import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if(req.method === 'GET'){
        const client = await clientPromise;
        const db = client.db("forum");
        const postDocs  = await db.collection("post").findOne({_id: new ObjectId(req.query.id as string)});
        
        if(postDocs === null)
          return res.status(400).json("Not Found");
  
        const {_id, category, title, content, cuser, cdate, view, comments, likes } = postDocs;
        const post = new Post(_id.toString(), category, title, content, cuser, cdate, view, comments, likes);
        return res.status(200).json(post);
      }else if(req.method === 'DELETE'){
  
        const client = await clientPromise;
        const db = client.db("forum");
        const col = db.collection("post");
  
        col.deleteOne({_id: new ObjectId(req.query.id as string)});
  
        return res.status(200).json("삭제되었습니다.");
      }else{
       // Handle unsupported HTTP methods
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  }