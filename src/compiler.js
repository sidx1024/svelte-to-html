const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const vm = require('vm');

/**
 *
 * @param {string} filepath
 * @param {Object} props
 * @returns {Promise<string>}
 */
async function compile(filepath, props) {
  const bundle = await rollup.rollup({
    input: filepath,
    plugins: [
      // @ts-ignore
      svelte({ compilerOptions: { generate: 'ssr' } }),
      nodeResolve(),
    ],
  });
  const generated = await bundle.generate({ format: 'cjs', exports: 'default' });
  const code = generated.output[0].code;
  const result = {};
  const bindings = {};
  const slots = {};

  return vm.runInNewContext(code, { module }).$$render(result, props, bindings, slots);
}

module.exports = {
  compile,
};
