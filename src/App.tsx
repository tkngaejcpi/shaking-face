import VocabSearch from "@components/VocabSearch";

const App = () => {
  return (
    <div className="fixed flex h-screen w-screen flex-col gap-4 bg-stone-50 p-4">
      <div  className="text-center text-[96px] select-none">🫨</div>

      <VocabSearch />

      <footer className="mt-auto flex flex-row justify-center">
        <a className="underline">About this app (not done yet!)</a>
      </footer>
    </div>
  );
};

export default App;
