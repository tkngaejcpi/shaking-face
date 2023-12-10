/** @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,

  useTabs: false,

  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  importOrder: [
    "^react",
    "<THIRD_PARTY_MODULES>",

    "^@components/",
    "^@hooks/",
    "^@services/",
    "^@utils/",

    "^[./]",
  ],

  importOrderSeparation: true,
};

export default config;
