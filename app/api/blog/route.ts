import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        { success: false, message: "GOOGLE_SCRIPT_URL is missing" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const type = admin ? "blogAdmin" : "blog";

    const response = await fetch(`${process.env.GOOGLE_SCRIPT_URL}?type=${type}`, {
      method: "GET",
      cache: "no-store",
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
        action: "updateBlog",
        posts: body.posts || [],
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

