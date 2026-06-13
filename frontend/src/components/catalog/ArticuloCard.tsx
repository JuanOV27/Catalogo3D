import type { Articulo } from "../../types/models";
import WhatsAppButton from "../common/WhatsAppButton";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='160' viewBox='0 0 220 160'%3E%3Crect width='220' height='160' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";

interface Props {
  articulo: Articulo;
  onSelect: (articulo: Articulo) => void;
}

export default function ArticuloCard({ articulo, onSelect }: Props) {
  return (
    <div className="card articulo-card" onClick={() => onSelect(articulo)}>
      <div className="articulo-card-media">
        <img
          src={articulo.imagenUrl || PLACEHOLDER_IMG}
          alt={articulo.nombre}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
          }}
        />
        <span className={`badge articulo-card-badge ${articulo.disponible ? "badge-success" : "badge-muted"}`}>
          {articulo.disponible ? "Disponible" : "Agotado"}
        </span>
      </div>
      <div className="articulo-card-body">
        <h3>{articulo.nombre}</h3>
        <span className="precio">${articulo.precio.toFixed(2)}</span>
        {articulo.enlaceWhatsapp && (
          <WhatsAppButton
            href={articulo.enlaceWhatsapp}
            label="Comprar"
            className="btn-sm articulo-card-whatsapp"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}
