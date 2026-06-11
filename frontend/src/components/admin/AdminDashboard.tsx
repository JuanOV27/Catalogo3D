import AdminGuard from "./AdminGuard";

const SECCIONES = [
  { href: "/admin/articulos", titulo: "Artículos", desc: "Crear, editar y eliminar artículos del catálogo." },
  { href: "/admin/categorias", titulo: "Categorías", desc: "Organizar los artículos por categorías." },
  { href: "/admin/clientes", titulo: "Clientes", desc: "Gestionar las cuentas de clientes registrados." },
  { href: "/admin/admins", titulo: "Administradores", desc: "Gestionar las cuentas de administradores." },
];

function AdminDashboardContent() {
  return (
    <div className="grid">
      {SECCIONES.map((seccion) => (
        <a key={seccion.href} href={seccion.href} className="card articulo-card" style={{ cursor: "pointer" }}>
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
