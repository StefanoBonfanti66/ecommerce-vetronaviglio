export default function DesignSystemProof() {
  return (
    <div className="max-w-7xl mx-auto p-12 space-y-vs-16">
      <h1 className="text-hero mb-6">Industrial Luxury Beauty</h1>
      
      {/* Product Card Proof */}
      <div className="grid grid-cols-4 gap-8">
        <div className="border border-aluminum/40 p-1 group hover:border-onyx transition-all duration-300">
          <div className="aspect-square bg-aluminum/10 mb-4" />
          <div className="px-5 pb-5">
            <h3 className="font-serif text-lg mb-1">Charme Flacone</h3>
            <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-aluminum mb-4 font-medium">
              QC030.0685 · VETRO · 30ML
            </div>
            <button className="w-full border border-onyx py-2 text-[10px] uppercase tracking-[0.15em] font-medium group-hover:bg-onyx group-hover:text-bone transition-all">
              Richiedi Campione
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
