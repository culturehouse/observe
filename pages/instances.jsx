// previously called mapping.jsx
import Head from 'next/head'
import { useState, useEffect } from 'react';
import moment from 'moment/moment';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import ObserveLogo from "../components/ObserveLogo";
import CreateButton from "../components/CreateButton";

import istyles from "../styles/instances.module.css"
import { HiArrowLeft } from "react-icons/hi"
import { BsClock, BsCalendarEvent, BsSun, BsThermometerHalf, BsPerson, BsArrowDown, BsArrowUp, BsChevronRight } from "react-icons/bs"
import { BiMapPin } from "react-icons/bi"
import Crumbs from '../components/Crumbs';
import { AiOutlineCloseCircle } from "react-icons/ai"
import NoAccess from '../components/NoAccess';
import PleaseLogin from "../components/PleaseLogin"
import { Loading } from '@nextui-org/react';
import LoadingPage from '../components/LoadingPage';
import BackgroundBottom2 from '../components/BackgroundBottom2';


const orderType = { id: 'id', dateTime: 'dateTime', time: 'time', weather: 'weather',
					temperature: 'temperature', volunteerName: 'volunteerName' };


export default function Instances() {
	const [orderBy, setOrderBy] = useState(orderType.dateTime);
	const [orderedInstances, setOrderedInstances] = useState([]);
	const [sortAscending, setSortAscending] = useState(true);
 	const [fetched, setFetched] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [canAccess, setCanAccess] = useState(false)
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { id } = router.query;

	useEffect (() => {
		// previous fetch for reference:
		//const response = fetch(`http://localhost:3001/view_event/${id}`, {
		// while (!id) {
		// 	console.log("hi");
		// }
		if (id && !fetched) {
		const response = fetch(`/api/instances/${id}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			method: 'GET',
			}).then((data) => data.json()).then((r) => 
			{	
				setLoggedIn(r.loggedIn)
				setCanAccess(r.access)
				if (r.loggedIn && r.access) {
					setOrderedInstances(r.instances);
					setFetched(true);
				}
				setLoading(false)
			});
		}

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

	},[router, orderBy, sortAscending]);

	const removeInstance = (my_id, is_deleting) => {
		console.log(my_id)
		if (!is_deleting) {
			router.push(`/view_instance?id=` + my_id + "&eventId=" + router.query.eventId + "&eventName=" + router.query.eventName + "&projId=" + router.query.projId + "&projName=" + router.query.projName)
			return;
		} else {
			setDeleting(true);
			const response = fetch(`/api/instances/delete_instance/${my_id}`, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				method: 'DELETE',
			}).then((data) => data.json()).then((r) => {
				if (!r.success) {
					alert(r.message)
					setDeleting(false)
					window.location.reload(false);

				} else {
					window.location.reload(false);

				}
			})
		}
	}

	console.log(orderedInstances);

	const setTableOrder = (orderT) => {
		if (orderBy != orderT) {
			setSortAscending(true);
			setOrderBy(orderT);
		} else {
			setSortAscending(!sortAscending);
		}
	};

	if (loading) {
		return <LoadingPage/>
	}

	if (!loggedIn) {
		return <PleaseLogin></PleaseLogin>
	}

	if (!canAccess) {
		return <NoAccess/>
	}

	return (
	  <div className={istyles.container}>
		<Head>
			<title>
				Instances | Observe
			</title>
		</Head>
		<BackgroundBottom2></BackgroundBottom2>
		{/* <Image className={istyles.tri}
			src={"/InstancesTriangle.png"}
			height={400}
			width={177.8}
			style={{ alignSelf: 'center' }}
		/>
		<Image className={istyles.circle}
			src={"/InstancesCircle.png"}
			height={110}
			width={500}
			style={{ alignSelf: 'center' }}
		/> */}
		<div className={istyles.border}>
		  {/* <h2 className={istyles.observe}><BiMapPin />Observe</h2> */}
		  <ObserveLogo />
		  <div className={istyles.backCreate}>
			<div className={istyles.back}>
				<Crumbs crumbs={{ np: "",
								  event: { id: router.query.eventId, name: router.query.eventName },
								  proj: { id: router.query.projId, name: router.query.projName }}}
					    ending={"Instances"} >
				</Crumbs>
			</div>

			{/* {id ?
			<Link href={`/view_event?id=${id}`} className={istyles.back}>
				<HiArrowLeft />
			</Link>
			:
			<Link href={`/view_event?id=`} className={istyles.back}>
				<HiArrowLeft />
			</Link>} */}
			<CreateButton id={id} param={JSON.stringify(router.query)}/>
		  </div>
		  <h1 className={istyles.maintitle}>Activity mapping</h1>
		  <p className={istyles.subtitle}>Instances</p>
		  <div className={istyles.table}>
			<div className={istyles.headers}>
				{orderBy != orderType.id ? <p className={istyles.header} onClick={() => setTableOrder(orderType.id)}>#ID {orderBy == orderType.id && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
										 : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.id)}>#ID {orderBy == orderType.id && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				{orderBy != orderType.dateTime ? <p className={istyles.header} onClick={() => setTableOrder(orderType.dateTime)}><BsCalendarEvent /> Date {orderBy == orderType.dateTime && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
										       : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.dateTime)}><BsCalendarEvent /> Date {orderBy == orderType.dateTime && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				{orderBy != orderType.time ? <p className={istyles.header} onClick={() => setTableOrder(orderType.time)}><BsClock /> Time {orderBy == orderType.time && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
										   : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.time)}><BsClock /> Time {orderBy == orderType.time && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				{orderBy != orderType.weather ? <p className={istyles.header} onClick={() => setTableOrder(orderType.weather)}><BsSun /> Weather {orderBy == orderType.weather && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
										      : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.weather)}><BsSun /> Weather {orderBy == orderType.weather && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				{orderBy != orderType.temperature ? <p className={istyles.header} onClick={() => setTableOrder(orderType.temperature)}><BsThermometerHalf /> Temperature {orderBy == orderType.temperature && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
								                  : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.temperature)}><BsThermometerHalf /> Temperature {orderBy == orderType.temperature && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				{orderBy != orderType.volunteerName ? <p className={istyles.header} onClick={() => setTableOrder(orderType.volunteerName)}><BsPerson /> Volunteer {orderBy == orderType.volunteerName && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p>
										            : <p className={istyles.activeHeader} onClick={() => setTableOrder(orderType.volunteerName)}><BsPerson /> Volunteer {orderBy == orderType.volunteerName && (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}</p> }
				<div />
			</div>
			<div className={istyles.rows}>
				{orderedInstances.length > 0 ?
				orderedInstances.map((instance, i) => {
					return (
						<div
							// href={(deleting ? "" : `/view_instance?id=` + instance.id + "&eventId=" + router.query.eventId + "&eventName=" + router.query.eventName + "&projId=" + router.query.projId + "&projName=" + router.query.projName)}
						className={istyles.link}
						key={i}>
							<div className={istyles.row} >
								<p className={istyles.idField} onClick={() => { removeInstance(instance.id, false) }}>{instance.id}</p>
								<p className={istyles.field} onClick={() => { removeInstance(instance.id, false) }}>{moment(instance.dateTime).format('DD MMM,  YYYY')}</p>
								<p className={istyles.field} onClick={() => { removeInstance(instance.id, false) }}>{moment(instance.time, 'hh').format('LT')}</p>
								<p className={istyles.field} onClick={() => { removeInstance(instance.id, false) }}>{instance.weather}</p>
								<p className={istyles.field} onClick={() => { removeInstance(instance.id, false) }}>{instance.temperature}</p>
								<p className={istyles.field} onClick={() => { removeInstance(instance.id, false) }}>{instance.volunteerName}</p>
							<BsChevronRight className={istyles.rightArrow} style={{fontSize: "12px"}}/>
							{deleting ?
									<AiOutlineCloseCircle disabled className={istyles.closeButton} style={{ fontSize: "20px" }} onClick={() => removeInstance(instance.id, true)}></AiOutlineCloseCircle>
								:
									<AiOutlineCloseCircle className={istyles.closeButton} style={{ fontSize: "20px" }} onClick={() => {removeInstance(instance.id, true)}}></AiOutlineCloseCircle>
							}
						</div>
					</div>);
				})
				:
				<p className={istyles.noInstances}>No instances yet - click "Create" -{">"} "New instance"  to get started!</p>}
			</div>
		  </div>
		</div>
	  </div>
	);
}


