"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/components/searchbar.module.css";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 동적 라우팅
  const router = useRouter(); // import 주의
  const handleSearch = () => {
    if (!search) {
      return;
    }
    router.push(`/search?keyword=${search}`);
    setSearch("");
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={search}
        onChange={(e) => onChangeSearch(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};
export default SearchBar;
