
import mongoose from "mongoose";
import { connect } from "mongoose"

import { UrlPairModel, UrlPair } from "./UrlPairSchema";

export class ShortUrlDB {


	private dbName:string = 'urlShort';
	private dbPath:string = 'mongodb://localhost:27017';
	
	constructor( ) {	

	}

	async connect(){
		try{
			await mongoose.connect(this.dbPath + '/' + this.dbName);
			// console.log(`Connected to DB : ${this.dbPath}/${this.dbName}`)
		}
		catch(err){
			console.log(err + 'can not connect to db');
		}

	}

	isConnected(): boolean{
		return mongoose.connection.readyState == 1
	}

	async addEntry( pair:UrlPair ): Promise<boolean> {
		let success_flag = false;

		if(!this.isConnected()){
			console.log('there is a database connection error');
			return success_flag;
		}
		try{
			const doc = new UrlPairModel(pair);
			await doc.save();
			
			// console.log(`${pair} saved`);
			success_flag = true;
		}
		catch(err){
			console.log(`{ ${pair.url} , ${pair.shortUrl} }  unable to be saved : ${err}`);
		}

		return success_flag;
	}

	async nuke(): Promise<number>{
		return (await UrlPairModel.deleteMany({})).deletedCount;
	}

	async findAll(){
		let res = UrlPairModel.find({});
		
		try{
			res.select( 'url shortUrl' );
			return await res.exec();
		}catch(err){
			console.log(err);
		}

		return res
	}

	async find( filter:object ): Promise<UrlPair> {
		const res = await UrlPairModel
		.find( filter )
		.select('url shortUrl')
		.exec();

		const pair:UrlPair = { url:'', shortUrl:'' }
		try{
			pair.url = res[0].url;
			pair.shortUrl = res[0].shortUrl;
		}catch(err){}

		return pair;
	}
	
	async disconnect(){
		try{
			await mongoose.connection.close();
			//console.log('db disconnected...');
		}
		catch(err){
			console.log(`disconnect failed : ${err}`);
		}
	}

}