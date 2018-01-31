import * as React from 'react';
import { Route, Switch } from 'react-router';
import { AdminComponent } from '../components/containers/admin/admin.component';
import { LoginComponent } from '../components/auth/login.component';
import { DCM_CONFIG } from '../settings/config';

export const routerSwitch = (props) => (
	<Switch>
		<Route
			path={'/admin/dashboard'}
			render={
				(routing) => {
					return (
						<AdminComponent
							{...{
								session: localStorage.getItem(DCM_CONFIG.sessionKey),
								jwt: localStorage.getItem(DCM_CONFIG.jwtKey)
							}}
							{...routing}
						/>
					);
				}
			}
		/>
		<Route
			path={'/admin'}
			render={
				(routing) => {
					return (
						<LoginComponent
							{...routing}
						/>
					);
				}
			}
		/>
		<Route
			path={'/'}
			render={
				() => {
					return props.renderPrimaryLayout();
				}
			}
		/>
	</Switch>
);
