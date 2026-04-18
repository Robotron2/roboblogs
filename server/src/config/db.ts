import mongoose from "mongoose"
import config from "./index"

// const connectDB = async () => {
// 	try {
// 		if (!config.mongoose.url) {
// 			throw new Error("MONGO_URI is not defined in configuration")
// 		}
// 		const connect = await mongoose.connect(config.mongoose.url)
// 		console.log(`Connected to Atlas`)

// 		// const connect = await mongoose.connect(config.mongoose.url)
// 		// console.log(`Connected to MongoLocal`)
// 	} catch (error) {
// 		console.log(error)
// 	}
// }
// export default connectDB

const connectDB = async () => {
	try {
		if (!config.mongoose.url) {
			throw new Error("MONGO_URI is not defined in configuration")
		}

		const conn = await mongoose.connect(config.mongoose.url)

		const isAtlas = config.mongoose.url.includes("mongodb+srv")

		console.log(`MongoDB Connected (${isAtlas ? "Atlas" : "Local"}): ${conn.connection.host}`)
	} catch (error) {
		console.error("MongoDB connection error:", error)
		throw error
	}
}

export default connectDB
