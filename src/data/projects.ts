export type Language = 'en' | 'ko';

export interface LocalizedString {
  en: string;
  ko: string;
}

export type SectionType = 'works' | 'projects' | 'exhibitions';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: LocalizedString;
  aspect?: 'landscape' | 'portrait' | 'square' | 'video';
}

export interface ProjectMetadata {
  label: LocalizedString;
  value: LocalizedString;
}

export interface ProjectCredit {
  role: LocalizedString;
  name: string;
}

export type ProjectCategory = 'All' | 'Performance' | 'Installation' | 'Digital' | 'Editorial' | 'Identity';

export interface Project {
  id: string;
  section: SectionType;
  year: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  category: ProjectCategory;
  medium: LocalizedString;
  role: LocalizedString;
  client: string;
  thumbnail: string;
  overview: LocalizedString;
  media: MediaItem[];
  metadata?: ProjectMetadata[];
  credits?: ProjectCredit[];
}

export interface ResearchProject {
  id: string;
  year: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  staggeredImages: {
    url: string;
    caption?: LocalizedString;
  }[];
  essay: {
    en: string[];
    ko: string[];
  };
  metadata?: ProjectMetadata[];
}

export interface TextPublication {
  id: string;
  year: string;
  tag: LocalizedString;
  title: LocalizedString;
  langNotice: string;
  publication?: LocalizedString;
  body: {
    en: string[];
    ko: string[];
  };
}

export interface CVColumnItem {
  heading: LocalizedString;
  subheading?: LocalizedString;
  period?: string;
  details?: LocalizedString;
}

export interface CVData {
  artistName: LocalizedString;
  statement: LocalizedString;
  statementParagraphs?: {
    en: string[];
    ko: string[];
  };
  portraitPhotos: string[];
  columns: {
    column1: {
      title: LocalizedString;
      items: CVColumnItem[];
    };
    column2: {
      title: LocalizedString;
      items: CVColumnItem[];
    };
    column3: {
      title: LocalizedString;
      items: CVColumnItem[];
    };
    column4: {
      title: LocalizedString;
      items: CVColumnItem[];
    };
  };
  contact: {
    email: string;
    instagram: string;
    photographyArchive: string;
    locationText: LocalizedString;
  };
}

export interface SiteConfig {
  name: LocalizedString;
  artistName: LocalizedString;
  splashTitle: LocalizedString;
  title: LocalizedString;
  location: LocalizedString;
  timeZone: string;
  tagline: LocalizedString;
  statement: LocalizedString;
  contact: {
    email: string;
    instagram: string;
    photographyArchive: string;
    locationText: LocalizedString;
  };
}

export const siteConfig: SiteConfig = {
  name: {
    en: "glass.gkim",
    ko: "김유리"
  },
  artistName: {
    en: "Yuri Kim (glass.gkim)",
    ko: "김유리 (glass.gkim)"
  },
  splashTitle: {
    en: "김유리 — Yuri Kim",
    ko: "김유리 — Yuri Kim"
  },
  title: {
    en: "archive",
    ko: "아카이브"
  },
  tagline: {
    en: "Selected fine art, single-channel video, sound installations, and research records.",
    ko: "미술 작업, 단채널 영상, 사운드 인스톨레이션, 리서치 기록 아카이브입니다."
  },
  location: {
    en: "Seoul, KR",
    ko: "서울, 대한민국"
  },
  timeZone: "Asia/Seoul",
  statement: {
    en: "My practice investigates how invisible signals and physical traces evoke the perception of existence, shaping spatial awareness and human relations. Departing from experiences of voice chat in online survival games, data obsolescence, and shared collective memory, I construct video, sound, and spatial installation works. Recently, my work has expanded toward observing the residual marks invisible signals leave across spaces and the delicate ways people form and maintain relations.",
    ko: "신호와 흔적이 어떻게 존재를 감각하게 만들고 공간과 관계를 구성하는지에 관심을 가지고 작업한다. 온라인 생존 게임에서 경험한 음성 채팅, 데이터의 소멸, 공동체의 기억과 같은 경험을 출발점으로 영상, 사운드, 설치 작업을 진행하고 있다. 최근에는 보이지 않는 신호가 공간에 남기는 흔적과 사람들이 관계를 형성하고 유지하는 방식에 주목하며 작업을 확장하고 있다."
  },
  contact: {
    email: "glass.gkim@gmail.com",
    instagram: "https://www.instagram.com/sarrg_/",
    photographyArchive: "https://www.instagram.com/sarrg_/",
    locationText: {
      en: "Seoul, Republic of Korea",
      ko: "대한민국 서울"
    }
  }
};

