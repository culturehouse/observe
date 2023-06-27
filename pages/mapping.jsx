// legacy from development, not necessary

import Head from 'next/head';
import clientPromise from '../lib/mongodb';
import { useState, useEffect } from 'react';
import moment from 'moment/moment';

import axios from 'axios';

import styles from '../styles/index.module.css';

export async function getServerSideProps(context) {
	try {
		await clientPromise;
		// `await clientPromise` will use the default database passed in the MONGODB_URI
		// However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
		//
		// `const client = await clientPromise`
		// `const db = client.db("myDatabase")`
		//
		// Then you can execute queries against your database like so:
		// db.find({}) or any of the MongoDB Node Driver commands
		const instances = await axios
			.get('http://localhost:3001/instances')
			.then((response) => response.data);

		return {
			props: { isConnected: true, instances },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { isConnected: false },
		};
	}
}

const orderType = {
	id: 'id',
	dateTime: 'dateTime',
	time: 'time',
	weather: 'weather',
	temperature: 'temperature',
	volunteerName: 'volunteerName',
};

const headers = [
	['#ID', orderType.id],
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
					stroke-width="1.66667"
				/>
				<path
					d="M10.625 8.75H10.845C11.302 8.75013 11.7431 8.9171 12.0856 9.21955C12.4281 9.522 12.6484 9.9391 12.705 10.3925L12.9494 12.345C12.9714 12.5209 12.9557 12.6994 12.9034 12.8688C12.8511 13.0382 12.7634 13.1945 12.6461 13.3274C12.5287 13.4602 12.3845 13.5666 12.2229 13.6395C12.0613 13.7124 11.886 13.75 11.7088 13.75H3.29129C3.11403 13.75 2.93878 13.7124 2.77719 13.6395C2.6156 13.5666 2.47135 13.4602 2.35402 13.3274C2.23669 13.1945 2.14897 13.0382 2.09667 12.8688C2.04436 12.6994 2.02868 12.5209 2.05066 12.345L2.29441 10.3925C2.3511 9.93889 2.57155 9.52161 2.91431 9.21914C3.25707 8.91666 3.69852 8.74982 4.15566 8.75H4.37504"
					stroke="#222222"
					stroke-width="1.66667"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>,
			'Volunteer',
		],
		orderType.volunteerName,
	],
];

