"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, MapPin, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SIGNATURES = [
  {
    id: 1,
    title: "AI Voice Mimicry",
    category: "Financial Scam",
    description: "Fraudsters mimicking bank officials' voices to request OTPs or urgent transfers.",
    frequency: "High",
    lastReported: "2 hours ago",
    tags: ["Voice", "Bank"]
  },
  {
    id: 2,
    title: "The 'Grandchild' Deepfake",
    category: "Emotional Fraud",
    description: "Deepfake video of family members in emergency situations requesting immediate funds via crypto.",
    frequency: "Medium",
    lastReported: "1 day ago",
    tags: ["Video", "Emergency"]
  },
  {
    id: 3,
    title: "CEO Direct Request",
    category: "Corporate Scam",
    description: "AI synthesized voice of company executives ordering urgent wire transfers to off-shore accounts.",
    frequency: "Low",
    lastReported: "3 days ago",
    tags: ["Corporate", "Voice"]
  },
  {
    id: 4,
    title: "Synthetic Identity Fraud",
    category: "Financial Scam",
    description: "Using AI to generate high-quality fake identity documents and selfies for verification bypass.",
    frequency: "High",
    lastReported: "5 hours ago",
    tags: ["Identity", "AI"]
  }
]

export function ScamSignatures() {
  const [search, setSearch] = useState("")

  const filteredSignatures = useMemo(() => {
    return SIGNATURES.filter(sig => 
      sig.title.toLowerCase().includes(search.toLowerCase()) ||
      sig.description.toLowerCase().includes(search.toLowerCase()) ||
      sig.category.toLowerCase().includes(search.toLowerCase()) ||
      sig.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    )
  }, [search])

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black font-headline flex items-center gap-3 tracking-tight">
            <AlertTriangle className="text-primary h-7 w-7 md:h-8 md:w-8" />
            Live Scam Signatures
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Real-time database of detected biometric threats.</p>
        </div>
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search signatures..." 
            className="pl-10 h-11 md:h-12 bg-white rounded-2xl border-border/60 focus:ring-primary/20 shadow-sm" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {filteredSignatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {filteredSignatures.map((sig) => (
            <Card key={sig.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/40 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-6 md:p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border-none">
                    {sig.category}
                  </Badge>
                  <Badge className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${sig.frequency === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} border-none`} variant="outline">
                    {sig.frequency} Risk
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">{sig.title}</CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed mt-2 text-slate-500">
                  {sig.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 pt-0">
                <div className="flex flex-wrap gap-2 mb-6">
                  {sig.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 uppercase tracking-widest font-black">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-5 border-t border-slate-50 uppercase font-black tracking-[0.1em]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {sig.lastReported}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    Global Intelligence
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50/50 py-16 text-center rounded-[2rem]">
          <CardContent>
            <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No signatures found matching your search.</p>
            <Button variant="link" onClick={() => setSearch("")} className="mt-2 text-primary">Clear all filters</Button>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-center pt-4">
        <Button variant="outline" className="rounded-2xl px-8 h-12 border-border/60 hover:bg-slate-50 font-bold gap-2">
          View All Signatures
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
