import {
  OrderedList,
  Heading,
  Para,
  BulletList,
  Str,
  ListItem,
  ThematicBreak,
  BlockQuote,
  CodeBlock,
  Table,
  Div,
  Row,
  Cell,
  Emph,
  Verbatim,
  HardBreak,
  SoftBreak,
  Link,
  Image,
  RawInline,
  Delete,
} from "@djot/djot/types/ast";
import { Token } from "markdown-it";

/**
 * @param token MarkdownIt Token
 * @returns DJot AST Node
 */
export function tokenToAstNode(token: Token): any {
  if (token.type === "paragraph_open") {
    return {
      tag: "para",
      children: [],
    } as Para;
  } else if (token.type === "heading_open") {
    return {
      tag: "heading",
      level: parseInt(token.tag.substring(1), 10),
      children: [],
    } as Heading;
  } else if (token.type === "ordered_list_open") {
    const start = token.attrGet("start");
    return {
      tag: "ordered_list",
      style: "1.",
      tight: true, // TODO
      start: start ? parseInt(start, 10) : undefined,
      children: [],
    } as OrderedList;
  } else if (token.type === "bullet_list_open") {
    return {
      tag: "bullet_list",
      tight: true, // TODO
      style: token.markup,
      children: [],
    } as BulletList;
  } else if (token.type === "list_item_open") {
    return {
      tag: "list_item",
      children: [],
    } as ListItem;
  } else if (token.type === "blockquote_open") {
    return {
      tag: "block_quote",
      children: [],
    } as BlockQuote;
  } else if (token.type === "code_block") {
    return {
      tag: "code_block",
      text: token.content,
    } as CodeBlock;
  } else if (token.type === "fence") {
    return {
      tag: "code_block",
      text: token.content,
      lang: token.info ?? undefined,
    } as CodeBlock;
  } else if (token.type === "hr") {
    return {
      tag: "thematic_break",
    } as ThematicBreak;
  } else if (token.type === "table_open") {
    return {
      tag: "table",
      children: [{ tag: "caption", children: [] }],
    } as Table;
  } else if (token.type === "tbody_open") {
    return { tag: "div", children: [] } as Div; // TODO
  } else if (token.type === "tr_open") {
    return {
      tag: "row",
      head: false, // TODO
      children: [],
    } as Row;
  } else if (token.type === "td_open") {
    return {
      tag: "cell",
      head: false, // TODO
      align: "default", // TODO
      children: [],
    } as Cell;

    // Inline tokens
  } else if (token.type === "text") {
    return {
      tag: "str",
      text: token.content,
    } as Str;
  } else if (token.type === "em_open") {
    return {
      tag: "emph",
    } as Emph;
  } else if (token.type === "s_open") {
    return {
      tag: "delete",
    } as Delete;
  } else if (token.type === "code_inline") {
    return {
      tag: "verbatim",
      text: token.content,
    } as Verbatim;
  } else if (token.type === "text_special") {
    return {
      tag: "str",
      text: token.content,
    } as Str;
  } else if (token.type === "hardbreak") {
    return {
      tag: "hard_break",
    } as HardBreak;
  } else if (token.type === "softbreak") {
    return {
      tag: "soft_break",
    } as SoftBreak;
  } else if (token.type === "link_open") {
    return {
      tag: "link",
      destination: token.attrGet("href"),
    } as Link;
  } else if (token.type === "image") {
    return {
      tag: "image",
      destination: token.attrGet("src"), // TODO: Alt
    } as Image;
  } else if (token.type === "html_inline") {
    return {
      tag: "raw_inline",
      format: "html",
      text: token.content,
    } as RawInline;
  } else {
    throw new Error(`Unknown markdown-it token type: ${JSON.stringify(token)}`);
  }
}
