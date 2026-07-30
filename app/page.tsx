import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await list({ prefix: "releases/", limit: 100 });

  const releases = result.blobs
    .filter((blob) => blob.pathname.endsWith(".md"))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  return (
    <main>
      <section className="panel">
        <h1>Bit Automata Release Notes</h1>
        <p className="muted">Elenco pubblico delle release pubblicate.</p>

        <ul>
          {releases.map((blob) => {
            const version = blob.pathname.replace("releases/", "").replace(".md", "");
            return (
              <li key={blob.pathname}>
                <a href={`/releases/${version}.md`}>{version}</a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
