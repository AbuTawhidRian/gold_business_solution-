"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Metal, Karat } from "@prisma/client"
import { AddMetalDialog } from "./add-metal-dialog"
import { KaratList } from "./karat-list"
import { useState, Fragment } from "react"
import { ChevronDown, ChevronRight, Layers, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface MetalWithKarats extends Metal {
  karats: Karat[]
}

interface MetalsTableProps {
  metals: MetalWithKarats[]
}

export function MetalsTable({ metals }: MetalsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (metalId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(metalId)) {
      newExpanded.delete(metalId)
    } else {
      newExpanded.add(metalId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="text-amber-500" /> Metal Configuration
        </h2>
        <AddMetalDialog />
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-slate-300">Metal Name</TableHead>
              <TableHead className="text-slate-300">Code</TableHead>
              <TableHead className="text-slate-300">Karats defined</TableHead>
              <TableHead className="text-right text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metals.length === 0 && (
                 <TableRow>
                     <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                         No metals found. Add one to get started.
                     </TableCell>
                 </TableRow>
            )}
            {metals.map((metal) => (
              <Fragment key={metal.id}>
                <TableRow 
                    key={metal.id} 
                    className={cn(
                        "border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer",
                        expandedRows.has(metal.id) && "bg-slate-800/30"
                    )}
                    onClick={() => toggleRow(metal.id)}
                >
                  <TableCell>
                    {expandedRows.has(metal.id) ? (
                      <ChevronDown className="h-4 w-4 text-amber-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-200">{metal.name}</TableCell>
                  <TableCell className="text-slate-400">{metal.code}</TableCell>
                  <TableCell className="text-slate-400">{metal.karats.length}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <div onClick={(e) => e.stopPropagation()}>
                        <AddMetalDialog 
                          metalToEdit={metal} 
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500">
                                <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (confirm("Are you sure you want to delete this metal?")) {
                                fetch(`/api/masters/metals?id=${metal.id}`, { method: 'DELETE' })
                                    .then(res => {
                                        if (res.ok) {
                                            toast.success("Metal deleted")
                                            // Refresh the page
                                            window.location.reload() 
                                        } else {
                                            return res.text().then(t => toast.error(t))
                                        }
                                    })
                                    .catch(() => toast.error("Failed to delete"))
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(metal.id) && (
                  <TableRow className="bg-slate-900/30 hover:bg-slate-900/30 border-slate-800">
                    <TableCell colSpan={5} className="p-0">
                        <div className="px-10 py-4">
                            <KaratList metalId={metal.id} karats={metal.karats} />
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
