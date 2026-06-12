import type { Articulo, Categoria } from "../../types/models";
import Modal from "../common/Modal";

interface Props {
  articulo: Articulo;
  categoria?: Categoria;
  onClose: () => void;
}

export default function ArticuloDetailModal({ articulo, categoria, onClose }: Props) {
  return (
    <Modal title={articulo.nombre} onClose={onClose}>
      <p>{articulo.descripcion}</p>
      <dl className="detail-grid">
        <dt>Precio</dt>
        <dd>${articulo.precio.toFixed(2)}</dd>

        <dt>Categoría</dt>
        <dd>{categoria?.nombre ?? "Sin categoría"}</dd>

        <dt>Material</dt>
        <dd>{articulo.material}</dd>

        <dt>Color</dt>
        <dd>{articulo.color}</dd>

        <dt>Tipo de filamento</dt>
        <dd>{articulo.tipoFilamento}</dd>

        <dt>Tiempo de impresión</dt>
        <dd>{articulo.tiempoImpresionHoras} h</dd>

        <dt>Dimensiones (A x H x L)</dt>
        <dd>
          {articulo.dimensiones.ancho} x {articulo.dimensiones.alto} x {articulo.dimensiones.largo} cm
        </dd>

        <dt>Disponibilidad</dt>
        <dd>
          <span className={`badge ${articulo.disponible ? "badge-success" : "badge-muted"}`}>
            {articulo.disponible ? "Disponible" : "No disponible"}
          </span>
        </dd>

        <dt>Fecha de creación</dt>
        <dd>{new Date(articulo.fechaCreacion).toLocaleString("es-PE")}</dd>
      </dl>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
