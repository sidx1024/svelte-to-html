<script>
  const numbers = [1, 2, 3, 4, 5];
  export let name = '';
</script>

<p>{name}</p>
<ul>
  {#each numbers as number}
    <li>{number}</li>
  {/each}
</ul>
