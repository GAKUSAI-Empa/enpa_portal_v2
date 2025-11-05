// app/api/tool07/route.ts
;
import FTPClient from "basic-ftp";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * GET /api/tool07/settings
 * → Proxy đến FastAPI /api/tool07/settings (GET)
 */
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/tool07/settings`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("GET /tool07/settings failed:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 500 });
  }
}

/**
 * POST /api/tool07/settings
 * → Proxy đến FastAPI /api/tool07/settings (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/tool07/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("POST /tool07/settings failed:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 500 });
  }
}
