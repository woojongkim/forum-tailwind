'use client'

import { useRouter } from "next/navigation";
import axios from "axios";

type Props = {
    params: {
      id: string;
    };
  };

export default function DeletePost(props : Props) {
    const router = useRouter();

    axios.delete(`/api/post/${props.params.id}`);

    router.push("/post");
    router.refresh();
};