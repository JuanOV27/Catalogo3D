import { useSession } from "../lib/useSession";

export default function Nav() {
  const { session, ready, logout } = useSession();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          Catálogo 3D
        </a>
        <div className="navbar-links">
          <a href="/catalogo">Catálogo</a>
          {!ready ? null : session === null ? (
            <>
              <a href="/login">Iniciar sesión</a>
              <a href="/registro">Registrarse</a>
            </>
          ) : session.rol === "ADMIN" ? (
            <>
              <a href="/admin">Panel Admin</a>
              <span className="navbar-user">{session.nombre}</span>
              <button type="button" className="btn btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/perfil">Mi perfil</a>
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
