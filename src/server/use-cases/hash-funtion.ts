export const z = (x: string) => {
  const a = "ACCESS_KEY_8f3b8b320c4932bf5e2a1234abcd5678";
  const b = Buffer.from(a, "hex");
  const c = x + b.toString("base64");
  return c;
};
