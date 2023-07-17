// @ts-nocheck
import { readable, derived } from 'svelte/store';
import { csv, autoType } from 'd3';

const parseStringObject = (str) => {
	return str.replace(/[\{\}]/g, '').split(', ').map(d => d.replace(/^\'/, '').replace(/\'$/, '').replace(/\\\"/g, ''));
};

export const characters = readable([], async (set) => {
	const data = await csv('data/character_info.csv', autoType);

	const parsedData = data.map(d => {
		return {
			...d,
			name: d['Main Name'],
			aliases: parseStringObject(d.Aliases)
		};
	});

	set(parsedData);
});

export const standardizeNames = derived(characters, ($characters) => {
	return (pseudonym) => {
		const { name } = $characters.find(d => d.aliases.includes(pseudonym)) || {};
		return name;
	};
});

export const getCharacterId = derived(characters, ($characters) => {
	return (name) => {
		const { 'Character ID': id } = $characters.find(d => d.name === name) || {};
		return id;
	};
});

export const getCharacterColor = derived(characters, ($characters) => {
	return (name) => {
		const { Color: color } = $characters.find(d => d.name === name) || {};
		return color;
	};
});