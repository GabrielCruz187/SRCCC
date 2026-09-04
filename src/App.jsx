// SRCCC — Sistema de Gestão do Clube (protótipo)
// Como usar: npm i react react-dom recharts lucide-react
// Depois importe este componente <SRCCCApp /> num projeto Vite/CRA/Next.

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Sector,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line,
  ComposedChart, RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import {
  LayoutDashboard, Users, Wallet, CalendarDays, Trophy, Waves,
  PartyPopper, ScanLine, FileBarChart, Settings, Menu, X, Search,
  Bell, Plus, Download, Send, Eye, Pencil, Flame, Volleyball,
  Landmark, ShieldCheck, Sun, Moon, TrendingUp, TrendingDown, CheckCircle2, Info
} from "lucide-react";

// ---------------- THEME ----------------
const THEMES = {
  light: {
    bg: "#FBFAF4", surface: "#FFFFFF", surfaceAlt: "#F4F2E8",
    text: "#1B2A1E", textSoft: "#5C6857", border: "#E4E2D6",
    greenDark: "#1E4A26", green: "#2E6B39", gold: "#E7B824", goldLight: "#F6DE86",
    red: "#B23A2E", redBg: "#FBEAE7", amber: "#9A6B0E", amberBg: "#FBF1DA",
    ok: "#276B3F", okBg: "#E7F3EA", shadow: "rgba(20,45,20,0.08)",
    kpiNumber: "#1E4A26",
  },
  dark: {
    bg: "#0F1B12", surface: "#182619", surfaceAlt: "#1E2E1F",
    text: "#EAF1E6", textSoft: "#9CB093", border: "#2A3D2A",
    greenDark: "#2E6B39", green: "#3E8A4C", gold: "#F0C239", goldLight: "#F6DE86",
    red: "#E0665A", redBg: "#3A1E1B", amber: "#E0B45B", amberBg: "#3A2E14",
    ok: "#5BC784", okBg: "#173322", shadow: "rgba(0,0,0,0.35)",
    kpiNumber: "#7FE0A0",
  },
};

const revenueData = [
  { m: "Abr", v: 34200 }, { m: "Mai", v: 38900 }, { m: "Jun", v: 36100 },
  { m: "Jul", v: 41800 }, { m: "Ago", v: 39700 }, { m: "Set", v: 48230 },
];
const spacesUsageData = [
  { name: "Salão", v: 12 }, { name: "Churr. 1", v: 20 }, { name: "Churr. 2", v: 14 },
  { name: "Quadra", v: 26 }, { name: "Society", v: 18 }, { name: "Campo 11", v: 9 },
];
const memberFlowData = [
  { m: "Abr", novos: 9, saidas: 3 }, { m: "Mai", novos: 7, saidas: 4 },
  { m: "Jun", novos: 11, saidas: 2 }, { m: "Jul", novos: 8, saidas: 5 },
  { m: "Ago", novos: 13, saidas: 3 }, { m: "Set", novos: 15, saidas: 4 },
];
const occupancyRate = 68;
const sparkline = [40, 44, 39, 48, 52, 58, 61];

// ---------------- helpers ----------------
function useCountUp(to, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return val;
}

function KpiNumber({ value, prefix = "", decimals = 0 }) {
  const v = useCountUp(value);
  const display = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("pt-BR");
  return <span className="kpi-number">{prefix}{display}</span>;
}

