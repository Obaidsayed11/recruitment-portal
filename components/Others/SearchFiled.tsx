import React from "react";
import { BiSearchAlt } from "react-icons/bi";

interface SearchFieldProps {
  className?: string;
  searchQuery?: string;
  handleSearchQueryChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
}

const SearchField: React.FC<SearchFieldProps> = (props) => {
  return (
    <div className={`relative w-full md:w-[480px]`}>
      <input
        className={`bg-secondary w-full rounded-full focus:outline-none focus:border-primary text-gray-500 border pr-4 pl-10 py-2`}
        type="search"
        value={props.searchQuery}
        onChange={props.handleSearchQueryChange}
        placeholder={props.placeholder}
      />
      <BiSearchAlt className="text-xl text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchField;
