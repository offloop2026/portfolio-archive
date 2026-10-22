import { Metadata } from 'next';
import { siteConfig } from '@/data/projects';
import { LanguageArchiveClient } from '@/components/LanguageArchiveClient';

export const metadata: Metadata = {
  title: `${siteConfig.name.ko} — 작업 아카이브 및 포트폴리오`,
  description: siteConfig.tagline.ko,
};

export default function RootPage() {
  return <LanguageArchiveClient lang="ko" />;
}
