declare module "markdown-it-sub" {
  import MarkdownIt from "markdown-it";
  const sub: (md: MarkdownIt) => void;
  export default sub;
}

declare module "markdown-it-sup" {
  import MarkdownIt from "markdown-it";
  const sup: (md: MarkdownIt) => void;
  export default sup;
}

declare module "markdown-it-mark" {
  import MarkdownIt from "markdown-it";
  const mark: (md: MarkdownIt) => void;
  export default mark;
}

declare module "markdown-it-ins" {
  import MarkdownIt from "markdown-it";
  const ins: (md: MarkdownIt) => void;
  export default ins;
}
