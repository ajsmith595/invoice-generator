import Viewer from './Viewer';
import Form from './Form';
import Home from './Home';
import { Login } from './Login';
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseProvider, useFirebase } from './utils/firebaseContext';
import { auth } from './utils/firebase';
import React, { useEffect, useState } from 'react';
import { ChangeDetails } from './ChangeDetails';
import { Button } from './Common';
import Modal from 'react-modal';
enum Stage {
	Loading,
	LoggedIn,
	LoggedOut
}

Modal.setAppElement('#root');

export default function App() {
	return <div className="App">
		<FirebaseProvider>
			<FirebaseApp />
		</FirebaseProvider>
	</div>;
}


interface ConditionalRouteProps {
	component: () => JSX.Element;
	condition: boolean;
	redirect: string;
	random: number;
}
function ConditionalRoute(props: ConditionalRouteProps) {

	const navigate = useNavigate();
	useEffect(() => {
		if (!props.condition) {
			navigate(props.redirect);
		}
	}, [props.random]);
	if (props.condition) {
		return <props.component />
	}
	return <p>Redirecting...</p>;
}

function LeftPanel() {
	const navigate = useNavigate();
	const location = useLocation();

	if (location.pathname === '/') {
		return <></>
	}
	return (
		<div className='absolute w-1/4 left-0 top-0 exclude-printing'>
			<Button variant='blank' className='float-right mr-10' onClick={() => window.history.back()}>Back</Button>
			<Button onClick={() => navigate('/home')} variant='success'>Home</Button>
			<Button onClick={() => navigate('/details')} variant='submit'>Change Details</Button>
		</div>
	);
}

function FirebaseApp() {
	const { loadingState, user } = useFirebase();

	if (!loadingState) {
		return <p>Loading...</p>;
	}
	const isLoggedIn = !!user;

	const loggedInRoute = (component: () => JSX.Element, invert = false, route = '/') => <ConditionalRoute random={Math.random()} component={component} condition={invert ? !isLoggedIn : isLoggedIn} redirect={route} />;
	return <div className='div-wrapper mt-3 relative'>
		<HashRouter>
			<LeftPanel />
			<div className="mx-auto w-1/2 div-wrapper">
				<Routes>
					<Route element={loggedInRoute(Login, true, '/home')} path='/' />
					<Route element={loggedInRoute(Form)} path='/edit/:id' />
					<Route element={loggedInRoute(Home)} path='/home' />
					<Route element={loggedInRoute(ChangeDetails)} path='/details' />
					<Route element={loggedInRoute(Viewer)} path='/view/:id' />
				</Routes>
			</div>
		</HashRouter>
	</div>;
}

