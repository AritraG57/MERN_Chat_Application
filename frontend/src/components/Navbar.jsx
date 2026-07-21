import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Compass,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  const {
    friendRequests,
    getFriendRequests,
  } = useFriendStore();

  useEffect(() => {
    if (!authUser) return;

    getFriendRequests();
  }, [authUser]);

  return (
    <header
      className="border-b border-base-300 fixed w-full top-0 z-40
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>

            <h1 className="hidden sm:block text-lg font-bold">
              Chatty
            </h1>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {authUser && (
              <>
                <Link
                  to="/"
                  className="btn btn-sm gap-2"
                >
                  <MessageSquare className="size-4" />
                  <span className="hidden sm:inline">
                    Chats
                  </span>
                </Link>

                <Link
                  to="/explore"
                  className="btn btn-sm gap-2"
                >
                  <Compass className="size-4" />
                  <span className="hidden sm:inline">
                    Explore
                  </span>
                </Link>

                <Link
                  to="/friend-requests"
                  className="btn btn-sm gap-2 relative"
                >
                  <UserPlus className="size-4" />
                  <span className="hidden sm:inline">
                    Requests
                  </span>

                  {friendRequests.length > 0 && (
                    <span className="badge badge-error badge-xs absolute -top-1 -right-1">
                      {friendRequests.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            <Link
              to="/settings"
              className="btn btn-sm gap-2"
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">
                Settings
              </span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2"
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">
                    Profile
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-sm gap-2"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;