import { envelopeClosed as envelopeArt, waxSeal, laceCar, coverLaceCar } from "@/assets/wedding";

export function WaxSeal({ className = "" }: { className?: string }) {
  return <img src={waxSeal.url} alt="LT wax seal" width={168} height={168} className={className} />;
}

export function InvitationCard() {
  return (
    <div className="invite-card paper-ivory flex flex-col items-center px-[7%] pt-[9%] text-center text-ivory-ink">
      <p className="font-sans text-[9px] font-medium uppercase tracking-[0.14em]">
        With love, you're invited to
        <br />
        the wedding of
      </p>
      <h2 className="mt-3 font-display text-[clamp(2rem,10vw,2.75rem)] font-normal uppercase leading-[0.95] tracking-tight">
        Lojain
        <span className="block font-serif text-[0.8em] italic normal-case">&amp;</span>
        Taha
      </h2>
      <p className="mt-3 font-display text-[clamp(0.95rem,4.4vw,1.15rem)] uppercase leading-tight">
        <span className="font-serif italic normal-case">A</span>n evening of love, laughter, and a little bit of magic.
      </p>
      <p className="mt-3 font-sans text-[9px] font-medium uppercase tracking-[0.12em]">November 11th, 2026 — 5:30 PM</p>
      <img src={laceCar.url} alt="Vintage wedding car draped in lace" width={518} height={320} className="mt-2 w-[42%] mix-blend-multiply" />
    </div>
  );
}

export function Envelope({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const art = { backgroundImage: `url(${envelopeArt.url})` };
  return (
    <div className="envelope mx-auto" data-open={open}>
      <div className="envelope-back" />
      <div className="card-slot" aria-hidden={!open}>
        <InvitationCard />
      </div>
      <div className="envelope-pocket envelope-art" style={art} />
      <div className="envelope-flap" aria-hidden>
        <div className="flap-front envelope-art" style={art} />
        <div className="flap-back" style={{ backgroundImage: `url(${coverLaceCar.url})` }} />
        {open && (
          <>
            <WaxSeal className="flap-seal flap-seal-front" />
            <WaxSeal className="flap-seal flap-seal-back" />
          </>
        )}
      </div>
      {!open && (
       <button
        type="button"
        onClick={() => {
          if (!open) onOpen();
        }}
        disabled={open}
        tabIndex={open ? -1 : 0}
        aria-hidden={open}
        aria-label="Open the invitation envelope"
        className="envelope-button absolute inset-0 z-50 cursor-pointer"
      >
        <span className="seal-ring" aria-hidden />
        <WaxSeal className="envelope-seal" />
      </button>
      )}
    </div>
  );
}