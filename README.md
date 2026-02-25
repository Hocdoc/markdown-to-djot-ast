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
import { parseMarkdown } from "markdown-to-djot-ast";
import { parse as parseDjot, renderAST } from "@djot/djot";

const input = readFileSync(filename, "utf8");

// Parse `*.md` files with the built-in GFM parser
// and `*.dj` files with djot.js:
const doc =
  path.extname(filename) === ".md"
    ? parseMarkdown(input, { sourcePositions: true })
    : parseDjot(input, { sourcePositions: true });

// Process Markdown and Djot in the same way, f.ex:
console.log(renderAST(doc));
```

## Features

By default, the library uses a pre-configured `markdown-it` instance that supports:
- **GFM (GitHub Flavored Markdown):** Tables, Task Lists, Strikethrough, and Autolinks.
- **GitHub Alerts:** `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.
- **Common Extensions:** Subscript, Superscript, Mark, and Insert.

## Advanced Configuration

You can still provide your own `markdown-it` instance if you need custom plugins or different settings:

```ts
import markdownit from "markdown-it";
import { parseMarkdown } from "markdown-to-djot-ast";

const md = markdownit({ html: false });
const ast = parseMarkdown(md, "# My Custom Parser");
```

## Custom token handler

You can provide a token handler to support custom `markdown-it` plugins:

```ts
parseMarkdown(input, {
  tokenHandlers: { mytoken_open: (token) => ({ tag: "div", children: [] }) },
});
```

## Handling of unsupported tokens

Unknown tokens will be converted into a `div` Djot node with a warning:

```ts
// Print all warnings to the console
parseMarkdown(input, {
  warn: console.warn,
});
```
