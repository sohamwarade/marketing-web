"use client";

import * as React from "react";
import { Button, Input } from "@puzzlers/ui";
import { api } from "@/lib/api";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    topic: "admissions" as "admissions" | "technical" | "payments" | "other",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.submitContact(form);
      if (res.success) {
        setSuccess(res.message);
        setForm({
          name: "",
          email: "",
          phone: "",
          topic: "admissions",
          message: "",
        });
      } else {
        setError("Could not submit your message. Please check the fields and try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-800">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <Input
          required
          placeholder="e.g. Rohan Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            required
            placeholder="student@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Phone Number (Optional)
          </label>
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Topic <span className="text-red-500">*</span>
        </label>
        <select
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value as any })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="admissions">Course & Batch Admissions</option>
          <option value="technical">Technical Support & Test Engine</option>
          <option value="payments">Payments & Entitlements</option>
          <option value="other">General Inquiries</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          maxLength={2000}
          placeholder="Describe how we can assist you..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={loading} variant="default" className="w-full font-semibold">
        {loading ? "Sending..." : "Submit Message"}
      </Button>
    </form>
  );
}
