import { IoIosSearch } from "react-icons/io";

const SearchBar = ({ search, setSearch, searchCss }) => {
  return (
    <div className="flex relative bg-white px-3 py-2">
      <IoIosSearch
        size={20}
        className="absolute left-5 top-4 text-gray-400"
        color="black"
      />
      <input
        type="text"
        placeholder="Search"
        className={`h-[37px] border w-full px-1 pl-8 ${searchCss}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
