import SearchBar from "@/components/searchbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchBar />
      <div>{children}</div>
    </>
  );
}
