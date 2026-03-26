import { useState, useEffect, useRef } from "react";

const C = {
  black: "#0a0a0a",
  white: "#ffffff",
  offwhite: "#f9f9f7",
  gray100: "#f2f2f0",
  gray200: "#e2e2de",
  gray400: "#9a9a94",
  gray600: "#5a5a54",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #ffffff;
    color: #0a0a0a;
    font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
  }
  ::selection { background: #0a0a0a; color: #ffffff; }
  textarea { font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif; }
  textarea:focus { outline: none; }
  button { font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif; }
  button:focus { outline: none; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @media print {
    .no-print { display: none !important; }
    header { display: none !important; }
    .hero-section { display: none !important; }
  }
`;

// ── UI 컴포넌트 ──────────────────────────────────────────────

function RatingScale({ dataKey, answers, setAnswers, leftLabel, rightLabel }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5].map(v => {
          const sel = answers[dataKey] === v;
          return (
            <button key={v} onClick={() => setAnswers(a => ({ ...a, [dataKey]: v }))}
              style={{ flex: 1, padding: "13px 4px", background: sel ? C.black : C.white, border: `1px solid ${sel ? C.black : C.gray200}`, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13, color: sel ? C.white : C.gray400, transition: "all .15s" }}>
              {v}
            </button>
          );
        })}
      </div>
      {(leftLabel || rightLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.gray400, fontFamily: "'DM Mono', monospace" }}>
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

function SingleSelect({ dataKey, options, answers, setAnswers }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 8 }}>
      {options.map(opt => {
        const sel = answers[dataKey] === opt.val;
        return (
          <div key={opt.val} onClick={() => setAnswers(a => ({ ...a, [dataKey]: opt.val }))}
            style={{ padding: "16px 18px", background: sel ? C.black : C.white, border: `1px solid ${sel ? C.black : C.gray200}`, cursor: "pointer", transition: "all .15s", color: sel ? C.white : C.black, textAlign: "left" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{opt.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{opt.title}</div>
            <div style={{ fontSize: 11, color: sel ? "rgba(255,255,255,0.6)" : C.gray400, lineHeight: 1.5 }}>{opt.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

function MultiSelect({ dataKey, options, answers, setAnswers }) {
  const current = answers[dataKey] || [];
  const toggle = val => setAnswers(a => {
    const arr = a[dataKey] || [];
    return { ...a, [dataKey]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px,1fr))", gap: 8 }}>
      {options.map(opt => {
        const sel = current.includes(opt.val);
        return (
          <div key={opt.val} onClick={() => toggle(opt.val)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: sel ? C.black : C.white, border: `1px solid ${sel ? C.black : C.gray200}`, cursor: "pointer", fontSize: 13, color: sel ? C.white : C.black, transition: "all .15s", userSelect: "none" }}>
            <div style={{ width: 14, height: 14, border: `1px solid ${sel ? "rgba(255,255,255,0.4)" : C.gray400}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0 }}>
              {sel && "✓"}
            </div>
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}

function QBlock({ num, label, sub, children }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.gray400, letterSpacing: 2, flexShrink: 0 }}>{num}</span>
        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6, letterSpacing: -0.2 }}>{label}</span>
      </div>
      {sub && <p style={{ fontSize: 12, color: C.gray400, marginBottom: 14, lineHeight: 1.7, paddingLeft: 30, fontFamily: "'DM Mono', monospace" }}>{sub}</p>}
      <div style={{ paddingLeft: 0 }}>{children}</div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0 28px" }}>
      <div style={{ flex: 1, height: 1, background: C.gray200 }} />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.gray400, letterSpacing: 3, textTransform: "uppercase" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.gray200 }} />
    </div>
  );
}

function PhaseHeader({ tag, title, desc }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 52, paddingBottom: 40, borderBottom: `1px solid ${C.gray200}` }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.gray400, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>{tag}</div>
      <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16, color: C.black }}>{title}</h2>
      <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.9, maxWidth: 480, margin: "0 auto", fontFamily: "'DM Mono', monospace" }}>{desc}</p>
    </div>
  );
}

