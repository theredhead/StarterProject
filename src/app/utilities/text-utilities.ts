//
// # Text Utilities
// ================
// The functions in this module are mainly geared towards search
//
// ## SearchText
// ------------
// A SearchText is a string that has one or more parts (needles)
// where for a (haystack) string to be a match, the haystack must
// contain all needles.
//
// ### Breaking up a searchText into needles
// a searchText is essentially a space delimited list of needles
// where every word is a needle, except where multiple words are
// quoted together.
//
// the searchText: there "once was" a "boy called Fred"
// contains the needles: there, once was, a, boy called Fred
//
// #### Other important notes:
// - needles and haystacks are normally compared in a case
//   insensitive manner.
// - needles never have leading or trailing whitespace
//
// The idea is to create a mini search language that can be easily
// applied to all kinds of entity collections.
//
// Future implementations may include:
// - if a searchtext is prefixed with a caret symbol it wull be
//   interpreted as a regular expression
// - if a needle starts with a propertyName immediately followed
//   by an equals sign, only that property will be taken into
//   account for that needle
// - if a needle is prefixed with an exclamation mark, the needle
//   must _not_ be present in the haystack
//

/**
 * Recursively converts properties to text for an object tree
 * essentially turning it into a text blob that can be used for
 * search
 *
 * @param obj
 * @param skipProperties
 */
export const objectToSearchableText = (
  obj: any,
  skipProperties: string[] = []
): string => {
  if (obj === undefined || obj === null) {
    return '';
  } else if (typeof obj === 'object') {
    const parts = [];
    for (const property of Object.keys(obj)) {
      if (!skipProperties.includes(property)) {
        parts.push(objectToSearchableText(obj[property], skipProperties));
      }
    }
    return parts.join(' ');
  } else if (Array.isArray(obj)) {
    return obj.join(' ');
  } else {
    return obj.toString();
  }
};

/**
 * Predicate that determines if a text matches all parts of a searchText
 *
 * @param text
 * @param searchText
 */
export const stringMatchesSearchtext = (
  text: string,
  searchText: string
): boolean => {
  if (searchText.length === 0) {
    return true;
  }

  const haystack = text.toLowerCase();
  const needles = splitSearchText(searchText);

  for (const needle of needles) {
    if (haystack.indexOf(needle) === -1) {
      return false;
    }
  }

  return true;
};

/**
 * Predicate that determines if a text haystack cointains all needles
 *
 * @param text
 * @param needles
 */
export const stringContainsAll = (
  text: string,
  needles: string[] = []
): boolean => {
  if (needles.length === 0) {
    return true;
  }

  const haystack = text.toLowerCase();

  for (const needle of needles) {
    if (haystack.indexOf(needle) === -1) {
      return false;
    }
  }

  return true;
};

/**
 * Predicate that determines if an object matches a searchText
 *
 * @param obj
 * @param searchText
 */
export const objectMatchesSearchtext = (
  obj: any,
  searchText: string
): boolean => {
  try {
    const text = objectToSearchableText(obj).toLowerCase();
    return stringMatchesSearchtext(text, searchText);
  } catch (e) {
    console.error('object_matches_searchtext', e);
  }
  return false;
};

/**
 * strip prefixes and suffixes from a string
 */
export const stripSurrounding = (
  s: string,
  prefix: string,
  suffix: string
): string => {
  let result = s;
  if (s.startsWith(prefix)) {
    result = result.substring(prefix.length);
  }
  if (s.endsWith(suffix)) {
    result = result.substring(0, result.length - suffix.length);
  }
  return result;
};

/**
 * Parses a searchText into individual "needles".
 *
 * used by objectMatchesSearchText
 */
export const splitSearchText = (searchText: string): string[] => {
  const QUOTE = '"';
  const SPACE = ' ';
  const needles = [];
  let quoted = false;
  let needle = '';

  for (const character of searchText) {
    if (character === QUOTE) {
      if (quoted) {
        needles.push(needle);
        needle = '';
        quoted = false;
      } else {
        quoted = true;
      }
    } else if (!quoted && character === SPACE) {
      needles.push(needle);
      needle = '';
    } else {
      needle = needle + character;
    }
  }
  needles.push(needle);
  return needles.filter((s) => s.length > 0);
};

/**
 * Filters a collection of objects returning only those entries that match a searchText
 *
 * @param collection
 * @param searchText
 */
export const filteredBySearchText = (
  collection: any[],
  searchText: string
): any[] => {
  if ((searchText ?? '').trim().length === 0) {
    return collection ?? [];
  }

  const needles = splitSearchText(searchText).map((s) => s.toLowerCase());
  if (needles.length === 0) {
    return collection ?? [];
  }

  return (collection ?? []).filter((o) =>
    stringContainsAll(objectToSearchableText(o), needles)
  );
};
