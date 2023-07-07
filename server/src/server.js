const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:u3LhudLTZLI7miWA@nasacluster.3d73op7.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function startServer() {
    await mongoose.connect(MONGO_URL)
    await loadPlanetsData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`listening on port: ${PORT}`)
    })
}

startServer()
