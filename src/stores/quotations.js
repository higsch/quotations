// @ts-nocheck
import { readable, derived } from 'svelte/store';
import { csv, autoType } from 'd3';

import {
	characters,
	standardizeNames,
	getCharacterId,
	getCharacterColor,
} from './characters';

// const bytesTotal = 144277; // Alice
const bytesTotal = 374680; // Room
// const bytesTotal = 123006; // Winnie

const parseStringArray = (str) => {
	return str
		.replace(/[\[\]]/g, '')
		.split(', ')
		.map((d) => d.replace(/^\'/, '').replace(/\'$/, ''));
};

export const quotations = derived(
	[standardizeNames, getCharacterId, getCharacterColor],
	async ([$standardizeNames, $getCharacterId, $getCharacterColor], set) => {
		const data = await csv(
			'data/room_with_a_view/quotation_info.csv',
			autoType
		);

		const parsedData = data.map((d) => {
			const quoteStart = +d.quoteByteSpans.match(/(?<=\[\[)([0-9]+)/g)[0];
			const quoteEnd = +d.quoteByteSpans.match(/([0-9]+(?=\]\]))/g)[0];
			const speaker = $standardizeNames(d.speaker);
			const speakerId = $getCharacterId(speaker);
			const speakerColor = $getCharacterColor(speaker);
			const addresses = parseStringArray(d.addressees).map((a) =>
				$standardizeNames(a)
			);
			return {
				...d,
				speaker,
				speakerId,
				speakerColor,
				quoteStart,
				quoteEnd,
				quoteText: d.quoteText.replace('\n', ' '),
				addresses,
			};
		});

		const sortedData = parsedData.sort((a, b) => a.quoteStart - b.quoteStart);

		set(sortedData);
	},
	[]
);

export const byteRange = readable([0, bytesTotal]);

export const byteLengthRange = derived(quotations, ($quotations) => {
	const byteLengths = $quotations.map((d) => d.quoteEnd - d.quoteStart);
	return [0, Math.max(...byteLengths)];
});

export const quotationsPerCharacter = derived(
	[characters, quotations],
	([$characters, $quotations]) => {
		return $characters
			.map((c) => {
				const numQuotations = $quotations.filter(
					(q) => q.speaker === c.name || q.addresses.includes(c.name)
				).length;
				return {
					name: c.name,
					numQuotations,
					color: c.Color,
				};
			})
			.sort((a, b) => b.numQuotations - a.numQuotations);
	}
);
