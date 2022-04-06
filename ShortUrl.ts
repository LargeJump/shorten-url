import { ShortUrlDB } from './mongoosedb/ShortUrlDB';
import { UrlPair } from './mongoosedb/UrlPairSchema'

export class ShortUrl{

	private baseUrl:string;
	private db:ShortUrlDB;
	
	constructor( baseUrl: string ){
		this.db = new ShortUrlDB();
		this.baseUrl = baseUrl;
	}

	//connect to database 
	async init( ) {
		await this.db.connect()
	}
	
	// shorten a url 
	// @param url - url to be compressed
	private compress( url:string ): string{
		let short = '' + Date.now();
			
		return short;
	}
	
	// return the original url from a shortened url id
	// if url does not exist return empty string
	async expand( short:string ):Promise<string> {		
		const resurl = await this.db.find({shortUrl:short} )

		return resurl.url;
	}

	//get the shortened version of a url 
	async get( url:string ){	
		const regex = new RegExp('^http[s]?://')
		url = url.replace(regex, '') 

		let short = await this.getShort(url);
		if( short == '' ){
			short = this.compress(url);
			await this.insertDB({
				url:url,
				shortUrl:short
			});
		}

		return this.baseUrl + '/re/' + short;
	}

	//check to see status of the db being used
	dbStat(): boolean{
		return this.db.isConnected();
	}
	// return the short uid from a url
	// if url does not exist, return empty string 
	private async getShort( url:string ): Promise<string>{
		return (await this.db.find({ url:url })).shortUrl;
	}

	private async insertDB(pair: UrlPair){
		let flag = await this.db.addEntry(pair)
		console.log( `\n{ ${pair.url}, ${pair.shortUrl} } -- added ${flag}`);
	}

}