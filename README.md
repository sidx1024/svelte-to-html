# Svelte to HTML

- `svelte-to-html` is a command to quickly transform a Svelte file into static html.
- Props can be supplied to the main Svelte file.
- The main Svelte file can import other Svelte components or JavaScript files.

## What this is not?

- This command is not a replacement for SvelteKit. It does not ship any JavaScript nor does it include any head or body tag.
- It obviously does not support any DOM APIs like window, location, navigator etc.

## Why?

- For scenarios where you'd want to generate a static HTML file but with if/else conditionals or for loops. [Svelte's templating features and syntax](https://svelte.dev/docs#template-syntax-if) come to rescue.
- Ideal for creating templates for GitHub comments which can be used in GitHub Actions.

## Usage

```sh
npx svelte-to-html <input> <output> <props>

# Props as json string
npx svelte-to-html input.svelte output.html '{"food":"Pizza"}'

# Props as json file
npx svelte-to-html input.svelte output.html props.json
```

### Example

#### Input

```sveltehtml
<!-- template.svelte -->
<script>
  const a = 5;
  const b = 8;

  export let numbers = [];
</script>

<ul>
  {#each numbers as number}
    <li>{number}</li>
  {/each}
</ul>

{#if a < b}
  <p>a is less than b</p>
{:else}
  <p>b is less than a</p>
{/if}
```

#### Command

```sh
npx svelte-to-html template.svelte template.html '{"numbers": [2, 5, 7]}'
###                <input>          <output>     <props>
```

#### Output:

```html
<ul>
  <li>2</li>
  <li>5</li>
  <li>7</li>
</ul>
<p>a is less than b</p>
```
