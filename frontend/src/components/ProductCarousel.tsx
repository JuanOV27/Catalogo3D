import { useEffect, useState } from "react";
import type { Articulo } from "../types/models";
import { articulosApi } from "../lib/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='160' viewBox='0 0 220 160'%3E%3Crect width='220' height='160' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";

const AUTOPLAY_MS = 4500;

export default function ProductCarousel() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articulosApi
      .getAll()
      .then((data) => setArticulos(data.filter((a) => a.disponible)))
      .catch(() => setArticulos([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (articulos.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % articulos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [articulos.length]);

  if (loading || articulos.length === 0) return null;

  const goTo = (i: number) => setIndex((i + articulos.length) % articulos.length);

  return (
    <section className="carousel">
      <div className="page-header">
        <h2>Lo último del catálogo</h2>
        <a className="btn btn-sm" href="/catalogo">
          Ver catálogo completo
        </a>
      </div>
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {articulos.map((articulo) => (
            <div className="carousel-slide" key={articulo.id}>
              <div className="carousel-card">
                <img
                  src={articulo.imagenUrl || PLACEHOLDER_IMG}
                  alt={articulo.nombre}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                  }}
                />
                <div className="carousel-info">
                  <h3>{articulo.nombre}</h3>
                  <span className="precio">${articulo.precio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {articulos.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              onClick={() => goTo(index - 1)}
              aria-label="Producto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              onClick={() => goTo(index + 1)}
              aria-label="Producto siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>
      {articulos.length > 1 && (
        <div className="carousel-dots">
          {articulos.map((articulo, i) => (
            <button
              key={articulo.id}
              type="button"
              className={`carousel-dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir al producto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