const TA = ({ dataKey, answers, setAnswers, placeholder, rows }) => (
  <textarea
    style={{ width: "100%", padding: "14px 16px", background: C.white, border: `1px solid ${C.gray200}`, fontSize: 14, color: C.black, resize: "vertical", minHeight: rows * 30, lineHeight: 1.8, borderRadius: 0 }}
    placeholder={placeholder}
    value={answers[dataKey] || ""}
    onChange={e => setAnswers(a => ({ ...a, [dataKey]: e.target.value }))}
  />
);

// ── Phases ──────────────────────────────────────────────

function Phase1({ answers, setAnswers }) {
  return (
    <div style={{ animation: "fadeUp .45s ease" }}>
      <PhaseHeader tag="PHASE 01" title="VIA 강점 테스트" desc={"각 문항이 나를 얼마나 잘 설명하는지 1~5점으로 평가해주세요.\n1 = 전혀 나답지 않다  |  5 = 매우 나답다"} />
      <SectionDivider label="지혜와 지식" />
      <QBlock num="Q01" label="나는 새로운 것을 배우는 것 자체에서 즐거움을 느낀다" sub="학습 욕구 (Love of Learning)"><RatingScale dataKey="via_learning" answers={answers} setAnswers={setAnswers} /></QBlock>
      <QBlock num="Q02" label="나는 복잡한 문제를 다양한 각도에서 분석하는 것을 좋아한다" sub="비판적 사고 (Critical Thinking)"><RatingScale dataKey="via_critical" answers={answers} setAnswers={setAnswers} /></QBlock>
      <QBlock num="Q03" label="나는 아이디어를 연결하고 새로운 것을 만들어내는 데 재능이 있다" sub="창의성 (Creativity)"><RatingScale dataKey="via_creativity" answers={answers} setAnswers={setAnswers} /></QBlock>
      <SectionDivider label="용기" />
      <QBlock num="Q04" label="나는 두렵더라도 옳다고 생각하는 일을 끝까지 한다" sub="용맹 (Bravery)"><RatingScale dataKey="via_bravery" answers={answers} setAnswers={setAnswers} /></QBlock>
      <QBlock num="Q05" label="나는 일단 시작한 일은 어려워도 포기하지 않는다" sub="끈기 (Perseverance)"><RatingScale dataKey="via_perseverance" answers={answers} setAnswers={setAnswers} /></QBlock>
      <SectionDivider label="인도성 · 관계" />
      <QBlock num="Q06" label="나는 다른 사람의 감정과 상황을 잘 이해하고 공감한다" sub="공감 (Empathy)"><RatingScale dataKey="via_empathy" answers={answers} setAnswers={setAnswers} /></QBlock>
      <QBlock num="Q07" label="나는 사람들을 이끌고 동기를 부여하는 것이 즐겁다" sub="리더십 (Leadership)"><RatingScale dataKey="via_leadership" answers={answers} setAnswers={setAnswers} /></QBlock>
      <SectionDivider label="정의" />
      <QBlock num="Q08" label="나는 불공정함을 보면 참지 못하고 바로잡으려 한다" sub="공정성 (Fairness)"><RatingScale dataKey="via_fairness" answers={answers} setAnswers={setAnswers} /></QBlock>
      <SectionDivider label="절제" />
      <QBlock num="Q09" label="나는 충동적으로 행동하기보다 계획하고 신중하게 결정한다" sub="신중함 (Prudence)"><RatingScale dataKey="via_prudence" answers={answers} setAnswers={setAnswers} /></QBlock>
      <SectionDivider label="초월" />
      <QBlock num="Q10" label="나는 일상에서 아름다움, 탁월함, 특별한 순간을 자주 느낀다" sub="심미안 (Appreciation of Beauty)"><RatingScale dataKey="via_beauty" answers={answers} setAnswers={setAnswers} /></QBlock>
      <QBlock num="Q11" label="나는 어떤 상황에서도 유머를 발견하고 주변을 웃게 만든다" sub="유머 (Humor)"><RatingScale dataKey="via_humor" answers={answers} setAnswers={setAnswers} /></QBlock>
    </div>
  );
}

