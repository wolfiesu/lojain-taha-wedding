import { createFileRoute, Link } from "@tanstack/react-router";
import { Flourish, HeartDivider } from "@/components/wedding/ornaments";
import { tl0, tl1, tl2, carClassic, branchLeft } from "@/assets/wedding";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Wedding Timeline & Details — Lojain & Taha" },
      { name: "description", content: "Guest arrival at 5:30 PM, the bride's grand entrance at 7:00 PM, ceremony & reception at Ronza Hall." },
      { property: "og:title", content: "Wedding Timeline & Details — Lojain & Taha" },
      { property: "og:description", content: "The evening's timeline for Lojain & Taha's wedding at Ronza Hall." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Details,
});

const timeline = [
  { img: tl0.url, time: "5:30 PM", title: "Guest Arrival", alt: "Guests gathering together" },
  { img: tl1.url, time: "7:00 PM", title: "Bride's Grand Entrance", alt: "The bride in her wedding dress" },
  { img: tl2.url, time: null, title: "Ceremony & Reception\nat Ronza Hall", alt: "Ronza Hall wedding venue" },
];

function TimelineEntry({ img, time, title, alt, last }: (typeof timeline)[number] & { last: boolean }) {
  return (
    <li className={`flex items-center gap-6 py-4 ${last ? "" : "border-b border-dotted border-border"}`}>
      <img src={img} alt={alt} width={116} height={116} className="h-24 w-24 shrink-0 rounded-full" />
      <div>
        {time && <p className="font-serif text-2xl tracking-wide text-antique">{time}</p>}
        <p className="whitespace-pre-line font-serif text-xl italic leading-snug text-muted-foreground">{title}</p>
      </div>
    </li>
  );
}

function Details() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col items-center overflow-hidden px-6 pb-28 pt-10">
      <Flourish />
      <h1 className="mt-4 text-center font-serif uppercase leading-tight text-antique">
        <span className="block text-4xl tracking-[0.08em]">Wedding</span>
        <span className="block text-[1.6rem] tracking-[0.05em]">Timeline &amp; Details</span>
      </h1>
      <HeartDivider className="mt-4 w-56" />

      <ol className="mt-6 w-full max-w-sm">
        {timeline.map((t, i) => (
          <TimelineEntry key={i} {...t} last={i === timeline.length - 1} />
        ))}
      </ol>

      <div className="relative mt-2 w-full max-w-sm">
        <img src={branchLeft.url} alt="" aria-hidden width={118} height={295} className="art-on-dark absolute -left-2 top-0 w-20" />
        <img
          src={branchLeft.url}
          alt=""
          aria-hidden
          width={118}
          height={295}
          className="art-on-dark absolute -right-2 top-2 w-14 -scale-x-100 opacity-80"
        />
        <img src={carClassic.url} alt="Vintage classic car illustration" width={285} height={145} className="art-on-dark relative mx-auto w-60" />
        <div className="relative mt-6 flex justify-end">
          <Link
            to="/rsvp"
            className="flex flex-col items-center rounded-md border border-antique/40 bg-olive px-7 py-3 text-ivory shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span className="font-serif text-2xl leading-none">TL</span>
            <span className="my-1 h-px w-10 bg-current opacity-50" />
            <span className="font-serif text-lg tracking-[0.25em]">RSVP</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
