"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StatusBadge } from "@/components/ui/Table/Table";
import { API_URL } from "@/lib/api";

interface VendorProfile {
  id: number;
  user_id: number;
  business_name: string;
  category: string;
  approval_status: string;
  user_email?: string;
}

export default function VendorSettings() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);

    fetch(`${API_URL}/vendors?user_id=${user.id}`)
      .then((r) => r.json())
      .then((vendors: VendorProfile[]) => {
        if (vendors.length === 0) {
          setVendor(null);
          return;
        }
        const v = vendors[0];
        setVendor({ ...v, user_email: user.email });
        const saved = localStorage.getItem(`vendor_email_${v.id}`);
        setEmail(saved || user.email || "");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    // There is no backend endpoint to update vendor contact info, so we persist
    // the contact email locally. Business name / category are enforced on the
    // backend at registration time.
    if (vendor) {
      localStorage.setItem(`vendor_email_${vendor.id}`, email);
    }
    setTimeout(() => setStatus("success"), 400);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  if (!vendor) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "3rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: 600 }}>Vendor Registration & Settings</h1>
        <Card>
          <CardContent>
            <p style={{ color: "var(--text-secondary)", padding: "1.5rem" }}>
              You haven&apos;t registered as a vendor yet.{" "}
              <a href="/vendor/register" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
                Register now
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Vendor Registration & Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <StatusBadge status={vendor.approval_status} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {vendor.approval_status === "approved"
                ? "Approved to accept restricted tokens."
                : vendor.approval_status === "pending"
                ? "Pending government approval."
                : "Registration rejected."}
            </span>
          </div>

          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Input label="Business Name" defaultValue={vendor.business_name} disabled />
            <Input label="Registered Category" defaultValue={vendor.category} disabled />
            <Input label="Wallet Address" value="Not configured (on-chain layer disabled)" disabled />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                Contact Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-family)",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                Business name and category are enforced on the backend and cannot be changed here.
              </span>
            </div>

            <Button type="submit" disabled={status === "processing"}>
              {status === "processing" ? "Saving..." : "Update Settings"}
            </Button>
          </form>

          {status === "success" && (
            <div style={{ marginTop: "1rem", color: "var(--accent-success)", fontSize: "0.875rem" }}>
              Settings updated successfully.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
