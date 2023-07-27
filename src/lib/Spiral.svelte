<script>
	import { afterUpdate } from 'svelte';
	import { scaleLinear, lineRadial } from 'd3';

	export let startRadius;
	export let endRadius;
	export let rounds = 10;
	export let center = [0, 0];
	export let getPosition = () => [0, 0];
	export let hide = false;

	const resolution = 100;

	const lineGenerator = lineRadial()
		.angle((d) => d.angle)
		.radius((d) => d.radius);

	let spiralData = [];
	let path;

	afterUpdate(() => {
		if (!path) return;
		const length = path.getTotalLength();
		getPosition = (i) => {
			const { x, y } = path.getPointAtLength(i * length);
			return [x + center[0], y + center[1]];
		};
	});

	$: steps = Math.round(rounds * resolution);

	$: angleScale = scaleLinear()
		.domain([0, steps])
		.range([0, rounds * 2 * Math.PI]);

	$: radiusScale = scaleLinear()
		.domain([0, steps])
		.range([startRadius, endRadius]);

	$: if (startRadius && endRadius) {
		spiralData = Array.from({ length: steps }, (_, i) => ({
			angle: angleScale(i),
			radius: radiusScale(i),
		}));
	}
</script>

{#if spiralData.length}
	<g
		class="spriral"
		class:hidden={hide}
		transform={`translate(${center.join(' ')})`}
	>
		<path
			d={lineGenerator(spiralData)}
			fill="none"
			opacity="0.5"
			stroke="white"
			stroke-width="2"
			stroke-linecap="round"
			bind:this={path}
		/>
	</g>
{/if}

<style>
	g.hidden {
		visibility: hidden;
	}
</style>
