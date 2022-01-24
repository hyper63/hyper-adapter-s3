import { assertEquals } from "../../dev_deps.js";

import { hashBucketName, mapErr } from "../../lib/utils.js";

const { test } = Deno;

test("mapErr - should return the string", () => {
  const res = mapErr("foobar");

  assertEquals(res, "foobar");
});

test("mapErr - should return the error message", () => {
  const res = mapErr(new Error("foobar"));

  assertEquals(res, "foobar");
});

test("mapErr - should return the object message", () => {
  const res = mapErr({ message: "foobar" });

  assertEquals(res, "foobar");
});

test("mapErr - should return the stringified thing", () => {
  const res = mapErr({ foo: "bar" });

  assertEquals(res, JSON.stringify({ foo: "bar" }));
});

test("mapErr - should return generic message", () => {
  const res = mapErr(undefined);

  assertEquals(res, "An error occurred");
});

test("hashBucketName - should deterministically return a 40 character string", () => {
  const [first, long, short, duplicate] = [
    hashBucketName("poo", "foo", "bar"),
    hashBucketName(
      "poo",
      "areallyreallyreallylongstringomgthisissuchalongstringcoulditbeanylonger",
      "far",
    ),
    hashBucketName("poo", "", ""),
    hashBucketName("poo", "foo", "bar"),
  ];

  assertEquals(typeof first, "string");
  assertEquals(first.length, 40);
  assertEquals(long.length, 40);
  assertEquals(short.length, 40);
  assertEquals(duplicate, first);
});
