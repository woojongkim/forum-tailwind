import { Post } from "@/types/post";
import { readRequestBody } from "@/util/api";
import { clientPromise } from "@/util/database";
import { ObjectId } from "mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const client = await clientPromise;
    const db = client.db("forum");
    const postDocs = await db.collection("post").find().toArray();
    const posts = postDocs.map((postDoc) => {
      return {
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
    });

    return res.status(200).json(posts);
  } else if (req.method === "POST") {
    const session = await getServerSession( req, res, authOptions);

    const { _id, ...post } = req.body;

    if (post.title === undefined || post.title === "") {
      return res.status(400).json("제목을 입력해주세요.");
    }

    if (post.content === undefined || post.content === "") {
      return res.status(400).json("내용을 입력해주세요.");
    }

    const new_post = {
      ...post,
      cdate: new Date(),
      view: 0,
      comments: 0,
      likes: 0,
      category: "웹툰",
      cuser: session?.user?.email,
    };

    const client = await clientPromise;
    const db = client.db("forum");
    const col = db.collection("post");


    const result = await col.insertOne(new_post);
    
    if(result.insertedId){
      return res.redirect(302, `/post/${result.insertedId.toString()}`)
    }else{
      return res.status(400).json("등록에 실패하였습니다.");
    }
  } else if (req.method === "PUT") {
    const { _id, title, content } = req.body;
    const post = { title, content };

    if (post.title === undefined || post.title === "") {
      return res.status(400).json("제목을 입력해주세요.");
    }

    if (post.content === undefined || post.content === "") {
      return res.status(400).json("내용을 입력해주세요.");
    }

    const client = await clientPromise;
    const db = client.db("forum");
    const col = db.collection("post");

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: post }
      );
      console.log(result);
    } catch (e: any) {
      console.log(e.toString());
      return res.status(400).json(e.toString());
    }

    return res.status(200).json("수정되었습니다.");
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
