import { sprig, flourish, carClassic } from "@/assets/wedding";

export function Sprig({ className = "" }: { className?: string }) {
  return <img src={sprig.url} alt="" aria-hidden width={75} height={73} className={`art-on-dark fade-edges mx-auto h-12 w-auto ${className}`} />;
}

export function Flourish({ className = "" }: { className?: string }) {
  return <img src={flourish.url} alt="" aria-hidden width={295} height={75} className={`art-on-dark mx-auto w-64 ${className}`} />;
}

export function HeartDivider({ className = "", tone = "text-muted-foreground" }: { className?: string; tone?: string }) {
  return (
    <div className={`mx-auto flex w-48 items-center gap-3 ${tone} ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-60" />
      <svg width="10" height="9" viewBox="0 0 24 22" fill="currentColor">
        <path d="M12 21.6 10.3 20C4.2 14.5.2 10.9.2 6.4.2 2.8 3 0 6.6 0c2 0 4 1 5.4 2.5C13.4 1 15.4 0 17.4 0 21 0 23.8 2.8 23.8 6.4c0 4.5-4 8.1-10.1 13.6Z" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}

export function SmallCar({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex flex-col items-center ${className}`} aria-hidden>
      <img src={carClassic.url} alt="" width={285} height={145} className="art-on-dark w-24 opacity-80" />
    </div>
  );
}