function Phase2({ answers, setAnswers }) {
  return (
    <div style={{ animation: "fadeUp .45s ease" }}>
      <PhaseHeader tag="PHASE 02" title="관심사 프로파일" desc="나의 라이프스타일과 선호를 파악합니다. 해당하는 항목을 모두 선택하고, 자유롭게 서술해주세요." />
      <QBlock num="Q01" label="혼자 일할 때 vs 함께 일할 때 — 어느 쪽이 더 에너지가 넘치나요?">
        <SingleSelect dataKey="work_style" answers={answers} setAnswers={setAnswers} options={[
          { val: "solo", icon: "🎯", title: "혼자 집중", desc: "조용히 몰입하는 시간이 좋다" },
          { val: "collab", icon: "🤝", title: "함께 협력", desc: "사람과 에너지를 주고받을 때 힘이 난다" },
          { val: "both", icon: "⚖️", title: "상황에 따라", desc: "균형이 중요하다" },
        ]} />
      </QBlock>
      <QBlock num="Q02" label="평소 내가 즐기거나 빠져드는 관심사 영역을 모두 선택하세요">
        <MultiSelect dataKey="interests" answers={answers} setAnswers={setAnswers} options={[
          { val: "writing", label: "✍️ 글쓰기 · 콘텐츠" }, { val: "design", label: "🎨 디자인 · 시각예술" },
          { val: "teaching", label: "📚 가르치기 · 코칭" }, { val: "cooking", label: "🍳 요리 · 식문화" },
          { val: "tech", label: "💻 기술 · 개발" }, { val: "fitness", label: "💪 운동 · 웰니스" },
          { val: "travel", label: "✈️ 여행 · 문화탐방" }, { val: "music", label: "🎵 음악 · 퍼포먼스" },
          { val: "finance", label: "📈 투자 · 재무" }, { val: "nature", label: "🌿 자연 · 환경" },
          { val: "community", label: "🌍 커뮤니티 · 사회" }, { val: "research", label: "🔬 연구 · 데이터" },
        ]} />
      </QBlock>
      <QBlock num="Q03" label="일하는 환경에서 내가 선호하는 방식을 모두 고르세요">
        <MultiSelect dataKey="work_env" answers={answers} setAnswers={setAnswers} options={[
          { val: "remote", label: "🏠 재택 · 원격" }, { val: "outdoor", label: "🌿 야외 · 이동형" },
          { val: "flexible", label: "🕐 유연한 시간" }, { val: "digital", label: "💻 디지털 기반" },
          { val: "handson", label: "🛠 손으로 만드는 일" }, { val: "meeting", label: "💬 대면 미팅 중심" },
        ]} />
      </QBlock>
      <QBlock num="Q04" label="내가 돈을 쓸 때 가장 아깝지 않은 분야는?" sub="직접 입력 (예: 책, 여행, 카페, 자기계발 강의 등)">
        <TA dataKey="spending" answers={answers} setAnswers={setAnswers} placeholder="예: 책과 강의에는 아깝지 않게 쓰는 편이고, 맛있는 음식에도 투자를 아끼지 않아요..." rows={3} />
      </QBlock>
      <QBlock num="Q05" label="주변 사람들이 나에게 자주 물어보거나 부탁하는 것이 있나요?" sub="타인이 인정하는 나의 능력이나 특기를 적어주세요">
        <TA dataKey="peer_ask" answers={answers} setAnswers={setAnswers} placeholder="예: 친구들이 자꾸 PPT 만들어달라고 해요 / 여행 계획 짜는 걸 잘한다고 해요..." rows={3} />
      </QBlock>
    </div>
  );
}

