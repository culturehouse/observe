import { useState, useEffect, useRef } from 'react';
import moment from 'moment/moment';

import styles from '../styles/index.module.css';
import RangeFilter from './RangeFilter';
import SelectionFilter from './SelectionFilter';
import {AiOutlineCloseCircle} from "react-icons/ai"

const orderType = {
	id: 'id',
	dateTime: 'dateTime',
	time: 'time',
	weather: 'weather',
	temperature: 'temperature',
	volunteerName: 'volunteerName'
};

const selectionFilters = ['weather', 'volunteerName', 'dataType'];
const rangeFilters = ['id', 'time', 'dateTime', 'temperature'];

const weatherTypes = [
	'Sunny',
	'Partly cloudy',
	'Cloudy',
	'Windy',
	'Drizzle',
	'Raining',
	'Snowing',
];
const positionTypes = ['sitting', 'standing', 'other'];

const headers = [
	[[null, '#ID'], orderType.id],
	[
		[
			<svg
				width="13"
				height="13"
				viewBox="0 0 13 13"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ marginRight: 5 }}
			>
				<path
					d="M10.875 1.5H10.25V0.875C10.25 0.53125 9.96875 0.25 9.625 0.25C9.28125 0.25 9 0.53125 9 0.875V1.5H4V0.875C4 0.53125 3.71875 0.25 3.375 0.25C3.03125 0.25 2.75 0.53125 2.75 0.875V1.5H2.125C1.43125 1.5 0.88125 2.0625 0.88125 2.75L0.875 11.5C0.875 11.8315 1.0067 12.1495 1.24112 12.3839C1.47554 12.6183 1.79348 12.75 2.125 12.75H10.875C11.5625 12.75 12.125 12.1875 12.125 11.5V2.75C12.125 2.0625 11.5625 1.5 10.875 1.5ZM10.875 10.875C10.875 11.2188 10.5938 11.5 10.25 11.5H2.75C2.40625 11.5 2.125 11.2188 2.125 10.875V4.625H10.875V10.875ZM3.375 5.875H4.625V7.125H3.375V5.875ZM5.875 5.875H7.125V7.125H5.875V5.875ZM8.375 5.875H9.625V7.125H8.375V5.875Z"
					fill="#222222"
				/>
			</svg>,
			'Date',
		],
		orderType.dateTime,
	],
	[
		[
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ marginRight: 5 }}
			>
				<path
					d="M7.5 1.25C4.05375 1.25 1.25 4.05375 1.25 7.5C1.25 10.9462 4.05375 13.75 7.5 13.75C10.9462 13.75 13.75 10.9462 13.75 7.5C13.75 4.05375 10.9462 1.25 7.5 1.25ZM7.5 12.5C4.74313 12.5 2.5 10.2569 2.5 7.5C2.5 4.74313 4.74313 2.5 7.5 2.5C10.2569 2.5 12.5 4.74313 12.5 7.5C12.5 10.2569 10.2569 12.5 7.5 12.5Z"
					fill="#222222"
				/>
				<path
					d="M8.125 4.375H6.875V7.75875L8.93313 9.81688L9.81687 8.93313L8.125 7.24125V4.375Z"
					fill="#222222"
				/>
			</svg>,
			'Time',
		],
		orderType.time,
	],
	[
		[
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ marginRight: 5 }}
			>
				<path
					d="M8.12467 12.5094C8.29043 12.5094 8.4494 12.5752 8.56661 12.6924C8.68382 12.8096 8.74967 12.9686 8.74967 13.1344C8.74967 13.3001 8.68382 13.4591 8.56661 13.5763C8.4494 13.6935 8.29043 13.7594 8.12467 13.7594C7.95891 13.7594 7.79994 13.6935 7.68273 13.5763C7.56552 13.4591 7.49967 13.3001 7.49967 13.1344C7.49967 12.9686 7.56552 12.8096 7.68273 12.6924C7.79994 12.5752 7.95891 12.5094 8.12467 12.5094ZM5.93717 11.8844C6.10293 11.8844 6.2619 11.9502 6.37911 12.0674C6.49632 12.1846 6.56217 12.3436 6.56217 12.5094C6.56217 12.6751 6.49632 12.8341 6.37911 12.9513C6.2619 13.0685 6.10293 13.1344 5.93717 13.1344C5.77141 13.1344 5.61244 13.0685 5.49523 12.9513C5.37802 12.8341 5.31217 12.6751 5.31217 12.5094C5.31217 12.3436 5.37802 12.1846 5.49523 12.0674C5.61244 11.9502 5.77141 11.8844 5.93717 11.8844ZM10.3122 11.8844C10.4779 11.8844 10.6369 11.9502 10.7541 12.0674C10.8713 12.1846 10.9372 12.3436 10.9372 12.5094C10.9372 12.6751 10.8713 12.8341 10.7541 12.9513C10.6369 13.0685 10.4779 13.1344 10.3122 13.1344C10.1464 13.1344 9.98744 13.0685 9.87023 12.9513C9.75302 12.8341 9.68717 12.6751 9.68717 12.5094C9.68717 12.3436 9.75302 12.1846 9.87023 12.0674C9.98744 11.9502 10.1464 11.8844 10.3122 11.8844ZM8.12436 3.75282C10.1047 3.75282 11.2281 5.06344 11.3915 6.64656H11.4415C12.7159 6.64656 13.749 7.67688 13.749 8.94813C13.749 10.2194 12.7159 11.2497 11.4415 11.2497H4.80717C3.53279 11.2497 2.49967 10.2194 2.49967 8.94813C2.49967 7.67688 3.53279 6.64656 4.80717 6.64656H4.85717C5.02154 5.05313 6.14404 3.75282 8.12436 3.75282ZM8.12436 4.5325C6.79279 4.5325 5.63217 5.61 5.63217 7.09813C5.63217 7.33406 5.42717 7.51906 5.19217 7.51906H4.74842C3.93779 7.51906 3.28061 8.17969 3.28061 8.99438C3.28061 9.80938 3.93779 10.47 4.74842 10.47H11.5003C12.3109 10.47 12.9681 9.80938 12.9681 8.99438C12.9681 8.17969 12.3109 7.51938 11.5003 7.51938H11.0565C10.8215 7.51938 10.6165 7.33406 10.6165 7.09813C10.6165 5.59094 9.45592 4.5325 8.12436 4.5325ZM2.72123 6.34438C2.758 6.43324 2.76052 6.53258 2.72832 6.6232C2.69611 6.71381 2.63146 6.78928 2.54686 6.835L2.51092 6.85219L1.78842 7.15281C1.69651 7.1902 1.59379 7.19102 1.50129 7.15512C1.40879 7.11922 1.33352 7.04931 1.2909 6.95971C1.24828 6.87011 1.24153 6.7676 1.27203 6.67319C1.30254 6.57878 1.36799 6.4996 1.45498 6.45188L1.49092 6.43469L2.21342 6.13406C2.30865 6.09464 2.41564 6.09465 2.51087 6.13409C2.60609 6.17352 2.68176 6.24917 2.72123 6.34438ZM6.78373 3.33188L6.76436 3.33782C6.47561 3.43219 6.20686 3.55719 5.96123 3.70969C5.62561 3.56768 5.25355 3.53602 4.89876 3.61928C4.54398 3.70255 4.22484 3.89643 3.98744 4.17292C3.75004 4.44941 3.60667 4.7942 3.57803 5.1575C3.54939 5.52079 3.63696 5.88379 3.82811 6.19407C3.59295 6.2781 3.36964 6.39217 3.16373 6.53344C2.87621 6.04103 2.76841 5.46412 2.85873 4.9011C2.94904 4.33809 3.23187 3.82384 3.65898 3.44606C4.08609 3.06829 4.63103 2.85037 5.20086 2.82949C5.77069 2.80861 6.33012 2.98606 6.78373 3.33157V3.33188ZM1.74342 3.38782L1.78311 3.40219L2.50811 3.71125C2.70467 3.79438 2.79904 4.02219 2.71873 4.22C2.64373 4.405 2.44279 4.49813 2.25623 4.44219L2.21686 4.42813L1.49217 4.11875C1.39748 4.07836 1.32238 4.00249 1.28295 3.90739C1.24353 3.8123 1.24291 3.70555 1.28123 3.61C1.35623 3.42532 1.55717 3.33188 1.74373 3.38782H1.74342ZM4.04623 1.45844L4.06342 1.49469L4.36342 2.21532C4.40184 2.30786 4.40322 2.41163 4.36729 2.50516C4.33136 2.5987 4.26085 2.67485 4.17036 2.71787C4.07986 2.76089 3.97629 2.76749 3.88107 2.73631C3.78584 2.70512 3.70625 2.63853 3.65873 2.55032L3.64154 2.51438L3.34154 1.79375C3.30267 1.70114 3.30097 1.59711 3.33679 1.50328C3.37261 1.40944 3.44319 1.33301 3.53389 1.28985C3.62459 1.24669 3.72842 1.24013 3.82383 1.27153C3.91924 1.30292 3.99888 1.36986 4.04623 1.45844ZM6.87373 1.28344C7.06185 1.36157 7.15779 1.56782 7.10185 1.75875L7.08748 1.79938L6.77748 2.51063C6.73821 2.60305 6.66522 2.67704 6.57335 2.71757C6.48147 2.75809 6.37762 2.76211 6.28289 2.72879C6.18816 2.69548 6.10968 2.62734 6.06339 2.53823C6.01711 2.44911 6.0065 2.34572 6.03373 2.24907L6.04811 2.20844L6.35779 1.49719C6.39789 1.40045 6.47476 1.32358 6.57151 1.2835C6.66826 1.24342 6.77696 1.2434 6.87373 1.28344Z"
					fill="#222222"
				/>
			</svg>,
			'Weather',
		],
		orderType.weather,
	],
	[
		[
			<svg
				width="8"
				height="16"
				viewBox="0 0 8 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ marginRight: 5 }}
			>
				<path
					d="M4.00039 4.85078C4.11974 4.85078 4.2342 4.89819 4.31859 4.98258C4.40298 5.06697 4.45039 5.18143 4.45039 5.30078V9.85748C4.87459 9.96701 5.24428 10.2275 5.49016 10.5901C5.73605 10.9527 5.84125 11.3925 5.78605 11.8271C5.73084 12.2617 5.51902 12.6613 5.1903 12.9509C4.86157 13.2405 4.4385 13.4003 4.00039 13.4003C3.56228 13.4003 3.13922 13.2405 2.81049 12.9509C2.48176 12.6613 2.26994 12.2617 2.21474 11.8271C2.15954 11.3925 2.26474 10.9527 2.51062 10.5901C2.75651 10.2275 3.1262 9.96701 3.55039 9.85748V5.30078C3.55039 5.18143 3.5978 5.06697 3.68219 4.98258C3.76659 4.89819 3.88105 4.85078 4.00039 4.85078ZM4.00039 0.800781C3.28431 0.800781 2.59755 1.08524 2.0912 1.59159C1.58486 2.09794 1.30039 2.7847 1.30039 3.50078V9.21938C0.842141 9.73899 0.543557 10.3798 0.440469 11.0649C0.337381 11.75 0.434168 12.4503 0.719216 13.0817C1.00427 13.7132 1.46547 14.249 2.04748 14.6248C2.62949 15.0006 3.30758 15.2006 4.00039 15.2006C4.6932 15.2006 5.3713 15.0006 5.95331 14.6248C6.53532 14.249 6.99652 13.7132 7.28157 13.0817C7.56662 12.4503 7.6634 11.75 7.56032 11.0649C7.45723 10.3798 7.15864 9.73899 6.70039 9.21938V3.50078C6.70039 2.7847 6.41593 2.09794 5.90958 1.59159C5.40323 1.08524 4.71648 0.800781 4.00039 0.800781ZM4.00039 1.70078C4.47778 1.70078 4.93562 1.89042 5.27318 2.22799C5.61075 2.56555 5.80039 3.02339 5.80039 3.50078V9.58028L5.92909 9.71078C6.30114 10.0906 6.55279 10.5717 6.65249 11.0939C6.75219 11.6161 6.6955 12.1562 6.48953 12.6463C6.28355 13.1364 5.93747 13.5548 5.49466 13.8491C5.05186 14.1433 4.53204 14.3003 4.00039 14.3003C3.46875 14.3003 2.94893 14.1433 2.50612 13.8491C2.06332 13.5548 1.71723 13.1364 1.51126 12.6463C1.30529 12.1562 1.24859 11.6161 1.34829 11.0939C1.44799 10.5717 1.69964 10.0906 2.07169 9.71078L2.20039 9.58028V3.50078C2.20039 3.02339 2.39004 2.56555 2.7276 2.22799C3.06517 1.89042 3.523 1.70078 4.00039 1.70078Z"
					fill="#222222"
				/>
			</svg>,
			'Temperature',
		],
		orderType.temperature,
	],
	[
		[
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ marginRight: 5 }}
			>
				<path
					d="M7.5 7.5C9.22589 7.5 10.625 6.10089 10.625 4.375C10.625 2.64911 9.22589 1.25 7.5 1.25C5.77411 1.25 4.375 2.64911 4.375 4.375C4.375 6.10089 5.77411 7.5 7.5 7.5Z"
					stroke="#222222"
					strokeWidth="1.66667"
				/>
				<path
					d="M10.625 8.75H10.845C11.302 8.75013 11.7431 8.9171 12.0856 9.21955C12.4281 9.522 12.6484 9.9391 12.705 10.3925L12.9494 12.345C12.9714 12.5209 12.9557 12.6994 12.9034 12.8688C12.8511 13.0382 12.7634 13.1945 12.6461 13.3274C12.5287 13.4602 12.3845 13.5666 12.2229 13.6395C12.0613 13.7124 11.886 13.75 11.7088 13.75H3.29129C3.11403 13.75 2.93878 13.7124 2.77719 13.6395C2.6156 13.5666 2.47135 13.4602 2.35402 13.3274C2.23669 13.1945 2.14897 13.0382 2.09667 12.8688C2.04436 12.6994 2.02868 12.5209 2.05066 12.345L2.29441 10.3925C2.3511 9.93889 2.57155 9.52161 2.91431 9.21914C3.25707 8.91666 3.69852 8.74982 4.15566 8.75H4.37504"
					stroke="#222222"
					strokeWidth="1.66667"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>,
			'Volunteer',
		],
		orderType.volunteerName,
	],
];

