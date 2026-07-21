import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ExplorePage from "./pages/ExplorePage";
import FriendRequestsPage from "./pages/FriendRequestsPage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useGroupStore } from "./store/useGroupStore";
import { useFriendStore } from "./store/useFriendStore";

const App = () => {
    const {
        authUser,
        checkAuth,
        isCheckingAuth,
    } = useAuthStore();

    const { theme } = useThemeStore();

    const {
        subscribeToGroupEvents,
        unsubscribeFromGroupEvents,
    } = useGroupStore();
     const {
        subscribeToFriendEvents,
        unsubscribeFromFriendEvents,
    } = useFriendStore();

    // Check authentication
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Subscribe to group socket events
    useEffect(() => {
        if (!authUser) return;

        subscribeToGroupEvents();

        return () => {
            unsubscribeFromGroupEvents();
        };
    }, [
        authUser,
        subscribeToGroupEvents,
        unsubscribeFromGroupEvents,
    ]);
    // Subscribe to friend socket events
    useEffect(() => {
        if (!authUser) return;

        subscribeToFriendEvents();

        return () => {
            unsubscribeFromFriendEvents();
        };
    }, [
        authUser,
        subscribeToFriendEvents,
        unsubscribeFromFriendEvents,
    ]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <div data-theme={theme}>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? (
                            <HomePage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/signup"
                    element={
                        !authUser ? (
                            <SignupPage />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                <Route
                    path="/login"
                    element={
                        !authUser ? (
                            <LoginPage />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                <Route
                    path="/explore"
                    element={
                        authUser ? (
                            <ExplorePage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/friend-requests"
                    element={
                        authUser ? (
                            <FriendRequestsPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/settings"
                    element={<SettingsPage />}
                />

                <Route
                    path="/profile"
                    element={
                        authUser ? (
                            <ProfilePage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>

            <Toaster />
        </div>
    );
};

export default App;