function Phase3({ answers, setAnswers }) {
  return (
    <div style={{ animation: "fadeUp .45s ease" }}>
      <PhaseHeader tag="PHASE 03" title="가치관 탐색" desc="나에게 중요한 것이 무엇인지 파악합니다. 직업과 삶에서 우선순위를 알아야 지속 가능한 업종을 찾을 수 있습니다." />
      <QBlock num="Q01" label="창업에서 내가 가장 원하는 것은 무엇인가요?">
        <SingleSelect dataKey="biz_goal" answers={answers} setAnswers={setAnswers} options={[
          { val: "freedom", icon: "🕊", title: "자유와 자율", desc: "내 방식대로, 내 시간에" },
          { val: "impact", icon: "🌍", title: "사회적 영향력", desc: "세상에 긍정적 변화를" },
          { val: "income", icon: "💰", title: "경제적 자립", desc: "안정적이고 높은 수입" },
          { val: "passion", icon: "🔥", title: "열정의 실현", desc: "좋아하는 것으로 먹고살기" },
        ]} />
      </QBlock>
      <QBlock num="Q02" label="리스크에 대한 나의 태도는?">
        <RatingScale dataKey="risk_tolerance" answers={answers} setAnswers={setAnswers} leftLabel="안정 지향" rightLabel="도전 지향" />
      </QBlock>
      <QBlock num="Q03" label="나에게 '성공한 삶'이란 어떤 모습인가요?" sub="구체적일수록 좋습니다. 10년 후 이상적인 하루를 묘사해도 좋아요">
        <TA dataKey="success_vision" answers={answers} setAnswers={setAnswers} placeholder="예: 매일 아침 여유롭게 커피 마시면서 글을 쓰고, 오후엔 내가 만든 강의 수강생들의 피드백을 확인하는 삶..." rows={4} />
      </QBlock>
      <QBlock num="Q04" label="절대 타협할 수 없는 조건을 모두 선택하세요">
        <MultiSelect dataKey="non_negotiable" answers={answers} setAnswers={setAnswers} options={[
          { val: "time", label: "⏰ 시간 자유" }, { val: "location", label: "🌏 장소 자유" },
          { val: "ethics", label: "🤍 윤리적 사업" }, { val: "creativity", label: "🎨 창의적 작업" },
          { val: "stability", label: "🏠 수입 안정성" }, { val: "growth", label: "📈 성장 가능성" },
          { val: "recognition", label: "🏆 사회적 인정" }, { val: "meaning", label: "✨ 삶의 의미" },
        ]} />
      </QBlock>
      <QBlock num="Q05" label="지금 나에게 가장 두려운 것은?" sub="솔직하게 적을수록 정확한 컨설팅이 가능합니다">
        <TA dataKey="fears" answers={answers} setAnswers={setAnswers} placeholder="예: 아이디어는 많은데 실행을 못할까봐 두렵다 / 수입이 불안정해질 것 같아 겁난다..." rows={3} />
      </QBlock>
    </div>
  );
}

function Phase4({ answers, setAnswers }) {
  return (
    <div style={{ animation: "fadeUp .45s ease" }}>
      <PhaseHeader tag="PHASE 04" title="직업 경험 정리" desc="지금까지의 경험이 당신의 가장 큰 자산입니다. 아르바이트, 부업, 자원봉사도 모두 포함하세요." />
      {[
        { key: "job_history", q: "Q01", label: "지금까지 해온 주요 직업 / 직무를 적어주세요", sub: "회사명보다 어떤 일을 했는지가 더 중요합니다", ph: "예: 마케팅 회사에서 SNS 콘텐츠 기획 3년 / 학원에서 영어 강사 2년...", rows: 5 },
        { key: "best_moment", q: "Q02", label: "직업 경험 중 가장 성취감을 느꼈던 순간은?", sub: "구체적인 에피소드를 적어주세요", ph: "예: 내가 만든 콘텐츠가 바이럴되어 팔로워가 1만 명 늘었을 때...", rows: 4 },
        { key: "worst_moment", q: "Q03", label: "직업 경험 중 가장 힘들고 지쳤던 순간은?", sub: "피해야 할 업종 필터링에 사용됩니다", ph: "예: 반복적인 단순 업무가 오래되면 무기력해진다...", rows: 4 },
        { key: "skills", q: "Q04", label: "내가 가진 전문 기술 · 지식 · 자격증", sub: "기술, 도구 사용능력, 언어능력, 자격증 등", ph: "예: 포토샵 중급, 영어 상급, 유튜브 편집, 파이썬 초급...", rows: 3 },
      ].map(item => (
        <QBlock key={item.key} num={item.q} label={item.label} sub={item.sub}>
          <TA dataKey={item.key} answers={answers} setAnswers={setAnswers} placeholder={item.ph} rows={item.rows} />
        </QBlock>
      ))}
      <QBlock num="Q05" label="현재 나의 상황은?">
        <SingleSelect dataKey="current_status" answers={answers} setAnswers={setAnswers} options={[
          { val: "employed", icon: "🏢", title: "재직 중", desc: "직장 다니며 창업 준비" },
          { val: "between", icon: "🌀", title: "이직 · 전환 중", desc: "새로운 방향 탐색 중" },
          { val: "freelance", icon: "💻", title: "프리랜서", desc: "독립적으로 일하는 중" },
          { val: "free", icon: "🕊", title: "현재 무직", desc: "창업에 집중 가능" },
        ]} />
      </QBlock>
      <QBlock num="Q06" label="창업 준비에 투입 가능한 초기 자금 규모는?">
        <SingleSelect dataKey="budget" answers={answers} setAnswers={setAnswers} options={[
          { val: "zero", icon: "🌱", title: "거의 없음", desc: "100만원 미만" },
          { val: "small", icon: "💧", title: "소규모", desc: "100~500만원" },
          { val: "medium", icon: "💦", title: "중규모", desc: "500만~2000만원" },
          { val: "large", icon: "🌊", title: "여유 있음", desc: "2000만원 이상" },
        ]} />
      </QBlock>
    </div>
  );
}

