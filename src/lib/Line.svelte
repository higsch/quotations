<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';

	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	function draw(ctx) {}

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
