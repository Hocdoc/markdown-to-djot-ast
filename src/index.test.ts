import { parseMarkdown } from "./index.js";
import { renderAST } from "@djot/djot";
import { readFileSync } from "fs";

describe("parseMarkdown", () => {
  it("should return a valid Djot AST", () => {
    const input = readFileSync("./examples/test.md", "utf8");
    const ast = parseMarkdown(input, { sourcePositions: true });

    const astString = renderAST(ast);
    expect(astString).toBeDefined();
    expect(astString).toContain("doc");
  });

  it("should handle GFM features and alerts by default", () => {
    const input = `
| Header |
| --- |
| Cell |

- [ ] Task
~~deleted~~
https://example.com

> [!NOTE]
> Info
`;
    const ast = parseMarkdown(input);
    const astString = renderAST(ast);
    
    expect(astString).toContain("table");
    expect(astString).toContain("task_list");
    expect(astString).toContain("delete");
    expect(astString).toContain("link");
    expect(astString).toContain("alert-note");
  });
});
