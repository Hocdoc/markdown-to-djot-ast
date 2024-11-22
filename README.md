# markdown-to-djot-ast

markdown-to-djot-ast is a lightweight Javascript/Typescript library to convert Markdown content into a [djot.js](https://github.com/jgm/djot.js) AST.

This is useful for supporting Djot and Markdown files, offering consistent filtering and rendering processes across formats.

The library leverages the famous [markdown-it](https://markdown-it.github.io/) package to parse Markdown content to tokens. The tokens are subsequently transformed into a [Djot.js AST](https://github.com/jgm/djot.js/blob/main/src/ast.ts).

## Install

```
npm install markdown-to-djot-ast
```

## Use

```ts
import { readFileSync } from "fs";
import * as path from "path";
import markdownit from "markdown-it";
import { parseMarkdown } from "markdown-to-djot-ast";
import { parse as parseDjot, renderAST } from "@djot/djot";

const md = markdownit();
const input = readFileSync(filename, "utf8");

// Parse `*.md` files with markdown-it and `*.dj` files with djot.js:
const doc =
  path.extname(filename) === ".md"
    ? parseMarkdown(md, input, { sourcePositions: true })
    : parseDjot(input, { sourcePositions: true });

// Process Markdown and Djot in the same way, f.ex:
console.log(renderAST(doc));
```

## Supported markdown-it plugins

- [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub)
- [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup)
- [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)
- [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins)
- [@mdit/plugin-alert](https://mdit-plugins.github.io/alert.html)
- [markdown-it-deflist](https://github.com/markdown-it/markdown-it-deflist)
- Math Plugins (`math_inline`, `math_block`)

## Custom token handler

You can provide a token handler to `parseMarkdown` to support custom markdown-it plugins.

```ts
parseMarkdown(md, input, {
  tokenHandlers: { mytoken_open: (token) => ({ tag: "div", children: [] }) },
});
```

## Handling of unsupported tokens

Unknown tokens will be converted into a `Div` Djot node with a warning:

```ts
// Print all warnings to the console
parseMarkdown(md, input, {
  warn: console.warn,
});
```
