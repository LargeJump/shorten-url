import { ShortUrlDB }from '../mongoosedb/ShortUrlDB';
import { UrlPair } from '../mongoosedb/UrlPairSchema';



describe("ShortUrlDb class", () => {
	const db = new ShortUrlDB();
	it('should connect to the database', async () => {
		await db.connect();

		expect( db.isConnected() ).toBeTrue();

		await db.disconnect();
	});

	it('should disconnect from db', async () => {
		await db.connect();

		expect( db.isConnected() ).toBeTrue();

		await db.disconnect()	;
		expect( db.isConnected() ).toBeFalse();
	});

	it('should add entries to database', async () => {
		await db.connect();

		let res = await db.addEntry( {url:'www.google.com', shortUrl:'1000'} );
		expect( res ).toBeTrue();

		await db.disconnect();
	});

	it('should return all url entries in the database', async () => {
		await db.connect();

		db.nuke();

		const max = 30
		for(let i=0; i<max; i++){
			await db.addEntry( { url:`www.google${i}.com`, shortUrl:`${i}_short`});
		}
		expect((await db.findAll()).length).toEqual(max);

		await db.disconnect();
	});

	it('should delete all documents', async () => {
		await db.connect();

		await db.nuke();
		expect( (await db.findAll()).length ).toEqual(0);

		const max = 30
		for(let i=0; i<max; i++){
			await db.addEntry( { url:`www.google${i}.com`, shortUrl:`${i}_short`});
		}
		expect(await db.nuke()).toEqual(max);

		await db.disconnect();
	});

	it('should find a url entry', async () => {
		await db.connect();

		const tstEntry:UrlPair =  { url:`www.google.com`, shortUrl:`short` };

		await db.nuke();
		await db.addEntry( tstEntry );

		let res:UrlPair;

		res = await db.find({url: 'www.google.com'})
		expect( res.url ).toBe( tstEntry.url );
		expect( res.shortUrl ).toBe( tstEntry.shortUrl );
		
		res = await db.find({shortUrl: 'short'})
		expect( res.url ).toBe( tstEntry.url );
		expect( res.shortUrl ).toBe( tstEntry.shortUrl );

		await db.nuke();

		res = await db.find({url: 'www.google.com'})
		expect( res.url ).toBe( '' );
		expect( res.shortUrl ).toBe( '' );

		await db.disconnect();
	});

	db.connect().then( ()=> db.nuke() );

})