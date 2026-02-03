import { AdScript } from './ad-script';

export function Footer() {
    return (
        <>
            <AdScript />
            <footer className="bg-slate-900 border-t border-white/10 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                    <p>&copy; 2026 AnimeKompi. All rights reserved.</p>
                </div>
            </footer>

            {/* Histats.com Analytics */}
            <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `
                        var _Hasync= _Hasync|| [];
                        _Hasync.push(['Histats.start', '1,4981556,4,0,0,0,00010000']);
                        _Hasync.push(['Histats.fasi', '1']);
                        _Hasync.push(['Histats.track_hits', '']);
                        (function() {
                            var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
                            hs.src = ('//s10.histats.com/js15_as.js');
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
                        })();
                    `
                }}
            />
            <noscript>
                <a href="/" target="_blank">
                    <img src="//sstatic1.histats.com/0.gif?4981556&101" alt="" />
                </a>
            </noscript>
        </>
    );
}
