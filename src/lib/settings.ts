export type Link = { label: string; href: string };
export type SocialLink = Link & { name: string };

export type Settings = {
  site: {
    brand: string;
    brandAccent: string;
    tagline: string;
    nav: Link[];
    socials: SocialLink[];
    copyright: string;
  };
  hero: {
    headline: string;
    subtext: string;
    primary: Link;
    secondary: Link;
    photo: string;
    photoAlt: string;
    handle: string;
    resumeLabel: string;
  };
  work: { intro: string };
  experience: { intro: string };
  services: { heading: string };
  about: { heading: string; p1: string; p2: string; timelineTitle: string };
  skills: { intro: string };
  notes: { intro: string };
  cta: {
    heading: string;
    text: string;
    callLabel: string;
    callHref: string;
    email: string;
  };
};

export const defaults: Settings = {
  site: {
    brand: "farvees",
    brandAccent: ".xyz",
    tagline: "Software built to last. Bugs fixed for good.",
    nav: [
      { label: "Experience", href: "/#experience" },
      { label: "Skills", href: "/#skills" },
      { label: "Work", href: "/#work" },
      { label: "Services", href: "/#services" },
      { label: "About", href: "/#about" },
      { label: "Notes", href: "/notes" },
      { label: "Contact", href: "/#contact" },
    ],
    socials: [
      { name: "GitHub", label: "GH", href: "https://github.com/mrfarvees-official" },
      { name: "LinkedIn", label: "in", href: "#" },
      { name: "X", label: "X", href: "#" },
    ],
    copyright: "© {year} Saroath Farvees",
  },
  hero: {
    headline:
      "Hi, I'm Saroath Farvees. I build web software that ships and stays up.",
    subtext: "Full-stack developer working with founders and small teams. Bring a rough idea and I'll ship it, or bring a codebase that's struggling and I'll make it solid.",
    primary: { label: "See my work", href: "/#work" },
    secondary: { label: "Book a call", href: "#" },
    photo: "",
    photoAlt: "Saroath Farvees",
    handle: "mrfarvees-official",
    resumeLabel: "Download resume",
  },
  work: {
    intro: "Projects I've built, each with a live link or the code to check.",
  },
  experience: { intro: "Professional and freelance engagements. Client details stay private, so this covers what I built and the problems I solved." },
  services: { heading: "What I can do for you" },
  about: {
    heading: "About",
    p1: "[Two or three sentences: who you are and what you care about in software, for example speed, clarity, code other people can keep working on.]",
    p2: "[One or two sentences: the kinds of things you've built, and what you do outside of code.]",
    timelineTitle: "Started",
  },
  skills: { intro: "What I use to build and fix things." },
  notes: {
    intro: "Bugs I tracked down, and what I learned building my projects.",
  },
  cta: {
    heading: "Got a project, an idea, or a bug that won't die?",
    text: "Book a 30-minute call or send an email. Either way, you'll be talking to me directly.",
    callLabel: "Book a call",
    callHref: "#",
    email: "hello@yourdomain.dev",
  },
};
