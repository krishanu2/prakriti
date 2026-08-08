import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useInView,
  animate,
} from 'framer-motion';

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

// Fallback content — shown instantly and whenever the API is unreachable.
// Shape matches the database rows exactly, so live data can drop in seamlessly.
const fallbackGallery = [
  { id: 'fb-1', image_url: images.gal_1, alt_text: 'Client workout moment' },
  { id: 'fb-2', image_url: images.gal_2, alt_text: 'Pregnant client, soft light' },
  { id: 'fb-3', image_url: images.gal_3, alt_text: 'Client core exercise' },
  { id: 'fb-4', image_url: images.gal_4, alt_text: 'Mother and baby, warm moment' },
  { id: 'fb-5', image_url: images.gal_5, alt_text: 'Client stretching' },
  { id: 'fb-6', image_url: images.gal_6, alt_text: 'Home workout session' },
  { id: 'fb-7', image_url: images.gal_7, alt_text: 'Mother and baby moment' },
  { id: 'fb-8', image_url: images.gal_8, alt_text: 'Client strength training' },
];

const fallbackReviews = [
  { id: 'fb-1', name: 'Ritika S.', context: '6 weeks postpartum', quote: "First coach who told me to slow down instead of pushing harder. My diastasis gap actually closed instead of getting worse.", avatar_url: images.t1 },
  { id: 'fb-2', name: 'Ananya M.', context: 'Diastasis Recti Recovery', quote: "She explained why my old trainer's ab exercises were making things worse. Nobody had ever told me that before.", avatar_url: images.t2 },
  { id: 'fb-3', name: 'Priya K.', context: '4 months postpartum', quote: "I cried reading her caption about appreciating the body you have. That's exactly how coaching with her feels too.", avatar_url: images.t3 },
  { id: 'fb-4', name: 'Simran D.', context: 'Managing PCOS + Postpartum', quote: "She doesn't just program workouts. She actually checks how you're doing, and it doesn't feel fake.", avatar_url: images.t4 },
  { id: 'fb-5', name: 'Neha T.', context: '1 year postpartum', quote: "I'd tried three trainers before her. She was the first one who asked about my gap before giving me a single exercise.", avatar_url: images.t5 },
  { id: 'fb-6', name: 'Kavya R.', context: 'Weight regain + core strength', quote: "No shame, no rush, no 'get your body back' language. Just real, steady progress I could actually stick to.", avatar_url: images.t6 },
];

const fallbackFaqs = [
  { id: 'fb-1', question: "Is this safe if I'm still healing from delivery?", answer: "Yes — that's the entire premise. We assess your diastasis recti and core function before any program starts, and everything is built around where your body actually is right now." },
  { id: 'fb-2', question: "I'm 2 years postpartum, is it too late?", answer: "No. Healing timelines aren't linear or expiring — many clients start well past the '6-week clearance' window with real, lasting results." },
  { id: 'fb-3', question: "Do you coach online or in-person?", answer: "Both, depending on location — most coaching happens over WhatsApp with video check-ins and form review." },
  { id: 'fb-4', question: "What if I have diastasis recti or a hernia?", answer: "This is specifically what the program is built around. Assessment comes first, always." },
  { id: 'fb-5', question: "How is this different from a normal gym trainer?", answer: "Certified pre/postnatal specialization — most gym trainers aren't trained in diastasis recti or safe postpartum progression, which is exactly why so many clients come here after a bad experience elsewhere." },
];

// Loads live content from the admin-managed API, falling back to the
// hardcoded content above (instantly, and silently on any fetch failure)
// so the site never shows an empty or broken section.
function useLiveList(endpoint, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    fetch(endpoint)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length > 0) setData(rows);
      })
      .catch(() => {
        /* keep fallback content */
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);
  return data;
}

const revealProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

// Signature motion moment: the hand-drawn underline/circle accents don't just
// appear, they draw themselves in — like a pen following the word — the
// instant each one scrolls into view.
function UnderlineWord({ children, delay = 0.35 }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
        <motion.path
          d="M0,5 Q25,2 50,5 T100,4"
          stroke="var(--ink)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay }}
        />
      </svg>
    </span>
  );
}

