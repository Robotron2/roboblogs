import app from "./app"
import config from "./config"
import connectDB from "./config/db"

const startServer = async () => {
	try {
		await connectDB()

		const server = app.listen(config.port, () => {
			console.log(`Server running in ${config.env} mode on port ${config.port}`)
		})

		process.on("unhandledRejection", (err: any) => {
			console.log(`Error: ${err.message}`)
			server.close(() => process.exit(1))
		})
	} catch (error) {
		console.error("Failed to start server:", error)
		process.exit(1)
	}
}

startServer()

process.on("uncaughtException", (err: Error) => {
	console.log(`Uncaught Exception: ${err.message}`)
	process.exit(1)
})
