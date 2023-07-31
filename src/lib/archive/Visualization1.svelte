<script>
	import { scaleLinear, scalePoint, scaleSqrt, mean } from 'd3';

	import { byteRange, byteLengthRange, quotations, quotationsPerCharacter } from '../../stores/quotations';

	import Canvas from '../Canvas.svelte';
	import Line from '../Line.svelte';
	import Quotation from '../Quotation.svelte';
	import { layoutLinkForce } from '../../utils/layout';

	const padding = {
		top: 32,
		right: 32,
		bottom: 32,
		left: 32
	};

	let width, height;
	let forceQuotations = [];

	$: posScale = scaleLinear()
		.domain($byteRange)
		.range([padding.left, width - padding.right]);

	$: offsetScale = scalePoint()
		.domain($quotationsPerCharacter.filter(d => d.numQuotations > 0).map(d => d.name))
		.range([padding.top, height - padding.bottom]);

	$: radiusScale = scaleSqrt()
		.domain($byteLengthRange)
		.range([0, width / 70]);

	$: renderedQuotations = $quotations.map(q => {
		const startPos = posScale(q.quoteStart);
		const endPos = posScale(q.quoteEnd);
		const pos = mean([startPos, endPos]);
		const offset = mean([offsetScale(q.speaker), ...q.addresses.map(a => offsetScale(a))]);
		const radius = radiusScale(q.quoteEnd - q.quoteStart);
		const color = q.speakerColor;
		return {
			...q,
			pos,
			offset,
			radius,
			color,
			x: pos,
			y: offset
		};
	});

	$: links = $quotationsPerCharacter.map(c => {
		const characterQuotations = renderedQuotations.filter(q => q.speaker === c.name || q.addresses.includes(c.name));
		return characterQuotations.map((q, i, arr) => {
			return {
				source: q.quoteID,
				target: arr[i + 1] ? arr[i + 1].quoteID : undefined
			};
		});
	})
	.flat()
	.filter(d => d.target !== undefined && d.source !== undefined);
		
	$: (async () => {
		forceQuotations = await layoutLinkForce(renderedQuotations, links, {
			nodeId: 'quoteID',
			width,
			height
		});
	})();

	$: forceCharacterLines = $quotationsPerCharacter.map(c => {
		const characterQuotations = forceQuotations.filter(q => q.speaker === c.name || q.addresses.includes(c.name));
		const coords = characterQuotations.map(q => ([q.pos, q.y]));
		const color = c.color;
		return {
			name: c.name,
			numQuotations: characterQuotations.length,
			coords,
			color
		};
	});

	$: console.log(forceQuotations);
</script>

<div class="visualization">
	{#if (forceCharacterLines.length)}
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
				{#each forceCharacterLines as { name, coords, color } (name)}
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
				--z-index="110"
			>
				{#each forceQuotations as { quoteID, pos, x, y, radius } (quoteID)}
					<Quotation
						pos={pos}
						radius={radius}
						offset={y}
						width={offsetScale.step() / 1}
						color='#1b1b1b'
						alpha="1.0"
					/>
				{/each}
				{#each forceQuotations as { quoteID, pos, x, y, radius, color } (quoteID)}
					<Quotation
						pos={pos}
						radius={radius}
						offset={y}
						width={offsetScale.step() / 1}
						color={color}
						alpha="0.5"
					/>
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