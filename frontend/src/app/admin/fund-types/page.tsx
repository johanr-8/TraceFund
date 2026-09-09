"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table/Table";
import { API_URL } from "@/lib/api";

interface FundType {
  id: number;
  name: string;
  description: string;
}

export default function FundTypesPage() {
  const router = useRouter();
  const [fundTypes, setFundTypes] = useState<FundType[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }
    fetchFundTypes();
  }, [router]);

  function fetchFundTypes() {
    fetch(`${API_URL}/fund-types`)
      .then((r) => r.json())
      .then(setFundTypes)
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const res = await fetch(`${API_URL}/fund-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setMessage(`Created fund type "${data.name}"`);
      setName("");
      setDescription("");
      fetchFundTypes();
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  async function handleUpdate(id: number) {
    setSavingEdit(true);
    const res = await fetch(`${API_URL}/fund-types/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDesc }),
    });

    const data = await res.json();
    setSavingEdit(false);

    if (res.ok) {
      setEditingId(null);
      fetchFundTypes();
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  async function handleDelete(id: number, ftName: string) {
    if (!confirm(`Delete fund type "${ftName}"?`)) return;

    const res = await fetch(`${API_URL}/fund-types/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      setMessage(`Deleted "${ftName}"`);
      fetchFundTypes();
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Fund Type Management</h1>

      <Card style={{ marginBottom: "2rem" }}>
        <CardHeader>
          <CardTitle>Create Fund Type</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Food, Medicine, Education"
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }}
              />
            </div>
            <Button type="submit" fullWidth disabled={submitting} style={{ marginTop: "0.5rem" }}>
              {submitting ? "Creating..." : "Create Fund Type"}
            </Button>
          </form>
          {message && (
            <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
              background: message.startsWith("Error") ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)",
              color: message.startsWith("Error") ? "var(--accent-danger)" : "var(--accent-success)" }}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Fund Types ({fundTypes.length})</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                    No fund types created yet
                  </TableCell>
                </TableRow>
              ) : (
                fundTypes.map((ft) => (
                  <TableRow key={ft.id}>
                    <TableCell style={{ fontFamily: "var(--font-mono)" }}>#{ft.id}</TableCell>
                    <TableCell>
                      {editingId === ft.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none", fontFamily: "var(--font-family)" }}
                        />
                      ) : (
                        ft.name
                      )}
                    </TableCell>
                    <TableCell style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>
                      {editingId === ft.id ? (
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none", fontFamily: "var(--font-family)" }}
                        />
                      ) : (
                        ft.description || "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {editingId === ft.id ? (
                          <>
                            <Button onClick={() => handleUpdate(ft.id)} disabled={savingEdit} style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
                              {savingEdit ? "Saving..." : "Save"}
                            </Button>
                            <Button variant="secondary" onClick={() => setEditingId(null)} style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => { setEditingId(ft.id); setEditName(ft.name); setEditDesc(ft.description); }}
                              style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(ft.id, ft.name)}
                              style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
