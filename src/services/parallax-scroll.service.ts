import { Observable } from '@reactivex/rxjs';
import { ComponentHeights } from '../models/app.model';

export interface Keyframes {
	wrapper: string;
	duration: string | number;
	animations: {
		selector: string;
		[prpos: string]: any
	}[];
}

/* tslint:disable */
export class ParallaxScrollService {
	private currentKeyframe = 0;
	private prevKeyframeDurations = 0;
	private scrollTop = 0;
	private relativeScrollTop = 0;
	private wrappers = [];
	private bodyHeight = 0;
	private windowHeight = 0;
	private windowWidth = 0;
	private currentWrapper = '';
	private wrapperValues = {};
	private shadowFrames = [];

	constructor(keyframes: Keyframes[]) {
		this.shadowFrames = [...this.shadowFrames, ...keyframes];
		this.initialize(this.shadowFrames);
		this.scrollTop = window.scrollY;
		this.windowHeight = window.innerHeight;
		this.windowWidth = window.innerWidth;
		this.currentWrapper = this.wrappers[0];
	}

	private initialize(stringKf: any[]): void {
		this.shadowFrames = this.convertAllPropsToPx(stringKf);
		// for (let i = 0; i < this.shadowFrames.length; i++) {
		for (let i of this.shadowFrames) {
			this.bodyHeight += this.shadowFrames[i].duration;
			if (this.wrappers.indexOf(this.shadowFrames[i].wrapper.key) > 0){
				this.wrappers = [...this.wrappers, this.shadowFrames[i].wrapper];
			}
			for (let j = 0; j < this.shadowFrames[i].animations.length; j++) {
				Object.keys(this.shadowFrames[i].animations[j])
					.forEach(key => {
						if(key !== 'selector') {
							if(!Array.isArray(this.shadowFrames[i].animations[j][key])){
								this.shadowFrames[i].animations[j][key] = [
									this.getDefaultValues(key),
									this.shadowFrames[i].animations[j][key]]
							}
						}
					});
			}
		}
	};

	private showCurrentWrappers() {
		if(this.shadowFrames[this.currentKeyframe].wrapper !== this.currentWrapper){
			this.currentWrapper = this.shadowFrames[this.currentKeyframe].wrapper;
		}
	};

	private animateElements(): {} {
		let translatey, translatex, scale, opacity, rotate, styles = [];
		for (let animation of this.shadowFrames[this.currentKeyframe].animations) {
			translatey = this.calcPropValues(animation, 'translatey');
			translatex = this.calcPropValues(animation, 'translatex');
			scale = this.calcPropValues(animation, 'scale');
			opacity = Number(this.calcPropValues(animation, 'opacity')).toFixed(2);
			rotate = this.calcPropValues(animation, 'rotate');
			styles = styles.concat({[animation.selector]: {transform: `translate3d(${translatex}px,  ${translatey}px, 0) scale(${scale}) rotate(${rotate}deg)`,
					opacity: opacity}});
		}
		return styles;
	};

	private convertAllPropsToPx(kf) {
		let resultFrames: Keyframes[] = [];
		for (let i = 0; i < kf.length; i++){
			resultFrames = [
				...resultFrames,
				Object.assign(
					{},
					{
						wrapper: kf[i].wrapper,
						duration: this.percentageToPx(
							kf[i].duration,
							'y')
					}
				)
			] as Keyframes[];
			let animations = [];
			for (let j = 0; j < kf[i].animations.length; j++) {
				let animation = {};
				Object.keys(kf[i].animations[j])
					.forEach(key => {
						if(key !== 'selector'){
							if(Array.isArray(kf[i].animations[j][key])) {
								let setValue = [];
								for(let k = 0; k < kf[i].animations[j][key].length; k++) {
									if(typeof kf[i].animations[j][key][k] === 'string') {
										if(key === 'translatey') {
											setValue = [
												...setValue,
												this.percentageToPx(kf[i].animations[j][key][k],
													'y')
											];
										} else {
											setValue = [
												...setValue,
												this.percentageToPx(kf[i].animations[j][key][k],
													'x')
											];
										}
									} else {
										setValue = [...setValue, kf[i].animations[j][key][k]];
									}
								}
								animation = {...animation, [key]: setValue};
							} else {
								if(typeof kf[i].animations[j][key] === 'string') {
									if(key === 'translatey') {
										animation = {
											...animation,
											[key]: this.percentageToPx(kf[i].animations[j][key],
												'y')
										};
									} else {
										animation = {
											...animation,
											[key]: this.percentageToPx(kf[i].animations[j][key],
												'x')
										};
									}
								} else {
									animation = {
										...animation,
										[key]: kf[i].animations[j][key]
									};
								}
							}
						} else { //assign selector
							animation = {
								...animation,
								selector: kf[i].animations[j][key]
							}
						}
					});
				animations = [
					...animations,
					animation
				];
			}
			resultFrames[i] = {
				...resultFrames[i],
				animations: animations
			};
		}
		return resultFrames;
	};

