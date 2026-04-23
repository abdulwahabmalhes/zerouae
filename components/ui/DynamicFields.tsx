"use client";
import React from "react";
import { FieldConfig } from "@/lib/data/categoryFields";
import { useLanguage } from "@/lib/context/LanguageContext";

interface Props {
  fields: FieldConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  mode?: "form" | "filter"; // form = full layout, filter = compact
}

export function DynamicFields({ fields, values, onChange, mode = "form" }: Props) {
  const { lang } = useLanguage();

  if (!fields.length) return null;

  return (
    <div className={mode === "form" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
      {fields.map(field => {
        const label = lang === "ar" ? field.label_ar : field.label;
        const value = values[field.key] ?? "";

        if (field.type === "radio") {
          return (
            <div key={field.key} className={mode === "form" ? "sm:col-span-2" : ""}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                {label}
              </label>
              <div className="flex flex-wrap gap-2">
                {field.options?.map(opt => (
                  <button key={opt} type="button" onClick={() => onChange(field.key, opt)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 transition-all ${
                      value === opt
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] text-[var(--color-text-sub)] hover:border-[var(--color-primary)]/50"
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                {label}
              </label>
              <select
                value={value}
                onChange={e => onChange(field.key, e.target.value)}
                className="input-field h-11 text-sm"
              >
                <option value="">Any</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "number") {
          return (
            <div key={field.key}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                {label}
              </label>
              <input
                type="number"
                value={value}
                onChange={e => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="input-field h-11 text-sm"
              />
            </div>
          );
        }

        // text
        return (
          <div key={field.key}>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              {label}
            </label>
            <input
              type="text"
              value={value}
              onChange={e => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="input-field h-11 text-sm"
            />
          </div>
        );
      })}
    </div>
  );
}
