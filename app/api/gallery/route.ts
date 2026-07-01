import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        { success: false, message: "GOOGLE_SCRIPT_URL is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${process.env.GOOGLE_SCRIPT_URL}?type=gallery`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        { success: false, message: "GOOGLE_SCRIPT_URL is missing" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "updateGallery",
        gallery: body.gallery || [],
      }),
    });

    const text = await response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

