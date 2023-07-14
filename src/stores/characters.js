// @ts-nocheck
import { readable } from 'svelte/store';
import { csv, autoType } from 'd3';


export const characters = readable([], async (set) => {
	const data = await csv('data/character_info.csv', autoType);

	set(data);
});