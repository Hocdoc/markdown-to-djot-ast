declare module "markdown-it-sub" {
  import MarkdownIt = require("markdown-it");
  const sub: (md: MarkdownIt) => void;
  export default sub;
}

declare module "markdown-it-sup" {
  import MarkdownIt = require("markdown-it");
  const sup: (md: MarkdownIt) => void;
  export default sup;
}
