import { forceSimulation, forceLink, forceY, forceCollide } from 'd3';

export const layoutLinkForce = (nodes, links, { nodeId, width, height }) => {
	return new Promise((resolve) => {
		const nodesCopy = [...nodes];
		const linksCopy = [...links];
		forceSimulation(nodesCopy)
			.force(
				'link',
				forceLink(linksCopy)
					.id((d) => d[nodeId])
					.strength(1)
					.distance(20)
					.iterations(5)
			)
			.on('end', () => {
				resolve(nodesCopy);
			})
			.tick(300);
	});
};

const goldenRatio = (1 + Math.sqrt(5)) / 2;
export const layoutPhyllotaxis = (
	data,
	{
		baseRadius = 4,
		radiusOffset = baseRadius / 2,
		spacing = baseRadius * 1.2,
		theta = (2 * Math.PI) / goldenRatio,
		width,
		height,
	}
) => {
	return data.map((d, i) => {
		const scaledTheta = theta * i;
		const scaledRadius = spacing * Math.sqrt(i) + radiusOffset;

		return {
			...d,
			index: i,
			baseRadius,
			theta: scaledTheta,
			x: Math.cos(scaledTheta) * scaledRadius + width / 2,
			y: Math.sin(scaledTheta) * scaledRadius + height / 2,
		};
	});
};