// =========================================================================
// 1. WORKS (Major Fine Art & Studio Pieces for Template 4)
// =========================================================================
export const projects: Project[] = [
  {
    id: "folding-for-two",
    section: "works",
    year: "2026",
    title: {
      en: "Folding for Two",
      ko: "두 명을 위한 접기"
    },
    subtitle: {
      en: "Video installation, single-channel video, mattress, duvet, sound, 23 min 30 sec",
      ko: "비디오 설치, 단채널 비디오, 매트리스, 이불, 사운드, 23분 30초"
    },
    category: "Installation",
    medium: {
      en: "Video installation, single-channel video, mattress, duvet, sound, 23 min 30 sec",
      ko: "비디오 설치, 단채널 비디오, 매트리스, 이불, 사운드, 23분 30초"
    },
    role: {
      en: "Artist, Direction & Sound Scenography",
      ko: "작가, 연출 및 사운드 시노그래피"
    },
    client: "Incheon Art Platform / Studio",
    thumbnail: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Folding for Two begins from the sense of places that can no longer be reached or whose existence cannot be certain. The work comprises a video documenting two performers folding and unfolding a single duvet, along with an installation. Without sharing a predetermined folding system, the performers rely on their respective memories and sensations to construct a structure. The sequence and direction of folds are continually adjusted, existing as an ephemeral state sustained between two bodies rather than a finished result. Because a cotton duvet does not easily retain creased folds, the performers must alternately remember the previous form to sustain the structure. I sought to translate the sensation of immaterial presence and relationships experienced in online spaces into physical actions.",
      ko: "《두 명을 위한 접기》는 더 이상 도달할 수 없거나 실재를 확신할 수 없는 장소에 대한 감각에서 출발한다. 작업은 두 명의 퍼포머가 하나의 이불을 접고 펼치는 과정을 기록한 영상과 설치로 구성된다. 퍼포머들은 동일한 접기 체계를 공유하지 않은 채 각자의 기억과 감각에 의존하여 구조를 만들어간다. 접기의 순서와 방향은 끊임없이 수정되며, 구조는 완성된 결과보다 두 사람 사이에서 잠시 유지되는 상태로 존재한다. 특히 솜 이불은 접힌 흔적이 쉽게 남지 않기 때문에, 퍼포머들은 직전의 형태를 서로 번갈아 기억하며 구조를 지속해야 한다. 나는 온라인 공간에서 경험한 비물질적 현존과 관계의 감각을 물리적인 행위로 번역하고자 했다."
    },
    media: [
      {
        id: "fft-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Installation view: Mattress plinth with suspended single-channel video projection",
          ko: "설치 전경: 매트리스 좌대와 단채널 영상 프로젝션"
        },
        aspect: "landscape"
      },
      {
        id: "fft-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1400&auto=format&fit=crop",
        caption: {
          en: "Video still: Unsynchronized duvet corner alignment sequence",
          ko: "영상 스틸: 비동기화된 이불 모서리 맞춤 시퀀스"
        },
        aspect: "landscape"
      }
    ],
    metadata: [
      {
        label: { en: "Duration", ko: "러닝 타임" },
        value: { en: "23 min 30 sec (Continuous Loop)", ko: "23분 30초 (연속 루프)" }
      },
      {
        label: { en: "Dimensions", ko: "설치 면적" },
        value: { en: "Variable Installation Dimensions", ko: "가변 크기 설치" }
      },
      {
        label: { en: "Materials", ko: "주요 매체" },
        value: { en: "Mattress, Cotton Duvet, Single-channel Video, Sound", ko: "매트리스, 솜 이불, 단채널 비디오, 사운드" }
      }
    ]
  },
  {
    id: "folding-engine-1-car-1",
    section: "works",
    year: "2026",
    title: {
      en: "Folding Engine 1 of Car 1",
      ko: "자동차1의 접이식 엔진1"
    },
    subtitle: {
      en: "Tracing paper, paper support, vibration speaker, sound installation, variable dimensions",
      ko: "트레이싱지, 종이 지지대, 진동 스피커, 사운드 설치, 가변크기"
    },
    category: "Installation",
    medium: {
      en: "Tracing paper, paper support, vibration speaker, sound installation, variable dimensions",
      ko: "트레이싱지, 종이 지지대, 진동 스피커, 사운드 설치, 가변크기"
    },
    role: {
      en: "Artist, Structural & Sound Scenography",
      ko: "작가, 구조 설계 및 사운드 시노그래피"
    },
    client: "Studio Installation",
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Folding Engine 1 of Car 1 combines the virtual engine sound of an electric car with the deployable folding structures of aerospace engineering, addressing structures of existence sensed prior to physical substance. The recurring motif of 'folding' functions as an apparatus revealing contemporary modes of existence. Much like deployable space structures, contemporary relations and presences are not fixed forms, but states continuously unfolding and held in provisional equilibrium. Utilizing materials that easily waver and fold—paper, tracing paper, and duvets—incomplete structures are formed, exposing the moment when immaterial signals translate into somatic sensations through sound and vibration.",
      ko: "《자동차1의 접이식 엔진1》은 전기자동차의 가상 엔진 사운드와 우주 공학의 접이식 구조를 결합하여, 실체보다 먼저 감각되는 존재의 구조를 다룬다. 작업 안에서 반복적으로 등장하는 접기(Folding)의 구조는 오늘날의 존재 방식을 드러내기 위한 장치이다. 우주 공학의 접이식 구조처럼 오늘날의 관계와 존재는 완전히 고정된 형태라기보다, 끊임없이 전개되고 잠정적으로 유지되는 상태에 가깝다. 종이와 트레이싱지, 이불처럼 쉽게 흔들리고 접히는 재료들을 사용해 불완전한 구조를 만들고, 사운드와 진동을 통해 비물질적 신호가 물리적 감각으로 전환되는 순간을 드러내고자 한다."
    },
    media: [
      {
        id: "fe1-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Installation view: Translucent tracing paper framework resonating with vibration speakers",
          ko: "설치 전경: 진동 스피커와 공명하는 반투명 트레이싱지 및 종이 지지 구조체"
        },
        aspect: "landscape"
      },
      {
        id: "fe1-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop",
        caption: {
          en: "Structural detail: Folded paper joints and acoustic excitation point",
          ko: "구조 디테일: 접이식 결구부와 음향 진동 전달 접점"
        },
        aspect: "landscape"
      }
    ],
    metadata: [
      {
        label: { en: "Format", ko: "형식" },
        value: { en: "Sound Installation, Deployable Paper Structure", ko: "사운드 설치, 접이식 종이 구조" }
      },
      {
        label: { en: "Dimensions", ko: "크기" },
        value: { en: "Variable Dimensions", ko: "가변 크기" }
      },
      {
        label: { en: "Materials", ko: "재료" },
        value: { en: "Tracing Paper, Paper Stand, Tactile Vibration Speaker, Audio Player", ko: "트레이싱지, 종이 지지대, 진동 스피커, 사운드" }
      }
    ]
  },
  {
    id: "above-fingers-and-heads",
    section: "works",
    year: "2024",
    title: {
      en: "Above Fingers and Heads",
      ko: "손가락과 머리 위"
    },
    subtitle: {
      en: "Sound installation and images (Stereo sound, 1 min 38 sec)",
      ko: "사운드 설치와 이미지 (스테레오 사운드, 1분 38초)"
    },
    category: "Installation",
    medium: {
      en: "Sound installation and images (Stereo sound, 1 min 38 sec)",
      ko: "사운드 설치와 이미지 (스테레오 사운드, 1분 38초)"
    },
    role: {
      en: "Artist, Field Recording & Sound Design",
      ko: "작가, 필드 레코딩 및 사운드 디자인"
    },
    client: "Studio Installation",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Above Fingers and Heads originates from traces of antennas and radio waves left on the rooftops of vacated apartments. While rooftops once served as shared communal spaces for residents, they are now occupied by telecommunications infrastructure; yet invisible signals continue to transmit and receive ceaselessly. Composed of photographs alongside sounds gathered on-site—radio noise, RF static, and footsteps—the audience experiences how signals occupy space. Through lingering traces and transmissions where community has dissipated, the work explores the relationship between presence and absence.",
      ko: "《손가락과 머리 위》는 사람들이 떠난 아파트 옥상에 남겨진 안테나와 전파의 흔적에서 출발한 작업이다. 과거 주민들의 공유 공간이었던 옥상은 이제 통신 인프라가 점유하는 장소가 되었지만, 여전히 보이지 않는 신호들은 끊임없이 송수신되고 있다. 현장에서 수집한 전파음과 라디오 수신음, 발자국 소리로 구성된 사운드와 사진으로 이루어지며, 관객은 신호가 공간을 점유하는 방식을 경험한다. 공동체가 사라진 자리에도 남아 있는 흔적과 신호를 통해 존재와 부재의 관계를 탐구한다."
    },
    media: [
      {
        id: "afh-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Photographic still: Locked apartment rooftop telecommunication mast",
          ko: "사진 스틸: 잠긴 아파트 옥상에 거치된 무선 통신 기지국 철탑"
        },
        aspect: "landscape"
      },
      {
        id: "afh-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop",
        caption: {
          en: "Spectrogram visualizer tracking electromagnetic signal harmonics",
          ko: "전자기 간섭 신호의 주파수 스펙트로그램 시각화"
        },
        aspect: "portrait"
      }
    ],
    metadata: [
      {
        label: { en: "Duration", ko: "러닝 타임" },
        value: { en: "1 min 38 sec (Stereo Loop)", ko: "1분 38초 (스테레오 루프)" }
      },
      {
        label: { en: "Medium", ko: "형식" },
        value: { en: "Sound Installation & Photographic Still", ko: "사운드 설치와 이미지" }
      }
    ]
  },
  {
    id: "light-and-thick",
    section: "works",
    year: "2024",
    title: {
      en: "Light and Thick",
      ko: "가볍고 두꺼운"
    },
    subtitle: {
      en: "Sound installation, 5-channel speakers, 1 min 38 sec",
      ko: "사운드 설치, 5채널 스피커, 1분 38초"
    },
    category: "Installation",
    medium: {
      en: "Sound installation, 5-channel speakers, 1 min 38 sec",
      ko: "사운드 설치, 5채널 스피커, 1분 38초"
    },
    role: {
      en: "Artist & Sound Composer",
      ko: "작가 및 사운드 작곡"
    },
    client: "Studio Installation",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Light and Thick was created based on the structures of labor and transactions experienced in online survival games and cryptocurrency mining. It contemplates people laboring within screens through the pickaxing fundamental to early survival gameplay and mobile crypto mining apps. Across five speakers, the endless audio of transactions loops repeatedly, unveiling the traces of time and material labor underlying data generation spanning the virtual and physical realms.",
      ko: "《가볍고 두꺼운》은 온라인 생존 게임과 암호화폐 채굴 환경에서 경험한 노동과 거래의 구조를 바탕으로 제작한 작업이다. 많은 생존 게임의 첫 단계인 곡괭이질과 스마트폰 암호화폐 채굴 어플을 통해 화면 속에서 노동하는 사람들을 생각한다. 5개의 스피커에서는 끝나지 않는 거래의 소리가 반복되며, 가상과 현실에 걸쳐 데이터가 만들어지는 과정 뒤에 존재하는 시간과 물질적 노동의 흔적을 드러낸다."
    },
    media: [
      {
        id: "lat-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Acoustic transducer clamped to sheet aluminum resonating with sub-bass pulses",
          ko: "저주파 신호로 공명하는 알루미늄 박판과 체결된 음향 트랜스듀서"
        },
        aspect: "landscape"
      },
      {
        id: "lat-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Multi-channel spatial audio installation view with suspended transducers",
          ko: "부유하는 음향 트랜스듀서와 다채널 공간 사운드 설치 전경"
        },
        aspect: "landscape"
      }
    ],
    metadata: [
      {
        label: { en: "Channels", ko: "채널" },
        value: { en: "5-channel Audio Installation", ko: "5채널 사운드 설치" }
      },
      {
        label: { en: "Duration", ko: "시간" },
        value: { en: "1 min 38 sec", ko: "1분 38초" }
      }
    ]
  },
  {
    id: "light-and-thick-2",
    section: "works",
    year: "2024",
    title: {
      en: "Light and Thick 2",
      ko: "가볍고 두꺼운 2"
    },
    subtitle: {
      en: "Monoprint, carving on heavy paper, 30 × 45 cm series (Set of 6)",
      ko: "모노프린트, 두꺼운 종이 위 조각, 30x45cm 등 (6점 1세트)"
    },
    category: "Editorial",
    medium: {
      en: "Monoprint, carving on heavy paper, 30 × 45 cm series (Set of 6)",
      ko: "모노프린트, 두꺼운 종이 위 조각, 30x45cm 등 (6점 1세트)"
    },
    role: {
      en: "Artist, Printmaker",
      ko: "작가, 판화 제작"
    },
    client: "Studio Series",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Examining the intersection between exact numerical data and illusory belief within the cryptocurrency mining process. With the belief that one could purchase Martian land, users dug virtual soil inside monitors, yet what remained were unlisted numeric fragments. Rather than anonymous numeric data, images of stone, sand, fossils, vapor trails, and replicated Martian terrain from apps are carved layer by layer into thick paper to form impressions. It interrogates the deep tethering to the earth and rock demanded beneath immaterial data.",
      ko: "암호화폐 채굴 과정에 존재하는 정확한 숫자 데이터와 허상의 믿음이 존재하는 지점을 살핀다. 화성의 땅을 살 수 있다는 믿음으로 모니터 속 땅을 팠지만 남은 것은 상장되지 않은 숫자 조각이었다. 익명의 숫자 데이터가 아닌 돌과 모래, 화석과 비행운, 어플 속 복제된 화성의 이미지를 두꺼운 종이 위로 한 겹씩 파내어 상을 만들었다. 비물질적 데이터의 이면에 요구되는 지구와 암석과의 깊은 결속을 탐구한다."
    },
    media: [
      {
        id: "lat2-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Relief print detail: Carved planetary land contours pressed on heavy cotton paper",
          ko: "부조 판화 상세: 두터운 코튼지 위에 압착된 행성 지형 윤곽선"
        },
        aspect: "landscape"
      },
      {
        id: "lat2-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Series documentation: Monoprint impressions tracing digital topography",
          ko: "연작 기록: 디지털 지형 데이터를 물리적 종이 위로 전사한 모노프린트 상"
        },
        aspect: "landscape"
      }
    ],
    metadata: [
      {
        label: { en: "Format", ko: "형식" },
        value: { en: "Monoprint on Carved Heavy Paper", ko: "모노프린트, 두꺼운 종이 위 조각" }
      },
      {
        label: { en: "Dimensions", ko: "크기" },
        value: { en: "30 × 45 cm (Set of 6)", ko: "30 × 45 cm 등" }
      }
    ]
  },
  {
    id: "rule-book",
    section: "works",
    year: "2022",
    title: {
      en: "Rule Book",
      ko: "룰 북"
    },
    subtitle: {
      en: "Rulebook, interactive dice, archive installation",
      ko: "룰북, 반응형 주사위, 아카이브 설치"
    },
    category: "Editorial",
    medium: {
      en: "Rulebook, interactive dice, archive installation",
      ko: "룰북, 반응형 주사위, 아카이브 설치"
    },
    role: {
      en: "Artist, Game Master, Book Designer",
      ko: "작가, 게임 마스터, 북 디자이너"
    },
    client: "Studio Installation",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop",
    overview: {
      en: "Addresses the objects and rules that construct the world of TRPGs (Tabletop Role Playing Games). It focuses on how players experience a collective world through collaboration built upon delicate rulebook protocols. Occupying the position of a player, the audience witnesses the process through which objects relinquish their active and subjective roles, entering a state of functional obsolescence.",
      ko: "TRPG(테이블탑 롤플레잉 게임)의 세계를 구성하는 사물과 규칙을 다룬 작업이다. 플레이어들이 정해진 룰북의 섬세한 규칙 위에서 협동하며 하나의 세계를 경험하는 방식에 주목한다. 관객은 플레이어의 위치를 점유하며 사물이 본래의 능동적/주체적 위치를 망각하고 기능 상실의 세계로 진입하는 과정을 경험한다."
    },
    media: [
      {
        id: "rb-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Typographic rulebook open on participant game table",
          ko: "참여자 게임 테이블 위에 펼쳐진 타이포그래피 룰 북"
        },
        aspect: "landscape"
      },
      {
        id: "rb-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
        caption: {
          en: "Archive installation: Reactive dice apparatus and protocol logs",
          ko: "아카이브 설치: 반응형 주사위 장치와 룰북 프로토콜 기록"
        },
        aspect: "landscape"
      }
    ],
    metadata: [
      {
        label: { en: "Format", ko: "형식" },
        value: { en: "Rulebook & Interactive Installation", ko: "룰북, 반응형 주사위, 아카이브 설치" }
      }
    ]
  }
];

