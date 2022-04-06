import { Schema, model } from 'mongoose'

export interface UrlPair {
	url:string
	shortUrl:string
}

const schema = new Schema<UrlPair>({
	url:      { type: String, required: true},
	shortUrl: { type: String, required: true}
})

export const UrlPairModel = model<UrlPair>('UrlPair', schema);

