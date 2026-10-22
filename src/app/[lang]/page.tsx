import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Language, siteConfig } from '@/data/projects';
import { LanguageArchiveClient } from '@/components/LanguageArchiveClient';

export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ko' }
  ];
}

interface LangPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === 'ko';

  return {
    title: isKo
      ? `${siteConfig.name.ko} — 작업 아카이브 및 포트폴리오`
      : `${siteConfig.name.en} — Selected Works & Editorial Archive`,
    description: isKo
      ? siteConfig.tagline.ko
      : siteConfig.tagline.en,
  };
}

export default async function LanguageArchivePage({ params }: LangPageProps) {
  const { lang } = await params;

  if (lang !== 'en' && lang !== 'ko') {
    notFound();
  }

  return <LanguageArchiveClient lang={lang as Language} />;
}
