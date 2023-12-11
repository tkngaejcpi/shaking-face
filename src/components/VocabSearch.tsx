import { ChangeEvent, EventHandler, MouseEvent, useState } from "react";

import { Effect, pipe } from "effect";

import { useServiceProvider } from "@hooks/useServiceProvider";
import { useThrottledEffect } from "@hooks/useThrottledEffect";

import {
  VocabFreq,
  createNewVocab,
  completeInput,
  increaseVocabFreq,
  deleteVocab,
} from "@services/VocabStore";

import { setState } from "@utils/effect";

const VocabSearch = () => {
  const provideVocablist = useServiceProvider("vocabStore");

  const [completions, setCompletions] = useState<VocabFreq[]>([]);
  const [typing, setTyping] = useState("");

  /* event - text change */
  const handleTextChange: EventHandler<ChangeEvent<HTMLInputElement>> = (e) => {
    const {
      target: { value },
    } = e;

    setTyping(value);
  };

  /* event - click "add new" */
  const handleClickAddNewVocab: EventHandler<MouseEvent> = async () => {
    /* add vocab */
    const doAddVocab = pipe(createNewVocab(typing), provideVocablist);

    await Effect.runPromise(doAddVocab);

    /* clean input */
    setTyping("");
  };

  /* event - click "+" */
  const genHandleClickAdd: (_: string) => EventHandler<MouseEvent> =
    (vocab) => async () => {
      /* add vocab */
      const doIncreaseVocabFreq = pipe(
        increaseVocabFreq(vocab),
        provideVocablist,
      );

      await Effect.runPromise(doIncreaseVocabFreq);

      /* clean input and redo completion */
      setTyping("");
      await Effect.runPromise(doCompletion);
    };

  /* event - click "x" */
  const genHandleClickDel: (_: string) => EventHandler<MouseEvent> =
    (vocab) => async () => {
      if (!window.confirm(`Do you really want to delete vocab '${vocab}'?`)) {
        return;
      }

      /* add vocab */
      const doDelVocab = pipe(deleteVocab(vocab), provideVocablist);

      await Effect.runPromise(doDelVocab);

      /* clean input and redo completion */
      setTyping("");
      await Effect.runPromise(doCompletion);
    };

  /* effects - completion */
  const doCompletion = pipe(
    completeInput(typing),
    setState(setCompletions),
    provideVocablist,
  );

  useThrottledEffect(
    100,
    () => {
      Effect.runPromise(doCompletion);
    },
    [typing],
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        className="rounded-lg border-2 p-2 text-lg font-medium outline-none transition-all duration-300 ease-in-out focus:border-amber-400"
        placeholder="Search or Add Vocab..."
        autoCapitalize="none"
        value={typing}
        onChange={handleTextChange}
      />

      {typing != "" && completions.length == 0 ? (
        <button
          className="rounded-md border-2 p-2 text-base font-medium"
          onClick={handleClickAddNewVocab}
        >
          Add '{typing}' to vocabulary store
        </button>
      ) : (
        <ul className="flex flex-col gap-2 px-[2px]">
          {completions.map(([vocab, freq], i) => (
            <li
              className="flex flex-row items-center gap-2 rounded-md border-2 border-dotted p-2 text-base font-medium"
              key={i}
            >
              <span>👉</span>
              <p>{vocab}</p>

              <span className="ml-auto flex flex-row items-center gap-2">
                {freq}x
              </span>
              <button
                className="rounded-xl border border-dashed p-1"
                onClick={genHandleClickAdd(vocab)}
              >
                ➕
              </button>
              <a
                className="rounded-xl border border-dashed p-1"
                target="_blank"
                href={`https://en.wiktionary.org/wiki/${vocab}`}
              >
                🔎
              </a>
              <button
                className="rounded-xl border border-dashed p-1"
                onClick={genHandleClickDel(vocab)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VocabSearch;
