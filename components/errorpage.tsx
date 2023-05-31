'use client';

import { useRouter } from "next/navigation";

interface Props {
    error: any | null;
    msg: string | null;
    code: number | null;
}

export default function ErrorPage(props : Props) {
    const router = useRouter();
    return (
        <div className="flex flex-col content-center justify-center">
            <h1>{props.msg}</h1>
            <h2>{props.code}</h2>
            <h3>{props.error}</h3>
            <button
                type="button"
                className="w-40 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => {router.back();}}
            >
                뒤로
            </button>
        </div>
    );
}