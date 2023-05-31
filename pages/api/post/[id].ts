import { readRequestBody } from '@/util/api';
import { clientPromise } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if(req.method === 'GET'){
        const client = await clientPromise;
        const db = client.db("forum");
        const postDoc  = await db.collection("post").findOne({_id: new ObjectId(req.query.id as string)});
        
        if(postDoc === null)
          return res.status(400).json("Not Found");
  
        const post = {
          _id: postDoc._id.toString(),
          category: postDoc.category,
          title: postDoc.title,
          content: postDoc.content,
          cuser: postDoc.cuser,
          cdate: postDoc.cdate,
          view: postDoc.view,
          comments: postDoc.comments,
          likes: postDoc.likes,
        };
        return res.status(200).json(post);
      }else if(req.method === 'DELETE'){
  
        const client = await clientPromise;
        const db = client.db("forum");
        const col = db.collection("post");
  
        col.deleteOne({_id: new ObjectId(req.query.id as string)})
        .then((result) => {
          console.log(result);
        });
  
        return res.status(200).json("삭제되었습니다.");
      }else{
       // Handle unsupported HTTP methods
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  }