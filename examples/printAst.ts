import { readFileSync } from "fs";
import * as path from "path";
import { MarkdownParseOptions, parseMarkdown } from "../src/index.js";
import { parse as parseDjot, renderAST } from "@djot/djot";

/** Example to print an djot.js-AST from markdown and Djot files. */

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
    ? parseMarkdown(input, options)
    : parseDjot(input, options);

console.log(renderAST(doc));
