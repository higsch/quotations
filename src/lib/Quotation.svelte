<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';

	export let start;
	export let end;
	export let offset;
	export let width = 2;
	export let color = 'black';
	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	function draw(ctx) {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;

		ctx.beginPath();
		ctx.moveTo(start, offset);
		ctx.lineTo(end, offset);
		ctx.stroke();
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