// =========================================================================
// 2. RESEARCH PROJECTS (For Template 2: Projects / Research)
// =========================================================================
export const researchProjects: ResearchProject[] = [
  {
    id: "incheon-artlab-2026",
    year: "2026",
    title: {
      en: "Incheon Art Platform Special Exhibition — <Lingering Traces Linked>",
      ko: "인천아트플랫폼 기획대관 전시 — <눈자리나게, 이어>"
    },
    subtitle: {
      en: "Exhibition Planning, Video·Sound·Installation Production & Spatial Configuration",
      ko: "전시 기획, 비디오·사운드·설치 제작 및 공간 구성"
    },
    staggeredImages: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Spatial configuration & lighting setup: Incheon Art Platform Artlab",
          ko: "공간 구성 및 조명 셋업: 인천아트플랫폼 전시장 전경"
        }
      },
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Installation view: Suspended sound apparatus and visitor pathway",
          ko: "설치 전경: 부유하는 음향 장치와 관람 동선"
        }
      }
    ],
    essay: {
      ko: [
        "인천아트플랫폼과 개항장 일대의 역사·문화적 맥락을 바탕으로 전시를 기획하고, 비디오·사운드·설치 작업의 제작 및 공간 구성을 총괄했다. 작품 간의 관계와 동선을 고려한 환경을 구축하고, 시민참여 워크숍 운영과 함께 전시 전경 및 제작 과정을 시각적으로 아카이빙했다."
      ],
      en: [
        "Curated an exhibition grounded in the historical and cultural context of the Incheon Art Platform and the historic port area, overseeing the production and spatial configuration of video, sound, and installation works. Designed an environment considering inter-work spatial dialogues and visitor pathways, conducted participatory workshops with citizens, and visually archived exhibition views and development processes."
      ]
    },
    metadata: [
      { label: { en: "Role", ko: "역할" }, value: { en: "Exhibition Planning, Video·Sound·Installation Production & Spatial Configuration", ko: "전시 기획, 비디오·사운드·설치 제작 및 공간 구성" } },
      { label: { en: "Context", ko: "소속/협력" }, value: { en: "Off-loop / Incheon Art Platform", ko: "오프-룹 (Off-loop) / 인천아트플랫폼" } },
      { label: { en: "Period", ko: "기간" }, value: { en: "2026.07 – 08", ko: "2026.07 – 08" } }
    ]
  },
  {
    id: "beyond-stage-2026",
    year: "2026",
    title: {
      en: "International Arts & Cultural Exchange Residency — 《Beyond Stage 2026》 (Hong Kong)",
      ko: "국제 예술·문화 교류 레지던시 프로그램 — 《Beyond Stage 2026》 (Hong Kong)"
    },
    subtitle: {
      en: "Participating Artist, Chief Curator & Operating Team Designer",
      ko: "참여 작가 겸 최종 성과 전시 총괄 기획·큐레이터, 운영팀 디자이너"
    },
    staggeredImages: [
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Residency outcome exhibition view: Hong Kong Art Market",
          ko: "레지던시 성과 보고 전시 전경: 홍콩 아트 마켓"
        }
      },
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Curatorial spatial dialogue and bilingual publication",
          ko: "큐레이토리얼 공간 구성 및 양국 작가 도록 아카이브"
        }
      }
    ],
    essay: {
      ko: [
        "한국-홍콩 아티스트 교류 레지던시 《Beyond Stage》에 아티스트로 참여함과 동시에, 양국 작가들의 작업 세계를 아우르는 최종 결과 보고 전시의 총괄 기획 및 큐레이션을 담당했다. 4일간의 집중 레지던시 내 창작 작업을 수행하고 양국 참여 작가들의 작업을 하나의 담론으로 엮는 전시 콘셉트 도출 및 공간 큐레이션을 이끌었다."
      ],
      en: [
        "Participated as an artist in the Korea-Hong Kong artist exchange residency 《Beyond Stage》 while concurrently directing and curating the final exhibition encompassing the practices of artists from both countries. Carried out studio work during a four-day intensive residency, formulated the curatorial discourse uniting participating artists, and directed spatial scenography."
      ]
    },
    metadata: [
      { label: { en: "Role", ko: "역할" }, value: { en: "Participating Artist, Chief Curator, Operating Team Designer", ko: "참여 작가 겸 최종 성과 전시 총괄 기획·큐레이터, 운영팀 디자이너" } },
      { label: { en: "Context", ko: "협력 기관" }, value: { en: "Hong Kong Art Market & International Residency", ko: "Hong Kong Art Market & International Residency" } },
      { label: { en: "Period", ko: "기간" }, value: { en: "2026.06 – 10", ko: "2026.06 – 10" } }
    ]
  },
  {
    id: "gallery-175-archiving",
    year: "2022",
    title: {
      en: "Contemporary Art Gallery Archiving & Spatial Documentation — 《Gallery 175》",
      ko: "현대미술 갤러리 아카이빙 & 공간 기록 — 《Gallery 175》"
    },
    subtitle: {
      en: "Exhibition Installation, Photo/Video Content Production & Archiving",
      ko: "전시 설치·해체, 사진 및 영상 콘텐츠 제작, 아카이빙"
    },
    staggeredImages: [
      {
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Gallery 175 interior documentation and installation records",
          ko: "갤러리 175 실내 공간 기록 및 전시 설치 전경"
        }
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        caption: {
          en: "Digital media archiving and publication records",
          ko: "디지털 아카이브 콘텐츠 및 작가 포트폴리오 정리"
        }
      }
    ],
    essay: {
      ko: [
        "현대미술 갤러리에서 전시 설치·해체와 운영을 진행하며, 작품과 공간을 기록하는 사진 및 영상 콘텐츠를 제작했다. 전시 전경과 관람 환경을 관찰하며 시각예술 현장을 이미지와 디지털 아카이브로 전달하는 역할을 수행했다."
      ],
      en: [
        "Managed exhibition installation, de-installation, and gallery operations at a contemporary art gallery, producing photographic and video content documenting works and architectural spaces. Observed exhibition settings and visitor environments to communicate contemporary visual art practice through imagery and digital archives."
      ]
    },
    metadata: [
      { label: { en: "Role", ko: "역할" }, value: { en: "Exhibition Installation, Photo & Video Content Production, Archiving", ko: "전시 설치·해체, 사진 및 영상 콘텐츠 제작, 아카이빙" } },
      { label: { en: "Context", ko: "기관" }, value: { en: "Gallery 175", ko: "갤러리 175 (Gallery 175)" } },
      { label: { en: "Period", ko: "기간" }, value: { en: "2022.03 – 2023.01", ko: "2022.03 – 2023.01" } }
    ]
  }
];

