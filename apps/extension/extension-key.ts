/**
 * The public key in the manifest's `key`, from which Chrome derives the extension's ID, so every build has the same one (`SELF_BUILT_EXTENSION_ID` in `@browser-ai-agent/protocol`), which the Browser AI Agent Control server accepts. Only the public key exists: Chrome loads unpacked extensions without the private one. The user still pairs the extension with the server (**Allow** after comparing the code)
 */
export const EXTENSION_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2x7xI0Nth7zmrpH5/3xbkAFJG9KNTiF2p1RYWlu+0/ZpyWYWGO+1UreT7FDCPQ7bONu9RIPnHDEeopmORfqMYETaL/uUMk9z3ZBBLIzagv9xh+nFGs1QxoLZDvYTkxBu9hAhEbltgXDD1b7m7c4ESZQC+vYNtUyhWHSLFlrkaJJE5agEdam50lfKg1v4OZz5q7Q+CRP0/Uf8WbPaGyn9OzgvyTxg+VR3AnNHvGPfi57B5YrdDZ+fXvCGiQqMdLCxy2qDe9pwbeADZ77bNAdwTZ9IDgE+gpAx6xmG54GAymgctJNP0MTrJSnfZX5ZERm2Ayk3xRZXtEF2RJmcw04fuQIDAQAB";
