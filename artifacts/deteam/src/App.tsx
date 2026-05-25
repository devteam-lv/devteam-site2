import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/lib/translations";
import { 
  BarChart, 
  Search, 
  MousePointerClick, 
  Share2, 
  Code, 
  Mail, 
  Menu, 
  X,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Facebook,
  Instagram
} from "lucide-react";

const queryClient = new QueryClient();

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

// ─── Logo Component ──────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const heights = { sm: 28, md: 36, lg: 72 };
  return (
    <img
      src="/logo.png"
      alt="DEVTEAM"
      style={{ height: heights[size], width: "auto", mixBlendMode: "screen" }}
    />
  );
}

// ─── Splash Screen ───────────────────────────────────────────────────────────
function DataCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Nodes
    const NODE_COUNT = 55;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.6 + 0.3,
    }));

    // Falling data streams
    type Stream = { x: number; y: number; speed: number; chars: string[]; opacity: number };
    const CHARS = "01アイウエオカキクデジタル∑∆∇⟨⟩";
    const streams: Stream[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      speed: Math.random() * 1.2 + 0.4,
      chars: Array.from({ length: Math.floor(Math.random() * 10 + 5) }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      ),
      opacity: Math.random() * 0.18 + 0.06,
    }));

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw streams
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height + 200) {
          s.y = -200;
          s.x = Math.random() * canvas.width;
        }
        if (t % 18 === 0) s.chars = s.chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
        s.chars.forEach((ch, i) => {
          const alpha = s.opacity * (1 - i / s.chars.length);
          ctx.fillStyle = `rgba(65, 105, 225, ${alpha})`;
          ctx.font = `${10 + i % 3}px monospace`;
          ctx.fillText(ch, s.x, s.y - i * 14);
        });
      });

      // Move & draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.03 + n.x);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(65, 105, 225, ${n.opacity * pulse})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(65, 105, 225, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060810] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated canvas background */}
      <DataCanvas />

      {/* Central glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(65,105,225,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Logo card */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ filter: "drop-shadow(0 0 40px rgba(65,105,225,0.6))" }}>
          <Logo size="lg" />
        </div>

        <motion.p
          className="mt-5 text-xs tracking-[0.35em] uppercase text-blue-400/70 font-light"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Digital Growth Agency
        </motion.p>

        {/* Scan line under logo */}
        <motion.div
          className="mt-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: 320 }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />
      </motion.div>

      {/* Corner brackets */}
      {[
        "top-8 left-8 border-t-2 border-l-2",
        "top-8 right-8 border-t-2 border-r-2",
        "bottom-8 left-8 border-b-2 border-l-2",
        "bottom-8 right-8 border-b-2 border-r-2",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 border-primary/40 ${cls}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
        />
      ))}

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-blue-400 to-primary"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3.0, ease: "linear", delay: 0.1 }}
      />

      {/* Bottom status text */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-primary/40 font-mono">
          Initializing...
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [lang, setLang] = useState<"en" | "lv">("lv");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      </AnimatePresence>

    <div className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <Logo size="md" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("services")} className="text-sm font-medium hover:text-primary transition-colors">{t.nav.services}</button>
            <button onClick={() => scrollTo("about")} className="text-sm font-medium hover:text-primary transition-colors">{t.nav.about}</button>
            <button onClick={() => scrollTo("results")} className="text-sm font-medium hover:text-primary transition-colors">{t.nav.results}</button>
            <button onClick={() => scrollTo("contact")} className="text-sm font-medium hover:text-primary transition-colors">{t.nav.contact}</button>
            
            <div className="flex items-center gap-1 bg-secondary rounded-full p-1 border border-border">
              <button 
                onClick={() => setLang("lv")} 
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${lang === "lv" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
              >
                LV
              </button>
              <button 
                onClick={() => setLang("en")} 
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${lang === "en" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
              >
                EN
              </button>
            </div>
            
            <Button onClick={() => scrollTo("contact")} className="bg-primary hover:bg-primary/90 text-white border-0">{t.nav.cta}</Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-24 px-6 flex flex-col gap-6 md:hidden">
          <button onClick={() => scrollTo("services")} className="text-xl font-medium text-left">{t.nav.services}</button>
          <button onClick={() => scrollTo("about")} className="text-xl font-medium text-left">{t.nav.about}</button>
          <button onClick={() => scrollTo("results")} className="text-xl font-medium text-left">{t.nav.results}</button>
          <button onClick={() => scrollTo("contact")} className="text-xl font-medium text-left">{t.nav.contact}</button>
          
          <div className="flex items-center gap-4 mt-4">
            <span className="text-muted-foreground">Language:</span>
            <button onClick={() => setLang("lv")} className={`text-lg font-bold ${lang === "lv" ? "text-primary" : "text-foreground"}`}>LV</button>
            <span className="text-border">|</span>
            <button onClick={() => setLang("en")} className={`text-lg font-bold ${lang === "en" ? "text-primary" : "text-foreground"}`}>EN</button>
          </div>
          
          <Button onClick={() => scrollTo("contact")} size="lg" className="mt-8 w-full">{t.nav.cta}</Button>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Background image — positioned absolutely, behind content */}
        <img
          src="/hero-bg.png?v=4"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.35, zIndex: 0 }}
        />
        {/* Dark overlay with bottom fade for seamless transition */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.3) 60%, hsl(222,47%,4%) 100%)", zIndex: 1 }}
        />
        
        <motion.div
          style={{ position: "relative", zIndex: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8" onClick={() => scrollTo("contact")}>
              {t.hero.primaryCta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-border hover:bg-secondary" onClick={() => scrollTo("services")}>
              {t.hero.secondaryCta}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-secondary/50">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: t.stats.clients, label: t.stats.clientsLabel },
            { value: t.stats.experience, label: t.stats.experienceLabel },
            { value: t.stats.roi, label: t.stats.roiLabel },
            { value: t.stats.awards, label: t.stats.awardsLabel }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.services.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Search className="w-8 h-8 text-primary" />, ...t.services.seo },
            { icon: <MousePointerClick className="w-8 h-8 text-primary" />, ...t.services.ppc },
            { icon: <Share2 className="w-8 h-8 text-primary" />, ...t.services.social },
            { icon: <Code className="w-8 h-8 text-primary" />, ...t.services.web },
            { icon: <Mail className="w-8 h-8 text-primary" />, ...t.services.email },
            { icon: <BarChart className="w-8 h-8 text-primary" />, ...t.services.analytics }
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-8">
                  <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why DEVTEAM / Differentiators */}
      <section id="about" className="py-24 px-6 bg-secondary relative overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <img src="/logo.png" alt="DEVTEAM" style={{ height: 60, width: "auto", mixBlendMode: "screen" }} />
            </div>
            <div className="space-y-8">
              {t.why.points.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{point.title}</h4>
                    <p className="text-muted-foreground text-lg">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-full absolute -top-10 -right-10 w-full scale-110 blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team working" 
              className="rounded-2xl border border-border shadow-2xl relative z-10 opacity-80 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.process.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-secondary -z-10" />
          {t.process.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center w-full md:w-1/5 mb-10 md:mb-0 relative group">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 relative z-10">
                0{i + 1}
              </div>
              <h4 className="text-xl font-bold mb-2">{step.title}</h4>
              <p className="text-sm text-muted-foreground max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results / Case Studies */}
      <section id="results" className="py-24 px-6 bg-card border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.results.title}</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.results.cases.map((c, i) => (
              <Card key={i} className="bg-background border-border overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-32 bg-secondary flex items-center justify-center border-b border-border">
                    <BarChart className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="p-8 text-center">
                    <div className="text-4xl font-extrabold text-primary mb-2">{c.metric}</div>
                    <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">{c.metricLabel}</div>
                    <div className="text-lg font-bold border-t border-border pt-4">{c.client}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.faq.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[1, 2, 3, 4].map((num) => {
            const key = num as 1|2|3|4;
            return (
              <AccordionItem key={num} value={`item-${num}`} className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-bold hover:no-underline hover:text-primary py-6">
                  {t.faq[`q${key}` as keyof typeof t.faq]}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                  {t.faq[`a${key}` as keyof typeof t.faq]}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-primary/5 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl bg-card border border-border rounded-3xl p-8 md:p-16 shadow-2xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.contact.title}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t.contact.info}</p>
              
              <div className="space-y-6 text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <span className="text-lg">info@devteam.lv</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-white text-xs font-bold">LV</div>
                  <span className="text-lg">Riga, Latvia</span>
                </div>
              </div>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder={t.contact.name} className="h-14 bg-background border-border" />
              <Input type="email" placeholder={t.contact.email} className="h-14 bg-background border-border" />
              <Input type="tel" placeholder={t.contact.phone} className="h-14 bg-background border-border" />
              <Textarea placeholder={t.contact.message} className="min-h-[120px] bg-background border-border resize-none" />
              <Button type="submit" size="lg" className="w-full h-14 text-lg mt-4">{t.contact.submit}</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" />
          
          <div className="text-muted-foreground text-sm">
            {t.footer.copyright}
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={() => <div>Not Found</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
