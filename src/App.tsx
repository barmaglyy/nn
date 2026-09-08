import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown, ArrowUpRight, Boxes, Braces, Check, ChevronLeft, ChevronRight, Code2,
  Database, ExternalLink, Globe2, Layers3, Linkedin, Mail, Menu, MessageCircle,
  Monitor, MousePointer2, Quote, Send, ShieldCheck, Sparkles, Terminal, Workflow, X, Zap,
} from 'lucide-react';
import { submitContactMessage } from './lib/contact-api';

type Language = 'en' | 'ar';

const copy = {
  en: {
    nav: ['Capabilities', 'Studio', 'Work', 'Contact'],
    heroKicker: 'Independent digital studio · Cairo / Worldwide',
    heroTitle: <>Websites that <em>move</em> at the speed of your ambition.</>,
    heroText: 'buildly is a small engineering-led studio for founders and teams who need a digital presence with a point of view — and a product underneath it.',
    heroPrimary: 'Start a conversation',
    heroSecondary: 'See selected work',
    heroNote: 'Taking on 02 new builds for Q3',
    capabilitiesKicker: '01 / Capabilities',
    capabilitiesTitle: <>Small team. <em>Wide range.</em></>,
    capabilitiesText: 'From the first sharp idea to the last considered interaction, we build digital systems that feel as good as they perform.',
    studioKicker: '02 / The studio',
    studioTitle: <>We make the <em>complex</em> feel clear.</>,
    studioText: 'buildly is an independent web development studio with more than two years of turning ambitious briefs into fast, useful, quietly memorable software. We keep the team small so the thinking stays close to the work.',
    studioSign: 'Good work is a team sport.',
    workKicker: '03 / Selected work',
    workTitle: <>Proof, not <em>promises.</em></>,
    workText: 'A few recent experiments in commerce, culture, education and personal brands. Open them, pull them apart, steal a good idea.',
    processKicker: 'How we work',
    processTitle: 'A clear route from fog to launch.',
    quote: '“They understood the business in one call, then built the thing we had been trying to describe for months.”',
    quoteBy: 'Founder, early-stage technology company',
    contactKicker: '04 / Start something',
    contactTitle: <>Have a good<br /><em>problem?</em></>,
    contactText: 'Tell us what you are building, what is stuck, or what could be better. We reply within two working days.',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    formName: 'Your name',
    formEmail: 'Work email',
    formPhone: 'Phone number',
    formSubject: 'What are we making?',
    formMessage: 'A little context',
    formSubmit: 'Send the brief',
    formHint: 'No pitch deck required. A sentence is enough.',
    success: 'Message received. We will be in touch within two working days.',
    fallback: 'Your message is ready — connect with us directly if the form cannot send.',
    admin: 'Admin',
    footerLine: 'Websites and integrated web applications for people building what is next.',
    rights: '© 2025 buildly studio. Made with intent.',
  },
  ar: {
    nav: ['الإمكانيات', 'الاستوديو', 'أعمالنا', 'تواصل'],
    heroKicker: 'استوديو رقمي مستقل · القاهرة / العالم',
    heroTitle: <>مواقع تتحرك <em>بسرعة</em> طموحك.</>,
    heroText: 'buildly استوديو صغير يقوده مهندسون، نصنع تجارب رقمية لها رأي واضح — ومنتج حقيقي تحتها.',
    heroPrimary: 'ابدأ محادثة',
    heroSecondary: 'شاهد أعمالنا',
    heroNote: 'نستقبل مشروعين جديدين للربع الثالث',
    capabilitiesKicker: '٠١ / إمكانياتنا',
    capabilitiesTitle: <>فريق صغير. <em>خبرات واسعة.</em></>,
    capabilitiesText: 'من أول فكرة واضحة إلى آخر تفاعل محسوب، نبني أنظمة رقمية جميلة في أدائها كما في شكلها.',
    studioKicker: '٠٢ / الاستوديو',
    studioTitle: <>نبسّط <em>التعقيد.</em></>,
    studioText: 'buildly استوديو مستقل لتطوير الويب، لدينا أكثر من عامين من تحويل الأفكار الطموحة إلى برمجيات سريعة ومفيدة ولا تُنسى بسهولة. نبقي الفريق صغيراً ليظل التفكير قريباً من العمل.',
    studioSign: 'العمل الجيد رياضة جماعية.',
    workKicker: '٠٣ / أعمال مختارة',
    workTitle: <>دليل، لا <em>وعود.</em></>,
    workText: 'بعض التجارب الأخيرة في التجارة والثقافة والتعليم والعلامات الشخصية. افتحها، فككها، واستلهم فكرة جيدة.',
    processKicker: 'طريقة عملنا',
    processTitle: 'طريق واضح من الضباب إلى الإطلاق.',
    quote: '«فهموا العمل من مكالمة واحدة، ثم بنوا الشيء الذي حاولنا وصفه لأشهر.»',
    quoteBy: 'مؤسس شركة تكنولوجيا في بدايتها',
    contactKicker: '٠٤ / لنبدأ شيئاً',
    contactTitle: <>لديك <em>مشكلة</em><br />جيدة؟</>,
    contactText: 'احكِ لنا ما الذي تبنيه، أو ما الذي توقف، أو ما الذي يمكن أن يكون أفضل. سنرد خلال يومي عمل.',
    whatsapp: 'واتساب',
    telegram: 'تليجرام',
    formName: 'اسمك',
    formEmail: 'البريد الإلكتروني',
    formPhone: 'رقم الهاتف',
    formSubject: 'ماذا سنبني؟',
    formMessage: 'بعض التفاصيل',
    formSubmit: 'أرسل التفاصيل',
    formHint: 'لا نحتاج عرضاً تقديمياً. جملة واحدة تكفي.',
    success: 'وصلت رسالتك. سنتواصل معك خلال يومي عمل.',
    fallback: 'رسالتك جاهزة — تواصل معنا مباشرة إذا تعذر الإرسال.',
    admin: 'إدارة الطلبات',
    footerLine: 'مواقع وتطبيقات ويب متكاملة لمن يبنون القادم.',
    rights: '© ٢٠٢٥ buildly studio. صُنع بعناية.',
  },
};

