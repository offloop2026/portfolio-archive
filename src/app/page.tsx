import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '김유리 — Yuri Kim | Selected Works & Archive',
  description: '김유리 작가의 미술 작업, 단채널 비디오, 사운드 인스톨레이션, 리서치 기록 아카이브입니다.',
};

export default function RootLandingPage() {
  return (
    <main
      className="w-full min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 select-none"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="text-center space-y-10 max-w-lg w-full">
        {/* Artist Name & Identity */}
        <div className="space-y-3">
          <h1
            className="tracking-tight text-black m-0 p-0"
            style={{
              fontSize: '26px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            김유리
          </h1>
          <div
            className="tracking-tight text-neutral-800"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: 1.3,
              color: '#222222',
              letterSpacing: '-0.01em',
            }}
          >
            Yuri Kim
          </div>
        </div>

        {/* Minimal Subtle Divider */}
        <div
          className="w-10 h-[1px] bg-neutral-300 mx-auto"
          style={{ width: '40px', height: '1px', backgroundColor: '#e0e0e0', margin: '0 auto' }}
        />

        {/* Language Selection Gateway Links */}
        <div
          className="flex items-center justify-center gap-6 sm:gap-8 pt-2"
          style={{ fontSize: '19px', lineHeight: '1.6' }}
        >
          <Link
            href="/ko"
            className="group inline-flex items-center gap-1.5 py-1.5 px-3.5 border border-transparent hover:border-black transition-all"
            style={{
              fontSize: '19px',
              color: '#000000',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            <span className="group-hover:opacity-70 transition-opacity">
              한국어 (KO)
            </span>
          </Link>

          <span
            className="text-neutral-300 select-none"
            style={{ fontSize: '18px', color: '#cccccc' }}
          >
            |
          </span>

          <Link
            href="/en"
            className="group inline-flex items-center gap-1.5 py-1.5 px-3.5 border border-transparent hover:border-black transition-all"
            style={{
              fontSize: '19px',
              color: '#000000',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            <span className="group-hover:opacity-70 transition-opacity">
              English (EN)
            </span>
          </Link>
        </div>

        {/* Subtle Archival Tagline */}
        <div
          className="pt-8"
          style={{
            fontSize: '14px',
            color: '#888888',
            letterSpacing: '0.02em',
          }}
        >
          Selected Works &amp; Archive
        </div>
      </div>
    </main>
  );
}
