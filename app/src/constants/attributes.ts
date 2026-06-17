export const PREDEFINED_ATTRIBUTES = [
  'ml',
  'materiale',
  'imboccatura',
  'finitura',
  'categoria',
  'colore'
];

export const ATTRIBUTE_OPTIONS: Record<string, string[]> = {
  ml: ['5', '10', '15', '30', '50', '100', '125', '150', '200', '250', '300', '400', '500'],
  materiale: ['PEHD', 'PET', 'PETG', 'PP', 'SAN', 'Vetro', 'Alluminio'],
  categoria: ['Flaconi vetro', 'Vasi plastica', 'Coperchi', 'Flaconi Pet / R-Pet', 'Contagocce', 'Profumeria', 'Flacontubi plastica', 'Flaconi airless', 'Vasi vetro', 'Flaconi Colorati'],
  finitura: ['Satinato', 'Lucido', 'Opaco', 'Perlato', 'Trasparente', 'Metallizato', 'Soft-touch'],
  imboccatura: ['GCMI 24/410', 'FEA 20', 'GCMI 18/400', 'Foamer', 'Disc Top', 'Snap-on', 'TWIST-OFF', 'GCMI 24/410 FLIPTOP'],
  colore: [] // Lasciamo vuoto per usare datalist dinamico
};
