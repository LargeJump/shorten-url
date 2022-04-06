import express, { json } from 'express';
import { ShortUrl } from './ShortUrl';
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express();
const PORT = 3000;

let shortUrl = new ShortUrl('http://localhost:3000');
shortUrl.init();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.text());

app.get('/', (req,res) => {
	res.send(shortUrl);
});

app.get('/re/:uid', async (req,res) => {
	console.log('starting redirect: ' + req.params.uid);
	const exp = await shortUrl.expand(req.params.uid);
	
	if(exp == ''){
		res.send(`${exp} - is not found`);
	}else{
		res.redirect(301, 'http://'+ exp)
	}

});

app.post('/s/short', (req,res) => {
	let body = JSON.parse(req.body);

	shortUrl.get(body.url)
	.then( (val) => {
		res.send({url:body.url, shortUrl:val});
	}).catch( (err) => {
		console.log(err);
	});
	
});

app.listen(PORT, ()=>{
	console.log(`app running on http://localhost:${PORT}`);
});