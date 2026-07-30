import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.RELEASE_NOTES_TOKEN;
  const auth = request.headers.get("authorization") || "";

  if (!expectedToken || auth !== `Bearer ${expectedToken}`) {
    return unauthorized();
  }

  const form = await request.formData();
  const version = String(form.get("version") || "").trim();
  const file = form.get("file");

  if (!/^\\d+\\.\\d+\\.\\d+[-\\w.]*$/.test(version)) {
    return NextResponse.json({ ok: false, error: "Invalid version" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const markdown = await file.text();
  const pathname = `releases/${version}.md`;

  const blob = await put(pathname, markdown, {
    access: "public",
    addRandomSuffix: false,
    contentType: "text/markdown; charset=utf-8"
  });

  return NextResponse.json({
    ok: true,
    version,
    pathname,
    url: blob.url,
    public_url: `https://releases.bit9.it/releases/${version}.md`
  });
}
