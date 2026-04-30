import React, { useEffect, useState } from 'react';
import styles from './GifGallery.module.css';

interface GifItem {
  id: string;
  url: string;
  tags?: string[];
}

interface GifsData {
  intro?: GifItem[];
  success?: GifItem[];
  fail?: GifItem[];
}

function Section({ title, items }: { title: string; items: GifItem[] }) {
  return (
    <>
      <h2 className={styles.h2}>
        {title}
        <span className={styles.count}>{items.length}</span>
      </h2>
      <div className={styles.grid}>
        {items.map((gif) => (
          <div key={gif.id} className={styles.card}>
            <img
              src={gif.url}
              alt={gif.id}
              loading="lazy"
              className={styles.img}
              width={220}
              height={180}
            />
            <div className={styles.cardBody}>
              <div className={styles.cardId}>{gif.id}</div>
              <div className={styles.cardTags}>{(gif.tags || []).join(' · ')}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function GifGallery() {
  const [data, setData] = useState<GifsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/gifs')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<GifsData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className={styles.err}>Failed to load gifs: {error}</p>;
  }

  if (!data) {
    return <p className={styles.loading}>Loading…</p>;
  }

  const hasAny =
    (data.intro?.length ?? 0) + (data.success?.length ?? 0) + (data.fail?.length ?? 0) > 0;
  if (!hasAny) {
    return <p className={styles.err}>No GIF sections in payload.</p>;
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Rufus GIF Preview</h1>
      <p className={styles.subtitle}>Live from /api/gifs — reload after editing data/gifs.json</p>
      {data.intro?.length ? <Section title="Intro" items={data.intro} /> : null}
      {data.success?.length ? <Section title="Success" items={data.success} /> : null}
      {data.fail?.length ? <Section title="Fail" items={data.fail} /> : null}
    </div>
  );
}
