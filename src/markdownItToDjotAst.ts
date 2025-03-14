import { Doc, Block, Inline, Pos, Div } from "@djot/djot";
import { DEFAULT_TOKEN_HANDLERS } from "./tokenHandlers.js";
import { MarkdownParseOptions, Warning } from "./types.js";
import { Token } from "markdown-it/index.js";

type NodeWithChildren = {
  children: Block[] | Inline[];
};

export function markdownItToDjotAst(
  input: string,
  tokens: Token[],
  options?: MarkdownParseOptions
): Doc {
  const doc: Doc = {
    tag: "doc",
    references: {},
    autoReferences: {},
    footnotes: {},
    children: [],
  };

  const stack: (NodeWithChildren | undefined)[] = [];

  // Some tokens like thead_open should be ignored in Djot AST.
  // So we have to track the currentNodeOrUndefined and parentNode.
  let currentNodeOrUndefined: NodeWithChildren | undefined = doc;
  let parentNode: NodeWithChildren = doc;

  // Include inline tokens to the block tokens
  const flatTokens = tokens.flatMap((x) =>
    x.type === "inline" ? (x.children as Token[]) : x
  );

  const linestarts = options?.sourcePositions ? getLinestarts(input) : [];

  const tokenHandlers = {
    ...DEFAULT_TOKEN_HANDLERS,
    ...options?.tokenHandlers,
  };

  const createNode = (token: Token): any => {
    const pos = options?.sourcePositions
      ? getTokenPos(token, input, linestarts)
      : undefined;
    const handler = tokenHandlers[token.type];

    if (!handler && options?.warn) {
      options.warn(
        new Warning(
          `Unknown markdown-it token type: ${JSON.stringify(token)}`,
          pos?.start
        )
      );
    }

    const node = handler
      ? handler(token)
      : ({ tag: "div", children: [] } as Div);

    if (node) node.pos = pos;
    return node;
  };

  for (let i = 0; i < flatTokens.length; i++) {
    const token = flatTokens[i];

    if (token.nesting == 1) {
      const tmp = createNode(token);
      if (tmp) {
        parentNode.children.push(tmp);
        parentNode = tmp;
      }
      stack.push(currentNodeOrUndefined);
      currentNodeOrUndefined = tmp;
    } else if (token.nesting == -1) {
      const tmp = stack.pop() as NodeWithChildren | undefined;
      currentNodeOrUndefined = tmp;
      if (tmp) parentNode = tmp;
    } else if (token.nesting == 0) {
      const tmp = createNode(token);
      if (tmp) parentNode.children.push(tmp);
    }
  }

  return doc;
}

/** Get the offsets of every newline in the input for the source positions. */
function getLinestarts(input: string): number[] {
  const linestarts = [-1]; // Line numbers starts with 1 in djot
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "\n") {
      linestarts.push(i);
    }
  }

  return linestarts;
}

/**
 * Gets the Djot position from a markdown-it token.
 * MarkdownIt just gives us the zero based line number for block tokens.
 * Position numbers starts with 1 in djot.
 */
function getTokenPos(
  token: Token,
  input: string,
  linestarts: number[]
): Pos | undefined {
  if (!token.map) return undefined;

  const [startPos, endPos] = token.map;
  const startLine = startPos + 1;
  const endLine = endPos;
  const endOffset = (linestarts[endLine] ?? input.length + 1) - 1;
  return {
    start: { line: startLine, col: 1, offset: linestarts[startPos] + 1 },
    end: {
      line: endLine,
      col: endOffset - linestarts[endLine - 1],
      offset: endOffset,
    },
  };
}
