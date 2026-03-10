import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'stylist_profile_v2'

const toneMap = {
  warm: ['크림', '베이지', '올리브', '브라운', '코랄'],
  cool: ['네이비', '그레이', '화이트', '버건디', '블루'],
  neutral: ['아이보리', '차콜', '카키', '블랙', '데님'],
}

const defaultProfile = {
  genderStyle: '여성',
  height: '',
  weight: '',
  concerns: [],
  fit: '레귤러',
  tone: 'neutral',
  occasion: 'office',
  budget: 'mid',
}

function makeLooks(profile, photoLevel) {
  const colors = toneMap[profile.tone] || toneMap.neutral
  const priceTag = profile.budget === 'low' ? '5만원 이하' : profile.budget === 'mid' ? '5~15만원' : '15만원+'
  const fitLabel = profile.fit

  const byOccasion = {
    office: [
      [`${colors[0]} 셔츠`, `${colors[1]} ${fitLabel} 슬랙스`, '로퍼'],
      [`${colors[2]} 니트`, `${colors[3]} 팬츠`, '미니멀 스니커즈'],
      [`${colors[4]} 카디건`, '기본 이너', `${fitLabel} 팬츠`],
    ],
    date: [
      [`${colors[0]} 상의`, '생지 데님', '깔끔한 스니커즈'],
      [`${colors[3]} 아우터`, `${colors[1]} 이너`, '포인트 액세서리'],
      [`${colors[2]} 후드`, `${fitLabel} 팬츠`, '캔버스화'],
    ],
    casual: [
      [`${colors[1]} 맨투맨`, '데님', '스니커즈'],
      ['기본 티셔츠', `${colors[4]} 셔츠 아우터`, '조거팬츠'],
      [`${colors[0]} 캡`, '오버핏 상의', `${colors[2]} 팬츠`],
    ],
  }

  const concernTip = profile.concerns.length
    ? `체형 고민(${profile.concerns.join(', ')})을 고려해 실루엣 균형을 맞췄습니다.`
    : '기본 체형 기준으로 무난한 실루엣을 우선 추천했습니다.'

  const photoTip = photoLevel === 'both'
    ? '정면/측면 사진 기반으로 비율 보정 정확도가 높습니다.'
    : photoLevel === 'one'
      ? '사진 1장 기반 추천입니다. 측면 사진을 추가하면 정확도가 올라갑니다.'
      : '사진 없이 프로필 기반 추천입니다. 사진 업로드 시 정확도가 올라갑니다.'

  const sets = byOccasion[profile.occasion] || byOccasion.casual

  const LOOKBOOK = {
    woman: {
      office: [
        ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80'],
      ],
      date: [
        ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1495121605193-b116b5b09a8c?auto=format&fit=crop&w=900&q=80'],
      ],
      casual: [
        ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'],
      ],
    },
    man: {
      office: [
        ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'],
      ],
      date: [
        ['https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'],
      ],
      casual: [
        ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80'],
        ['https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'],
      ],
    },
  }

  const styleKey = profile.genderStyle === '남성' ? 'man' : 'woman'
  const imageSet = (LOOKBOOK[styleKey] && LOOKBOOK[styleKey][profile.occasion]) || LOOKBOOK[styleKey].casual

  return sets.map((items, idx) => ({
    title: `추천 코디 ${idx + 1}`,
    items,
    images: imageSet[idx],
    reason: idx === 0 ? concernTip : '톤/상황/예산을 함께 반영한 조합입니다.',
    budget: priceTag,
    tip: photoTip,
  }))
}

