import { assert, assertEquals, validateFactorySchema } from "../dev_deps.js";

import createFactory from "../mod.js";

const { test } = Deno;

test("should be a valid schema", () => {
  const factory = createFactory("foo");
  assert(validateFactorySchema(factory));
});

test("load - should return the aws object", () => {
  const factory = createFactory("foo");
  const res = factory.load();

  assert(res.aws);
  assert(res.aws.s3);
  assert(res.aws.factory);
});

test("load - should use provided credentials", async () => {
  const res = createFactory("foo", {
    awsAccessKeyId: "foo",
    awsSecretKey: "bar",
    awsRegion: "fizz",
  }).load();

  await res.aws.factory.ensureCredentialsAvailable();

  assert(true);
});

test("link - should return an adapter", () => {
  const factory = createFactory("foo");
  const adapter = factory.link({ aws: { s3: {} } })();

  assert(adapter);
  assertEquals(typeof adapter, "object");
});
