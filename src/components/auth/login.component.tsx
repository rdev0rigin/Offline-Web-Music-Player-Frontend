import * as React from 'react' ;
import { loginHandler } from '../../services/admin.services';
import { DCM_CONFIG } from '../../settings/config';

export class LoginComponent extends React.Component {
	private userName = '';
	private password = '';

	constructor(public props) {
		// noinspection TypeScriptValidateTypes
		super(props);
	}

	public render(): any {
		return(
			<div
				className="login-component">
				<form
					className="sign-in-form">
					<label>User Name</label>
					<input
						onChange={(e) => this.userName = e.target.value}
						type="text"
						id="User-Name"
					/>
					<label>
						Password
					</label>
					<input
						onChange={(e) => {this.password = e.target.value}}
						type="password" id="Password"
					/>
					<div
						className="local-submit button"
						onClick={(e) => {
							e.preventDefault();
							this.onLogin ();
						}}
						id="Submit-Login"
					>
						Log-In
					</div>
				</form>
			</div>
		);
	}

	private onLogin(): void {
		console.log('calling login');
		loginHandler(
			{
				userName: this.userName,
				pwd: this.password
			},
			(response) => {
			if (response.ok) {
				localStorage.setItem(DCM_CONFIG.jwtKey, response.payload.jwt);
				console.log('login response', response);
				this.props.history.push('/admin/dashboard');
			} else {
				alert('Error Logging In');
			}
		});
	}
}
