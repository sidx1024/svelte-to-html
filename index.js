#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const yargs = require('yargs');
const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const argv = yargs
  .scriptName('svelte-to-html')
  .usage('$0 <input> [output] [props] [args]')
  .command('<input>', 'Transform file <input> from svelte to html', (yargs) => {
    yargs.positional('input', {
      type: 'string',
      describe: 'The .svelte input file path or name',
    });
    yargs.positional('output', {
      type: 'string',
      describe: 'The output file path or name',
    });
    yargs.positional('props', {
      type: 'string',
      default: '{}',
      describe:
        'Props in JSON format, or JSON file path. Props that are required by the svelte input file.',
    });
  })
  .demandCommand()
  .help().argv;

const inputFile = argv._[0] || argv.input;
const outputFile = argv._[1] || argv.output || replaceSvelteExtensionToHTML(inputFile);
const props = JSON.parse(readPropsFromFileIfRequired(argv._[2] || argv.props || '{}'));

processWithRollup(inputFile, props)
  .then((output) => {
    fs.writeFileSync('./' + outputFile, output, { encoding: 'utf-8' });
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

async function processWithRollup(input, props) {
  const bundle = await rollup.rollup({
    input,
    plugins: [svelte({ compilerOptions: { generate: 'ssr' } }), nodeResolve()],
  });
  const generated = await bundle.generate({ format: 'cjs', exports: 'default' });
  const code = generated.output[0].code;
  const result = {};
  const bindings = {};
  const slots = {};

  return vm.runInNewContext(code, { module }).$$render(result, props, bindings, slots);
}

function readPropsFromFileIfRequired(input) {
  if (input.endsWith('.json')) {
    return readFile(input);
  }

  return input;
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
  } catch (e) {
    console.error(e);
    console.error(`\nError occurred while reading file "${filePath}".`);
    process.exit(1);
  }
}

function replaceSvelteExtensionToHTML(input) {
  const parts = input.split('.');
  if (parts.length > 0) {
    parts[parts.length - 1] = 'html';
  }
  return parts.join('.');
}
