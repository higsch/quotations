<script>
	import { scaleLinear, scalePoint, mean } from 'd3';

	import { byteRange, quotations } from '../stores/quotations';
	import { characters } from '../stores/characters';

	import Canvas from './Canvas.svelte';
	import Quotation from './Quotation.svelte';

	const padding = {
		top: 16,
		right: 16,
		bottom: 16,
		left: 16
	};

	let width, height;

	$: characterScale = scalePoint()
		.domain($characters.map(d => d.name))
		.range([padding.top, height - padding.bottom]);

	$: byteScale = scaleLinear()
		.domain($byteRange)
		.range([padding.left, width - padding.right]);

	$: renderedQuotations = $quotations.map(q => {
		const startPos = byteScale(q.quoteStart);
		const endPos = byteScale(q.quoteEnd);
		// const offset = mean([characterScale(q.speaker), ...q.addresses.map(a => characterScale(a))]);
		const offset = characterScale(q.speaker);
		return {
			...q,
			startPos,
			endPos,
			offset
		};
	});

	$: console.log(characterScale('The Fish-Footman'));
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
		>
			{#each renderedQuotations as { quoteID, startPos, endPos, offset } (quoteID)}
				<Quotation
					start={startPos}
					end={endPos}
					offset={offset}
					width={characterScale.step() / 1}
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
		overflow: hidden;
	}
</style>