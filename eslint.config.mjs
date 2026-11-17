import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL(".", import.meta.url)),
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
