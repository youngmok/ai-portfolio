import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import CareerAccordion from "@/components/career/CareerAccordion";

export const metadata: Metadata = {
  title: "경력",
  description: "15년 이상의 IT 개발 경력 및 프로젝트 이력",
};

interface ProjectItem {
  name: string;
  period: string;
  role: string;
  details: string[];
  tech: string[];
}

interface CareerItem {
  company: string;
  period: string;
  description: string;
  position: string;
  projects: ProjectItem[];
}

const careers: CareerItem[] = [
  {
    company: "GC Care (지씨케어)",
    period: "2022.02 ~ 현재",
    description: "GC(녹십자)계열 헬스케어 기업 | 디지털 헬스케어 플랫폼 및 시스템 개발",
    position: "시니어개발자 / 솔루션개발팀",
    projects: [
      {
        name: "검진/평가 데이터 분석 및 통계 시스템 구축",
        period: "4개월",
        role: "개발",
        details: [
          "검진 결과 기반 유소견 판정 및 고객사 맞춤형 리포트 자동화",
          "건강습관, 마음검진, 직무스트레스, 우울척도 등 다차원 평가 알고리즘 구현",
        ],
        tech: ["Java", "Spring Boot", "Vue", "MS-SQL"],
      },
      {
        name: "검진기관 예약 일정 및 잔여 캐퍼(Capacity) 그룹화 시스템",
        period: "4개월",
        role: "개발",
        details: [
          "검진기관별 실시간 일정 및 수용 인원 처리에 대한 빠른 응답시간 구현",
          "날짜/항목별 잔여 캐퍼 우선 검색 및 검진기관별 대시보드 구축",
          "통계 캐퍼 산출 및 데이터 동기화 배치(Batch) 프로세스 개발",
        ],
        tech: ["Java", "Spring Boot", "Vue", "MS-SQL", "Redis"],
      },
      {
        name: "이상 데이터 실시간 모니터링 및 보고서 시스템 고도화",
        period: "4개월",
        role: "개발",
        details: [
          "헬스케어 데이터 무결성 검증을 위한 실시간 감지 시스템 구축 및 평가데이터 연동",
        ],
        tech: ["Java", "Spring Boot", "Vue", "MS-SQL"],
      },
      {
        name: "기업 고객용 맞춤형 검진 보고서 프로젝트",
        period: "6개월",
        role: "개발 리더",
        details: [
          "태블로 기반 별도 모델 마트 구성",
          "개발 리더 역할 수행",
        ],
        tech: ["Java", "Spring Boot", "Tableau"],
      },
      {
        name: "차세대 프로젝트 캐퍼관련 총괄 테스트",
        period: "1.5개월",
        role: "테스트 리드",
        details: [
          "9개 고객사, 9개 검진기관, 20만건 대상자 테스트 데이터 생성 후 4000가지 시나리오 검증",
        ],
        tech: [],
      },
    ],
  },
  {
    company: "LG CNS",
    period: "2018.10 ~ 2022.02",
    description: "LG계열 IT기업 | 금융 대규모 프로젝트 소프트웨어 개발 및 리더",
    position: "책임 / SW개발2팀 → 선임 / 은행사업팀",
    projects: [
      {
        name: "KB 마이데이터 서비스 플랫폼 구축",
        period: "2021.04 ~ 2022.03",
        role: "캠페인/마케팅 PL (최대 33명)",
        details: [
          "캠페인/마케팅 파트 PL 역할 수행",
          "MSA, Cloud, 데이터 분석 등 최신 기술 적용",
        ],
        tech: ["Java", "Spring Boot", "MySQL", "Hadoop", "Flume"],
      },
      {
        name: "대구은행 BPR 시스템 고도화 구축",
        period: "2020.12 ~ 2021.03",
        role: "개발 (위기 프로젝트 긴급 투입)",
        details: [
          "비대면 주택담보대출 BPM 맵 관련 개발",
          "위기 프로젝트 긴급 투입 후 성공적 완료, 포상(200만원) 수상",
        ],
        tech: ["Java", "DevOn", "xFrame", "Oracle"],
      },
      {
        name: "KB 기업여신 프로세스 혁신 구축",
        period: "2019.08 ~ 2020.10",
        role: "제안 + 개발",
        details: [
          "Pre RFI 단계부터 참여하여 프로젝트 제안 및 본부협의 시스템 구축",
          "분산된 본부협의 시스템을 하나로 통합",
        ],
        tech: ["COBOL", "IBM(KESA)", "DB2"],
      },
      {
        name: "키움/토스 인터넷전문은행 Asset 정련",
        period: "2019.05 ~ 2019.08",
        role: "여신 Demo 개발리더",
        details: [
          "인터넷전문은행 대비 자사 Asset 정련",
          "제안 준비 기술 분석 (MSA, Cloud)",
        ],
        tech: ["Java", "DevOn/Doma", "Oracle"],
      },
      {
        name: "KB 가계여신 Digitalization 구축",
        period: "2018.11 ~ 2019.04",
        role: "사업관리, 테스트관리",
        details: [
          "프로젝트 인력 및 자산관리",
          "테스트 데이터관련 여신 데이터 클렌징 및 인증서 발행",
        ],
        tech: ["Java"],
      },
    ],
  },
  {
    company: "㈜푸른정보통신 (프리랜서)",
    period: "2018.01 ~ 2018.10",
    description: "응용소프트웨어 개발 및 공급업",
    position: "과장",
    projects: [
      {
        name: "신용보증기금 차세대",
        period: "2018.01 ~ 2018.10",
        role: "개발 (중도 투입)",
        details: [
          "재무제표 입력, 변환, 합산 등 재무제표 업무 전반",
          "개발단계 긴급투입으로 32본 업무에서 150본까지 완료",
          "통합테스트 1차 성공률 80% 달성 및 타업무 테스트 지원",
        ],
        tech: ["Java", "ProObject/xFrame", "Oracle"],
      },
    ],
  },
  {
    company: "㈜누리솔루션",
    period: "2011.02 ~ 2018.01",
    description: "여신전문 금융 서비스업",
    position: "대리 / 개발팀 → 사원 / 개발팀",
    projects: [
      {
        name: "농협생명 채권추심위임 SM",
        period: "2017.08 ~ 2017.12",
        role: "개발, SM",
        details: [
          "채권추심위임 신규화면 개발",
          "신규 대외 인터페이스 구축",
        ],
        tech: ["Java", "DevOn/xFrame", "Oracle"],
      },
      {
        name: "오토리스 고도화",
        period: "2017.03 ~ 2017.07",
        role: "개발 (위기 프로젝트 투입)",
        details: [
          "청구입금, 세금계산서 작성",
          "위기프로젝트 투입 후 기간 내 완료",
        ],
        tech: ["Java", "Laf-j/MiPlatform", "Oracle"],
      },
      {
        name: "NH은행 중앙회 조합분리 구축",
        period: "2015.05 ~ 2017.02",
        role: "개발리더 (1금융권 메인 설계자)",
        details: [
          "여신자금 (농식품금융부 자금 활용 대출)",
          "부채대책 (기간 연장 및 금리혜택) 및 기한연장",
          "MFT 인터페이스 검증, 개발서버 관리",
        ],
        tech: ["C", "ProFrame/xFrame", "Oracle"],
      },
      {
        name: "IBK 포스트 차세대",
        period: "2013.11 ~ 2015.03",
        role: "서브개발 (상환리더 본부장 표창)",
        details: [
          "여신상환, 다계좌 상환, 자동이체 상환, 수신성여신 상환 등 여신상환 전반",
          "여신상품 개발",
        ],
        tech: ["Java", "AnyFrame", "DB2"],
      },
      {
        name: "농협생명 차세대",
        period: "2013.02 ~ 2013.11",
        role: "서브 모듈 개발",
        details: [
          "실시간 이체, 여신상환 서브 모듈 개발",
        ],
        tech: ["Java", "DevOn/xFrame", "Oracle"],
      },
      {
        name: "신한저축은행 차세대",
        period: "2012.09 ~ 2013.01",
        role: "개발",
        details: [
          "금리결정, 담보설정",
        ],
        tech: ["Java", "ProFrame/Flex", "Oracle"],
      },
      {
        name: "아주캐피탈 차세대",
        period: "2011.03 ~ 2012.08",
        role: "개발 (분석기간 투입)",
        details: [
          "이자계산, 중도상환, 납입일변경, 금리변경 등 상환계획 전반",
        ],
        tech: ["Java", "DevOn/MiPlatform", "DB2"],
      },
    ],
  },
];

