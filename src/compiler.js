const vm = require('vm');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const sveltePreprocess = require('svelte-preprocess');
// @ts-ignore
const { svelteTrim } = require('svelte-trim');

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
        preprocess: [
          svelteTrim({
            removalMethod: 'trim',
            multiline: true,
            inline: false,
          }),
        ],
      }),
      nodeResolve(),
    ],
  });
  const generated = await bundle.generate({ format: 'cjs', exports: 'default' });
  const code = generated.output[0].code;
  const result = {};
  const bindings = {};
  const slots = {};

  return vm.runInNewContext(code, { require, module }).$$render(result, props, bindings, slots);
}

module.exports = {
  compile,
};
