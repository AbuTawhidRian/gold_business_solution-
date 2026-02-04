"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddMetalDialogProps {
  metalToEdit?: { id: string; name: string; code: string }
  trigger?: React.ReactNode
}

export function AddMetalDialog({ metalToEdit, trigger }: AddMetalDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name"),
      code: formData.get("code"),
      id: metalToEdit?.id // Include ID for updates
    }

    try {
      const method = metalToEdit ? "PATCH" : "POST"
      const res = await fetch("/api/masters/metals", {
        method,
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error(metalToEdit ? "Failed to update metal" : "Failed to create metal")

      toast.success(metalToEdit ? "Metal updated successfully" : "Metal created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
            <Plus className="mr-2 h-4 w-4" /> Add Metal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-slate-100">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-amber-500">{metalToEdit ? "Edit Metal" : "Add New Metal"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {metalToEdit ? "Update the metal details below." : "Create a new metal type (e.g., Gold, Silver) to track in your inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={metalToEdit?.name}
                placeholder="Gold"
                className="col-span-3 bg-slate-800 border-slate-600 text-slate-100"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right text-slate-300">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                defaultValue={metalToEdit?.code}
                placeholder="AU"
                className="col-span-3 bg-slate-800 border-slate-600 text-slate-100"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              {loading ? "Saving..." : (metalToEdit ? "Update Metal" : "Save Metal")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
