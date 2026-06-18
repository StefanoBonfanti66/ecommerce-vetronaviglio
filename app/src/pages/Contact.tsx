export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-vs-16">
      <header className="mb-12 border-b border-aluminum/20 pb-8">
        <h1 className="font-serif text-3xl uppercase tracking-[0.05em]">Contatti</h1>
      </header>
      <div className="space-y-6 text-sm">
        <p>Vetronaviglio S.r.l.<br/>
        Via Don Severino Fracassi, 31/39 - 20008 Bareggio (MI) Italy</p>
        <p>T. +39 02 9036 4184</p>
        <p>Per informazioni scrivere a <a href="mailto:infostore@vetronaviglio.eu" className="underline">infostore@vetronaviglio.eu</a></p>
      </div>
    </div>
  );
}
