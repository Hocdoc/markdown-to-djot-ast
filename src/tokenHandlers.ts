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
  BulletListStyle,
  Subscript,
  Alignment,
  Superscript,
  Mark,
  Insert,
} from "@djot/djot/types/ast";
import { Token } from "markdown-it";
import { TokenHandlersRecord } from "./types";

export const DEFAULT_TOKEN_HANDLERS: TokenHandlersRecord = {
  // Block tokens
  paragraph_open,
  heading_open,
  ordered_list_open,
  bullet_list_open,
  list_item_open,
  blockquote_open,
  code_block,
  fence,
  hr,
  table_open,
  thead_open,
  tbody_open,
  tr_open,
  th_open,
  td_open,

  // Inline tokens
  text,
  em_open,
  s_open,
  code_inline,
  text_special,
  hardbreak,
  softbreak,
  link_open,
  image,
  html_inline,

  // Plugins
  sub_open, // markdown-it-sub
  sup_open, // markdown-it-sup
  mark_open, // markdown-it-mark
  ins_open, // markdown-it-ins
};

function paragraph_open(): Para {
  return {
    tag: "para",
    children: [],
  };
}

function heading_open(token: Token): Heading {
  return {
    tag: "heading",
    level: parseInt(token.tag.substring(1), 10),
    children: [],
  };
}

function ordered_list_open(token: Token): OrderedList {
  const start = token.attrGet("start");
  return {
    tag: "ordered_list",
    style: "1.",
    tight: true, // TODO
    start: start ? parseInt(start, 10) : undefined,
    children: [],
  };
}

function bullet_list_open(token: Token): BulletList {
  return {
    tag: "bullet_list",
    tight: true, // TODO
    style: token.markup as BulletListStyle,
    children: [],
  };
}

function list_item_open(): ListItem {
  return {
    tag: "list_item",
    children: [],
  };
}
function blockquote_open(): BlockQuote {
  return {
    tag: "block_quote",
    children: [],
  };
}

function code_block(token: Token): CodeBlock {
  return {
    tag: "code_block",
    text: token.content,
  };
}

function fence(token: Token): CodeBlock {
  return {
    tag: "code_block",
    text: token.content,
    lang: token.info ?? undefined,
  };
}

function hr(): ThematicBreak {
  return {
    tag: "thematic_break",
  };
}

function table_open(token: Token): Table {
  return {
    tag: "table",
    children: [{ tag: "caption", children: [] }],
  };
}

/** <thead> is not in the Djot AST */
function thead_open(): undefined {
  return undefined;
}

/** <tbody> is not in the Djot AST */
function tbody_open(): undefined {
  return undefined;
}

function tr_open(): Row {
  return {
    tag: "row",
    head: false, // TODO
    children: [],
  };
}

function th_open(token: Token): Cell {
  return {
    tag: "cell",
    head: true,
    align: getCellAlignment(token),
    children: [],
  };
}

function td_open(token: Token): Cell {
  return {
    tag: "cell",
    head: false,
    align: getCellAlignment(token),
    children: [],
  };
}

function getCellAlignment(token: Token): Alignment {
  const style = token.attrGet("style");
  if (style === "text-align:center") {
    return "center";
  } else if (style === "text-align:right") {
    return "right";
  } else {
    return "default";
  }
}

function text(token: Token): Str {
  return {
    tag: "str",
    text: token.content,
  };
}

function em_open(): Emph {
  return {
    tag: "emph",
    children: [],
  };
}

function s_open(): Delete {
  return {
    tag: "delete",
    children: [],
  };
}

function code_inline(token: Token): Verbatim {
  return {
    tag: "verbatim",
    text: token.content,
  };
}
function text_special(token: Token): Str {
  return {
    tag: "str",
    text: token.content,
  };
}

function hardbreak(): HardBreak {
  return {
    tag: "hard_break",
  };
}

function softbreak(): SoftBreak {
  return {
    tag: "soft_break",
  };
}

function link_open(token: Token): Link {
  return {
    tag: "link",
    destination: token.attrGet("href") || undefined,
    children: [],
  };
}

function image(token: Token): Image {
  return {
    tag: "image",
    destination: token.attrGet("src") || undefined,
    attributes: { alt: token.attrGet("title") ?? "" }, // TODO: Does markdown-it ignore the alt text?
    children: [],
  };
}

function html_inline(token: Token): RawInline {
  return {
    tag: "raw_inline",
    format: "html",
    text: token.content,
  };
}

function sub_open(): Subscript {
  return {
    tag: "subscript",
    children: [],
  };
}

function sup_open(): Superscript {
  return {
    tag: "superscript",
    children: [],
  };
}

function mark_open(): Mark {
  return {
    tag: "mark",
    children: [],
  };
}

function ins_open(): Insert {
  return {
    tag: "insert",
    children: [],
  };
}
