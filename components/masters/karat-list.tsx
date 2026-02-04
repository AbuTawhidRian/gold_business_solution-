"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Pencil, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Karat } from "@prisma/client"

interface KaratListProps {
  metalId: string
  karats: Karat[]
}

export function KaratList({ metalId, karats }: KaratListProps) {
  const [newKaratName, setNewKaratName] = useState("")
  const [newKaratPurity, setNewKaratPurity] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPurity, setEditPurity] = useState("")

  const router = useRouter()

  async function handleAddKarat() {
    // ... same implementation
  }

  const startEditing = (karat: Karat) => {
    setEditingId(karat.id)
    setEditName(karat.name)
    setEditPurity(karat.purity.toString())
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName("")
    setEditPurity("")
  }

  async function handleUpdateKarat(id: string) {
    if (!editName || !editPurity) return
    setLoading(true)
    try {
        const res = await fetch("/api/masters/karats", {
            method: "PATCH",
            body: JSON.stringify({ id, name: editName, purity: editPurity }),
        })
        if (!res.ok) throw new Error("Failed")
        toast.success("Karat updated")
        setEditingId(null)
        router.refresh()
    } catch (e) {
        toast.error("Failed to update")
    } finally {
        setLoading(false)
    }
  }

  async function handleDeleteKarat(id: string) {
    if (!confirm("Delete this karat definition?")) return
    setLoading(true)
    try {
        const res = await fetch(`/api/masters/karats?id=${id}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Failed")
        toast.success("Karat deleted")
        router.refresh()
    } catch (e) {
        toast.error("Failed to delete")
    } finally {
        setLoading(false)
    }
  }


  return (
    <div className="p-4 bg-slate-800/50 rounded-md border border-slate-700 mt-2">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">Managed Karats / Purities</h4>
      
      <div className="space-y-2 mb-4">
        {karats.length === 0 && <p className="text-sm text-slate-500 italic">No karats defined yet.</p>}
        {karats.map((karat) => (
          <div key={karat.id} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
            {editingId === karat.id ? (
                <div className="flex items-center gap-2 flex-1">
                    <Input 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="h-7 w-20 bg-slate-800 border-slate-600" 
                    />
                    <Input 
                        value={editPurity} 
                        onChange={e => setEditPurity(e.target.value)} 
                        className="h-7 w-20 bg-slate-800 border-slate-600" 
                    />
                    <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500 hover:text-green-400" onClick={() => handleUpdateKarat(karat.id)}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-4">
                    <span className="text-slate-200 font-medium w-16">{karat.name}</span>
                    <span className="text-amber-500 text-sm">{karat.purity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-amber-500" onClick={() => startEditing(karat)}>
                        <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-500" onClick={() => handleDeleteKarat(karat.id)}>
                        <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input 
          placeholder="Name (e.g. 24K)" 
          value={newKaratName} 
          onChange={(e) => setNewKaratName(e.target.value)}
          className="h-8 bg-slate-900 border-slate-700 text-slate-100"
        />
        <Input 
          placeholder="Purity (e.g. 0.999)" 
          type="number"
          step="0.001"
          value={newKaratPurity} 
          onChange={(e) => setNewKaratPurity(e.target.value)}
          className="h-8 bg-slate-900 border-slate-700 text-slate-100"
        />
        <Button 
            size="sm" 
            onClick={handleAddKarat} 
            disabled={loading || !newKaratName || !newKaratPurity}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
