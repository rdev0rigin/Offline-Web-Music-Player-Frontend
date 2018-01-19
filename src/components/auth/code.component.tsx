// import * as React from 'react';
// import {responseSocket$} from "../../services/web-socket.service";
//
// export class CodeComponent extends React.Component {
// 	private code: string;
//
// 	public constructor(public props) {
// 		super(props);
// 	}
//
// 	public componentDidMount() {
// 		this.code = this.props.routing.match.params.code;
// 	}
//
// 	private sendResopnse(payload, sessionId){
// 		responseSocket$('VALIDATE_CODE', {}, ()=>{})
// 	}
//
// 	render(){
// 		return (
// 			<div
// 				className="code-component"
// 			>
// 				<div
// 					className="message-box"
// 				>
// 					Loading . . . .
// 				</div>
// 			</div>
// 		)
// 	}
//
// }
