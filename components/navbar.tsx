'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Play, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                            <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-cyan-400 transition-colors">
                            AnimeKompi
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="/" className="hover:text-blue-400 transition-colors">
                            Home
                        </Link>
                        <Link href="/schedule" className="hover:text-blue-400 transition-colors">
                            Jadwal
                        </Link>
                        <Link href="/batch" className="hover:text-blue-400 transition-colors">
                            Batch
                        </Link>
                    </nav>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <Input
                            type="text"
                            placeholder="Cari anime..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/20 border-white/10 rounded-full py-1.5 px-4 pl-10 text-sm focus:border-blue-500 text-white w-48 transition-all focus:w-64 placeholder-gray-500"
                        />
                        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
                    </form>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="text"
                                placeholder="Cari anime..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/20 border-white/10 rounded-full py-1.5 px-4 pl-10 text-sm focus:border-blue-500 text-white w-full placeholder-gray-500"
                            />
                            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
                        </form>

                        {/* Mobile Nav Links */}
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="hover:text-blue-400 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/schedule"
                                className="hover:text-blue-400 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Jadwal
                            </Link>
                            <Link
                                href="/batch"
                                className="hover:text-blue-400 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Batch
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