function CircledWord({ children, delay = 0.35 }) {
  return (
    <span className="relative inline-block px-2">
      {children}
      <svg className="absolute -top-2 -left-2 pointer-events-none" style={{ width: 'calc(100% + 20px)', height: 'calc(100% + 16px)' }} viewBox="0 0 100 40" preserveAspectRatio="none">
        <motion.ellipse
          cx="50" cy="20" rx="48" ry="18"
          stroke="var(--ink)" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], delay }}
        />
      </svg>
    </span>
  );
}

// Reusable "wipe + settle" photo reveal: the image uncovers itself top-down
// while gently zooming in to rest, instead of a flat fade. Used for the
// site's key editorial photo moments.
function RevealImage({ src, alt, className = '', delay = 0 }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1], delay }}
        className="absolute inset-0"
      >
        <motion.img
          src={src}
          alt={alt}
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
}

// Stat numbers count up from zero the moment they scroll into view.
function CountUp({ value, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// A thin line at the very top that fills as you scroll down the page —
// a quiet callback to the hand-drawn underline motif.
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[110] origin-left"
      style={{ scaleX, background: 'var(--ink)' }}
    />
  );
}

// Masks and slides each line of a heading up into place — headlines feel
// like they're being written into position, not just fading up as a block.
function RevealLine({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden py-2 -my-2 ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Primary CTAs pull gently toward the cursor as it nears, and spring back
// on leave. A no-op on touch (there's no persistent pointer to react to).
function Magnetic({ children, strength = 0.4, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 14, mass: 0.4 });
  const reduceMotion = useReducedMotion();

  function handleMouseMove(e) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

// A small ink cursor that replaces the system pointer on real mice/trackpads
// (never on touch) — a dot at rest, opening into a soft ring over anything
// interactive.
function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;
    setEnabled(true);

    function handleMove(e) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target.closest('a, button, input, textarea, .cursor-hover');
      setHovering(!!el);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    // mix-blend-mode: difference inverts whatever is underneath, so the
    // cursor stays visible on cream, blush, white cards, dark photos, and
    // the ink-filled button hover state alike — no single fixed color works
    // everywhere, but this does.
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[300] rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: hovering ? 44 : 10,
        height: hovering ? 44 : 10,
        border: hovering ? '1.3px solid #fff' : 'none',
        backgroundColor: hovering ? 'transparent' : '#fff',
        mixBlendMode: 'difference',
        transition: 'width 350ms cubic-bezier(0.22,1,0.36,1), height 350ms cubic-bezier(0.22,1,0.36,1)',
      }}
    />
  );
}

// A soft warm highlight that follows the cursor within a card, applied via
// CSS custom properties (updated directly on the DOM node, not through
// React state, so it stays smooth at 60fps).
function useSpotlight() {
  const ref = useRef(null);
  function onMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }
  return { ref, onMouseMove };
}

function AccordionRow({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-black/[0.18] py-[18px] px-3 -mx-3 cursor-pointer rounded transition-colors duration-200 hover:bg-black/[0.025]">
      <div className="flex justify-between items-center gap-4">
        <span className="font-inter font-semibold text-sm text-ink tracking-wide uppercase">{title}</span>
        <span
          className="text-lg text-ink shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none', transitionTimingFunction: 'cubic-bezier(0.68,-0.4,0.32,1.4)' }}
        >+</span>
      </div>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="text-body text-[13px] pt-[10px]">{body}</p>
      </motion.div>
    </div>
  );
}

