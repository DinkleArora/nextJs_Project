
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        // Connect to MongoDB before querying
        await connect();

        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Check if the user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email
                }
            },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error("Signup API error:", error);

        const message =
            error instanceof Error ? error.message : "Signup failed";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
