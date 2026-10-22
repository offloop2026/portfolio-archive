export interface LocalizedString {
  ko: string;
  en: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: LocalizedString;
  aspect?: 'landscape' | 'portrait' | 'square' | 'video';
}

export interface WorkMetadataItem {
  label: LocalizedString;
  value: LocalizedString;
}

export interface WorkItem {
  id: string;
  titleKo: string;
  titleEn: string;
  year: string;
  specKo: string;
  specEn: string;
  descriptionKo: string;
  descriptionEn: string;
  roleKo: string;
  roleEn: string;
  client?: string;
  metadata?: WorkMetadataItem[];
  media: MediaItem[];
}

export interface ProjectLinkItem {
  id: string;
  label?: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  titleKo: string;
  titleEn: string;
  roleKo: string;
  roleEn: string;
  period: string;
  contextKo: string;
  contextEn: string;
  descriptionKo: string;
  descriptionEn: string;
  link?: string;
  linkLabel?: LocalizedString;
  linkUrl?: string;
  linkText?: string;
  links?: ProjectLinkItem[];
  media: MediaItem[];
}

export interface CVHistoryItem {
  period?: string;
  headingKo: string;
  headingEn: string;
  subheadingKo?: string;
  subheadingEn?: string;
  detailsKo?: string;
  detailsEn?: string;
}

export interface CVHistoryCategory {
  id: string;
  categoryTitleKo: string;
  categoryTitleEn: string;
  items: CVHistoryItem[];
}

export interface ProfileData {
  artistName: LocalizedString;
  bio: {
    ko: string;
    en: string;
    paragraphsKo: string[];
    paragraphsEn: string[];
  };
  portraitPhotos: string[];
  cv: CVHistoryCategory[];
  works: WorkItem[];
  projects: ProjectItem[];
  contacts: {
    email: string;
    instagram: string;
    locationKo: string;
    locationEn: string;
  };
}

import initialContent from './content.json';

