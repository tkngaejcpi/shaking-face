import Logo from "@components/Logo";
import VocabSearch from "@components/VocabSearch";

const App = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col gap-4 bg-stone-50 p-4">
      <Logo/>

      <VocabSearch />

      <footer className="mt-auto flex flex-row justify-center">
        <a className="underline">About this app (not done yet!)</a>
      </footer>
    </div>
  );
};

export default App;
