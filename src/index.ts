import { Doc } from "@djot/djot";
import MarkdownIt from "markdown-it";
import { markdownItToDjotAst } from "./markdownItToDjotAst.js";
import { MarkdownParseOptions } from "./types.js";
export * from "./markdownItToDjotAst.js";
export * from "./types.js";

export function parseMarkdown(
  md: MarkdownIt,
  input: string,
  options?: MarkdownParseOptions
): Doc {
  const tokens = md.parse(input, {});
  return markdownItToDjotAst(input, tokens, options);
}
