import { readFileSync } from "fs";
import * as path from "path";
import markdownit from "markdown-it";
import { parseMarkdown } from "../src/main";
import { parse as parseDjot, renderAST } from "@djot/djot";

/** Example to print an djot.js-AST from markdown and Djot files. */

const md = markdownit();

if (process.argv.length !== 3) {
  console.error("USAGE: printAst <filename.(md|dj)>");
  process.exit(1);
}

const filename = process.argv[2];
const input = readFileSync(filename, "utf8");

const doc =
  path.extname(filename) === ".md"
    ? parseMarkdown(md, input, { sourcePositions: true })
    : parseDjot(input, { sourcePositions: true });

console.log(renderAST(doc));
