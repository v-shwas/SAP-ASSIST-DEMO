"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Loader2, Database, Eye, EyeOff } from "lucide-react";

interface SapConfig {
  sapUrl: string;
  sapUsername: string;
  sapPassword: string;
  sapClient: string;
  connType: "odata" | "rfc";
}

type TestStatus = "idle" | "testing" | "success" | "error";

export function SapConnectionForm() {
  const [config, setConfig] = useState<SapConfig>({
    sapUrl: "",
    sapUsername: "",
    sapPassword: "",
    sapClient: "100",
    connType: "odata",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SapConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const testConnection = async () => {
    setTestStatus("testing");
    setTestMessage("");
    try {
      const res = await fetch("/api/settings/test-sap-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.connected) {
        setTestStatus("success");
        setTestMessage("Connection successful!");
      } else {
        setTestStatus("error");
        setTestMessage(data.error ?? "Connection failed");
      }
    } catch {
      setTestStatus("error");
      setTestMessage("Network error — could not reach connector");
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/sap-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-5 w-5 text-blue-600" />
        <div>
          <h2 className="font-medium text-slate-900">SAP Connection</h2>
          <p className="text-xs text-slate-500">
            Configure your SAP system connection details.
          </p>
        </div>
      </div>

      <Tabs value={config.connType} onValueChange={(v) => handleChange("connType", v)}>
        <TabsList>
          <TabsTrigger value="odata">OData (S/4HANA)</TabsTrigger>
          <TabsTrigger value="rfc">RFC/BAPI (ECC)</TabsTrigger>
        </TabsList>

        <TabsContent value="odata" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SAP System URL</label>
            <Input
              placeholder="https://my-s4hana.example.com:443"
              value={config.sapUrl}
              onChange={(e) => handleChange("sapUrl", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <Input
                placeholder="SAPUSER"
                value={config.sapUsername}
                onChange={(e) => handleChange("sapUsername", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Client</label>
              <Input
                placeholder="100"
                value={config.sapClient}
                onChange={(e) => handleChange("sapClient", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={config.sapPassword}
                onChange={(e) => handleChange("sapPassword", e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rfc" className="pt-4">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            RFC/BAPI mode requires <strong>pyrfc</strong> and the SAP NetWeaver RFC SDK
            installed in the connector service. OData is recommended for S/4HANA.
          </div>
        </TabsContent>
      </Tabs>

      {/* Test result */}
      {testStatus !== "idle" && (
        <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
          testStatus === "success" ? "bg-green-50 text-green-700" :
          testStatus === "error" ? "bg-red-50 text-red-700" :
          "bg-slate-50 text-slate-600"
        }`}>
          {testStatus === "testing" && <Loader2 className="h-4 w-4 animate-spin" />}
          {testStatus === "success" && <CheckCircle className="h-4 w-4" />}
          {testStatus === "error" && <XCircle className="h-4 w-4" />}
          {testStatus === "testing" ? "Testing connection…" : testMessage}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" onClick={testConnection} disabled={testStatus === "testing" || !config.sapUrl}>
          {testStatus === "testing" ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing…</>
          ) : "Test Connection"}
        </Button>
        <Button onClick={saveConfig} disabled={saving || !config.sapUrl}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : "Save"}
        </Button>
        {saved && (
          <Badge variant="secondary" className="text-green-700 bg-green-50">
            Saved
          </Badge>
        )}
      </div>
    </Card>
  );
}
