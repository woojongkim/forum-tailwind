import { clientPromise } from "@/util/database";

const page = async () => {
    const client = await clientPromise;
    const db = client.db("forum");
    const result = await db.collection("comment").deleteMany({});

    console.log(result);
    return <div>
        delete all
    </div>
};

export default page;