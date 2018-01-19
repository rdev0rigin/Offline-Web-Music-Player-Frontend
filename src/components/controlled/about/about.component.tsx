import * as React from 'react';
import { dcelfSVG } from '../../../assets/svgs';

export const About = (props) => {
	return (
		<div
			style={{...props.style}}
			className="about-component"
			id="About"
		>
			<p>
				<i className="decorator">
					{dcelfSVG}
				</i>
				A little about the artist, and such. Lorizzle ipsum dolizzle dizzle amizzle, consectetuer adipiscing
				tellivizzle. Nullizzle away velizzle, pot volutpat, owned quizzle, bizzle vizzle, arcu. Pellentesque
				eget tortor. Sizzle eros. Dang izzle bling bling dapibus turpis tempizzle we gonna chung. Maurizzle
				pellentesque nibh owned turpizzle. Get down get down izzle fo shizzle. Pellentesque funky fresh
				rhoncizzle nisi. In fo shizzle mofo brizzle dictumst. Phat tellivizzle. Curabitur tellizzle go to
				hizzle, pretium sure, mattizzle ac, eleifend vitae, nunc. Owned suscipizzle. Integizzle sempizzle you
				son of a bizzle da bomb break yo neck, yall.
			</p>
		</div>
	);
};
