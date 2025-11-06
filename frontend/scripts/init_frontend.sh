#!/usr/bin/env bash
set -e

# If no package.json, create Vite React TS app
if [ ! -f "package.json" ]; then
  npm create vite@latest . -- --template react-ts
fi

npm install
npm install react-router-dom axios

# Create src scaffold
mkdir -p src/pages src/components src/services src/context
cat > src/services/api.ts <<'TS'
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers||{}) },
    ...options
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
TS

cat > src/pages/Home.tsx <<'TSX'
export default function Home(){
  return <div className="p-6"><h1 className="text-2xl font-bold">Movie Booking</h1></div>;
}
TSX

cat > src/pages/Catalog.tsx <<'TSX'
import { useEffect, useState } from "react";
import { api } from "../services/api";
type Movie = { id:number; title:string; synopsis?:string };
export default function Catalog(){
  const [items,setItems] = useState<Movie[]>([]);
  useEffect(()=>{ api<Movie[]>("/api/movies/").then(setItems).catch(console.error); },[]);
  return <div className="p-6">
    <h2 className="text-xl font-semibold">Now Showing</h2>
    <ul>{items.map(m=><li key={m.id}>{m.title}</li>)}</ul>
  </div>;
}
TSX

cat > src/pages/AdminDashboard.tsx <<'TSX'
export default function AdminDashboard(){
  return <div className="p-6"><h2 className="text-xl font-semibold">Admin Dashboard</h2></div>;
}
TSX
