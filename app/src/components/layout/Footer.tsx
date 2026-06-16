export default function Footer() {
  return (
    <footer className="border-t border-aluminum/20 mt-vs-16 py-vs-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-vs-8 text-[11px] text-aluminum uppercase tracking-[0.1em]">
        
        {/* Info Azienda */}
        <div className="space-y-2">
          <h4 className="text-onyx font-sans font-bold">Vetronaviglio S.r.l.</h4>
          <p>Via Don Severino Fracassi, 31/39</p>
          <p>20008 Bareggio (MI), Italy</p>
        </div>

        {/* Contatti */}
        <div className="space-y-2">
          <h4 className="text-onyx font-sans font-bold">Contatti</h4>
          <p>T. +39 02 9036 4184</p>
          <p>infostore@vetronaviglio.eu</p>
        </div>

        {/* Link Legali */}
        <div className="space-y-2 flex flex-col">
          <h4 className="text-onyx font-sans font-bold">Informazioni</h4>
          <a href="#" className="hover:text-onyx">Condizioni di vendita</a>
          <a href="#" className="hover:text-onyx">Privacy Policy</a>
          <a href="#" className="hover:text-onyx">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
