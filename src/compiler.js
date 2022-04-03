const vm = require('vm');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const minify = require('html-minifier').minify;

/**
 *
 * @param {string} filepath
 * @param {Object} props
 * @returns {Promise<string>}
 */
async function compile(filepath, props) {
  const bundle = await rollup.rollup({
    input: filepath,
    external: ['svelte/internal'],
    plugins: [
      // @ts-ignore
      svelte({
        compilerOptions: { generate: 'ssr', preserveComments: true },
        onwarn: () => {},
      }),
      nodeResolve(),
    ],
  });
  const generated = await bundle.generate({ format: 'cjs', exports: 'default' });
  const code = generated.output[0].code;
  const result = {};
  const bindings = {};
  const slots = {};

  const html = vm.runInNewContext(code, { require, module }).$$render(result, props, bindings, slots);
  const minifiedHTML = minify(html, {
    collapseWhitespace: true,
  });

  return minifiedHTML;
}

module.exports = {
  compile,
};
