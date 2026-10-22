'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  profileData as initialProfileData,
  ProfileData,
  WorkItem,
  ProjectItem,
  CVHistoryCategory,
  CVHistoryItem,
  MediaItem,
} from '@/data/data';

interface LanguageArchiveClientProps {
  lang: 'en' | 'ko';
}

type ActiveSelection = 
  | { section: 'cv' }
  | { section: 'works'; id: string }
  | { section: 'projects'; id: string };

function ArchiveContent({ lang }: LanguageArchiveClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // 1. DATA STATE & CLIENT-SIDE HYDRATION
  // ---------------------------------------------------------------------------
  const [content, setContent] = useState<ProfileData>(initialProfileData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load from /api/content and localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('portfolio_content');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.artistName && parsed?.works && parsed?.projects) {
          setContent(parsed);
        }
      } catch (e) {
        console.warn('Could not parse localStorage cache:', e);
      }
    }

    fetch('/api/content')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((serverData) => {
        if (serverData?.artistName && serverData?.works && serverData?.projects) {
          setContent(serverData);
          localStorage.setItem('portfolio_content', JSON.stringify(serverData));
        }
      })
      .catch((err) => {
        console.warn('Using local fallback content data:', err);
      });
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // ---------------------------------------------------------------------------
  // 2. URL QUERY PARAMS & SELECTION STATE
  // ---------------------------------------------------------------------------
  const tabParam = searchParams.get('tab');
  const workParam = searchParams.get('work') || (tabParam === 'works' ? searchParams.get('id') : null);
  const projectParam = searchParams.get('project') || (tabParam === 'projects' ? searchParams.get('id') : null);

  const [activeSelection, setActiveSelection] = useState<ActiveSelection>(() => {
    if (projectParam) {
      const found = initialProfileData.projects.find((p) => p.id === projectParam);
      if (found) return { section: 'projects', id: found.id };
    }
    if (workParam) {
      const found = initialProfileData.works.find((w) => w.id === workParam);
      if (found) return { section: 'works', id: found.id };
    }
    if (tabParam === 'works' && initialProfileData.works[0]) {
      return { section: 'works', id: initialProfileData.works[0].id };
    }
    if (tabParam === 'projects' && initialProfileData.projects[0]) {
      return { section: 'projects', id: initialProfileData.projects[0].id };
    }
    return { section: 'cv' };
  });

  useEffect(() => {
    if (projectParam) {
      const found = content.projects.find((p) => p.id === projectParam);
      if (found) {
        setActiveSelection({ section: 'projects', id: found.id });
        return;
      }
    }
    if (workParam) {
      const found = content.works.find((w) => w.id === workParam);
      if (found) {
        setActiveSelection({ section: 'works', id: found.id });
        return;
      }
    }
    if (tabParam === 'cv' || !tabParam) {
      setActiveSelection({ section: 'cv' });
    }
  }, [tabParam, workParam, projectParam, content]);

  const activeWork: WorkItem | undefined = useMemo(() => {
    if (activeSelection.section === 'works') {
      return content.works.find((w) => w.id === activeSelection.id) || content.works[0];
    }
    return content.works[0];
  }, [activeSelection, content.works]);

  const activeProject: ProjectItem | undefined = useMemo(() => {
    if (activeSelection.section === 'projects') {
      return content.projects.find((p) => p.id === activeSelection.id) || content.projects[0];
    }
    return content.projects[0];
  }, [activeSelection, content.projects]);

  const handleSelect = (selection: ActiveSelection) => {
    setActiveSelection(selection);
    setIsMobileMenuOpen(false);

    if (selection.section === 'cv') {
      router.replace(`/${lang}?tab=cv`, { scroll: false });
    } else if (selection.section === 'works') {
      router.replace(`/${lang}?work=${selection.id}`, { scroll: false });
    } else if (selection.section === 'projects') {
      router.replace(`/${lang}?project=${selection.id}`, { scroll: false });
    }

    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content.contacts.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } else {
      window.location.href = `mailto:${content.contacts.email}`;
    }
  };

  // ---------------------------------------------------------------------------
  // 3. EDIT MODE & AUTHENTICATION
  // ---------------------------------------------------------------------------
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '1025') {
      setIsEditMode(true);
      setShowAuthModal(false);
      setPasscode('');
      setAuthError('');
      triggerToast('편집 모드가 활성화되었습니다.');
    } else {
      setAuthError('패스코드가 올바르지 않습니다.');
    }
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      if (hasUnsavedChanges) {
        const confirmExit = window.confirm('저장되지 않은 변경사항이 있습니다. 편집 모드를 종료하시겠습니까?');
        if (!confirmExit) return;
      }
      setIsEditMode(false);
      triggerToast('편집 모드가 종료되었습니다.');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSaveToServer = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: content }),
      });

      const resJson = await response.json();

      if (response.ok && resJson.success) {
        localStorage.setItem('portfolio_content', JSON.stringify(content));
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        triggerToast('✓ 성공적으로 저장되었습니다.');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        throw new Error(resJson.error || 'Server save failed');
      }
    } catch (err: any) {
      console.warn('API save failed, executing local fallback:', err);
      localStorage.setItem('portfolio_content', JSON.stringify(content));
      setHasUnsavedChanges(false);
      setSaveStatus('idle');
      handleExportJSON();
      triggerToast('✓ 로컬 스토리지에 저장 및 백업 파일이 다운로드되었습니다.');
    }
  };

  const handleDiscardChanges = async () => {
    if (!window.confirm('모든 수정 내용을 취소하고 마지막 저장 상태로 되돌리시겠습니까?')) return;
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const fresh = await res.json();
        setContent(fresh);
      } else {
        setContent(initialProfileData);
      }
    } catch {
      setContent(initialProfileData);
    }
    setHasUnsavedChanges(false);
    triggerToast('수정 내용이 취소되었습니다.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_content_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ---------------------------------------------------------------------------
  // 4. INLINE DATA MUTATION HELPERS
  // ---------------------------------------------------------------------------
  const updateBioParagraph = (langKey: 'paragraphsKo' | 'paragraphsEn', idx: number, value: string) => {
    setContent((prev) => {
      const updated = [...prev.bio[langKey]];
      updated[idx] = value;
      return {
        ...prev,
        bio: {
          ...prev.bio,
          [langKey]: updated,
          ...(langKey === 'paragraphsKo' ? { ko: updated.join('\n\n') } : { en: updated.join('\n\n') }),
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  const addBioParagraph = (langKey: 'paragraphsKo' | 'paragraphsEn') => {
    setContent((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        [langKey]: [...prev.bio[langKey], '새 문단을 입력하세요.'],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const deleteBioParagraph = (langKey: 'paragraphsKo' | 'paragraphsEn', idx: number) => {
    setContent((prev) => {
      const updated = prev.bio[langKey].filter((_, i) => i !== idx);
      return {
        ...prev,
        bio: {
          ...prev.bio,
          [langKey]: updated,
          ...(langKey === 'paragraphsKo' ? { ko: updated.join('\n\n') } : { en: updated.join('\n\n') }),
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleAddWork = () => {
    const newId = `work-${Date.now()}`;
    const newWork: WorkItem = {
      id: newId,
      titleKo: '새 작업 제목',
      titleEn: 'New Artwork Title',
      year: new Date().getFullYear().toString(),
      specKo: '비디오 설치, 단채널 비디오, 사운드, 15분',
      specEn: 'Video installation, single-channel video, sound, 15m',
      roleKo: '단독 작가',
      roleEn: 'Solo Artist',
      descriptionKo: '작품 설명을 입력하세요.',
      descriptionEn: 'Enter English description here.',
      media: [
        {
          id: `media-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
          caption: { ko: '설치 전경', en: 'Installation view' },
        },
      ],
    };
    setContent((prev) => ({
      ...prev,
      works: [newWork, ...prev.works],
    }));
    setActiveSelection({ section: 'works', id: newId });
    setHasUnsavedChanges(true);
    triggerToast('새 작업이 추가되었습니다.');
  };

  const handleDeleteWork = (workId: string) => {
    if (!window.confirm('이 작업을 정말 삭제하시겠습니까?')) return;
    setContent((prev) => {
      const remaining = prev.works.filter((w) => w.id !== workId);
      if (remaining.length > 0) {
        setActiveSelection({ section: 'works', id: remaining[0].id });
      } else {
        setActiveSelection({ section: 'cv' });
      }
      return { ...prev, works: remaining };
    });
    setHasUnsavedChanges(true);
    triggerToast('작업이 삭제되었습니다.');
  };

  const updateActiveWork = (updates: Partial<WorkItem>) => {
    if (!activeWork) return;
    setContent((prev) => ({
      ...prev,
      works: prev.works.map((w) => (w.id === activeWork.id ? { ...w, ...updates } : w)),
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newProject: ProjectItem = {
      id: newId,
      titleKo: '새 프로젝트 제목',
      titleEn: 'New Project Title',
      period: `${new Date().getFullYear()}`,
      roleKo: '기획 및 리서치',
      roleEn: 'Curation & Research',
      contextKo: '협력 기관명',
      contextEn: 'Partner Institution',
      descriptionKo: '프로젝트 개요를 입력하세요.',
      descriptionEn: 'Enter project overview here.',
      link: '',
      linkLabel: { ko: '공식 링크 ↗', en: 'Official Link ↗' },
      media: [
        {
          id: `proj-media-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
          caption: { ko: '프로젝트 기록 사진', en: 'Project documentation photograph' },
        },
      ],
    };
    setContent((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setActiveSelection({ section: 'projects', id: newId });
    setHasUnsavedChanges(true);
    triggerToast('새 프로젝트가 추가되었습니다.');
  };

  const handleDeleteProject = (projId: string) => {
    if (!window.confirm('이 프로젝트를 정말 삭제하시겠습니까?')) return;
    setContent((prev) => {
      const remaining = prev.projects.filter((p) => p.id !== projId);
      if (remaining.length > 0) {
        setActiveSelection({ section: 'projects', id: remaining[0].id });
      } else {
        setActiveSelection({ section: 'cv' });
      }
      return { ...prev, projects: remaining };
    });
    setHasUnsavedChanges(true);
    triggerToast('프로젝트가 삭제되었습니다.');
  };

  const updateActiveProject = (updates: Partial<ProjectItem>) => {
    if (!activeProject) return;
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === activeProject.id ? { ...p, ...updates } : p)),
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddCVCategory = () => {
    const newCatId = `cat-${Date.now()}`;
    const newCat: CVHistoryCategory = {
      id: newCatId,
      categoryTitleKo: '새 이력 카테고리',
      categoryTitleEn: 'New Category Title',
      items: [
        {
          period: `${new Date().getFullYear()}`,
          headingKo: '새 활동 명칭',
          headingEn: 'New Activity Title',
          subheadingKo: '기관 또는 장소',
          subheadingEn: 'Organization or Venue',
        },
      ],
    };
    setContent((prev) => ({
      ...prev,
      cv: [...prev.cv, newCat],
    }));
    setHasUnsavedChanges(true);
    triggerToast('새 CV 카테고리가 추가되었습니다.');
  };

  const handleDeleteCVCategory = (catId: string) => {
    if (!window.confirm('이 카테고리를 삭제하시겠습니까?')) return;
    setContent((prev) => ({
      ...prev,
      cv: prev.cv.filter((c) => c.id !== catId),
    }));
    setHasUnsavedChanges(true);
    triggerToast('카테고리가 삭제되었습니다.');
  };

  const updateCVCategoryTitle = (catId: string, titleKo: string, titleEn: string) => {
    setContent((prev) => ({
      ...prev,
      cv: prev.cv.map((c) => (c.id === catId ? { ...c, categoryTitleKo: titleKo, categoryTitleEn: titleEn } : c)),
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddCVItem = (catId: string) => {
    const newItem: CVHistoryItem = {
      period: `${new Date().getFullYear()}`,
      headingKo: '전시 또는 프로젝트 명칭',
      headingEn: 'Exhibition or Project Title',
      subheadingKo: '장소 또는 역할',
      subheadingEn: 'Venue or Role',
    };
    setContent((prev) => ({
      ...prev,
      cv: prev.cv.map((c) => (c.id === catId ? { ...c, items: [newItem, ...c.items] } : c)),
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteCVItem = (catId: string, itemIdx: number) => {
    setContent((prev) => ({
      ...prev,
      cv: prev.cv.map((c) => (c.id === catId ? { ...c, items: c.items.filter((_, idx) => idx !== itemIdx) } : c)),
    }));
    setHasUnsavedChanges(true);
  };

  const updateCVItem = (catId: string, itemIdx: number, updates: Partial<CVHistoryItem>) => {
    setContent((prev) => ({
      ...prev,
      cv: prev.cv.map((c) => {
        if (c.id !== catId) return c;
        const newItems = [...c.items];
        newItems[itemIdx] = { ...newItems[itemIdx], ...updates };
        return { ...c, items: newItems };
      }),
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddMedia = (section: 'works' | 'projects', targetId: string) => {
    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      caption: { ko: '새 이미지 캡션', en: 'New image caption' },
    };

    if (section === 'works') {
      setContent((prev) => ({
        ...prev,
        works: prev.works.map((w) => (w.id === targetId ? { ...w, media: [...w.media, newMedia] } : w)),
      }));
    } else {
      setContent((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === targetId ? { ...p, media: [...p.media, newMedia] } : p)),
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleDeleteMedia = (section: 'works' | 'projects', targetId: string, mediaIdx: number) => {
    if (section === 'works') {
      setContent((prev) => ({
        ...prev,
        works: prev.works.map((w) =>
          w.id === targetId ? { ...w, media: w.media.filter((_, i) => i !== mediaIdx) } : w
        ),
      }));
    } else {
      setContent((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === targetId ? { ...p, media: p.media.filter((_, i) => i !== mediaIdx) } : p
        ),
      }));
    }
    setHasUnsavedChanges(true);
  };

  const updateMediaItem = (
    section: 'works' | 'projects',
    targetId: string,
    mediaIdx: number,
    field: 'url' | 'ko' | 'en',
    value: string
  ) => {
    const updater = (mediaList: MediaItem[]) => {
      const updated = [...mediaList];
      const cur = updated[mediaIdx];
      if (field === 'url') {
        updated[mediaIdx] = { ...cur, url: value };
      } else {
        updated[mediaIdx] = {
          ...cur,
          caption: {
            ko: field === 'ko' ? value : cur.caption?.ko || '',
            en: field === 'en' ? value : cur.caption?.en || '',
          },
        };
      }
      return updated;
    };

    if (section === 'works') {
      setContent((prev) => ({
        ...prev,
        works: prev.works.map((w) => (w.id === targetId ? { ...w, media: updater(w.media) } : w)),
      }));
    } else {
      setContent((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === targetId ? { ...p, media: updater(p.media) } : p)),
      }));
    }
    setHasUnsavedChanges(true);
  };

  // ---------------------------------------------------------------------------
  // 4-B. LOCAL IMAGE UPLOAD & BASE64 FALLBACK
  // ---------------------------------------------------------------------------
  const compressToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = (e.target?.result as string) || '';
        if (file.size > 1.5 * 1024 * 1024) {
          const img = document.createElement('img');
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1920;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          };
          img.onerror = () => resolve(result);
          img.src = result;
        } else {
          resolve(result);
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const processImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn('API upload failed, switching to Base64 fallback:', e);
    }
    return await compressToBase64(file);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'works' | 'projects',
    targetId: string,
    mediaIdx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetKey = mediaIdx !== undefined ? `${section}-media-${mediaIdx}` : `new-${section}-media`;
    setUploadingTarget(targetKey);

    try {
      const imageUrl = await processImageUpload(file);
      if (!imageUrl) {
        triggerToast('이미지 업로드에 실패했습니다.');
        return;
      }

      if (mediaIdx !== undefined) {
        updateMediaItem(section, targetId, mediaIdx, 'url', imageUrl);
        triggerToast('이미지가 성공적으로 변경되었습니다.');
      } else {
        const newMedia: MediaItem = {
          id: `${section === 'works' ? 'media' : 'proj-media'}-${Date.now()}`,
          type: 'image',
          url: imageUrl,
          caption: { ko: file.name.replace(/\.[^/.]+$/, ''), en: '' },
        };

        if (section === 'works') {
          setContent((prev) => ({
            ...prev,
            works: prev.works.map((w) => (w.id === targetId ? { ...w, media: [...w.media, newMedia] } : w)),
          }));
        } else {
          setContent((prev) => ({
            ...prev,
            projects: prev.projects.map((p) => (p.id === targetId ? { ...p, media: [...p.media, newMedia] } : p)),
          }));
        }
        setHasUnsavedChanges(true);
        triggerToast('새 이미지가 성공적으로 추가되었습니다.');
      }
    } catch (err) {
      console.error('Upload handler error:', err);
      triggerToast('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  const handleFileDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    section: 'works' | 'projects',
    targetId: string,
    mediaIdx?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const targetKey = mediaIdx !== undefined ? `${section}-media-${mediaIdx}` : `new-${section}-media`;
    setUploadingTarget(targetKey);

    try {
      const imageUrl = await processImageUpload(file);
      if (!imageUrl) {
        triggerToast('이미지 업로드에 실패했습니다.');
        return;
      }

      if (mediaIdx !== undefined) {
        updateMediaItem(section, targetId, mediaIdx, 'url', imageUrl);
        triggerToast('이미지가 성공적으로 변경되었습니다.');
      } else {
        const newMedia: MediaItem = {
          id: `${section === 'works' ? 'media' : 'proj-media'}-${Date.now()}`,
          type: 'image',
          url: imageUrl,
          caption: { ko: file.name.replace(/\.[^/.]+$/, ''), en: '' },
        };

        if (section === 'works') {
          setContent((prev) => ({
            ...prev,
            works: prev.works.map((w) => (w.id === targetId ? { ...w, media: [...w.media, newMedia] } : w)),
          }));
        } else {
          setContent((prev) => ({
            ...prev,
            projects: prev.projects.map((p) => (p.id === targetId ? { ...p, media: [...p.media, newMedia] } : p)),
          }));
        }
        setHasUnsavedChanges(true);
        triggerToast('새 이미지가 성공적으로 추가되었습니다.');
      }
    } catch (err) {
      console.error('File drop error:', err);
      triggerToast('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 5. RENDER (3-COLUMN INDEPENDENT SCROLL LAYOUT)
  // ---------------------------------------------------------------------------
  const columnHeightClass = isEditMode
    ? 'md:h-[calc(100vh-3.5rem)]'
    : 'md:h-screen';

  return (
    <div
      className={`w-full min-h-screen md:h-screen md:overflow-hidden bg-white text-[#000000] font-sans antialiased ${isEditMode ? 'pt-14' : ''}`}
      style={{ fontSize: '18px', lineHeight: '1.7', color: '#111' }}
    >
      
      {/* =====================================================================
          EDIT MODE STICKY TOP STATUS BAR
          ===================================================================== */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 bg-black text-white border-b border-neutral-800 z-50 px-6 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-base font-bold tracking-tight">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              EDIT MODE 활성화
            </span>
            {hasUnsavedChanges ? (
              <span className="text-base bg-white text-black px-2 py-0.5 font-bold">
                변경사항 미저장
              </span>
            ) : (
              <span className="text-base text-neutral-400">
                저장 상태: 최신
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToServer}
              disabled={saveStatus === 'saving'}
              className="bg-white text-black font-bold px-3.5 py-1 text-base hover:bg-neutral-200 transition-colors flex items-center gap-1 disabled:opacity-50"
              style={{ backgroundColor: '#ffffff', color: '#000000', fontWeight: 'bold' }}
            >
              {saveStatus === 'saving' ? '저장 중...' : saveStatus === 'saved' ? '✓ 저장 완료' : '💾 서버에 저장 (Save)'}
            </button>
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-400 px-3 py-1 text-base transition-colors"
              style={{ color: '#ffffff', borderColor: '#666666' }}
            >
              되돌리기
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-400 px-3 py-1 text-base transition-colors hidden sm:inline-block"
              style={{ color: '#ffffff', borderColor: '#666666' }}
              title="Download content.json backup"
            >
              JSON 백업
            </button>
            <button
              type="button"
              onClick={handleToggleEditMode}
              className="text-neutral-300 hover:text-white px-2.5 py-1 text-base ml-2 transition-colors"
              style={{ color: '#ffffff' }}
            >
              ✕ 종료
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-16 right-6 z-50 px-5 py-3 shadow-2xl flex items-center gap-2.5 transition-all"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            border: '1px solid #333333',
            zIndex: 99999,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: '#ffffff' }}>{toastMessage}</span>
        </div>
      )}

      {/* Passcode Modal for Edit Mode */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black p-6 sm:p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-[20px] font-bold text-black mb-1.5">
              관리자 모드 인증
            </h3>
            <p className="text-base text-neutral-600 mb-4 leading-relaxed">
              사이트 콘텐츠 직접 수정을 위해 패스코드를 입력하세요.
            </p>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="패스코드 입력"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError('');
                  }}
                  autoFocus
                  className="w-full border border-black px-3 py-2 text-base text-black focus:outline-none"
                />
                {authError && (
                  <p className="text-red-600 text-base mt-1.5 font-medium">
                    {authError}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setPasscode('');
                    setAuthError('');
                  }}
                  className="px-3 py-1.5 text-base text-neutral-600 hover:text-black"
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '8px 24px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>확인</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MOBILE TOP NAVIGATION BAR (Fixed / Sticky on Mobile <= 768px, Hidden on Desktop)
          ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100 flex items-center justify-between px-5 py-3.5 md:hidden">
        <button
          type="button"
          onClick={() => {
            handleSelect({ section: 'cv' });
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base font-extrabold tracking-tight text-black hover:opacity-70 transition-opacity"
        >
          {content.artistName.ko}
        </button>

        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setIsMobileMenuOpen(true)}
          className="mobile-menu-trigger p-1 text-black hover:opacity-60 transition-opacity"
        >
          •••
        </button>
      </header>

      {/* =====================================================================
          MOBILE SLIDE DRAWER OVERLAY (Slides in from Right to Left, Hidden on Desktop)
          ===================================================================== */}
      {/* Dim Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white z-50 md:hidden flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-100">
          <span className="text-base font-bold tracking-tight text-black">
            {content.artistName.ko}
          </span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-menu-close p-1 text-black hover:opacity-60 transition-opacity"
          >
            →
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar text-left pr-1">
          {/* 1. CV */}
          <div>
            <h2
              className="title section-title tracking-tight text-black mb-3"
              style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
            >
              CV
            </h2>
            <button
              type="button"
              onClick={() => {
                handleSelect({ section: 'cv' });
                setIsMobileMenuOpen(false);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left flex items-start gap-2 w-full hover:opacity-70"
              style={{ fontSize: '17px', lineHeight: '1.6' }}
            >
              <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
              <span className="flex-1">
                <span
                  className={
                    activeSelection.section === 'cv'
                      ? 'editorial-highlight active selected'
                      : 'text-black'
                  }
                  style={
                    activeSelection.section === 'cv'
                      ? {
                          fontSize: '17px',
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          WebkitTextFillColor: '#ffffff',
                          padding: '2px 6px',
                          display: 'inline',
                          boxDecorationBreak: 'clone',
                          WebkitBoxDecorationBreak: 'clone',
                        }
                      : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                  }
                  data-active={activeSelection.section === 'cv' ? 'true' : undefined}
                >
                  Curriculum Vitae
                </span>
              </span>
            </button>
          </div>

          {/* 2. Projects */}
          <div>
            <h2
              className="title section-title tracking-tight text-black mb-3"
              style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
            >
              Projects
            </h2>
            <ul className="space-y-2">
              {content.projects.map((proj) => {
                const isActive = activeSelection.section === 'projects' && activeSelection.id === proj.id;
                return (
                  <li key={proj.id} style={{ fontSize: '17px', lineHeight: '1.6' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelect({ section: 'projects', id: proj.id });
                        setIsMobileMenuOpen(false);
                        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left flex items-start gap-2 w-full hover:opacity-70"
                      style={{ fontSize: '17px', lineHeight: '1.6' }}
                    >
                      <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
                      <span className="flex-1">
                        <span
                          className={
                            isActive
                              ? 'editorial-highlight active selected'
                              : 'text-black'
                          }
                          style={
                            isActive
                              ? {
                                  fontSize: '17px',
                                  backgroundColor: '#000000',
                                  color: '#ffffff',
                                  WebkitTextFillColor: '#ffffff',
                                  padding: '2px 6px',
                                  display: 'inline',
                                  boxDecorationBreak: 'clone',
                                  WebkitBoxDecorationBreak: 'clone',
                                }
                              : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                          }
                          data-active={isActive ? 'true' : undefined}
                        >
                          {proj.titleKo} ({proj.titleEn})
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Works */}
          <div>
            <h2
              className="title section-title tracking-tight text-black mb-3"
              style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
            >
              Works
            </h2>
            <ul className="space-y-2">
              {content.works.map((work) => {
                const isActive = activeSelection.section === 'works' && activeSelection.id === work.id;
                return (
                  <li key={work.id} style={{ fontSize: '17px', lineHeight: '1.6' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelect({ section: 'works', id: work.id });
                        setIsMobileMenuOpen(false);
                        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left flex items-start gap-2 w-full hover:opacity-70"
                      style={{ fontSize: '17px', lineHeight: '1.6' }}
                    >
                      <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
                      <span className="flex-1">
                        <span
                          className={
                            isActive
                              ? 'editorial-highlight active selected'
                              : 'text-black'
                          }
                          style={
                            isActive
                              ? {
                                  fontSize: '17px',
                                  backgroundColor: '#000000',
                                  color: '#ffffff',
                                  WebkitTextFillColor: '#ffffff',
                                  padding: '2px 6px',
                                  display: 'inline',
                                  boxDecorationBreak: 'clone',
                                  WebkitBoxDecorationBreak: 'clone',
                                }
                              : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                          }
                          data-active={isActive ? 'true' : undefined}
                        >
                          {work.titleKo} ({work.titleEn})
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Drawer Footer: Contacts */}
        <div className="pt-4 border-t border-neutral-100 text-fluid-body space-y-2 text-neutral-700">
          <div>
            <button
              type="button"
              onClick={() => {
                handleCopyEmail();
                triggerToast('이메일 주소가 복사되었습니다.');
              }}
              className="hover:opacity-70 text-black flex items-center gap-1.5"
            >
              <span>email: {content.contacts.email}</span>
            </button>
          </div>
          <div>
            <a
              href={content.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-black inline-flex items-center gap-1"
            >
              <span>instagram: @sarrg_</span>
              <span className="text-neutral-400">↗</span>
            </a>
          </div>
          <div className="text-neutral-500 pt-0.5">
            {content.contacts.locationKo} / {content.contacts.locationEn}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN 3-COLUMN INDEPENDENT SCROLL LAYOUT
          Left-aligned (Padding-left: clamp(24px, 3vw, 48px)), Independent Column Scrolls
          ===================================================================== */}
      <div className="archive-container w-full h-full md:h-screen md:overflow-hidden text-left">
        
        <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-10 xl:gap-12 w-full h-full md:overflow-hidden text-left">

          {/* -----------------------------------------------------------------
              COLUMN 1: Left Navigation (Independent Scroll on Desktop, Hidden on Mobile)
              Width: 300px (min-width: 280px, flex-shrink: 0), Section Titles: 24px, Items: 18px
              ----------------------------------------------------------------- */}
          <aside
            className={`column-nav hidden md:block w-full md:w-[300px] md:min-w-[280px] flex-shrink-0 ${columnHeightClass} md:overflow-y-auto custom-scrollbar pt-8 pb-16 select-none text-left`}
            style={{
              height: isEditMode ? 'calc(100vh - 3.5rem)' : '100vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              width: '300px',
              minWidth: '280px',
              flexShrink: 0,
            }}
          >
            
            {/* Top Identity: Bold Section Title */}
            <div className="mb-8">
              <h1
                className="title section-title tracking-tight text-black m-0 p-0 mb-4"
                style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3' }}
              >
                <button
                  type="button"
                  onClick={() => handleSelect({ section: 'cv' })}
                  className="hover:opacity-70 transition-opacity block text-left"
                  style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000000' }}
                >
                  {content.artistName.ko}
                </button>
              </h1>
            </div>

            {/* 1. CV Section */}
            <div className="mb-8">
              <h2
                className="title section-title tracking-tight text-black mb-4 leading-snug"
                style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
              >
                CV
              </h2>
              <div>
                <button
                  type="button"
                  onClick={() => handleSelect({ section: 'cv' })}
                  className="transition-opacity text-left flex items-start gap-2 w-full hover:opacity-70"
                  style={{ fontSize: '17px', lineHeight: '1.6' }}
                >
                  <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
                  <span className="flex-1">
                    <span
                      className={
                        activeSelection.section === 'cv'
                          ? 'editorial-highlight active selected'
                          : 'inline text-black font-normal'
                      }
                      style={
                        activeSelection.section === 'cv'
                          ? {
                              fontSize: '17px',
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              WebkitTextFillColor: '#ffffff',
                              padding: '2px 6px',
                              display: 'inline',
                              boxDecorationBreak: 'clone',
                              WebkitBoxDecorationBreak: 'clone',
                            }
                          : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                      }
                      data-active={activeSelection.section === 'cv' ? 'true' : undefined}
                    >
                      Curriculum Vitae
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Projects Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="title section-title tracking-tight text-black leading-snug m-0"
                  style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
                >
                  Projects
                </h2>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="text-base font-bold border border-black px-1.5 py-0.5 hover:bg-black hover:text-white transition-colors"
                    style={{ color: '#000000' }}
                    title="새 프로젝트 추가"
                  >
                    + Add
                  </button>
                )}
              </div>
              <ul className="space-y-2.5">
                {content.projects.map((proj) => {
                  const isActive = activeSelection.section === 'projects' && activeSelection.id === proj.id;
                  return (
                    <li key={proj.id} style={{ fontSize: '17px', lineHeight: '1.6' }}>
                      <button
                        type="button"
                        onClick={() => handleSelect({ section: 'projects', id: proj.id })}
                        className="transition-opacity text-left flex items-start gap-2 w-full hover:opacity-70"
                        style={{ fontSize: '17px', lineHeight: '1.6' }}
                      >
                        <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
                        <span className="flex-1">
                          <span
                            className={
                              isActive
                                ? 'editorial-highlight active selected'
                                : 'inline text-black font-normal'
                            }
                            style={
                              isActive
                                ? {
                                    fontSize: '17px',
                                    backgroundColor: '#000000',
                                    color: '#ffffff',
                                    WebkitTextFillColor: '#ffffff',
                                    padding: '2px 6px',
                                    display: 'inline',
                                    boxDecorationBreak: 'clone',
                                    WebkitBoxDecorationBreak: 'clone',
                                  }
                                : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                            }
                            data-active={isActive ? 'true' : undefined}
                          >
                            {proj.titleKo} ({proj.titleEn})
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. Works Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="title section-title tracking-tight text-black leading-snug m-0"
                  style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000' }}
                >
                  Works
                </h2>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddWork}
                    className="text-base font-bold border border-black px-1.5 py-0.5 hover:bg-black hover:text-white transition-colors"
                    style={{ color: '#000000' }}
                    title="새 작업 추가"
                  >
                    + Add
                  </button>
                )}
              </div>
              <ul className="space-y-2.5">
                {content.works.map((work) => {
                  const isActive = activeSelection.section === 'works' && activeSelection.id === work.id;
                  return (
                    <li key={work.id} style={{ fontSize: '17px', lineHeight: '1.6' }}>
                      <button
                        type="button"
                        onClick={() => handleSelect({ section: 'works', id: work.id })}
                        className="transition-opacity text-left flex items-start gap-2 w-full hover:opacity-70"
                        style={{ fontSize: '17px', lineHeight: '1.6' }}
                      >
                        <span className="text-black select-none mt-0.5" style={{ fontSize: '17px', lineHeight: '1.6' }}>-</span>
                        <span className="flex-1">
                          <span
                            className={
                              isActive
                                ? 'editorial-highlight active selected'
                                : 'inline text-black font-normal'
                            }
                            style={
                              isActive
                                ? {
                                    fontSize: '17px',
                                    backgroundColor: '#000000',
                                    color: '#ffffff',
                                    WebkitTextFillColor: '#ffffff',
                                    padding: '2px 6px',
                                    display: 'inline',
                                    boxDecorationBreak: 'clone',
                                    WebkitBoxDecorationBreak: 'clone',
                                  }
                                : { fontSize: '17px', lineHeight: '1.6', color: '#000000' }
                            }
                            data-active={isActive ? 'true' : undefined}
                          >
                            {work.titleKo} ({work.titleEn})
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 4. External Contacts (Fluid Body Text, Pure Black #000000) */}
            <div className="mt-14 space-y-3" style={{ fontSize: '17px', lineHeight: '1.6', color: '#111' }}>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-normal">email:</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-black hover:underline underline-offset-2 flex items-center gap-1.5 font-normal"
                  style={{ fontSize: '17px', lineHeight: '1.6', color: '#000' }}
                  title="Click to copy email address"
                >
                  <span>{content.contacts.email}</span>
                  {copied ? (
                    <span className="bg-black text-white px-1.5 py-0.2 font-bold select-none" style={{ fontSize: '14px' }}>
                      Copied!
                    </span>
                  ) : (
                    <span className="text-neutral-400 select-none" style={{ fontSize: '14px' }}>
                      (copy)
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-normal">instagram:</span>
                <a
                  href={content.contacts.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline underline-offset-2 font-normal"
                  style={{ fontSize: '17px', lineHeight: '1.6', color: '#000' }}
                >
                  @sarrg_ ↗
                </a>
              </div>

              <div className="text-neutral-600 pt-1" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {content.contacts.locationKo} / {content.contacts.locationEn}
              </div>

              {/* Admin / Edit Mode Toggle Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleToggleEditMode}
                  className={`px-2 py-0.5 transition-colors ${
                    isEditMode
                      ? 'bg-black text-white font-bold'
                      : 'text-neutral-400 hover:text-black hover:underline underline-offset-2'
                  }`}
                  style={{ fontSize: '16px' }}
                >
                  {isEditMode ? '● Edit Mode ON' : 'Edit (관리)'}
                </button>
              </div>
            </div>

          </aside>

          {/* Anchor for smooth scroll target on mobile */}
          <div id="main-content-start" className="md:hidden" />

          {/* ---------------------------------------------------------------
              COLUMN 2: Center Text & Paragraphs (Independent Scroll on Desktop)
              Width: 480px (min-width: 440px, max-width: 520px, flex-shrink: 0), 25~30자 내외 도록 규격
              --------------------------------------------------------------- */}
          <section
            className={`column-content w-full md:w-[480px] md:min-w-[440px] md:max-w-[520px] flex-shrink-0 ${columnHeightClass} md:overflow-y-auto custom-scrollbar pt-8 pb-20 text-left`}
            style={{
              height: isEditMode ? 'calc(100vh - 3.5rem)' : '100vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              width: '480px',
              minWidth: '440px',
              maxWidth: '520px',
              flexShrink: 0,
            }}
          >
              
              {/* =============================================================
                  CV MODE: Artist Details & Statement
                  ============================================================= */}
              {activeSelection.section === 'cv' && (
                <div>
                  {/* Artist Name */}
                  <div className="mb-7">
                    {isEditMode ? (
                      <div className="space-y-2 mb-4 p-3 bg-neutral-50 border border-neutral-300">
                        <div>
                          <label className="text-base font-bold uppercase text-neutral-500 block mb-0.5">
                            작가명 (국문)
                          </label>
                          <input
                            type="text"
                            value={content.artistName.ko}
                            onChange={(e) => {
                              setContent((prev) => ({
                                ...prev,
                                artistName: { ...prev.artistName, ko: e.target.value },
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-white border border-neutral-300 focus:border-black px-2 py-1 text-xl font-bold text-black"
                          />
                        </div>
                        <div>
                          <label className="text-base font-bold uppercase text-neutral-500 block mb-0.5">
                            작가명 (영문)
                          </label>
                          <input
                            type="text"
                            value={content.artistName.en}
                            onChange={(e) => {
                              setContent((prev) => ({
                                ...prev,
                                artistName: { ...prev.artistName, en: e.target.value },
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-white border border-neutral-300 focus:border-black px-2 py-1 text-base font-bold text-neutral-800"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1
                          className="title section-title tracking-tight text-black leading-tight"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '8px' }}
                        >
                          {content.artistName.ko}
                        </h1>
                        <div
                          className="title tracking-tight text-black leading-snug"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '24px' }}
                        >
                          {content.artistName.en}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Statement & Biography Paragraphs */}
                  <div className="text-left">
                    {/* Korean Statement Block */}
                    <div className="space-y-6 mb-8">
                      {isEditMode && (
                        <div className="flex items-center justify-between text-base font-bold uppercase text-neutral-500 pb-1">
                          <span>Artist Statement (한국어 문단)</span>
                          <button
                            type="button"
                            onClick={() => addBioParagraph('paragraphsKo')}
                            className="text-black hover:underline font-bold"
                          >
                            + 문단 추가
                          </button>
                        </div>
                      )}
                      {content.bio.paragraphsKo.map((p, idx) => (
                        <div key={`bio-ko-${idx}`} className="group relative">
                          {isEditMode ? (
                            <div className="space-y-1 mb-3">
                              <div className="flex justify-between items-center text-base text-neutral-400">
                                <span>국문 문단 {idx + 1}</span>
                                {content.bio.paragraphsKo.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => deleteBioParagraph('paragraphsKo', idx)}
                                    className="text-red-500 hover:underline"
                                  >
                                    - 문단 삭제
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={p}
                                rows={4}
                                onChange={(e) => updateBioParagraph('paragraphsKo', idx, e.target.value)}
                                className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-black"
                                style={{ fontSize: '18px', lineHeight: '1.7' }}
                              />
                            </div>
                          ) : (
                            <p
                              className="font-normal text-left"
                              style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '20px' }}
                            >
                              {p}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* English Statement Block */}
                    <div className="space-y-6 mb-8 text-left">
                      {isEditMode && (
                        <div className="flex items-center justify-between text-base font-bold uppercase text-neutral-500 pb-1">
                          <span>Artist Statement (English Paragraphs)</span>
                          <button
                            type="button"
                            onClick={() => addBioParagraph('paragraphsEn')}
                            className="text-black hover:underline font-bold"
                          >
                            + Add Paragraph
                          </button>
                        </div>
                      )}
                      {content.bio.paragraphsEn.map((p, idx) => (
                        <div key={`bio-en-${idx}`} className="group relative">
                          {isEditMode ? (
                            <div className="space-y-1 mb-3">
                              <div className="flex justify-between items-center text-base text-neutral-400">
                                <span>English Paragraph {idx + 1}</span>
                                {content.bio.paragraphsEn.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => deleteBioParagraph('paragraphsEn', idx)}
                                    className="text-red-500 hover:underline"
                                  >
                                    - Delete
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={p}
                                rows={4}
                                onChange={(e) => updateBioParagraph('paragraphsEn', idx, e.target.value)}
                                className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-neutral-800"
                                style={{ fontSize: '18px', lineHeight: '1.7' }}
                              />
                            </div>
                          ) : (
                            <p
                              className="font-normal text-left"
                              style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '20px' }}
                            >
                              {p}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Metadata - No horizontal border line */}
                  <div
                    className="space-y-2.5 text-left pt-8 mt-8"
                    style={{ fontSize: '17px', lineHeight: '1.6', color: '#222' }}
                  >
                    <div>한국예술종합학교 미술원 조형예술과 (BFA)</div>
                    <div>예술 및 시각 커뮤니케이션 연구</div>
                    <div style={{ color: '#444' }}>
                      {content.contacts.locationKo} ({content.contacts.locationEn})
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="text-left text-black hover:underline font-normal"
                        style={{ fontSize: '17px', lineHeight: '1.6' }}
                      >
                        {content.contacts.email}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  WORKS MODE: Reference Natural Editorial Narrative Spec Layout
                  ============================================================= */}
              {activeSelection.section === 'works' && activeWork && (
                <div>
                  {/* Title, English Title & (Year) */}
                  <div className="mb-7">
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-6">
                        <div className="flex justify-between items-center">
                          <label className="text-base font-bold uppercase text-neutral-500">
                            작품 기본 정보
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteWork(activeWork.id)}
                            className="text-base font-bold text-red-600 hover:underline"
                          >
                            - 이 작업 삭제
                          </button>
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">국문 작품명</label>
                          <input
                            type="text"
                            value={activeWork.titleKo}
                            onChange={(e) => updateActiveWork({ titleKo: e.target.value })}
                            className="w-full border border-neutral-300 focus:border-black px-2 py-1 text-xl font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">영문 작품명</label>
                          <input
                            type="text"
                            value={activeWork.titleEn}
                            onChange={(e) => updateActiveWork({ titleEn: e.target.value })}
                            className="w-full border border-neutral-300 focus:border-black px-2 py-1 text-base font-bold text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">제작 연도</label>
                          <input
                            type="text"
                            value={activeWork.year}
                            onChange={(e) => updateActiveWork({ year: e.target.value })}
                            className="w-28 border border-neutral-300 focus:border-black px-2 py-1 text-base font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-left mb-6">
                        <h1
                          className="title section-title tracking-tight text-black leading-tight"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '8px' }}
                        >
                          {activeWork.titleKo}
                        </h1>
                        <div
                          className="title tracking-tight text-black leading-snug"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '4px' }}
                        >
                          {activeWork.titleEn}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#444' }}>
                          ({activeWork.year})
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Korean Overview / Artist Note (Placed directly below title) */}
                  <div className="mb-8 text-left">
                    {isEditMode ? (
                      <div>
                        <label className="text-base font-bold uppercase text-neutral-500 block mb-1">
                          국문 서문 / 작가 노트 본문
                        </label>
                        <textarea
                          value={activeWork.descriptionKo}
                          rows={7}
                          onChange={(e) => updateActiveWork({ descriptionKo: e.target.value })}
                          className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-black"
                          style={{ fontSize: '18px', lineHeight: '1.7' }}
                        />
                      </div>
                    ) : (
                      <p
                        className="font-normal whitespace-pre-line text-left"
                        style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '24px' }}
                      >
                        {activeWork.descriptionKo}
                      </p>
                    )}
                  </div>

                  {/* English Statement / Overview (Placed directly below title) */}
                  <div className="mb-8 text-left">
                    {isEditMode ? (
                      <div>
                        <label className="text-base font-bold uppercase text-neutral-500 block mb-1">
                          영문 서문 / 작가 노트 본문
                        </label>
                        <textarea
                          value={activeWork.descriptionEn}
                          rows={7}
                          onChange={(e) => updateActiveWork({ descriptionEn: e.target.value })}
                          className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-neutral-800"
                          style={{ fontSize: '18px', lineHeight: '1.7' }}
                        />
                      </div>
                    ) : (
                      <p
                        className="font-normal whitespace-pre-line text-left"
                        style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '24px' }}
                      >
                        {activeWork.descriptionEn}
                      </p>
                    )}
                  </div>

                  {/* Natural Narrative Metadata Block (Korean) - MOVED TO BOTTOM OF ESSAY, No border line */}
                  <div
                    className="pt-8 mb-6 space-y-1 text-left"
                    style={{ fontSize: '17px', lineHeight: '1.6', color: '#222' }}
                  >
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-4">
                        <label className="text-base font-bold uppercase text-neutral-500 block">
                          국문 매체/제원 및 역할
                        </label>
                        <input
                          type="text"
                          value={activeWork.specKo}
                          onChange={(e) => updateActiveWork({ specKo: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base"
                          placeholder="매체, 사운드, 규격, 러닝타임 국문"
                        />
                        <input
                          type="text"
                          value={activeWork.roleKo}
                          onChange={(e) => updateActiveWork({ roleKo: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base"
                          placeholder="역할 (단독 작가 등)"
                        />
                        <input
                          type="text"
                          value={activeWork.client || ''}
                          onChange={(e) => updateActiveWork({ client: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base"
                          placeholder="협력 기관/맥락 (선택)"
                        />
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 'bold', color: '#000' }}>{activeWork.year},</div>
                        <div>{activeWork.specKo}</div>
                        {activeWork.roleKo && <div>{activeWork.roleKo}</div>}
                        {activeWork.client && <div>{activeWork.client}</div>}
                      </>
                    )}
                  </div>

                  {/* Natural Narrative Metadata Block (English Translation) - MOVED TO BOTTOM OF ESSAY */}
                  <div
                    className="mb-8 space-y-1 text-left"
                    style={{ fontSize: '17px', lineHeight: '1.6', color: '#444' }}
                  >
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-4">
                        <label className="text-base font-bold uppercase text-neutral-500 block">
                          English Medium / Dimensions Translation
                        </label>
                        <input
                          type="text"
                          value={activeWork.specEn}
                          onChange={(e) => updateActiveWork({ specEn: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base text-neutral-800"
                          placeholder="Medium, format, dimensions (English)"
                        />
                        <input
                          type="text"
                          value={activeWork.roleEn}
                          onChange={(e) => updateActiveWork({ roleEn: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base text-neutral-800"
                          placeholder="Role (Solo Artist, etc.)"
                        />
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 'bold', color: '#000' }}>{activeWork.year}</div>
                        <div>{activeWork.specEn}</div>
                        {activeWork.roleEn && <div>{activeWork.roleEn}</div>}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* =============================================================
                  PROJECTS MODE: Reference Natural Editorial Narrative Spec Layout
                  ============================================================= */}
              {activeSelection.section === 'projects' && activeProject && (
                <div>
                  {/* Title, English Title & (Period) */}
                  <div className="mb-7">
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-6">
                        <div className="flex justify-between items-center">
                          <label className="text-base font-bold uppercase text-neutral-500">
                            프로젝트 기본 정보
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(activeProject.id)}
                            className="text-base font-bold text-red-600 hover:underline"
                          >
                            - 이 프로젝트 삭제
                          </button>
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">국문 프로젝트명</label>
                          <input
                            type="text"
                            value={activeProject.titleKo}
                            onChange={(e) => updateActiveProject({ titleKo: e.target.value })}
                            className="w-full border border-neutral-300 focus:border-black px-2 py-1 text-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">영문 프로젝트명</label>
                          <input
                            type="text"
                            value={activeProject.titleEn}
                            onChange={(e) => updateActiveProject({ titleEn: e.target.value })}
                            className="w-full border border-neutral-300 focus:border-black px-2 py-1 text-base font-bold text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="text-base font-medium text-neutral-500 block">기간 (Period)</label>
                          <input
                            type="text"
                            value={activeProject.period}
                            onChange={(e) => updateActiveProject({ period: e.target.value })}
                            className="w-48 border border-neutral-300 focus:border-black px-2 py-1 text-base font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-left mb-6">
                        <h1
                          className="title section-title tracking-tight text-black leading-tight"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '8px' }}
                        >
                          {activeProject.titleKo}
                        </h1>
                        <div
                          className="title tracking-tight text-black leading-snug"
                          style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '4px' }}
                        >
                          {activeProject.titleEn}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#444' }}>
                          ({activeProject.period})
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Korean Project Overview (Placed directly below title) */}
                  <div className="mb-8 text-left">
                    {isEditMode ? (
                      <div>
                        <label className="text-base font-bold uppercase text-neutral-500 block mb-1">
                          국문 프로젝트 개요 본문
                        </label>
                        <textarea
                          value={activeProject.descriptionKo}
                          rows={7}
                          onChange={(e) => updateActiveProject({ descriptionKo: e.target.value })}
                          className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-black"
                          style={{ fontSize: '18px', lineHeight: '1.7' }}
                        />
                      </div>
                    ) : (
                      <p
                        className="font-normal whitespace-pre-line text-left"
                        style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '24px' }}
                      >
                        {activeProject.descriptionKo}
                      </p>
                    )}
                  </div>

                  {/* English Curatorial Record (Placed directly below title) */}
                  <div className="mb-8 text-left">
                    {isEditMode ? (
                      <div>
                        <label className="text-base font-bold uppercase text-neutral-500 block mb-1">
                          영문 프로젝트 개요 본문
                        </label>
                        <textarea
                          value={activeProject.descriptionEn}
                          rows={7}
                          onChange={(e) => updateActiveProject({ descriptionEn: e.target.value })}
                          className="w-full bg-white border border-neutral-300 focus:border-black p-2 text-neutral-800"
                          style={{ fontSize: '18px', lineHeight: '1.7' }}
                        />
                      </div>
                    ) : (
                      <p
                        className="font-normal whitespace-pre-line text-left"
                        style={{ fontSize: '18px', lineHeight: '1.7', color: '#111', marginBottom: '24px' }}
                      >
                        {activeProject.descriptionEn}
                      </p>
                    )}
                  </div>

                  {/* Natural Narrative Metadata Block (Korean) - MOVED TO BOTTOM OF ESSAY, No border line */}
                  <div
                    className="pt-8 mb-6 space-y-1 text-left"
                    style={{ fontSize: '17px', lineHeight: '1.6', color: '#222' }}
                  >
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-4">
                        <label className="text-base font-bold uppercase text-neutral-500 block">
                          국문 역할 및 협력 기관
                        </label>
                        <input
                          type="text"
                          value={activeProject.roleKo}
                          onChange={(e) => updateActiveProject({ roleKo: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base"
                          placeholder="역할 (국문)"
                        />
                        <input
                          type="text"
                          value={activeProject.contextKo}
                          onChange={(e) => updateActiveProject({ contextKo: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base"
                          placeholder="협력 기관/맥락 (국문)"
                        />
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 'bold', color: '#000' }}>{activeProject.period},</div>
                        <div>{activeProject.roleKo}</div>
                        <div>{activeProject.contextKo}</div>
                      </>
                    )}
                  </div>

                  {/* Natural Narrative Metadata Block (English Translation) - MOVED TO BOTTOM OF ESSAY */}
                  <div
                    className="mb-8 space-y-1 text-left"
                    style={{ fontSize: '17px', lineHeight: '1.6', color: '#444' }}
                  >
                    {isEditMode ? (
                      <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 mb-4">
                        <label className="text-base font-bold uppercase text-neutral-500 block">
                          English Role & Context Translation
                        </label>
                        <input
                          type="text"
                          value={activeProject.roleEn}
                          onChange={(e) => updateActiveProject({ roleEn: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base text-neutral-800"
                          placeholder="Role (English)"
                        />
                        <input
                          type="text"
                          value={activeProject.contextEn}
                          onChange={(e) => updateActiveProject({ contextEn: e.target.value })}
                          className="w-full border border-neutral-300 px-2 py-1 text-base text-neutral-800"
                          placeholder="Context / Institution (English)"
                        />
                        <div className="pt-2">
                          <label className="text-base font-bold uppercase text-neutral-500 block">
                            웹사이트 링크
                          </label>
                          <input
                            type="url"
                            value={activeProject.link || ''}
                            onChange={(e) => updateActiveProject({ link: e.target.value })}
                            className="w-full border border-neutral-300 px-2 py-1 text-base"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 'bold', color: '#000' }}>{activeProject.period}</div>
                        <div>{activeProject.roleEn}</div>
                        <div>{activeProject.contextEn}</div>
                      </>
                    )}
                  </div>

                  {/* Official Website Link Button */}
                  {activeProject.link && (
                    <div className="pt-2 text-left">
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-black px-4 py-2 text-fluid-body font-medium text-black hover:bg-black hover:text-white transition-colors"
                      >
                        <span>{activeProject.linkLabel?.ko || '관련 공식 아카이브 링크 ↗'}</span>
                        <span className="text-neutral-600 ml-1.5">({activeProject.linkLabel?.en || 'View Official Link ↗'})</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

            </section>

          {/* ---------------------------------------------------------------
              COLUMN 3: Right Media & Exhibition (Independent Scroll on Desktop)
              Fills remaining width, strictly max-width: 720px on desktop
              --------------------------------------------------------------- */}
          <section
            className={`column-media flex-1 min-w-full md:min-w-0 md:max-w-[720px] w-full ${columnHeightClass} md:overflow-y-auto custom-scrollbar pt-0 md:pt-8 pb-20 md:pb-24 text-left`}
            style={{
              height: isEditMode ? 'calc(100vh - 3.5rem)' : '100vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              flex: 1,
            }}
          >
            
            {/* =============================================================
                CV MODE: Pure Typography Exhibition History (Fluid Body)
                ============================================================= */}
            {activeSelection.section === 'cv' && (
              <div className="space-y-12 sm:space-y-14 text-left max-w-[720px]">
                
                {isEditMode && (
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-base font-bold uppercase tracking-tight">
                      CV 이력 관리 (Exhibition & Career History)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddCVCategory}
                      className="text-base font-bold bg-black text-white px-2.5 py-0.5 hover:bg-neutral-800 transition-colors"
                      style={{ backgroundColor: '#000000', color: '#ffffff' }}
                    >
                      + 새 카테고리 추가
                    </button>
                  </div>
                )}

                  {/* Dynamic CV Categories */}
                  {content.cv.map((category) => (
                    <div key={category.id} className="space-y-6 text-left">
                      
                      {/* Category Header: Fluid Title Bold, NO divider lines */}
                      {isEditMode ? (
                        <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold uppercase text-neutral-500">카테고리 제목</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddCVItem(category.id)}
                                className="text-base font-bold border border-black px-1.5 py-0.5 hover:bg-black hover:text-white"
                              >
                                + 항목 추가
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCVCategory(category.id)}
                                className="text-base font-bold text-red-600 hover:underline"
                              >
                                - 카테고리 삭제
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={category.categoryTitleEn}
                              onChange={(e) => updateCVCategoryTitle(category.id, category.categoryTitleKo, e.target.value)}
                              className="border border-neutral-300 px-2 py-1 text-base font-bold"
                              placeholder="English Category Title"
                            />
                            <input
                              type="text"
                              value={category.categoryTitleKo}
                              onChange={(e) => updateCVCategoryTitle(category.id, e.target.value, category.categoryTitleEn)}
                              className="border border-neutral-300 px-2 py-1 text-base"
                              placeholder="국문 카테고리 제목"
                            />
                          </div>
                        </div>
                      ) : (
                        <h2
                          className="title section-title tracking-tight text-black leading-snug"
                          style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.3', color: '#000', marginBottom: '16px' }}
                        >
                          {category.categoryTitleEn} ({category.categoryTitleKo})
                        </h2>
                      )}

                      {/* Items in Category */}
                      <div className="space-y-6 text-left">
                        {category.items.map((item, idx) => (
                          <div key={idx} className="group relative">
                            {isEditMode ? (
                              <div className="p-3 border border-neutral-200 bg-white space-y-2">
                                <div className="flex justify-between items-center text-base font-medium text-neutral-400">
                                  <span>이력 항목 {idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCVItem(category.id, idx)}
                                    className="text-red-500 hover:underline"
                                  >
                                    - 삭제
                                  </button>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2">
                                  <input
                                    type="text"
                                    value={item.period || ''}
                                    onChange={(e) => updateCVItem(category.id, idx, { period: e.target.value })}
                                    className="border border-neutral-300 px-1.5 py-0.5 text-base font-medium"
                                    placeholder="2026"
                                  />
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={item.headingKo}
                                      onChange={(e) => updateCVItem(category.id, idx, { headingKo: e.target.value })}
                                      className="w-full border border-neutral-300 px-1.5 py-0.5 text-base font-bold"
                                      placeholder="국문 명칭"
                                    />
                                    <input
                                      type="text"
                                      value={item.headingEn || ''}
                                      onChange={(e) => updateCVItem(category.id, idx, { headingEn: e.target.value })}
                                      className="w-full border border-neutral-300 px-1.5 py-0.5 text-base text-neutral-600 font-medium"
                                      placeholder="English Title"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <input
                                    type="text"
                                    value={item.subheadingKo || ''}
                                    onChange={(e) => updateCVItem(category.id, idx, { subheadingKo: e.target.value })}
                                    className="border border-neutral-300 px-1.5 py-0.5 text-base"
                                    placeholder="국문 장소/역할"
                                  />
                                  <input
                                    type="text"
                                    value={item.subheadingEn || ''}
                                    onChange={(e) => updateCVItem(category.id, idx, { subheadingEn: e.target.value })}
                                    className="border border-neutral-300 px-1.5 py-0.5 text-base text-neutral-600"
                                    placeholder="English Venue/Role"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={item.detailsKo || ''}
                                    onChange={(e) => updateCVItem(category.id, idx, { detailsKo: e.target.value })}
                                    className="w-full border border-neutral-300 px-1.5 py-0.5 text-base text-neutral-600"
                                    placeholder="상세 설명 (선택사항)"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-left" style={{ fontSize: '15px', lineHeight: '1.5', color: '#333' }}>
                                {item.period && (
                                  <div style={{ fontWeight: 'bold', color: '#000', fontSize: '15px' }}>
                                    {item.period}
                                  </div>
                                )}
                                <div style={{ fontWeight: 'bold', color: '#000', fontSize: '15px' }}>
                                  {item.headingKo} {item.headingEn && <span style={{ fontWeight: 'normal', color: '#555' }}>({item.headingEn})</span>}
                                </div>
                                {item.subheadingKo && (
                                  <div style={{ color: '#222', fontSize: '15px' }}>
                                    {item.subheadingKo} {item.subheadingEn && <span style={{ color: '#666' }}>/ {item.subheadingEn}</span>}
                                  </div>
                                )}
                                {item.detailsKo && (
                                  <div style={{ color: '#666', fontSize: '14px', marginTop: '2px' }}>
                                    {item.detailsKo}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* =============================================================
                  WORKS MODE: Vertical Media Scroll (Fluid Captions)
                  ============================================================= */}
              {activeSelection.section === 'works' && activeWork && (
                <div className="space-y-12 sm:space-y-16 text-left max-w-[720px]">
                  
                  {isEditMode && (
                    <div className="border border-black p-4 bg-neutral-50 mb-8 space-y-3">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[17px] font-bold text-black uppercase tracking-tight">
                          작품 미디어 관리 ({activeWork.media.length}개)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddMedia('works', activeWork.id)}
                          className="text-[14px] text-neutral-600 hover:text-black underline"
                        >
                          + URL로 수동 추가
                        </button>
                      </div>

                      {/* Drag & Drop / Direct File Upload Box */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleFileDrop(e, 'works', activeWork.id)}
                        className="border-2 border-dashed border-neutral-400 hover:border-black p-5 text-center transition-colors bg-white cursor-pointer relative"
                      >
                        <input
                          id="works-new-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'works', activeWork.id)}
                          disabled={uploadingTarget === 'new-works-media'}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {uploadingTarget === 'new-works-media' ? (
                          <div className="flex items-center justify-center gap-2 text-black font-bold text-[16px] py-3">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                            <span>사진 파일 업로드 중... 잠시만 기다려 주세요.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none py-2">
                            <span className="text-[16px] font-bold text-black">
                              + 내 컴퓨터에서 사진 파일 직접 선택 / 첨부
                            </span>
                            <span className="text-[14px] text-neutral-500">
                              클릭하여 사진 파일을 선택하거나, 이곳으로 드래그 앤 드롭하세요.
                            </span>
                            <div
                              className="mt-2 inline-block bg-black text-white px-4 py-1.5 text-[15px] font-bold"
                              style={{ backgroundColor: '#000000', color: '#ffffff' }}
                            >
                              [ 📁 사진 파일 선택 / 파일 첨부 ]
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeWork.media.map((mediaItem, idx) => (
                    <div key={mediaItem.id || idx} className="w-full max-w-[720px] text-left">
                      <div className="relative w-full max-w-[720px] bg-neutral-100 overflow-hidden">
                        <Image
                          src={mediaItem.url}
                          alt={mediaItem.caption?.ko || activeWork.titleKo}
                          width={1440}
                          height={960}
                          sizes="(max-width: 768px) 100vw, 720px"
                          className="w-full h-auto object-cover block"
                          priority={idx === 0}
                          unoptimized={true}
                        />
                      </div>

                      {isEditMode ? (
                        <div className="mt-3 p-4 bg-neutral-50 border border-neutral-300 space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                            <span className="text-[16px] font-bold uppercase text-black">
                              미디어 #{idx + 1}
                            </span>
                            {activeWork.media.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia('works', activeWork.id, idx)}
                                className="text-[15px] font-bold text-red-600 hover:underline"
                              >
                                - 미디어 삭제
                              </button>
                            )}
                          </div>

                          {/* Direct file replacement button */}
                          <div className="p-3 bg-white border border-neutral-300 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[14px] font-bold text-black block">사진 파일 교체</span>
                              <span className="text-[12px] text-neutral-500 block truncate max-w-[320px]">
                                {mediaItem.url.startsWith('data:')
                                  ? '현재: 첨부된 파일 (Base64)'
                                  : mediaItem.url.startsWith('/uploads/')
                                  ? `현재: 서버 파일 (${mediaItem.url.replace('/uploads/', '')})`
                                  : '현재: 웹 URL 이미지'}
                              </span>
                            </div>
                            <label
                              htmlFor={`works-file-replace-${idx}`}
                              className="cursor-pointer inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 text-[14px] font-bold hover:bg-neutral-800 transition-colors"
                              style={{ backgroundColor: '#000000', color: '#ffffff' }}
                            >
                              {uploadingTarget === `works-media-${idx}` ? (
                                <>
                                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                  <span style={{ color: '#ffffff' }}>업로드 중...</span>
                                </>
                              ) : (
                                <span style={{ color: '#ffffff' }}>📁 새 사진 파일 선택</span>
                              )}
                            </label>
                            <input
                              id={`works-file-replace-${idx}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'works', activeWork.id, idx)}
                              disabled={uploadingTarget === `works-media-${idx}`}
                              className="hidden"
                            />
                          </div>

                          <div>
                            <label className="text-[14px] font-medium text-neutral-600 block mb-1">
                              이미지 주소 (URL)
                            </label>
                            <input
                              type="text"
                              value={mediaItem.url}
                              onChange={(e) => updateMediaItem('works', activeWork.id, idx, 'url', e.target.value)}
                              className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-black bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[14px] font-medium text-neutral-600 block mb-1">국문 캡션</label>
                              <input
                                type="text"
                                value={mediaItem.caption?.ko || ''}
                                onChange={(e) => updateMediaItem('works', activeWork.id, idx, 'ko', e.target.value)}
                                className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-black bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[14px] font-medium text-neutral-600 block mb-1">영문 캡션</label>
                              <input
                                type="text"
                                value={mediaItem.caption?.en || ''}
                                onChange={(e) => updateMediaItem('works', activeWork.id, idx, 'en', e.target.value)}
                                className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-neutral-600 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        mediaItem.caption && (
                          <div className="mt-3 font-normal text-left" style={{ fontSize: '15px', lineHeight: '1.5', color: '#333' }}>
                            <span style={{ fontWeight: 500, color: '#111' }}>{mediaItem.caption.ko}</span>
                            <span style={{ color: '#888', margin: '0 8px' }}>/</span>
                            <span style={{ color: '#444' }}>{mediaItem.caption.en}</span>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* =============================================================
                  PROJECTS MODE: Documentation Media & Related Link
                  ============================================================= */}
              {activeSelection.section === 'projects' && activeProject && (
                <div className="space-y-12 sm:space-y-16 text-left max-w-[720px]">
                  
                  {isEditMode && (
                    <div className="border border-black p-4 bg-neutral-50 mb-8 space-y-3">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[17px] font-bold text-black uppercase tracking-tight">
                          프로젝트 미디어 관리 ({activeProject.media.length}개)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddMedia('projects', activeProject.id)}
                          className="text-[14px] text-neutral-600 hover:text-black underline"
                        >
                          + URL로 수동 추가
                        </button>
                      </div>

                      {/* Drag & Drop / Direct File Upload Box */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleFileDrop(e, 'projects', activeProject.id)}
                        className="border-2 border-dashed border-neutral-400 hover:border-black p-5 text-center transition-colors bg-white cursor-pointer relative"
                      >
                        <input
                          id="projects-new-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'projects', activeProject.id)}
                          disabled={uploadingTarget === 'new-projects-media'}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {uploadingTarget === 'new-projects-media' ? (
                          <div className="flex items-center justify-center gap-2 text-black font-bold text-[16px] py-3">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                            <span>사진 파일 업로드 중... 잠시만 기다려 주세요.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none py-2">
                            <span className="text-[16px] font-bold text-black">
                              + 내 컴퓨터에서 사진 파일 직접 선택 / 첨부
                            </span>
                            <span className="text-[14px] text-neutral-500">
                              클릭하여 사진 파일을 선택하거나, 이곳으로 드래그 앤 드롭하세요.
                            </span>
                            <div
                              className="mt-2 inline-block bg-black text-white px-4 py-1.5 text-[15px] font-bold"
                              style={{ backgroundColor: '#000000', color: '#ffffff' }}
                            >
                              [ 📁 사진 파일 선택 / 파일 첨부 ]
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Media Stack */}
                  {activeProject.media.map((mediaItem, idx) => (
                    <div key={mediaItem.id || idx} className="w-full max-w-[720px] text-left">
                      <div className="relative w-full max-w-[720px] bg-neutral-100 overflow-hidden">
                        <Image
                          src={mediaItem.url}
                          alt={mediaItem.caption?.ko || activeProject.titleKo}
                          width={1440}
                          height={960}
                          sizes="(max-width: 768px) 100vw, 720px"
                          className="w-full h-auto object-cover block"
                          priority={idx === 0}
                          unoptimized={true}
                        />
                      </div>

                      {isEditMode ? (
                        <div className="mt-3 p-4 bg-neutral-50 border border-neutral-300 space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                            <span className="text-[16px] font-bold uppercase text-black">
                              미디어 #{idx + 1}
                            </span>
                            {activeProject.media.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia('projects', activeProject.id, idx)}
                                className="text-[15px] font-bold text-red-600 hover:underline"
                              >
                                - 미디어 삭제
                              </button>
                            )}
                          </div>

                          {/* Direct file replacement button */}
                          <div className="p-3 bg-white border border-neutral-300 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[14px] font-bold text-black block">사진 파일 교체</span>
                              <span className="text-[12px] text-neutral-500 block truncate max-w-[320px]">
                                {mediaItem.url.startsWith('data:')
                                  ? '현재: 첨부된 파일 (Base64)'
                                  : mediaItem.url.startsWith('/uploads/')
                                  ? `현재: 서버 파일 (${mediaItem.url.replace('/uploads/', '')})`
                                  : '현재: 웹 URL 이미지'}
                              </span>
                            </div>
                            <label
                              htmlFor={`projects-file-replace-${idx}`}
                              className="cursor-pointer inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 text-[14px] font-bold hover:bg-neutral-800 transition-colors"
                              style={{ backgroundColor: '#000000', color: '#ffffff' }}
                            >
                              {uploadingTarget === `projects-media-${idx}` ? (
                                <>
                                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                  <span style={{ color: '#ffffff' }}>업로드 중...</span>
                                </>
                              ) : (
                                <span style={{ color: '#ffffff' }}>📁 새 사진 파일 선택</span>
                              )}
                            </label>
                            <input
                              id={`projects-file-replace-${idx}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'projects', activeProject.id, idx)}
                              disabled={uploadingTarget === `projects-media-${idx}`}
                              className="hidden"
                            />
                          </div>

                          <div>
                            <label className="text-[14px] font-medium text-neutral-600 block mb-1">
                              이미지 주소 (URL)
                            </label>
                            <input
                              type="text"
                              value={mediaItem.url}
                              onChange={(e) => updateMediaItem('projects', activeProject.id, idx, 'url', e.target.value)}
                              className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-black bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[14px] font-medium text-neutral-600 block mb-1">국문 캡션</label>
                              <input
                                type="text"
                                value={mediaItem.caption?.ko || ''}
                                onChange={(e) => updateMediaItem('projects', activeProject.id, idx, 'ko', e.target.value)}
                                className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-black bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[14px] font-medium text-neutral-600 block mb-1">영문 캡션</label>
                              <input
                                type="text"
                                value={mediaItem.caption?.en || ''}
                                onChange={(e) => updateMediaItem('projects', activeProject.id, idx, 'en', e.target.value)}
                                className="w-full border border-neutral-300 px-2.5 py-1.5 text-[15px] text-neutral-600 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        mediaItem.caption && (
                          <div className="mt-3 font-normal text-left" style={{ fontSize: '15px', lineHeight: '1.5', color: '#333' }}>
                            <span style={{ fontWeight: 500, color: '#111' }}>{mediaItem.caption.ko}</span>
                            <span style={{ color: '#888', margin: '0 8px' }}>/</span>
                            <span style={{ color: '#444' }}>{mediaItem.caption.en}</span>
                          </div>
                        )
                      )}
                    </div>
                  ))}

                </div>
              )}

            </section>

        </div>

      </div>
    </div>
  );
}

export function LanguageArchiveClient({ lang }: LanguageArchiveClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-base text-neutral-500 font-normal">
          Loading archive...
        </div>
      }
    >
      <ArchiveContent lang={lang} />
    </Suspense>
  );
}

export default LanguageArchiveClient;
