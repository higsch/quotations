// @ts-nocheck
import { readable, derived } from 'svelte/store';
import { csv, autoType } from 'd3';

const bytesTotal = 144277;

const parseStringArray = (str) => {
	return str.replace(/[\[\]]/g, '').split(', ').map(d => d.replace(/^\'/, '').replace(/\'$/, ''))
};

export const quotations = readable([], async (set) => {
	const data = await csv('data/quotation_info.csv', autoType);

	const parsedData = data.map((d) => {
		const quoteStart = +d.quoteByteSpans.match(/(?<=\[\[)([0-9]+)/g)[0];
		const quoteEnd = +d.quoteByteSpans.match(/([0-9]+(?=\]\]))/g)[0];
		const addresses = parseStringArray(d.addressees);
		return {
			...d,
			quoteStart,
			quoteEnd,
			quoteText: d.quoteText.replace('\n', ' '),
			addresses
		}
	});

	set(parsedData);
});

export const byteRange = readable([0, bytesTotal]);