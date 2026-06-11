import type { ReactNode } from "react";
import { useSession } from "../../lib/useSession";
import LoadingSpinner from "../common/LoadingSpinner";

interface Props {
  children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const { session, ready } = useSession();

  if (!ready) {
    return <LoadingSpinner />;
  }

  if (!session || session.rol !== "ADMIN") {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return <LoadingSpinner label="Redirigiendo..." />;
  }

  return <>{children}</>;
}
