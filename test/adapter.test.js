import {
  assert,
  assertEquals,
  spy,
  validateStorageAdapterSchema,
} from "../dev_deps.js";

import { Buffer } from "../deps.js";

import adapterBuilder from "../adapter.js";

const resolves = (val) => () => Promise.resolve(val);
const rejects = (val) => () => Promise.reject(val);

// mock client
const client = {};

const adapter = adapterBuilder("foo", { s3: client });

const { test } = Deno;

test("should implement the port", () => {
  assert(validateStorageAdapterSchema(adapter));
});

test("makeBucket - make a bucket and return the correct shape", async () => {
  client.createBucket = spy(resolves());
  const res = await adapter.makeBucket("foo");

  assert(res.ok);
});

test("makeBucket - fail to create a bucket and return correct shape", async () => {
  client.createBucket = spy(rejects(new Error("foo")));

  try {
    await adapter.makeBucket("bar");
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("removeBucket - remove a bucket and return the correct shape", async () => {
  client.deleteBucket = spy(resolves());
  const res = await adapter.removeBucket("foo");

  assert(res.ok);
});

test("removeBucket - fail to remove a bucket and return correct shape", async () => {
  client.deleteBucket = spy(rejects(new Error("foo")));

  try {
    await adapter.removeBucket("bar");
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("listBuckets - return the correct shape", async () => {
  client.listBuckets = spy(
    resolves({ Buckets: [{ Name: "foo" }, { Name: "bar" }] }),
  );
  const res = await adapter.listBuckets();

  assert(res.ok);
  assertEquals(res.buckets, ["foo", "bar"]);
});

test("listBuckets - fail and return correct shape", async () => {
  client.deleteBucket = spy(rejects(new Error("foo")));

  try {
    await adapter.removeBucket("bar");
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("putObject - return the correct shape", async () => {
  client.putObject = spy(({ body }) => Promise.resolve(body));
  const res = await adapter.putObject({
    bucket: "foo",
    object: "bar.jpg",
    stream: new Buffer(new Uint8Array(4).buffer),
  });

  assert(res.ok);
});

test("putObject - fail and return correct shape", async () => {
  client.putObject = spy(rejects(new Error("foo")));

  try {
    await adapter.putObject({
      bucket: "foo",
      object: "bar.jpg",
      stream: new Buffer(new Uint8Array(4).buffer),
    });
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("removeObject - return the correct shape", async () => {
  client.deleteObject = spy(resolves());
  const res = await adapter.removeObject({
    bucket: "foo",
    object: "bar.jpg",
  });

  assert(res.ok);
});

test("removeObject - fail and return correct shape", async () => {
  client.deleteObject = spy(rejects(new Error("foo")));

  try {
    await adapter.removeObject({
      bucket: "foo",
      object: "bar.jpg",
    });
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("getObject - return the correct shape", async () => {
  const reader = new Buffer(new Uint8Array(4));
  client.getObject = spy(resolves({ Body: { buffer: reader } }));
  const res = await adapter.getObject({
    bucket: "foo",
    object: "bar.jpg",
  });

  assert(res.read);
  assertEquals(res.length, reader.length);
});

test("getObject - fail and return correct shape", async () => {
  client.getObject = spy(rejects(new Error("foo")));

  try {
    await adapter.getObject({
      bucket: "foo",
      object: "bar.jpg",
    });
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});

test("listObjects - return the correct shape", async () => {
  client.listObjects = spy(
    resolves({ Contents: [{ Key: "foo" }, { Key: "bar" }] }),
  );
  const res = await adapter.listObjects({
    bucket: "foo",
    prefix: "bar",
  });

  assert(res.ok);
  assertEquals(res.objects, ["foo", "bar"]);
});

test("listObjects - fail and return correct shape", async () => {
  client.listObjects = spy(rejects(new Error("foo")));

  try {
    await adapter.listObjects({
      bucket: "foo",
      prefix: "bar",
    });
    assert(false);
  } catch (err) {
    assertEquals(err.ok, false);
    assertEquals(err.msg, "foo");
  }
});
