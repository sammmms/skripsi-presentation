import { Fragment } from 'react'

/** Splits inline pseudo-markdown into typed tokens and renders them as spans.
 *  Supports **bold**, *italic*, and `code`. No dangerouslySetInnerHTML. */

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'italic'; value: string }
  | { kind: 'code'; value: string }

/** Order matters: code first (so `**` inside backticks stays literal),
 *  then bold (double star) before italic (single star). */
const PATTERN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0
  for (const match of text.matchAll(PATTERN)) {
    const start = match.index ?? 0
    if (start > lastIndex) {
      tokens.push({ kind: 'text', value: text.slice(lastIndex, start) })
    }
    const chunk = match[0]
    if (chunk.startsWith('`')) {
      tokens.push({ kind: 'code', value: chunk.slice(1, -1) })
    } else if (chunk.startsWith('**')) {
      tokens.push({ kind: 'bold', value: chunk.slice(2, -2) })
    } else {
      tokens.push({ kind: 'italic', value: chunk.slice(1, -1) })
    }
    lastIndex = start + chunk.length
  }
  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', value: text.slice(lastIndex) })
  }
  return tokens
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const tokens = tokenize(text)
  return (
    <span className={className}>
      {tokens.map((token, i) => {
        switch (token.kind) {
          case 'bold':
            return (
              <strong key={i} className="font-semibold text-ink">
                {token.value}
              </strong>
            )
          case 'italic':
            return (
              <em key={i} className="italic">
                {token.value}
              </em>
            )
          case 'code':
            return (
              <code
                key={i}
                className="mx-0.5 rounded-md bg-surface-3/70 px-1.5 py-0.5 font-mono text-[0.85em] text-spatial-soft"
              >
                {token.value}
              </code>
            )
          default:
            return <Fragment key={i}>{token.value}</Fragment>
        }
      })}
    </span>
  )
}