const certifications = [
  { name: "정보처리기사", date: "2009.08", org: "한국산업인력공단" },
  { name: "SCJP (Sun Certified Java Developer)", date: "", org: "Sun Microsystems" },
  { name: "OCP (Oracle Certified Professional)", date: "", org: "Oracle" },
  { name: "CCNA (Cisco Certified Network Associate)", date: "", org: "Cisco" },
];

const coreCompetencies = [
  { area: "여신(대출) 핵심 업무", skills: ["상환계획/변경", "금리결정", "담보설정/배분", "여신상환", "여신자금/부채대책", "청구입금", "채권추심위임", "재무제표"] },
  { area: "Backend", skills: ["Java", "Spring Boot", "Spring Batch", "MyBatis", "COBOL", "C"] },
  { area: "Frontend", skills: ["Vue.js", "Next.js", "TypeScript", "Tailwind CSS", "React"] },
  { area: "Database / DevOps", skills: ["Oracle", "DB2", "MS-SQL", "MySQL", "PostgreSQL", "Redis", "Docker", "GitHub Actions", "Gradle"] },
  { area: "프레임워크", skills: ["DevOn", "ProFrame", "ProObject", "AnyFrame", "xFrame", "MiPlatform", "Ustra"] },
  { area: "리더십", skills: ["PL (최대 33명)", "프로젝트 제안", "설계 리딩", "테스트 관리", "사업관리"] },
];

export default function CareerPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-2">경력 & 프로젝트 이력</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        15년 이상의 IT 개발 경력 | 은행권 대규모 차세대 프로젝트 전문
      </p>

      {/* Core Competencies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">핵심 역량</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreCompetencies.map((comp) => (
            <div
              key={comp.area}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-5"
            >
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">
                {comp.area}
              </h3>
              <div className="flex flex-wrap gap-2">
                {comp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">자격증</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">{cert.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cert.org}{cert.date ? ` | ${cert.date}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">OPIc IM I</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">영어 회화 | 2019.12</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">학력</h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/40">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <p className="font-medium">계명대학교</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">컴퓨터공학과 학사 졸업 (대구)</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2002.03 ~ 2010.02</p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">경력 사항</h2>
        <CareerAccordion careers={careers} />
      </section>

      {/* Awards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">수상</h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-950/40">
              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a48.454 48.454 0 0 1-7.86 0" />
              </svg>
            </div>
            <div>
              <p className="font-medium">대구은행 BPR 시스템 고도화 구축 포상 (200만원)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">LG CNS | 2021.04</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mt-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-950/40">
              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a48.454 48.454 0 0 1-7.86 0" />
              </svg>
            </div>
            <div>
              <p className="font-medium">IBK 포스트 차세대 상환리더 본부장 표창</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">㈜누리솔루션 | 2015</p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
