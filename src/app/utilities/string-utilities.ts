export const stripPrefix = (fromString: string, prefix: string): string => {
  if (fromString.startsWith(prefix)) {
    return fromString.substr(prefix.length, fromString.length - prefix.length);
  }
  return fromString;
};

export const stripSuffix = (fromString: string, suffix: string): string => {
  if (fromString.endsWith(suffix)) {
    return fromString.substr(0, fromString.length - suffix.length);
  }
  return fromString;
};

export type EscapeFunc = (char: string) => string;
export const makeEscapeFunc = (charsToEscape: string[], escapeChar: string) => (
  char: string
) => (charsToEscape.includes(char) ? escapeChar + char : char);

export const escapeDoubleQuotesWithSlashes = makeEscapeFunc(['"'], '\\');
export const escapeDoubleQuotesByDoublingUp = makeEscapeFunc(['"'], '"');
export interface QuotingOptions {
  openQuote: string;
  closeQuote: string;
  escape: boolean;
  escapeFn: EscapeFunc;
}
export const quote = (
  aString: string,
  options: QuotingOptions = {
    openQuote: '"',
    closeQuote: '"',
    escape: true,
    escapeFn: escapeDoubleQuotesWithSlashes,
  }
): string => {
  if (options.escape) {
    const characters = [];
    for (const char of aString) {
      characters.push(options.escapeFn(char));
    }
    return [options.openQuote, ...characters, options.closeQuote].join('');
  }
  return [options.openQuote, aString, options.closeQuote].join('');
};

export const unquote = (
  quotedString: string,
  openQuote: string = '"',
  closeQuote: string = openQuote
): string => stripSuffix(stripPrefix(quotedString, openQuote), closeQuote);
