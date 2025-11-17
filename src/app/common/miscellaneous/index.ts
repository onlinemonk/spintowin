export const cx = (
  ...args: (string | undefined | null | false | (() => string))[]
) => {
  return args
    .map((arg) => (typeof arg === "function" ? arg() : arg))
    .filter(Boolean)
    .join(" ");
};
