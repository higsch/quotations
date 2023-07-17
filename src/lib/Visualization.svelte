<script>
	import { scaleLinear, scalePoint, scaleSqrt, mean } from 'd3';

	import { byteRange, byteLengthRange, quotations, quotationsPerCharacter } from '../stores/quotations';
	import { characters } from '../stores/characters';

	import Canvas from './Canvas.svelte';
	import Line from './Line.svelte';
	import Quotation from './Quotation.svelte';

	const padding = {
		top: 32,
		right: 32,
		bottom: 32,
		left: 32
	};

	let width, height;

	$: posScale = scaleLinear()
		.domain($byteRange)
		.range([padding.left, width - padding.right]);

	$: offsetScale = scalePoint()
		.domain($quotationsPerCharacter.filter(d => d.numQuotations > 0).map(d => d.name))
		.range([padding.top, height - padding.bottom]);

	$: radiusScale = scaleSqrt()
		.domain($byteLengthRange)
		.range([0, 32*2]);

	$: renderedQuotations = $quotations.map(q => {
		const startPos = posScale(q.quoteStart);
		const endPos = posScale(q.quoteEnd);
		const pos = mean([startPos, endPos]);
		// const offset = mean([offsetScale(q.speaker), ...q.addresses.map(a => offsetScale(a))]);
		const offset = offsetScale(q.speaker);
		const radius = radiusScale(q.quoteEnd - q.quoteStart);
		const color = q.speakerColor;
		return {
			...q,
			pos,
			offset,
			radius,
			color
		};
	});

	$: characterLines = $characters.map((c, i) => {
		const characterQuotations = renderedQuotations.filter(q => q.speaker === c.name || q.addresses.includes(c.name));
		// const coords = [[posScale.range()[0], offsetScale(c.name)], ...characterQuotations.map(q => ([q.pos, q.offset])), [posScale.range()[1], offsetScale(c.name)]];
		const coords = characterQuotations.map(q => ([q.pos, q.offset]));
		const color = c.Color;
		return {
			name: c.name,
			numQuotations: characterQuotations.length,
			coords,
			color
		};
	});
</script>

<div class="visualization">
	<div
		class="canvas-wrapper"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		<Canvas
			width={width}
			height={height}
			--position="absolute"
			--z-index="0"
		>
			{#each characterLines as { name, coords, color } (name)}
				<Line
					coords={coords}
					color={color}
				/>
			{/each}
		</Canvas>
		<Canvas
			width={width}
			height={height}
			--position="absolute"
			--z-index="10"
		>
			{#each renderedQuotations as { quoteID, pos, offset, radius } (quoteID)}
				<Quotation
					pos={pos}
					radius={radius}
					offset={offset}
					width={offsetScale.step() / 1}
					color='#1b1b1b'
					alpha="1.0"
				/>
			{/each}
			{#each renderedQuotations as { quoteID, pos, offset, radius, color } (quoteID)}
				<Quotation
					pos={pos}
					radius={radius}
					offset={offset}
					width={offsetScale.step() / 1}
					color={color}
					alpha="0.2"
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

	.canvas-wrapper {
		flex: 1;
		position: relative;
		overflow: hidden;
	}
</style>