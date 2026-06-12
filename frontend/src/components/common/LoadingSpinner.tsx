interface Props {
  label?: string;
}

export default function LoadingSpinner({ label = "Cargando..." }: Props) {
  return <p className="loading">{label}</p>;
}
