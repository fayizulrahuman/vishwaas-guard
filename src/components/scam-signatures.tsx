
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const SIGNATURES = [
  {
    id: 1,
    title: "AI Voice Mimicry",
    category: "Financial Scam",
    description: "Fraudsters mimicking bank officials' voices to request OTPs.",
    frequency: "High",
    lastReported: "2 hours ago",
    tags: ["Voice", "OTP", "Bank"]
  },
  {
    id: 2,
    title: "The 'Grandchild' Deepfake",
    category: "Emotional Fraud",
    description: "Deepfake video of family members in emergency situations requesting immediate funds.",
    frequency: "Medium",
    lastReported: "1 day ago",
    tags: ["Video", "Emergency", "Social"]
  },
  {
    id: 3,
    title: "CEO Direct Request",
    category: "Corporate Scam",
    description: "AI synthesized voice of company executives ordering urgent wire transfers.",
    frequency: "Low",
    lastReported: "3 days ago",
    tags: ["Corporate", "Wire", "Voice"]
  },
  {
    id: 4,
    title: "Synthetic Identity Fraud",
    category: "Financial Scam",
    description: "Using AI to generate high-quality fake identity documents and selfies.",
    frequency: "High",
    lastReported: "5 hours ago",
    tags: ["Identity", "AI", "Documents"]
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
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
          <AlertTriangle className="text-accent" />
          Live Scam Signatures
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search threats..." 
            className="pl-9 bg-white rounded-xl" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {filteredSignatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignatures.map((sig) => (
            <Card key={sig.id} className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1 border-primary/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                    {sig.category}
                  </Badge>
                  <Badge className={sig.frequency === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-accent/10 text-accent border-accent/20'} variant="outline">
                    {sig.frequency} Risk
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{sig.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {sig.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sig.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground uppercase tracking-wider font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {sig.lastReported}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Global
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground font-medium">
          No signatures found matching your search.
        </div>
      )}
    </section>
  )
}
