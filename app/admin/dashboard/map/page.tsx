"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search, Edit, Save } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Map from "@/components/map";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function MapManagement() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [smes, setSmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [editingSME, setEditingSME] = useState<any | null>(null);
  const [draftLat, setDraftLat] = useState<string>("");
  const [draftLng, setDraftLng] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      await fetchSMEs();
      setAuthLoading(false);
    })();
  }, [router]);

  async function fetchSMEs() {
    setLoading(true);
    const res = await fetch("/api/smes");
    const data = await res.json();
    setSmes(data);
    setLoading(false);
  }

  const startEdit = (sme: any) => {
    setEditingSME(sme);
    setDraftLat(String(sme.latitude));
    setDraftLng(String(sme.longitude));
  };

  const saveEdit = async () => {
    if (!editingSME) return;
    const res = await fetch(`/api/smes/${editingSME.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: parseFloat(draftLat),
        longitude: parseFloat(draftLng),
      }),
    });
    if (res.ok) {
      await fetchSMEs();
      setEditingSME(null);
    } else {
      alert("Gagal menyimpan lokasi");
    }
  };

  const filtered = smes.filter((s) => {
    const name = s.name?.toLowerCase() || "";
    const city = s.city?.toLowerCase() || "";
    const province = s.province?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) || city.includes(query) || province.includes(query)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="animate-pulse text-gray-500">Memuat data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Manajemen Peta</h1>
            <p className="text-sm text-gray-600">Kelola lokasi UMKM</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Pencarian Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  className="pl-10 w-full h-10"
                  placeholder="Cari nama, kota, atau provinsi…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap sm:self-center self-end">
                {filtered.length} lokasi ditemukan
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Map & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <Card className="lg:col-span-2 h-[600px]">
            <CardHeader>
              <CardTitle>Peta UMKM</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-hidden relative z-0 rounded-b-xl">
              <Map smes={filtered} selectedSME={null} setSelectedSME={() => {}} />
            </CardContent>
          </Card>

          {/* List */}
          <Card className="h-[670px] flex flex-col">
            <CardHeader>
              <CardTitle>Daftar Lokasi</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-2">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {s.city}, {s.province}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(s)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal Edit Lokasi */}
      <Dialog open={!!editingSME} onOpenChange={() => setEditingSME(null)}>
        <DialogContent className="max-w-md w-full sm:rounded-lg z-[50] bg-white shadow-lg border">
          <DialogHeader>
            <DialogTitle>Edit Lokasi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Latitude"
              value={draftLat}
              onChange={(e) => setDraftLat(e.target.value)}
            />
            <Input
              placeholder="Longitude"
              value={draftLng}
              onChange={(e) => setDraftLng(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Batal</Button>
            </DialogClose>
            <Button onClick={saveEdit} className="bg-purple-600 text-white">
              <Save className="h-4 w-4 mr-2" /> Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
