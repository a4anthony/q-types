// import pkg from "./package.json";
// import commonjs from "rollup-plugin-commonjs";
// import VuePlugin from "rollup-plugin-vue";
//
// function createEntry(options) {
//   console.log(options);
//   return {
//     input: "./src/components/McQuestion.vue",
//     external: ["vue", "css"],
//     output: {
//       file: options.file,
//       format: options.format,
//       name: "QTypes",
//       exports: "default",
//       globals: {
//         vue: "Vue",
//       },
//     },
//     plugins: [VuePlugin(), commonjs()],
//   };
// }
//
// export default [
//   createEntry({ format: "iife", file: pkg.browser }),
//   createEntry({ format: "es", file: pkg.module }),
//   createEntry({ format: "cjs", file: pkg.main }),
// ];
// import our third party plugins
import commonjs from "rollup-plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";
import pkg from "./package.json"; // import our package.json file to re-use the naming

export default {
  // this is the file containing all our exported components/functions
  input: "src/wrapper.js",
  // this is an array of outputted formats
  output: [
    {
      name: "InlineSvg",
      exports: "named",
      file: pkg.module, // the name of our esm library
      format: "esm", // the format of choice
      sourcemap: true, // ask rollup to include sourcemaps
    },
  ],
  // this is an array of the plugins that we are including
  plugins: [VuePlugin(), commonjs()],
  // ask rollup to not bundle Vue in the library
  external: ["vue"],
};