// ── Strength Bar ──────────────────────────────────────────────
function StrengthBar({ name, score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(score), 300); }, [score]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <span style={{ fontSize: 12, minWidth: 88, color: C.black, fontFamily: "'DM Mono', monospace" }}>{name}</span>
      <div style={{ flex: 1, height: 2, background: C.gray100 }}>
        <div style={{ height: "100%", background: C.black, width: `${width}%`, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400, minWidth: 26, textAlign: "right" }}>{score}</span>
    </div>
  );
}

// ── PDF Export ──────────────────────────────────────────────
function PdfExport() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const handleSave = () => {
    window.print();
  };

  return (
    <div className="no-print" style={{ marginTop: 56, borderTop: `1px solid ${C.gray200}`, paddingTop: 36 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3, color: C.black, marginBottom: 8 }}>
          결과를 PDF 파일로 저장하시겠습니까?
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400, marginBottom: 6 }}>
          PC: 인쇄 창에서 "PDF로 저장" 선택
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400, marginBottom: 24 }}>
          모바일: 공유 버튼 → "PDF로 저장" 또는 "파일에 저장" 선택
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={handleSave}
            style={{ padding: "13px 36px", background: C.black, color: C.white, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>
            PDF 저장
          </button>
          <button onClick={() => setDismissed(true)}
            style={{ padding: "13px 28px", background: C.white, color: C.gray400, border: `1px solid ${C.gray200}`, cursor: "pointer", fontSize: 13 }}>
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Result View ──────────────────────────────────────────────
function ResultView({ data, onRestart }) {
  if (!data || data.error) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.gray400, marginBottom: 12 }}>분석 결과를 불러오지 못했습니다</div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray400, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>{data?.error || "알 수 없는 오류"}</p>
      <button onClick={onRestart} style={{ padding: "12px 32px", background: C.white, border: `1px solid ${C.gray200}`, cursor: "pointer", fontSize: 13, color: C.gray600 }}>처음부터 다시 하기</button>
    </div>
  );

  const industries = data.recommended_industries || [];
  const strengths = data.top_strengths || [];
  const scores = data.strength_scores || [];

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div id="result-pdf-area" style={{ background: C.white, padding: "8px 0" }}>

        {/* Result Header */}
        <div style={{ textAlign: "center", marginBottom: 56, paddingBottom: 48, borderBottom: `1px solid ${C.gray200}` }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray400, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>BUSINESS DNA REPORT</div>
          <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.2, marginBottom: 18, color: C.black }}>{data.profile_title}</h1>
          <p style={{ fontSize: 14, color: C.gray600, lineHeight: 1.9, maxWidth: 540, margin: "0 auto" }}>{data.profile_summary}</p>
        </div>

        {/* Strengths */}
        <div style={{ maxWidth: 560, margin: "0 auto 56px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 24, textAlign: "center", letterSpacing: -0.3 }}>핵심 강점 프로파일</div>
          {strengths.map((s, i) => <StrengthBar key={s} name={s} score={scores[i] || 70} />)}
        </div>

        {/* Industries heading */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 12, letterSpacing: -0.3 }}>추천 업종</div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.2 }}>당신에게 맞는 업종 TOP 3</h2>
        </div>

        {/* Industry cards */}
        {industries.map((ind, i) => (
          <div key={i} style={{ marginBottom: 32, border: `1px solid ${i === 0 ? C.black : C.gray200}`, borderTop: i === 0 ? `2px solid ${C.black}` : `1px solid ${C.gray200}` }}>
            <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.black, letterSpacing: 0.5, marginBottom: 6 }}>
                  {i === 0 ? "✦  최우선 추천" : i === 1 ? "2순위" : "3순위"}
                </div>
                <div style={{ fontSize: i === 0 ? 26 : 22, fontWeight: 800, letterSpacing: -0.5, color: C.black }}>{ind.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 40, fontWeight: 400, color: C.black, lineHeight: 1 }}>{ind.fit_score}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400, letterSpacing: 2 }}>적합도</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ padding: "18px 24px", borderRight: `1px solid ${C.gray100}`, borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray600, marginBottom: 8 }}>맞는 이유</div>
                <p style={{ fontSize: 13, lineHeight: 1.8 }}>{ind.why}</p>
              </div>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray600, marginBottom: 8 }}>시장 기회</div>
                <p style={{ fontSize: 13, lineHeight: 1.8 }}>{ind.market_opportunity}</p>
              </div>
            </div>

            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray600, marginBottom: 12 }}>첫 실행 단계</div>
              {(ind.first_steps || []).map((step, si) => (
                <div key={si} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: `1px solid ${C.gray100}`, fontSize: 13, lineHeight: 1.7 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: C.gray400, fontSize: 10, marginTop: 2, flexShrink: 0 }}>0{si+1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* CAUTION — 완전 무채색 회색 */}
            <div style={{ padding: "14px 24px", background: "#e8e8e8", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: "#888", flexShrink: 0, marginTop: 2, letterSpacing: 1 }}>CAUTION</span>
              <span style={{ fontSize: 13, color: "#555" }}>{ind.caution}</span>
            </div>
          </div>
        ))}

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
          <div style={{ border: `1px solid ${C.gray200}`, padding: "22px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray600, marginBottom: 10 }}>피해야 할 업종</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>{data.avoid}</p>
          </div>
          {/* 이번 주 실행 — 백색 */}
          <div style={{ background: "#ffffff", padding: "22px 24px", color: C.black, border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>이번 주 단 한 가지 실행</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, fontWeight: 700 }}>{data.quick_start}</p>
          </div>
        </div>

        {/* Motivation — 23% 회색 배경, 문단 없이 쭉 */}
        <div style={{ marginTop: 24, padding: "36px 32px", background: "#c4c4c4" }}>
          <p style={{ fontSize: 15, color: C.white, lineHeight: 1.95, maxWidth: 540, margin: "0 auto", textAlign: "justify" }}>
            {data.motivation}
          </p>
        </div>

      </div>{/* end pdf area */}

      {/* PDF */}
      <PdfExport />

      {/* Restart */}
      <div className="no-print" style={{ textAlign: "center", marginTop: 48 }}>
        <button onClick={onRestart} style={{ padding: "12px 36px", background: C.white, border: `1px solid ${C.gray200}`, cursor: "pointer", fontSize: 13, color: C.gray400 }}>
          처음부터 다시 하기
        </button>
      </div>
    </div>
  );
}

