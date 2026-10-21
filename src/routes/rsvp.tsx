import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { HeartDivider, Sprig } from "@/components/wedding/ornaments";
import { validateRsvp, MAX_GUESTS, MIN_GUESTS, type Attendance, type RsvpErrors } from "@/lib/rsvp";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: "Kindly Reply — RSVP for Lojain & Taha" },
      { name: "description", content: "Let Lojain & Taha know if you'll join their wedding celebration on November 11th, 2026." },
      { property: "og:title", content: "Kindly Reply — RSVP for Lojain & Taha" },
      { property: "og:description", content: "RSVP to the wedding of Lojain & Taha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rsvp,
});

const field = "label-caps block text-[10px] text-muted-foreground";
const input =
  "mt-2 w-full rounded-sm border border-input bg-transparent px-4 py-3 font-serif text-lg text-primary placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none";

/**
 * Shared destination for replies. Set VITE_RSVP_ENDPOINT (e.g. a Formspree / Getform /
 * Google Apps Script URL that accepts a JSON POST) in `.env` to deliver RSVPs to the couple.
 * Without it, replies are only saved in this guest's own browser.
 */
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbwvvmzKsIrCq-doNWhX2yOLCUHGG6AAyHcDiBl2d9bzpQoVK5ELIVVjwfJovONBJya8/exec";
function Rsvp() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guests, setGuests] = useState(1);
  const [diet, setDiet] = useState("");
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const errs = validateRsvp({ name, attendance, guests });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const entry = { name: name.trim(), attendance, guests: attendance === "accept" ? guests : 0, diet: attendance === "accept" ? diet.trim() : "", at: new Date().toISOString() };
      try {
        localStorage.setItem("lt-rsvp", JSON.stringify(entry));
      } catch {
        /* storage can be unavailable (private mode); delivery below is what matters */
      }
      if (RSVP_ENDPOINT) {
        const res = await fetch(RSVP_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`RSVP endpoint responded ${res.status}`);
      } else {
        console.warn("RSVP not delivered anywhere: set VITE_RSVP_ENDPOINT to receive replies.");
      }
      setState("done");
    } catch {
      setState("failed");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-6 pb-32 pt-16">
      <Sprig />
      <h1 className="mt-3 font-serif text-5xl italic text-antique">Kindly Reply</h1>
      <p className="label-caps mt-3 text-[11px] text-muted-foreground">We hope to see you there</p>
      <HeartDivider className="mt-4" />

      {state === "done" ? (
        <div role="status" className="mt-12 animate-fade-up text-center">
          <p className="font-serif text-3xl italic text-primary">Thank you, {name.trim().split(" ")[0]}</p>
          <p className="mt-3 font-serif text-lg text-muted-foreground">
            {attendance === "accept" ? "We can't wait to celebrate with you." : "You will be dearly missed."}
          </p>
          {!RSVP_ENDPOINT && (
            <p className="label-caps mt-6 text-[9px] leading-relaxed text-muted-foreground/70">
              Setup note: replies are saved on this device only until an RSVP endpoint is configured.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 w-full space-y-7">
          <div>
            <label htmlFor="name" className={field}>Guest full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" maxLength={100} className={input} aria-invalid={!!errors.name} />
            {errors.name && <p className="mt-1 font-serif text-sm italic text-destructive">{errors.name}</p>}
          </div>

          <fieldset>
            <legend className={field}>Attendance</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(["accept", "decline"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={attendance === a}
                  onClick={() => setAttendance(a)}
                  className={`rounded-sm border px-2 py-3 font-serif text-lg transition-colors ${attendance === a ? "border-antique bg-secondary text-primary" : "border-input text-muted-foreground hover:border-ring"}`}
                >
                  {a === "accept" ? "Joyfully Accept" : "Regretfully Decline"}
                </button>
              ))}
            </div>
            {errors.attendance && <p className="mt-1 font-serif text-sm italic text-destructive">{errors.attendance}</p>}
          </fieldset>

          {attendance !== "decline" && (
            <>
              <div>
                <span className={field} id="guests-label">Number of guests</span>
                <div className="mt-2 flex items-center justify-between rounded-sm border border-input px-2 py-1" aria-labelledby="guests-label">
                  <button type="button" aria-label="Fewer guests" disabled={guests <= MIN_GUESTS} onClick={() => setGuests((g) => Math.max(MIN_GUESTS, g - 1))} className="h-11 w-11 font-serif text-2xl text-antique disabled:opacity-30">−</button>
                  <output aria-live="polite" className="font-serif text-2xl text-primary">{guests}</output>
                  <button type="button" aria-label="More guests" disabled={guests >= MAX_GUESTS} onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))} className="h-11 w-11 font-serif text-2xl text-antique disabled:opacity-30">+</button>
                </div>
                {errors.guests && <p className="mt-1 font-serif text-sm italic text-destructive">{errors.guests}</p>}
              </div>
              <div>
                <label htmlFor="diet" className={field}>Special dietary requirements <span className="normal-case tracking-normal opacity-70">(optional)</span></label>
                <textarea id="diet" value={diet} onChange={(e) => setDiet(e.target.value)} rows={2} maxLength={300} placeholder="Allergies, preferences…" className={input} />
              </div>
            </>
          )}

          {state === "failed" && <p role="alert" className="font-serif italic text-destructive">Something went wrong sending your reply. Please try again.</p>}

          <button type="submit" disabled={state === "sending"} className="w-full rounded-sm bg-primary py-4 font-serif text-xl tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
            {state === "sending" ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </main>
  );
}
