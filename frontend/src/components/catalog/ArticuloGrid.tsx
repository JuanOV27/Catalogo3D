import type { Articulo } from "../../types/models";
import ArticuloCard from "./ArticuloCard";

interface Props {
  articulos: Articulo[];
  onSelect: (articulo: Articulo) => void;
}

export default function ArticuloGrid({ articulos, onSelect }: Props) {
  if (articulos.length === 0) {
    return <p className="empty-state">No hay artículos en esta categoría.</p>;
  }

  return (
    <div className="grid">
      {articulos.map((articulo) => (
        <ArticuloCard key={articulo.id} articulo={articulo} onSelect={onSelect} />
      ))}
    </div>
  );
}
