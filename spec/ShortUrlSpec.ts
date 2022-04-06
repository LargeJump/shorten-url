import jasmine from "jasmine";
import { ShortUrl } from "../ShortUrl"
import { ShortUrlDB } from '../mongoosedb/ShortUrlDB'

describe("URL shortener", () => {
	const directdb = new ShortUrlDB();

	const base =  'http://localhost:3000/'
	const tstUrl = 'www.mydomain.com';
		
	it("should connect to a database", async() =>{
		let shortUrl = new ShortUrl(base);
		await shortUrl.init();

		expect(shortUrl.dbStat()).toBeTrue();

	})

	it('should compress a url', async () => {
		let shortUrl = new ShortUrl(base)	
		await shortUrl.init();
		
		await directdb.connect();
		await directdb.nuke();

		expect(await shortUrl.get(tstUrl)).toBe(base + (await directdb.find({tstUrl})).shortUrl);
	
		await directdb.nuke();
		await directdb.disconnect();

	})

	it('should compress a url with http', async () => {
		let shortUrl = new ShortUrl(base)	
		await shortUrl.init();
		
		await directdb.connect();
		await directdb.nuke();

		expect(await shortUrl.get( 'http://' + tstUrl)).toBe(base + (await directdb.find({tstUrl})).shortUrl);
	
		await directdb.nuke();
		await directdb.disconnect();

	})

	it('should expand a shortened url', async ()=>{
		let shortUrl = new ShortUrl(base)	
		await shortUrl.init();
		
		await directdb.connect();
		await directdb.nuke();

		await shortUrl.get(tstUrl)
		const pair = await directdb.find({url:tstUrl});
		expect(await shortUrl.expand(pair.shortUrl)).toBe(tstUrl)
	
		await directdb.nuke();
		await directdb.disconnect();
	})
	
	it('should expand a shortened url with http', async ()=>{
		let shortUrl = new ShortUrl(base)	
		await shortUrl.init();
		
		await directdb.connect();
		await directdb.nuke();

		await shortUrl.get('http://'+tstUrl)
		const pair = await directdb.find({url:tstUrl});
		expect(await shortUrl.expand(pair.shortUrl)).toBe(tstUrl)
	
		await directdb.nuke();
		await directdb.disconnect();
	})

});