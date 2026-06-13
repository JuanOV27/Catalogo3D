import { useState } from "react";
import { useSession } from "../lib/useSession";

export default function Nav() {
  const { session, ready, logout } = useSession();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="brand-mark">
            <img src="/logo.svg" alt="" />
          </span>
          Catálogo 3D
        </a>
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
        <div className={`navbar-links ${open ? "open" : ""}`}>
          <a href="/catalogo" onClick={() => setOpen(false)}>
            Catálogo
          </a>
          {!ready ? null : session === null ? (
            <>
              <a href="/login" onClick={() => setOpen(false)}>
                Iniciar sesión
              </a>
              <a href="/registro" onClick={() => setOpen(false)}>
                Registrarse
              </a>
            </>
          ) : session.rol === "ADMIN" ? (
            <>
              <a href="/admin" onClick={() => setOpen(false)}>
                Panel Admin
              </a>
              <span className="navbar-user">{session.nombre}</span>
              <button type="button" className="btn btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/perfil" onClick={() => setOpen(false)}>
                Mi perfil
              </a>
              <span className="navbar-user">{session.nombre}</span>
              <button type="button" className="btn btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
