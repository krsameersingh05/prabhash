// components/ProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // If no token, redirect to login page
            router.push("login");
        }
    }, [router]);

    return <>{children}</>; // Render children if authenticated
};

export default ProtectedRoute;