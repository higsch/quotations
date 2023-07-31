<script>
	export let id;
	export let pos;
	export let radius;
	export let offset;
	export let color;
	export let opacity;
</script>

<g
	class="quotation"
	transform={`translate(${pos}, ${offset})`}
>
	<defs>
		<radialGradient id="gradient-{id}">
			<stop
				offset="0%"
				stop-opacity={opacity * 0.3}
				stop-color={color}
			/>
			<stop
				offset="70%"
				stop-opacity={opacity * 0.3}
				stop-color={color}
			/>
			<stop
				offset="80%"
				stop-opacity={opacity * 0.4}
				stop-color={color}
			/>
			<stop
				offset="95%"
				stop-opacity={opacity * 0.7}
				stop-color={color}
			/>
			<stop
				offset="98%"
				stop-opacity={opacity}
				stop-color={color}
			/>
			<stop
				offset="100%"
				stop-opacity={opacity}
				stop-color={color}
			/>
		</radialGradient>
	</defs>
	<!-- <circle
		cx={0}
		cy={0}
		r="2"
		fill={color}
		opacity={opacity / 2}
		stroke="none"
	/> -->
	<circle
		cx={0}
		cy={0}
		r={radius}
		fill="url(#gradient-{id})"
		opacity="1.0"
		stroke="none"
	/>
	<!-- <circle
		cx={0}
		cy={0}
		r={radius}
		fill={color}
		opacity={opacity}
		stroke="none"
	/> -->
</g>
