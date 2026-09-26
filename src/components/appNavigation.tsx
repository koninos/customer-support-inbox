"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./appNavigation.module.scss";

export function AppNavigation() {
  const pathname = usePathname();

  const isAgentPortal = pathname === "/";
  const isCustomerPortal = pathname.startsWith("/customer");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          Support Inbox
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          <Link
            href="/"
            className={`${styles.link} ${isAgentPortal ? styles.active : ""}`}
            aria-current={isAgentPortal ? "page" : undefined}
          >
            Agent Portal
          </Link>

          <Link
            href="/customer"
            className={`${styles.link} ${
              isCustomerPortal ? styles.active : ""
            }`}
            aria-current={isCustomerPortal ? "page" : undefined}
          >
            Customer Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
