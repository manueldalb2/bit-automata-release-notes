import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Context = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { slug } = await context.params;
    const requested = slug.join("/");

    if (!requested.endsWith(".md")) {
      return new NextResponse("Not found", { status: 404 });
    }

    const version = requested.replace(/\.md$/, "");
    const pathname = `releases/${version}.md`;

    const result = await get(pathname, {
      access: "private",
      useCache: false
    });

    if (!result) {
      return new NextResponse("Release notes not found", { status: 404 });
    }

    const markdown = await new Response(result.stream).text();

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "cache-control": "public, max-age=60"
      }
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : String(error),
      { status: 500 }
    );
  }
}
