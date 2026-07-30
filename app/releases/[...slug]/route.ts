import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Context = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { slug } = await context.params;
  const requested = slug.join("/");

  if (!requested.endsWith(".md")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const version = requested.replace(/\.md$/, "");
  const pathname = `releases/${version}.md`;

  const result = await list({ prefix: pathname, limit: 1 });
  const blob = result.blobs.find((item) => item.pathname === pathname);

  if (!blob) {
    return new NextResponse("Release notes not found", { status: 404 });
  }

  const response = await fetch(blob.downloadUrl, { cache: "no-store" });

  if (!response.ok) {
    return new NextResponse("Release notes not readable", { status: 502 });
  }

  const markdown = await response.text();

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
