import AdminGuard from "./AdminGuard";

const SECCIONES = [
  { href: "/admin/articulos", titulo: "Artículos", desc: "Crear, editar y eliminar artículos del catálogo.", icon: "🧩" },
  { href: "/admin/categorias", titulo: "Categorías", desc: "Organizar los artículos por categorías.", icon: "🏷️" },
  { href: "/admin/clientes", titulo: "Clientes", desc: "Gestionar las cuentas de clientes registrados.", icon: "🧑‍🤝‍🧑" },
  { href: "/admin/admins", titulo: "Administradores", desc: "Gestionar las cuentas de administradores.", icon: "🛠️" },
];

function AdminDashboardContent() {
  return (
    <div className="grid">
      {SECCIONES.map((seccion) => (
        <a key={seccion.href} href={seccion.href} className="card dashboard-card">
          <div className="feature-icon">{seccion.icon}</div>
          <h3>{seccion.titulo}</h3>
          <p className="muted">{seccion.desc}</p>
        </a>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
