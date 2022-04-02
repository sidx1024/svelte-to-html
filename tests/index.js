const util = require('util');
const exec = util.promisify(require('child_process').exec);
const assert = require('assert');
const fs = require('fs');

let testsToRun = [];

test('works with input, output and props', async () => {
  await clearTempDirectory();
  await exec('node index.js tests/t1.svelte tests/tmp/t1.html \'{"name": "Testing"}\'');
  const expected = `<p>Testing</p>
<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`;
  const actual = fs.readFileSync('./tests/tmp/t1.html', { encoding: 'utf-8' });
  assert.equal(actual, expected);
});

test('works with input, output and props json file', async () => {
  await clearTempDirectory();
  await exec('node index.js tests/t1.svelte tests/tmp/t2.html tests/t2.json');
  const expected = `<p>Testing 2</p>
<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`;
  const actual = fs.readFileSync('./tests/tmp/t2.html', { encoding: 'utf-8' });
  assert.equal(actual, expected);
});

test('works with input, output and external import', async () => {
  await clearTempDirectory();
  await exec('node index.js tests/t3.svelte tests/tmp/t3.html');
  const expected = `<p>External</p>`;
  const actual = fs.readFileSync('./tests/tmp/t3.html', { encoding: 'utf-8' });
  assert.equal(actual, expected);
});

async function test(name, fn) {
  testsToRun.push({ name, fn });
}

Promise.resolve().then(async () => {
  let name;
  try {
    for (const test of testsToRun) {
      name = test.name;
      await test.fn();
    }
    console.log('All tests passed!');
  } catch (e) {
    console.error(`Test "${name}" failed -`, e);
    process.exit(1);
  }
});

async function clearTempDirectory() {
  await exec('rm -rf ./tests/tmp/');
  await exec('mkdir ./tests/tmp/');
}
