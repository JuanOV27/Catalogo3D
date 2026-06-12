import type { Categoria } from "../../types/models";

interface Props {
  categorias: Categoria[];
  selected: string | null;
  onSelect: (categoriaId: string | null) => void;
}

export default function CategoriaFilter({ categorias, selected, onSelect }: Props) {
  return (
    <div className="filter-row">
      <button
        type="button"
        className={`filter-pill ${selected === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          className={`filter-pill ${selected === categoria.id ? "active" : ""}`}
          onClick={() => onSelect(categoria.id)}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