function ReviewCard({ name, context, quote, avatar_url }) {
  const spotlight = useSpotlight();
  return (
    <motion.div
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      whileHover={{ y: -6, boxShadow: '0 18px 34px rgba(26,25,23,0.09)', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      style={{ '--spot-color': 'rgba(228,210,194,0.75)' }}
      className="spotlight shrink-0 w-[300px] md:w-[380px] bg-white rounded-lg p-7 border border-black/[0.10]"
    >
      <div className="relative z-[1]">
        <p className="font-archivo font-bold text-3xl text-black/50 leading-none">&ldquo;</p>
        <p className="text-body text-[15px] text-ink my-3 mb-6 leading-7">{quote}</p>
        <div className="flex items-center gap-3 border-t border-black/[0.10] pt-4">
          <img src={avatar_url} alt={name} className="w-[38px] h-[38px] rounded-full object-cover bg-blush" loading="lazy" />
          <div>
            <p className="font-inter font-semibold text-[13px] text-ink">{name}</p>
            <p className="text-caption text-black/50 text-[10px]">{context}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const links = ['Method', 'Results', 'About', 'Guide'];

  useEffect(() => {
    if (drawerOpen) setHidden(false);
  }, [drawerOpen]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (!drawerOpen) {
        setHidden(y > lastY.current && y > 140);
      }
      lastY.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [drawerOpen]);

  return (
    // The sticky positioning lives on this plain, untransformed wrapper —
    // Chromium drops position:sticky on an element that also carries a
    // transform, so the hide/show animation has to happen one level in.
    <div className="sticky top-0 z-[100]">
    <motion.nav
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-cream border-b transition-shadow duration-300 ${
        scrolled ? 'border-black/[0.12] shadow-[0_6px_24px_rgba(26,25,23,0.06)]' : 'border-black/[0.10]'
      }`}
    >
      <div className={`flex items-center justify-between px-5 md:px-16 transition-[padding] duration-300 ${scrolled ? 'py-3.5' : 'py-5'}`}>
        <div className="hidden md:flex gap-7">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link font-inter text-[13px] font-medium text-ink">
              {link}
            </a>
          ))}
        </div>

        <div className="font-archivo font-extrabold text-lg md:text-xl tracking-wide text-ink">
          STAYSTRONGSTAYWILD
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex gap-4">
            <a href="https://instagram.com/staystrongstaywild" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="nav-link text-ink text-[13px] font-medium">
              IG
            </a>
          </div>
          <Magnetic strength={0.3} className="hidden sm:inline-block">
            <a href="#start" className="btn-outline !py-2.5 !px-5 !text-[11px] block">
              Let's Talk
            </a>
          </Magnetic>
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
                Let's Talk About Your Recovery
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </div>
  );
}

function HeroSection() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 90]);

  return (
    <section ref={sectionRef} className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] min-h-[auto] md:h-[clamp(500px,80vh,780px)]">
      <div className="bg-blush flex flex-col justify-center px-5 py-14 md:px-16 md:py-0 order-2 md:order-1">
        <h1 className="text-display text-ink mb-6">
          <RevealLine delay={0}>Your strength will come back.</RevealLine>
          <RevealLine delay={0.1}>Just not as quickly</RevealLine>
          <RevealLine delay={0.2}><UnderlineWord delay={0.65}>as you expected.</UnderlineWord></RevealLine>
          <RevealLine delay={0.3}><UnderlineWord delay={0.8}>And that's okay.</UnderlineWord></RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-body max-w-[380px] mb-8"
        >
          Pre- and postnatal coaching built around your body, your recovery,
          and your real life — not someone else's timeline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Magnetic className="w-full sm:w-auto">
            <a href="#start" className="btn-outline w-full sm:w-auto text-center block">
              Let's Talk About Your Recovery
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <div className="relative overflow-hidden h-[380px] md:h-full order-1 md:order-2">
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={images.hero}
            alt="Prakriti Bhonsle, pre/postnatal fitness coach"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 15%', y: photoY, scale: 1.12 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function wrapValue(min, max, v) {
  const range = max - min;
  return (((v - min) % range) + range) % range + min;
}

// The giant marquee text breathes with your scroll — it crawls gently at
// rest, and surges (even reversing direction) as you scroll fast, like the
// page itself is responding to your hand.
function MarqueeSection() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: true });
  const directionFactor = useRef(1);
  const reduceMotion = useReducedMotion();
  const x = useTransform(baseX, (v) => `${wrapValue(-33.333, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    if (reduceMotion) return;
    const baseSpeed = 1.6; // % of track width per second, at rest
    let moveBy = directionFactor.current * baseSpeed * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() - moveBy);
  });

  return (
    <section className="bg-cream py-6 md:py-8 overflow-hidden">
      <motion.div className="flex w-max" style={{ x }}>
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className="text-marquee whitespace-nowrap pr-12"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,25,23,0.5)' }}
          >
            HEAL FIRST ✳ STRENGTH FOLLOWS ✳ NO RUSH ✳
          </span>
        ))}
      </motion.div>

      {/* A second, quieter row drifting the opposite way — layered kinetic
          type for depth, independent of the scroll-reactive row above. */}
      <div className="marquee-secondary flex w-max mt-2 md:mt-3">
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className="whitespace-nowrap pr-10 font-archivo font-extrabold text-[clamp(0.9rem,2.2vw,1.35rem)] tracking-[0.08em]"
            style={{ color: 'rgba(26,25,23,0.2)' }}
          >
            REAL BODIES · REAL TIMELINES · REAL RESULTS ·
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
        <div className="relative order-1">
          <RevealImage
            src={images.coach}
            alt="Prakriti Bhonsle, certified pre/postnatal fitness coach"
            className="h-[360px] md:h-[520px] rounded"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden md:block absolute -bottom-6 -right-6 bg-blush px-6 py-4 rounded border border-black/[0.10]"
          >
            <p className="font-archivo font-extrabold text-2xl text-ink leading-none">
              <CountUp value={6} suffix="+" />
            </p>
            <p className="text-caption text-black/50 mt-1">Years Specializing Postnatal</p>
          </motion.div>
        </div>

        <div className="order-2">
          <motion.p {...revealProps} className="text-caption text-black/50 mb-4">
            Meet Your Coach
          </motion.p>
          <h2 className="text-h2 text-ink mb-6">
            <RevealLine>Hi, I'm <UnderlineWord>Prakriti.</UnderlineWord></RevealLine>
          </h2>
          <motion.div {...revealProps} className="text-body space-y-4 mb-8">
            <p>
              I'm a certified pre- and postnatal fitness coach — but I'm a mom
              too. I know what it's like to look at your postpartum body and
              not recognize it — and to be given generic workouts that don't
              account for what your body actually needs.
            </p>
            <p>
              That's why every program I build starts with one question: where
              is your body right now? Not where a caption says it should be at
              six weeks. Not where your pre-baby jeans say it should be. Where
              it actually is.
            </p>
            <p>
              I've spent the last six years specializing in diastasis recti
              recovery and postpartum strength for moms — because healing
              looks different when you're also running a household, feeding a
              newborn, and running on four hours of sleep. I've helped 2000+
              women rebuild strength, reconnect with their core, and feel at
              home in their bodies again. My job isn't to push you harder —
              it's to help you get strong enough to trust your body again.
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

        <h2 className="text-h2 text-ink mb-5">
          <RevealLine><CircledWord>Heal</CircledWord> before you push</RevealLine>
        </h2>
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

function PillarCard({ pillar, i }) {
  const spotlight = useSpotlight();
  return (
    <motion.div
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      whileHover={{ y: -6, boxShadow: '0 18px 34px rgba(26,25,23,0.09)', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className="spotlight bg-cream p-9 md:p-9 rounded-lg border border-black/[0.10]"
    >
      <div className="relative z-[1]">
        <span className="font-archivo font-extrabold text-[13px] text-black/50">{pillar.num}</span>
        <h3 className="text-h3 text-ink my-3">{pillar.title}</h3>
        <p className="text-body text-sm">{pillar.desc}</p>
      </div>
    </motion.div>
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
        <h2 className="text-h2 text-ink text-center mb-14">
          <RevealLine>Three stages. <UnderlineWord>One timeline</UnderlineWord> that's actually yours.</RevealLine>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => <PillarCard key={i} pillar={pillar} i={i} />)}
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
        <RevealImage
          src={images.workout_1}
          alt="Postpartum-friendly home workout"
          className="h-[320px] md:h-[clamp(360px,45vw,520px)] rounded order-1"
        />

        <div className="order-2">
          <h2 className="text-h2 text-ink mb-2"><RevealLine>Postpartum Strength Coaching</RevealLine></h2>
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
    { render: () => <CountUp value={2000} suffix="+" />, label: 'Women Coached' },
    { render: () => <CountUp value={6} />, label: 'Yrs Specializing Postnatal' },
    { render: () => 'Certified', label: 'Pre/Postnatal Coach' },
    { render: () => <CountUp value={10} prefix="6-" suffix="wk" />, label: 'Avg. DR Gap Improvement' },
  ];
  return (
    <section className="bg-blush px-5 md:px-16 py-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="font-archivo font-extrabold text-2xl md:text-3xl text-ink">{stat.render()}</p>
            <p className="text-caption text-ink/70 mt-1.5 text-[11px] md:text-[13px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection() {
  const gallery = useLiveList('/api/gallery', fallbackGallery);
  const track = [...gallery, ...gallery];
  return (
    <section id="results" className="bg-cream py-14 md:py-[clamp(64px,9vw,120px)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 mb-10">
        <h2 className="text-h2 text-ink">
          <RevealLine>Real moms. <UnderlineWord>Real strength.</UnderlineWord></RevealLine>
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="gallery-track flex gap-4 w-max">
          {track.map((item, i) => (
            <div key={`${item.id}-${i}`} className="gallery-item shrink-0 w-[220px] md:w-[clamp(220px,24vw,300px)] aspect-[4/5] rounded overflow-hidden bg-blush">
              <img src={item.image_url} alt={item.alt_text || 'Client journey'} className="w-full h-full object-cover" loading="lazy" />
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
        <h2 className="text-h2 text-ink text-center mb-12">
          <RevealLine>Not "before and after." <UnderlineWord>Just honest progress.</UnderlineWord></RevealLine>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <RevealImage src={item.img} alt={item.context} className="h-[280px] md:h-[320px] rounded mb-4" delay={i * 0.08} />
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
  const reviews = useLiveList('/api/testimonials', fallbackReviews);
  const track = [...reviews, ...reviews];
  return (
    <section className="bg-cream py-14 md:py-[clamp(64px,9vw,120px)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 mb-10">
        <h2 className="text-h2 text-ink">
          <RevealLine>What moms are <UnderlineWord>actually saying</UnderlineWord></RevealLine>
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="reviews-track flex gap-5 w-max">
          {track.map((r, i) => <ReviewCard key={`${r.id}-${i}`} {...r} />)}
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
        <h2 className="text-h2 text-ink text-center mb-12">
          <RevealLine>The messages that matter <UnderlineWord>most</UnderlineWord></RevealLine>
        </h2>
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

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-black/[0.18] py-5 px-3 -mx-3 cursor-pointer rounded transition-colors duration-200 hover:bg-black/[0.025]">
      <div className="flex justify-between items-center gap-4">
        <span className="font-inter font-semibold text-[15px] text-ink">{question}</span>
        <span
          className="text-xl text-ink shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none', transitionTimingFunction: 'cubic-bezier(0.68,-0.4,0.32,1.4)' }}
        >+</span>
      </div>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="text-body text-sm pt-3 max-w-[600px]">{answer}</p>
      </motion.div>
    </div>
  );
}

function FAQSection() {
  const faqs = useLiveList('/api/faqs', fallbackFaqs);
  return (
    <section id="guide" className="bg-cream px-5 md:px-16 py-14 md:py-[clamp(64px,9vw,140px)]">
      <div className="max-w-[720px] mx-auto">
        <h2 className="text-h2 text-ink text-center mb-12">
          <RevealLine>Questions, <UnderlineWord>answered honestly</UnderlineWord></RevealLine>
        </h2>
        <div>
          {faqs.map((f) => <FAQItem key={f.id} question={f.question} answer={f.answer} />)}
        </div>
      </div>
    </section>
  );
}

function EnquiryForm() {
  // Deliberately no localStorage gate here: the server (checked fresh on
  // every submit, by email OR phone) is the only source of truth for
  // whether someone's already on file. A client-side flag would go stale
  // the moment an admin removes that person's enquiry, permanently
  // locking their browser out of the form with no way back in.
  const [status, setStatus] = useState('idle'); // idle | submitting | success | already
  const [errorMsg, setErrorMsg] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errs.email = 'Enter a valid email address.';
    if (fields.phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid 10-digit phone number.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setStatus('success');
        return;
      }
      if (res.status === 409) {
        setStatus('already');
        return;
      }
      setErrorMsg(data.error || 'Something went wrong. Please try again.');
      setStatus('idle');
    } catch {
      setErrorMsg('Something went wrong. Please check your connection and try again.');
      setStatus('idle');
    }
  }

  function tryAgain() {
    setFields({ name: '', email: '', phone: '', message: '' });
    setFieldErrors({});
    setErrorMsg('');
    setStatus('idle');
  }

  if (status === 'already') {
    return (
      <div className="bg-white border border-black/[0.1] rounded-lg px-8 py-10 text-center">
        <p className="text-h3 text-ink mb-2">You're already on the list 🤍</p>
        <p className="text-body max-w-[420px] mx-auto mb-5">
          We've got your details — Prakriti will reach out soon. No need to submit again.
        </p>
        <button
          onClick={tryAgain}
          className="text-caption underline decoration-1 underline-offset-4"
          style={{ color: 'var(--ink-70)' }}
        >
          Need to send this again, or for someone else?
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-white border border-black/[0.1] rounded-lg px-8 py-10 text-center">
        <p className="text-h3 text-ink mb-2">Got it — thank you 🤍</p>
        <p className="text-body max-w-[420px] mx-auto">
          Prakriti reads every message herself. She'll get back to you soon, usually within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="text-left bg-white border border-black/[0.1] rounded-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            className={`field-input ${fieldErrors.name ? 'field-error' : ''}`}
          />
          {fieldErrors.name && <p className="text-[12px] mt-1.5" style={{ color: '#a13d2e' }}>{fieldErrors.name}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone number"
            value={fields.phone}
            onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
            className={`field-input ${fieldErrors.phone ? 'field-error' : ''}`}
          />
          {fieldErrors.phone && <p className="text-[12px] mt-1.5" style={{ color: '#a13d2e' }}>{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email address"
          value={fields.email}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          className={`field-input ${fieldErrors.email ? 'field-error' : ''}`}
        />
        {fieldErrors.email && <p className="text-[12px] mt-1.5" style={{ color: '#a13d2e' }}>{fieldErrors.email}</p>}
      </div>

      <div className="mb-5">
        <textarea
          placeholder="What's on your mind? (optional)"
          value={fields.message}
          onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
          rows={3}
          className="field-input resize-none"
        />
      </div>

      {errorMsg && <p className="text-[13px] mb-4" style={{ color: '#a13d2e' }}>{errorMsg}</p>}

      <Magnetic strength={0.25} className="w-full">
        <button type="submit" disabled={status === 'submitting'} className="btn-outline w-full !py-4">
          {status === 'submitting' ? 'Sending…' : 'Send Your Enquiry'}
        </button>
      </Magnetic>

      <p className="text-caption text-center mt-5" style={{ color: 'var(--ink-50)', textTransform: 'none', letterSpacing: 0 }}>
        Prefer Instagram?{' '}
        <a
          href="https://instagram.com/staystrongstaywild"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-2"
          style={{ color: 'var(--ink-70)' }}
        >
          DM @staystrongstaywild
        </a>
      </p>
    </form>
  );
}

function FinalCTASection() {
  return (
    <section id="start" className="bg-cream px-5 md:px-16 py-20 md:py-[clamp(80px,12vw,160px)] text-center">
      <div className="max-w-[560px] mx-auto">
        <h2 className="text-display text-ink mb-7">
          <RevealLine>Tell me where you're <UnderlineWord>starting from.</UnderlineWord></RevealLine>
        </h2>
        <motion.p {...revealProps} className="text-body mb-9">
          One short note — not a funnel. Tell me a little about you and I'll take it from there.
        </motion.p>
        <motion.div {...revealProps}>
          <EnquiryForm />
        </motion.div>
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
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link font-inter text-[13px] text-ink/70">{l}</a>
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
              Let's Talk About Your Recovery
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-cream custom-cursor-zone">
      <CustomCursor />
      <ScrollProgressBar />
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
