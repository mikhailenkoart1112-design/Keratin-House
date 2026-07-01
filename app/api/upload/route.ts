import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({
        success: false,
        error: "GOOGLE_SCRIPT_URL is missing",
      });
    }

    const body = await request.json();

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "uploadImage",
        file: body.file,
        fileName: body.fileName,
        mimeType: body.mimeType,
      }),
    });

    const text = await response.text();

    console.log("UPLOAD RESPONSE:", text);

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({
        success: false,
        error: text,
      });
    }
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
