<h1 align="center">
hyper-adapter-s3
</h1>
<p align="center">

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/hyper-adapter-s3)
[![current version](https://img.shields.io/github/tag/hyper63/hyper-adapter-s3)](https://github.com/hyper63/hyper-adapter-s3/tags/)
[![Test](https://github.com/hyper63/hyper-adapter-s3/actions/workflows/test.yml/badge.svg)](https://github.com/hyper63/hyper-adapter-s3/actions/workflows/test.yml)

</p>

AWS s3 Adapter for hyper Storage port

In order to use this adapter you will need to have an AWS Account and will need
the following information:

- IAM User with access to s3 (AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY)
- AWS Region (default: us-east-1)

> The AWS User will need the ability to manage s3 and s3 resources

This adapter will attempt to read `AWS_ACCESS_KEY_ID` and
`AWS_ACCESS_SECRET_KEY` from `Deno.env`. Alternatively, you can provide the
access key, secret key, and region as arguments to the adapter factory function.

## ENV VARS

```txt
AWS_ACCESS_KEY_ID=XXXXX
AWS_SECRET_ACCESS_KEY=XXXX
AWS_REGION=XXXXX
```

When you configure the hyper service, you can setup the s3 adapter like:

> The unique name is an alphanumeric string that contains identifing
> information, this will enable you to identify the bucket which will be
> prefixed by 'hyper-storage-' and whatever name you provide.

hyper.config.js

```js
import { default as s3 } from "https://deno.land/x/hyper-adapter-s3/mod.js";

export default {
  app: opine,
  adapter: [
    { port: "storage", plugins: [s3("UNIQUE_NAME")] },
  ],
};
```

## Example

TODO

## Testing

```
./scripts/test.sh
```
