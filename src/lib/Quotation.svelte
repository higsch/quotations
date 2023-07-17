<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';

	export let pos;
	export let radius;
	export let offset;
	export let width = 2;
	export let color;
	export let alpha;
	export let compositeOperation = 'multiply';
	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	function draw(ctx) {
		// ctx.globalCompositeOperation = compositeOperation;
		ctx.lineWidth = width;
		
		ctx.globalAlpha = alpha || 0.2;
		ctx.fillStyle = color || 'white';
		ctx.beginPath();
		ctx.arc(pos, offset, radius, 0, 2 * Math.PI);
		ctx.fill();
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
</script>
