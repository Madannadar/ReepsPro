import { NextRequest, NextResponse } from "next/server"; // req, res
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { error } from "console";

export async function POST(req: NextRequest) { // datatype of req is NextRequest // POST is the function name which becomes the route
   try {
      const { email, password } = await req.json()
      if (!email || !password) {
         return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 }
         )
      }
      await connectToDatabase()

      const existingUser = await User.findOne({ email })

      if (existingUser) {
         return NextResponse.json(
            { error: "Email is already register" },
            { status: 400 }
         )
      }
      await User.create({
         email,
         password
      })

      return NextResponse.json(
         { message: "User registered successfully" },
         { status: 201 }
      )
   } catch (error) {
      return NextResponse.json(
         { error: "Failed to register User" },
         { status: 500 }
      )
   }
}