import { list } from "@vercel/blob";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ version: string }>;
};

async function getMarkdown(versionParam: string) {
  const version = versionParam.replace(/\.md$/, "");
  const pathname = `releases/${version}.md`;

  const result = await list({ prefix: pathname, limit: 1 });
  const blob = result.blobs.find((item) => item.pathname === pathname);

  if (!blob) {
    return null;
  }

  const response = await fetch(blob.downloadUrl, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }

  return {
    version,
    markdown: await response.text()
  };
}

export default async function ReleasePage({ params }: Props) {
  const { version } = await params;
  const release = await getMarkdown(version);

  if (!release) {
    notFound();
  }

  return (
    <main>
      <article>
        <p className="muted">Bit Automata release notes</p>
        <pre>{release.markdown}</pre>
      </article>
    </main>
  );
}