// =========================================================================
// 3. TEXTS & PUBLICATIONS (For Template 3: Texts)
// =========================================================================
export const texts: TextPublication[] = [
  {
    id: "text-folding-for-two",
    year: "2026",
    tag: { en: "(Artist Note)", ko: "(작가 노트)" },
    title: {
      en: "Working Notes: Folding for Two",
      ko: "《두 명을 위한 접기》 작업 노트"
    },
    langNotice: "(KR / EN)",
    publication: {
      en: "Studio Note, Seoul, 2026",
      ko: "스튜디오 작업 노트, 2026"
    },
    body: {
      ko: [
        "이불을 접는 일은 본래 사적인 침실에서 일어나는 일상적 노동이다. 그러나 두 사람이 각기 다른 모서리를 쥐고 호흡을 맞추기 시작할 때, 그것은 일종의 무언의 타협이자 물리적 안무가 된다.",
        "말을 섞지 않고 천의 당김과 무게만을 통해 상대의 힘을 짐작하는 과정. 한쪽이 너무 세게 당기면 모서리는 어긋나고, 너무 느슨하면 접힘의 선은 무너진다. 동기화 신호가 존재하지 않는 관계 속에서 두 몸이 만들어내는 불완전한 대칭성에 관한 기록이다."
      ],
      en: [
        "Folding a duvet is fundamentally a quiet, domestic chore confined to private bedrooms. Yet the moment two bodies grasp opposing corners without speaking, it turns into a tacit negotiation—a physical choreography.",
        "One gauges the partner's tension purely through tactile resistance and gravitational pull. Pull too sharply and the seam slips; yield too much and the crease dissolves. It is an account of fragile symmetry forged between two bodies lacking any pre-programmed synchronization protocol."
      ]
    }
  },
  {
    id: "text-noonjarinage",
    year: "2026",
    tag: { en: "(Curatorial Text)", ko: "(전시 서문)" },
    title: {
      en: "Curatorial Foreword: Connecting Snow Traces. Incheon Art Platform.",
      ko: "《눈자리나게, 이어》 기획의 글. 인천아트플랫폼."
    },
    langNotice: "(KR)",
    publication: {
      en: "Incheon Art Platform Artlab Catalog, 2026",
      ko: "인천아트플랫폼 아트랩 도록, 2026"
    },
    body: {
      ko: [
        "인천 개항장의 벽돌 창고들은 바다에서 불어오는 짠 바람과 함께 오랜 시간 굳어졌다. 그곳에 남겨진 것은 단순히 과거의 유산이 아니라, 끊임없이 현재의 지표를 재구성하는 비가시적 신호들이다.",
        "‘눈자리나게’라는 말은 눈이 녹아 땅의 속살이 드러나는 자리를 뜻한다. 우리는 공간의 틈새에 매달린 소리와 보행의 궤적을 통해, 단절되었던 도시의 시간들을 서로 잇고자 한다."
      ],
      en: [
        "The historic brick warehouses of Incheon's harbor district have weathered decades of salt air and trade routes. What remains is not static heritage, but an active field of invisible transmissions shaping current spatial awareness.",
        "The project takes inspiration from the vernacular term 'Noonjarinage'—the thaw revealing bare earth beneath winter snow. Through suspended acoustic transmitters and pedestrian tracks, the exhibition connects disparate temporalities across the city."
      ]
    }
  },
  {
    id: "text-base-stations",
    year: "2024",
    tag: { en: "(Essay)", ko: "(에세이)" },
    title: {
      en: "Telecom Base Stations and Rooftops: Signals Beyond Locked Doors",
      ko: "통신 기지국과 옥상: 닫힌 문 너머의 신호들."
    },
    langNotice: "(KR)",
    publication: {
      en: "Field Research Monograph, 2024",
      ko: "현장 리서치 모노그래프, 2024"
    },
    body: {
      ko: [
        "아파트 꼭대기 층에 서면 굳게 잠긴 철제 비상문 너머로 미세한 바람 소리가 들려온다. 관리사무소의 자물쇠로 잠겨 있는 옥상은 법적으로는 비상 대피로이지만, 현실에서는 통신 3사의 이동통신 기지국이 점유한 배타적 송신 구역이다.",
        "우리는 머리 위 수 미터 위에서 밤낮없이 쏟아지는 수백 기가헤르츠의 전파를 의식하지 못한 채 잠에 든다. 잠긴 문은 사적 안식처와 국가적 네트워크 인프라 사이의 보이지 않는 경계선이다."
      ],
      en: [
        "Standing on the top floor of a high-rise residential complex, a faint whistle of wind leaks through the padlocked steel fire escape door. Legally designated as an emergency egress, the rooftop is in truth an exclusive transmission terrace leased by cellular carriers.",
        "We sleep unaware of the dense gigahertz frequencies raining down just meters above our ceilings. The locked fire door serves as the unacknowledged boundary between intimate domestic sanctuary and ubiquitous telecom infrastructure."
      ]
    }
  }
];

