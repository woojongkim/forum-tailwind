import { clientPromise } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.query.id", req.query.id);
  if (req.method == "GET") {
    const client = await clientPromise;
    const db = client.db("forum");
    const commentDoc = await db
      .collection("comment")
      .find({ post_id: new ObjectId(req.query.id as string) })
      .toArray();

    let comments = commentDoc.map((commentDoc) => {
      return {
        _id: commentDoc._id.toString(),
        post_id: commentDoc.post_id.toString(),
        content: commentDoc.content,
        cuser: commentDoc.cuser,
        cdate: new Date(commentDoc.cdate),
        parent_id: commentDoc.parent_id
          ? commentDoc.parent_id.toString()
          : null,
        likes: commentDoc.likes,
        dislikes: commentDoc.dislikes,
      };
    }).sort((o1,o2) => o1.cdate.getTime() - o2.cdate.getTime());

    console.log(comments);
    return res.status(200).json(comments);
  } else if (req.method == "POST") {
    const session = await getServerSession(req, res, authOptions);
    const client = await clientPromise;
    const db = client.db("forum");
    const col = db.collection("comment");
    const { content, parent_id } = req.body;
    let new_comment = {
      content,
      post_id: new ObjectId(req.query.id as string),
      cdate: new Date(),
      likes: 0,
      dislikes: 0,
      cuser: session?.user?.email,
    };

    if (parent_id) {
      new_comment = { ...new_comment, parent_id: new ObjectId(parent_id) };
    }

    const result = await col.insertOne(new_comment);
    if (result.insertedId) {
      return res.status(200).json({
        data: new_comment,
        message: "댓글 등록에 성공하였습니다.",
      });
    } else {
      return res.status(400).json("댓글 등록에 실패하였습니다.");
    }
  }
}
