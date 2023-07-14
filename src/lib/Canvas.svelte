<script>
	import { onMount, onDestroy, setContext } from 'svelte';

	export let width = 0;
	export let height = 0;
	export let center = false;
	export let contextName = 'canvas';

	const drawFunctions = [];

	let canvas;
	let ctx;
	let pendingInvalidation = false;
	let frameId;

	function scaleCanvas(canvas, ctx, width, height, center = true) {
		const devicePixelRatio = window.devicePixelRatio || 1;

		const backingStoreRatio =
				ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.oBackingStorePixelRatio ||
				ctx.backingStorePixelRatio ||
				1;

		const ratio = devicePixelRatio / backingStoreRatio;

		if (devicePixelRatio !== backingStoreRatio) {
				canvas.width = width * ratio;
				canvas.height = height * ratio;
		
				canvas.style.width = width + 'px';
				canvas.style.height = height + 'px';
		} else {
				canvas.width = width;
				canvas.height = height;
				canvas.style.width = '';
				canvas.style.height = '';
		}

		ctx.scale(ratio, ratio);

		if (center) {
				ctx.translate(width / 2, height / 2);
		}
	}

	function update() {
		if (!ctx) return;

		if (center) {
			ctx.clearRect(-width / 2, -height / 2, width, height);
		} else {
			ctx.clearRect(0, 0, width, height);
		}

		drawFunctions.forEach((fn) => {
			ctx.save();
			fn(ctx);
			ctx.restore();
		});

		pendingInvalidation = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	onDestroy(() => {
		if (frameId) {
			cancelAnimationFrame(frameId);
		}
	});

	$: setContext(contextName, {
		register(fn) {
			drawFunctions.push(fn);
		},
		deregister(fn) {
			drawFunctions.splice(drawFunctions.indexOf(fn), 1);
		},
		invalidate() {
			if (pendingInvalidation) return;
			pendingInvalidation = true;
			frameId = requestAnimationFrame(update);
		},
	});

	$: if (canvas && ctx) scaleCanvas(canvas, ctx, width, height, center);
</script>

<canvas bind:this={canvas} on:mousemove />
<slot />

<style>
	canvas {
		position: var(--position);
		z-index: var(--z-index);
	}
</style>
