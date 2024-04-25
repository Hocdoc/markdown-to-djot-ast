import { parseMarkdown } from ".";
import { renderAST } from "@djot/djot";
import { readFileSync } from "fs";
import markdownit from "markdown-it";

const md = markdownit();

describe("parseMarkdown", () => {
  it("should return a valid Djot AST", () => {
    const input = readFileSync("./examples/test.md", "utf8");
    const ast = parseMarkdown(md, input, { sourcePositions: true });

    console.log(renderAST(ast));
    /*
    expect(ast).toEqual({
      tag: "doc",
      references: {},
      autoReferences: {},
      footnotes: {},
      children: [],
    });*/
  });
});
