import mongoose from "mongoose"
import config from "./index"

let cached = (global as any).mongoose

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
	if (cached.conn && cached.conn.connection.readyState === 1) {
		return cached.conn
	}

	if (!cached.promise) {
		if (!config.mongoose.url) {
			throw new Error("MONGO_URI is not defined")
		}

		const opts = {
			bufferCommands: false,
		}

		cached.promise = mongoose
			.connect(config.mongoose.url, opts)
			.then((mongooseInstance) => {
				console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`)
				return mongooseInstance
			})
			.catch((error) => {
				cached.promise = null
				throw error
			})
	}

	try {
		cached.conn = await cached.promise
	} catch (error) {
		cached.promise = null
		throw error
	}

	return cached.conn
}

export default connectDB
