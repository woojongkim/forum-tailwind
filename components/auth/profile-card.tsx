"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

interface Props {
  session: any;
}

export default function ProfileCard({ session }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      console.log("add event listener");
      document.addEventListener("mousedown", handleClickOutside);
    }return () => {
      console.log("remove event listener");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <img
          src={session.user?.image}
          alt="Profile image"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
      </div>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 w-48 py-2 mt-2 transition duration-1000 ease-in-out bg-white rounded-md shadow-xl"
        >
          <DropdownMenu
            itemMenu="SignOut"
            onLogoutClick={() => {
              signOut();
            }}
          />
          <DropdownMenu itemMenu="Hi" onLogoutClick={() => {}} />
        </div>
      )}
    </div>
  );
}

function DropdownMenu({
  onLogoutClick,
  itemMenu,
}: {
  onLogoutClick: () => void;
  itemMenu: any;
}) {
  return (
    <a
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={onLogoutClick}
    >
      {itemMenu}
    </a>
  );
}
