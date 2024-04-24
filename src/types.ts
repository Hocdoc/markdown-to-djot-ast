import { SourceLoc } from "@djot/djot";
import { ParseOptions } from "@djot/djot/types/parse";

export interface MarkdownParseOptions extends ParseOptions {}

// This class is copied from `djot.js/src/options.ts` as the class is not exported.
export class Warning {
  message: string;
  offset?: number;
  sourceLoc?: SourceLoc;
  constructor(message: string, pos?: number | SourceLoc) {
    this.message = message;
    if (typeof pos === "number") {
      this.offset = pos;
    } else if (pos && "line" in pos) {
      this.sourceLoc = pos;
      this.offset = pos.offset;
    }
  }
  render(): string {
    let result = this.message;
    if (this.sourceLoc) {
      result += ` at line ${this.sourceLoc.line}, col ${this.sourceLoc.col}`;
    } else if (this.offset) {
      result += ` at offset ${this.offset}`;
    }
    return result;
  }
}
