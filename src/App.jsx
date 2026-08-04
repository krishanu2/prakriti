import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = {
  hero: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=1000&q=85",
  coach: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=85",
  about_1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=85",
  food_1: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
  workout_1: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
  mother_baby_1: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
  mother_baby_2: "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=1600&q=80",
  strength_1: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80",
  strength_2: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  gal_1: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&q=80&fit=crop",
  gal_2: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=750&q=80&fit=crop",
  gal_3: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&q=80&fit=crop",
  gal_4: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=750&q=80&fit=crop",
  gal_5: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=600&h=750&q=80&fit=crop",
  gal_6: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&h=750&q=80&fit=crop",
  gal_7: "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=750&q=80&fit=crop",
  gal_8: "https://images.unsplash.com/photo-1584863231364-2edc166de576?w=600&h=750&q=80&fit=crop",
  t1: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
  t2: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=100&q=80",
  t3: "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=100&q=80",
  t4: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
  t5: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=100&q=80",
  t6: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=100&q=80",
};

const galleryImages = [
  images.gal_1, images.gal_2, images.gal_3, images.gal_4,
  images.gal_5, images.gal_6, images.gal_7, images.gal_8,
];

const reviews = [
  { name: 'Ritika S.', context: '6 weeks postpartum', quote: "First coach who told me to slow down instead of pushing harder. My diastasis gap actually closed instead of getting worse.", img: images.t1 },
  { name: 'Ananya M.', context: 'Diastasis Recti Recovery', quote: "She explained why my old trainer's ab exercises were making things worse. Nobody had ever told me that before.", img: images.t2 },
  { name: 'Priya K.', context: '4 months postpartum', quote: "I cried reading her caption about appreciating the body you have. That's exactly how coaching with her feels too.", img: images.t3 },
  { name: 'Simran D.', context: 'Managing PCOS + Postpartum', quote: "She doesn't just program workouts. She actually checks how you're doing, and it doesn't feel fake.", img: images.t4 },
  { name: 'Neha T.', context: '1 year postpartum', quote: "I'd tried three trainers before her. She was the first one who asked about my gap before giving me a single exercise.", img: images.t5 },
  { name: 'Kavya R.', context: 'Weight regain + core strength', quote: "No shame, no rush, no 'get your body back' language. Just real, steady progress I could actually stick to.", img: images.t6 },
];

const faqs = [
  { q: "Is this safe if I'm still healing from delivery?", a: "Yes — that's the entire premise. We assess your diastasis recti and core function before any program starts, and everything is built around where your body actually is right now." },
  { q: "I'm 2 years postpartum, is it too late?", a: "No. Healing timelines aren't linear or expiring — many clients start well past the '6-week clearance' window with real, lasting results." },
  { q: "Do you coach online or in-person?", a: "Both, depending on location — most coaching happens over WhatsApp with video check-ins and form review." },
  { q: "What if I have diastasis recti or a hernia?", a: "This is specifically what the program is built around. Assessment comes first, always." },
  { q: "How is this different from a normal gym trainer?", a: "Certified pre/postnatal specialization — most gym trainers aren't trained in diastasis recti or safe postpartum progression, which is exactly why so many clients come here after a bad experience elsewhere." },
];

const revealProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

function UnderlineWord({ children }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
        <path d="M0,5 Q25,2 50,5 T100,4" stroke="var(--ink)" strokeWidth="2" fill="none" />
      </svg>
    </span>
  );
}

function CircledWord({ children }) {
  return (
    <span className="relative inline-block px-2">
      {children}
      <svg className="absolute -top-2 -left-2 pointer-events-none" style={{ width: 'calc(100% + 20px)', height: 'calc(100% + 16px)' }} viewBox="0 0 100 40" preserveAspectRatio="none">
        <ellipse cx="50" cy="20" rx="48" ry="18" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
      </svg>
    </span>
  );
}

