"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Logo from "../../../public/image/logo1.png";
import Video from "../../../public/image.gif";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter(); // Initialize useRouter

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		const USERNAME = "HRMSUSERYTUY";
		const PASSWORD = "HRMSUHGDTYTY";

		try {
			const response = await axios.post(
				"https://hrms-backend-pvgz.onrender.com/api/auth/login",
				{ email, password }, // Request body
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`, // Basic Auth
					},
				}
			);

			const token = response.data.data.token; // Extract token from the response
			localStorage.setItem("token", token); // Store the token in local storage
			alert("Login successful!");

			// Navigate to the CheckIn & CheckOut page
			router.push("/"); // Change this to your actual route
		} catch (err) {
			console.log(err, "all errors");
			if (err.response) {
				setError(
					err.response.data.message || "Invalid credentials. Please try again."
				);
			} else {
				setError("An error occurred. Please try again.");
			}
		}
	};

	return (
		<Box
			component="form"
			noValidate
			autoComplete="off"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				padding: 2,
				background: "#583f8c",
			}}
			onSubmit={handleLogin} // Attach the submit handler
		>
			<Box
				sx={{
					width: "100%",
					maxWidth: 500,
					display: "flex",
					flexDirection: "column",
					gap: 4,
					padding: "50px",
				}}
			>
				<Image
					className="ml-auto mr-auto"
					src={Logo}
					alt="logo"
					width={300}
					height={150}
				/>
				{error && (
					<Box sx={{ color: "red", textAlign: "center", marginBottom: 2 }}>
						{error}
					</Box>
				)}
				<Image className="rounded-xl" src={Video} alt="logo" />
				<TextField
					required
					id="outlined-required"
					label="Email"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					sx={{
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "white", // Set border color to white
						},
						"& .MuiInputLabel-root": {
							color: "white", // Label text color
						},
						"& .MuiInputBase-input": {
							color: "white", // Input text color
						},
						"& .MuiInputLabel-root.Mui-focused": {
							color: "white", // Label color when focused
						},
						"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
							{
								borderColor: "white", // Border color when focused
							},
					}}
				/>
				<TextField
					required
					id="outlined-password"
					label="Password"
					type="password"
					fullWidth
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					sx={{
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "white", // Set border color to white
						},
						"& .MuiInputLabel-root": {
							color: "white", // Label text color
						},
						"& .MuiInputBase-input": {
							color: "white", // Input text color
						},
						"& .MuiInputLabel-root.Mui-focused": {
							color: "white", // Label color when focused
						},
						"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
							{
								borderColor: "white", // Border color when focused
							},
					}}
				/>
				<Button
					variant="contained"
					fullWidth
					type="submit" // Set button type to submit
					sx={{
						marginTop: 2,
						backgroundColor: "white",
						color: "black",
						fontWeight: "bold",
						height: "50px",
					}}
				>
					Login
				</Button>
			</Box>
		</Box>
	);
}
