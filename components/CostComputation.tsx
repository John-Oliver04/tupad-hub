"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FormInput } from "./FormInput";

export type CostValues = {
  totalBeneficiaries: number;
  noOfDays: number;
  salaryPerDay: number;
};

export type CostResult = {
  laborCost: number;
  ppe: number;
  insurance: number;
  total: number;
};

type Props = {
  values: CostValues;
  onChange: (next: Partial<CostValues>) => void;
};

export default function CostComputation({ values, onChange }: Props) {
  const [beneficiaries, setBeneficiaries] = useState<number>(values.totalBeneficiaries || 0);
  const [days, setDays] = useState<number>(values.noOfDays || 0);
  const [salary, setSalary] = useState<number>(values.salaryPerDay || 0);

  useEffect(() => {
    onChange({ totalBeneficiaries: beneficiaries, noOfDays: days, salaryPerDay: salary });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficiaries, days, salary]);

  const result: CostResult = useMemo(() => {
    const laborCost = beneficiaries * days * salary;
    const ppe = beneficiaries * 250;
    const insurance = beneficiaries * 50;
    const total = laborCost + ppe + insurance;
    return { laborCost, ppe, insurance, total };
  }, [beneficiaries, days, salary]);

  const fmt = (n: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(n || 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <FormInput
          label="Salary per Day (PHP)"
          name="salaryPerDay"
          type="number"
          min={0}
          value={salary}
          onChange={(e) => setSalary(parseFloat(e.target.value || "0"))}
        />
        <FormInput
          label="Total Beneficiaries"
          name="totalBeneficiaries"
          type="number"
          min={0}
          value={beneficiaries}
          onChange={(e) => setBeneficiaries(parseInt(e.target.value || "0", 10))}
        />
        <FormInput
          label="No. of Days"
          name="noOfDays"
          type="number"
          min={0}
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value || "0", 10))}
        />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-zinc-700">Cost Computation</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span>Labor Cost</span>
            <span className="font-medium">{fmt(result.laborCost)}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>PPE</span>
            <span className="font-medium">{fmt(result.ppe)}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Insurance</span>
            <span className="font-medium">{fmt(result.insurance)}</span>
          </li>
          <li className="mt-2 border-t pt-2 text-base font-semibold flex items-center justify-between">
            <span>Total</span>
            <span>{fmt(result.total)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

