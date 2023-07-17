<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { line, curveBumpX as curveInterpolator } from 'd3';

	export let coords;
	export let color;
	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	const lineGenerator = line()
		.x(d => d[0])
		.y(d => d[1])
		.curve(curveInterpolator);

	function draw(ctx) {
		ctx.globalAlpha = 0.4;

		ctx.strokeStyle = color || 'white';
		ctx.lineWidth = 4;

		ctx.beginPath();
		ctx.stroke(new Path2D(path));
	}

	onMount(() => {
		register(draw);
		invalidate();

		return () => {
			deregister(draw);
		};
	});

	afterUpdate(invalidate);

	onDestroy(invalidate);

	$: path = lineGenerator(coords);
</script>
