import { getUploadAuthParams } from "@imagekit/next/server";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

// const imagekit = new ImageKit({
//     publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
//     urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
// })

export async function GET() {
    try {
        // const imagekitAuth = imagekit.getAuthenticationParameters()
        // return NextResponse.json(imagekitAuth)
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
        })
        return Response.json({
            authenticationParameters,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        })
    } catch (error) {
        return NextResponse.json(
            { error: "image kit auth failed" },
            { status: 500 }
        )
    }
}
