const MARKER = '%caudiences:';

export function log(...things: string[]): void {
  console.log(MARKER, 'color: blue; font-weight: bold;', ...things);
}
