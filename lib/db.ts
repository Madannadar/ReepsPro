// here we are connecting to db through next js and not express
// so there are 3 edge cases to take care of 
// 1. connection has been establish
// 2. no connection so we connect means no promise
// 3. promise has gone but the response is still not come so we wait 
// if this was express then we do not need to check all this cases as its just a single request to db 
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; // ! matlab garenty le raha hu ke mongodb_uri aa raha h 

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is undefined")
}

let cached = global.mongoose; // cached means where next is running on which edge

if (!cached) {
    // then we are creating cached 
    cached = global.mongoose = { connection: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.connection) {
        return cached.connection
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // 
            maxPoolSize: 10 // how many connection in a single time
        }
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection)
    }

    try {
        cached.connection = await cached.promise // cached.connection ke aandar value tab he jayega jab koi aur promise run nahi ho if ho raha h await 
    } catch (error) {
        cached.promise = null // 
        throw error
    }
    return cached.connection
}