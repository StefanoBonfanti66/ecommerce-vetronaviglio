export default function DesignSystemProof() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Proof header */}
      <div className="bg-onyx text-bone py-16 px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum/50 mb-4">Design System Proof · Step 3</p>
          <h1 className="font-display text-7xl md:text-8xl leading-tight font-semibold">Vetronaviglio</h1>
          <p className="font-sans text-sm text-aluminum/70 mt-4 max-w-2xl leading-relaxed">
            Lusso industriale concreto. Heritage manifatturiero italiano, rigore tecnico editoriale.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32 pb-32">

        {/* ── 1. PALETTE ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">01 · Palette</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Onyx', hex: '#1A1A1A', role: 'Testi primari, CTA', bg: 'bg-onyx', text: 'text-bone' },
              { name: 'Bone', hex: '#F5F3EE', role: 'Sfondo pagine', bg: 'bg-bone border border-aluminum/20', text: 'text-onyx' },
              { name: 'Aluminum', hex: '#8C8C8C', role: 'Testi secondari, label', bg: 'bg-[#8C8C8C]', text: 'text-bone' },
              { name: 'Amber Accent', hex: '#C47A2E', role: 'Prezzo, stock, attivo', bg: 'bg-amber-accent', text: 'text-bone' },
              { name: 'Surface', hex: '#F0EFEB', role: 'Sfondo schede tecniche', bg: 'bg-surface border border-aluminum/20', text: 'text-onyx' },
              { name: 'Border', hex: '#E5E3DE', role: 'Bordi, separatori', bg: 'bg-[#E5E3DE]', text: 'text-onyx' },
              { name: 'White', hex: '#FFFFFF', role: 'Card, modali', bg: 'bg-white border border-aluminum/20', text: 'text-onyx' },
            ].map(c => (
              <div key={c.name} className="space-y-2">
                <div className={`h-24 rounded ${c.bg} ${c.text} flex items-end p-3 text-[10px] font-sans uppercase tracking-widest`}>
                  {c.name}
                </div>
                <p className="font-sans text-[11px] text-aluminum">{c.hex}</p>
                <p className="font-sans text-[10px] text-aluminum/70 italic">{c.role}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[11px] text-aluminum/70 mt-6 border-l-2 border-amber-accent/40 pl-4 italic">
            Regola ambra: massimo 1 occorrenza visibile per viewport. Mai decorativo.
          </p>
        </section>

        {/* ── 2. TYPOGRAPHY: VARIANT A (Cormorant Garamond + Inter) ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">02 · Tipografia · Variante A (preferita)</p>
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-aluminum mb-8">Display: Cormorant Garamond · Corpo: Inter</p>

          <div className="space-y-8 bg-white p-8 md:p-12 rounded border border-aluminum/10">
            <div>
              <p className="font-display text-6xl md:text-7xl leading-tight font-semibold tracking-tight">
                Vetro Ambra<br />50ml
              </p>
              <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Hero / Display — Cormorant Garamond Semibold</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-snug">
                Collezione Cristal
              </p>
              <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Section Heading — Cormorant Garamond Semibold</p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-aluminum font-medium">
                Categoria · Capacità · Materiale
              </p>
              <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Filter Label — Inter Medium Uppercase</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="font-sans text-sm leading-relaxed text-onyx/80">
                  Il flacone in vetro Ambra da 50 ml ha un fascino senza tempo. Il suo design armonico ed equilibrato lo rende ideale per ogni tipologia di prodotto skincare.
                </p>
                <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Body — Inter Regular 400</p>
              </div>
              <div>
                <p className="font-sans text-[13px] leading-relaxed text-onyx/60">
                  Descrizione prodotto con spacing più leggero. Ideale per paragrafi secondari o note tecniche dove il dettaglio è importante ma non deve competere con il contenuto principale.
                </p>
                <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Body Secondario — Inter Light 300</p>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="font-sans text-[11px] font-medium text-amber-accent">€0.59 / pezzo</span>
              <span className="font-sans text-[10px] text-aluminum">SKU: AC050.0845</span>
              <span className="font-sans text-[10px] text-aluminum">Stock: 336 pz</span>
            </div>
          </div>
        </section>

        {/* ── 3. TYPOGRAPHY: VARIANT B (Source Serif 4 + Inter) ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">03 · Tipografia · Variante B (sobria/editoriale)</p>
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-aluminum mb-8">Display: Source Serif 4 · Corpo: Inter</p>

          <div className="space-y-8 bg-white p-8 md:p-12 rounded border border-aluminum/10">
            <div>
              <p className="font-editorial text-6xl md:text-7xl leading-tight font-semibold tracking-tight">
                Vetro Ambra<br />50ml
              </p>
              <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Hero / Display — Source Serif 4 Semibold</p>
            </div>
            <div>
              <p className="font-editorial text-3xl md:text-4xl font-semibold tracking-tight leading-snug">
                Collezione Cristal
              </p>
              <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Section Heading — Source Serif 4 Semibold</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="font-editorial text-base leading-relaxed text-onyx/80">
                  Il flacone in vetro Ambra da 50 ml ha un fascino senza tempo. Il suo design armonico ed equilibrato lo rende ideale per ogni tipologia di prodotto skincare.
                </p>
                <p className="font-sans text-[10px] text-aluminum mt-2 uppercase tracking-[0.15em]">Body — Source Serif 4 Regular</p>
              </div>
            </div>
            <p className="font-sans text-[11px] text-aluminum/70 italic border-l-2 border-aluminum/30 pl-4">
              Source Serif 4 è più sobria, <span className="font-medium text-onyx">quasi da rivista tecnica</span>. Zero rischio cosmetico, ma meno carattere per la hero.
            </p>
          </div>
        </section>

        {/* ── 4. PRODUCT CARD ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">04 · Product Card</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {/* Card 1: con immagine */}
            <div className="bg-white group cursor-pointer">
              <div className="aspect-square bg-surface relative overflow-hidden flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-to-br from-amber-accent/5 to-amber-accent/20 rounded-full blur-xl absolute" />
                <div className="w-24 h-32 border-2 border-aluminum/20 rounded-md relative z-10">
                  <div className="absolute inset-2 bg-amber-accent/10 rounded-sm" />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-accent/30 rounded-full" />
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-display text-xl font-semibold leading-tight group-hover:text-amber-accent transition-colors duration-300">
                  Vetro Ambra
                </h3>
                <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum space-y-1">
                  <p>AC050.0845 · Vetro · 50ml</p>
                </div>
                <p className="font-sans text-sm font-medium text-amber-accent">€0.59 / pezzo</p>
                <button className="w-full border border-onyx py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-onyx hover:text-bone transition-all duration-300">
                  Aggiungi al carrello
                </button>
              </div>
            </div>

            {/* Card 2: senza immagine (placeholder) */}
            <div className="bg-white group cursor-pointer">
              <div className="aspect-square bg-surface relative overflow-hidden flex items-center justify-center">
                <svg className="w-12 h-12 text-aluminum/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M12 8v8m-4-4h8m-2 8a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-display text-xl font-semibold leading-tight">
                  Charme Flacone
                </h3>
                <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum space-y-1">
                  <p>QC030.0685 · Vetro · 30ml</p>
                </div>
                <p className="font-sans text-sm font-medium text-amber-accent">€0.48 / pezzo</p>
                <button className="w-full border border-onyx py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-onyx hover:text-bone transition-all duration-300">
                  Aggiungi al carrello
                </button>
              </div>
            </div>

            {/* Card 3: prodotto in evidenza (nuovo) */}
            <div className="bg-white group cursor-pointer ring-1 ring-amber-accent/20">
              <div className="aspect-square bg-surface relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-amber-accent/10 to-transparent absolute" />
                <div className="w-24 h-32 border-2 border-amber-accent/20 rounded-md relative z-10">
                  <div className="absolute inset-2 bg-amber-accent/5 rounded-sm" />
                </div>
                <span className="absolute top-3 left-3 font-sans text-[8px] uppercase tracking-[0.2em] text-amber-accent font-medium bg-white/80 px-2 py-1">Novità</span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-display text-xl font-semibold leading-tight">
                  Cristal Speciale
                </h3>
                <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum space-y-1">
                  <p>AC050.0629 · Vetro · 100ml</p>
                </div>
                <p className="font-sans text-sm font-medium text-amber-accent">€0.72 / pezzo</p>
                <button className="w-full border border-onyx py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-onyx hover:text-bone transition-all duration-300">
                  Aggiungi al carrello
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. HEADER DIRECTION ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">05 · Header direction</p>
          <div className="bg-white border-b border-aluminum/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-onyx rounded flex items-center justify-center">
                  <span className="font-display text-bone text-xs">VN</span>
                </div>
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-aluminum hidden md:block">Vetronaviglio · since 1966</span>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                {['Collezioni', 'Catalogo', 'Campioni', 'Azienda', 'Contatti'].map(l => (
                  <span key={l} className="font-sans text-[11px] uppercase tracking-[0.2em] text-onyx/70 hover:text-onyx transition-colors cursor-pointer">
                    {l}
                  </span>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <span className="font-sans text-[11px] uppercase tracking-widest font-medium cursor-pointer text-onyx/60 hover:text-onyx">IT</span>
                <div className="relative">
                  <svg className="w-5 h-5 text-onyx/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-accent text-bone text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">3</span>
                </div>
                <span className="md:hidden font-sans text-[10px] uppercase tracking-widest cursor-pointer">Menu</span>
              </div>
            </div>
          </div>
          <p className="font-sans text-[10px] text-aluminum mt-3 italic">
            Header sottile, fisso, semi-trasparente. Il brand vive nella hero, non nella barra. Nav link in Inter uppercase tracking.
          </p>
        </section>

        {/* ── 6. FILTER CONCEPT ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">06 · Filter concept</p>

          {/* Desktop filter */}
          <div className="hidden md:block mb-8">
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum mb-4">Desktop — filter bar integrata</p>
            <div className="bg-white p-6 border border-aluminum/10 rounded space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl font-semibold">Catalogo</p>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[10px] text-aluminum">Filtri</span>
                  <div className="relative">
                    <input
                      readOnly
                      placeholder="Cerca SKU..."
                      className="font-sans text-[11px] border border-aluminum/20 py-2 px-3 w-40 bg-transparent text-onyx placeholder:text-aluminum/50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {['Tutti', 'Vetro', 'Plastica', 'Accessori', 'Ricambio'].map((cat, i) => (
                  <span
                    key={cat}
                    className={`font-sans text-[10px] uppercase tracking-[0.15em] px-4 py-2 border cursor-pointer transition-all duration-200 ${
                      i === 0
                        ? 'bg-onyx text-bone border-onyx'
                        : 'border-aluminum/20 text-aluminum hover:border-onyx hover:text-onyx'
                    }`}
                  >
                    {cat}
                  </span>
                ))}
                <span className="font-sans text-[10px] text-aluminum ml-2">+ capacità · materiale</span>
              </div>
            </div>
          </div>

          {/* Mobile filter — bottom sheet mockup */}
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum mb-4">Mobile — bottom sheet concept</p>
            <div className="relative max-w-sm mx-auto">
              {/* Phone frame */}
              <div className="bg-onyx rounded-[2rem] p-3">
                <div className="bg-bone rounded-[1.5rem] overflow-hidden">
                  {/* Mock screen content */}
                  <div className="p-4 space-y-3 min-h-[300px] bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-widest">Catalogo</span>
                      <span className="font-sans text-[9px] text-amber-accent uppercase tracking-widest">Filtro</span>
                    </div>
                    {[1,2,3].map(i => (
                      <div key={i} className="h-16 bg-surface rounded flex items-center px-3">
                        <div className="w-10 h-10 bg-aluminum/10 rounded mr-3" />
                        <div>
                          <div className="h-3 w-24 bg-aluminum/10 rounded mb-1" />
                          <div className="h-2 w-16 bg-aluminum/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Bottom sheet overlay */}
                  <div className="bg-white border-t border-aluminum/10 px-4 py-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-medium uppercase tracking-widest">Filtri</span>
                      <span className="font-sans text-[10px] text-aluminum uppercase tracking-widest">Chiudi</span>
                    </div>
                    {['Categoria', 'Capacità', 'Materiale'].map(f => (
                      <div key={f} className="space-y-2">
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum font-medium">{f}</p>
                        <div className="flex flex-wrap gap-2">
                          {['Tutti', 'Opzione 1', 'Opzione 2'].map(o => (
                            <span
                              key={o}
                              className={`font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border ${
                                o === 'Tutti' ? 'bg-onyx text-bone border-onyx' : 'border-aluminum/20 text-aluminum'
                              }`}
                            >
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="w-full bg-onyx text-bone py-3 font-sans text-[10px] uppercase tracking-[0.2em]">
                      Applica filtri
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. PRODUCT PAGE HERO BLOCK ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">07 · Product page hero block</p>
          <div className="bg-white border border-aluminum/10 rounded overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left: immagine */}
              <div className="aspect-square bg-surface relative flex items-center justify-center p-8 min-h-[400px]">
                <div className="w-full h-full max-w-sm bg-gradient-to-br from-amber-accent/5 to-amber-accent/15 rounded-full blur-2xl absolute" />
                <div className="w-48 h-64 border-2 border-aluminum/20 rounded-md relative z-10">
                  <div className="absolute inset-3 bg-amber-accent/8 rounded-sm" />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-7 bg-amber-accent/20 rounded-full" />
                </div>
              </div>

              {/* Right: dettagli */}
              <div className="p-6 md:p-10 flex flex-col justify-center space-y-6">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-2">
                    Vetro · 50ml
                  </p>
                  <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
                    Vetro Ambra
                  </h1>
                  <p className="font-sans text-[10px] text-aluminum uppercase tracking-[0.15em] mt-1">
                    SKU: AC050.0845
                  </p>
                </div>

                <p className="font-sans text-sm leading-relaxed text-onyx/70 max-w-md">
                  Il flacone in vetro Ambra da 50 ml ha un fascino senza tempo. Design armonico per prodotti skincare e cosmetici.
                </p>

                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-2xl font-medium text-amber-accent">€0.59</span>
                  <span className="font-sans text-[11px] text-aluminum">/ pezzo</span>
                  <span className="font-sans text-[10px] text-aluminum ml-4">Stock: 336 pz</span>
                </div>

                {/* Data sheet inline */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-aluminum/10">
                  {[
                    { label: 'Capacità', value: '50ml' },
                    { label: 'Materiale', value: 'Vetro' },
                    { label: 'Imboccatura', value: 'GCMI 24/410' },
                    { label: 'Pezzi / scatola', value: '336' },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-aluminum mb-0.5">{s.label}</p>
                      <p className="font-sans text-sm font-medium">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-onyx text-bone py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-onyx/90 transition-colors">
                    Aggiungi al carrello
                  </button>
                  <button className="flex-1 border border-onyx text-onyx py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-onyx/5 transition-colors">
                    Richiedi campione
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. EMPTY / MISSING IMAGE PLACEHOLDER ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">08 · Empty / missing image placeholder</p>
          <div className="flex flex-wrap gap-8 items-start">
            {/* Current (da evitare) */}
            <div className="w-48 space-y-2">
              <div className="aspect-square bg-surface border border-aluminum/20 flex items-center justify-center">
                <p className="font-sans text-[8px] font-bold text-aluminum uppercase tracking-[0.2em] text-center leading-relaxed">
                  IMAGE<br />COMING<br />SOON
                </p>
              </div>
              <p className="font-sans text-[9px] text-red-400/70 italic">Da evitare</p>
            </div>

            {/* Proposto */}
            <div className="w-48 space-y-2">
              <div className="aspect-square bg-surface border border-aluminum/20 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-20 border border-aluminum/20 rounded-sm opacity-40">
                  <div className="absolute inset-3 bg-aluminum/5 rounded-sm" />
                </div>
              </div>
              <p className="font-sans text-[9px] text-aluminum/70 italic">Placeholder silenzioso</p>
            </div>

            {/* Variante con accenno */}
            <div className="w-48 space-y-2">
              <div className="aspect-square bg-surface border border-aluminum/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-accent/[0.02] to-amber-accent/[0.06]" />
                <div className="w-16 h-20 border border-amber-accent/10 rounded-sm">
                  <div className="absolute inset-3 bg-amber-accent/3 rounded-sm" />
                </div>
              </div>
              <p className="font-sans text-[9px] text-aluminum/70 italic">Variante con accenno ambra</p>
            </div>
          </div>
        </section>

        {/* ── 9. FOOTER DIRECTION ── */}
        <section>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-aluminum mb-6">09 · Footer direction</p>
          <div className="bg-onyx text-bone/70 p-8 md:p-12 rounded">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-bone/10 rounded flex items-center justify-center mb-2">
                  <span className="font-display text-bone text-xs">VN</span>
                </div>
                <p className="font-sans text-[10px] leading-relaxed text-bone/50 max-w-xs">
                  Packaging primario in vetro e plastica per il settore Beauty. Design italiano dal 1966.
                </p>
              </div>
              <div className="space-y-3">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">Azienda</p>
                <p className="font-sans text-[10px] text-bone/60">Via Don Severino Fracassi, 31/39</p>
                <p className="font-sans text-[10px] text-bone/60">20008 Bareggio (MI), Italy</p>
                <p className="font-sans text-[10px] text-bone/60">T. +39 02 9036 4184</p>
              </div>
              <div className="space-y-3">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">Info</p>
                {['Condizioni di vendita', 'Privacy Policy', 'Cookie Policy'].map(l => (
                  <p key={l} className="font-sans text-[10px] text-bone/60 hover:text-bone transition-colors cursor-pointer">{l}</p>
                ))}
              </div>
              <div className="space-y-3">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-bone/40 font-medium">Design System</p>
                <p className="font-sans text-[10px] text-bone/60 leading-relaxed">
                  Footer scuro ma non invadente. Il brand identity è nel logo, non in decorazioni. Dati di contatto e link legali in Inter 10px.
                </p>
              </div>
            </div>
            <div className="border-t border-bone/10 mt-8 pt-6 text-center">
              <p className="font-sans text-[9px] text-bone/30 uppercase tracking-[0.15em]">© 2026 Vetronaviglio S.r.l. · P.IVA 03366120271</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}