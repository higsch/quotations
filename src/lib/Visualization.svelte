<script>
	import { scaleLinear, scaleSqrt } from 'd3';

	import {
		byteRange,
		byteLengthRange,
		quotations,
		quotationsPerCharacter,
	} from '../stores/quotations';

	import Spiral from './Spiral.svelte';
	import Quotation from './Quotation.svelte';
	import CharacterLines from './CharacterLines.svelte';

	const padding = 16;
	const minDim = 1000;
	const lineSourceDistance = 140;
	const mainCharacters = [6, 4];
	// const mainCharacters = [2, 4];
	// const mainCharacters = [0, 4];

	let width, height;
	let getPositionOnSpiral;

	$: positionScale = scaleLinear().domain($byteRange).range([0, 1]);

	$: radiusScale = scaleSqrt()
		.domain($byteLengthRange)
		.range([0, minDim / 15]);

	$: renderedQuotations = $quotations.map((q) => {
		const [x, y] = getPositionOnSpiral(positionScale((q.quoteEnd + q.quoteStart) / 2));
		const radius = radiusScale(q.quoteEnd - q.quoteStart);
		const color = q.speakerColor || '#ff1e1d';
		return {
			x,
			y,
			radius,
			color,
			...q,
		};
	});

	$: characterLines = $quotationsPerCharacter
		.filter(d => mainCharacters.includes(d.speakerId))
		.map((c, i) => {
			const characterQuotations = renderedQuotations.filter(
				(q) => q.addresses.includes(c.name) && mainCharacters.includes(q.speakerId) && c.name !== q.speaker
			);
			return {
				...c,
				name: c.name,
				sourceCoords: i % 2	=== 0 ? [padding, height / 2 - lineSourceDistance / 2] : [padding, height / 2 + lineSourceDistance / 2],
				targetCoords: characterQuotations.map((q) => [q.x, q.y]),
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
			{#if width && height}
				<Spiral
					startRadius={minDim / 20}
					endRadius={minDim / 2 - padding}
					rounds={20}
					center={[width / 2, height / 2]}
					color="#000000"
					opacity={0.5}
					bind:getPosition={getPositionOnSpiral}
				/>
				{#each characterLines as { speakerId, sourceCoords, targetCoords, color } (speakerId)}
					<CharacterLines
						sourceCoords={sourceCoords}
						targetCoords={targetCoords}
						color={color}
						opacity={0.2}
						strokeWidth={3}
					/>
				{/each}
				{#each renderedQuotations.filter(d => !mainCharacters.includes(d.speakerId)) as { quoteID, x, y, radius } (quoteID)}
					<Quotation
						id={quoteID}
						pos={x}
						offset={y}
						radius={radius}
						color="#000000"
						opacity={0.5}
					/>
				{/each}
				{#each renderedQuotations.filter(d => mainCharacters.includes(d.speakerId)) as { quoteID, x, y, radius, color } (quoteID)}
					<Quotation
						id={quoteID}
						pos={x}
						offset={y}
						radius={radius}
						color={color}
						opacity={1.0}
					/>
				{/each}
			{/if}
		</svg>
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
