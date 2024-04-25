declare module "markdown-it-sub" {
  import MarkdownIt = require("markdown-it");
  const sub: (md: MarkdownIt) => void;
  export default sub;
}
