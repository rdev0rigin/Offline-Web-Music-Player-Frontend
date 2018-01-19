// import { responseSocket } from './web-socket.service';
// import { BehaviorSubject } from '@reactivex/rxjs';
// import cuid from '../../node_modules/cuid';
//
// export interface TransporterState {
// 	targetPath: string;
// 	keepOpen?: boolean;
// 	CHUNK_SIZE?: number;
// 	MAX_FILE_SIZE?: number;
//
// 	[key: string]: any;
// }
//
// export interface TransportPack {
// 	transaction: string;
// 	position: number;
// 	hash: string;
// 	data: string | File;
// }
//
// /**
//  * TransportService Module({targetPath:string, ack({ok:boolean, ...argv}): void
//  *
//  * A module service that provides a unique interface to
//  * send or receive data transportation between components and services.
//  * @Dependencies Socket.IO RxJS
//  * @param {TransporterState} settings
//  * @param payload
//  * @returns {TransporterService}
//  * @constructor
//  */
//
// export class TransportService {
// 	public ID = 'not initialized';
// 	public transactions: Map<string, any> = new Map<string, any>();
// 	private dataReady: boolean = false;
// 	private DEFAULT_STATE = {
// 		CHUNK_SIZE: 1024,
// 		MAX_FILE_SIZE: 1024 * 1024 * 1024,
// 		targetPath: '/set/end::point',
// 		keepOpen: false
// 	};
// 	private file: File = null;
// 	private chunks: Map<string, any> = new Map<string, any>();
// 	private reader: FileReader = new FileReader();
// 	private state: BehaviorSubject<TransporterState> = new BehaviorSubject<TransporterState>(this.DEFAULT_STATE);
//
// 	constructor(settings: TransporterState) {
// 		// if (window.File && window.FileReader && window.FileList && window.Blob) {
// 		this.state.next(Object.assign({}, this.state.value, settings));
// 		this.reader.addEventListener(
// 			'loadend',
// 			(evt): void => {
// 				this.dataReady = false;
// 				this.chunks.clear();
// 				if (this.reader.readyState === FileReader['DONE']) {
// 					const transID = cuid();
// 					const data: Uint8Array = new Uint8Array(this.reader.result);
// 					let header = '';
// 					for (let i = 0; i < 5; i++) {
// 						header += data[i].toString(16);
// 					}
// 					let mimeType = HEADER_TO_MIME(header);
// 					this.chunks.set('details', {
// 						mime: mimeType,
// 						hash: crypto.subtle.digest('sha-256', new Buffer(this.reader.result))
// 					});
// 					for (let i = 0; i < data.length; i++) {
// 						this.chunks.set(
// 							i.toString(),
// 							{
// 								transaction: transID,
// 								position: i,
// 								data: data[i],
// 								hash: crypto.subtle.digest('sha-256', new Buffer(data[i]))
// 							}
// 						);
// 					}
// 					console.log('file reader result', this.chunks);
// 					this.dataReady = true;
// 				}
// 			});
// 		this.ID = cuid();
// 		// } else {
// 		// 	alert('The File APIs are not fully supported in this browser.');
// 		// }
// 	}
//
// 	public initTransport(data: File): void {
// 		this.reader.readAsArrayBuffer(data);
// 	}
//
// 	private setState(update): void {
// 		this.state.next(Object.assign({}, this.state.value, update));
// 	}
//
// 	public onFileChange(newFile: File): void {
// 	}
//
// 	public send(payload, cb?: (response: any) => void) {
// 		if (this.dataReady) {
// 			this.chunks.forEach((chunk) => {
// 				responseSocket(this.state.value.targetPath, chunk, cb);
// 			});
// 		} else {
// 			cb({
// 				ok: false,
// 				message: 'error initializing transporter'
// 			});
// 		}
// 	}
// }
//
// export const HEADER_TO_MIME = (header: string) => {
// 	switch (header.slice(0, 6)) {
// 		case'494433':
// 			return 'mp3';
// 		case'524946':
// 			return 'wav';
// 		case'664C61':
// 			return 'flac';
// 		case'000001':
// 			return 'mp4';
// 		default:
// 			return 'unknown';
// 	}
// };
//
// export default TransportService;