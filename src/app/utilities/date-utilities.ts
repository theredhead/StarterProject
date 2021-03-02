export const dateCorrectedForTimezoneOffset = (date: Date): Date =>
  date instanceof Date
    ? new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    : null;

export const dateOnly = (date: Date): string =>
  dateCorrectedForTimezoneOffset(date)?.toJSON().split('T').shift();
