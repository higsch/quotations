<script>
	import { scaleSqrt } from 'd3';

	import { byteLengthRange, quotations, quotationsPerCharacter } from '../../stores/quotations';
	import { layoutPhyllotaxis } from '../../utils/layout';

	import Canvas from '../Canvas.svelte';
	import Line from '../Line.svelte';
	import Quotation from '../Quotation.svelte';

	const padding = {
		top: 32,
		right: 32,
		bottom: 32,
		left: 32,
	};

	let width, height;

	$: radiusScale = scaleSqrt()
		.domain($byteLengthRange)
		.range([0, Math.min(width, height) / 30]);

	$: renderedQuotations = layoutPhyllotaxis($quotations, {
		baseRadius: Math.min(width, height) / 110,
		width,
		height,
	}).map((q) => {
		const radius = radiusScale(q.quoteEnd - q.quoteStart);
		const color = q.speakerColor;
		return {
			...q,
			radius: 8,
			color,
		};
	});

	$: characterLines = $quotationsPerCharacter.map(c => {
		const characterQuotations = renderedQuotations.filter(q => q.speaker === c.name || q.addresses.includes(c.name));
		return {
			name: c.name,
			coords: characterQuotations.map(q => [q.x, q.y]),
			color: c.color,
		};
	});

	$: console.log(renderedQuotations)
</script>

<div class="visualization">
	{#if renderedQuotations.length}
		<div
			class="canvas-wrapper"
			bind:clientWidth={width}
			bind:clientHeight={height}
		>
			<Canvas
				width={width}
				height={height}
				--position="absolute"
				--z-index="100"
			>
				{#each characterLines.slice(10, 11) as { name, coords, color } (name)}
					<Line
						coords={coords}
						color={color}
					/>
				{/each}
			</Canvas>
			<Canvas {width} {height} --position="absolute" --z-index="110">
				{#each renderedQuotations as { quoteID, x, y, radius, color } (quoteID)}
					<Quotation pos={x} offset={y} {radius} {color} alpha="0.6" />
				{/each}
			</Canvas>
		</div>
	{/if}
</div>

<style>
	.visualization {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.canvas-wrapper {
		flex: 1;
		position: relative;
		overflow: hidden;
	}
</style>