const skills = [
  { icon: Code2, en: ['Frontend systems', 'HTML, CSS, JavaScript — interfaces with rhythm, resilience and a little edge.'], ar: ['تطوير الواجهات', 'HTML و CSS و JavaScript — واجهات مرنة بإيقاع واضح ولمسة مختلفة.'] },
  { icon: Workflow, en: ['Integrated web apps', 'Frontend and backend shaped together, so the pretty part never fights the useful part.'], ar: ['تطبيقات ويب متكاملة', 'الواجهة والخلفية معاً، كي لا يتعارض الجزء الجميل مع الجزء المفيد.'] },
  { icon: Database, en: ['Data & backend', 'Supabase, auth, storage and real-time data — the quiet machinery behind the experience.'], ar: ['البيانات والخلفية', 'Supabase وتسجيل الدخول والبيانات الفورية — المحرك الهادئ خلف التجربة.'] },
  { icon: Sparkles, en: ['UI / UX direction', 'A visual language that gives people fewer things to figure out and more reasons to stay.'], ar: ['تصميم UI / UX', 'لغة بصرية تمنح الناس أشياء أقل ليفهموها وأسباباً أكثر للبقاء.'] },
];

const projects = [
  { name: 'mall', url: 'https://mm517.github.io/mall', kind: 'commerce / interface', arKind: 'تجارة / واجهة', theme: 'preview-mall', blurb: 'A focused storefront with a little more atmosphere.', arBlurb: 'متجر مركز مع جرعة إضافية من الأجواء.' },
  { name: 'ghawyy', url: 'https://mm517.github.io/ghawyy/', kind: 'culture / experience', arKind: 'ثقافة / تجربة', theme: 'preview-ghawyy', blurb: 'A warm digital home for a curious community.', arBlurb: 'بيت رقمي دافئ لمجتمع فضولي.' },
  { name: 'elmaktab', url: 'https://mm517.github.io/elmaktab', kind: 'education / platform', arKind: 'تعليم / منصة', theme: 'preview-elmaktab', blurb: 'Clarity and momentum for learning in public.', arBlurb: 'وضوح وحركة للتعلم أمام الجميع.' },
  { name: 'omar', url: 'https://mm517.github.io/omar', kind: 'personal / portfolio', arKind: 'شخصي / ملف أعمال', theme: 'preview-omar', blurb: 'A point of view, made tangible on the web.', arBlurb: 'رؤية واضحة أصبحت ملموسة على الويب.' },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(end: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setValue(Math.round((1 - Math.pow(1 - progress, 3)) * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, end]);
  return value;
}

function TiltCard({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(max-width: 700px), (prefers-reduced-motion: reduce)').matches || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    ref.current.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateZ(4px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ''; };
  return <div ref={ref} className={className} style={style} onMouseMove={move} onMouseLeave={leave}>{children}</div>;
}

function BrowserMockup({ theme }: { theme: string }) {
  return <div className={`project-preview ${theme}`} aria-hidden="true">
    <div className="browser">
      <div className="browser-bar"><span className="window-dots"><i /><i /><i /></span><span className="browser-url">buildly.studio / preview</span></div>
      <div className="mock-page"><div className="mock-side"><b /><i /><i /><i /><i /></div><div className="mock-main"><h4 /><p /><div className="mock-blocks"><i /><i /><i /><i /></div></div></div>
    </div>
  </div>;
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formState, setFormState] = useState<'idle' | 'success' | 'fallback' | 'sending'>('idle');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  const t = copy[language];
  useReveal();
  const countProjects = useCountUp(24, statsActive);
  const countYears = useCountUp(2, statsActive);
  const countClients = useCountUp(17, statsActive);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStatsActive(true); }, { threshold: .4 });
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleLanguage = () => setLanguage((current) => current === 'en' ? 'ar' : 'en');
  const updateForm = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) { setFormState('fallback'); return; }
    setFormState('sending');
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      setFormState('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setFormState('fallback');
    }
  };
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return <div className="site-shell" id="top">
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a className="brand" href="#top" data-testid="link-brand"><span className="brand-mark">b/</span><span>buildly</span></a>
        <nav className="nav-links" aria-label="Main navigation">
          {t.nav.map((item, index) => <a href={`#${['capabilities', 'studio', 'work', 'contact'][index]}`} key={item} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${index}`}>{item}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="lang-button" onClick={toggleLanguage} data-testid="button-language" aria-label="Switch language">{language === 'en' ? 'عربي / AR' : 'EN / English'}</button>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} data-testid="button-menu" aria-label="Toggle menu">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{t.nav.map((item, index) => <a href={`#${['capabilities', 'studio', 'work', 'contact'][index]}`} onClick={() => setMenuOpen(false)} key={item} data-testid={`link-mobile-nav-${index}`}>{item}</a>)}</nav>}
    </header>

    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow reveal" data-testid="text-hero-kicker"><span style={{ color: '#7af0ff' }}>●</span> {t.heroKicker}</div>
            <h1 id="hero-title" className="reveal delay-1" data-testid="text-hero-title">{t.heroTitle}</h1>
            <p className="hero-lede reveal delay-2" data-testid="text-hero-description">{t.heroText}</p>
            <div className="hero-cta reveal delay-3">
              <button className="btn-primary" onClick={() => scrollTo('contact')} data-testid="button-hero-contact">{t.heroPrimary}<ArrowUpRight size={16} /></button>
              <button className="btn-secondary" onClick={() => scrollTo('work')} data-testid="button-hero-work">{t.heroSecondary}<ArrowDown size={15} /></button>
            </div>
            <div className="hero-note reveal delay-3"><span className="status-dot" />{t.heroNote}</div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <div className="orb orb-a" /><div className="orb orb-b" /><div className="cube cube-a" /><div className="cube cube-b" />
            <div className="console-card glass">
              <div className="console-top"><span className="window-dots"><i /><i /><i /></span><span>buildly / systems.ts</span><span>● live</span></div>
              <div className="code-lines">
                <div className="code-line"><span>01</span><span><span className="syntax-violet">const</span> ambition = <span className="syntax-cyan">true</span>;</span></div>
                <div className="code-line"><span>02</span><span><span className="syntax-violet">await</span> buildly.<span className="syntax-blue">ship</span>({'{'}</span></div>
                <div className="code-line"><span>03</span><span>&nbsp;&nbsp;clarity: <span className="syntax-cyan">'high'</span>,</span></div>
                <div className="code-line"><span>04</span><span>&nbsp;&nbsp;speed: <span className="syntax-cyan">'quiet'</span>,</span></div>
                <div className="code-line"><span>05</span><span>&nbsp;&nbsp;craft: <span className="syntax-cyan">'obsessive'</span></span></div>
                <div className="code-line"><span>06</span><span>{'}'});</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-cue"><span>scroll to explore</span><MousePointer2 size={15} /></div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-track"><b>DESIGN × ENGINEERING</b><i>✦</i><b>FAST BY DEFAULT</b><i>✦</i><b>BUILT FOR THE REAL WORLD</b><i>✦</i><b>DESIGN × ENGINEERING</b><i>✦</i><b>FAST BY DEFAULT</b><i>✦</i><b>BUILT FOR THE REAL WORLD</b></div></div>

      <section className="section" id="capabilities">
        <div className="container">
          <div className="section-heading reveal"><div className="eyebrow">{t.capabilitiesKicker}</div><h2>{t.capabilitiesTitle}</h2><p>{t.capabilitiesText}</p></div>
          <div className="skills-grid">
            {skills.map(({ icon: Icon, en, ar }, index) => <TiltCard className={`skill-card glass reveal delay-${(index % 3) + 1}`} key={en[0]}>
              <span className="skill-number">0{index + 1}</span><div className="skill-icon"><Icon size={20} strokeWidth={1.5} /></div><h3>{language === 'en' ? en[0] : ar[0]}</h3><p>{language === 'en' ? en[1] : ar[1]}</p>
            </TiltCard>)}
          </div>
        </div>
      </section>

      <section className="section" id="studio">
        <div className="container about-layout">
          <div className="about-copy reveal"><div className="eyebrow">{t.studioKicker}</div><h2>{t.studioTitle}</h2><p>{t.studioText}</p><div className="signature"><span className="signature-line" />{t.studioSign}</div></div>
          <div className="stat-grid reveal delay-2" ref={statsRef}>
            <div className="stat glass"><span className="stat-value">{countProjects}<span>+</span></span><span className="stat-label">{language === 'en' ? 'projects shipped' : 'مشروعاً تم إطلاقه'}</span></div>
            <div className="stat glass"><span className="stat-value">{countYears}<span>yr</span></span><span className="stat-label">{language === 'en' ? 'of making things for the web' : 'من صناعة تجارب للويب'}</span></div>
            <div className="stat glass"><span className="stat-value">{countClients}<span>+</span></span><span className="stat-label">{language === 'en' ? 'brave people we have worked with' : 'شخصاً شجاعاً عملنا معهم'}</span></div>
            <div className="stat glass"><span className="stat-value">01<span>/∞</span></span><span className="stat-label">{language === 'en' ? 'standard: make it useful' : 'المعيار: أن يكون مفيداً'}</span></div>
          </div>
        </div>
      </section>

      <section className="section projects-section" id="work">
        <div className="container">
          <div className="section-heading reveal"><div className="eyebrow">{t.workKicker}</div><h2>{t.workTitle}</h2><p>{t.workText}</p></div>
          <div className="project-grid">
            {projects.map((project, index) => <TiltCard className={`project-card glass reveal delay-${(index % 3) + 1}`} key={project.name}>
              <BrowserMockup theme={project.theme} />
              <div className="project-meta"><div><h3>{project.name}</h3><p>{language === 'en' ? project.blurb : project.arBlurb}</p><div className="project-caption"><span>{language === 'en' ? project.kind : project.arKind}</span><span>·</span><span>buildly / 2025</span></div></div><a className="project-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`} data-testid={`link-project-${project.name}`}><ExternalLink size={15} /></a></div>
            </TiltCard>)}
          </div>
        </div>
      </section>

      <section className="process-band">
        <div className="container process-grid">
          <div className="process-intro reveal"><div className="eyebrow">{t.processKicker}</div><h2>{t.processTitle}</h2></div>
          {[['01', language === 'en' ? 'Find the signal' : 'نجد الإشارة', language === 'en' ? 'We start with the sharp question, not a bloated questionnaire.' : 'نبدأ بالسؤال الأهم، لا باستمارة طويلة.'],
            ['02', language === 'en' ? 'Make it tangible' : 'نجعلها ملموسة', language === 'en' ? 'A fast prototype puts the important decisions on the table.' : 'نموذج سريع يضع القرارات المهمة على الطاولة.'],
            ['03', language === 'en' ? 'Ship with care' : 'نطلق بعناية', language === 'en' ? 'Clean code, measured performance, and a handover you can own.' : 'كود نظيف وأداء محسوب وتسليم يمكنك امتلاكه.']].map(([number, title, text]) => <div className="process-step reveal delay-1" key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </section>

      <section className="section">
        <div className="container quote-wrap reveal"><Quote size={30} className="quote-mark" /><p className="quote" data-testid="text-testimonial">{language === 'en' ? t.quote : t.quote}</p><div className="quote-by"><span className="status-dot" />{t.quoteBy}<button onClick={() => setQuoteIndex((quoteIndex + 1) % 2)} aria-label="Next testimonial" data-testid="button-next-testimonial">{quoteIndex ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}</button></div></div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-layout">
          <div className="contact-copy reveal"><div className="eyebrow">{t.contactKicker}</div><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-links"><a className="contact-link" href="https://wa.me/201000000000" target="_blank" rel="noreferrer" data-testid="link-whatsapp"><MessageCircle size={17} />{t.whatsapp}<ArrowUpRight size={13} /></a><a className="contact-link" href="https://t.me/buildly_studio" target="_blank" rel="noreferrer" data-testid="link-telegram"><Send size={16} />{t.telegram}<ArrowUpRight size={13} /></a><a className="contact-link" href="mailto:hello@buildly.studio" data-testid="link-email"><Mail size={16} />hello@buildly.studio<ArrowUpRight size={13} /></a></div></div>
          <form className="contact-form glass reveal delay-2" onSubmit={submitForm} data-testid="form-contact">
            <div className="form-grid">
              <div className="field"><label htmlFor="name">{t.formName}</label><input id="name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder={language === 'en' ? 'Your name' : 'اكتب اسمك'} data-testid="input-name" required /></div>
              <div className="field"><label htmlFor="email">{t.formEmail}</label><input id="email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="you@company.com" data-testid="input-email" required /></div>
              <div className="field"><label htmlFor="phone">{t.formPhone}</label><input id="phone" type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="+20 ..." data-testid="input-phone" /></div>
              <div className="field"><label htmlFor="subject">{t.formSubject}</label><input id="subject" value={form.subject} onChange={(e) => updateForm('subject', e.target.value)} placeholder={language === 'en' ? 'Website, product, something else...' : 'موقع، منتج، شيء آخر...'} data-testid="input-subject" /></div>
              <div className="field full"><label htmlFor="message">{t.formMessage}</label><textarea id="message" value={form.message} onChange={(e) => updateForm('message', e.target.value)} placeholder={language === 'en' ? 'What are you trying to make better?' : 'ما الذي تحاول جعله أفضل؟'} data-testid="input-message" required /></div>
            </div>
             <div className="form-bottom"><span className="form-hint">{t.formHint}</span><button className="btn-primary" type="submit" disabled={formState === 'sending'} data-testid="button-submit-contact">{formState === 'sending' ? (language === 'en' ? 'Sending...' : 'جارٍ الإرسال...') : t.formSubmit}<Send size={15} /></button></div>
            {formState === 'success' && <div className="success-message" role="status" data-testid="status-form-success"><Check size={15} />{t.success}</div>}
            {formState === 'fallback' && <div className="error-message" role="alert" data-testid="status-form-fallback">{t.fallback}</div>}
          </form>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="container">
        <div className="footer-top"><div className="footer-brand"><a className="brand" href="#top" data-testid="link-footer-brand"><span className="brand-mark">b/</span><span>buildly</span></a><p>{t.footerLine}</p></div><div className="footer-nav"><div className="footer-col"><b>{language === 'en' ? 'Explore' : 'استكشف'}</b>{t.nav.slice(0, 3).map((item, index) => <a href={`#${['capabilities', 'studio', 'work'][index]}`} key={item} data-testid={`link-footer-${index}`}>{item}</a>)}</div><div className="footer-col"><b>{language === 'en' ? 'Elsewhere' : 'في أماكن أخرى'}</b><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-testid="link-footer-linkedin"><Linkedin size={13} /> LinkedIn</a><a href="https://github.com/mm517" target="_blank" rel="noreferrer" data-testid="link-footer-github"><Globe2 size={13} /> GitHub</a><a href="mailto:hello@buildly.studio" data-testid="link-footer-mail"><Mail size={13} /> Email</a></div></div></div>
        <div className="footer-bottom"><span>{t.rights}</span><div className="footer-bottom-actions"><a className="admin-footer-link" href="admin">{t.admin}</a><a className="back-top" href="#top" data-testid="link-back-top">Back to top <ArrowUpRight size={13} /></a></div></div>
      </div>
    </footer>
  </div>;
}

export default App;