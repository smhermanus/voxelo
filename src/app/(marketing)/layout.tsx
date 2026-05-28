import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/app/(marketing)/components/theme-toggle";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#050816]">
        <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/8 bg-white/90 dark:bg-[#050816]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Voxelo" width={28} height={28} className="rounded-sm" />
              <span className="font-semibold text-lg tracking-tighter text-slate-900 dark:text-white">Voxelo</span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-5">
              <Link href="/faq" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                FAQ
              </Link>
              <ThemeToggle />
              <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#07091c] py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
            <span>© {new Date().getFullYear()} Voxelo. AI Receptionist for South African businesses.</span>
            <div className="flex items-center gap-4">
              <Link href="/faq" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">FAQ</Link>
              <Link href="mailto:info@voxelo.co.za" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Contact</Link>
              <Link href="/sign-in" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Sign in</Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
