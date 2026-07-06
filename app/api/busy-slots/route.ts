import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

type BusySlotBody = {
  id?: string;
  date?: string;
  time?: string;
  reason?: string;
  active?: boolean;
};

async function callGoogleScript(payload: Record<string, unknown>) {
  if (!GOOGLE_SCRIPT_URL) {
    return {
      success: false,
      message: "GOOGLE_SCRIPT_URL is not set",
    };
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: "Invalid Google Script response",
      raw: text,
    };
  }
}

function makeId() {
  return `busy-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function GET() {
  try {
    const result = await callGoogleScript({
      action: "getBusySlots",
    });

    const busySlots =
      result.busySlots || result.data || result.items || result.slots || [];

    return NextResponse.json({
      success: Boolean(result.success),
      busySlots: Array.isArray(busySlots) ? busySlots : [],
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        busySlots: [],
        message: "Не вдалося отримати зайняті дати.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BusySlotBody;

    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();
    const reason = String(body.reason || "Зайнято").trim();

    if (!date || !time) {
      return NextResponse.json(
        {
          success: false,
          message: "Дата і час обовʼязкові.",
        },
        { status: 400 }
      );
    }

    const result = await callGoogleScript({
      action: "addBusySlot",
      id: body.id || makeId(),
      date,
      time,
      reason,
      active: body.active ?? true,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Не вдалося зберегти зайнятий слот.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID обовʼязковий.",
        },
        { status: 400 }
      );
    }

    const result = await callGoogleScript({
      action: "deleteBusySlot",
      id,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Не вдалося видалити зайнятий слот.",
      },
      { status: 500 }
    );
  }
}