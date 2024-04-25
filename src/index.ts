import { Doc } from "@djot/djot";
import { markdownItToDjotAst } from "./markdownItToDjotAst";
import { MarkdownParseOptions } from "./types";
export * from "./markdownItToDjotAst";
export * from "./types";

export function parseMarkdown(
  md: MarkdownIt,
  input: string,
  options?: MarkdownParseOptions
): Doc {
  const tokens = md.parse(input, {});
  return markdownItToDjotAst(input, tokens, options);
}