// ── Prompt Builder ──────────────────────────────────────────────
function buildPrompt(a) {
  const viaScores = { '학습 욕구': a.via_learning||0, '비판적 사고': a.via_critical||0, '창의성': a.via_creativity||0, '용맹': a.via_bravery||0, '끈기': a.via_perseverance||0, '공감': a.via_empathy||0, '리더십': a.via_leadership||0, '공정성': a.via_fairness||0, '신중함': a.via_prudence||0, '심미안': a.via_beauty||0, '유머': a.via_humor||0 };
  const topVia = Object.entries(viaScores).sort(([,a],[,b])=>b-a).slice(0,5).map(([k,v])=>`${k}(${v}점)`).join(', ');
  return `당신은 1인 창업 전문 컨설턴트입니다. 아래 데이터를 심층 분석하여 이 사람에게 가장 맞는 업종과 실행 전략을 제시하세요.

[VIA 강점 점수 - 상위 5개]
${topVia}

[관심사 프로파일]
- 업무 스타일: ${a.work_style||'미응답'}
- 관심 분야: ${(a.interests||[]).join(', ')||'미응답'}
- 선호 업무 환경: ${(a.work_env||[]).join(', ')||'미응답'}
- 기꺼이 돈 쓰는 분야: ${a.spending||'미응답'}
- 주변이 자주 부탁하는 것: ${a.peer_ask||'미응답'}

[가치관]
- 창업 목표: ${a.biz_goal||'미응답'}
- 리스크 허용도: ${a.risk_tolerance||0}/5
- 성공 비전: ${a.success_vision||'미응답'}
- 타협 불가 조건: ${(a.non_negotiable||[]).join(', ')||'미응답'}
- 가장 두려운 것: ${a.fears||'미응답'}

[직업경험]
- 직무 이력: ${a.job_history||'미응답'}
- 최고의 성취 순간: ${a.best_moment||'미응답'}
- 힘들었던 경험: ${a.worst_moment||'미응답'}
- 보유 스킬/자격: ${a.skills||'미응답'}
- 현재 상황: ${a.current_status||'미응답'}
- 초기 자금: ${a.budget||'미응답'}

반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만:
{"profile_title":"이 사람을 한 줄로 표현하는 직관적 제목","profile_summary":"이 사람의 강점과 특성을 2-3문장으로 요약","top_strengths":["강점1","강점2","강점3","강점4","강점5"],"strength_scores":[88,82,75,68,60],"recommended_industries":[{"rank":1,"name":"업종명","fit_score":92,"why":"이유","market_opportunity":"시장 기회","first_steps":["단계1","단계2","단계3"],"caution":"주의점"},{"rank":2,"name":"업종명","fit_score":85,"why":"이유","market_opportunity":"시장 기회","first_steps":["단계1","단계2","단계3"],"caution":"주의점"},{"rank":3,"name":"업종명","fit_score":78,"why":"이유","market_opportunity":"시장 기회","first_steps":["단계1","단계2","단계3"],"caution":"주의점"}],"avoid":"피해야 할 업종 유형과 이유","quick_start":"지금 당장 이번 주 안에 할 수 있는 가장 작은 실행 한 가지","motivation":"이 사람에게 건네는 따뜻하고 구체적인 응원 메시지"}`;
}

