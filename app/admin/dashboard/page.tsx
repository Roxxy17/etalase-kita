"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  MapPin,
  Plus,
  TrendingUp,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [smes, setSmes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkSession();
    fetchProducts();
    fetchSMEs();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }); // ambil data terbaru
    if (data) setProducts(data);
  };

  const fetchSMEs = async () => {
    const { data } = await supabase
      .from("smes")
      .select("*")
      .order("created_at", { ascending: false }); // ambil data terbaru
    if (data) setSmes(data);
  };

  const checkSession = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      router.push("/admin/login");
    } else {
      setAdminUser(sessionData.session.user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading)
    return (
      <p className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-3 shadow-elegant text-center">
        Loading...
      </p>
    );

  const stats = [
    {
      title: "Total Produk",
      value: products.length,
      description: "Produk terdaftar",
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      href: "/admin/dashboard/products",
    },
    {
      title: "Total UMKM",
      value: smes.length,
      description: "UMKM terdaftar",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      href: "/admin/dashboard/smes",
    },
    {
      title: "Produk Unggulan",
      value: products.filter((p) => p.featured).length,
      description: "Produk featured",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-gold-500 to-gold-600",
      href: "/admin/dashboard/products/top",
    },
    {
      title: "Lokasi Peta",
      value: smes.length,
      description: "Titik di peta",
      icon: <MapPin className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      href: "/admin/dashboard/map",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">EtalaseKita Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {adminUser && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {adminUser.email}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat datang, {adminUser?.email}!
          </h2>
          <p className="text-gray-600">
            Kelola data produk, UMKM, dan peta EtalaseKita dari dashboard ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terbaru</CardTitle>
              <CardDescription>5 produk yang baru ditambahkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                    {product.featured && (
                      <Badge className="bg-gold-100 text-gold-800">
                        Unggulan
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UMKM Terbaru</CardTitle>
              <CardDescription>5 UMKM yang baru bergabung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smes.slice(0, 5).map((sme) => (
                  <div
                    key={sme.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{sme.name}</p>
                      <p className="text-sm text-gray-500">
                        {sme.city}, {sme.province}
                      </p>
                    </div>
                    {sme.featured && (
                      <Badge className="bg-green-100 text-green-800">
                        Unggulan
                      </Badge>
                    )}
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
