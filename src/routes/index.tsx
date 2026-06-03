import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, X, Flame, MapPin, Phone } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import donutImg from "@/assets/donut.jpg";
import burgerImg from "@/assets/burger.jpg";
import shawarmaImg from "@/assets/shawarma.jpg";
import samosaImg from "@/assets/samosa.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import cupcakeImg from "@/assets/cupcake.jpg";
import meatpieImg from "@/assets/meatpie.jpg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hafsnur Delight — Fresh Snacks & Pastries Delivered" },
      { name: "description", content: "Order delicious donuts, burgers, shawarma, pizza, samosa, cupcakes and meat pies from Hafsnur Delight. Fast WhatsApp checkout." },
      { property: "og:title", content: "Hafsnur Delight" },
      { property: "og:description", content: "Nigeria's tastiest snacks delivered to your door." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Index,
});

type Product = { id: string; name: string; price: number; image: string; tag: string; desc: string };

const PRODUCTS: Product[] = [
  { id: "burger", name: "Classic Burger", price: 2500, image: burgerImg, tag: "Bestseller", desc: "Juicy beef patty, melted cheese & fresh veggies." },
  { id: "shawarma", name: "Chicken Shawarma", price: 3500, image: shawarmaImg, tag: "Spicy", desc: "Tender chicken wrapped with crunchy salad." },
  { id: "pizza", name: "Pepperoni Pizza", price: 4000, image: pizzaImg, tag: "Family Size", desc: "Wood-fired crust loaded with pepperoni." },
  { id: "donut", name: "Glazed Donut", price: 1000, image: donutImg, tag: "Sweet", desc: "Soft, fluffy, glazed with sprinkles on top." },
  { id: "cupcake", name: "Vanilla Cupcake", price: 300, image: cupcakeImg, tag: "Mini Treat", desc: "Buttery cake with creamy pink frosting." },
  { id: "samosa", name: "Crispy Samosa", price: 300, image: samosaImg, tag: "Snack", desc: "Golden pastry with savoury spiced filling." },
  { id: "meatpie", name: "Meat Pie", price: 500, image: meatpieImg, tag: "Naija Classic", desc: "Flaky crust packed with seasoned beef." },
];

const WHATSAPP_NUMBER = "2348165438357";
const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function Index() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const addToCart = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    toast.success("Added to cart");
  };
  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const items = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id)!, qty })),
    [cart]
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const checkout = () => {
    if (!items.length) return;
    const lines = items.map((i) => `• ${i.name} x${i.qty} — ${formatNaira(i.price * i.qty)}`).join("%0A");
    const msg =
      `*New Order — Hafsnur Delight*%0A%0A` +
      `${lines}%0A%0A` +
      `*Total: ${formatNaira(total)}*%0A%0A` +
      `Please confirm availability and delivery. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Hafsnur <span className="text-primary">Delight</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#menu" className="hover:text-foreground transition">Menu</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="default" className="relative bg-primary hover:bg-primary/90 rounded-full px-5">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 grid place-items-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="font-display text-2xl">Your Order</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your cart is empty.</p>
                  </div>
                )}
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 items-center bg-muted/40 rounded-2xl p-3">
                    <img src={i.image} alt={i.name} className="w-16 h-16 rounded-xl object-cover" width={64} height={64} loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{i.name}</p>
                      <p className="text-sm text-primary font-bold">{formatNaira(i.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full bg-background border border-border grid place-items-center hover:bg-accent transition" aria-label="Decrease">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-semibold">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full bg-background border border-border grid place-items-center hover:bg-accent transition" aria-label="Increase">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setQty(i.id, 0)} className="text-muted-foreground hover:text-destructive p-2" aria-label="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4 bg-muted/30">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span><span>{formatNaira(total)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span><span className="text-primary">{formatNaira(total)}</span>
                  </div>
                  <Button onClick={checkout} className="w-full h-12 rounded-full text-base font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
                    Checkout via WhatsApp
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">You'll be redirected to confirm your order.</p>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 py-20 md:py-32 lg:py-40 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/30 text-accent-foreground text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Now Open — Order on WhatsApp
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05]">
            Snacks that <span className="text-primary italic">spark joy</span>, made fresh daily.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            From buttery meat pies to crispy shawarma — Hafsnur Delight serves Nigeria's favourite bites with love, every single day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#menu">
              <Button size="lg" className="rounded-full h-12 px-7 text-base font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
                Order Now
              </Button>
            </a>
            <a href="#about">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-7 text-base font-semibold border-2">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="container mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-primary font-semibold uppercase tracking-wider text-sm">Our Menu</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">Pick your delight</h2>
          </div>
          <p className="text-muted-foreground max-w-sm">Tap "Add" on anything you love. We'll send it straight to WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <article key={p.id} className="group bg-card rounded-3xl overflow-hidden border border-border transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-semibold">{p.tag}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold leading-tight">{p.name}</h3>
                    <span className="text-primary font-bold text-lg whitespace-nowrap">{formatNaira(p.price)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
                  <div className="mt-4">
                    {qty === 0 ? (
                      <Button onClick={() => addToCart(p.id)} className="w-full rounded-full font-semibold bg-foreground text-background hover:bg-foreground/90">
                        <Plus className="w-4 h-4" /> Add to Cart
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between bg-muted/60 rounded-full p-1">
                        <button onClick={() => setQty(p.id, qty - 1)} className="w-9 h-9 rounded-full bg-background grid place-items-center hover:bg-accent transition" aria-label="Decrease">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold">{qty} in cart</span>
                        <button onClick={() => setQty(p.id, qty + 1)} className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary/90 transition" aria-label="Increase">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20" style={{ background: "var(--gradient-warm)" }}>
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold uppercase tracking-wider text-sm">About Us</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">Baked with love. Served with pride.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Hafsnur Delight is a Nigerian-owned snacks kitchen serving freshly made pastries, wraps, and treats. Every order is prepared on-demand using quality ingredients — because you deserve nothing less.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[["100%", "Fresh"], ["30 min", "Delivery"], ["7 days", "Open"]].map(([n, l]) => (
                <div key={l} className="bg-card rounded-2xl p-4 text-center border border-border">
                  <div className="font-display text-2xl font-bold text-primary">{n}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={burgerImg} alt="Signature burger" className="rounded-3xl w-full aspect-square object-cover" width={800} height={800} loading="lazy" style={{ boxShadow: "var(--shadow-glow)" }} />
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 border border-border max-w-[200px]" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex -space-x-2 mb-2">
                {["🍔", "🍕", "🥟"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-accent grid place-items-center text-lg border-2 border-card">{e}</div>
                ))}
              </div>
              <p className="text-sm font-semibold">500+ happy customers this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
                  <Flame className="w-5 h-5" />
                </div>
                <span className="font-display text-xl font-bold">Hafsnur Delight</span>
              </div>
              <p className="mt-4 text-background/60 text-sm leading-relaxed">Nigeria's tastiest snacks — fresh from our kitchen to your doorstep.</p>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-3">Contact</h4>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-background/70 hover:text-background mb-2">
                <Phone className="w-4 h-4" /> +234 816 543 8357
              </a>
              <div className="flex items-center gap-2 text-background/70">
                <MapPin className="w-4 h-4" /> Delivering nationwide
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-3">Order Hours</h4>
              <p className="text-background/70 text-sm">Monday – Sunday<br />9:00 AM – 10:00 PM</p>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-background/10 text-center text-background/50 text-sm">
            © {new Date().getFullYear()} Hafsnur Delight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
