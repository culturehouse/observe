import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/index.module.css';
import { FiX } from "react-icons/fi"

export default function SelectionFilter({
	label,
	type,
	selectionValues: sv,
	updateFilter,
	deleteFilter,
}) {
	const [modalVisible, setModalVisible] = useState(true);
	const [selected, setSelected] = useState([]);
	const [selectionValues, setSelectionValues] = useState(sv);

	useEffect(() => {
		updateFilter(selected);
	}, [selected]);

	const selectionComponents = Object.keys(selectionValues).map((key) => {
		const [hover, setHover] = useState(false);
		return (
			<div
				style={{
					flexDirection: 'row',
					display: 'flex',
					alignItems: 'center',
					backgroundColor: selected.includes(key)
						? 'rgba(179, 179, 179, 0.5)'
						: hover
						? 'rgba(179, 179, 179, 0.2)'
						: 'white',
					height: 25,
					fontSize: 14,
					fontWeight: 600,
					paddingLeft: 30,
					paddingRight: 30,
					cursor: 'pointer', 
				}}
				onMouseEnter={() => {
					setHover(true);
				}}
				onMouseLeave={() => {
					setHover(false);
				}}
				onClick={() => {
					let copy = [...selected];
					if (copy.includes(key)) {
						copy = copy.filter((c) => c != key);
					} else {
						copy.push(key);
					}
					setSelected(copy);
				}}
				key={key}
			>
				<p
					style={{
						fontStyle: 'normal',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '60%',
						marginRight: 5,
					}}
				>
					{key}
				</p>
				{selectionValues[key] !== null && <p>({selectionValues[key]})</p>}
			</div>
		);
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
		setModalVisible(!modalVisible);
	}

	const ref = onClick(handleClick);

	return (
		<div ref={ref}>
			<div
				className={styles.categoryFilterContainer}
				
				onClick={() => {
					setModalVisible(true);
				}}
			>
				<button className={styles.filterCategoryButton}>
					{label}
				</button>
				<button onClick={deleteFilter} className={styles.deleteFilterButton}>
					<FiX />
				</button>
			</div>
			{modalVisible && (
				<div className={styles.selectionEditFilterModal}>
					<div
						style={{
							height: '25px',
							marginLeft: '5%',
							marginTop: '2%',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<p style={{ marginLeft: 5, color: '#B3B3B3', fontSize: 15 }}>
							Select one or more options
						</p>
					</div>
					{selectionComponents}
				</div>
			)}
		</div>
	);
}