let dataTypeToHeaders = {};
headers.forEach((header) => (dataTypeToHeaders[header[1]] = header[0]));

const downArrow = (
	<svg
		width="11"
		height="12"
		viewBox="0 0 11 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.29751 6.26952L5.60645 10.5785L9.91538 6.26952M5.60645 0.634766V10.5785"
			stroke="#222222"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const upArrow = (
	<svg
		width="11"
		height="12"
		viewBox="0 0 11 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.29751 6.26952L5.60645 10.5785L9.91538 6.26952M5.60645 0.634766V10.5785"
			stroke="#222222"
			strokeLinecap="round"
			strokeLinejoin="round"
			transform="scale(1, -1)"
			style={{ transformOrigin: 'center' }}
		/>
	</svg>
);

export default function InstanceSelection({
	instances,
	filteredInstances,
	setFilteredInstances,
	selectedSet,
	setSelectedSet,
	dataTypeFilter,
	setDataTypeFilter,
	filters,
 	setFilters,
	setShow,
	show,
	post,
	setHeatmapData
}) {
	const [orderBy, setOrderBy] = useState(orderType.dateTime);
	const [sortAscending, setSortAscending] = useState(true);
	const [nextFilterIdx, setNextFilterIdx] = useState(0);
	const [addFilterVisible, setAddFilterVisible] = useState(false);
  if (filters == undefined) {
    [filters, setFilters] = useState([]);
  }
	const [filtersPresent, setFiltersPresent] = useState({
		id: false,
		dateTime: false,
		time: false,
		weather: false,
		temperature: false,
		volunteerName: false,
		dataType: false,
	});

	const getNextFilterIdx = () => {
		setNextFilterIdx((previousIdx) => previousIdx + 1);
		return nextFilterIdx;
	};

	const filterInstances = (instances) => {
		for (let i = 0; i < filters.length; i++) {
			const currentFilter = filters[i];
			if (rangeFilters.includes(currentFilter.type)) {
				if (
					currentFilter.start == null ||
					currentFilter.end == null ||
					currentFilter.start == '' ||
					currentFilter.end == ''
				)
					continue;
				switch (currentFilter.type) {
					case 'dateTime':
						instances = instances.filter((instance) => {
							const instanceDate = new Date(instance.dateTime);
							const startDate = new Date(currentFilter.start);
							const endDate = new Date(currentFilter.end);
							return startDate <= instanceDate && instanceDate <= endDate;
						});
						break;
					default:
						instances = instances.filter(
							(instance) =>
								currentFilter.start <= instance[currentFilter.type] &&
								instance[currentFilter.type] <= currentFilter.end
						);
				}
			} else if (selectionFilters.includes(currentFilter.type)) {
				if (currentFilter.type === 'dataType') continue;
				if (currentFilter.selected.length === 0) continue;
				instances = instances.filter((instance) =>
					currentFilter.selected.includes(instance[currentFilter.type])
				);
			}
		}
		return instances;
	};

	const addFilter = (filterType) => {
		let copy = { ...filtersPresent };
		copy[filterType] = true;
		setFiltersPresent(copy);
		copy = [...filters];
		if (rangeFilters.includes(filterType)) {
			copy.push({
				idx: getNextFilterIdx(),
				type: filterType,
				start: null,
				end: null,
			});
		} else if (selectionFilters.includes(filterType)) {
			copy.push({ idx: getNextFilterIdx(), type: filterType, selected: [] });
		}
		setFilters(copy);
		setAddFilterVisible(false);
	};

	const updateRangeFilter = (idx, start, end) => {
		const filtersCopy = [...filters];
		for (let i = 0; i < filters.length; i++) {
			const currentFilter = filters[i];
			if (currentFilter.idx == idx) {
				currentFilter.start = start;
				currentFilter.end = end;
				break;
			}
		}
		setFilters(filtersCopy);
	};

	const updateSelectionFilter = (idx, selectedValues) => {
		console.log(idx, selectedValues);
		const filtersCopy = [...filters];
		for (let i = 0; i < filters.length; i++) {
			const currentFilter = filters[i];
			if (currentFilter.idx == idx) {
				currentFilter.selected = selectedValues;
				break;
			}
		}
		setFilters(filtersCopy);
	};

	const deleteFilter = (idx, filterType) => {
		let copy = { ...filtersPresent };
		copy[filterType] = false;
		setFiltersPresent(copy);
		copy = [...filters];
		copy = copy.filter((f) => f.idx != idx);
		setFilters(copy);
	};

	useEffect(() => {
		let selectedIds = [...selectedSet];
		let filteredIds = filteredInstances.map((instance) => instance.id);
		selectedIds = selectedIds.filter((id) => filteredIds.includes(id));
		setSelectedSet(new Set(selectedIds));
	}, [filteredInstances]);

	useEffect(() => {
		const orderMult = sortAscending ? 1 : -1;
		let copy = [...instances];
		if (orderBy == orderType.temperature) {
			copy = copy.sort((a, b) => {
				return orderMult * (a[orderBy] - b[orderBy]);
			});
		} else {
			copy = copy.sort((a, b) => {
				return orderMult * a[orderBy].localeCompare(b[orderBy]);
			});
		}
		setFilteredInstances(filterInstances(copy));
	}, [filters, orderBy, sortAscending]);

	const setTableOrder = (orderT) => {
		if (orderBy != orderT) {
			setSortAscending(true);
			setOrderBy(orderT);
		} else {
			setSortAscending(!sortAscending);
		}
	};

	let instanceRows = filteredInstances.map((instance) => {
		const isSelected = selectedSet.has(instance.id);
		const paddings = {
			padding: 10,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		};
		return (
			<tr
				key={instance.id}
				style={{
					height: 40,
					borderBottom: '0.5px solid #B3B3B3',
					backgroundColor: isSelected ? 'rgba(141, 190, 64, 0.2)' : 'white',
				}}
			>
				<td
					style={{
						...paddings,
						borderTopRightRadius: 15,
						borderBottomRightRadius: 15,
						backgroundColor: '#8DBE4080',
					}}
				>
					<input
						checked={selectedSet.has(instance.id)}
						type="checkbox"
						onChange={() => {
							const newSet = new Set(selectedSet);
							if (newSet.has(instance.id)) {
								newSet.delete(instance.id);
							} else {
								newSet.add(instance.id);
							}
							setSelectedSet(newSet);
						}}
						style={{
							verticalAlign: 'middle',
							display: 'inline',
							width: 18,
							height: 18,
						}}
					/>
					<p
						style={{
							width: '70%',
							display: 'inline',
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							marginLeft: 10,
							verticalAlign: 'middle',
						}}
					>
						{instance.id}
					</p>
				</td>
				<td style={{ ...paddings }}>
					{moment(instance.dateTime).format('DD MMM,  YYYY')}
				</td>
				<td style={{ ...paddings }}>
					{moment(instance.time, 'hh').format('LT')}
				</td>
				<td style={{ ...paddings }}>{instance.weather}</td>
				<td style={{ ...paddings }}>{instance.temperature + "˚F"}</td>
				<td
					style={{
						...paddings,
					}}
				>
					<p
						style={{
							width: '80%',
							display: 'inline-block',
							textOverflow: 'ellipsis',
							overflow: 'hidden',
						}}
					>
						{instance.volunteerName}
					</p>
				</td>
			</tr>
		);
	});

	let headerRow = headers.map((header) => {
		const [headerName, headerOrderType] = header;
		if (headerOrderType === orderType.id) {
			return (
				<th
					key={headerName[1]}
					style={{
						width: '15%',
						height: 15,
						textAlign: 'left',
						boxShadow: 'inset 0px -1px 0px 0px #221F20',
						background: 'white',
					}}
					id={headerOrderType}
				>
					<input
						checked={selectedSet.size == filteredInstances.length}
						type="checkbox"
						style={{
							marginLeft: 10,
							width: 18,
							height: 18,
						}}
						onChange={() => {
							if (selectedSet.size == filteredInstances.length) {
								setSelectedSet(new Set());
							} else {
								const newSet = new Set();
								filteredInstances.forEach((instance) =>
									newSet.add(instance.id)
								);
								setSelectedSet(newSet);
							}
						}}
					/>
					<button
						style={{
							border:
								orderBy === headerOrderType ? '1px solid #B3B3B3' : 'none',
							background: 'none',
							borderRadius: '30px',
							height: 35,
							paddingRight: 5,
							fontWeight: 600,
							fontSize: 14,
							paddingLeft: 10,
							paddingRight: 10,
							marginLeft: '5%',
						}}
						onClick={() => setTableOrder(headerOrderType)}
					>
						<p
							style={{
								display: 'inline-block',
								maxWidth: '100%',
								overflow: 'hidden',
								// textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{headerName[0]}
							{headerName[1]}
						</p>
						<a
							style={{
								marginLeft: 5,
								position: 'relative',
								bottom: 1,
							}}
						>
							{orderBy == headerOrderType &&
								(sortAscending ? upArrow : downArrow)}
						</a>
					</button>
				</th>
			);
		}
		return (
			<th
				key={headerName[1]}
				style={{
					width: '15%',
					height: 15,
					textAlign: 'left',
					boxShadow: 'inset 0px -1px 0px 0px #221F20',
					background: 'white',
				}}
				id={headerOrderType}
			>
				<button
					style={{
						border: orderBy === headerOrderType ? '1px solid #B3B3B3' : 'none',
						background: 'none',
						borderRadius: '30px',
						height: 35,
						paddingLeft: 5,
						paddingRight: 5,
						fontWeight: 600,
						fontSize: 14,
						width: '90%',
						marginLeft: '5%',
					}}
					onClick={() => setTableOrder(headerOrderType)}
				>
					<p
						style={{
							display: 'inline-block',
							maxWidth: '80%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{headerName[0]}
						{headerName[1]}
					</p>
					<a
						style={{
							marginLeft: 5,
							position: 'relative',
							bottom: 1,
						}}
					>
						{orderBy == headerOrderType &&
							(sortAscending ? upArrow : downArrow)}
					</a>
				</button>
			</th>
		);
	});

	const filterComponents = filters.map((filter) => {
		if (selectionFilters.includes(filter.type)) {
			let selectionValues = {};
			switch (filter.type) {
				case 'weather':
					weatherTypes.forEach((weather) => (selectionValues[weather] = 0));
					filteredInstances.forEach((i) => {
						if (weatherTypes.includes(i.weather))
							selectionValues[i.weather] += 1;
						else selectionValues['Other'] += 1;
					});
					break;
				case 'dataType':
					positionTypes.forEach(
						(positionType) => (selectionValues[positionType] = null)
					);
					break;
				default:
					filteredInstances.forEach((i) => {
						if (!(i[filter.type] in selectionValues))
							selectionValues[i[filter.type]] = 0;
						selectionValues[i[filter.type]] += 1;
					});
			}
			if (filter.type === 'dataType') {
				return (
					<SelectionFilter
						label={'Position type'}
						type={filter.type}
						selectionValues={selectionValues}
						deleteFilter={() => deleteFilter(filter.idx, filter.type)}
						updateFilter={(selectedValues) => {
							setDataTypeFilter(selectedValues);
						}}
						key={filter.idx}
					/>
				);
			} else {
				return (
					<SelectionFilter
						label={dataTypeToHeaders[filter.type]}
						type={filter.type}
						selectionValues={selectionValues}
						deleteFilter={() => deleteFilter(filter.idx, filter.type)}
						updateFilter={(selectedValues) => {
							updateSelectionFilter(filter.idx, selectedValues);
						}}
						key={filter.idx}
					/>
				);
			}
		} else if (rangeFilters.includes(filter.type))
			return (
				<RangeFilter
					label={dataTypeToHeaders[filter.type]}
					type={filter.type}
					initialStart={filter.start}
					initialEnd={filter.end}
					updateFilter={(start, end) =>
						updateRangeFilter(filter.idx, start, end)
					}
					deleteFilter={() => deleteFilter(filter.idx, filter.type)}
				/>
			);
		else return <div>error</div>;
	});

	const onClick = (callback) => {
		const ref = useRef();

		useEffect(() => {
			const handleClick = (event) => {
				if (ref.current && !ref.current.contains(event.target)) {
					callback();
				}
			};

			document.addEventListener('click', handleClick);

			return() => {
				document.removeEventListener('click', handleClick);
			};
		}, [ref]);

		return ref;
	}

	const handleClick = () =>  {
		setAddFilterVisible(false);
	}

	const ref = onClick(handleClick);

	return (
		<div
			className={styles.container}
			style={{
				display: 'flex',
				flexDirection: 'column',
				fontFamily: 'var(--raleway, sans-serif)',
				paddingLeft: "30px",
				paddingRight: "30px",
			}}
		>
			<div
				style={{
					position: 'relative',
				}}
			>
			{show ?
				<div className={styles.closeButton}><AiOutlineCloseCircle onClick={() => setShow(false)} /></div> : <></>
			}
				<div
					className={styles.noScrollBar}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						height: 50,
						width: '100%',
						position: 'relative',
						zIndex: '10'
					}}
				>
					<p style={{ fontWeight: 600, fontSize: 18, marginRight: 5 }}>
						Filter
					</p>

					{filterComponents.length === 0 ? (
						<div className={styles.categoryPlaceholderContainer}>Category</div>
					) : (
						filterComponents
					)}
					<div ref={ref}>
						{filters.length < 6 && (
							<button
								style={{
									backgroundColor: 'rgba(34, 31, 32, 1)',
									width: 25,
									height: 25,
									borderRadius: 15,
									paddingTop: 3,
									marginLeft: 5,
									border: '1px solid #221F20',
									position: 'relative',
								}}
								onClick={() => {
									setAddFilterVisible((addFilterVisible) => !addFilterVisible);
								}}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 18 18"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 17V9M9 9V1M9 9H17M9 9H1"
										stroke="white"
										strokeWidth="1.66667"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						)}
						{addFilterVisible && (
							<div className={styles.addFilterModal}>
								<div
									style={{
										border: '1px solid #58595B',
										borderRadius: 30,
										width: '92%',
										marginLeft: '4%',
										marginTop: 5,
										padding: 5,
										fontWeight: 600,
										fontSize: 14,
										color: '#B3B3B3',
									}}
								>
									Filter by
								</div>
								{[...headers, ['dataType', 'dataType']].map((header) => {
									const [headerName, headerDataType] = header;
									if (headerName[1] === '#ID' || filtersPresent[headerDataType])
										return;
									return (
										<button
											className={`${styles.greyHover} ${styles.addFilterButton}`}
											onClick={() => addFilter(headerDataType)}
										>
											{headerName}
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				style={{
					height: '65vh',
					overflow: 'hidden',
					overflowY: 'scroll',
					border: '1px solid #221F20',
					borderRadius: 10,
					backgroundColor: 'white',
					position: 'relative',
					zIndex: '5'
				}}
			>
				<table
					style={{
						width: '100%',
						alignSelf: 'center',
						tableLayout: 'fixed',
						borderCollapse: 'collapse',
						fontFamily: 'var(--raleway, sans-serif)',
						fontWeight: 600,
						fontSize: 14,
						borderSpacing: '0px 1px',
					}}
					cellPadding={0}
					cellSpacing={0}
				>
					<thead
						style={{
							position: 'sticky',
							top: 0,
							background: 'white',
						}}
					>
						<tr
							style={{
								height: 50,
							}}
						>
							{headerRow}
						</tr>
					</thead>
					<tbody>{instanceRows}</tbody>
				</table>
			</div>
			{show ?
				<div className={styles.editingButton} onClick={() => post()}>
					<div className={styles.buttonCreate}>
						EDIT HEATMAP
					</div>
				</div>
				:
				<></>
			}
		</div>
	);
}
