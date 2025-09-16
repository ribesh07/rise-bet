
import { FC, ChangeEvent } from "react";

interface SearchBarProps {
  category: string;
  onCategoryChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string; // ✅ allow external styling
}

const SearchBar: FC<SearchBarProps> = ({
  category,
  onCategoryChange,
  searchValue,
  onSearchChange,
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center bg-[#1a1a1a] rounded-full border border-gray-700 px-3 py-2 w-full hover:border-gray-500 transition-colors ${className}`}
    >
      {/* Dropdown */}
      <select
        value={category}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onCategoryChange(e.target.value)
        }
        className="bg-transparent text-gray-300 text-sm outline-none pr-3 border-r border-gray-700 cursor-pointer"
      >
        <option value="casino">Casino</option>
        <option value="sports">Sports</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search your game"
        className="bg-transparent text-gray-300 placeholder-gray-500 text-sm outline-none flex-1 px-3"
      />

      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
