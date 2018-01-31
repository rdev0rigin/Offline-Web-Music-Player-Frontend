import * as React from 'react';
import { ReactElement, ReactText } from 'react';
import { MediaPlayerComponent } from './components/containers/media-player/media-player.component';
import { Navbar } from './components/containers/navbar/navbar.component';
import { About } from './components/controlled/about/about.component';
import { SHARE_LINKS } from './models/social-link.model';
import { routerSwitch } from './routers/routing';
import { APP_INITIAL_STATE, DComposedMusicAppState } from './models/app.model';
import { Observable, Subscription } from '@reactivex/rxjs';
import { arrowSVG } from './assets/svgs';
import { loaderAnimation, LoaderAnimation } from './animations/loading.animation';
import { ContactComponent } from './components/controlled/contact/contact.component';
import { FormHandler, InputModel, NEW_CONTACT_DATA } from './models/form.model';
import { FooterComponent } from './components/containers/footer/footer.component';

export class DComposedMusicApp extends React.Component<{}, DComposedMusicAppState> {
	public state: DComposedMusicAppState;
	private scrollTimer;
	private loader: LoaderAnimation;
	private formManager: any = this.formHandler;
	private parallaxSub: Subscription;

	// noinspection JSAnnotator
	public constructor(public props: any) {
		// noinspection TypeScriptValidateTypes
		super(props);
		this.state = APP_INITIAL_STATE;
		this.renderPrimaryLayout = this.renderPrimaryLayout.bind(this);
		this.onParallaxUpdate = this.onParallaxUpdate.bind(this);
		this.loader = loaderAnimation();
	}

	public componentDidMount(): void {
		this.parallaxSub = this.initParallaxTimer$()
			.distinctUntilChanged()
			.subscribe(
				res => {
					this.onParallaxUpdate(res);
				},
				(err) => console.log('ERROR: Parallax Error'),
				() => clearInterval(this.scrollTimer));
		this.formManager(NEW_CONTACT_DATA);
	}

	public componentWillUnmount(): void {
		this.parallaxSub.unsubscribe();
	}

	public render(): ReactElement<HTMLDivElement> {
		return this.state.dataReady
			? routerSwitch({
				...this.props,
				...this.state,
				renderPrimaryLayout: this.renderPrimaryLayout
			})
			: <div> Data Loading .....</div>;
	}

	private initParallaxTimer$(): Observable<any> {
		return Observable
			.create(observer => {
				this.scrollTimer = setInterval(
					() => {
						// noinspection JSSuspiciousNameCombination
						observer.next(Math.trunc(window.scrollY));
					},
					16);
			});
	}

	private onParallaxUpdate(scrollY: number) {
		const offset = 200;
		if (scrollY >= ( window.screen.height - offset) && !this.state.showSticky) {
			window.requestAnimationFrame(() => {
				this.setState({
					showSticky: true
				});
			});
		} else if (scrollY < (window.screen.height - offset) && this.state.showSticky) {
			window.requestAnimationFrame(() => {
				this.setState({
					showSticky: false
				});
			});
		}
		window.requestAnimationFrame(() => {
			this.setState({
				scrollY: scrollY
			});
		});
	}

	private formHandler(): FormHandler {
		let ModelStore: Map<string, InputModel> = new Map<string, InputModel>();
		let modelStore$: Observable<Map<string, InputModel>>;

		function updateModel(key: string, val: any): void {
			modelStore$ = Observable.create(observer => {
				ModelStore.set(key, val);
				observer.next(ModelStore);
			});
		}

		return {
			changeHandler: (key: string, nextVal: ReactText): void => {
				updateModel(key, nextVal);
			},

			submitHandler: (): void => {
				return alert('TODO Wire In Backend');
			},

			isValid: (): any => {
				// return new Promise((resolve, reject): boolean => {
				// 	resolve(true);
				// });
				return true;
			},

			getModel(key: string): InputModel {
				return ModelStore.get(key);
			},

			model$: (): Observable<any> => {
				return modelStore$;
			},

			updateModel: (key, val): void => {
				updateModel(key, val);
			}
		};
	}

	private renderPrimaryLayout(): ReactElement<HTMLDivElement> {
		return (
			<div className="primary-layout">
				<Navbar
					shareLinksMap={SHARE_LINKS()}
					show={true}
					style={{
						position: 'absolute',
						top: 0,
						left: 0
					}}
				/>
				<div
					style={{backgroundPositionY: Math.trunc(this.state.scrollY * 0.0003)}}
					className="splash"
				>
					<MediaPlayerComponent
						style={{top: `${Math.trunc(10 + (this.state.scrollY * .30))}px`}}
					/>
					<div
						className={`banner-arrow-box center-ele ${this.state.arrowStyle}`}
					>
						{arrowSVG}
					</div>
				</div>
				<About/>
				<FooterComponent/>
				<Navbar
					shareLinksMap={SHARE_LINKS()}
					show={this.state.showSticky}
					hide={this.state.hideNavbar}
				/>
			</div>
		);
	}
}

export default DComposedMusicApp;
