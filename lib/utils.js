import { crypto, R } from "../deps.js";

const { prop, cond, is, identity, T, complement, isNil, compose } = R;

export const mapErr = cond([
  [is(String), identity],
  [
    compose(
      complement(isNil),
      prop("message"),
    ), // catches both Error, and Object with message prop
    prop("message"),
  ],
  // TODO: Tyler. map an array recursively
  [complement(isNil), (val) => JSON.stringify(val)],
  [T, () => "An error occurred"],
]);

export const hashBucketName = (bucketPrefix, name) => {
  const hashBuffer = crypto.subtle.digestSync(
    "SHA-1",
    new TextEncoder().encode(`${bucketPrefix}-${name}`),
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray.map(
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");

  return hashHex;
};