export const defaultProfileData: ProfileData = {
  artistName: {
    ko: "김유리",
    en: "Yuri Kim (glass.gkim)"
  },
  bio: {
    ko: "신호와 흔적이 어떻게 존재를 감각하게 만들고 공간과 관계를 구성하는지에 관심을 가지고 작업한다. 온라인 생존 게임에서 경험한 음성 채팅, 데이터의 소멸, 공동체의 기억과 같은 경험을 출발점으로 영상, 사운드, 설치 작업을 진행하고 있다. 최근에는 보이지 않는 신호가 공간에 남기는 흔적과 사람들이 관계를 형성하고 유지하는 방식에 주목하며 작업을 확장하고 있다.",
    en: "My practice investigates how invisible signals and physical traces evoke the perception of existence, shaping spatial awareness and human relations. Departing from experiences of voice chat in online survival games, data obsolescence, and shared collective memory, I construct video, sound, and spatial installation works. Recently, my work has expanded toward observing the residual marks invisible signals leave across spaces and the delicate ways people form and maintain relations.",
    paragraphsKo: [
      "신호와 흔적이 어떻게 존재를 감각하게 만들고 공간과 관계를 구성하는지에 관심을 가지고 작업한다. 온라인 생존 게임에서 경험한 음성 채팅, 데이터의 소멸, 공동체의 기억과 같은 경험을 출발점으로 영상, 사운드, 설치 작업을 진행하고 있다.",
      "최근에는 보이지 않는 신호가 공간에 남기는 흔적과 사람들이 관계를 형성하고 유지하는 방식에 주목하며 작업을 확장하고 있다. 통신 인프라가 점유한 옥상, 우주 공학의 접이식 구조, 가상 데이터와 암석의 결속처럼 실체보다 먼저 감각되거나 비물질적 데이터 이면에 요구되는 물리적 상태를 탐구한다."
    ],
    paragraphsEn: [
      "My practice investigates how invisible signals and physical traces evoke the perception of existence, shaping spatial awareness and human relations. Departing from experiences of voice chat in online survival games, data obsolescence, and shared collective memory, I construct video, sound, and spatial installation works.",
      "Recently, my work has expanded toward observing the residual marks invisible signals leave across spaces and the delicate ways people form and maintain relations. Examining deployable aerospace structures, cellular frequencies over urban rooftops, and the deep tethering between immaterial data flows and earthly material labor."
    ]
  },
  portraitPhotos: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
  ],
  cv: [
    {
      id: "exhibitions",
      categoryTitleKo: "전시 및 기획",
      categoryTitleEn: "Selected Exhibitions & Curatorial",
      items: [
        {
          period: "2026",
          headingKo: "《눈자리나게, 이어》(Lingering Traces Linked)",
          headingEn: "Exhibition <Lingering Traces Linked>",
          subheadingKo: "인천아트플랫폼 (Incheon Art Platform) — 작가 및 공간 기획",
          subheadingEn: "Incheon Art Platform — Artist & Spatial Scenography"
        },
        {
          period: "2026",
          headingKo: "《Beyond Stage 2026》(Hong Kong)",
          headingEn: "Residency Outcome Exhibition 《Beyond Stage 2026》",
          subheadingKo: "홍콩 아트 마켓 & 레지던시 — 참여 작가 겸 최종 성과 전시 총괄 큐레이션",
          subheadingEn: "Hong Kong Art Market & Residency — Participating Artist & Chief Curator"
        },
        {
          period: "2021",
          headingKo: "조형예술과 파운데이션 기획전",
          headingEn: "K-Arts Fine Art Foundation Exhibition",
          subheadingKo: "K-Arts Gallery, Seoul",
          subheadingEn: "K-Arts Gallery, Seoul"
        }
      ]
    },
    {
      id: "experience",
      categoryTitleKo: "실무 및 기관 이력",
      categoryTitleEn: "Professional Experience",
      items: [
        {
          period: "2025.05 – 2026.02",
          headingKo: "주스웨덴 한국문화원 (Korean Cultural Center in Sweden)",
          headingEn: "Korean Cultural Center in Sweden",
          subheadingKo: "콘텐츠 제작 및 디지털 커뮤니케이션 인턴",
          subheadingEn: "Content Production & Digital Communications Intern",
          detailsKo: "90개 이상의 영상 콘텐츠, 홍보물, 행사 공식 스케치 영상 및 아카이빙 제작",
          detailsEn: "Produced 90+ video contents, promotional materials, official event sketch videos, and archival documentation"
        },
        {
          period: "2022.03 – 2023.01",
          headingKo: "갤러리 175 (Gallery 175)",
          headingEn: "Gallery 175",
          subheadingKo: "전시 운영 및 디지털 콘텐츠 인턴",
          subheadingEn: "Exhibition Operations & Digital Content Intern"
        },
        {
          period: "2026.06 – 2026.10",
          headingKo: "Beyond Stage 2026 (Hong Kong)",
          headingEn: "Beyond Stage 2026 (Hong Kong)",
          subheadingKo: "전시 큐레이션 및 비주얼 디자인",
          subheadingEn: "Exhibition Curation & Visual Design"
        },
        {
          period: "2022.02 – 2022.09",
          headingKo: "YouTube 콘텐츠 영상 편집 및 숏폼 제작",
          headingEn: "Freelance Video & Short-form Production",
          subheadingKo: "영상 편집 및 제작",
          subheadingEn: "Video Editor & Designer"
        }
      ]
    },
    {
      id: "stage",
      categoryTitleKo: "무대 기술 및 기타 협업",
      categoryTitleEn: "Stage & Collaborations",
      items: [
        {
          period: "2026",
          headingKo: "K-arts 무대기술 아카데미 조명 분야",
          headingEn: "K-Arts Stage Technology Academy — Lighting Division",
          subheadingKo: "조명 기술 및 시노그래피",
          subheadingEn: "Lighting Technology & Scenography"
        },
        {
          period: "2023",
          headingKo: "연극원 전문사 공연 <반려중입니다>",
          headingEn: "K-Arts Drama Production <Being with Companion>",
          subheadingKo: "조명 오퍼레이터",
          subheadingEn: "Lighting Operator"
        },
        {
          period: "2023",
          headingKo: "돌곶이 인큐베이터 <리플리>, <민들레>",
          headingEn: "Dolgoji Summer Incubator <Ripley>, <Dandelion>",
          subheadingKo: "조명 오퍼레이터",
          subheadingEn: "Lighting Operator"
        },
        {
          period: "2022",
          headingKo: "제10회 청춘나눔창작연극제 <청소년, 봄을 짓다>",
          headingEn: "10th Youth Sharing Festival <Spring in Making>",
          subheadingKo: "무대감독 보조",
          subheadingEn: "Assistant Stage Manager"
        },
        {
          period: "2022",
          headingKo: "한국예술종합학교 블로그 '예종지기'",
          headingEn: "K-Arts Official Editorial Blog 'Yejongjigi'",
          subheadingKo: "콘텐츠 제작 및 에디토리얼",
          subheadingEn: "Content Creator & Editorial"
        }
      ]
    },
    {
      id: "education",
      categoryTitleKo: "학력 및 소속",
      categoryTitleEn: "Education & Research",
      items: [
        {
          period: "2020 – 2026",
          headingKo: "한국예술종합학교 미술원 조형예술과 (BFA)",
          headingEn: "Korea National University of Arts (K-Arts), BFA Fine Art",
          subheadingKo: "조형예술과 예술사 졸업 예정",
          subheadingEn: "School of Visual Arts, BFA in Fine Arts"
        },
        {
          period: "2024 – 현재",
          headingKo: "예술 및 시각 커뮤니케이션 연구",
          headingEn: "Art & Visual Communication Research",
          subheadingKo: "독립 리서치 및 아카이빙 활동",
          subheadingEn: "Independent Research & Archiving Initiative"
        }
      ]
    }
  ],
  works: [
    {
      id: "folding-for-two",
      titleKo: "두 명을 위한 접기",
      titleEn: "Folding for Two",
      year: "2026",
      specKo: "비디오 설치, 단채널 비디오, 매트리스, 이불, 사운드, 23분 30초",
      specEn: "Video installation, single-channel video, mattress, duvet, sound, 23 min 30 sec",
      roleKo: "작가, 연출 및 사운드 시노그래피",
      roleEn: "Artist, Direction & Sound Scenography",
      client: "인천아트플랫폼 / 개인 스튜디오 (Incheon Art Platform / Studio)",
      descriptionKo: "《두 명을 위한 접기》는 더 이상 도달할 수 없거나 실재를 확신할 수 없는 장소에 대한 감각에서 출발한다. 작업은 두 명의 퍼포머가 하나의 이불을 접고 펼치는 과정을 기록한 영상과 설치로 구성된다. 퍼포머들은 동일한 접기 체계를 공유하지 않은 채 각자의 기억과 감각에 의존하여 구조를 만들어간다. 접기의 순서와 방향은 끊임없이 수정되며, 구조는 완성된 결과보다 두 사람 사이에서 잠시 유지되는 상태로 존재한다. 특히 솜 이불은 접힌 흔적이 쉽게 남지 않기 때문에, 퍼포머들은 직전의 형태를 서로 번갈아 기억하며 구조를 지속해야 한다. 나는 온라인 공간에서 경험한 비물질적 현존과 관계의 감각을 물리적인 행위로 번역하고자 했다.",
      descriptionEn: "Folding for Two begins from the sense of places that can no longer be reached or whose existence cannot be certain. The work comprises a video documenting two performers folding and unfolding a single duvet, along with an installation. Without sharing a predetermined folding system, the performers rely on their respective memories and sensations to construct a structure. The sequence and direction of folds are continually adjusted, existing as an ephemeral state sustained between two bodies rather than a finished result. Because a cotton duvet does not easily retain creased folds, the performers must alternately remember the previous form to sustain the structure. I sought to translate the sensation of immaterial presence and relationships experienced in online spaces into physical actions.",
      metadata: [
        {
          label: { ko: "러닝 타임", en: "Duration" },
          value: { ko: "23분 30초 (연속 루프)", en: "23 min 30 sec (Continuous Loop)" }
        },
        {
          label: { ko: "설치 면적", en: "Dimensions" },
          value: { ko: "가변 크기 설치", en: "Variable Installation Dimensions" }
        },
        {
          label: { ko: "주요 매체", en: "Materials" },
          value: { ko: "매트리스, 솜 이불, 단채널 비디오, 사운드", en: "Mattress, Cotton Duvet, Single-channel Video, Sound" }
        }
      ],
      media: [
        {
          id: "fft-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "설치 전경: 매트리스 좌대와 단채널 영상 프로젝션",
            en: "Installation view: Mattress plinth with suspended single-channel video projection"
          },
          aspect: "landscape"
        },
        {
          id: "fft-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1400&auto=format&fit=crop",
          caption: {
            ko: "영상 스틸: 비동기화된 이불 모서리 맞춤 시퀀스",
            en: "Video still: Unsynchronized duvet corner alignment sequence"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "folding-engine-1-car-1",
      titleKo: "자동차1의 접이식 엔진1",
      titleEn: "Folding Engine 1 of Car 1",
      year: "2026",
      specKo: "트레이싱지, 종이 지지대, 진동 스피커, 사운드 설치, 가변크기",
      specEn: "Tracing paper, paper support, vibration speaker, sound installation, variable dimensions",
      roleKo: "작가, 구조 설계 및 사운드 시노그래피",
      roleEn: "Artist, Structural & Sound Scenography",
      client: "스튜디오 설치 (Studio Installation)",
      descriptionKo: "《자동차1의 접이식 엔진1》은 전기자동차의 가상 엔진 사운드와 우주 공학의 접이식 구조를 결합하여, 실체보다 먼저 감각되는 존재의 구조를 다룬다. 작업 안에서 반복적으로 등장하는 접기(Folding)의 구조는 오늘날의 존재 방식을 드러내기 위한 장치이다. 우주 공학의 접이식 구조처럼 오늘날의 관계와 존재는 완전히 고정된 형태라기보다, 끊임없이 전개되고 잠정적으로 유지되는 상태에 가깝다. 종이와 트레이싱지, 이불처럼 쉽게 흔들리고 접히는 재료들을 사용해 불완전한 구조를 만들고, 사운드와 진동을 통해 비물질적 신호가 물리적 감각으로 전환되는 순간을 드러내고자 한다.",
      descriptionEn: "Folding Engine 1 of Car 1 combines the virtual engine sound of an electric car with the deployable folding structures of aerospace engineering, addressing structures of existence sensed prior to physical substance. The recurring motif of 'folding' functions as an apparatus revealing contemporary modes of existence. Much like deployable space structures, contemporary relations and presences are not fixed forms, but states continuously unfolding and held in provisional equilibrium. Utilizing materials that easily waver and fold—paper, tracing paper, and duvets—incomplete structures are formed, exposing the moment when immaterial signals translate into somatic sensations through sound and vibration.",
      metadata: [
        {
          label: { ko: "형식", en: "Format" },
          value: { ko: "사운드 설치, 접이식 종이 구조", en: "Sound Installation, Deployable Paper Structure" }
        },
        {
          label: { ko: "크기", en: "Dimensions" },
          value: { ko: "가변 크기", en: "Variable Dimensions" }
        },
        {
          label: { ko: "재료", en: "Materials" },
          value: { ko: "트레이싱지, 종이 지지대, 진동 스피커, 사운드", en: "Tracing Paper, Paper Stand, Tactile Vibration Speaker, Audio Player" }
        }
      ],
      media: [
        {
          id: "fe1-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "설치 전경: 진동 스피커와 공명하는 반투명 트레이싱지 및 종이 지지 구조체",
            en: "Installation view: Translucent tracing paper framework resonating with vibration speakers"
          },
          aspect: "landscape"
        },
        {
          id: "fe1-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop",
          caption: {
            ko: "구조 디테일: 접이식 결구부와 음향 진동 전달 접점",
            en: "Structural detail: Folded paper joints and acoustic excitation point"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "above-fingers-and-heads",
      titleKo: "손가락과 머리 위",
      titleEn: "Above Fingers and Heads",
      year: "2024",
      specKo: "사운드 설치와 이미지 (스테레오 사운드, 1분 38초)",
      specEn: "Sound installation and images (Stereo sound, 1 min 38 sec)",
      roleKo: "작가, 필드 레코딩 및 사운드 디자인",
      roleEn: "Artist, Field Recording & Sound Design",
      client: "스튜디오 설치 (Studio Installation)",
      descriptionKo: "《손가락과 머리 위》는 사람들이 떠난 아파트 옥상에 남겨진 안테나와 전파의 흔적에서 출발한 작업이다. 과거 주민들의 공유 공간이었던 옥상은 이제 통신 인프라가 점유하는 장소가 되었지만, 여전히 보이지 않는 신호들은 끊임없이 송수신되고 있다. 현장에서 수집한 전파음과 라디오 수신음, 발자국 소리로 구성된 사운드와 사진으로 이루어지며, 관객은 신호가 공간을 점유하는 방식을 경험한다. 공동체가 사라진 자리에도 남아 있는 흔적과 신호를 통해 존재와 부재의 관계를 탐구한다.",
      descriptionEn: "Above Fingers and Heads originates from traces of antennas and radio waves left on the rooftops of vacated apartments. While rooftops once served as shared communal spaces for residents, they are now occupied by telecommunications infrastructure; yet invisible signals continue to transmit and receive ceaselessly. Composed of photographs alongside sounds gathered on-site—radio noise, RF static, and footsteps—the audience experiences how signals occupy space. Through lingering traces and transmissions where community has dissipated, the work explores the relationship between presence and absence.",
      metadata: [
        {
          label: { ko: "러닝 타임", en: "Duration" },
          value: { ko: "1분 38초 (스테레오 루프)", en: "1 min 38 sec (Stereo Loop)" }
        },
        {
          label: { ko: "형식", en: "Medium" },
          value: { ko: "사운드 설치와 이미지", en: "Sound Installation & Photographic Still" }
        }
      ],
      media: [
        {
          id: "afh-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "사진 스틸: 잠긴 아파트 옥상에 거치된 무선 통신 기지국 철탑",
            en: "Photographic still: Locked apartment rooftop telecommunication mast"
          },
          aspect: "landscape"
        },
        {
          id: "afh-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop",
          caption: {
            ko: "전자기 간섭 신호의 주파수 스펙트로그램 시각화",
            en: "Spectrogram visualizer tracking electromagnetic signal harmonics"
          },
          aspect: "portrait"
        }
      ]
    },
    {
      id: "light-and-thick",
      titleKo: "가볍고 두꺼운",
      titleEn: "Light and Thick",
      year: "2024",
      specKo: "사운드 설치, 5채널 스피커, 1분 38초",
      specEn: "Sound installation, 5-channel speakers, 1 min 38 sec",
      roleKo: "작가 및 사운드 작곡",
      roleEn: "Artist & Sound Composer",
      client: "스튜디오 설치 (Studio Installation)",
      descriptionKo: "《가볍고 두꺼운》은 온라인 생존 게임과 암호화폐 채굴 환경에서 경험한 노동과 거래의 구조를 바탕으로 제작한 작업이다. 많은 생존 게임의 첫 단계인 곡괭이질과 스마트폰 암호화폐 채굴 어플을 통해 화면 속에서 노동하는 사람들을 생각한다. 5개의 스피커에서는 끝나지 않는 거래의 소리가 반복되며, 가상과 현실에 걸쳐 데이터가 만들어지는 과정 뒤에 존재하는 시간과 물질적 노동의 흔적을 드러낸다.",
      descriptionEn: "Light and Thick was created based on the structures of labor and transactions experienced in online survival games and cryptocurrency mining. It contemplates people laboring within screens through the pickaxing fundamental to early survival gameplay and mobile crypto mining apps. Across five speakers, the endless audio of transactions loops repeatedly, unveiling the traces of time and material labor underlying data generation spanning the virtual and physical realms.",
      metadata: [
        {
          label: { ko: "채널", en: "Channels" },
          value: { ko: "5채널 사운드 설치", en: "5-channel Audio Installation" }
        },
        {
          label: { ko: "시간", en: "Duration" },
          value: { ko: "1분 38초", en: "1 min 38 sec" }
        }
      ],
      media: [
        {
          id: "lat-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "저주파 신호로 공명하는 알루미늄 박판과 체결된 음향 트랜스듀서",
            en: "Acoustic transducer clamped to sheet aluminum resonating with sub-bass pulses"
          },
          aspect: "landscape"
        },
        {
          id: "lat-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "부유하는 음향 트랜스듀서와 다채널 공간 사운드 설치 전경",
            en: "Multi-channel spatial audio installation view with suspended transducers"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "light-and-thick-2",
      titleKo: "가볍고 두꺼운 2",
      titleEn: "Light and Thick 2",
      year: "2024",
      specKo: "모노프린트, 두꺼운 종이 위 조각, 30x45cm 등 (6점 1세트)",
      specEn: "Monoprint, carving on heavy paper, 30 × 45 cm series (Set of 6)",
      roleKo: "작가, 판화 제작",
      roleEn: "Artist, Printmaker",
      client: "스튜디오 연작 (Studio Series)",
      descriptionKo: "암호화폐 채굴 과정에 존재하는 정확한 숫자 데이터와 허상의 믿음이 존재하는 지점을 살핀다. 화성의 땅을 살 수 있다는 믿음으로 모니터 속 땅을 팠지만 남은 것은 상장되지 않은 숫자 조각이었다. 익명의 숫자 데이터가 아닌 돌과 모래, 화석과 비행운, 어플 속 복제된 화성의 이미지를 두꺼운 종이 위로 한 겹씩 파내어 상을 만들었다. 비물질적 데이터의 이면에 요구되는 지구와 암석과의 깊은 결속을 탐구한다.",
      descriptionEn: "Examining the intersection between exact numerical data and illusory belief within the cryptocurrency mining process. With the belief that one could purchase Martian land, users dug virtual soil inside monitors, yet what remained were unlisted numeric fragments. Rather than anonymous numeric data, images of stone, sand, fossils, vapor trails, and replicated Martian terrain from apps are carved layer by layer into thick paper to form impressions. It interrogates the deep tethering to the earth and rock demanded beneath immaterial data.",
      metadata: [
        {
          label: { ko: "형식", en: "Format" },
          value: { ko: "모노프린트, 두꺼운 종이 위 조각", en: "Monoprint on Carved Heavy Paper" }
        },
        {
          label: { ko: "크기", en: "Dimensions" },
          value: { ko: "30 × 45 cm (Set of 6)", en: "30 × 45 cm 등" }
        }
      ],
      media: [
        {
          id: "lat2-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "부조 판화 상세: 두터운 코튼지 위에 압착된 행성 지형 윤곽선",
            en: "Relief print detail: Carved planetary land contours pressed on heavy cotton paper"
          },
          aspect: "landscape"
        },
        {
          id: "lat2-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "연작 기록: 디지털 지형 데이터를 물리적 종이 위로 전사한 모노프린트 상",
            en: "Series documentation: Monoprint impressions tracing digital topography"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "rule-book",
      titleKo: "룰 북",
      titleEn: "Rule Book",
      year: "2022",
      specKo: "룰북, 반응형 주사위, 아카이브 설치",
      specEn: "Rulebook, interactive dice, archive installation",
      roleKo: "작가, 게임 마스터, 북 디자이너",
      roleEn: "Artist, Game Master, Book Designer",
      client: "스튜디오 설치 (Studio Installation)",
      descriptionKo: "TRPG(테이블탑 롤플레잉 게임)의 세계를 구성하는 사물과 규칙을 다룬 작업이다. 플레이어들이 정해진 룰북의 섬세한 규칙 위에서 협동하며 하나의 세계를 경험하는 방식에 주목한다. 관객은 플레이어의 위치를 점유하며 사물이 본래의 능동적/주체적 위치를 망각하고 기능 상실의 세계로 진입하는 과정을 경험한다.",
      descriptionEn: "Addresses the objects and rules that construct the world of TRPGs (Tabletop Role Playing Games). It focuses on how players experience a collective world through collaboration built upon delicate rulebook protocols. Occupying the position of a player, the audience witnesses the process through which objects relinquish their active and subjective roles, entering a state of functional obsolescence.",
      metadata: [
        {
          label: { ko: "형식", en: "Format" },
          value: { ko: "룰북, 반응형 주사위, 아카이브 설치", en: "Rulebook & Interactive Installation" }
        }
      ],
      media: [
        {
          id: "rb-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "참여자 게임 테이블 위에 펼쳐진 타이포그래피 룰 북",
            en: "Typographic rulebook open on participant game table"
          },
          aspect: "landscape"
        },
        {
          id: "rb-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
          caption: {
            ko: "아카이브 설치: 반응형 주사위 장치와 룰북 프로토콜 기록",
            en: "Archive installation: Reactive dice apparatus and protocol logs"
          },
          aspect: "landscape"
        }
      ]
    }
  ],
  projects: [
    {
      id: "incheon-artlab-2026",
      titleKo: "인천아트플랫폼 기획대관 전시 — <눈자리나게, 이어>",
      titleEn: "Incheon Art Platform Exhibition — <Lingering Traces Linked>",
      roleKo: "전시 기획, 비디오·사운드·설치 제작 및 공간 구성",
      roleEn: "Exhibition Planning, Video·Sound·Installation Production & Spatial Scenography",
      period: "2026.07 – 08",
      contextKo: "오프-룹 (Off-loop) / 인천아트플랫폼",
      contextEn: "Off-loop / Incheon Art Platform",
      descriptionKo: "인천아트플랫폼과 개항장 일대의 역사·문화적 맥락을 바탕으로 전시를 기획하고, 비디오·사운드·설치 작업의 제작 및 공간 구성을 총괄했다. 작품 간의 관계와 동선을 고려한 환경을 구축하고, 시민참여 워크숍 운영과 함께 전시 전경 및 제작 과정을 시각적으로 아카이빙했다.\n\n개항장 일대의 유휴 창고와 벽돌 구조물에 머무는 보이지 않는 전파, 옥상 인프라, 도시 보행자의 이동 궤적을 하나의 다감각적 설치 시노그래피로 엮어냈다.",
      descriptionEn: "Curated an exhibition grounded in the historical and cultural context of the Incheon Art Platform and the historic port area, overseeing the production and spatial configuration of video, sound, and installation works. Designed an environment considering inter-work spatial dialogues and visitor pathways, conducted participatory workshops with citizens, and visually archived exhibition views and development processes.\n\nConnecting invisible radio frequencies, telecommunication masts on vacant warehouses, and pedestrian paths into a unified multisensory scenography.",
      link: "https://inartplatform.kr/",
      linkLabel: {
        ko: "인천아트플랫폼 공식 전시 아카이브 ↗",
        en: "Visit Incheon Art Platform Exhibition Archive ↗"
      },
      media: [
        {
          id: "iap-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "공간 구성 및 조명 셋업: 인천아트플랫폼 전시장 전경",
            en: "Spatial configuration & lighting setup: Incheon Art Platform Artlab"
          },
          aspect: "landscape"
        },
        {
          id: "iap-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "설치 전경: 부유하는 음향 장치와 관람 동선",
            en: "Installation view: Suspended sound apparatus and visitor pathway"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "beyond-stage-2026",
      titleKo: "국제 예술·문화 교류 레지던시 — 《Beyond Stage 2026》",
      titleEn: "International Arts & Cultural Exchange Residency — 《Beyond Stage 2026》",
      roleKo: "참여 작가 겸 최종 성과 전시 총괄 기획·큐레이터, 운영팀 디자이너",
      roleEn: "Participating Artist, Chief Curator & Operating Team Designer",
      period: "2026.06 – 10",
      contextKo: "Hong Kong Art Market & International Residency",
      contextEn: "Hong Kong Art Market & International Residency",
      descriptionKo: "한국-홍콩 아티스트 교류 레지던시 《Beyond Stage》에 아티스트로 참여함과 동시에, 양국 작가들의 작업 세계를 아우르는 최종 결과 보고 전시의 총괄 기획 및 큐레이션을 담당했다. 4일간의 집중 레지던시 내 창작 작업을 수행하고 양국 참여 작가들의 작업을 하나의 담론으로 엮는 전시 콘셉트 도출 및 공간 큐레이션을 이끌었다.\n\n도시 간 이동과 언어적 장벽을 매개하는 사운드 아카이브와 양국 작가들의 공동 설치를 총괄 지휘했다.",
      descriptionEn: "Participated as an artist in the Korea-Hong Kong artist exchange residency 《Beyond Stage》 while concurrently directing and curating the final exhibition encompassing the practices of artists from both countries. Carried out studio work during a four-day intensive residency, formulated the curatorial discourse uniting participating artists, and directed spatial scenography.\n\nCoordinating bilingual editorial publications, cross-border sound archives, and collaborative spatial interventions between Korean and Hong Kong creative practitioners.",
      link: "https://www.instagram.com/sarrg_/",
      linkLabel: {
        ko: "홍콩 레지던시 결과 보고 아카이브 ↗",
        en: "View Hong Kong Residency Outcome Documentation ↗"
      },
      media: [
        {
          id: "bs-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "레지던시 성과 보고 전시 전경: 홍콩 아트 마켓",
            en: "Residency outcome exhibition view: Hong Kong Art Market"
          },
          aspect: "landscape"
        },
        {
          id: "bs-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "큐레이토리얼 공간 구성 및 양국 작가 도록 아카이브",
            en: "Curatorial spatial dialogue and bilingual publication records"
          },
          aspect: "landscape"
        }
      ]
    },
    {
      id: "gallery-175-archiving",
      titleKo: "현대미술 갤러리 아카이빙 & 공간 기록 — 《Gallery 175》",
      titleEn: "Contemporary Art Gallery Archiving & Spatial Documentation — 《Gallery 175》",
      roleKo: "전시 설치·해체, 사진 및 영상 콘텐츠 제작, 아카이빙",
      roleEn: "Exhibition Installation, Photo & Video Content Production, Archiving",
      period: "2022.03 – 2023.01",
      contextKo: "갤러리 175 (Gallery 175)",
      contextEn: "Gallery 175",
      descriptionKo: "현대미술 갤러리에서 전시 설치·해체와 운영을 진행하며, 작품과 공간을 기록하는 사진 및 영상 콘텐츠를 제작했다. 전시 전경과 관람 환경을 관찰하며 시각예술 현장을 이미지와 디지털 아카이브로 전달하는 역할을 수행했다.\n\n작가 포트폴리오 디지털화, 조명 및 벽면 도색 등 인스톨레이션 실무를 체계적으로 데이터베이스화했다.",
      descriptionEn: "Managed exhibition installation, de-installation, and gallery operations at a contemporary art gallery, producing photographic and video content documenting works and architectural spaces. Observed exhibition settings and visitor environments to communicate contemporary visual art practice through imagery and digital archives.\n\nSystematizing artists' portfolio documentation, exhibition scenography records, and contemporary visual art archives.",
      link: "https://www.karts.ac.kr",
      linkLabel: {
        ko: "갤러리 175 아카이빙 기록 보기 ↗",
        en: "View Gallery 175 Documentation Records ↗"
      },
      media: [
        {
          id: "g175-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "갤러리 175 실내 공간 기록 및 전시 설치 전경",
            en: "Gallery 175 interior documentation and installation records"
          },
          aspect: "landscape"
        },
        {
          id: "g175-2",
          type: "image",
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
          caption: {
            ko: "디지털 아카이브 콘텐츠 및 작가 포트폴리오 정리",
            en: "Digital media archiving and publication records"
          },
          aspect: "landscape"
        }
      ]
    }
  ],
  contacts: {
    email: "glass.gkim@gmail.com",
    instagram: "https://www.instagram.com/sarrg_/",
    locationKo: "서울, 대한민국",
    locationEn: "Seoul, Republic of Korea"
  }
};

export const profileData: ProfileData = (initialContent as unknown as ProfileData) || defaultProfileData;

export default profileData;
