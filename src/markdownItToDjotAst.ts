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

  let inThead = false;

  const createNode = (token: Token, previousToken: Token | undefined): any => {
    const pos = options?.sourcePositions
      ? getTokenPos(token, input, linestarts, previousToken)
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
    const previousToken = i > 0 ? flatTokens[i - 1] : undefined;

    if (token.type === "thead_open") inThead = true;
    if (token.type === "thead_close") inThead = false;

    if (token.nesting == 1) {
      const tmp = createNode(token, previousToken);
      if (tmp) {
        if (tmp.tag === "row" && inThead) {
          tmp.head = true;
        }
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
      if (token.type === "checkbox_input") {
        const checked = token.attrGet("checked");
        // Search up the stack for task_list_item
        if (currentNodeOrUndefined && (currentNodeOrUndefined as any).tag === "task_list_item") {
          (currentNodeOrUndefined as any).checkbox = checked ? "checked" : "unchecked";
        } else {
          for (let j = stack.length - 1; j >= 0; j--) {
            const node = stack[j];
            if (node && (node as any).tag === "task_list_item") {
              (node as any).checkbox = checked ? "checked" : "unchecked";
              break;
            }
          }
        }

        // Trim space from next text token if it exists (usually added by the tasklist plugin)
        for (let j = i + 1; j < flatTokens.length; j++) {
          const nextToken = flatTokens[j];
          if (nextToken.type === "text") {
            if (nextToken.content.startsWith(" ")) {
              nextToken.content = nextToken.content.substring(1);
            }
            break;
          }
          // Skip label_open and other potential wrappers
          if (nextToken.type !== "label_open") break;
        }
      } else {
        const tmp = createNode(token, previousToken);
        if (tmp) parentNode.children.push(tmp);
      }
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
  linestarts: number[],
  previousToken: Token | undefined
): Pos | undefined {
  if (!token.map) return undefined;

  const [startPos, endPos] = token.map;

  let startLine = startPos + 1;
  const endLine = endPos;

  // Markdown-it takes the last character before the newline as start line of the next token.
  // So we have to adjust the start line for block tokens. 
  if (startPos < endPos && previousToken) {
    const previousEndLine = previousToken.map?.[1];
    startLine = previousEndLine + 1;
  }

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
