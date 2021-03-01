// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor = Function & { prototype: any };

const ok = () => {};
const fail = (msg: string) => {
  throw new Error(msg);
};

export const guard = (message: string) => ({
  enforce: (value: any) => ({
    isNotNull: () => (value !== null ? ok : fail(message)),
    isInstanceOf: (type: Constructor) =>
      value instanceof type ? ok : fail(message),
    isInArray: (arr: any[]) =>
      (arr ?? []).includes(value) ? ok : fail(message),
    isNotInArray: (arr: any[]) =>
      !(arr ?? []).includes(value) ? ok : fail(message),
    hasProperty: (name: string) =>
      !Object.getOwnPropertyNames(value).includes(name) ? ok : fail(message),
    containsKey: (key: string) =>
      (value ?? []).includes(key) || Object.keys(value ?? {}).includes(key)
        ? ok
        : fail(message),
  }),
});
