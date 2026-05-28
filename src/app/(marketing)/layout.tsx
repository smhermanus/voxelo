import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#050816]">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050816]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Voxelo" width={28} height={28} className="rounded-sm" />
            <span className="font-semibold text-lg tracking-tighter text-white">Voxelo</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/faq" className="text-sm text-slate-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 bg-[#07091c] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Voxelo. AI Receptionist for South African businesses.</span>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
            <Link href="mailto:info@voxelo.co.za" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link href="/sign-in" className="hover:text-slate-300 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
