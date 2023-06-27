import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/index.module.css';

const inputTypeDict = { temperature: 'number', dateTime: 'date', time: 'time' };

export default function RangeFilter({
	label,
	type,
	initialStart,
	initialEnd,
	updateFilter,
	deleteFilter,
}) {
	const [modalVisible, setModalVisible] = useState(true);
	const [start, setStart] = useState(initialStart);
	const [end, setEnd] = useState(initialEnd);
	const inputType = inputTypeDict[type];

	useEffect(() => {
		updateFilter(start, end);
	}, [start, end]);

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
		setModalVisible(!modalVisible);
	}

	const ref = onClick(handleClick);

	return (
		<div style={{ display: 'relative' }} ref={ref}>
			<div className={styles.categoryFilterContainer}>
				<button
					className={styles.filterCategoryButton}

					onClick={() => {
						setModalVisible(true);
					}}
				>
					{label}
				</button>
				<button className={styles.deleteFilterButton} onClick={deleteFilter}>
					X
				</button>
			</div>
			{modalVisible && (
				<div className={styles.rangeEditFilterModal}>
					<p style={{ fontSize: 20 }}>Minimum</p>
					<input
						value={start}
						type={inputType}
						onChange={(e) => {
							setStart(e.target.value);
						}}
						style={{
							border: '1px solid #b3b3b3',
							display: 'flex',
							alignSelf: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							fontFamily: 'var(--raleway, sans-serif)',
							fontStyle: 'normal',
							width: '85px',
							height: '25px',
							borderRadius: 30,
							marginTop: '2px',
							marginBottom: '2px'
						}}
					></input>
					<p style={{fontSize: 20}}>Maximum</p>
					<input
						value={end}
						type={inputType}
						onChange={(e) => {
							setEnd(e.target.value);
						}}
						style={{
							border: '1px solid #b3b3b3',
							display: 'flex',
							alignSelf: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							fontFamily: 'var(--raleway, sans-serif)',
							fontStyle: 'normal',
							width: '85px',
							height: '25px',
							borderRadius: 30,
							marginTop: '2px',
							marginBottom: '2px'
						}}
					></input>
				</div>
			)}
		</div>
	);
}
