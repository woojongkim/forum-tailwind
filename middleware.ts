import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const needTokenPaths = [
    "/post/write",
    "/post/edit/*",
    "/post/delete/*",
    "/test",
    "/delete_comment"
];


const verifyToken = async (req : NextRequest) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const needToken = needTokenPaths.some((path) => {
        const pattern = path.replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(req.nextUrl.pathname);
    })

    if(!token && needToken){
        return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${req.nextUrl.pathname}`, req.url));
    }
};

export default verifyToken;