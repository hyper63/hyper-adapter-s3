import { ApiFactory, S3 } from "./deps.js";

import createAdapter from "./adapter.js";
import PORT_NAME from "./port_name.js";

export default (
  bucketPrefix,
  { awsAccessKeyId, awsSecretKey, awsRegion } = {},
) => ({
  id: "s3",
  port: PORT_NAME,
  load: () => {
    if (!bucketPrefix) {
      throw new Error("Unique bucket prefix is required");
    }
    const args = {};
    if (awsAccessKeyId && awsSecretKey) {
      awsRegion = awsRegion || "us-east-1";
      console.debug(
        "hyper-adapter-s3: Using credentials provided through args...",
      );
      args.credentials = {
        awsSecretKey,
        awsAccessKeyId,
        region: awsRegion,
      };
    } else {
      console.debug(
        "hyper-adapter-s3: All required credentials not provided. Will attempt to pull from environment...",
      );
    }

    /**
     * ApiFactory attempts to pull credentials from multiple environment places
     * If not provided via constructor
     * See https://github.com/cloudydeno/deno-aws_api/blob/2b8605516802c1b790a2b112c03b790feb3bf58f/lib/client/credentials.ts#L50
     */
    // TODO: Tyler. Use `await factory.ensureCredentialsAvailable();` when load() can return a Promise
    const factory = new ApiFactory(args);
    const s3 = new S3(factory);

    return {
      aws: {
        s3,
        factory,
      },
    };
  },
  link: ({ aws }) => (_) => createAdapter(bucketPrefix, aws),
});
