const EMOJI: Record<string, string> = {
  guitar: "🎸",
  piano: "🎹",
  drums: "🥁",
  violin: "🎻",
  trumpet: "🎺",
  saxophone: "🎷",
};

/** Emoji for an instrument name, or a music note if we don't have one. */
export function instrumentEmoji(name: string): string {
  return EMOJI[name.trim().toLowerCase()] ?? "🎵";
}
