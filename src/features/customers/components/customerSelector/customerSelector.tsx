import { CustomerResponse } from "@/features/conversations/types/api";

import styles from "./customerSelector.module.scss";

type CustomerSelectorProps = {
  customers: CustomerResponse[];
  customerId: string;
  onCustomerChange: (customerId: string) => void;
};

export function CustomerSelector({
  customers,
  customerId,
  onCustomerChange,
}: CustomerSelectorProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="customer">Customer</label>

      <select
        id="customer"
        value={customerId}
        onChange={(event) => onCustomerChange(event.target.value)}
      >
        <option value="">Select a customer</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </div>
  );
}