function Sparkline({ data, color }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 64, height: 28 }}>
      <ResponsiveContainer>
        <LineChart data={points}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive animationDuration={1100} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Toasts({ toasts }) {
  const icons = { ok: CheckCircle2, warn: Info };
  return (
    <div className="toast-stack">
      {toasts.map((t) => {
        const Icon = icons[t.tone] || CheckCircle2;
        return (
          <div key={t.id} className={"toast toast-" + t.tone}>
            <Icon size={16} />
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

function Confetti({ pieces }) {
  return (
    <div className="confetti-layer">
      {pieces.map((p, i) => (
        <span key={i} className="confetti-piece" style={{
          left: p.left + "%", background: p.color, animationDelay: p.delay + "s",
          animationDuration: p.duration + "s", transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

function Pill({ tone = "neutral", children, T }) {
  const map = {
    ok: { bg: T.okBg, c: T.ok }, warn: { bg: T.amberBg, c: T.amber },
    bad: { bg: T.redBg, c: T.red }, neutral: { bg: T.surfaceAlt, c: T.textSoft },
  };
  const s = map[tone];
  return <span className="pill" style={{ background: s.bg, color: s.c }}>{children}</span>;
}

function MiniAvatar({ text }) { return <span className="mini-avatar">{text}</span>; }

function Card({ title, action, children, style, T }) {
  return (
    <div className="card" style={style}>
      {title && <div className="card-head"><h3>{title}</h3>{action}</div>}
      {children}
    </div>
  );
}
function TableWrap({ children }) { return <div className="table-wrap">{children}</div>; }

// custom tooltip for area chart
function RevenueTooltip({ active, payload, label, T }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip" style={{ background: T.surface, borderColor: T.border, color: T.text }}>
      <div className="tt-label">{label}</div>
      <div className="tt-value">R$ {payload[0].value.toLocaleString("pt-BR")}</div>
    </div>
  );
}

// active shape for donut hover expansion
function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={22} fontWeight={700} fill={fill} fontFamily="Georgia, serif">{value}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={11} fill="#8a9585">{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 7} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 1} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.35} />
    </g>
  );
}

// ---------------- nav config ----------------
const NAV = [
  { group: "Visão geral", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { group: "Associados", items: [{ id: "socios", label: "Sócios & Dependentes", icon: Users }] },
  { group: "Financeiro", items: [{ id: "financeiro", label: "Mensalidades & Taxas", icon: Wallet, badge: 24 }] },
  { group: "Espaços & Atividades", items: [
      { id: "reservas", label: "Reservas de Espaços", icon: CalendarDays },
      { id: "futebol", label: "Futebol (Campo 11/7)", icon: Trophy },
      { id: "piscina", label: "Piscina & Lazer", icon: Waves },
      { id: "eventos", label: "Eventos & Convidados", icon: PartyPopper },
    ] },
  { group: "Controle", items: [
      { id: "acesso", label: "Controle de Acesso", icon: ScanLine },
      { id: "relatorios", label: "Relatórios", icon: FileBarChart },
      { id: "config", label: "Configurações", icon: Settings },
    ] },
];
const TITLES = {
  dashboard: "Dashboard", socios: "Sócios & Dependentes", financeiro: "Mensalidades & Taxas",
  reservas: "Reservas de Espaços", futebol: "Futebol — Campo 11 e 7", piscina: "Piscina & Lazer",
  eventos: "Eventos & Convidados", acesso: "Controle de Acesso", relatorios: "Relatórios", config: "Configurações",
};

export default function SRCCCApp() {
  const [mode, setMode] = useState("light");
  const T = THEMES[mode];
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [socioTab, setSocioTab] = useState("titulares");
  const [finTab, setFinTab] = useState("mensalidades");
  const [modal, setModal] = useState(null);
  const [activePie, setActivePie] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const confettiPieces = useMemo(() => {
    const colors = ["#E7B824", "#2E6B39", "#F6DE86", "#1E4A26"];
    return Array.from({ length: 36 }).map((_, i) => ({
      left: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.4,
      rot: Math.random() * 360,
    }));
  }, []);

  function notify(msg, tone = "ok") {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function handleLogin() {
    setLoggedIn(true);
    setConfetti(true);
    notify("Bem-vinda de volta, Marisa!", "ok");
    setTimeout(() => setConfetti(false), 2200);
  }

  function goTo(id) { setView(id); setMenuOpen(false); }

  const cssVars = {
    "--bg": T.bg, "--surface": T.surface, "--surface-alt": T.surfaceAlt, "--text": T.text,
    "--text-soft": T.textSoft, "--border": T.border, "--green-dark": T.greenDark, "--green": T.green,
    "--gold": T.gold, "--gold-light": T.goldLight, "--red": T.red, "--red-bg": T.redBg,
    "--amber": T.amber, "--amber-bg": T.amberBg, "--ok": T.ok, "--ok-bg": T.okBg, "--shadow": T.shadow,
    "--kpi-number": T.kpiNumber,
  };

  const statusData = [
    { name: "Em dia", value: 268, color: T.ok },
    { name: "Pendente", value: 20, color: T.amber },
    { name: "Inadimplente", value: 24, color: T.red },
  ];

  return (
    <div style={{ ...cssVars, fontFamily: "'Inter', system-ui, sans-serif", color: "var(--text)", minHeight: "100vh", background: "var(--bg)", transition: "background .35s ease, color .35s ease" }}>
      <style>{css}</style>

      {!loggedIn && (
        <div className="login-screen">
          <button className="theme-toggle floating" onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label="Alternar tema">
            {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className="login-card">
            <div className="badge"><span>SRCCC</span></div>
            <h1>Sistema de Gestão do Clube</h1>
            <div className="club-full">Sociedade Recreativa Comercial e Cultural de Constantina</div>
            <div className="field"><label>Usuário ou e-mail</label><input defaultValue="secretaria@srccc.com.br" /></div>
            <div className="field"><label>Senha</label><input type="password" defaultValue="senha123" /></div>
            <div className="login-row">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" defaultChecked style={{ width: 14, height: 14 }} /> Manter conectado</label>
              <a href="#">Esqueci a senha</a>
            </div>
            <button className="btn-primary" onClick={handleLogin}>Entrar</button>
            <div className="demo-note">Protótipo de demonstração — clique em "Entrar" para explorar o painel.</div>
            <div className="login-foot">© Clube Comercial · SRCCC — uso interno e restrito</div>
          </div>
        </div>
      )}

      {loggedIn && (
        <div className="app">
          {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
          <aside className={"sidebar" + (menuOpen ? " open" : "")}>
            <div className="sidebar-head">
              <div className="sidebar-badge"><span>SR<br />CC</span></div>
              <div><div className="name">SRCCC</div><div className="sub">Painel Administrativo</div></div>
              <button className="close-drawer" onClick={() => setMenuOpen(false)}><X size={18} /></button>
            </div>
            <nav className="navlist">
              {NAV.map((g) => (
                <div key={g.group}>
                  <div className="nav-group-label">{g.group}</div>
                  {g.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <a key={it.id} className={"navlink" + (view === it.id ? " active" : "")} onClick={() => goTo(it.id)}>
                        <Icon size={16} className="ic" />
                        <span>{it.label}</span>
                        {it.badge ? <span className="badge-count">{it.badge}</span> : null}
                      </a>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="sidebar-foot">v0.5 — protótipo · não salva dados</div>
          </aside>

          <div className="main">
            <div className="topbar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className="hamburger" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
                <h2>{TITLES[view]}</h2>
              </div>
              <div className="topbar-right">
                <div className="search-box desktop-only"><Search size={14} /> <input placeholder="Buscar sócio, matrícula..." /></div>
                <button className="theme-toggle" onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label="Alternar tema">
                  <span className={"toggle-track" + (mode === "dark" ? " dark" : "")}>
                    <span className="toggle-thumb">{mode === "light" ? <Sun size={12} /> : <Moon size={12} />}</span>
                  </span>
                </button>
                <button className="icon-btn"><Bell size={17} /></button>
                <div className="avatar">MC</div>
              </div>
            </div>

            <div className="content" key={view}>
              {view === "dashboard" && <Dashboard T={T} goTo={goTo} statusData={statusData} activePie={activePie} setActivePie={setActivePie} />}
              {view === "socios" && <Socios T={T} socioTab={socioTab} setSocioTab={setSocioTab} openModal={setModal} />}
              {view === "financeiro" && <Financeiro T={T} finTab={finTab} setFinTab={setFinTab} notify={notify} />}
              {view === "reservas" && <Reservas T={T} openModal={setModal} notify={notify} />}
              {view === "futebol" && <Futebol T={T} />}
              {view === "piscina" && <Piscina T={T} />}
              {view === "eventos" && <Eventos T={T} openModal={setModal} />}
              {view === "acesso" && <Acesso T={T} />}
              {view === "relatorios" && <Relatorios T={T} />}
              {view === "config" && <Config T={T} />}
            </div>
          </div>
        </div>
      )}

      {modal && <Modal type={modal} onClose={() => setModal(null)} notify={notify} />}
      {confetti && <Confetti pieces={confettiPieces} />}
      <Toasts toasts={toasts} />
    </div>
  );
}

// ================= VIEWS =================

function Dashboard({ T, goTo, statusData, activePie, setActivePie }) {
  return (
    <div className="view">
      <div className="banner">⚠️ Protótipo com dados fictícios para validação com o cliente. Nenhuma informação é salva.</div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ animationDelay: "0s" }}>
          <div className="kpi-top">
            <div className="label">Sócios ativos</div>
            <Sparkline data={sparkline} color={T.green} />
          </div>
          <div className="value"><KpiNumber value={312} /></div>
          <div className="delta up"><TrendingUp size={13} /> 6 este mês</div>
        </div>
        <div className="kpi-card" style={{ animationDelay: ".05s" }}>
          <div className="kpi-top">
            <div className="label">Inadimplentes</div>
            <Sparkline data={[10, 14, 12, 18, 20, 22, 24]} color={T.red} />
          </div>
          <div className="value"><KpiNumber value={24} /></div>
          <div className="delta down"><TrendingDown size={13} /> 3 vs. mês anterior</div>
        </div>
        <div className="kpi-card" style={{ animationDelay: ".1s" }}>
          <div className="kpi-top">
            <div className="label">Receita do mês</div>
            <Sparkline data={revenueData.map(d => d.v / 1000)} color={T.gold} />
          </div>
          <div className="value">R$ <KpiNumber value={48230} /></div>
          <div className="delta up"><TrendingUp size={13} /> 4,2%</div>
        </div>
        <div className="kpi-card" style={{ animationDelay: ".15s" }}>
          <div className="kpi-top"><div className="label">Reservas hoje</div><span className="live-tag"><span className="live-dot" />ao vivo</span></div>
          <div className="value"><KpiNumber value={5} /></div>
          <div className="delta neutral">Salão, quadra, churrasqueira</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <Card title="Receita — últimos 6 meses" action={<a className="link" onClick={() => goTo("financeiro")}>Ver financeiro</a>}>
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.gold} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={T.gold} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 12, fill: T.textSoft }} axisLine={{ stroke: T.border }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.textSoft }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip content={<RevenueTooltip T={T} />} cursor={{ stroke: T.green, strokeDasharray: "4 4" }} />
                  <Area type="monotone" dataKey="v" stroke={T.greenDark} strokeWidth={3} fill="url(#rev)" animationDuration={1200} animationEasing="ease-out"
                    activeDot={{ r: 6, stroke: T.paper, strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Ocupação de espaços (reservas no mês)">
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <BarChart data={spacesUsageData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }} barCategoryGap="28%">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.green} />
                      <stop offset="100%" stopColor={T.greenDark} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textSoft }} axisLine={{ stroke: T.border }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.textSoft }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12.5, background: T.surface, color: T.text }} cursor={{ fill: T.surfaceAlt }} />
                  <Bar dataKey="v" radius={[7, 7, 0, 0]} fill="url(#barGrad)" animationDuration={1000} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Novos sócios x saídas">
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <ComposedChart data={memberFlowData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 12, fill: T.textSoft }} axisLine={{ stroke: T.border }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.textSoft }} axisLine={false} tickLine={false} width={26} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12.5, background: T.surface, color: T.text }} cursor={{ fill: T.surfaceAlt }} />
                  <Bar dataKey="novos" name="Novos" fill={T.green} radius={[6, 6, 0, 0]} barSize={18} animationDuration={1000} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="saidas" name="Saídas" stroke={T.red} strokeWidth={2.5} dot={{ r: 3.5, fill: T.red, strokeWidth: 0 }} animationDuration={1300} animationEasing="ease-out" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-row">
              <div className="legend-item"><span className="dot" style={{ background: T.green }} /> Novos sócios</div>
              <div className="legend-item"><span className="dot" style={{ background: T.red }} /> Saídas / cancelamentos</div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Taxa de ocupação média">
            <div className="gauge-wrap">
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  cx="50%" cy="50%" innerRadius="72%" outerRadius="100%" barSize={14}
                  data={[{ value: occupancyRate, fill: T.green }]} startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                  <RadialBar background={{ fill: T.surfaceAlt }} dataKey="value" cornerRadius={20} animationDuration={1200} animationEasing="ease-out" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="gauge-center">
                <div className="gauge-value">{occupancyRate}%</div>
                <div className="gauge-label">dos espaços</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: T.textSoft, textAlign: "center", marginTop: 4 }}>Média de uso dos espaços reserváveis no mês</p>
          </Card>

          <Card title="Situação dos sócios">
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={4}
                    activeIndex={activePie} activeShape={renderActiveShape}
                    onMouseEnter={(_, i) => setActivePie(i)}
                    animationDuration={1000} animationEasing="ease-out"
                  >
                    {statusData.map((s, i) => <Cell key={i} fill={s.color} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-row">
              {statusData.map((s, i) => (
                <div key={s.name} className={"legend-item" + (activePie === i ? " active" : "")} onMouseEnter={() => setActivePie(i)}>
                  <span className="dot" style={{ background: s.color }} /> {s.name} <b>{s.value}</b>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Aniversariantes do mês">
            <ul className="simple-list">
              <li><span className="who">Eliane Costa Bortoluzzi</span><span className="meta">03/09</span></li>
              <li><span className="who">Fernando Zanella</span><span className="meta">09/09</span></li>
              <li><span className="who">Lívia Weber (dep.)</span><span className="meta">14/09</span></li>
              <li><span className="who">Osvaldo Piovesan</span><span className="meta">22/09</span></li>
            </ul>
          </Card>

          <Card title="Próximos eventos" action={<a className="link" onClick={() => goTo("eventos")}>Agenda</a>}>
            <ul className="simple-list">
              <li><span className="who">Torneio Society Aniversário SRCCC</span><span className="meta">14/09</span></li>
              <li><span className="who">Baile de Primavera</span><span className="meta">20/09</span></li>
              <li><span className="who">Reunião de diretoria</span><span className="meta">27/09</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Socios({ T, socioTab, setSocioTab, openModal }) {
  return (
    <div className="view">
      <div className="subtabs">
        <button className={"subtab" + (socioTab === "titulares" ? " active" : "")} onClick={() => setSocioTab("titulares")}>Titulares</button>
        <button className={"subtab" + (socioTab === "dependentes" ? " active" : "")} onClick={() => setSocioTab("dependentes")}>Dependentes</button>
        <button className={"subtab" + (socioTab === "categorias" ? " active" : "")} onClick={() => setSocioTab("categorias")}>Categorias de sócio</button>
      </div>

      {socioTab === "titulares" && (
        <>
          <div className="toolbar">
            <div className="search-box"><Search size={14} /> <input placeholder="Buscar por nome ou matrícula..." /></div>
            <button className="btn-add" onClick={() => openModal("socio")}><Plus size={15} /> Novo sócio titular</button>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Sócio</th><th>Matrícula</th><th>Categoria</th><th>Dependentes</th><th>Status</th><th>Contato</th><th></th></tr></thead>
                <tbody>
                  {[
                    ["RA", "Rogério Antunes Silva", "Sócio desde 2011", "0421", "Patrimonial", 2, "ok", "Em dia", "(54) 99911-2233"],
                    ["JB", "João Pedro Bortoluzzi", "Sócio desde 2018", "0788", "Contribuinte", 1, "ok", "Em dia", "(54) 99822-1190"],
                    ["MW", "Marta Weber", "Sócio desde 2005", "0119", "Patrimonial", 3, "warn", "Pendente", "(54) 99977-4410"],
                    ["OP", "Osvaldo Piovesan", "Sócio desde 1998", "0034", "Benemérito", 0, "ok", "Em dia", "(54) 99655-0021"],
                    ["FZ", "Fernando Zanella", "Sócio desde 2022", "0902", "Contribuinte", 2, "bad", "Inadimplente (46d)", "(54) 99544-9981"],
                  ].map((r) => (
                    <tr key={r[3]}>
                      <td><div className="name-cell"><MiniAvatar text={r[0]} /><div><div className="row-name">{r[1]}</div><div className="row-sub">{r[2]}</div></div></div></td>
                      <td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}</td>
                      <td><Pill tone={r[6]} T={T}>{r[7]}</Pill></td>
                      <td>{r[8]}</td>
                      <td className="table-actions"><button><Eye size={13} /> Ver</button><button><Pencil size={13} /> Editar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {socioTab === "dependentes" && (
        <>
          <div className="toolbar">
            <div className="search-box"><Search size={14} /> <input placeholder="Buscar dependente..." /></div>
            <button className="btn-add" onClick={() => openModal("dependente")}><Plus size={15} /> Novo dependente</button>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Dependente</th><th>Titular vinculado</th><th>Parentesco</th><th>Idade</th><th>Taxa aplicável</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {[
                    ["CA", "Camila Antunes Silva", "Rogério Antunes Silva", "Cônjuge", 34, "R$ 73,49", "ok", "Ativo"],
                    ["LB", "Lucas Antunes Silva", "Rogério Antunes Silva", "Filho", 9, "R$ 36,74", "ok", "Ativo"],
                    ["LW", "Lívia Weber", "Marta Weber", "Filha", 16, "R$ 55,12", "ok", "Ativo"],
                    ["IW", "Ivo Weber", "Marta Weber", "Pai", 68, "R$ 36,74", "warn", "Pendente"],
                    ["BW", "Bento Weber", "Marta Weber", "Filho", 3, null, "ok", "Ativo"],
                  ].map((r) => (
                    <tr key={r[1]}>
                      <td><div className="name-cell"><MiniAvatar text={r[0]} /><span className="row-name">{r[1]}</span></div></td>
                      <td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td>
                      <td>{r[5] ? r[5] : <Pill tone="neutral" T={T}>Isento</Pill>}</td>
                      <td><Pill tone={r[6]} T={T}>{r[7]}</Pill></td>
                      <td className="table-actions"><button><Eye size={13} /> Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {socioTab === "categorias" && (
        <Card title="Categorias de sócio">
          <TableWrap>
            <table>
              <thead><tr><th>Categoria</th><th>Descrição</th><th>Mensalidade</th><th>Direito a voto</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Fundador</td><td>Assinou a ata de fundação</td><td><Pill tone="neutral" T={T}>Isento</Pill></td><td>Sim</td></tr>
                <tr><td className="row-name">Patrimonial</td><td>Possui título de propriedade</td><td>R$ 193,36</td><td>Sim</td></tr>
                <tr><td className="row-name">Contribuinte</td><td>Mensalista sem título</td><td>R$ 155,00</td><td>Não</td></tr>
                <tr><td className="row-name">Benemérito</td><td>Distinção concedida pela Assembleia</td><td><Pill tone="neutral" T={T}>Isento</Pill></td><td>Sim</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}
    </div>
  );
}

function Financeiro({ T, finTab, setFinTab, notify }) {
  return (
    <div className="view">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">Previsto no mês</div><div className="value">R$ <KpiNumber value={52900} /></div></div>
        <div className="kpi-card"><div className="label">Recebido</div><div className="value">R$ <KpiNumber value={48230} /></div></div>
        <div className="kpi-card"><div className="label">A receber</div><div className="value">R$ <KpiNumber value={4670} /></div></div>
        <div className="kpi-card"><div className="label">Inadimplência</div><div className="value"><KpiNumber value={7.7} decimals={1} />%</div></div>
      </div>

      <div className="subtabs">
        <button className={"subtab" + (finTab === "mensalidades" ? " active" : "")} onClick={() => setFinTab("mensalidades")}>Mensalidades</button>
        <button className={"subtab" + (finTab === "inadimplencia" ? " active" : "")} onClick={() => setFinTab("inadimplencia")}>Inadimplência</button>
        <button className={"subtab" + (finTab === "taxas" ? " active" : "")} onClick={() => setFinTab("taxas")}>Tabela de taxas</button>
      </div>

      {finTab === "mensalidades" && (
        <>
          <div className="toolbar">
            <div className="search-box"><Search size={14} /> <input placeholder="Buscar sócio..." /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost"><Download size={14} /> Exportar</button>
              <button className="btn-add"><Plus size={15} /> Gerar boletos do mês</button>
            </div>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Sócio</th><th>Referência</th><th>Vencimento</th><th>Valor</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  <tr><td className="row-name">Rogério Antunes Silva</td><td>Set/2026</td><td>10/09/2026</td><td>R$ 193,36</td><td><Pill tone="ok" T={T}>Pago</Pill></td><td className="table-actions"><button>Recibo</button></td></tr>
                  <tr><td className="row-name">João Pedro Bortoluzzi</td><td>Set/2026</td><td>10/09/2026</td><td>R$ 155,00</td><td><Pill tone="ok" T={T}>Pago</Pill></td><td className="table-actions"><button>Recibo</button></td></tr>
                  <tr><td className="row-name">Marta Weber</td><td>Set/2026</td><td>10/09/2026</td><td>R$ 266,84</td><td><Pill tone="warn" T={T}>Pendente</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Marta Weber", "warn")}><Send size={13} /> Cobrar</button></td></tr>
                  <tr><td className="row-name">Fernando Zanella</td><td>Ago/2026</td><td>10/08/2026</td><td>R$ 155,00</td><td><Pill tone="bad" T={T}>Atrasado 46d</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Fernando Zanella", "warn")}>Cobrar</button><button onClick={() => notify("Sócio encaminhado para negativação", "bad")}>Negativar</button></td></tr>
                  <tr><td className="row-name">Osvaldo Piovesan</td><td>Set/2026</td><td>—</td><td>R$ 0,00</td><td><Pill tone="neutral" T={T}>Isento</Pill></td><td className="table-actions"><button>Ver</button></td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {finTab === "inadimplencia" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Sócio</th><th>Matrícula</th><th>Valor em aberto</th><th>Dias em atraso</th><th>Ação</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Fernando Zanella</td><td>0902</td><td>R$ 310,00</td><td><Pill tone="bad" T={T}>46 dias</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Fernando Zanella", "warn")}>Enviar cobrança</button><button onClick={() => notify("Negociação iniciada", "ok")}>Negociar</button></td></tr>
                <tr><td className="row-name">Ivo Weber (dep.)</td><td>0119-2</td><td>R$ 36,74</td><td><Pill tone="warn" T={T}>12 dias</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Ivo Weber", "warn")}>Enviar cobrança</button></td></tr>
                <tr><td className="row-name">Cristiane Locatelli</td><td>0567</td><td>R$ 155,00</td><td><Pill tone="warn" T={T}>8 dias</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Cristiane Locatelli", "warn")}>Enviar cobrança</button></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {finTab === "taxas" && (
        <Card title="Taxas e mensalidades vigentes">
          <TableWrap>
            <table>
              <thead><tr><th>Item</th><th>Valor</th></tr></thead>
              <tbody>
                <tr><td>Sócio patrimonial (individual)</td><td>R$ 193,36</td></tr>
                <tr><td>Sócio patrimonial (casal)</td><td>R$ 367,44</td></tr>
                <tr><td>Sócio contribuinte</td><td>R$ 155,00</td></tr>
                <tr><td>Dependente até 4 anos</td><td><Pill tone="neutral" T={T}>Isento</Pill></td></tr>
                <tr><td>Dependente de 5 a 13 anos</td><td>R$ 36,74</td></tr>
                <tr><td>Dependente de 14 a 17 anos</td><td>R$ 55,12</td></tr>
                <tr><td>Dependente (pais) até 59 anos</td><td>R$ 73,49</td></tr>
                <tr><td>Dependente 60 anos ou mais</td><td>R$ 36,74</td></tr>
                <tr><td>Carteirinha (emissão/2ª via)</td><td>R$ 20,90</td></tr>
                <tr><td>Reinclusão de dependente</td><td>R$ 392,62</td></tr>
                <tr><td>Jóia de admissão</td><td>Conforme categoria</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}
    </div>
  );
}

function Reservas({ T, openModal, notify }) {
  const spaces = [
    { icon: PartyPopper, title: "Salão de Festas", cap: "150 pessoas", taxa: "R$ 280,00", next: "15/09" },
    { icon: Flame, title: "Churrasqueira 1", cap: "40 pessoas", taxa: "R$ 90,00", next: "Hoje, 18h" },
    { icon: Flame, title: "Churrasqueira 2", cap: "30 pessoas", taxa: "R$ 80,00", next: "Amanhã" },
    { icon: Volleyball, title: "Quadra Poliesportiva", cap: "Vôlei, futsal", taxa: "R$ 40,00/h", next: "Hoje, 20h" },
    { icon: Trophy, title: "Campo Society (7)", cap: "Sintético", taxa: "R$ 120,00/h", next: "Qui, 19h" },
    { icon: Landmark, title: "Campo Oficial (11)", cap: "Natural", taxa: "R$ 200,00/h", next: "Sáb, 09h" },
  ];
  return (
    <div className="view">
      <div className="toolbar">
        <h3 className="serif" style={{ fontSize: 16, color: "var(--green-dark)" }}>Espaços disponíveis para reserva</h3>
        <button className="btn-add" onClick={() => openModal("reserva")}><Plus size={15} /> Nova reserva</button>
      </div>
      <div className="space-grid">
        {spaces.map((s, i) => (
          <div className="space-card" key={s.title} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="top"><s.icon size={22} className="ic" /><h4>{s.title}</h4></div>
            <div className="body">
              <div className="row"><span>Detalhe</span><span>{s.cap}</span></div>
              <div className="row"><span>Taxa sócio</span><span>{s.taxa}</span></div>
              <div className="row"><span>Próxima livre</span><span>{s.next}</span></div>
            </div>
          </div>
        ))}
      </div>

      <Card title="Agenda de reservas" style={{ padding: 0, marginTop: 16 }}>
        <TableWrap>
          <table>
            <thead><tr><th>Espaço</th><th>Sócio responsável</th><th>Data</th><th>Horário</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td>Salão de Festas</td><td>Marta Weber</td><td>15/09/2026</td><td>19h—23h</td><td><Pill tone="ok" T={T}>Confirmada</Pill></td><td className="table-actions"><button>Detalhes</button></td></tr>
              <tr><td>Churrasqueira 1</td><td>Rogério Antunes Silva</td><td>Hoje</td><td>18h—22h</td><td><Pill tone="ok" T={T}>Confirmada</Pill></td><td className="table-actions"><button>Detalhes</button></td></tr>
              <tr><td>Campo Society (7)</td><td>Fernando Zanella</td><td>Qui, 19h</td><td>19h—20h</td><td><Pill tone="warn" T={T}>Aguard. pagamento</Pill></td><td className="table-actions"><button onClick={() => notify("Cobrança enviada para Fernando Zanella", "warn")}>Cobrar</button></td></tr>
              <tr><td>Quadra Poliesportiva</td><td>João Pedro Bortoluzzi</td><td>Hoje</td><td>20h—21h</td><td><Pill tone="ok" T={T}>Confirmada</Pill></td><td className="table-actions"><button>Detalhes</button></td></tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}

function Futebol({ T }) {
  return (
    <div className="view">
      <div className="grid-2">
        <div>
          <Card title="Campo Oficial — Futebol 11">
            <ul className="simple-list">
              <li><span className="who">Equipe Master SRCCC</span><span className="meta">Treino ter/qui, 19h</span></li>
              <li><span className="who">Campeonato Municipal — jogo</span><span className="meta">Sáb, 09h</span></li>
              <li><span className="who">Manutenção do gramado</span><span className="meta">Seg, período reservado</span></li>
            </ul>
          </Card>
          <Card title="Campo Society — Futebol 7">
            <ul className="simple-list">
              <li><span className="who">Escolinha infantil (sub-11)</span><span className="meta">Ter/qui, 17h30</span></li>
              <li><span className="who">Racha dos sócios</span><span className="meta">Sex, 20h</span></li>
              <li><span className="who">Fernando Zanella — reserva avulsa</span><span className="meta">Qui, 19h</span></li>
            </ul>
          </Card>
        </div>
        <div>
          <Card title="Escolinha de futebol">
            <div className="kv-list">
              <div className="kv"><span>Turmas ativas</span><b>4</b></div>
              <div className="kv"><span>Alunos matriculados</span><b>68</b></div>
              <div className="kv"><span>Mensalidade escolinha</span><b>R$ 60,00</b></div>
              <div className="kv"><span>Professores</span><b>3</b></div>
            </div>
            <button className="btn-ghost" style={{ marginTop: 14, width: "100%" }}>Ver turmas e matrículas</button>
          </Card>
          <Card title="Times cadastrados">
            <ul className="simple-list">
              <li><span className="who">SRCCC Sub-11</span><span className="meta">18 atletas</span></li>
              <li><span className="who">SRCCC Sub-15</span><span className="meta">21 atletas</span></li>
              <li><span className="who">SRCCC Master</span><span className="meta">24 atletas</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Piscina({ T }) {
  return (
    <div className="view">
      <div className="grid-2">
        <div>
          <Card title="Piscina — horários de funcionamento">
            <TableWrap>
              <table>
                <thead><tr><th>Dia</th><th>Livre / recreação</th><th>Aulas</th></tr></thead>
                <tbody>
                  <tr><td>Seg a sex</td><td>14h—18h</td><td>08h—12h</td></tr>
                  <tr><td>Sábado</td><td>09h—18h</td><td>—</td></tr>
                  <tr><td>Domingo</td><td>09h—17h</td><td>—</td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
          <Card title="Espaço de lazer">
            <ul className="simple-list">
              <li><span className="who">Playground</span><span className="meta">Aberto</span></li>
              <li><span className="who">Quiosques</span><span className="meta">3 de 5 reservados</span></li>
              <li><span className="who">Sala de jogos</span><span className="meta">Aberto</span></li>
            </ul>
          </Card>
        </div>
        <div>
          <Card title="Controle de capacidade">
            <div className="kv-list">
              <div className="kv"><span>Capacidade máxima</span><b>80 pessoas</b></div>
              <div className="kv"><span>No espaço agora</span><b>32 pessoas</b></div>
              <div className="kv"><span>Salva-vidas de plantão</span><b>2</b></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Eventos({ T, openModal }) {
  return (
    <div className="view">
      <div className="toolbar">
        <h3 className="serif" style={{ fontSize: 16, color: "var(--green-dark)" }}>Eventos do clube</h3>
        <button className="btn-add" onClick={() => openModal("evento")}><Plus size={15} /> Novo evento</button>
      </div>
      <Card style={{ padding: 0, marginBottom: 16 }}>
        <TableWrap>
          <table>
            <thead><tr><th>Evento</th><th>Data</th><th>Inscritos</th><th>Convidados</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td className="row-name">Torneio Society Aniversário SRCCC</td><td>14/09/2026</td><td>96</td><td>—</td><td><Pill tone="ok" T={T}>Confirmado</Pill></td><td className="table-actions"><button>Gerenciar</button></td></tr>
              <tr><td className="row-name">Baile de Primavera</td><td>20/09/2026</td><td>210</td><td>34</td><td><Pill tone="ok" T={T}>Confirmado</Pill></td><td className="table-actions"><button>Gerenciar</button></td></tr>
              <tr><td className="row-name">Reunião de diretoria</td><td>27/09/2026</td><td>12</td><td>—</td><td><Pill tone="warn" T={T}>Em divulgação</Pill></td><td className="table-actions"><button>Gerenciar</button></td></tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
      <Card title="Convidados com QR Code">
        <p style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.6 }}>
          Cada sócio titular pode gerar convites para convidados, com envio de QR Code por WhatsApp ou e-mail
          para liberação rápida na portaria, com limite mensal configurável por categoria de sócio.
        </p>
      </Card>
    </div>
  );
}

function Acesso({ T }) {
  return (
    <div className="view">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">Acessos hoje</div><div className="value"><KpiNumber value={184} /></div></div>
        <div className="kpi-card"><div className="label">Sócios no clube agora</div><div className="value"><KpiNumber value={57} /></div></div>
        <div className="kpi-card"><div className="label">Convidados hoje</div><div className="value"><KpiNumber value={12} /></div></div>
        <div className="kpi-card"><div className="label">Tentativas bloqueadas</div><div className="value"><KpiNumber value={3} /></div></div>
      </div>
      <Card title="Registro de entradas e saídas" style={{ padding: 0 }}>
        <TableWrap>
          <table>
            <thead><tr><th>Nome</th><th>Tipo</th><th>Entrada</th><th>Saída</th><th>Meio</th></tr></thead>
            <tbody>
              <tr><td className="row-name">Rogério Antunes Silva</td><td>Titular</td><td>18:20</td><td>—</td><td>Carteirinha</td></tr>
              <tr><td className="row-name">Camila Antunes Silva</td><td>Dependente</td><td>18:22</td><td>—</td><td>Carteirinha</td></tr>
              <tr><td className="row-name">João Pedro Bortoluzzi</td><td>Titular</td><td>17:50</td><td>19:10</td><td>App / QR</td></tr>
              <tr><td className="row-name">Fernando Zanella</td><td>Titular</td><td>—</td><td>—</td><td><Pill tone="bad" T={T}>Bloqueado (inadimplente)</Pill></td></tr>
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}

function Relatorios({ T }) {
  const reports = [
    { icon: Users, title: "Relatório de sócios", desc: "Ativos, inadimplentes, suspensos e novos cadastros por período e categoria." },
    { icon: Wallet, title: "Relatório financeiro", desc: "Receita prevista x realizada, inadimplência e projeção dos próximos meses." },
    { icon: ScanLine, title: "Frequência e acesso", desc: "Fluxo de entrada por dia, horário de pico e ranking de uso por sócio." },
    { icon: CalendarDays, title: "Ocupação de espaços", desc: "Reservas por espaço, taxa de ocupação e receita de locações." },
    { icon: Trophy, title: "Atividades esportivas", desc: "Matrículas em escolinhas e uso dos campos." },
    { icon: PartyPopper, title: "Eventos", desc: "Inscritos, convidados e receita gerada por evento realizado." },
  ];
  return (
    <div className="view">
      <div className="report-grid">
        {reports.map((r, i) => (
          <div className="report-card" key={r.title} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="ic-box"><r.icon size={18} /></div>
            <h4>{r.title}</h4>
            <p>{r.desc}</p>
            <button className="btn-ghost"><Download size={14} /> Gerar PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Config({ T }) {
  return (
    <div className="view">
      <div className="grid-2">
        <div>
          <Card title="Dados do clube">
            <div className="form-grid">
              <div className="field full"><label>Nome</label><input defaultValue="Sociedade Recreativa Comercial e Cultural de Constantina" /></div>
              <div className="field"><label>Sigla</label><input defaultValue="SRCCC" /></div>
              <div className="field"><label>CNPJ</label><input defaultValue="00.000.000/0001-00" /></div>
            </div>
          </Card>
          <Card title="Usuários do sistema">
            <TableWrap>
              <table>
                <thead><tr><th>Usuário</th><th>Perfil</th><th>Acesso</th></tr></thead>
                <tbody>
                  <tr><td>Marisa Costa</td><td>Secretaria</td><td>Sócios, Eventos</td></tr>
                  <tr><td>Diretoria SRCCC</td><td>Administrador</td><td>Acesso total</td></tr>
                  <tr><td>Financeiro</td><td>Financeiro</td><td>Mensalidades, Relatórios</td></tr>
                  <tr><td>Portaria</td><td>Portaria</td><td>Controle de acesso</td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </div>
        <div>
          <Card title="Identidade visual">
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--green-dark)" }} />
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--gold)" }} />
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)" }} />
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-soft)" }}>Paleta baseada no emblema do clube: verde, dourado e branco — com suporte a modo claro e escuro.</p>
          </Card>
          <Card title="Segurança">
            <div className="kv-list">
              <div className="kv"><span>Autenticação em duas etapas</span><ShieldCheck size={16} color="var(--ok)" /></div>
              <div className="kv"><span>Log de acessos administrativos</span><ShieldCheck size={16} color="var(--ok)" /></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal ----------
function Modal({ type, onClose, notify }) {
  const content = {
    socio: { title: "Novo sócio titular", cta: "Salvar sócio", fields: [
      ["Nome completo", "full"], ["CPF"], ["Data de nascimento", null, "date"],
      ["Categoria", null, "select", ["Patrimonial", "Contribuinte", "Benemérito", "Fundador"]],
      ["Data de admissão", null, "date"], ["Endereço", "full"], ["Telefone"], ["E-mail"],
    ] },
    dependente: { title: "Novo dependente", cta: "Salvar dependente", fields: [
      ["Titular vinculado", "full", "select", ["Rogério Antunes Silva", "Marta Weber", "João Pedro Bortoluzzi"]],
      ["Nome completo", "full"],
      ["Parentesco", null, "select", ["Cônjuge", "Filho(a)", "Pai/Mãe", "Outro"]],
      ["Data de nascimento", null, "date"],
    ] },
    reserva: { title: "Nova reserva de espaço", cta: "Confirmar reserva", fields: [
      ["Espaço", "full", "select", ["Salão de Festas", "Churrasqueira 1", "Churrasqueira 2", "Quadra Poliesportiva", "Campo Society (7)", "Campo Oficial (11)"]],
      ["Sócio responsável", "full"], ["Data", null, "date"], ["Horário"],
    ] },
    evento: { title: "Novo evento", cta: "Criar evento", fields: [["Nome do evento"], ["Data", null, "date"], ["Local"], ["Descrição", "full"]] },
  }[type];

  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><h3>{content.title}</h3><button className="modal-close" onClick={onClose}><X size={18} /></button></div>
        <div className="form-grid">
          {content.fields.map((f, i) => (
            <div className={"field" + (f[1] === "full" ? " full" : "")} key={i}>
              <label>{f[0]}</label>
              {f[2] === "select" ? <select>{f[3].map((o) => <option key={o}>{o}</option>)}</select> : <input type={f[2] === "date" ? "date" : "text"} placeholder={f[0]} />}
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={() => { notify && notify(content.cta.replace("Salvar ", "").replace(/^Confirmar /, "").replace(/^Criar /, "") + " salvo com sucesso!", "ok"); onClose(); }}>{content.cta}</button>
        </div>
      </div>
    </div>
  );
}

// ---------------- CSS ----------------
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box;}
html, body{ margin:0 !important; padding:0 !important; width:100%; height:100%; }
#root{
  max-width:none !important; margin:0 !important; padding:0 !important;
  text-align:initial !important; width:100%; min-height:100vh;
}
.serif{ font-family:'Fraunces',Georgia,serif; }
button{ font-family:inherit; cursor:pointer; }
a{ cursor:pointer; }
::selection{ background:var(--gold-light); }

.login-screen{
  min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative;
  background:radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--gold) 12%, transparent), transparent 45%),
             radial-gradient(circle at 85% 80%, color-mix(in srgb, var(--green) 18%, transparent), transparent 50%), var(--green-dark);
  padding:24px; transition:background .35s ease;
}
.theme-toggle.floating{ position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:transform .2s, background .2s; }
.theme-toggle.floating:hover{ transform:rotate(20deg) scale(1.08); background:rgba(255,255,255,0.2); }

.login-card{
  background:var(--surface); width:100%; max-width:400px; border-radius:20px;
  padding:40px 32px 32px; box-shadow:0 30px 70px var(--shadow); text-align:center;
  animation:pop .4s cubic-bezier(.2,.9,.3,1);
}
@keyframes pop{ from{opacity:0; transform:translateY(14px) scale(.96);} to{opacity:1; transform:none;} }
.badge{
  width:92px; height:92px; margin:0 auto 18px; border-radius:50%; border:3px solid var(--green);
  box-shadow:0 0 0 4px var(--gold); display:flex; align-items:center; justify-content:center; background:var(--surface);
  animation:badgeGlow 2.6s ease-in-out infinite;
}
@keyframes badgeGlow{
  0%, 100%{ box-shadow:0 0 0 4px var(--gold), 0 0 0 4px var(--gold); }
  50%{ box-shadow:0 0 0 4px var(--gold), 0 0 22px 6px color-mix(in srgb, var(--gold) 55%, transparent); }
}
.badge span{ font-family:'Fraunces',serif; font-weight:700; font-size:20px; color:var(--green-dark); }
.login-card h1{ font-size:20px; font-weight:700; color:var(--green-dark); font-family:'Fraunces',serif; }
.login-card .club-full{ font-size:12.5px; color:var(--text-soft); margin:4px 0 28px; line-height:1.5; }
.field{ text-align:left; margin-bottom:16px; }
.field label{ display:block; font-size:12.5px; font-weight:600; color:var(--text-soft); margin-bottom:6px; }
.field input, .field select{
  width:100%; padding:11px 13px; border:1.5px solid var(--border); border-radius:10px; font-size:14px;
  color:var(--text); background:var(--surface-alt); outline:none; transition:border-color .15s,background .15s; font-family:inherit;
}
.field input:focus, .field select:focus{ border-color:var(--green); background:var(--surface); box-shadow:0 0 0 3px color-mix(in srgb, var(--green) 15%, transparent); }
.login-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; font-size:12.5px; color:var(--text-soft); }
.login-row a{ color:var(--green); text-decoration:none; font-weight:600; }
.btn-primary{
  width:100%; background:var(--green-dark); color:var(--gold-light); border:none; padding:13px;
  border-radius:10px; font-size:14.5px; font-weight:700; transition:background .15s, transform .1s, box-shadow .2s;
}
.btn-primary:hover{ background:var(--green); box-shadow:0 8px 20px color-mix(in srgb, var(--green) 40%, transparent); }
.btn-primary:active{ transform:scale(.98); }
.demo-note{ margin-top:18px; padding:10px 12px; border-radius:10px; background:var(--amber-bg); color:var(--amber); font-size:12px; text-align:left; }
.login-foot{ margin-top:22px; font-size:11px; color:var(--text-soft); }

.app{ display:flex; min-height:100vh; }
.backdrop{ position:fixed; inset:0; background:rgba(10,20,10,.5); z-index:40; animation:fadeIn .15s ease; backdrop-filter:blur(2px); }
@keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }

.sidebar{
  width:236px; flex-shrink:0; background:var(--green-dark); color:#EFEBD8;
  display:flex; flex-direction:column; position:sticky; top:0; height:100vh;
  transition:transform .25s ease, background .35s ease; z-index:50;
}
.sidebar-head{ display:flex; align-items:center; gap:11px; padding:20px 16px; border-bottom:1px solid rgba(255,255,255,.09); }
.sidebar-badge{ width:38px; height:38px; border-radius:50%; border:2px solid var(--gold); background:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sidebar-badge span{ font-family:'Fraunces',serif; font-weight:700; font-size:10.5px; color:var(--green-dark); line-height:1.1; text-align:center; }
.sidebar-head .name{ font-family:'Fraunces',serif; font-weight:700; font-size:15px; color:#fff; line-height:1.2; }
.sidebar-head .sub{ font-size:10.5px; color:var(--gold-light); }
.close-drawer{ display:none; margin-left:auto; background:none; border:none; color:#EFEBD8; }
nav.navlist{ padding:12px 12px; flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.18) transparent; }
nav.navlist::-webkit-scrollbar{ width:5px; }
nav.navlist::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.18); border-radius:10px; }
nav.navlist::-webkit-scrollbar-track{ background:transparent; }
.nav-group-label{ font-size:10.5px; text-transform:uppercase; letter-spacing:.07em; color:#7E9779; margin:16px 4px 8px; font-weight:600; }
.nav-group-label:first-child{ margin-top:2px; }
.navlink{
  display:flex; align-items:center; gap:12px; padding:9px 10px 9px 13px; border-radius:8px;
  color:#CBDAC5; font-size:13.5px; font-weight:500; margin-bottom:1px; position:relative;
  transition:background .15s, color .15s; border-left:3px solid transparent;
}
.navlink .ic{ width:16px; height:16px; flex-shrink:0; display:flex; align-items:center; justify-content:center; opacity:.85; }
.navlink:hover{ background:rgba(255,255,255,0.06); color:#fff; }
.navlink.active{ background:rgba(231,184,36,0.14); color:#fff; font-weight:600; border-left-color:var(--gold); }
.navlink.active .ic{ color:var(--gold); opacity:1; }
.badge-count{ margin-left:auto; background:var(--red); color:#fff; font-size:10.5px; font-weight:700; padding:1px 6px; border-radius:20px; line-height:1.5; }
.sidebar-foot{ padding:14px 16px; border-top:1px solid rgba(255,255,255,.09); font-size:11px; color:#7E9779; }

.main{ flex:1; min-width:0; }
.topbar{
  height:64px; background:var(--surface); border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between; padding:0 24px; position:sticky; top:0; z-index:20;
  transition:background .35s ease, border-color .35s ease;
}
.topbar h2{ font-size:18px; color:var(--green-dark); font-weight:700; font-family:'Fraunces',serif; }
.topbar-right{ display:flex; align-items:center; gap:14px; }
.hamburger{ display:none; background:none; border:none; color:var(--green-dark); }
.icon-btn{ background:none; border:none; color:var(--text-soft); transition:color .15s; }
.icon-btn:hover{ color:var(--green-dark); }
.search-box{ display:flex; align-items:center; gap:8px; background:var(--surface-alt); border:1px solid var(--border); padding:8px 12px; border-radius:9px; width:230px; font-size:13px; color:var(--text-soft); }
.search-box input{ border:none; background:transparent; outline:none; font-size:13px; width:100%; color:var(--text); font-family:inherit; }
.avatar{ width:34px; height:34px; border-radius:50%; background:var(--gold-light); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:var(--green-dark); flex-shrink:0; }

.theme-toggle{ background:none; border:none; padding:0; }
.toggle-track{ width:44px; height:24px; border-radius:20px; background:var(--surface-alt); border:1.5px solid var(--border); display:flex; align-items:center; padding:2px; transition:background .25s; }
.toggle-track.dark{ background:var(--green-dark); }
.toggle-thumb{ width:18px; height:18px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; color:var(--green-dark); transition:transform .25s cubic-bezier(.3,1.4,.6,1); }
.toggle-track.dark .toggle-thumb{ transform:translateX(20px); background:var(--gold-light); }

.content{ padding:24px 28px 60px; }
.view{ animation:viewIn .32s cubic-bezier(.22,.8,.3,1); }
@keyframes viewIn{ from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;} }

.kpi-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
.kpi-card{
  background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; position:relative; overflow:hidden;
  transition:transform .18s, box-shadow .18s, background .35s ease; animation:cardIn .5s ease backwards;
}
@keyframes cardIn{ from{opacity:0; transform:translateY(12px);} to{opacity:1; transform:none;} }
.kpi-card:hover{ transform:translateY(-3px); box-shadow:0 12px 26px var(--shadow); }
.kpi-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
.kpi-card .label{ font-size:12.5px; color:var(--text-soft); font-weight:600; }
.kpi-card .value{ margin-top:8px; display:flex; align-items:baseline; gap:2px; }
.kpi-number{
  font-family:'Fraunces',serif; font-size:28px; font-weight:700; letter-spacing:-0.01em;
  color:var(--kpi-number); font-variant-numeric:tabular-nums; transition:color .35s ease;
}
.kpi-card .delta{ font-size:11.5px; margin-top:8px; font-weight:600; display:flex; align-items:center; gap:4px; }
.delta.up{ color:var(--ok); }
.delta.down{ color:var(--red); }
.delta.neutral{ color:var(--text-soft); }
.kpi-card::after{ content:""; position:absolute; right:-14px; bottom:-14px; width:78px; height:78px; border-radius:50%; background:var(--gold); opacity:.09; }

.grid-2{ display:grid; grid-template-columns:1.4fr 1fr; gap:16px; align-items:start; }
.card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:16px; transition:background .35s ease, border-color .35s ease; }
.card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.card-head h3{ font-size:15px; font-weight:700; color:var(--green-dark); font-family:'Fraunces',serif; }
.link{ font-size:12.5px; color:var(--green); font-weight:600; text-decoration:none; }

.chart-tooltip{ border:1px solid; border-radius:10px; padding:8px 12px; font-size:12.5px; box-shadow:0 8px 20px rgba(0,0,0,0.12); }
.chart-tooltip .tt-label{ color:var(--text-soft); font-size:11px; margin-bottom:2px; }
.chart-tooltip .tt-value{ font-weight:700; font-family:'Fraunces',serif; }

.legend-row{ display:flex; gap:18px; justify-content:center; flex-wrap:wrap; margin-top:6px; }
.legend-item{ font-size:12px; color:var(--text-soft); display:flex; align-items:center; gap:6px; padding:4px 8px; border-radius:8px; transition:background .15s; cursor:default; }
.legend-item.active{ background:var(--surface-alt); }
.legend-item .dot{ width:8px; height:8px; border-radius:50%; display:inline-block; }
.legend-item b{ color:var(--text); }

ul.simple-list{ list-style:none; padding:0; margin:0; }
ul.simple-list li{ display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--border); font-size:13px; }
ul.simple-list li:last-child{ border-bottom:none; }
ul.simple-list .who{ font-weight:600; color:var(--text); }
ul.simple-list .meta{ color:var(--text-soft); font-size:12px; }

.kv-list .kv{ display:flex; justify-content:space-between; align-items:center; font-size:13px; color:var(--text-soft); padding:6px 0; }
.kv-list .kv b{ color:var(--text); }

.subtabs{ display:flex; gap:4px; border-bottom:1px solid var(--border); margin-bottom:18px; overflow-x:auto; }
.subtab{ padding:10px 16px; font-size:13.5px; font-weight:600; color:var(--text-soft); border-bottom:2px solid transparent; background:none; border-top:none; border-left:none; border-right:none; white-space:nowrap; transition:color .15s; }
.subtab.active{ color:var(--green-dark); border-bottom-color:var(--gold); }

.toolbar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; gap:12px; flex-wrap:wrap; }
.toolbar .search-box{ width:280px; }
.btn-add{ background:var(--green-dark); color:#fff; border:none; padding:10px 16px; border-radius:9px; font-size:13.5px; font-weight:700; display:flex; align-items:center; gap:6px; transition:background .15s, transform .1s, box-shadow .2s; }
.btn-add:hover{ background:var(--green); box-shadow:0 8px 18px color-mix(in srgb, var(--green) 35%, transparent); }
.btn-add:active{ transform:scale(.97); }
.btn-ghost{ background:transparent; border:1.5px solid var(--border); color:var(--text-soft); padding:9px 14px; border-radius:9px; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:6px; transition:border-color .15s, color .15s; }
.btn-ghost:hover{ border-color:var(--green); color:var(--green-dark); }

.table-wrap{ overflow-x:auto; }
table{ width:100%; border-collapse:collapse; font-size:13.5px; min-width:640px; }
thead th{ text-align:left; font-size:11.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--text-soft); padding:10px 12px; border-bottom:1.5px solid var(--border); font-weight:700; white-space:nowrap; }
tbody td{ padding:12px; border-bottom:1px solid var(--border); color:var(--text); }
tbody tr{ transition:background .12s; }
tbody tr:hover{ background:var(--surface-alt); }
.row-name{ font-weight:600; }
.row-sub{ color:var(--text-soft); font-size:12px; }
.table-actions button{ background:none; border:none; color:var(--green); font-size:12.5px; font-weight:600; margin-right:10px; display:inline-flex; align-items:center; gap:4px; }
.table-actions button:hover{ text-decoration:underline; }
.name-cell{ display:flex; align-items:center; }

.mini-avatar{ width:30px; height:30px; border-radius:50%; background:var(--green-dark); color:var(--gold-light); display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; margin-right:10px; flex-shrink:0; }

.pill{ display:inline-block; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; white-space:nowrap; }

.space-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.space-card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:transform .18s, box-shadow .18s; animation:cardIn .5s ease backwards; }
.space-card:hover{ transform:translateY(-3px); box-shadow:0 12px 26px var(--shadow); }
.space-card .top{ height:80px; background:linear-gradient(135deg,var(--green-dark),var(--green)); display:flex; align-items:center; gap:10px; padding:0 16px; color:#fff; }
.space-card .top .ic{ color:var(--gold-light); flex-shrink:0; }
.space-card .top h4{ font-family:'Fraunces',serif; font-size:15px; }
.space-card .body{ padding:14px 16px; }
.space-card .body .row{ display:flex; justify-content:space-between; font-size:12.5px; color:var(--text-soft); padding:4px 0; }

.report-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.report-card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; display:flex; flex-direction:column; gap:10px; transition:transform .18s, box-shadow .18s; animation:cardIn .5s ease backwards; }
.report-card:hover{ transform:translateY(-3px); box-shadow:0 12px 26px var(--shadow); }
.report-card .ic-box{ width:38px; height:38px; border-radius:10px; background:var(--gold-light); display:flex; align-items:center; justify-content:center; color:var(--green-dark); }
.report-card h4{ font-size:14.5px; font-weight:700; color:var(--green-dark); font-family:'Fraunces',serif; }
.report-card p{ font-size:12.5px; color:var(--text-soft); line-height:1.5; flex:1; }

.form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.form-grid .full{ grid-column:1 / -1; }

.modal-bg{ position:fixed; inset:0; background:rgba(10,15,10,.5); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; animation:fadeIn .15s ease; backdrop-filter:blur(2px); }
.modal{ background:var(--surface); border-radius:16px; width:100%; max-width:640px; max-height:88vh; overflow-y:auto; padding:26px 28px; animation:pop .25s cubic-bezier(.2,.9,.3,1); }
.modal-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
.modal-head h3{ font-size:17px; color:var(--green-dark); font-weight:700; font-family:'Fraunces',serif; }
.modal-close{ background:none; border:none; color:var(--text-soft); }
.modal-foot{ display:flex; justify-content:flex-end; gap:10px; margin-top:20px; }

.banner{
  background:var(--amber-bg); border:1px solid color-mix(in srgb, var(--amber) 40%, transparent); color:var(--amber);
  padding:12px 16px; border-radius:10px; font-size:12.5px; margin-bottom:18px; position:relative; overflow:hidden;
}
.banner::after{
  content:""; position:absolute; top:0; left:-40%; width:40%; height:100%;
  background:linear-gradient(90deg, transparent, color-mix(in srgb, var(--amber) 18%, transparent), transparent);
  animation:sheen 3.5s ease-in-out infinite;
}
@keyframes sheen{ 0%{ left:-40%; } 100%{ left:120%; } }

/* live indicator */
.live-tag{ display:inline-flex; align-items:center; gap:5px; font-size:10.5px; font-weight:700; color:var(--green); text-transform:uppercase; letter-spacing:.03em; }
.live-dot{ width:6px; height:6px; border-radius:50%; background:var(--green); position:relative; }
.live-dot::after{
  content:""; position:absolute; inset:-4px; border-radius:50%; border:1.5px solid var(--green);
  animation:livePulse 1.6s ease-out infinite;
}
@keyframes livePulse{ 0%{ transform:scale(.4); opacity:.9; } 100%{ transform:scale(1.9); opacity:0; } }

/* gauge */
.gauge-wrap{ position:relative; display:flex; align-items:center; justify-content:center; }
.gauge-center{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; }
.gauge-value{ font-family:'Fraunces',serif; font-size:26px; font-weight:700; color:var(--kpi-number); }
.gauge-label{ font-size:11px; color:var(--text-soft); margin-top:-2px; }

/* toasts */
.toast-stack{ position:fixed; top:18px; right:18px; z-index:200; display:flex; flex-direction:column; gap:10px; }
.toast{
  display:flex; align-items:center; gap:9px; background:var(--surface); color:var(--text); border:1px solid var(--border);
  border-radius:11px; padding:11px 16px; font-size:13px; font-weight:600; box-shadow:0 12px 28px var(--shadow);
  animation:toastIn .35s cubic-bezier(.2,.9,.3,1), toastOut .35s ease forwards 2.85s;
  max-width:320px;
}
.toast-ok{ border-left:3px solid var(--ok); color:var(--ok); }
.toast-warn{ border-left:3px solid var(--amber); color:var(--amber); }
.toast-bad{ border-left:3px solid var(--red); color:var(--red); }
@keyframes toastIn{ from{ opacity:0; transform:translateX(30px); } to{ opacity:1; transform:none; } }
@keyframes toastOut{ to{ opacity:0; transform:translateX(30px); } }

/* confetti */
.confetti-layer{ position:fixed; inset:0; pointer-events:none; z-index:300; overflow:hidden; }
.confetti-piece{
  position:absolute; top:-12px; width:9px; height:14px; border-radius:2px;
  animation-name:confettiFall; animation-timing-function:ease-in; animation-fill-mode:forwards;
}
@keyframes confettiFall{
  0%{ transform:translateY(-10px) rotate(0deg); opacity:1; }
  100%{ transform:translateY(108vh) rotate(540deg); opacity:.9; }
}

@media (max-width: 1080px){
  .kpi-grid{ grid-template-columns:repeat(2,1fr); }
  .grid-2{ grid-template-columns:1fr; }
  .space-grid, .report-grid{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 860px){
  .sidebar{ position:fixed; left:0; top:0; transform:translateX(-100%); box-shadow:10px 0 30px rgba(0,0,0,.2); }
  .sidebar.open{ transform:translateX(0); }
  .close-drawer{ display:block; }
  .hamburger{ display:flex; align-items:center; }
  .desktop-only{ display:none; }
  .content{ padding:18px 16px 50px; }
  .topbar{ padding:0 16px; }
}
@media (max-width: 640px){
  .kpi-grid{ grid-template-columns:1fr 1fr; gap:10px; }
  .kpi-card{ padding:14px; }
  .kpi-number{ font-size:21px; }
  .space-grid, .report-grid{ grid-template-columns:1fr; }
  .form-grid{ grid-template-columns:1fr; }
  .toolbar{ flex-direction:column; align-items:stretch; }
  .toolbar .search-box{ width:100%; }
  .btn-add{ justify-content:center; }
  .card{ padding:16px; }
}
`;