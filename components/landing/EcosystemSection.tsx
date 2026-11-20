import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, UserRound, WalletCards } from "lucide-react";

const roles = [
  {
    title: "Clients",
    description:
      "Tired of fake listings and ghost agents? Browse verified homes, see real addresses, and message owners directly — zero broker stress.",
    icon: UserRound,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    accentBar: "bg-teal-400",
    features: [
      "Verified listings, real addresses",
      "Filter by budget, state, type",
      "Direct owner messaging",
    ],
  },
  {
    title: "Landlords",
    description:
      "Post your property once and reach the right tenant. No middlemen, no commissions lost — just clear, direct connections.",
    icon: Home,
    iconBg: "bg-sage-50",
    iconColor: "text-sage-600",
    accentBar: "bg-sage-400",
    features: [
      "Go live in under 5 minutes",
      "Identity-verified badge",
      "Manage enquiries in one place",
    ],
  },
  {
    title: "Agents",
    description:
      "Run your business on one platform. Manage listings, set your commission, and close deals without the paperwork chaos.",
    icon: WalletCards,
    iconBg: "bg-coral-50",
    iconColor: "text-coral-600",
    accentBar: "bg-coral-500",
    features: [
      "Multi-listing dashboard",
      "Custom percentage or flat fees",
      "Verified agency profile",
    ],
  },
];

export default function EcosystemSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-shell">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-500">
            Built for everyone
          </p>
          <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-900 md:text-5xl">
            One platform, <span className="text-teal-500">every role.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
            Whether you&apos;re hunting for a room, listing a duplex, or running an agency —
            HomeScout is built around how you actually work.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {roles.map(({ title, description, icon: Icon, iconBg, iconColor, accentBar, features }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:border-slate-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.06)]"
            >
              <div className={`absolute top-0 left-0 h-1 w-full ${accentBar}`} />
              <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
              <ul className="mt-5 space-y-2.5">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/register?role=${title.toLowerCase()}`}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
