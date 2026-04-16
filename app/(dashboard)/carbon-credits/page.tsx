"use client";

import { useState } from "react";
import { Leaf, TrendingUp, TrendingDown, ArrowRightLeft, Clock, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const myCredits = { available: 1_240, locked: 380, totalEarned: 4_820 };

const listings = [
  { id: "CCT-001", seller: "GreenForge AG", credits: 500, price: 14.20, type: "Renewable Energy", verified: true, expires: "30 Jun 2025" },
  { id: "CCT-002", seller: "EcoPlant GmbH", credits: 200, price: 13.85, type: "Reforestation", verified: true, expires: "15 May 2025" },
  { id: "CCT-003", seller: "CleanSky Ltd", credits: 1000, price: 15.00, type: "Carbon Capture", verified: false, expires: "1 Aug 2025" },
  { id: "CCT-004", seller: "SolarEdge Corp", credits: 350, price: 12.60, type: "Solar Offset", verified: true, expires: "20 Jul 2025" },
];

const transactions = [
  { id: "TXN-0091", type: "Sold", counterparty: "ManuCorp", credits: 200, value: 2_840, date: "Apr 14, 2025", status: "Settled" },
  { id: "TXN-0090", type: "Bought", counterparty: "GreenForge AG", credits: 500, value: 7_100, date: "Apr 10, 2025", status: "Settled" },
  { id: "TXN-0089", type: "Sold", counterparty: "BioTech Verlag", credits: 100, value: 1_385, date: "Apr 3, 2025", status: "Pending" },
  { id: "TXN-0088", type: "Earned", counterparty: "SAP EHS Platform", credits: 320, value: 0, date: "Apr 1, 2025", status: "Credited" },
];

const txnStyle: Record<string, string> = {
  Sold: "text-red-600",
  Bought: "text-blue-600",
  Earned: "text-emerald-600",
};

const statusStyle: Record<string, string> = {
  Settled: "bg-emerald-100 text-emerald-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Credited: "bg-blue-100 text-blue-700",
};

export default function CarbonCreditsPage() {
  const [showOffer, setShowOffer] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Portfolio summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available Credits", value: myCredits.available.toLocaleString(), sub: "Ready to trade", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Locked in Offers", value: myCredits.locked.toLocaleString(), sub: "Pending settlement", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Total Earned (YTD)", value: myCredits.totalEarned.toLocaleString(), sub: "From EHS programs", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Market Price", value: "€14.20", sub: "+2.3% today", color: "text-violet-600", bg: "bg-violet-50" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${s.bg} mb-3`}>
                <Leaf className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-400">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketplace listings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-green-500" /> P2P Listings
              </CardTitle>
              <Button size="sm" onClick={() => setShowOffer(!showOffer)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-3 w-3 mr-1" /> Post Offer
              </Button>
            </div>
            <CardDescription className="text-xs">Live peer-to-peer carbon credit offers</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {showOffer && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs font-semibold text-emerald-700 mb-2">New Offer</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input className="text-xs border border-emerald-200 rounded px-2 py-1 bg-white" placeholder="Credits (qty)" />
                  <input className="text-xs border border-emerald-200 rounded px-2 py-1 bg-white" placeholder="Price per credit (€)" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">List Credits</Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowOffer(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {listings.map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-slate-700">{l.seller}</p>
                      {l.verified && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400">{l.type} · Expires {l.expires}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">€{l.price.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">{l.credits.toLocaleString()} credits</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs flex-shrink-0">Buy</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction history */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "Sold" ? "bg-red-50" : tx.type === "Bought" ? "bg-blue-50" : "bg-emerald-50"}`}>
                    {tx.type === "Sold" ? <TrendingDown className={`h-3.5 w-3.5 ${txnStyle[tx.type]}`} /> : <TrendingUp className={`h-3.5 w-3.5 ${txnStyle[tx.type]}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700">{tx.type} to {tx.counterparty}</p>
                    <p className="text-[10px] text-slate-400">{tx.id} · {tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-semibold ${txnStyle[tx.type]}`}>{tx.type === "Sold" ? "-" : "+"}{tx.credits} cr.</p>
                    {tx.value > 0 && <p className="text-[10px] text-slate-400">€{tx.value.toLocaleString()}</p>}
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${statusStyle[tx.status]}`}>{tx.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
