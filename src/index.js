#!/usr/bin/env node
// @ts-check

const fs = require('fs');
const yargs = require('yargs');
const { compile } = require('./compiler');
const { readPropsFromFileIfRequired, replaceSvelteExtensionToHTML } = require('./utils');

/**
 *
 * @typedef {{
 *   _: Array<string>,
 *   input: string,
 *   output: string,
 *   props: string,
 *  }} Arguments
 */

/**
 *
 * @type Arguments
 */
// @ts-ignore
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

compile(inputFile, props)
  .then((output) => {
    fs.writeFileSync('./' + outputFile, output, { encoding: 'utf-8' });
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
