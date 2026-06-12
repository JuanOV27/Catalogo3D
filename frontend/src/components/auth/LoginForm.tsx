import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError, authApi } from "../../lib/api";
import { useSession } from "../../lib/useSession";
import ErrorBanner from "../common/ErrorBanner";

export default function LoginForm() {
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      login(response);
      window.location.href = response.rol === "ADMIN" ? "/admin" : "/catalogo";
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
      <ErrorBanner message={error} />
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </div>
      <p className="muted">
        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>.
      </p>
    </form>
  );
}