export default function Mapping({ instances }) {
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
				stroke-linecap="round"
				stroke-linejoin="round"
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

	const [user, setUser] = useState('');
	const [pass, setPass] = useState('');

	const [orderBy, setOrderBy] = useState(orderType.dateTime);
	const [orderedInstances, setOrderedInstances] = useState(instances);
	const [sortAscending, setSortAscending] = useState(true);

	useEffect(() => {
		setOrderedInstances((orderedInstances) => {
			const orderMult = sortAscending ? 1 : -1;
			const copy = [...orderedInstances];
			if (orderBy == orderType.temperature) {
				return copy.sort((a, b) => {
					return orderMult * (a[orderBy] - b[orderBy]);
				});
			} else {
				return copy.sort((a, b) => {
					return orderMult * a[orderBy].localeCompare(b[orderBy]);
				});
			}
		});
	}, [orderBy, sortAscending]);

	const setTableOrder = (orderT) => {
		if (orderBy != orderT) {
			setSortAscending(true);
			setOrderBy(orderT);
		} else {
			setSortAscending(!sortAscending);
		}
	};

	const paddings = {
		padding: 10,
		fontSize: 20,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		backgroundColor: 'white',
	};

	let instanceRows = orderedInstances.map((instance) => (
		<tr key={instance.id} style={{ height: 85 }}>
			<td
				style={{
					...paddings,
					borderTopLeftRadius: 30,
					borderBottomLeftRadius: 30,
					backgroundColor: '#8DBE4080',
				}}
			>
				{instance.id}
			</td>
			<td style={{ ...paddings }}>
				{moment(instance.dateTime).format('DD MMM,  YYYY')}
			</td>
			<td style={{ ...paddings }}>
				{moment(instance.time, 'hh').format('LT')}
			</td>
			<td style={{ ...paddings }}>{instance.weather}</td>
			<td style={{ ...paddings }}>{instance.temperature}</td>
			<td
				style={{
					...paddings,
					borderTopRightRadius: 30,
					borderBottomRightRadius: 30,
				}}
			>
				<text
					style={{
						width: '80%',
						display: 'inline-block',
						textOverflow: 'ellipsis',
						overflow: 'hidden',
					}}
				>
					{instance.volunteerName}
				</text>
				<svg
					width="10"
					height="16"
					viewBox="0 0 10 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					onClick={() => console.log(instance.id + ' was clicked')}
					style={{ marginLeft: 10 }}
				>
					<path
						d="M0.321567 1.7532L7.93407 8.0007L0.321567 14.2482C0.185282 14.3598 0.108984 14.5097 0.108984 14.6657C0.108984 14.8217 0.185282 14.9716 0.321567 15.0832C0.387761 15.1372 0.46677 15.1802 0.553967 15.2095C0.641164 15.2388 0.734797 15.2539 0.829379 15.2539C0.923962 15.2539 1.01759 15.2388 1.10479 15.2095C1.19199 15.1802 1.271 15.1372 1.33719 15.0832L9.43719 8.43695C9.5794 8.32023 9.65899 8.16369 9.65899 8.0007C9.65899 7.83771 9.5794 7.68117 9.43719 7.56445L1.33875 0.918198C1.27251 0.863769 1.19331 0.820507 1.10582 0.790968C1.01834 0.761429 0.924339 0.746211 0.829379 0.746211C0.73442 0.746211 0.640423 0.761429 0.552937 0.790968C0.465451 0.820507 0.386248 0.863769 0.320004 0.918198C0.183719 1.02982 0.107422 1.17966 0.107422 1.3357C0.107422 1.49173 0.183719 1.64158 0.320004 1.7532H0.321567Z"
						fill="#222222"
					/>
				</svg>
			</td>
		</tr>
	));

	let headerRow = headers.map((header) => {
		const [headerName, headerOrderType] = header;
		return (
			<th style={{ width: '15%', textAlign: 'left' }} id={headerOrderType}>
				<button
					className={styles.tableHeaderButton}
					onClick={() => setTableOrder(headerOrderType)}
				>
					{headerName}
					<a style={{ marginLeft: 10 }}>
						{orderBy == headerOrderType &&
							(sortAscending ? upArrow : downArrow)}
					</a>
				</button>
			</th>
		);
	});

	return (
		<div
			className={styles.container}
			style={{
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: '#E5E5E5',
				fontFamily: 'var(--raleway, sans-serif)',
			}}
		>
			<h1
				style={{
					alignSelf: 'center',
					fontSize: 40,
					fontWeight: 900,
				}}
			>
				Activity Mapping
			</h1>
			<button
				style={{
					alignSelf: 'end',
					width: '17%',
					marginRight: 100,
					height: 49,
					fontSize: 16,
					fontWeight: 600,
					color: '#FFFFFF',
					backgroundColor: '#221F20',
					borderRadius: 30,
					fontFamily: 'var(--raleway, sans-serif)',
				}}
			>
				CREATE NEW INSTANCE
			</button>

			<table
				style={{
					width: '90vw',
					alignSelf: 'center',
					tableLayout: 'fixed',
					borderCollapse: 'separate',
					fontFamily: 'var(--raleway, sans-serif)',
					fontWeight: 600,
					fontSize: 14,
					borderSpacing: '0 10px',
				}}
				cellPadding={0}
				cellSpacing={0}
			>
				<thead>
					<tr style={{ margin: 10, height: 50 }}>{headerRow}</tr>
				</thead>
				<tbody>{instanceRows}</tbody>
			</table>
		</div>
	);
}
