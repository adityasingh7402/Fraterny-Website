// src/utils/seo.ts
export function setMeta({
  title,
  description,
  canonical,
  robots = "index, follow",
}: {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
}) {
  if (title) document.title = title;

  // <meta name="description">
  let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!desc) {
    desc = document.createElement("meta");
    desc.name = "description";
    document.head.appendChild(desc);
  }
  desc.content = description || "";

  // <meta name="robots">
  let rb = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!rb) {
    rb = document.createElement("meta");
    rb.name = "robots";
    document.head.appendChild(rb);
  }
  rb.content = robots;

  // <link rel="canonical">
  const canonAll = Array.from(document.querySelectorAll('link[rel="canonical"]')) as HTMLLinkElement[];
  let canon = canonAll[0];
  if (!canon) {
    canon = document.createElement("link");
    canon.rel = "canonical";
    document.head.appendChild(canon);
  }
  canon.href = canonical;

  // clean accidental duplicates
  for (let i = 1; i < canonAll.length; i++) canonAll[i].remove();
}
