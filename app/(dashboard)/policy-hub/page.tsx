"use client";

import { useState } from "react";
import { FileText, Upload, Search, FolderOpen, Clock, Tag, ChevronRight, File, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "All Documents", count: 48, active: true },
  { label: "Safety Policies", count: 12 },
  { label: "Compliance", count: 9 },
  { label: "Procedures", count: 15 },
  { label: "Training Materials", count: 8 },
  { label: "Forms & Templates", count: 4 },
];

const documents = [
  { name: "Chemical Safety Policy v3.2", category: "Safety Policies", updated: "2 days ago", size: "1.4 MB", format: "PDF", status: "Active" },
  { name: "Emergency Response Procedure", category: "Procedures", updated: "1 week ago", size: "840 KB", format: "DOCX", status: "Active" },
  { name: "ISO 45001 Compliance Checklist", category: "Compliance", updated: "3 weeks ago", size: "320 KB", format: "XLSX", status: "Review" },
  { name: "PPE Usage Guidelines", category: "Safety Policies", updated: "1 month ago", size: "2.1 MB", format: "PDF", status: "Active" },
  { name: "Hazardous Waste Disposal SOP", category: "Procedures", updated: "2 months ago", size: "650 KB", format: "PDF", status: "Active" },
  { name: "New Employee Safety Onboarding", category: "Training Materials", updated: "3 months ago", size: "5.2 MB", format: "PPTX", status: "Active" },
];

const ragResults = [
  { question: "What is the chemical spill response procedure?", excerpt: "In the event of a chemical spill, evacuate the area immediately and alert the EHS team via the emergency line…", doc: "Emergency Response Procedure" },
  { question: "PPE requirements for Lab 3?", excerpt: "All personnel entering Lab 3 must wear Level B protective equipment including chemical-resistant gloves…", doc: "PPE Usage Guidelines" },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Review: "bg-yellow-100 text-yellow-700",
};

export default function PolicyHubPage() {
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [searched, setSearched] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* RAG Search */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" /> Ask Your Policy Documents
          </CardTitle>
          <CardDescription className="text-xs">RAG-powered search across all uploaded documents</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full pl-9 pr-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. What is the chemical spill response procedure?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
              />
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSearched(true)}>
              Search
            </Button>
          </div>

          {searched && (
            <div className="mt-4 space-y-3">
              {ragResults.map((r, i) => (
                <div key={i} className="bg-white rounded-lg border border-blue-100 p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">{r.question}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.excerpt}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <File className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">Source: {r.doc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-0.5">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors ${cat.active ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5 opacity-60" />
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400">{cat.count}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Documents list */}
        <div className="lg:col-span-3 space-y-4">
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
          >
            <Upload className="h-6 w-6 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-600">Drag & drop documents here</p>
            <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, XLSX, PPTX up to 50 MB</p>
            <Button size="sm" variant="outline" className="mt-3 text-xs">Browse Files</Button>
          </div>

          {/* Document list */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700">All Documents</CardTitle>
                <span className="text-xs text-slate-400">48 files</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded px-2 -mx-2 transition-colors cursor-pointer group">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Tag className="h-2.5 w-2.5 text-slate-400" />
                        <span className="text-[10px] text-slate-400">{doc.category}</span>
                        <Clock className="h-2.5 w-2.5 text-slate-400" />
                        <span className="text-[10px] text-slate-400">{doc.updated}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-400">{doc.size}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{doc.format}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusColor[doc.status]}`}>{doc.status}</span>
                      <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
