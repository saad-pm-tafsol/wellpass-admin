"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { STUDIOS, CUSTOMERS, PENDING_STUDIOS, type PendingStudio } from "@/data/mock";

export type AccountStatus = "Active" | "Frozen";

type AccountsState = {
  studioStatus: Record<string, AccountStatus>;
  customerStatus: Record<string, AccountStatus>;
  /** Toggle a studio's account status; returns the new status. */
  toggleStudio: (id: string) => AccountStatus;
  /** Toggle a customer's account status (keyed by email); returns the new status. */
  toggleCustomer: (email: string) => AccountStatus;
  /** Whether a customer can earn loyalty points. */
  customerEarning: Record<string, boolean>;
  /** Toggle whether a customer can earn loyalty points; returns the new value. */
  toggleCustomerEarning: (email: string) => boolean;

  /** Studios still awaiting approval. */
  pendingStudios: PendingStudio[];
  /** Look up a pending application by id. */
  getPendingStudio: (id: string) => PendingStudio | undefined;
  /** Approve an application (removes it from the pending queue); returns it. */
  approveStudio: (id: string) => PendingStudio | undefined;
  /** Reject an application (removes it from the pending queue); returns it. */
  rejectStudio: (id: string) => PendingStudio | undefined;
};

const AccountsContext = createContext<AccountsState | null>(null);

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [studioStatus, setStudioStatus] = useState<Record<string, AccountStatus>>(() =>
    Object.fromEntries(STUDIOS.map((s) => [s.id, "Active" as AccountStatus])),
  );
  const [customerStatus, setCustomerStatus] = useState<Record<string, AccountStatus>>(() =>
    Object.fromEntries(CUSTOMERS.map((c) => [c.email, c.status as AccountStatus])),
  );
  const [customerEarning, setCustomerEarning] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CUSTOMERS.map((c) => [c.email, true])),
  );
  const [pendingStudios, setPendingStudios] = useState<PendingStudio[]>(PENDING_STUDIOS);

  const toggleStudio = (id: string): AccountStatus => {
    const next: AccountStatus = (studioStatus[id] ?? "Active") === "Frozen" ? "Active" : "Frozen";
    setStudioStatus((prev) => ({ ...prev, [id]: next }));
    return next;
  };

  const toggleCustomer = (email: string): AccountStatus => {
    const next: AccountStatus = (customerStatus[email] ?? "Active") === "Frozen" ? "Active" : "Frozen";
    setCustomerStatus((prev) => ({ ...prev, [email]: next }));
    return next;
  };

  const toggleCustomerEarning = (email: string): boolean => {
    const next = !(customerEarning[email] ?? true);
    setCustomerEarning((prev) => ({ ...prev, [email]: next }));
    return next;
  };

  const getPendingStudio = (id: string) => pendingStudios.find((s) => s.id === id);

  const resolve = (id: string): PendingStudio | undefined => {
    const studio = pendingStudios.find((s) => s.id === id);
    if (studio) setPendingStudios((prev) => prev.filter((s) => s.id !== id));
    return studio;
  };

  return (
    <AccountsContext.Provider
      value={{
        studioStatus,
        customerStatus,
        customerEarning,
        toggleStudio,
        toggleCustomer,
        toggleCustomerEarning,
        pendingStudios,
        getPendingStudio,
        approveStudio: resolve,
        rejectStudio: resolve,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts(): AccountsState {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error("useAccounts must be used within an AccountsProvider");
  return ctx;
}
