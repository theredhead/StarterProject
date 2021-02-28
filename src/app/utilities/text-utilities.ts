/* eslint-disable @typescript-eslint/naming-convention */

export const object_to_searchable_text = (obj: any): string => {
  if (obj === undefined || obj === null) {
    return '';
  } else if (typeof obj === 'object') {
    const parts = [];
    for (const property of Object.keys(obj)) {
      parts.push(object_to_searchable_text(obj[property]));
    }
    return parts.join(' ');
  } else if (Array.isArray(obj)) {
    return obj.join(' ');
  } else {
    return obj.toString();
  }
};

export const text_contains_all = (
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

export const object_matches_searchtext = (
  obj: any,
  searchText: string
): boolean => {
  try {
    const text = object_to_searchable_text(obj).toLowerCase();
    return text_contains_all(text, searchText);
  } catch (e) {
    console.error('object_matches_searchtext', e);
  }
  return false;
};

export const stripSurrounding = (
  s: string,
  atStart: string,
  atEnd: string
): string => {
  let result = s;
  if (s.startsWith(atStart)) {
    result = result.substring(atStart.length);
  }
  if (s.endsWith(atEnd)) {
    result = result.substring(0, result.length - atEnd.length);
  }
  return result;
};

export const splitSearchText = (searchText: string) => {
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
  if (quoted) {
    needles.push(needle);
  }
  return needles.filter((s) => s.length > 0);
};
