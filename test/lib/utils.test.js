import { assertEquals } from "../../dev_deps.js";

import { mapErr } from "../../lib/utils.js";

const { test } = Deno;

test("should return the string", () => {
  const res = mapErr("foobar");

  assertEquals(res, "foobar");
});

test("should return the error message", () => {
  const res = mapErr(new Error("foobar"));

  assertEquals(res, "foobar");
});

test("should return the object message", () => {
  const res = mapErr({ message: "foobar" });

  assertEquals(res, "foobar");
});

test("should return the stringified thing", () => {
  const res = mapErr({ foo: "bar" });

  assertEquals(res, JSON.stringify({ foo: "bar" }));
});

test("should return generic message", () => {
  const res = mapErr(undefined);

  assertEquals(res, "An error occurred");
});
