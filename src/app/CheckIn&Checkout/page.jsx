"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FiLogOut } from "react-icons/fi"; // Using Feather icons from react-icons
import ProtectedRoute from "../ProtectedRoute";
import axios from "axios";
import { useRouter } from "next/navigation";

// Styled components
const CheckOutButton = styled(Button)(({ theme }) => ({
	borderRadius: "25px",
	width: "100%",
	padding: "10px",
	backgroundColor: "#000",
	color: "#fff",
	textTransform: "none",
	"&:hover": {
		backgroundColor: "#333",
	},
}));

const CheckInButton = styled(Button)(({ theme }) => ({
	borderRadius: "25px",
	width: "100%",
	padding: "10px",
	backgroundColor: "#4caf50", // Green color for check-in
	color: "#fff",
	textTransform: "none",
	"&:hover": {
		backgroundColor: "#388e3c",
	},
}));

const LogoutButton = styled(Button)(({ theme }) => ({
	justifyContent: "flex-start",
	padding: "8px 0",
	color: "#000",
	textTransform: "none",
	"&:hover": {
		backgroundColor: "transparent",
		opacity: 0.7,
	},
}));

const ProfileCard = () => {
	const [employeeData, setEmployeeData] = useState(null);
	const [todayAttendance, setTodayAttendance] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useRouter();

	// Common API function
	const fetchData = async (url, method = "GET", payload = null) => {
		const token = localStorage.getItem("token"); // Get token from local storage
		if (!token) {
			alert("No token found. Please log in again.");
			navigate.push("/login");
			return null;
		}

		try {
			const config = {
				method,
				url,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			if (payload) {
				config.data = payload;
			}
			const response = await axios(config);
			return response.data;
		} catch (error) {
			console.error(error);
			alert("Something went wrong. Please try again.");
			return null;
		}
	};

	// Fetch employee data
	const fetchEmployeeData = async () => {
		const data = await fetchData(
			"https://hrms-backend-pvgz.onrender.com/api/employee/getEmployee"
		);
		if (data) setEmployeeData(data);
	};

	// Fetch today's attendance
	const fetchTodayAttendance = async () => {
		const data = await fetchData(
			"https://hrms-backend-pvgz.onrender.com/api/employee/getTodayAttendance"
		);
		if (data) {
			setTodayAttendance(data);
		}
	};

	// Handle check-in
	const handleCheckIn = async () => {
		const now = new Date();
		const timeString = now
			.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				second: "2-digit", // Include seconds
				hour12: true, // 12-hour format
			})
			.toLowerCase();

		const payload = {
			empId: employeeData?.data?._id,
			cmpId: employeeData?.data?.companyId,
			attendanceDate: now.toISOString().split("T")[0],
			loginTime: timeString,
		};

		setIsLoading(true);
		const response = await fetchData(
			"https://hrms-backend-pvgz.onrender.com/api/employee/markAttendance",
			"POST",
			payload
		);
		if (response) {
			alert("Check-in successful");
			await fetchTodayAttendance(); // Refresh attendance data
		}
		setIsLoading(false);
	};

	// Handle check-out
	const handleCheckOut = async () => {
		const now = new Date();
		const timeString = now
			.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				second: "2-digit", // Include seconds
				hour12: true, // 12-hour format
			})
			.toLowerCase();

		const payload = {
			empId: employeeData?.data?._id,
			cmpId: employeeData?.data?.companyId,
			attendanceDate: now.toISOString().split("T")[0],
			logoutTime: timeString,
		};

		setIsLoading(true);
		const response = await fetchData(
			"https://hrms-backend-pvgz.onrender.com/api/employee/markAttendance",
			"POST",
			payload
		);
		if (response) {
			alert("Check-out successful");
			await fetchTodayAttendance(); // Refresh attendance data
		}
		setIsLoading(false);
	};

	// Handle logout
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate.push("/login");
	};

	useEffect(() => {
		(async () => {
			await fetchEmployeeData();
			await fetchTodayAttendance();
		})();
	}, []);

	return (
		<ProtectedRoute>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
				}}
			>
				<Card sx={{ maxWidth: 400, width: "100%" }} elevation={0}>
					<CardContent>
						{/* Profile Section */}
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
								My Profile
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{employeeData?.data?.personalEmail}
							</Typography>
						</Box>

						{/* Dashed Divider */}
						<Box
							sx={{
								borderBottom: "2px dashed #ccc", // Dashed line
								marginY: 2, // Vertical spacing
							}}
						></Box>

						{/* Check In/Out Section */}
						<Box sx={{ py: 2 }}>
							<Box sx={{ display: "flex", mb: 1 }}>
								<Typography variant="body1" color="success.main">
									Checked In:
								</Typography>
								<Typography variant="body1" sx={{ ml: 1 }}>
									{todayAttendance?.data?.loginTime}
								</Typography>
							</Box>

							<Box sx={{ display: "flex", mb: 2 }}>
								<Typography variant="body1" color="error.light">
									Checked Out:
								</Typography>
								<Typography variant="body1" sx={{ ml: 1 }}>
									{todayAttendance?.data?.logoutTime}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ py: 2 }}>
							{todayAttendance?.data?.loginTime ? (
								todayAttendance?.data?.logoutTime ? (
									<Typography variant="body2" color="text.secondary">
										You have already checked in and out for the day.
									</Typography>
								) : (
									<CheckOutButton
										variant="contained"
										onClick={handleCheckOut}
										disabled={isLoading}
									>
										Check Out
									</CheckOutButton>
								)
							) : (
								<CheckInButton
									variant="contained"
									onClick={handleCheckIn}
									disabled={isLoading}
								>
									Check In
								</CheckInButton>
							)}
						</Box>

						{/* Dashed Divider */}
						<Box
							sx={{
								borderBottom: "2px dashed #ccc", // Dashed line
								marginY: 2, // Vertical spacing
							}}
						></Box>

						{/* Logout Section */}
						<Box sx={{ pt: 2 }}>
							<LogoutButton
								startIcon={<FiLogOut size={20} />}
								fullWidth
								onClick={handleLogout}
							>
								Log Out
							</LogoutButton>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</ProtectedRoute>
	);
};

export default ProfileCard;
