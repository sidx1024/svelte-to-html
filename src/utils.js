const fs = require('fs');
const path = require('path');

/**
 *
 * @param {string} input
 * @returns {string}
 */
function readPropsFromFileIfRequired(input) {
  if (input.endsWith('.json')) {
    return readFile(input);
  }

  return input;
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
  } catch (e) {
    console.error(e);
    console.error(`\nError occurred while reading file "${filePath}".`);
    process.exit(1);
  }
}

/**
 * @param {string} input
 * @returns {string}
 */
function replaceSvelteExtensionToHTML(input) {
  const parts = input.split('.');
  if (parts.length > 0) {
    parts[parts.length - 1] = 'html';
  }
  return parts.join('.');
}

module.exports = {
  readPropsFromFileIfRequired,
  readFile,
  replaceSvelteExtensionToHTML,
};
