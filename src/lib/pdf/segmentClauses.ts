export interface RawClause {
  index: number;
  heading: string | null;
  text: string;
}


export function segmentClauses(rawText: string, maxClauses = 40): RawClause[] {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const clauses: RawClause[] = [];
  let currentHeading: string | null = null;
  let currentChunks: string[] = [];

  const HEADING_RE = /^(\d+[\.\)]\s+[A-Z]|[A-Z][A-Z\s]{4,}$)/;

  const flush = () => {
    if (currentChunks.length > 0) {
      const text = currentChunks.join(" ").trim();
      if (text.length > 30) {
        clauses.push({ index: clauses.length, heading: currentHeading, text });
      }
      currentChunks = [];
    }
  };

  for (const line of lines) {
    if (HEADING_RE.test(line)) {
      flush();
      currentHeading = line;
    } else {
      currentChunks.push(line);
    }
  }
  flush();

  
  if (clauses.length < 3) {
    const paragraphs = rawText
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 30);
    return paragraphs.slice(0, maxClauses).map((text, index) => ({
      index,
      heading: null,
      text: text.trim(),
    }));
  }

  return clauses.slice(0, maxClauses);
}
