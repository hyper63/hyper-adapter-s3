> :warning: This adapter is deprecated and will no longer receive updates. If you're looking for an S3 adapter, then consider using the [hyper Storage MinIO Adapter](https://github.com/hyper63/hyper-adapter-minio)
 which is up to date, and more flexible and configurable.

<h1 align="center">hyper-adapter-s3</h1>
<p align="center">A Storage port adapter that uses AWS S3 for object storage in the <a href="https://hyper.io/">hyper</a>  service framework</p>
</p>
<p align="center">
  <a href="https://nest.land/package/hyper-adapter-s3"><img src="https://nest.land/badge.svg" alt="Nest Badge" /></a>
  <a href="https://github.com/hyper63/hyper-adapter-s3/actions/workflows/test.yml"><img src="https://github.com/hyper63/hyper-adapter-s3/actions/workflows/test.yml/badge.svg" alt="Test" /></a>
  <a href="https://github.com/hyper63/hyper-adapter-s3/tags/"><img src="https://img.shields.io/github/tag/hyper63/hyper-adapter-s3" alt="Current Version" /></a>
</p>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Features](#features)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

`hyper.config.js`

```js
import { default as s3 } from "https://x.nest.land/hyper-adapter-s3@0.0.3/mod.js";

export default {
  app: opine,
  adapter: [
    { port: "storage", plugins: [s3("UNIQUE_NAME")] },
  ],
};
```

When you configure the hyper service with this adapter, you must provide a
unique bucket prefix. This helps ensure your bucket name is globally unique

> The unique name is an alphanumeric string that contains identifing
> information, this will enable you to identify the bucket which will be
> prefixed by 'hyper-storage-' and whatever name you provide.

In order to use this adapter you will need to have an AWS Account and will need
the following information:

- IAM User with access to s3 (AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY)
- AWS Region (default: us-east-1)

> The AWS User will need the ability to manage s3 and s3 resources

### Credentials

This adapter will attempt to read `AWS_ACCESS_KEY_ID` and
`AWS_ACCESS_SECRET_KEY` from `Deno.env`. Alternatively, you can provide the
access key, secret key, and region as arguments to the adapter factory function:

```js
import { default as s3 } from "https://x.nest.land/hyper-adapter-s3@0.0.3/mod.js";

export default {
  app: opine,
  adapter: [
    {
      port: "storage",
      plugins: [
        s3("UNIQUE_NAME", {
          awsAccessKeyId: "foo",
          awsSecretKey: "bar",
          awsRegion: "us-east-1", // defaults to 'us-east-1`
        }),
      ],
    },
  ],
};
```

#### Credentials from ENV VARS

You may set envrionment variables like so, and the adapter will use them:

```txt
AWS_ACCESS_KEY_ID=XXXXX
AWS_SECRET_ACCESS_KEY=XXXX
AWS_REGION=XXXXX
```

## Installation

This is a Deno module available to import from
[nest.land](https://nest.land/package/hyper-adapter-s3)

deps.js

```js
export { default as s3 } from "https://x.nest.land/hyper-adapter-s3@0.0.3/mod.js";
```

## Features

- Create an `s3` bucket
- Remove an `s3` bucket
- List `s3` buckets
- Put an object into an `s3` bucket
- Remove an object from an `s3` bucket
- Get an object from an `s3` bucket
- List objects in an `s3` bucket

## Methods

This adapter fully implements the Search port and can be used as the
[hyper Storage service](https://docs.hyper.io/storage-api) adapter

See the full port [here](https://nest.land/package/hyper-port-storage)

## Contributing

Contributions are welcome! See the hyper
[contribution guide](https://docs.hyper.io/contributing-to-hyper)

## Testing

```
./scripts/test.sh
```

To lint, check formatting, and run unit tests

## License

Apache-2.0