	private setScrollTops() {
		this.scrollTop = window.scrollY;
		this.relativeScrollTop = this.scrollTop - this.prevKeyframeDurations;
	};

	private percentageToPx(value, axis) {
		if ('y' === axis){
			return (parseFloat(value) / 100 ) * window.innerHeight
		}
		if ('x' === axis){
			return (parseFloat(value) / 100 ) * window.innerWidth
		}
		return void 0;
	};

	private calcPropValues(animation, property){
		let value = animation[property];
		if(value) {
			return this.easeInOutQuad(
				this.relativeScrollTop,
				value[0],
				(value[1] - value[0]),
				this.shadowFrames[this.currentKeyframe].duration
			);
		} else {
			return this.getDefaultValues(property);
		}
	};

	private easeInOutQuad(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};

	private getDefaultValues(key) {
		switch(key){
			case'scale':
				return 1;
			case'translatey':
				return 0;
			case'translatex':
				return 0;
			case'rotate':
				return 0;
			case'opacity':
				return 1;
			default:
				return null;
		}
	};

	private setKeyFrame(){
		if(this.scrollTop > (this.shadowFrames[this.currentKeyframe].duration + this.prevKeyframeDurations)) {
			this.prevKeyframeDurations += this.shadowFrames[this.currentKeyframe].duration;
			this.currentKeyframe++;
			this.showCurrentWrappers();
		} else if (this.scrollTop < this.prevKeyframeDurations) {
			this.prevKeyframeDurations -= this.shadowFrames[this.currentKeyframe].duration;
			this.currentKeyframe--;
			this.showCurrentWrappers();
		}
	};

	private updatePage(): {}{
		this.setScrollTops();
		if(this.scrollTop > 0 && this.scrollTop <= (this.bodyHeight - this.windowHeight)) {
			//assigning current wrapper values
			this.shadowFrames
				.forEach(keyframe =>
					this.wrapperValues = Object
						.assign(
							{},
							{[this.currentWrapper]: false},
							{[keyframe.wrapper]: true}
						)
				);
			this.setKeyFrame();
			// The Data to be passed to the components
			return {
				height: this.bodyHeight,
				currentKeyframe: this.currentKeyframe,
				styles: this.animateElements(),
				wrappers: this.wrapperValues,
				relativeScrollTop: this.relativeScrollTop,
				scrollTop: this.scrollTop,
				pageHeight: this.pageHeight
			}
		}
		return void 0;
	};

	public updateOnTick = Observable.create((observer) => {
		setInterval(() => {
			const update = this.updatePage();
			if(update){
				observer.next(update);
			}
		}, 50);
	});
	public pageHeight = this.bodyHeight;
}

export function ComponentOffSetter(components: NodeList): ComponentHeights {
	let heights = {}, acc = 0;
	Array.from(components).forEach(component => {
		console.log('component', component['id']);
		heights = Object.assign({}, heights, {[component['id']]: acc});
		acc += component['offsetHeight'];
	});
	console.log('heights', heights);
	return heights;
}