import type { MouseEvent } from "react";

interface Props {
  href: string;
  label?: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}

export default function WhatsAppButton({ href, label = "Comprar por WhatsApp", onClick, className = "" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-whatsapp ${className}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.45 5.13L2 22l5.13-1.55a9.84 9.84 0 0 0 4.91 1.31h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.05c-.24.68-1.4 1.3-1.92 1.38-.49.08-1.1.11-1.77-.11-.41-.13-.93-.3-1.6-.59-2.81-1.21-4.64-4.04-4.78-4.23-.14-.18-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.26-.28.56-.35.75-.35.19 0 .38 0 .54.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.45.51-.15.14-.3.29-.13.58.17.29.78 1.29 1.68 2.09 1.16 1.03 2.13 1.36 2.43 1.51.3.15.48.13.65-.05.18-.18.76-.88.96-1.18.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.29.14.49.21.56.33.07.12.07.7-.17 1.38Z"/>
      </svg>
      {label}
    </a>
  );
}