function AccordionRow({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-black/[0.18] py-[18px] cursor-pointer">
      <div className="flex justify-between items-center gap-4">
        <span className="font-inter font-semibold text-sm text-ink tracking-wide uppercase">{title}</span>
        <span
          className="text-lg text-ink shrink-0 transition-transform duration-250"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >+</span>
      </div>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="text-body text-[13px] pt-[10px]">{body}</p>
      </motion.div>
    </div>
  );
}

function ReviewCard({ name, context, quote, img }) {
  return (
    <div className="shrink-0 w-[300px] md:w-[380px] bg-white rounded-lg p-7 border border-black/[0.10]">
      <p className="font-archivo font-bold text-3xl text-black/50 leading-none">&ldquo;</p>
      <p className="text-body text-[15px] text-ink my-3 mb-6 leading-7">{quote}</p>
      <div className="flex items-center gap-3 border-t border-black/[0.10] pt-4">
        <img src={img} alt={name} className="w-[38px] h-[38px] rounded-full object-cover" loading="lazy" />
        <div>
          <p className="font-inter font-semibold text-[13px] text-ink">{name}</p>
          <p className="text-caption text-black/50 text-[10px]">{context}</p>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links = ['Method', 'Results', 'About', 'Guide'];
  return (
    <nav className="bg-cream sticky top-0 z-[100] border-b border-black/[0.10]">
      <div className="flex items-center justify-between px-5 md:px-16 py-5">
        <div className="hidden md:flex gap-7">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="font-inter text-[13px] font-medium text-ink">
              {link}
            </a>
          ))}
        </div>

        <div className="font-archivo font-extrabold text-lg md:text-xl tracking-wide text-ink">
          STAYSTRONGSTAYWILD
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex gap-4">
            <a href="https://instagram.com/staystrongstaywild" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink text-[13px] font-medium">
              IG
            </a>
          </div>
          <a href="#start" className="btn-outline hidden sm:inline-block !py-2.5 !px-5 !text-[11px]">
            Start the Conversation
          </a>
          <button
            className="md:hidden bg-transparent border-none text-xl text-ink cursor-pointer"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle menu"
          >
            {drawerOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-cream overflow-hidden border-t border-black/[0.10]"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {links.map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setDrawerOpen(false)}
                  className="font-archivo font-bold text-[28px] text-ink"
                >
                  {link}
                </a>
              ))}
              <a href="#start" onClick={() => setDrawerOpen(false)} className="sm:hidden btn-outline mt-2">
                Start the Conversation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] min-h-[auto] md:h-[clamp(500px,80vh,780px)]">
      <div className="bg-blush flex flex-col justify-center px-5 py-14 md:px-16 md:py-0 order-2 md:order-1">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-display text-ink mb-6"
        >
          Strength comes back<br />
          <UnderlineWord>slower</UnderlineWord> than you<br />
          expected. <UnderlineWord>That's okay.</UnderlineWord>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-body max-w-[380px] mb-8"
        >
          Pre and postnatal coaching built around healing first —
          for real bodies, real recovery timelines, real Indian moms.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          href="#start"
          className="btn-outline w-full sm:w-auto text-center"
        >
          Start the Conversation
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden h-[380px] md:h-full order-1 md:order-2"
      >
        <img
          src={images.hero}
          alt="Prakriti Bhonsle, pre/postnatal fitness coach"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 15%' }}
        />
      </motion.div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="bg-cream py-8 overflow-hidden">
      <div className="marquee-track flex w-max">
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className="text-marquee whitespace-nowrap pr-12"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,25,23,0.5)' }}
          >
            HEAL FIRST ✳ STRENGTH FOLLOWS ✳ NO RUSH ✳
          </span>
        ))}
      </div>
    </section>
  );
}

