import * as React from 'react';
import { ContactFormData, NEW_CONTACT_DATA } from '../../../models/form.model';

export const ContactComponent = (props: {
	onSubmit: () => void;
	onChange: (model: string | number , val: (string | number)) => void;
	onComplete?: () => void;

}) => {
	const FORM_MODEL: ContactFormData = NEW_CONTACT_DATA;
	return (
		<div
			className="contact-container"
		>
			<form
				className="contact-form"
				id="ContactForm"
			>
				<label>
					Your Name
				</label>
				<input
					className="text-input name"
					id="Name"
					value={FORM_MODEL.name}
					onChange={(e: any) => props.onChange('Name', e.target['value'])}
				/>
				<label>
					Email
				</label>
				<input
					value={FORM_MODEL.email}
					className="text-input email"
					id="Email"
					onChange={(e: any) => props.onChange('Email', e.target['value'])}
				/>
				<label>
					Phone
				</label>
				<input
					className="phone-input"
					id="Phone"
					role="input"
					type="number"
					onChange={(e) => props.onChange('Phone', e.target['value'])}
				/>
				<label>
					Subject / Title
				</label>
				<input
					className="text-input"
					id="Subject"
					onChange={(e) => props.onChange('Subject', e.target['value'])}

				/>
				<div
					className="text-input"
					id="Text"
					contentEditable={true}
					suppressContentEditableWarning={true}
					onChange={(e) => props.onChange('Text', e.target['value'])}
				/>
				<div>
					<button
						id="SubmitButton"
						onClick={(e) => {
							props.onSubmit();
						}}
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
};