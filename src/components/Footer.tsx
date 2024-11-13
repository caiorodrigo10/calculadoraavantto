export const Footer = () => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-4 mt-12 mb-8">
      <img 
        src="https://unicorn-images.b-cdn.net/d911f5e3-877b-40db-a0d9-8a6e43928ff8?optimizer=gif&width=80&height=18" 
        alt="Logo Avantto"
        className="mx-auto opacity-60 hover:opacity-100 transition-opacity"
        width={80}
        height={18}
      />
      <p className="text-sm text-foreground/60 px-4">
        Os dados apresentados são apenas estimativas baseadas em médias de nossos clientes. 
        Não podemos garantir resultados específicos, pois estes dependem de diversos fatores como 
        segmento de mercado, modelo de operação e características únicas de cada empresa.
      </p>
    </div>
  );
};