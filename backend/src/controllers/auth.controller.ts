import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// signup
export const signup = async (req: Request, res: Response, next:NextFunction):Promise<any>=> {

	try {
		const { fullName, username, email, password, confirmPassword, gender } = req.body;

		// missing fields case 1
		if (!fullName || !username || !password || !confirmPassword || !gender) {
			res.status(400); // You can set the status here
			throw new Error("Please fill in all fields");
		}
        
		// passwords match case 2
		if (password !== confirmPassword) {
			res.status(400);
			throw new Error("Passwords don't match");
		}

		// const user = await prisma.user.findUnique({ where: { username } });
		const user = await prisma.user.findFirst({
			where: {
			  OR: [
				{ username: username },
				{ email: email }
			  ]
			}
		  });
		  
		// user exists case 3  
		if (user) {
			// return res.status(400).json({ error: "User already exists" });
			
			// check for username
			if (user.username === username) {
				res.status(400)
				throw new Error('username already exists')
			  }
			  
			// Check if the email exists
			if (user.email === email) {
				res.status(400)
				throw new Error('email already exists')
			  }
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = await prisma.user.create({
			data: {
				fullName,
				username,
				email,
				password: hashedPassword,
				gender,
				profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
			},
		});

		if (newUser) {
			// generate token in a sec
			generateToken(newUser.id, res);

			res.status(201).json({
				id: newUser.id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400);
			throw new Error("Invalid user data");
		}
	} catch (error: any) {
		next(error)
	}
};


// login
export const login = async (req: Request, res: Response, next:NextFunction):Promise<any> => {

	try {
		const { username, email, password } = req.body;
		// const user = await prisma.user.findUnique({ where: { username } });
		const user = await prisma.user.findFirst({
			where: {
			  OR: [
				{ username: username },
				{ email: email }
			  ]
			}
		  });

		if (!user) {
			res.status(400)
			throw new Error("Invalid credentials")
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {

			res.status(400)
	        throw new Error("Passwords din't match")
		}

		generateToken(user.id, res);

		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			email: user.email,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error: any) {
		next(error)
	}
};


// logout
export const logout = async (req: Request, res: Response, next:NextFunction) => {

	try {
		// res.cookie("jwt", "", { maxAge: 0 });
		res.clearCookie("jwt");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		next(error)
	}
};


// me (refresh)
export const getMe = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
	
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.id } });

		if (!user) {
			// return res.status(404).json({ error: "User not found" });
			res.status(404);
			throw new Error("User not found")
		}

		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (error: any) {
		next(error)
	}
};

