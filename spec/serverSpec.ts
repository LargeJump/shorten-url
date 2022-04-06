import jasmine from "jasmine";
import axios from 'axios'


describe("express server", ()=>{
	const baseurl = 'http://localhost:3000/';
	const google = 'www.google.com';

	it("shuld shorten a url", async () => {
		axios.post(baseurl+'s/short', { url:google })
		.then( (val) => console.log('posted ' + val.data))
		.catch( (err) => console.log('error post'+ err) )
		
	});
});