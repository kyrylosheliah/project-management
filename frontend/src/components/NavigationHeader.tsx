import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { defaultSearchParams } from "../types/Search";
import ButtonIcon from "./ui/ButtonIcon";
import { IconClose } from "./icons/Close";
import { IconMenu } from "./icons/Menu";
import { Breadcrumbs } from "./Breadcrumbs";

export function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xl font-bold"
            >
              Home
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/projects"
              search={defaultSearchParams}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Projects
            </Link>
            <Link
              to="/users"
              search={defaultSearchParams}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Users
            </Link>
            <Link
              to="/tasks"
              search={defaultSearchParams}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tasks
            </Link>
          </nav>
          <ButtonIcon
            className="md:hidden w-8 h-8"
            props={{
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
          >
            {isMobileMenuOpen ? (
              <IconClose />
            ) : (
              <IconMenu />
            )}
          </ButtonIcon>
        </div>
        <div className="pb-4">
          <Breadcrumbs />
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
            <nav className="space-y-2">
              <Link
                to="/projects"
                search={defaultSearchParams}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/users"
                search={defaultSearchParams}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                to="/tasks"
                search={defaultSearchParams}
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tasks
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
