import { R } from "../deps.js";

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