// =========================================================================
// 4. CV DATA (For Template 1: 4-Column Editorial CV with 2 Portraits)
// =========================================================================
export const cvData: CVData = {
  artistName: {
    en: "Yuri Kim (glass.gkim)",
    ko: "김유리 (glass.gkim)"
  },
  statement: {
    en: "My practice investigates how invisible signals and physical traces evoke the perception of existence, shaping spatial awareness and human relations. Departing from experiences of voice chat in online survival games, data obsolescence, and shared collective memory, I construct video, sound, and spatial installation works. Recently, my work has expanded toward observing the residual marks invisible signals leave across spaces and the delicate ways people form and maintain relations.",
    ko: "신호와 흔적이 어떻게 존재를 감각하게 만들고 공간과 관계를 구성하는지에 관심을 가지고 작업한다. 온라인 생존 게임에서 경험한 음성 채팅, 데이터의 소멸, 공동체의 기억과 같은 경험을 출발점으로 영상, 사운드, 설치 작업을 진행하고 있다. 최근에는 보이지 않는 신호가 공간에 남기는 흔적과 사람들이 관계를 형성하고 유지하는 방식에 주목하며 작업을 확장하고 있다."
  },
  statementParagraphs: {
    ko: [
      "신호와 흔적이 어떻게 존재를 감각하게 만들고 공간과 관계를 구성하는지에 관심을 가지고 작업한다. 온라인 생존 게임에서 경험한 음성 채팅, 데이터의 소멸, 공동체의 기억과 같은 경험을 출발점으로 영상, 사운드, 설치 작업을 진행하고 있다. 최근에는 보이지 않는 신호가 공간에 남기는 흔적과 사람들이 관계를 형성하고 유지하는 방식에 주목하며 작업을 확장하고 있다."
    ],
    en: [
      "My practice investigates how invisible signals and physical traces evoke the perception of existence, shaping spatial awareness and human relations. Departing from experiences of voice chat in online survival games, data obsolescence, and shared collective memory, I construct video, sound, and spatial installation works. Recently, my work has expanded toward observing the residual marks invisible signals leave across spaces and the delicate ways people form and maintain relations."
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
  columns: {
    column1: {
      title: {
        en: "Education & Affiliation",
        ko: "학력 및 소속"
      },
      items: [
        {
          heading: {
            en: "Korea National University of Arts (K-Arts)",
            ko: "한국예술종합학교 미술원 조형예술과 (BFA)"
          },
          subheading: {
            en: "BFA Fine Art",
            ko: "조형예술과 예술사"
          },
          period: "2020 – 2026"
        },
        {
          heading: {
            en: "Art & Visual Communication Research",
            ko: "예술 및 시각 커뮤니케이션 연구"
          },
          subheading: {
            en: "Independent Research",
            ko: "연구 및 아카이빙 활동"
          },
          period: "2024 – 현재"
        }
      ]
    },
    column2: {
      title: {
        en: "Professional Experience",
        ko: "실무 및 기관 이력"
      },
      items: [
        {
          heading: {
            en: "Korean Cultural Center in Sweden",
            ko: "주스웨덴 한국문화원 (Korean Cultural Center in Sweden)"
          },
          subheading: {
            en: "Content Production & Digital Communications Intern",
            ko: "콘텐츠 제작 및 디지털 커뮤니케이션 인턴"
          },
          period: "2025.05 – 2026.02",
          details: {
            en: "Produced 90+ video contents, promotional materials, official sketch videos, and archival documentation",
            ko: "90개 이상의 영상 콘텐츠, 홍보물, 행사 공식 스케치 영상 및 아카이빙 제작"
          }
        },
        {
          heading: {
            en: "Gallery 175",
            ko: "갤러리 175 (Gallery 175)"
          },
          subheading: {
            en: "Exhibition Operations & Digital Content Intern",
            ko: "전시 운영 및 디지털 콘텐츠 인턴"
          },
          period: "2022.03 – 2023.01"
        },
        {
          heading: {
            en: "Beyond Stage 2026 (Hong Kong)",
            ko: "Beyond Stage 2026 (홍콩)"
          },
          subheading: {
            en: "Exhibition Curation & Visual Design",
            ko: "전시 큐레이션 및 비주얼 디자인"
          },
          period: "2026.06 – 2026.10"
        },
        {
          heading: {
            en: "Freelance Video & Short-form Production",
            ko: "YouTube 콘텐츠 영상 편집 및 숏폼 제작"
          },
          subheading: {
            en: "Video Editor & Designer",
            ko: "영상 편집 및 제작"
          },
          period: "2022.02 – 2022.09"
        }
      ]
    },
    column3: {
      title: {
        en: "Exhibitions & Curatorial",
        ko: "전시 및 기획"
      },
      items: [
        {
          heading: {
            en: "《Lingering Traces Linked》",
            ko: "《눈자리나게, 이어》"
          },
          subheading: {
            en: "Incheon Art Platform, Artist & Spatial Scenography",
            ko: "인천아트플랫폼, 작가 및 공간 기획"
          },
          period: "2026"
        },
        {
          heading: {
            en: "《Beyond Stage》",
            ko: "《Beyond Stage》"
          },
          subheading: {
            en: "Hong Kong, Participating Artist & Chief Curator",
            ko: "홍콩, 참여 작가 및 최종 성과 전시 총괄 큐레이션"
          },
          period: "2026"
        },
        {
          heading: {
            en: "K-Arts Fine Art Foundation Exhibition",
            ko: "조형예술과 파운데이션 기획전"
          },
          subheading: {
            en: "K-Arts Gallery",
            ko: "K-Arts Gallery"
          },
          period: "2021"
        }
      ]
    },
    column4: {
      title: {
        en: "Stage & Collaborations",
        ko: "무대 기술 및 기타 협업"
      },
      items: [
        {
          heading: {
            en: "K-Arts Stage Technology Academy",
            ko: "K-arts 무대기술 아카데미"
          },
          subheading: {
            en: "Lighting Division Specialist",
            ko: "조명 분야"
          },
          period: "2026"
        },
        {
          heading: {
            en: "K-Arts Drama Production <Being with Companion>",
            ko: "연극원 전문사 공연 <반려중입니다>"
          },
          subheading: {
            en: "Lighting Operator",
            ko: "조명 오퍼레이터"
          },
          period: "2023"
        },
        {
          heading: {
            en: "Dolgoji Summer Incubator <Ripley>, <Dandelion>",
            ko: "돌곶이 인큐베이터 <리플리>, <민들레>"
          },
          subheading: {
            en: "Lighting Operator",
            ko: "조명 오퍼레이터"
          },
          period: "2023"
        },
        {
          heading: {
            en: "10th Youth Sharing Festival <Spring in Making>",
            ko: "제10회 청춘나눔창작연극제 <청소년, 봄을 짓다>"
          },
          subheading: {
            en: "Assistant Stage Manager",
            ko: "무대감독 보조"
          },
          period: "2022"
        },
        {
          heading: {
            en: "K-Arts Blog 'Yejongjigi'",
            ko: "한국예술종합학교 블로그 '예종지기'"
          },
          subheading: {
            en: "Content Creator & Editorial",
            ko: "콘텐츠 제작"
          },
          period: "2022"
        }
      ]
    }
  },
  contact: {
    email: "glass.gkim@gmail.com",
    instagram: "https://www.instagram.com/sarrg_/",
    photographyArchive: "https://www.instagram.com/sarrg_/",
    locationText: {
      en: "Seoul, Republic of Korea",
      ko: "대한민국 서울"
    }
  }
};

export * from './data';
export default projects;
