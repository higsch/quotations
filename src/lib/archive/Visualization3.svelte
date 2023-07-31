<script>
	import { scaleLinear, scaleSqrt } from 'd3';

	import {
		byteRange,
		byteLengthRange,
		quotations,
		quotationsPerCharacter,
	} from '../stores/quotations';
	import { layoutPhyllotaxis } from '../utils/layout';

	import Spiral from './Spiral.svelte';
	import Canvas from './Canvas.svelte';
	import Line from './Line.svelte';
	import Quotation from './Quotation.svelte';

	const padding = 16;

	let width, height;
	let getPositionOnSpiral;

	$: minDim = Math.min(width, height);

	$: positionScale = scaleLinear().domain($byteRange).range([0, 1]);

	$: radiusScale = scaleSqrt()
		.domain($byteLengthRange)
		.range([0, minDim / 25]);

	$: renderedQuotations = $quotations.map((q) => {
		const [x, y] = getPositionOnSpiral(positionScale((q.quoteEnd + q.quoteStart) / 2));
		const radius = radiusScale(q.quoteEnd - q.quoteStart);
		const color = q.speakerColor;
		return {
			x,
			y,
			radius,
			color,
			...q,
		};
	});

	$: characterLines = $quotationsPerCharacter.map((c) => {
		const characterQuotations = renderedQuotations.filter(
			(q) => q.speaker === c.name || q.addresses.includes(c.name)
		);
		return {
			name: c.name,
			coords: characterQuotations.map((q) => [q.x, q.y]),
			color: c.color,
		};
	});
</script>

<div class="visualization">
	<div
		class="canvas-svg-wrapper"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		<svg
			width={width}
			height={height}
		>
			<Spiral
				startRadius={minDim / 20}
				endRadius={minDim / 2 - padding}
				rounds={20}
				center={[width / 2, height / 2]}
				bind:getPosition={getPositionOnSpiral}
				hide={false}
			/>
		</svg>
		<Canvas
			width={width}
			height={height}
			--position="absolute"
			--z-index="100"
		>
			{#each characterLines.slice(0, 1) as { name, coords, color } (name)}
				<Line
					coords={coords}
					color={color}
					lineWidth={minDim / 200}
				/>
			{/each}
		</Canvas>
		<Canvas
			width={width}
			height={height}
			--position="absolute"
			--z-index="110"
		>
			{#each renderedQuotations as { quoteID, x, y, radius, color } (quoteID)}
				<Quotation
					pos={x}
					offset={y}
					radius={radius}
					color={color}
					alpha="0.6"
				/>
			{/each}
		</Canvas>
	</div>
</div>

<style>
	.visualization {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.canvas-svg-wrapper {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	svg {
		position: absolute;
		z-index: 0;
	}
</style>
