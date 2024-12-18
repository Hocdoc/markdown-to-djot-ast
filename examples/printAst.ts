import { readFileSync } from "fs";
import * as path from "path";
import markdownit from "markdown-it";
import markdownitSub from "markdown-it-sub";
import markdownitSup from "markdown-it-sup";
import markdownitMark from "markdown-it-mark";
import markdownitIns from "markdown-it-ins";
import { alert } from "@mdit/plugin-alert";
import { MarkdownParseOptions, parseMarkdown } from "../src/index.js";
import { parse as parseDjot, renderAST } from "@djot/djot";

/** Example to print an djot.js-AST from markdown and Djot files. */

const md = markdownit()
  .use(markdownitSub)
  .use(markdownitSup)
  .use(markdownitMark)
  .use(markdownitIns)
  .use(alert as any);
if (process.argv.length !== 3) {
  console.error("USAGE: printAst <filename.(md|dj)>");
  process.exit(1);
}

const filename = process.argv[2] ?? "";
const input = readFileSync(filename, "utf8");

const options: MarkdownParseOptions = {
  sourcePositions: true,
  warn: console.warn,
};

const doc =
  path.extname(filename) === ".md"
    ? parseMarkdown(md, input, options)
    : parseDjot(input, options);

console.log(renderAST(doc));
