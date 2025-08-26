import lastCharts from 'modules/data/localStorage/lastCharts';
import { describe, expect, it } from 'vitest';

describe('@read', () => {
	it('Should read null at init', () => {
		expect(lastCharts.read()).toBeNull();
	});
});

const configs = [
	{
		points: [
			{
				name: 'name-a',
				uuid: 'uuid-a',
			},
			{
				name: 'name-b',
				uuid: 'uuid-b',
			},
			{
				name: 'name-c',
				uuid: 'uuid-c',
			},
		],
	},
	{
		points: [
			{
				name: 'name-a',
				uuid: 'uuid-a',
			},
			{
				name: 'name-b',
				uuid: 'uuid-b',
			},
		],
	},
	{
		points: [
			{
				name: 'name-a',
				uuid: 'uuid-a',
			},
			{
				name: 'name-c',
				uuid: 'uuid-c',
			},
		],
	},
	{
		points: [],
	},
];

describe('@findIndex', () => {
	it('Should pass with correct index', () => {
		expect(lastCharts.findIndex(configs, configs[0])).toEqual(0);
		expect(lastCharts.findIndex(configs, configs[1])).toEqual(1);
		expect(lastCharts.findIndex(configs, configs[2])).toEqual(2);
	});
	it('Should fail with -1 index', () => {
		expect(lastCharts.findIndex(configs, { points: [] })).toEqual(-1);
	});
});

describe('@save', () => {
	it('Should save config to LocalStorage', () => {
		lastCharts.save(configs);
		expect(lastCharts.read()).toHaveLength(configs.length);
	});
});

describe('Add new item', () => {
	it('When item is add, localStorage is not null', () => {
		lastCharts.reset();
		expect(lastCharts.read()).toBeNull();
		lastCharts.add(configs[0].points);
		expect(lastCharts.read()).toHaveLength(1);
	});

	it('When item is added, should found them', () => {
		expect(lastCharts.findIndex(configs, configs[0])).toEqual(0);
	});

	it('When the same points item is added should remove previous', () => {
		lastCharts.add(configs[0].points);
		expect(lastCharts.read()).toHaveLength(1);
	});

	it('When add new item, should limit collection to 10 ', () => {
		lastCharts.save([
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
			{ points: [] },
		]);
		expect(lastCharts.read()).toHaveLength(10);
		lastCharts.add(configs[0].points);
		expect(lastCharts.findIndex(lastCharts.read() || [], { points: configs[0].points })).toEqual(9);
	});
});