const LOADING_MSGS = ["VIA 강점 패턴을 파악하고 있어요", "관심사와 가치관을 교차 분석 중이에요", "직업경험에서 핵심 역량을 추출하고 있어요", "시장 데이터와 연결하고 있어요", "맞춤 창업 전략을 생성하고 있어요"];

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [loadingPct, setLoadingPct] = useState(0);
  const [result, setResult] = useState(null);
  const topRef = useRef(null);
  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const goTo = n => { setPhase(n); setTimeout(scrollTop, 50); };

  const runAnalysis = async () => {
    setLoading(true); setPhase(5); setLoadingPct(0); setTimeout(scrollTop, 50);
    let idx = 0;
    let pct = 0;
    const interval = setInterval(() => {
      idx = (idx+1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[idx]);
    }, 1800);
    // 진행률 애니메이션 — 90%까지 자연스럽게 올라가다가 완료시 100%
    const pctInterval = setInterval(() => {
      pct = pct < 88 ? pct + Math.random() * 4 : pct + 0.3;
      if (pct > 92) pct = 92;
      setLoadingPct(Math.round(pct));
    }, 400);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 4000, messages: [{ role: "user", content: buildPrompt(answers) }] })
      });
      clearInterval(interval);

      // 텍스트로 먼저 받아서 JSON 여부 확인
      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); }
      catch { setResult({ error: `서버 응답 오류 (${res.status}): ${raw.slice(0, 200)}` }); return; }

      if (data.error) { setResult({ error: `API 오류: ${data.error?.message || JSON.stringify(data.error)}` }); return; }

      const text = (data.content||[]).map(c => c.text||"").join("");
      setLoadingPct(100);
      try { setResult(JSON.parse(text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim())); }
      catch { setResult({ error: `결과 파싱 오류: ${text.slice(0, 300)}` }); }
    } catch(err) { clearInterval(interval); clearInterval(pctInterval); setResult({ error: `연결 오류: ${err.message}` }); }
    finally { clearInterval(pctInterval); setLoading(false); }
  };

  const restart = () => { setPhase(1); setAnswers({}); setResult(null); setTimeout(scrollTop, 50); };
  const phases = [{ n:1, label:"VIA 강점" }, { n:2, label:"관심사" }, { n:3, label:"가치관" }, { n:4, label:"직업경험" }, { n:5, label:"결과" }];
  const nextLabel = ["", "관심사 →", "가치관 →", "직업경험 →", ""];

  return (
    <div style={{ background: C.white, minHeight: "100vh", color: C.black }}>
      <style>{globalStyle}</style>
      <div ref={topRef} />

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: C.gray200, zIndex: 200 }}>
        <div style={{ height: "100%", background: C.white, width: `${phase<=4 ? ((phase-1)/4)*100 : 100}%`, transition: "width .4s ease" }} />
      </div>

      {/* Header — black */}
      <header className="no-print" style={{ background: C.black, borderBottom: `1px solid #222` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          {/* Logo + slogan inline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5, color: C.white, whiteSpace: "nowrap" }}>Business DNA Finder</span>
            <span style={{ width: 1, height: 14, background: "#444", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#888", whiteSpace: "nowrap", letterSpacing: 0.5 }}>나에게 맞는 사업은?</span>
          </div>
          {/* Phase nav */}
          <div style={{ display: "flex" }}>
            {phases.map(p => {
              const isActive = phase === p.n, isDone = phase > p.n;
              return (
                <div key={p.n} style={{ padding: "0 10px", height: 58, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, color: isActive ? C.white : isDone ? "#888" : "#555", borderBottom: `2px solid ${isActive ? C.white : "transparent"}`, textTransform: "uppercase", transition: "all .2s" }}>
                  <span style={{ width: 15, height: 15, borderRadius: "50%", background: isDone ? "#555" : "transparent", border: `1px solid ${isDone ? "#555" : "currentColor"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: isDone ? C.white : "currentColor", flexShrink: 0 }}>
                    {isDone ? "✓" : p.n}
                  </span>
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hero — only phase 1 */}
      {phase === 1 && (
        <div className="hero-section" style={{ textAlign: "center", padding: "72px 32px 60px", borderBottom: `1px solid ${C.gray200}`, background: C.white }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.gray400, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>1인 창업 컨설팅 프로그램</div>
          <h1 style={{ fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.15, color: C.black, marginBottom: 20 }}>
            나에게 맞는 사업은?
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray600, lineHeight: 1.9, maxWidth: 420, margin: "0 auto" }}>
            VIA 강점 · 관심사 · 가치관 · 직업경험을 통합 분석하여<br />
            지금 시장에서 당신이 빛날 수 있는 방향을 제시합니다
          </p>
        </div>
      )}

      {/* Main */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 32px 100px" }}>
        {phase === 1 && <Phase1 answers={answers} setAnswers={setAnswers} />}
        {phase === 2 && <Phase2 answers={answers} setAnswers={setAnswers} />}
        {phase === 3 && <Phase3 answers={answers} setAnswers={setAnswers} />}
        {phase === 4 && <Phase4 answers={answers} setAnswers={setAnswers} />}

        {/* Nav buttons */}
        {phase <= 4 && (
          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 52, paddingTop: 28, borderTop: `1px solid ${C.gray200}` }}>
            {phase > 1
              ? <button onClick={() => goTo(phase-1)} style={{ padding: "12px 28px", background: C.white, color: C.gray600, border: `1px solid ${C.gray200}`, cursor: "pointer", fontSize: 13 }}>← 이전</button>
              : <div />
            }
            {phase < 4
              ? <button onClick={() => goTo(phase+1)} style={{ padding: "12px 28px", background: C.black, color: C.white, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{nextLabel[phase]}</button>
              : <button onClick={runAnalysis} style={{ padding: "14px 40px", background: C.black, color: C.white, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>AI 분석 시작하기 →</button>
            }
          </div>
        )}

        {/* Loading */}
        {phase === 5 && loading && (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            {/* 원형 스피너 */}
            <div style={{ width: 36, height: 36, border: `1px solid ${C.gray200}`, borderTopColor: C.black, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 32px" }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: C.black, marginBottom: 6, letterSpacing: -0.5 }}>분석하고 있습니다</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400, letterSpacing: 1, marginBottom: 28 }}>{loadingMsg}</div>
            {/* 진행률 바 */}
            <div style={{ maxWidth: 320, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gray400 }}>진행률</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: C.black }}>{loadingPct}%</span>
              </div>
              <div style={{ height: 4, background: C.gray100, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: C.black, width: `${loadingPct}%`, transition: "width .4s ease", borderRadius: 2 }} />
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {phase === 5 && !loading && <ResultView data={result} onRestart={restart} />}
      </main>
    </div>
  );
}
