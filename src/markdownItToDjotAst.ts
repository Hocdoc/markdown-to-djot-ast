import { Doc, Block, Inline, Pos } from "@djot/djot/types/ast";
import { Token } from "markdown-it";
import { tokenToAstNode } from "./tokenToAstNode";
import { MarkdownParseOptions } from "./types";

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

  const stack: NodeWithChildren[] = [];
  let currentNode: NodeWithChildren = doc;

  // Include inline tokens to the block tokens
  const flatTokens = tokens.flatMap((x) =>
    x.type === "inline" ? (x.children as Token[]) : x
  );

  const linestarts = options?.sourcePositions ? getLinestarts(input) : [];

  const createNode = (token: Token) => {
    const pos = options?.sourcePositions
      ? getTokenPos(token, input, linestarts)
      : undefined;
    const node = tokenToAstNode(token, options, pos);
    if (node) {
      node.pos = pos;
    }

    return node;
  };

  for (let i = 0; i < flatTokens.length; i++) {
    const token = flatTokens[i];

    if (token.nesting == 1) {
      const tmp = createNode(token);
      tmp.children = [];
      currentNode.children.push(tmp);
      stack.push(currentNode);
      currentNode = tmp;
    } else if (token.nesting == -1) {
      const tmp = stack.pop() as NodeWithChildren;
      currentNode = tmp;
    } else if (token.nesting == 0) {
      const tmp = createNode(token);
      currentNode.children.push(tmp);
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
  const endLine = endPos + 1;
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
