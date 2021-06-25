// Harness deps
export { default as appOpine } from "https://raw.githubusercontent.com/hyper63/hyper63/main/packages/app-opine/mod.js";
export { default as core } from "https://raw.githubusercontent.com/hyper63/hyper63/main/packages/core/mod.js";

// Schema parsing deps
export { default as validateFactorySchema } from "https://raw.githubusercontent.com/hyper63/hyper63/main/packages/core/utils/plugin-schema.js";
export { storage as validateStorageAdapterSchema } from "https://raw.githubusercontent.com/hyper63/hyper63/main/packages/port-storage/mod.js";

// std lib deps
export {
  assert,
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";

export { rejects, resolves, spy } from "https://deno.land/x/mock@v0.9.5/mod.ts";
