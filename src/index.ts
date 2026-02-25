import { Doc } from "@djot/djot";
import MarkdownIt from "markdown-it";
import markdownitSub from "markdown-it-sub";
import markdownitSup from "markdown-it-sup";
import markdownitMark from "markdown-it-mark";
import markdownitIns from "markdown-it-ins";
import markdownitFootnote from "markdown-it-footnote";
import { alert } from "@mdit/plugin-alert";
import { tasklist } from "@mdit/plugin-tasklist";
import { markdownItToDjotAst } from "./markdownItToDjotAst.js";
import { MarkdownParseOptions } from "./types.js";
export * from "./markdownItToDjotAst.js";
export * from "./types.js";

/**
 * Creates a default MarkdownIt instance with GFM-like extensions and GitHub alerts.
 */
export function createDefaultMarkdownIt(): MarkdownIt {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownitSub)
    .use(markdownitSup)
    .use(markdownitMark)
    .use(markdownitIns)
    .use(markdownitFootnote)
    .use(alert as any)
    .use(tasklist as any);
}

const defaultMd = createDefaultMarkdownIt();

/**
 * Parses markdown into a Djot AST.
 * @param md The MarkdownIt instance to use (optional, defaults to a pre-configured GFM-compatible instance)
 * @param input The markdown input string
 * @param options Parse options
 */
export function parseMarkdown(
  md: MarkdownIt,
  input: string,
  options?: MarkdownParseOptions
): Doc;
export function parseMarkdown(
  input: string,
  options?: MarkdownParseOptions
): Doc;
export function parseMarkdown(
  mdOrInput: MarkdownIt | string,
  inputOrOptions?: string | MarkdownParseOptions,
  options?: MarkdownParseOptions
): Doc {
  let md: MarkdownIt;
  let input: string;
  let opt: MarkdownParseOptions | undefined;

  if (typeof mdOrInput === "string") {
    md = defaultMd;
    input = mdOrInput;
    opt = inputOrOptions as MarkdownParseOptions | undefined;
  } else {
    md = mdOrInput;
    input = inputOrOptions as string;
    opt = options;
  }

  const tokens = md.parse(input, {});
  return markdownItToDjotAst(input, tokens, opt);
}
