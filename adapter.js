import { Buffer, crocks, R, readAll } from "./deps.js";

import * as lib from "./lib/s3.js";

import { hashBucketName, mapErr } from "./lib/utils.js";

const { Async } = crocks;
const { always, compose, prop, map, identity, path } = R;

/**
 * @typedef {Object} PutObjectArgs
 * @property {string} bucket
 * @property {string} object
 * @property {any} stream
 *
 * @typedef {Object} ObjectArgs
 * @property {string} bucket
 * @property {string} object
 *
 * @typedef {Object} ListObjectsArgs
 * @property {string} bucket
 * @property {string} [prefix]
 *
 * @typedef {Object} Msg
 * @property {string} [msg]
 *
 * @typedef {Object} Buckets
 * @property {string[]} buckets
 *
 * @typedef {Object} Objects
 * @property {string[]} objects
 *
 * @typedef {Object} ResponseOk
 * @property {boolean} ok
 *
 * @typedef {Msg & ResponseOk} ResponseMsg
 * @typedef {Buckets & ResponseOk} ResponseBuckets
 * @typedef {Objects & ResponseOk} ResponseObjects
 */

/**
 * the hashed name is sha1 which is 40 characters + "hyper-storage-" makes 54,
 * which falls within the acceptable range of s3 bucket name lengths (3-63)
 */
export const HYPER_BUCKET_PREFIX = "hyper-storage";

/**
 * @param {{ s3: any, factory: any }} aws
 * @returns
 */
export default function (bucketPrefix, aws) {
  const { s3 } = aws;

  const client = {
    makeBucket: Async.fromPromise(lib.makeBucket(s3)),
    removeBucket: Async.fromPromise(lib.removeBucket(s3)),
    listBuckets: Async.fromPromise(lib.listBuckets(s3)),
    putObject: Async.fromPromise(lib.putObject(s3)),
    removeObject: Async.fromPromise(lib.removeObject(s3)),
    getObject: Async.fromPromise(lib.getObject(s3)),
    listObjects: Async.fromPromise(lib.listObjects(s3)),
  };

  /**
   * @param {string} name
   * @returns {Promise<ResponseMsg>}
   */
  function makeBucket(name) {
    return client.makeBucket(
      `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, name)}`,
    )
      .bimap(
        mapErr,
        identity,
      ).bimap(
        (msg) => ({ ok: false, msg }),
        always({ ok: true }),
      ).toPromise();
  }

  /**
   * @param {string} name
   * @returns {Promise<ResponseMsg>}
   */
  function removeBucket(name) {
    return client.removeBucket(
      `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, name)}`,
    )
      .bimap(
        mapErr,
        identity,
      ).bimap(
        (msg) => ({ ok: false, msg }),
        always({ ok: true }),
      ).toPromise();
  }

  /**
   * @returns {Promise<ResponseBuckets>}
   *
   * TODO: Tyler. This was broken as part of work to hash
   * bucket names sent to AWS. This was done
   * to satisfy https://github.com/hyper63/hyper-adapter-s3/issues/4
   *
   * So for now, the names coming back will be the hashes generated. But
   * this isn't currently used by the hyper app, so shouldn't break hyper proper
   *
   * Possible solution: on bucket creation, add a statically named txt file (_metadata.txt) that contains
   * the actual name, then fetch that file, for each bucket, and extract the name
   */
  function listBuckets() {
    return client.listBuckets()
      .bimap(
        mapErr,
        compose(
          map(prop("Name")),
          prop("Buckets"),
        ),
      ).bimap(
        (msg) => ({ ok: false, msg }),
        (bucketNamesArr) => ({ ok: true, buckets: bucketNamesArr }),
      ).toPromise();
  }

  /**
   * @param {PutObjectArgs}
   * @returns {Promise<ResponseOk>}
   */
  async function putObject({ bucket, object, stream }) {
    const arrBuffer = await readAll(stream);

    return client.putObject({
      bucket: `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, bucket)}`,
      key: object,
      body: arrBuffer,
    })
      .bimap(
        mapErr,
        identity,
      ).bimap(
        (msg) => ({ ok: false, msg }),
        always({ ok: true }),
      ).toPromise();
  }

  /**
   * @param {ObjectArgs}
   * @returns {Promise<ResponseOk>}
   */
  function removeObject({ bucket, object }) {
    return client.removeObject({
      bucket: `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, bucket)}`,
      key: object,
    })
      .bimap(
        mapErr,
        identity,
      ).bimap(
        (msg) => ({ ok: false, msg }),
        always({ ok: true }),
      ).toPromise();
  }

  /**
   * @param {ObjectArgs}
   * @returns {Promise<Buffer>}
   */
  function getObject({ bucket, object }) {
    return client.getObject({
      bucket: `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, bucket)}`,
      key: object,
    })
      .bimap(
        mapErr,
        path(["Body", "buffer"]),
      ).bimap(
        (msg) => ({ ok: false, msg }),
        (arrayBuffer) => new Buffer(arrayBuffer),
      ).toPromise();
  }

  /**
   * @param {ListObjectsArgs}
   * @returns {Promise<ResponseObjects>}
   */
  function listObjects({ bucket, prefix }) {
    return client.listObjects({
      bucket: `${HYPER_BUCKET_PREFIX}-${hashBucketName(bucketPrefix, bucket)}`,
      prefix,
    })
      .bimap(
        mapErr,
        compose(
          map(prop("Key")),
          prop("Contents"),
        ),
      ).bimap(
        (msg) => ({ ok: false, msg }),
        (objectNamesArr) => ({ ok: true, objects: objectNamesArr }),
      ).toPromise();
  }

  return Object.freeze({
    makeBucket,
    removeBucket,
    listBuckets,
    putObject,
    removeObject,
    getObject,
    listObjects,
  });
}
