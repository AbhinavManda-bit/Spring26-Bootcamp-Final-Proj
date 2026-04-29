/*
Component Description:
- Top navigation bar used across all pages.
- Handles routing to main sections like Catalog, Cart, Profile, and Seller Dashboard, and may show login/logout state.
*/

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HIDDEN_ROUTES = new Set(['/login', '/signup', '/recover']);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (HIDDEN_ROUTES.has(location.pathname)) return null;

  function handleSearchSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <nav
      style={{ backgroundColor: '#E05353' }}
      className="flex items-center justify-between px-6 py-3 w-full"
    >
      <NavbarLogo />

      <NavbarSearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSubmit={handleSearchSubmit}
      />

      <NavbarIconGroup currentUser={currentUser} />
    </nav>
  );
}

function NavbarLogo() {
  return (
    <Link
      to="/"
      className="font-bold text-black text-xl whitespace-nowrap"
      style={{ textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}
    >
      ThriftUMD
    </Link>
  );
}

interface NavbarSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
}

function NavbarSearchBar({ searchQuery, onSearchQueryChange, onSubmit }: NavbarSearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 mx-8"
      style={{ maxWidth: '600px' }}
    >
      <SearchBarInputWrapper>
        <SearchIcon />
        <SearchBarInput
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </SearchBarInputWrapper>
    </form>
  );
}

function SearchBarInputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2">
      {children}
    </div>
  );
}

interface SearchBarInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchBarInput({ value, onChange }: SearchBarInputProps) {
  return (
    <input
      type="text"
      placeholder="Search for items..."
      value={value}
      onChange={onChange}
      className="flex-1 bg-transparent outline-none text-gray-600 text-base"
    />
  );
}

function NavbarIconGroup({ currentUser }: { currentUser: { photoURL: string | null } | null }) {
  return (
    <div className="flex items-center gap-4">
      <CartIconButton />
      <ProfileAvatarButton photoURL={currentUser?.photoURL ?? null} />
    </div>
  );
}

function CartIconButton() {
  return (
    <Link to="/cart" className="text-black" aria-label="Cart">
      <CartIcon />
    </Link>
  );
}

function ProfileAvatarButton({ photoURL }: { photoURL: string | null }) {
  return (
    <Link to="/profile" className="text-black" aria-label="Profile">
      {photoURL ? (
        <img
          src={photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <ProfileIcon />
      )}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 shrink-0"
      style={{ color: '#9ca3af' }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
