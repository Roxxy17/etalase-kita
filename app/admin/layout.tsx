// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      {children}
    </div>
  )
}
