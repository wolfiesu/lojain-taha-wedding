import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { weddingMusic as musicAsset } from "@/assets/wedding";

export type MusicStatus = "loading" | "playing" | "paused" | "blocked" | "error";

type MusicCtx = { status: MusicStatus; toggle: () => void; play: () => void };
const Ctx = createContext<MusicCtx | null>(null);

export function useMusic() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic outside MusicProvider");
  return c;
}

/** One persistent <audio> for the whole site; lives in the root layout so it never remounts. */
export function MusicProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<MusicStatus>("loading");
  const userPaused = useRef(false);

  const play = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    userPaused.current = false;
    if (a.error) a.load();
    a.play().then(
      () => setStatus("playing"),
      (e: unknown) => {
        const name = (e as { name?: string })?.name;
        setStatus(name === "NotAllowedError" ? "blocked" : a.error ? "error" : "blocked");
      },
    );
  }, []);

  const toggle = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    if (!a.paused) {
      userPaused.current = true;
      a.pause();
    } else play();
  }, [play]);

  // Try autoplay on open; if blocked, start on the first tap anywhere.
  useEffect(() => {
    play();
    const onFirst = () => {
      const a = ref.current;
      if (a && a.paused && !userPaused.current) play();
    };
    document.addEventListener("pointerdown", onFirst, { once: true, capture: true });
    document.addEventListener("keydown", onFirst, { once: true, capture: true });
    return () => {
      document.removeEventListener("pointerdown", onFirst, { capture: true });
      document.removeEventListener("keydown", onFirst, { capture: true });
    };
  }, [play]);

  return (
    <Ctx.Provider value={{ status, toggle, play }}>
      <audio
        ref={ref}
        src={musicAsset.url}
        loop
        preload="auto"
        playsInline
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus((s) => (s === "error" ? s : "paused"))}
        onError={() => setStatus("error")}
      />
      {children}
    </Ctx.Provider>
  );
}

export function MusicControl() {
  const { status, toggle, play } = useMusic();
  const playing = status === "playing";
  // The "tap to play" hint is shown briefly, then gets out of the way.
  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    if (status !== "blocked" && status !== "error") return;
    setHintVisible(true);
    const t = setTimeout(() => setHintVisible(false), 7000);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <>
      <button
        type="button"
        onClick={status === "error" ? play : toggle}
        aria-label={playing ? "Pause music" : status === "error" ? "Retry loading music" : "Play music"}
        aria-pressed={playing}
        className="fixed right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-antique backdrop-blur transition-colors hover:text-primary"
        style={{ top: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        {playing ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2px] bg-current animate-soft-pulse"
                style={{ height: `${[10, 16, 7][i]}px`, animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
            {status !== "loading" && <path d="M3 3l18 18" opacity=".7" />}
          </svg>
        )}
      </button>
      {(status === "blocked" || status === "error") && hintVisible && (
        <button
          type="button"
          onClick={play}
          className="fixed right-16 z-50 animate-fade-up rounded-full border border-border bg-background/85 px-4 py-2.5 label-caps text-[9px] text-antique backdrop-blur"
          style={{ top: "calc(env(safe-area-inset-top) + 16px)" }}
        >
          {status === "error" ? "Tap to retry music" : "♪ Tap to play music"}
        </button>
      )}
    </>
  );
}
