"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/admin/login');
      }
    };
    checkLogin();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-700 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 elegant-card border-0 shadow-elegant-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-elegant">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-midnight-800">Admin Login</CardTitle>
            <CardDescription className="text-midnight-600">
              Masuk ke dashboard administrator EtalaseKita
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {message && (
              <Alert className="border-red-200 bg-red-50">
                <Lock className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-midnight-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan username"
                className="border-midnight-200 focus:border-gold-500 focus:ring-gold-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-midnight-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="border-midnight-200 focus:border-gold-500 focus:ring-gold-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-midnight-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-midnight-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-3 shadow-elegant"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-midnight-50 rounded-lg">
            <p className="text-xs text-midnight-600 text-center">
              <strong>Demo Credentials:</strong>
              <br />
              Username: admin
              <br />
              Password: etalasekita2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
