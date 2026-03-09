import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookUser,
  Building2,
  Edit2,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";

export interface InsurerContact {
  id: string;
  insurerName: string;
  claimContactName: string;
  phone: string;
  address: string;
  notes: string;
}

const STORAGE_KEY = "insurer_contacts";

function loadContacts(): InsurerContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InsurerContact[];
  } catch {
    return [];
  }
}

function saveContacts(contacts: InsurerContact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

const emptyForm = {
  insurerName: "",
  claimContactName: "",
  phone: "",
  address: "",
  notes: "",
};

type FormState = typeof emptyForm;

export default function InsurerContactsPage() {
  const [contacts, setContacts] = useState<InsurerContact[]>(loadContacts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const handleOpenEdit = (contact: InsurerContact) => {
    setEditingId(contact.id);
    setForm({
      insurerName: contact.insurerName,
      claimContactName: contact.claimContactName,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSave = () => {
    if (!form.insurerName.trim()) {
      setFormError("Insurer name is required.");
      return;
    }
    setFormError("");

    if (editingId) {
      const updated = contacts.map((c) =>
        c.id === editingId ? { ...c, ...form } : c,
      );
      setContacts(updated);
      saveContacts(updated);
    } else {
      const newContact: InsurerContact = {
        id: crypto.randomUUID(),
        ...form,
      };
      const updated = [...contacts, newContact];
      setContacts(updated);
      saveContacts(updated);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    const updated = contacts.filter((c) => c.id !== deleteConfirmId);
    setContacts(updated);
    saveContacts(updated);
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookUser className="w-6 h-6 text-primary" />
            My Insurers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save your insurer contact details here to quickly address claim
            reports.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={handleOpenAdd}
            className="gap-2 shrink-0"
            data-ocid="insurers.primary_button"
          >
            <Plus className="w-4 h-4" />
            Add Insurer
          </Button>
        )}
      </div>

      {/* Inline Add/Edit Form */}
      {showForm && (
        <Card className="border-primary/40" data-ocid="insurers.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              {editingId ? "Edit Insurer" : "Add New Insurer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="insurerName">
                Insurer Name{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="insurerName"
                placeholder="e.g. Admiral Insurance"
                value={form.insurerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, insurerName: e.target.value }))
                }
                data-ocid="insurers.input"
                aria-required="true"
                aria-describedby={formError ? "insurer-name-error" : undefined}
              />
              {formError && (
                <p
                  id="insurer-name-error"
                  className="text-xs text-destructive"
                  data-ocid="insurers.error_state"
                >
                  {formError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="claimContactName">Claim Contact Name</Label>
              <Input
                id="claimContactName"
                placeholder="e.g. Claims Department"
                value={form.claimContactName}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    claimContactName: e.target.value,
                  }))
                }
                data-ocid="insurers.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0800 600 6060"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                data-ocid="insurers.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="e.g. Claims Dept, PO Box 123, London, EC1A 1BB"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                data-ocid="insurers.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Policy number, claim reference, or any additional notes…"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                data-ocid="insurers.textarea"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="gap-2"
                data-ocid="insurers.save_button"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-2"
                data-ocid="insurers.cancel_button"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact List */}
      {contacts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-lg border border-dashed border-border"
          data-ocid="insurers.empty_state"
        >
          <BookUser className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            No insurers saved yet
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Add your insurer's contact details to quickly address claim reports
            without searching each time.
          </p>
          {!showForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenAdd}
              className="gap-2 mt-2"
              data-ocid="insurers.secondary_button"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Your First Insurer
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3" data-ocid="insurers.list">
          {contacts.map((contact, idx) => (
            <Card key={contact.id} data-ocid={`insurers.item.${idx + 1}`}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h3 className="font-semibold text-sm flex items-center gap-1.5 truncate">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      {contact.insurerName}
                    </h3>

                    {contact.claimContactName && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <User className="w-3 h-3 shrink-0" />
                        {contact.claimContactName}
                      </p>
                    )}

                    {contact.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        {contact.phone}
                      </p>
                    )}

                    {contact.address && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.address}
                      </p>
                    )}

                    {contact.notes && (
                      <p className="text-xs text-muted-foreground/70 italic line-clamp-2">
                        {contact.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpenEdit(contact)}
                      aria-label={`Edit ${contact.insurerName}`}
                      data-ocid={`insurers.edit_button.${idx + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRequest(contact.id)}
                      aria-label={`Delete ${contact.insurerName}`}
                      data-ocid={`insurers.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Inline delete confirmation */}
                {deleteConfirmId === contact.id && (
                  <div
                    className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2"
                    role="alert"
                  >
                    <span className="text-xs text-destructive flex-1">
                      Delete &ldquo;{contact.insurerName}&rdquo;? This cannot be
                      undone.
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleDeleteConfirm}
                      data-ocid={`insurers.confirm_button.${idx + 1}`}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleDeleteCancel}
                      data-ocid={`insurers.cancel_button.${idx + 1}`}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