function AboutPrakritiSection() {
  return (
    <section id="about" className="bg-cream px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative order-1"
        >
          <div className="h-[360px] md:h-[520px] overflow-hidden rounded">
            <img src={images.coach} alt="Prakriti Bhonsle, certified pre/postnatal fitness coach" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block absolute -bottom-6 -right-6 bg-blush px-6 py-4 rounded border border-black/[0.10]">
            <p className="font-archivo font-extrabold text-2xl text-ink leading-none">4+</p>
            <p className="text-caption text-black/50 mt-1">Years Specializing Postnatal</p>
          </div>
        </motion.div>

        <div className="order-2">
          <motion.p {...revealProps} className="text-caption text-black/50 mb-4">
            Meet Your Coach
          </motion.p>
          <motion.h2 {...revealProps} className="text-h2 text-ink mb-6">
            Hi, I'm <UnderlineWord>Prakriti.</UnderlineWord>
          </motion.h2>
          <motion.div {...revealProps} className="text-body space-y-4 mb-8">
            <p>
              I'm a certified pre and postnatal fitness coach — but before that,
              I was a client. I know what it's like to look at your own postpartum
              body and not recognize it, and to be handed generic workouts that
              made things worse instead of better.
            </p>
            <p>
              That's why every program I build starts with one question: where is
              your body actually right now? Not where a caption says it should be
              by six weeks. Not where your pre-baby jeans say it should be. Where
              it actually is.
            </p>
            <p>
              I've spent the last four years specializing in diastasis recti
              recovery and safe postpartum strength for Indian moms — because
              healing looks different when you're also running a household,
              feeding a newborn, and running on four hours of sleep. My job isn't
              to push you harder. It's to help you get strong enough to trust
              your body again.
            </p>
          </motion.div>
          <motion.a
            {...revealProps}
            href="https://instagram.com/staystrongstaywild"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Follow the Journey on Instagram
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function TransformPhilosophySection() {
  return (
    <section className="bg-cream px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[900px] mx-auto text-center relative">
        <div className="hidden md:block absolute -top-10 right-0 w-[110px] h-[110px] rounded overflow-hidden">
          <img src={images.food_1} alt="Healthy plate of eggs and berries" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block absolute top-5 -left-5 w-[90px] h-[110px] rounded overflow-hidden">
          <img src={images.about_1} alt="Calm, seated portrait" className="w-full h-full object-cover" />
        </div>

        <motion.h2 {...revealProps} className="text-h2 text-ink mb-5">
          <CircledWord>Heal</CircledWord> before you push
        </motion.h2>
        <motion.p {...revealProps} className="text-body max-w-[520px] mx-auto mb-8">
          A sword cannot replace a needle. Your body needs to be ready before
          complex training — diastasis recti recovery, core function, and safe
          progression come first. Strength you can trust comes after.
        </motion.p>
        <motion.a {...revealProps} href="#method" className="btn-outline">
          See How We Assess Your Body
        </motion.a>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const pillars = [
    { num: '01', title: 'Heal', desc: 'Diastasis recti assessment, core function check, safe movement patterns — before any intensity.' },
    { num: '02', title: 'Rebuild', desc: "Foundational strength work matched to your actual recovery stage, not a generic timeline." },
    { num: '03', title: 'Strengthen', desc: "Progressive, sustainable training that respects a mother's real life — not a punishing regimen." },
  ];
  return (
    <section id="method" className="bg-blush px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2 {...revealProps} className="text-h2 text-ink text-center mb-14">
          Three stages. <UnderlineWord>One timeline</UnderlineWord> that's actually yours.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-cream p-9 md:p-9 rounded-lg border border-black/[0.10]"
            >
              <span className="font-archivo font-extrabold text-[13px] text-black/50">{pillar.num}</span>
              <h3 className="text-h3 text-ink my-3">{pillar.title}</h3>
              <p className="text-body text-sm">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramDetailSection() {
  const items = [
    { title: 'Diastasis Recti Assessment', body: 'Finger-width gap measurement and healing-stage tracking before any program begins.' },
    { title: 'Personalized Movement Plan', body: 'Matched to your recovery stage — never generic, never rushed.' },
    { title: 'Ongoing Check-Ins', body: "Real accountability through direct WhatsApp/DM support, not an app you'll ignore." },
  ];
  return (
    <section className="bg-cream px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[320px] md:h-[clamp(360px,45vw,520px)] overflow-hidden rounded order-1"
        >
          <img src={images.workout_1} alt="Postpartum-friendly home workout" className="w-full h-full object-cover" />
        </motion.div>

        <div className="order-2">
          <h2 className="text-h2 text-ink mb-2">Postpartum Strength Coaching</h2>
          <p className="text-caption text-black/50 mb-5">Starting after your assessment call</p>
          <p className="text-body mb-7">
            Whether you're 6 weeks or 2 years postpartum, coaching adapts to
            where your body actually is — not a generic 12-week program.
          </p>

          {items.map((item, i) => <AccordionRow key={i} {...item} />)}

          <a href="#start" className="btn-outline mt-6 inline-block">
            Start Your Recovery Journey
          </a>
        </div>
      </div>
    </section>
  );
}

function CredentialsStrip() {
  const stats = [
    { num: '250+', label: 'Moms Coached' },
    { num: '4', label: 'Yrs Specializing Postnatal' },
    { num: 'Certified', label: 'Pre/Postnatal Coach' },
    { num: '6-10wk', label: 'Avg. DR Gap Improvement' },
  ];
  return (
    <section className="bg-blush px-5 md:px-16 py-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="font-archivo font-extrabold text-2xl md:text-3xl text-ink">{stat.num}</p>
            <p className="text-caption text-ink/70 mt-1.5 text-[11px] md:text-[13px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection() {
  const track = [...galleryImages, ...galleryImages];
  return (
    <section id="results" className="bg-cream py-14 md:py-[clamp(64px,9vw,120px)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 mb-10">
        <motion.h2 {...revealProps} className="text-h2 text-ink">
          Real moms. <UnderlineWord>Real strength.</UnderlineWord>
        </motion.h2>
      </div>

      <div className="overflow-hidden">
        <div className="gallery-track flex gap-4 w-max">
          {track.map((img, i) => (
            <div key={i} className="shrink-0 w-[220px] md:w-[clamp(220px,24vw,300px)] aspect-[4/5] rounded overflow-hidden">
              <img src={img} alt="Client journey" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TransformationSection() {
  const items = [
    { context: '8 weeks postpartum', detail: 'DR gap: 3-finger → 1-finger', img: images.mother_baby_1 },
    { context: '16 weeks postpartum', detail: 'Core function restored, back to running', img: images.strength_1 },
    { context: '6 months postpartum', detail: 'Full strength training cleared', img: images.strength_2 },
  ];
  return (
    <section className="bg-blush px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2 {...revealProps} className="text-h2 text-ink text-center mb-12">
          Not "before and after." <UnderlineWord>Just honest progress.</UnderlineWord>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="h-[280px] md:h-[320px] rounded overflow-hidden mb-4">
                <img src={item.img} alt={item.context} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-caption text-black/50">{item.context}</p>
              <p className="font-inter font-semibold text-sm text-ink mt-1">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const track = [...reviews, ...reviews];
  return (
    <section className="bg-cream py-14 md:py-[clamp(64px,9vw,120px)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 mb-10">
        <motion.h2 {...revealProps} className="text-h2 text-ink">
          What moms are <UnderlineWord>actually saying</UnderlineWord>
        </motion.h2>
      </div>

      <div className="overflow-hidden">
        <div className="reviews-track flex gap-5 w-max">
          {track.map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>
      </div>
    </section>
  );
}

function ProofDMSection() {
  const messages = [
    { text: "Prakriti I just wanted to say thank you... my gap is finally down to 1 finger after 8 months of nothing working", time: '9:42 PM', tag: 'DR Recovery' },
    { text: "went for my checkup today and the doctor said everything looks great, couldnt have done this without your guidance", time: '11:15 AM', tag: '6mo Postpartum' },
  ];
  return (
    <section className="bg-blush px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[900px] mx-auto">
        <motion.h2 {...revealProps} className="text-h2 text-ink text-center mb-12">
          The messages that matter <UnderlineWord>most</UnderlineWord>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl rounded-bl-md px-6 py-5 relative"
            >
              <span className="text-caption text-black/50 block mb-2">{msg.tag}</span>
              <p className="font-inter text-sm text-ink leading-relaxed">{msg.text}</p>
              <div className="flex justify-end items-center gap-1 mt-3">
                <span className="text-[11px] text-black/50">{msg.time}</span>
                <span className="text-[11px] text-ink">✓✓</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <img
        src={images.mother_baby_2}
        alt="Mother and baby"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.55)' }}
      />
      <div className="relative max-w-[700px] mx-auto text-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="font-archivo font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-cream leading-snug"
        >
          The problem was never your postpartum body.
          It was that you never learned to appreciate the one you had.
        </motion.p>
      </div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-black/[0.18] py-5 cursor-pointer">
      <div className="flex justify-between items-center gap-4">
        <span className="font-inter font-semibold text-[15px] text-ink">{q}</span>
        <span
          className="text-xl text-ink shrink-0 transition-transform duration-250"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >+</span>
      </div>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="text-body text-sm pt-3 max-w-[600px]">{a}</p>
      </motion.div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="guide" className="bg-cream px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[720px] mx-auto">
        <motion.h2 {...revealProps} className="text-h2 text-ink text-center mb-12">
          Questions, <UnderlineWord>answered honestly</UnderlineWord>
        </motion.h2>
        <div>
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section id="start" className="bg-cream px-5 md:px-16 py-20 md:py-[clamp(80px,12vw,160px)] text-center">
      <div className="max-w-[640px] mx-auto">
        <motion.h2 {...revealProps} className="text-display text-ink mb-7">
          Tell me where you're <UnderlineWord>starting from.</UnderlineWord>
        </motion.h2>
        <motion.p {...revealProps} className="text-body mb-9">
          No forms that feel like a funnel. Just a real conversation about your body, right now.
        </motion.p>
        <motion.a
          {...revealProps}
          href="https://instagram.com/staystrongstaywild"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !px-11 !py-[18px]"
        >
          Start the Conversation
        </motion.a>
      </div>
    </section>
  );
}

function Footer() {
  const links = ['Method', 'Results', 'About', 'Guide'];
  return (
    <footer className="bg-blush px-5 md:px-16 pt-10 md:pt-16 pb-6">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between flex-wrap gap-6 pb-8 border-b border-black/[0.18]">
        <div>
          <p className="font-archivo font-extrabold text-base text-ink">STAYSTRONGSTAYWILD</p>
          <p className="text-caption text-black/50 mt-1.5">Certified Pre/Postnatal Coach · India</p>
        </div>
        <div className="flex gap-8 flex-wrap">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="font-inter text-[13px] text-ink/70">{l}</a>
          ))}
        </div>
      </div>
      <p className="text-center font-inter text-xs text-black/50 pt-5">
        © 2026 Prakriti Bhonsle
      </p>
    </footer>
  );
}

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearFooter = window.innerHeight + window.scrollY > document.body.scrollHeight - 400;
      setVisible(window.scrollY > 500 && !nearFooter);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sm:hidden">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-cream border-t border-black/[0.18] px-4 py-3"
          >
            <a href="#start" className="btn-outline block text-center w-full">
              Start the Conversation
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-cream">
      <Navbar />
      <HeroSection />
      <AboutPrakritiSection />
      <MarqueeSection />
      <TransformPhilosophySection />
      <PhilosophySection />
      <ProgramDetailSection />
      <CredentialsStrip />
      <GallerySection />
      <TransformationSection />
      <ReviewsSection />
      <ProofDMSection />
      <ManifestoSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
