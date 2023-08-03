<script>
	export let sourceCoords = [0, 0];
	export let targetCoords = [[0, 0]];
	export let color;
	export let opacity = 1.0;
	export let strokeWidth = 1;
</script>

<g class="character-lines">
	{#each targetCoords as [x, y], i}
		<path
			d={`
				M${sourceCoords[0]}, ${sourceCoords[1]}
				C${(sourceCoords[0] + x) / 2} ${sourceCoords[1]} ${(sourceCoords[0] + x) / 2} ${y} ${x} ${y}
			`}
			stroke={color}
			stroke-width="{strokeWidth}px"
			stroke-opacity={opacity}
			stroke-linecap="round"
			fill="none"
		/>
	{/each}
</g>