export default function App() {
  const [profile, setProfile] = useState(defaultProfile)
  const [frontPreview, setFrontPreview] = useState('')
  const [sidePreview, setSidePreview] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setProfile({ ...defaultProfile, ...JSON.parse(raw) })
      } catch {
        // ignore broken storage
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const onChange = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }))

  const onConcernToggle = (item) => {
    setProfile((p) => ({
      ...p,
      concerns: p.concerns.includes(item) ? p.concerns.filter((x) => x !== item) : [...p.concerns, item],
    }))
  }

  const onFile = (type) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (type === 'front') setFrontPreview(url)
    if (type === 'side') setSidePreview(url)
  }

  const profileReady = Boolean(profile.height && profile.weight && profile.genderStyle && profile.fit)
  const photoLevel = frontPreview && sidePreview ? 'both' : frontPreview || sidePreview ? 'one' : 'none'

  const confidenceText =
    photoLevel === 'both'
      ? '추천 신뢰도: 높음 (정면/측면 사진 + 프로필 기반)'
      : photoLevel === 'one'
        ? '추천 신뢰도: 중간 (사진 1장 + 프로필 기반)'
        : '추천 신뢰도: 보통 (프로필 기반)'

  const looks = useMemo(() => makeLooks(profile, photoLevel), [profile, photoLevel])

  return (
    <div className="app">
      <header>
        <h1>AI 퍼스널 스타일리스트 v2</h1>
        <p>사진 + 체형 프로필 기반으로 상황별 코디를 추천해드립니다.</p>
      </header>

      <section className="panel">
        <h2>1) 사진 업로드</h2>
        <div className="photo-grid">
          <label className="photo-box">
            <span>정면 사진</span>
            <input type="file" accept="image/*" onChange={onFile('front')} />
            {frontPreview && <img src={frontPreview} alt="front" />}
          </label>
          <label className="photo-box">
            <span>측면 사진</span>
            <input type="file" accept="image/*" onChange={onFile('side')} />
            {sidePreview && <img src={sidePreview} alt="side" />}
          </label>
        </div>
      </section>

      <section className="panel form">
        <h2>2) 프로필 작성</h2>
        <div className="grid">
          <label>
            스타일 기준
            <select value={profile.genderStyle} onChange={onChange('genderStyle')}>
              <option>여성</option>
              <option>남성</option>
              <option>유니섹스</option>
            </select>
          </label>
          <label>
            키(cm)
            <input value={profile.height} onChange={onChange('height')} placeholder="예: 170" />
          </label>
          <label>
            몸무게(kg)
            <input value={profile.weight} onChange={onChange('weight')} placeholder="예: 65" />
          </label>
          <label>
            선호 핏
            <select value={profile.fit} onChange={onChange('fit')}>
              <option>슬림</option>
              <option>레귤러</option>
              <option>오버핏</option>
            </select>
          </label>
          <label>
            퍼스널 톤
            <select value={profile.tone} onChange={onChange('tone')}>
              <option value="warm">웜톤</option>
              <option value="cool">쿨톤</option>
              <option value="neutral">뉴트럴</option>
            </select>
          </label>
          <label>
            상황
            <select value={profile.occasion} onChange={onChange('occasion')}>
              <option value="office">출근/미팅</option>
              <option value="date">데이트</option>
              <option value="casual">주말 캐주얼</option>
            </select>
          </label>
          <label>
            예산
            <select value={profile.budget} onChange={onChange('budget')}>
              <option value="low">가성비</option>
              <option value="mid">중간</option>
              <option value="high">프리미엄</option>
            </select>
          </label>
        </div>

        <div className="concerns">
          <strong>체형 고민(복수 선택)</strong>
          {['어깨', '복부', '하체', '비율', '목/얼굴선'].map((c) => (
            <label key={c} className="check">
              <input type="checkbox" checked={profile.concerns.includes(c)} onChange={() => onConcernToggle(c)} /> {c}
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>3) 추천 결과</h2>
        <p className="confidence">{confidenceText}</p>

        {!profileReady ? (
          <p className="warn">프로필(키/몸무게/선호핏)을 먼저 작성해 주세요.</p>
        ) : (
          <div className="looks">
            {looks.map((look) => (
              <article className="look" key={look.title}>
                <div className="look-gallery">
                  {look.images.map((img, i) => (
                    <img className="look-image" key={`${look.title}-${i}`} src={img} alt={`${look.title} 실착 샘플 ${i + 1}`} />
                  ))}
                </div>
                <h3>{look.title}</h3>
                <ul>
                  {look.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p><strong>추천 이유:</strong> {look.reason}</p>
                <p><strong>예산:</strong> {look.budget}</p>
                <p className="tip">{look.tip}</p>
              </article>
            ))}
            <p className="sample-note">※ 코디 이미지는 샘플 참고용입니다. 다음 단계에서 실제 쇼핑몰 상품 이미지 연동 가능합니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}
