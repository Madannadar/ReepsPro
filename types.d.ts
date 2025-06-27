import { Connection } from "mongoose"

// declaring variables see in db.ts where we are using mongoose in the let cached globle does not have mongoose so we are declaring here
declare global {  
    var mongoose: {
        connection: Connection | null
        promise: Promise<Connection> | null
    }
}

export {};