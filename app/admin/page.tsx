'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SeoSettings {
    siteName: string;
    siteDescription: string;
    googleVerification: string;
    bingVerification: string;
    yandexVerification: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
    twitterHandle: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [settings, setSettings] = useState<SeoSettings>({
        siteName: '',
        siteDescription: '',
        googleVerification: '',
        bingVerification: '',
        yandexVerification: '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        metaDescription: '',
        metaKeywords: '',
        ogImage: '',
        twitterHandle: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const loggedIn = localStorage.getItem('admin_logged_in');
        const storedUsername = localStorage.getItem('admin_username');

        if (!loggedIn) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
            setUsername(storedUsername || '');
            fetchSettings();
        }
    }, [router]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/seo');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setMessage('✅ Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ Failed to save settings');
            }
        } catch (error) {
            setMessage('❌ Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('❌ New passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            if (res.ok) {
                setMessage('✅ Password changed successfully!');
                setShowPasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setMessage(''), 3000);
            } else {
                const data = await res.json();
                setMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setMessage('❌ Failed to change password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
        router.push('/admin/login');
    };

    const handleChange = (field: keyof SeoSettings, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    if (!isAuthenticated || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-64 mb-8"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                    >
                        Change Password
                    </Button>
                    <Button onClick={handleLogout} variant="secondary">
                        Logout
                    </Button>
                </div>
            </div>

            {message && (
                <div className="mb-6 p-4 bg-slate-800 rounded-lg text-white">
                    {message}
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md bg-slate-900 p-6 border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    Change Password
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Site Information */}
                <Card className="bg-slate-900 p-6 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Site Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                placeholder="AnimeKompi"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Site Description (Tagline)
                            </label>
                            <input
                                type="text"
                                value={settings.siteDescription}
                                onChange={(e) => handleChange('siteDescription', e.target.value)}
                                placeholder="Nonton Anime Subtitle Indonesia"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Search Console Verifications */}
                <Card className="bg-slate-900 p-6 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Search Engine Verifications</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Google Search Console Verification Code
                            </label>
                            <input
                                type="text"
                                value={settings.googleVerification}
                                onChange={(e) => handleChange('googleVerification', e.target.value)}
                                placeholder="google1234567890abcdef"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Paste only the verification code (without meta tag)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Bing Webmaster Verification Code
                            </label>
                            <input
                                type="text"
                                value={settings.bingVerification}
                                onChange={(e) => handleChange('bingVerification', e.target.value)}
                                placeholder="1234567890ABCDEF"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Yandex Webmaster Verification Code
                            </label>
                            <input
                                type="text"
                                value={settings.yandexVerification}
                                onChange={(e) => handleChange('yandexVerification', e.target.value)}
                                placeholder="yandex_verification_code"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Analytics & Tracking */}
                <Card className="bg-slate-900 p-6 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Analytics & Tracking</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Google Analytics ID
                            </label>
                            <input
                                type="text"
                                value={settings.googleAnalyticsId}
                                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Facebook Pixel ID
                            </label>
                            <input
                                type="text"
                                value={settings.facebookPixelId}
                                onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                                placeholder="123456789012345"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Meta Tags */}
                <Card className="bg-slate-900 p-6 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Meta Tags</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                value={settings.metaDescription}
                                onChange={(e) => handleChange('metaDescription', e.target.value)}
                                rows={3}
                                placeholder="Site description for search engines"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Keywords (comma separated)
                            </label>
                            <input
                                type="text"
                                value={settings.metaKeywords}
                                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                                placeholder="anime, nonton anime, anime sub indo"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Social Media */}
                <Card className="bg-slate-900 p-6 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Social Media</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Open Graph Image URL
                            </label>
                            <input
                                type="text"
                                value={settings.ogImage}
                                onChange={(e) => handleChange('ogImage', e.target.value)}
                                placeholder="/og-image.jpg"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Twitter Handle
                            </label>
                            <input
                                type="text"
                                value={settings.twitterHandle}
                                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                                placeholder="@animekompi"
                                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>

                <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </Button>
            </form>
        </div>
    );
}
