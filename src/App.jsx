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
  Landmark, ShieldCheck, Sun, Moon, TrendingUp, TrendingDown, CheckCircle2, Info,
  Coffee, Wrench, Megaphone, FileText, Package, ClipboardList, Vote,
  MessageCircle, ScrollText, UserCog, ShieldAlert, Trash2, EyeOff, Loader2, Mail, Pause, Play, Zap, Smartphone, ChevronLeft, ChevronRight
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

const bankAccounts = [
  { name: "Sicredi — Conta Corrente", type: "Banco", saldo: 22840.60 },
  { name: "Caixa (espécie)", type: "Espécie", saldo: 980.00 },
  { name: "Sicredi — Aplicação/Resgate", type: "Aplicação", saldo: 15000.00 },
];
const ledgerData = [
  { mes: "Jan", conta: "Integralização de cota de capital", data: "02/01/2026", quem: "Rogério Antunes Silva", obs: "Parcela 2 de 10", banco: "Sicredi", saida: null, entrada: 380.00 },
  { mes: "Jan", conta: "Tarifas Bancárias", data: "05/01/2026", quem: "Sicredi", obs: "Tarifa de manutenção", banco: "Sicredi", saida: 32.00, entrada: null },
  { mes: "Jan", conta: "Despesas Diversas", data: "05/01/2026", quem: "Loja Esportiva Bertoli", obs: "Material esportivo", banco: "Caixa", saida: 210.00, entrada: null },
  { mes: "Jan", conta: "Manutenção de Bens", data: "06/01/2026", quem: "Zeladoria Backes", obs: "", banco: "Sicredi", saida: 145.00, entrada: null },
  { mes: "Jan", conta: "Energia Elétrica", data: "08/01/2026", quem: "RGE", obs: "Conta de luz", banco: "Sicredi", saida: 712.40, entrada: null },
  { mes: "Jan", conta: "Demais Entradas Sócios", data: "08/01/2026", quem: "Adriana Kunz", obs: "Entrada Pix", banco: "Sicredi", saida: null, entrada: 300.00 },
  { mes: "Jan", conta: "Escritório de Contabilidade", data: "10/01/2026", quem: "Contabilidade Ruggeri", obs: "", banco: "Sicredi", saida: 180.00, entrada: null },
  { mes: "Jan", conta: "Tratamento Piscina", data: "12/01/2026", quem: "Produtos Químicos Aquavida", obs: "", banco: "Caixa", saida: 340.00, entrada: null },
  { mes: "Jan", conta: "Salários", data: "14/01/2026", quem: "Folha de pagamento", obs: "", banco: "Sicredi", saida: 2100.00, entrada: null },
  { mes: "Jan", conta: "Seguros", data: "18/01/2026", quem: "HDI Seguros", obs: "", banco: "Sicredi", saida: 210.00, entrada: null },
  { mes: "Jan", conta: "Material de Consumo", data: "20/01/2026", quem: "Mercado Central", obs: "", banco: "Caixa", saida: 480.00, entrada: null },
  { mes: "Jan", conta: "Mensalidades", data: "31/01/2026", quem: "Associados", obs: "Liquidação de mensalidades", banco: "Sicredi", saida: null, entrada: 3850.00 },
];
const despesaCategorias = [
  { name: "Salários", v: 18200.00 }, { name: "Energia Elétrica", v: 4320.00 },
  { name: "Material de Consumo", v: 3760.00 }, { name: "Tratamento Piscina", v: 2890.00 },
  { name: "Manutenção de Bens", v: 2610.00 }, { name: "Devolução cota capital", v: 2050.00 },
  { name: "Escritório Contábil", v: 1440.00 }, { name: "Tarifas Bancárias", v: 980.00 },
  { name: "Internet", v: 1080.00 }, { name: "Despesas Diversas", v: 760.00 }, { name: "Seguros", v: 540.00 },
];
const resultadoMensal = [
  { m: "Jan", acumulado: -2100.00 }, { m: "Fev", acumulado: -1450.00 }, { m: "Mar", acumulado: -1890.00 },
  { m: "Abr", acumulado: -2600.00 }, { m: "Mai", acumulado: 120.00 }, { m: "Jun", acumulado: 2340.00 },
  { m: "Jul", acumulado: 4780.00 }, { m: "Ago", acumulado: 6920.00 }, { m: "Set", acumulado: 9150.00 },
  { m: "Out", acumulado: 11600.00 }, { m: "Nov", acumulado: 14300.00 }, { m: "Dez", acumulado: 17050.00 },
];
const initialContasPagar = [
  { id: 1, fornecedor: "RGE", categoria: "Energia Elétrica", vencimento: "10/09/2026", valor: 712.40, banco: "Sicredi — Conta Corrente", status: "pendente" },
  { id: 2, fornecedor: "Produtos Químicos Aquavida", categoria: "Tratamento Piscina", vencimento: "05/09/2026", valor: 340.00, banco: "Caixa (espécie)", status: "vencido" },
  { id: 3, fornecedor: "Contabilidade Ruggeri", categoria: "Escritório de Contabilidade", vencimento: "15/09/2026", valor: 180.00, banco: "Sicredi — Conta Corrente", status: "pendente" },
  { id: 4, fornecedor: "HDI Seguros", categoria: "Seguros", vencimento: "20/09/2026", valor: 210.00, banco: "Sicredi — Conta Corrente", status: "pendente" },
  { id: 5, fornecedor: "Jardinagem Silva & Cia", categoria: "Manutenção de Bens", vencimento: "12/09/2026", valor: 1200.00, banco: "Sicredi — Conta Corrente", status: "pendente" },
  { id: 6, fornecedor: "SegurançaMax", categoria: "Despesas Diversas", vencimento: "01/09/2026", valor: 2400.00, banco: "Sicredi — Conta Corrente", status: "pago", dataPagamento: "01/09/2026" },
];

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
      { id: "agenda", label: "Calendário Unificado", icon: CalendarDays },
      { id: "reservas", label: "Reservas de Espaços", icon: CalendarDays },
      { id: "futebol", label: "Futebol (Campo 11/7)", icon: Trophy },
      { id: "piscina", label: "Piscina & Lazer", icon: Waves },
      { id: "eventos", label: "Eventos & Convidados", icon: PartyPopper },
    ] },
  { group: "Bar & Consumo", items: [{ id: "bar", label: "Bar & Comandas", icon: Coffee }] },
  { group: "Patrimônio", items: [{ id: "patrimonio", label: "Ativos & Manutenção", icon: Wrench }] },
  { group: "Comunicação", items: [
      { id: "comunicacao", label: "Mural & Avisos", icon: Megaphone },
      { id: "documentos", label: "Documentos", icon: FileText },
    ] },
  { group: "Controle", items: [
      { id: "relatorios", label: "Relatórios", icon: FileBarChart },
      { id: "config", label: "Configurações", icon: Settings },
    ] },
];
const TITLES = {
  dashboard: "Dashboard", agenda: "Calendário Unificado", socios: "Sócios & Dependentes", financeiro: "Mensalidades & Taxas",
  reservas: "Reservas de Espaços", futebol: "Futebol — Campo 11 e 7", piscina: "Piscina & Lazer",
  eventos: "Eventos & Convidados", bar: "Bar & Comandas", patrimonio: "Ativos & Manutenção",
  comunicacao: "Mural & Avisos", documentos: "Documentos",
  relatorios: "Relatórios", config: "Configurações",
};

export default function SRCCCApp() {
  const [mode, setMode] = useState("light");
  const T = THEMES[mode];
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [socioTab, setSocioTab] = useState("titulares");
  const [finTab, setFinTab] = useState("mensalidades");
  const [barTab, setBarTab] = useState("comandas");
  const [patTab, setPatTab] = useState("ativos");
  const [comTab, setComTab] = useState("mural");
  const [docTab, setDocTab] = useState("atas");
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

  // cursor spotlight on cards + click ripple on buttons (event delegation, no per-element wiring)
  useEffect(() => {
    const cardSel = ".card, .kpi-card, .space-card, .report-card, .account-card";
    const rippleSel = ".btn-primary, .btn-add, .btn-ghost, .pdv-btn";
    function onMove(e) {
      const el = e.target.closest?.(cardSel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }
    function onDown(e) {
      const el = e.target.closest?.(rippleSel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      el.appendChild(dot);
      setTimeout(() => dot.remove(), 650);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  function notify(msg, tone = "ok") {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function handleLogin() {
    if (loggingIn) return;
    setLoggingIn(true);
    setTimeout(() => {
      setLoggedIn(true);
      setLoggingIn(false);
      setConfetti(true);
      notify("Bem-vinda de volta, Marisa!", "ok");
      setTimeout(() => setConfetti(false), 2200);
    }, 900);
  }

  function onLoginMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--tx", x.toFixed(3));
    e.currentTarget.style.setProperty("--ty", y.toFixed(3));
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
        <div className="login-screen" onMouseMove={onLoginMove}>
          <div className="login-particles" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} style={{ left: ((i * 37) % 100) + "%", animationDelay: -(i * 1.7) + "s", animationDuration: 12 + (i % 5) * 3 + "s", width: 4 + (i % 4) * 3, height: 4 + (i % 4) * 3 }} />
            ))}
          </div>
          <button className="theme-toggle floating" onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label="Alternar tema">
            {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className="login-card">
            <div className="badge"><span>SRCCC</span></div>
            <h1>Sistema de Gestão do Clube</h1>
            <div className="club-full">Sociedade Recreativa Comercial e Cultural de Constantina</div>
            <div className="field"><label htmlFor="login-user">Usuário ou e-mail</label><input id="login-user" defaultValue="secretaria@srccc.com.br" /></div>
            <div className="field"><label htmlFor="login-pw">Senha</label>
              <div className="pw-wrap">
                <input id="login-pw" type={showPw ? "text" : "password"} defaultValue="senha123" />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="login-row">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" defaultChecked style={{ width: 14, height: 14 }} /> Manter conectado</label>
              <a href="#">Esqueci a senha</a>
            </div>
            <button className={"btn-primary" + (loggingIn ? " loading" : "")} onClick={handleLogin} disabled={loggingIn}>
              {loggingIn ? <><Loader2 size={16} className="spin" /> Entrando…</> : "Entrar"}
            </button>
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
              {view === "financeiro" && <Financeiro T={T} finTab={finTab} setFinTab={setFinTab} notify={notify} openModal={setModal} />}
              {view === "agenda" && <Agenda T={T} notify={notify} openModal={setModal} />}
              {view === "reservas" && <Reservas T={T} openModal={setModal} notify={notify} />}
              {view === "futebol" && <Futebol T={T} />}
              {view === "piscina" && <Piscina T={T} />}
              {view === "eventos" && <Eventos T={T} openModal={setModal} />}
              {view === "bar" && <BarClube T={T} barTab={barTab} setBarTab={setBarTab} notify={notify} />}
              {view === "patrimonio" && <Patrimonio T={T} patTab={patTab} setPatTab={setPatTab} openModal={setModal} />}
              {view === "comunicacao" && <Comunicacao T={T} comTab={comTab} setComTab={setComTab} notify={notify} />}
              {view === "documentos" && <Documentos T={T} docTab={docTab} setDocTab={setDocTab} notify={notify} />}
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

// ---------------- COBRANÇA AUTOMÁTICA ----------------
const brl = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const CANAIS = { whatsapp: { label: "WhatsApp", icon: MessageCircle }, email: { label: "E-mail", icon: Mail }, sms: { label: "SMS", icon: Smartphone } };
const COBRANCA_VARS = ["{nome}", "{valor}", "{vencimento}", "{dias_atraso}", "{link_pix}"];
const initialRegua = [
  { id: "d-3", offset: -3, label: "Lembrete amigável", when: "3 dias antes do vencimento", tone: "ok", ativo: true, canais: ["whatsapp"],
    texto: "Olá, {nome}! 👋 Sua mensalidade de {valor} vence em {vencimento}. Pague com PIX em segundos: {link_pix}" },
  { id: "d0", offset: 0, label: "No vencimento", when: "No dia do vencimento", tone: "ok", ativo: true, canais: ["whatsapp", "email"],
    texto: "Oi, {nome}! Hoje vence sua mensalidade ({valor}). Se já pagou, desconsidere. Link de pagamento: {link_pix}" },
  { id: "d3", offset: 3, label: "Aviso de atraso", when: "3 dias após o vencimento", tone: "warn", ativo: true, canais: ["whatsapp", "email"],
    texto: "{nome}, identificamos que sua mensalidade de {valor} está em aberto há {dias_atraso} dias. Regularize pelo PIX: {link_pix}" },
  { id: "d7", offset: 7, label: "Segunda cobrança", when: "7 dias após o vencimento", tone: "warn", ativo: true, canais: ["whatsapp", "email", "sms"],
    texto: "{nome}, sua mensalidade segue em aberto ({valor}, {dias_atraso} dias). Precisa de ajuda ou quer parcelar? Responda esta mensagem ou pague: {link_pix}" },
  { id: "d15", offset: 15, label: "Aviso de suspensão", when: "15 dias após o vencimento", tone: "bad", ativo: true, canais: ["email", "sms"],
    texto: "{nome}, sua pendência de {valor} ({dias_atraso} dias) pode levar à suspensão do uso das dependências do clube. Regularize: {link_pix}" },
];
const initialDevedores = [
  { id: 1, nome: "Ana Paula Rossi", mat: "0288", valor: 155, dias: -3, pausado: false, ultimo: null },
  { id: 2, nome: "Luciana Bertoldi", mat: "0721", valor: 189, dias: 3, pausado: false, ultimo: null },
  { id: 3, nome: "Marcos Dalla Costa", mat: "0344", valor: 155, dias: 5, pausado: false, ultimo: "Aviso de atraso · ontem" },
  { id: 4, nome: "Cristiane Locatelli", mat: "0567", valor: 155, dias: 8, pausado: false, ultimo: "Segunda cobrança · hoje 09:00" },
  { id: 5, nome: "Ivo Weber (dep.)", mat: "0119-2", valor: 36.74, dias: 12, pausado: true, ultimo: "Segunda cobrança · há 5 dias" },
  { id: 6, nome: "Paulo Sartori", mat: "0455", valor: 310, dias: 16, pausado: false, ultimo: "Aviso de suspensão · hoje 09:00" },
  { id: 7, nome: "Fernando Zanella", mat: "0902", valor: 310, dias: 46, pausado: false, ultimo: "Aviso de suspensão · há 31 dias" },
];
const initialCobLog = [
  { id: "l1", hora: "Hoje 09:00", nome: "Cristiane Locatelli", etapa: "Segunda cobrança", canais: ["whatsapp", "email", "sms"], status: "Lido" },
  { id: "l2", hora: "Hoje 09:00", nome: "Paulo Sartori", etapa: "Aviso de suspensão", canais: ["email", "sms"], status: "Entregue" },
  { id: "l3", hora: "Ontem 09:00", nome: "Marcos Dalla Costa", etapa: "Aviso de atraso", canais: ["whatsapp", "email"], status: "Lido" },
  { id: "l4", hora: "Ontem 09:00", nome: "Roberto Mattei", etapa: "Lembrete amigável", canais: ["whatsapp"], status: "Pago após envio" },
];

function etapaDoDevedor(d, regua) {
  const ativas = regua.filter((r) => r.ativo);
  const atual = [...ativas].reverse().find((r) => r.offset <= d.dias);
  const proxima = ativas.find((r) => r.offset > d.dias);
  return { atual, proxima };
}
function preencher(texto, d) {
  return texto
    .replaceAll("{nome}", d.nome.split(" ")[0])
    .replaceAll("{valor}", brl(d.valor))
    .replaceAll("{vencimento}", "dia 10")
    .replaceAll("{dias_atraso}", String(Math.max(d.dias, 0)))
    .replaceAll("{link_pix}", "srccc.com.br/pix/" + d.mat.replace("-", ""));
}

function CobrancaAutomatica({ T, notify }) {
  const [ativa, setAtiva] = useState(true);
  const [horario, setHorario] = useState("09:00");
  const [semDomingo, setSemDomingo] = useState(true);
  const [regua, setRegua] = useState(initialRegua);
  const [selId, setSelId] = useState("d3");
  const [devedores, setDevedores] = useState(initialDevedores);
  const [log, setLog] = useState(initialCobLog);
  const [recuperado, setRecuperado] = useState(3840);
  const [rodando, setRodando] = useState(false);
  const textRef = useRef(null);

  const sel = regua.find((r) => r.id === selId);
  const amostra = devedores[0] || initialDevedores[0];
  const totalAberto = devedores.filter((d) => d.dias > 0).reduce((sum, d) => sum + d.valor, 0);

  function patchStep(id, patch) { setRegua((rs) => rs.map((r) => r.id === id ? { ...r, ...patch } : r)); }
  function toggleCanal(id, canal) {
    const r = regua.find((x) => x.id === id);
    const canais = r.canais.includes(canal) ? r.canais.filter((c) => c !== canal) : [...r.canais, canal];
    if (canais.length === 0) { notify("Mantenha ao menos um canal na etapa", "warn"); return; }
    patchStep(id, { canais });
  }
  function inserirVar(v) {
    const el = textRef.current;
    const pos = el ? el.selectionStart : sel.texto.length;
    patchStep(sel.id, { texto: sel.texto.slice(0, pos) + v + sel.texto.slice(pos) });
    requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(pos + v.length, pos + v.length); } });
  }
  function enviar(d) {
    const { atual } = etapaDoDevedor(d, regua);
    if (!atual) { notify("Nenhuma etapa ativa se aplica a " + d.nome, "warn"); return false; }
    setLog((l) => [{ id: Math.random().toString(36).slice(2), hora: "Hoje " + horario, nome: d.nome, etapa: atual.label, canais: atual.canais, status: "Enviado" }, ...l]);
    setDevedores((ds) => ds.map((x) => x.id === d.id ? { ...x, ultimo: atual.label + " · agora" } : x));
    return true;
  }
  function enviarAgora(d) { if (enviar(d)) notify("Cobrança enviada para " + d.nome, "ok"); }
  function executarRegua() {
    if (rodando) return;
    setRodando(true);
    setTimeout(() => {
      let n = 0;
      devedores.filter((d) => !d.pausado).forEach((d) => { if (enviar(d)) n++; });
      setRodando(false);
      notify(n + " cobranças enviadas pela régua", "ok");
    }, 1100);
  }
  function marcarPago(d) {
    setDevedores((ds) => ds.filter((x) => x.id !== d.id));
    setRecuperado((r) => r + d.valor);
    notify(d.nome + " pagou — baixa automática via PIX", "ok");
  }

  return (
    <>
      {!ativa && <div className="banner">A cobrança automática está <b>desligada</b>. Nenhuma mensagem será enviada até você reativar.</div>}

      <div className="cob-stats">
        <div className="cob-stat"><div className="label">Enviadas no mês</div><div className="cob-num">{142 + log.length - initialCobLog.length}</div></div>
        <div className="cob-stat"><div className="label">Pagaram após cobrança</div><div className="cob-num">64%</div></div>
        <div className="cob-stat"><div className="label">Recuperado no mês</div><div className="cob-num">{brl(recuperado)}</div></div>
        <div className="cob-stat"><div className="label">Em aberto agora</div><div className="cob-num">{brl(totalAberto)}</div></div>
      </div>

      <Card>
        <div className="cob-master">
          <div className="cob-master-info">
            <span className="cob-master-icon"><Zap size={18} /></span>
            <div>
              <div className="cob-title">Cobrança automática</div>
              <div className="cob-sub">O sistema envia as mensagens da régua sozinho, todos os dias no horário escolhido.</div>
            </div>
          </div>
          <div className="cob-master-ctrl">
            <label className="cob-inline">Horário
              <select value={horario} onChange={(e) => setHorario(e.target.value)} className="cob-select">
                {["08:00", "09:00", "10:00", "14:00", "18:00"].map((h) => <option key={h}>{h}</option>)}
              </select>
            </label>
            <label className="cob-inline"><input type="checkbox" checked={semDomingo} onChange={(e) => setSemDomingo(e.target.checked)} /> Pular domingos</label>
            <button type="button" role="switch" aria-checked={ativa} aria-label="Ativar cobrança automática" className={"switch" + (ativa ? " on" : "")} onClick={() => { setAtiva(!ativa); notify(ativa ? "Cobrança automática desligada" : "Cobrança automática ligada", ativa ? "warn" : "ok"); }}>
              <span className="switch-thumb" />
            </button>
          </div>
        </div>
      </Card>

      <div className="grid-2">
        <div>
          <Card title="Régua de cobrança" action={<span className="cob-hint">Clique numa etapa para editar</span>}>
            <ol className="regua">
              {regua.map((r) => (
                <li key={r.id} className={"regua-step" + (r.id === selId ? " selected" : "") + (r.ativo ? "" : " off")}>
                  <span className={"regua-dot tone-" + r.tone} />
                  <button type="button" className="regua-main" onClick={() => setSelId(r.id)} aria-pressed={r.id === selId}>
                    <span className="regua-label">{r.label}</span>
                    <span className="regua-when">{r.when}</span>
                    <span className="regua-canais">
                      {r.canais.map((c) => { const I = CANAIS[c].icon; return <span key={c} className="chip mini"><I size={12} />{CANAIS[c].label}</span>; })}
                    </span>
                  </button>
                  <button type="button" role="switch" aria-checked={r.ativo} aria-label={"Etapa " + r.label} className={"switch sm" + (r.ativo ? " on" : "")} onClick={() => patchStep(r.id, { ativo: !r.ativo })}>
                    <span className="switch-thumb" />
                  </button>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div>
          <Card title={"Mensagem — " + sel.label}>
            <div className="cob-canais">
              {Object.entries(CANAIS).map(([k, c]) => { const I = c.icon; const on = sel.canais.includes(k); return (
                <button key={k} type="button" className={"chip" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggleCanal(sel.id, k)}><I size={13} />{c.label}</button>
              ); })}
            </div>
            <label className="cob-label" htmlFor="cob-texto">Texto da mensagem</label>
            <textarea id="cob-texto" ref={textRef} className="cob-textarea" rows={4} value={sel.texto} onChange={(e) => patchStep(sel.id, { texto: e.target.value })} />
            <div className="cob-vars">
              <span className="cob-hint">Inserir:</span>
              {COBRANCA_VARS.map((v) => <button key={v} type="button" className="chip mini var" onClick={() => inserirVar(v)}>{v}</button>)}
            </div>
            <div className="cob-label" style={{ marginTop: 14 }}>Pré-visualização</div>
            <div className="wa-preview" aria-live="polite">
              <div className="wa-bubble">{preencher(sel.texto, amostra)}<span className="wa-time">{horario} ✓✓</span></div>
            </div>
            <div className="cob-hint" style={{ marginTop: 8 }}>Exemplo com os dados de {amostra.nome}.</div>
          </Card>
        </div>
      </div>

      <Card title="Fila de cobrança" action={
        <button className="btn-add" onClick={executarRegua} disabled={!ativa || rodando}>
          {rodando ? <><Loader2 size={15} className="spin" /> Enviando…</> : <><Send size={15} /> Executar régua agora</>}
        </button>
      }>
        <TableWrap>
          <table>
            <thead><tr><th>Sócio</th><th>Valor</th><th>Situação</th><th>Etapa atual</th><th>Próximo envio</th><th>Último contato</th><th>Ação</th></tr></thead>
            <tbody>
              {devedores.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "var(--text-soft)" }}>Nenhuma pendência na fila. 🎉</td></tr>}
              {devedores.map((d) => {
                const { atual, proxima } = etapaDoDevedor(d, regua);
                const prox = d.pausado ? "Pausado" : proxima ? "em " + (proxima.offset - d.dias) + " dia(s) · " + proxima.label : "Escalar à diretoria";
                return (
                  <tr key={d.id} style={d.pausado ? { opacity: 0.6 } : undefined}>
                    <td><div className="name-cell"><MiniAvatar text={d.nome.split(" ").map((w) => w[0]).slice(0, 2).join("")} /><div><div className="row-name">{d.nome}</div><div className="row-sub">Mat. {d.mat}</div></div></div></td>
                    <td>{brl(d.valor)}</td>
                    <td>{d.dias < 0 ? <Pill tone="ok" T={T}>Vence em {-d.dias}d</Pill> : <Pill tone={d.dias > 14 ? "bad" : "warn"} T={T}>{d.dias}d em atraso</Pill>}</td>
                    <td>{atual ? atual.label : <span className="row-sub">—</span>}</td>
                    <td className="row-sub">{prox}</td>
                    <td className="row-sub">{d.ultimo || "Nenhum"}</td>
                    <td className="table-actions">
                      <button onClick={() => enviarAgora(d)} disabled={!ativa}><Send size={13} />Enviar</button>
                      <button onClick={() => setDevedores((ds) => ds.map((x) => x.id === d.id ? { ...x, pausado: !x.pausado } : x))}>{d.pausado ? <><Play size={13} />Retomar</> : <><Pause size={13} />Pausar</>}</button>
                      <button onClick={() => marcarPago(d)}><CheckCircle2 size={13} />Pagou</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      <Card title="Histórico de envios">
        <ul className="simple-list">
          {log.slice(0, 8).map((l) => (
            <li key={l.id}>
              <span><span className="who">{l.nome}</span> <span className="meta">· {l.etapa} · {l.canais.map((c) => CANAIS[c].label).join(", ")}</span></span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill tone={l.status === "Pago após envio" || l.status === "Lido" ? "ok" : "neutral"} T={T}>{l.status}</Pill>
                <span className="meta">{l.hora}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function Financeiro({ T, finTab, setFinTab, notify, openModal }) {
  const totalBanco = bankAccounts.reduce((s, a) => s + a.saldo, 0);
  const [contasPagar, setContasPagar] = useState(initialContasPagar);
  const [baixaTarget, setBaixaTarget] = useState(null);
  const [baixaBanco, setBaixaBanco] = useState(bankAccounts[0].name);
  const [baixaData, setBaixaData] = useState("");

  const totalAPagar = contasPagar.filter((c) => c.status !== "pago").reduce((s, c) => s + c.valor, 0);
  const totalVencidas = contasPagar.filter((c) => c.status === "vencido").length;
  const totalPagoMes = contasPagar.filter((c) => c.status === "pago").reduce((s, c) => s + c.valor, 0);

  function abrirBaixa(id) {
    setBaixaTarget(id);
    setBaixaBanco(bankAccounts[0].name);
    setBaixaData("");
  }
  function confirmarBaixa() {
    const item = contasPagar.find((c) => c.id === baixaTarget);
    setContasPagar((cs) => cs.map((c) => c.id === baixaTarget ? { ...c, status: "pago", dataPagamento: baixaData || "hoje", banco: baixaBanco } : c));
    notify(`Baixa lançada: ${item.fornecedor} — R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "ok");
    setBaixaTarget(null);
  }

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
        <button className={"subtab" + (finTab === "pagar" ? " active" : "")} onClick={() => setFinTab("pagar")}>Contas a Pagar</button>
        <button className={"subtab" + (finTab === "contas" ? " active" : "")} onClick={() => setFinTab("contas")}>Contas & Saldos</button>
        <button className={"subtab" + (finTab === "lancamentos" ? " active" : "")} onClick={() => setFinTab("lancamentos")}>Livro-caixa</button>
        <button className={"subtab" + (finTab === "despesas" ? " active" : "")} onClick={() => setFinTab("despesas")}>Despesas</button>
        <button className={"subtab" + (finTab === "inadimplencia" ? " active" : "")} onClick={() => setFinTab("inadimplencia")}>Inadimplência</button>
        <button className={"subtab" + (finTab === "cobranca" ? " active" : "")} onClick={() => setFinTab("cobranca")}>Cobrança automática</button>
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

      {finTab === "pagar" && (
        <>
          <div className="kpi-grid" style={{ marginBottom: 16 }}>
            <div className="kpi-card"><div className="label">Total a pagar</div><div className="value">R$ {totalAPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></div>
            <div className="kpi-card"><div className="label">Contas vencidas</div><div className="value">{totalVencidas}</div></div>
            <div className="kpi-card"><div className="label">Pago este mês</div><div className="value">R$ {totalPagoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></div>
          </div>
          <div className="toolbar">
            <div className="search-box"><Search size={14} /> <input placeholder="Buscar fornecedor..." /></div>
            <button className="btn-add" onClick={() => openModal("contapagar")}><Plus size={15} /> Nova conta a pagar</button>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Fornecedores:</th><th>Categoria</th><th>Vencimento</th><th>Valor</th><th>Conta prevista</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {contasPagar.map((c) => (
                    <tr key={c.id}>
                      <td className="row-name">{c.fornecedor}</td>
                      <td>{c.categoria}</td>
                      <td>{c.vencimento}</td>
                      <td>R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td>{c.banco}</td>
                      <td>
                        {c.status === "pago" && <Pill tone="ok" T={T}>Pago em {c.dataPagamento}</Pill>}
                        {c.status === "vencido" && <Pill tone="bad" T={T}>Vencida</Pill>}
                        {c.status === "pendente" && <Pill tone="neutral" T={T}>A vencer</Pill>}
                      </td>
                      <td className="table-actions">
                        {c.status !== "pago" ? <button onClick={() => abrirBaixa(c.id)}><CheckCircle2 size={13} /> Dar baixa</button> : <span className="row-sub">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {finTab === "contas" && (
        <>
          <div className="toolbar">
            <h3 className="serif" style={{ fontSize: 16, color: "var(--green-dark)" }}>Saldo consolidado: R$ {totalBanco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
            <button className="btn-add" onClick={() => openModal("deposito")}><Plus size={15} /> Lançar depósito bancário</button>
          </div>
          <div className="accounts-grid">
            {bankAccounts.map((a) => (
              <div className="account-card" key={a.name}>
                <div className="account-type">{a.type}</div>
                <div className="account-name">{a.name}</div>
                <div className="account-balance">R$ {a.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
              </div>
            ))}
          </div>
          <Card title="Últimas movimentações bancárias" style={{ padding: 0, marginTop: 16 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Data</th><th>Conta</th><th>Descrição</th><th>Banco</th><th>Valor</th></tr></thead>
                <tbody>
                  {ledgerData.slice(-6).reverse().map((l, i) => (
                    <tr key={i}>
                      <td>{l.data}</td><td>{l.conta}</td><td>{l.quem}{l.obs ? " — " + l.obs : ""}</td><td>{l.banco}</td>
                      <td style={{ color: l.entrada ? "var(--ok)" : "var(--red)", fontWeight: 600 }}>
                        {l.entrada ? "+ R$ " + l.entrada.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "− R$ " + l.saida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {finTab === "lancamentos" && (
        <>
          <div className="toolbar">
            <div className="search-box"><Search size={14} /> <input placeholder="Buscar por conta, credor/devedor..." /></div>
            <button className="btn-add" onClick={() => openModal("lancamento")}><Plus size={15} /> Novo lançamento</button>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Mês</th><th>Conta</th><th>Data</th><th>Credor/Devedor</th><th>Observação</th><th>Banco</th><th>Saídas</th><th>Entradas</th></tr></thead>
                <tbody>
                  {ledgerData.map((l, i) => (
                    <tr key={i}>
                      <td>{l.mes}</td><td className="row-name">{l.conta}</td><td>{l.data}</td><td>{l.quem}</td><td className="row-sub">{l.obs || "—"}</td>
                      <td><Pill tone={l.banco === "Sicredi" ? "ok" : "neutral"} T={T}>{l.banco}</Pill></td>
                      <td>{l.saida ? "R$ " + l.saida.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—"}</td>
                      <td>{l.entrada ? "R$ " + l.entrada.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {finTab === "despesas" && (
        <>
          <Card title="Despesas por categoria (acumulado no ano)">
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={despesaCategorias} layout="vertical" margin={{ top: 5, right: 24, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: T.textSoft }} axisLine={{ stroke: T.border }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11.5, fill: T.textSoft }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip formatter={(v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12.5, background: T.surface, color: T.text }} cursor={{ fill: T.surfaceAlt }} />
                  <Bar dataKey="v" radius={[0, 6, 6, 0]} fill={T.red} animationDuration={1000} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Resultado acumulado no ano">
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={resultadoMensal} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.green} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={T.green} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.textSoft }} axisLine={{ stroke: T.border }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10.5, fill: T.textSoft }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12.5, background: T.surface, color: T.text }} />
                  <Area type="monotone" dataKey="acumulado" stroke={T.green} strokeWidth={2.5} fill="url(#resGrad)" animationDuration={1200} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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

      {finTab === "cobranca" && <CobrancaAutomatica T={T} notify={notify} />}

      {finTab === "taxas" && (
        <Card title="Taxas e mensalidades vigentes">
          <TableWrap>
            <table>
              <thead><tr><th>Item</th><th>Valor</th></tr></thead>
              <tbody>
                <tr><td>Sócio patrimonial (individual)</td><td>R$ 193,36</td></tr>
                <tr><td>Sócio patrimonial (casal)</td><td>R$ 367,44</td></tr>
                <tr><td>Sócio contribuinte</td><td>R$ 155,00</td></tr>
                <tr><td>Dependente até 3 anos</td><td><Pill tone="neutral" T={T}>Isento</Pill></td></tr>
                <tr><td>Dependente de 5 a 15 anos</td><td>R$ 36,74</td></tr>
                <tr><td>Dependente de 14 a 27 anos</td><td>R$ 55,12</td></tr>
                <tr><td>Dependente (pais) até 60 anos</td><td>R$ 73,49</td></tr>
                <tr><td>Dependente 70 anos ou mais</td><td>R$ 36,74</td></tr>
                <tr><td>Carteira (emissão/3ª via)</td><td>R$ 20,90</td></tr>
                <tr><td>Reinclusão de dependente</td><td>R$ 392,62</td></tr>
                <tr><td>Joia de admissão</td><td>Conforme sua categoria</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {baixaTarget && (() => {
        const item = contasPagar.find((c) => c.id === baixaTarget);
        return (
          <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setBaixaTarget(null)}>
            <div className="modal">
              <div className="modal-head"><h3>Registrar pagamento — {item.fornecedor}</h3><button className="modal-close" onClick={() => setBaixaTarget(null)}><X size={18} /></button></div>
              <div className="form-grid">
                <div className="field full"><label>Valor</label><input value={`R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} disabled readOnly /></div>
                <div className="field full"><label>Conta bancária utilizada</label>
                  <select value={baixaBanco} onChange={(e) => setBaixaBanco(e.target.value)}>
                    {bankAccounts.map((a) => <option key={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div className="field full"><label>Data do pagamento</label><input type="date" onChange={(e) => setBaixaData(e.target.value)} /></div>
              </div>
              <div className="modal-foot">
                <button className="btn-ghost" onClick={() => setBaixaTarget(null)}>Cancelar</button>
                <button className="btn-add" onClick={confirmarBaixa}>Confirmar baixa</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ---------------- CALENDÁRIO UNIFICADO ----------------
const CAT = {
  reserva: { label: "Reservas", color: "#2E8B57" },
  evento: { label: "Eventos", color: "#E7B824" },
  futebol: { label: "Futebol", color: "#3B7DD8" },
  piscina: { label: "Piscina", color: "#1FA2A6" },
  manutencao: { label: "Manutenção", color: "#D9822B" },
};
const ESPACOS = ["Salão de Festas", "Churrasqueira 1", "Churrasqueira 2", "Quadra Poliesportiva", "Campo Society (7)", "Campo Oficial (11)", "Piscina"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const DIAS_SEM = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const pad2 = (n) => String(n).padStart(2, "0");
const dkey = (d) => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmtH = (h) => pad2(h) + "h";

function buildAgendaSeed(today) {
  const ev = [];
  let id = 1;
  const add = (off, cat, titulo, espaco, ini, fim, resp, status = "confirmada") =>
    ev.push({ id: id++, dia: dkey(addDays(today, off)), cat, titulo, espaco, ini, fim, resp, status });
  add(0, "reserva", "Churrasco de família", "Churrasqueira 1", 18, 22, "Rogério Antunes Silva");
  add(0, "reserva", "Treino de vôlei", "Quadra Poliesportiva", 20, 21, "João Pedro Bortoluzzi");
  add(1, "futebol", "Treino categoria de base", "Campo Oficial (11)", 18, 20, "Escolinha SRCCC");
  add(1, "manutencao", "Limpeza e tratamento da água", "Piscina", 7, 10, "Equipe de manutenção");
  add(2, "reserva", "Racha de quinta", "Campo Society (7)", 19, 20, "Fernando Zanella", "pendente");
  add(2, "reserva", "Aniversário infantil", "Churrasqueira 2", 14, 19, "Cristiane Locatelli");
  add(3, "evento", "Torneio Society", "Campo Society (7)", 9, 18, "Diretoria de esportes");
  add(4, "futebol", "Campeonato Municipal — rodada", "Campo Oficial (11)", 15, 17, "Liga Municipal");
  add(5, "reserva", "Festa de formatura", "Salão de Festas", 19, 23, "Marta Weber");
  add(6, "manutencao", "Troca de refletores", "Campo Oficial (11)", 8, 12, "Equipe de manutenção");
  add(7, "evento", "Reunião de diretoria", "Salão de Festas", 19, 21, "Diretoria", "pendente");
  add(9, "evento", "Baile de Primavera", "Salão de Festas", 20, 24, "Comissão de eventos");
  add(9, "reserva", "Churrasco pós-jogo", "Churrasqueira 1", 12, 16, "Paulo Sartori");
  add(12, "reserva", "Confraternização de empresa", "Salão de Festas", 18, 23, "Luciana Bertoldi");
  add(15, "futebol", "Jogo-treino veteranos", "Campo Oficial (11)", 9, 11, "Veteranos");
  add(-2, "reserva", "Reunião de família", "Churrasqueira 2", 12, 17, "Marcos Dalla Costa");
  for (let off = -30; off <= 45; off++) {
    const wd = addDays(today, off).getDay();
    if (wd === 1 || wd === 3) add(off, "piscina", "Hidroginástica", "Piscina", 8, 9, "Prof. Camila");
  }
  return ev;
}
function acharConflito(events, dia, espaco, ini, fim) {
  return events.find((e) => e.dia === dia && e.espaco === espaco && ini < e.fim && fim > e.ini);
}

function Agenda({ T, notify, openModal }) {
  const [today] = useState(() => new Date());
  const [events, setEvents] = useState(() => buildAgendaSeed(today));
  const [foco, setFoco] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [sel, setSel] = useState(() => dkey(today));
  const [modo, setModo] = useState("mes");
  const [filtros, setFiltros] = useState({ reserva: true, evento: true, futebol: true, piscina: true, manutencao: true });
  const [form, setForm] = useState({ espaco: ESPACOS[0], ini: 18, fim: 20, resp: "" });

  const hojeKey = dkey(today);
  const visiveis = useMemo(() => events.filter((e) => filtros[e.cat]), [events, filtros]);
  const porDia = useMemo(() => {
    const m = {};
    visiveis.forEach((e) => { (m[e.dia] = m[e.dia] || []).push(e); });
    Object.values(m).forEach((arr) => arr.sort((a, b) => a.ini - b.ini));
    return m;
  }, [visiveis]);

  let dias;
  let titulo;
  if (modo === "mes") {
    const primeiro = new Date(foco.getFullYear(), foco.getMonth(), 1);
    const offset = primeiro.getDay();
    const total = Math.ceil((offset + new Date(foco.getFullYear(), foco.getMonth() + 1, 0).getDate()) / 7) * 7;
    dias = Array.from({ length: total }).map((_, i) => addDays(primeiro, i - offset));
    titulo = MESES[foco.getMonth()] + " de " + foco.getFullYear();
  } else {
    const ini = addDays(foco, -foco.getDay());
    dias = Array.from({ length: 7 }).map((_, i) => addDays(ini, i));
    const fim = dias[6];
    titulo = ini.getDate() + " " + MESES[ini.getMonth()].slice(0, 3) + " — " + fim.getDate() + " " + MESES[fim.getMonth()].slice(0, 3) + " " + fim.getFullYear();
  }

  function mover(dir) {
    if (modo === "mes") setFoco(new Date(foco.getFullYear(), foco.getMonth() + dir, 1));
    else setFoco(addDays(foco, 7 * dir));
  }
  function irHoje() { setFoco(new Date(today.getFullYear(), today.getMonth(), today.getDate())); setSel(hojeKey); }

  const selDate = new Date(sel + "T12:00:00");
  const doDia = porDia[sel] || [];
  const conflito = acharConflito(events, sel, form.espaco, form.ini, form.fim);
  const horaInvalida = form.fim <= form.ini;
  const contagem = (cat) => events.filter((e) => e.cat === cat).length;
  const mesAtual = events.filter((e) => { const d = new Date(e.dia + "T12:00:00"); return d.getMonth() === foco.getMonth() && d.getFullYear() === foco.getFullYear(); }).length;

  function reservar(ev) {
    ev.preventDefault();
    if (conflito || horaInvalida) return;
    const novo = { id: Date.now(), dia: sel, cat: "reserva", titulo: "Reserva — " + form.espaco, espaco: form.espaco, ini: form.ini, fim: form.fim, resp: form.resp.trim() || "Secretaria", status: "confirmada" };
    setEvents((es) => [...es, novo]);
    setForm((f) => ({ ...f, resp: "" }));
    notify("Reserva criada: " + form.espaco + ", " + fmtH(form.ini) + "–" + fmtH(form.fim), "ok");
  }
  function cancelar(e) {
    setEvents((es) => es.filter((x) => x.id !== e.id));
    notify("Cancelado: " + e.titulo, "warn");
  }

  const horas = Array.from({ length: 19 }).map((_, i) => i + 6);

  return (
    <div className="view">
      <div className="toolbar">
        <div className="cal-nav">
          <button className="icon-btn cal-arrow" onClick={() => mover(-1)} aria-label={modo === "mes" ? "Mês anterior" : "Semana anterior"}><ChevronLeft size={18} /></button>
          <h3 className="cal-title">{titulo}</h3>
          <button className="icon-btn cal-arrow" onClick={() => mover(1)} aria-label={modo === "mes" ? "Próximo mês" : "Próxima semana"}><ChevronRight size={18} /></button>
          <button className="btn-ghost" onClick={irHoje}>Hoje</button>
        </div>
        <div className="cal-actions">
          <div className="seg" role="group" aria-label="Modo de visualização">
            <button className={modo === "mes" ? "on" : ""} aria-pressed={modo === "mes"} onClick={() => setModo("mes")}>Mês</button>
            <button className={modo === "semana" ? "on" : ""} aria-pressed={modo === "semana"} onClick={() => setModo("semana")}>Semana</button>
          </div>
          <button className="btn-add" onClick={() => openModal("reserva")}><Plus size={15} /> Nova reserva</button>
        </div>
      </div>

      <div className="cal-legend" role="group" aria-label="Filtrar por categoria">
        {Object.entries(CAT).map(([k, c]) => (
          <button key={k} type="button" className={"cal-filter" + (filtros[k] ? " on" : "")} aria-pressed={filtros[k]} onClick={() => setFiltros((f) => ({ ...f, [k]: !f[k] }))} style={{ "--c": c.color }}>
            <span className="cal-dot" />{c.label}<b>{contagem(k)}</b>
          </button>
        ))}
        <span className="cob-hint cal-count">{mesAtual} compromissos em {MESES[foco.getMonth()]}</span>
      </div>

      <div className="cal-layout">
        <div className="card cal-card">
          {modo === "mes" && (
            <div className="cal-weekhead" aria-hidden="true">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => <span key={d}>{d}</span>)}
            </div>
          )}
          <div className={modo === "mes" ? "cal-grid" : "cal-week"}>
            {dias.map((d) => {
              const k = dkey(d);
              const evs = porDia[k] || [];
              const fora = modo === "mes" && d.getMonth() !== foco.getMonth();
              const max = modo === "mes" ? 3 : 99;
              return (
                <button key={k} type="button" onClick={() => setSel(k)} aria-pressed={k === sel}
                  aria-label={d.getDate() + " de " + MESES[d.getMonth()] + ", " + evs.length + " compromissos"}
                  className={"cal-day" + (k === sel ? " sel" : "") + (k === hojeKey ? " today" : "") + (fora ? " out" : "")}>
                  <span className="cal-daynum">{modo === "semana" && <em>{DIAS_SEM[d.getDay()].slice(0, 3)}</em>}<i>{d.getDate()}</i></span>
                  <span className="cal-evs">
                    {evs.slice(0, max).map((e) => (
                      <span key={e.id} className={"cal-ev" + (e.status === "pendente" ? " pend" : "")} style={{ "--c": CAT[e.cat].color }} title={e.titulo + " · " + e.espaco + " · " + fmtH(e.ini) + "–" + fmtH(e.fim)}>
                        <span className="cal-ev-time">{fmtH(e.ini)}</span><span className="cal-ev-t">{e.titulo}</span>
                      </span>
                    ))}
                    {evs.length > max && <span className="cal-more">+{evs.length - max} mais</span>}
                    {evs.length > 0 && <span className="cal-dots" aria-hidden="true">{evs.slice(0, 4).map((e) => <span key={e.id} style={{ background: CAT[e.cat].color }} />)}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="cal-side">
          <Card title={DIAS_SEM[selDate.getDay()] + ", " + selDate.getDate() + " de " + MESES[selDate.getMonth()]} action={sel === hojeKey ? <Pill tone="ok" T={T}>Hoje</Pill> : null}>
            {doDia.length === 0 && <div className="cal-empty"><CalendarDays size={26} /><div>Dia livre</div><span>Nenhum compromisso neste dia.</span></div>}
            <ul className="cal-list">
              {doDia.map((e) => (
                <li key={e.id} style={{ "--c": CAT[e.cat].color }}>
                  <span className="cal-bar" />
                  <div className="cal-li-main">
                    <div className="cal-li-time">{fmtH(e.ini)} — {fmtH(e.fim)} {e.status === "pendente" && <Pill tone="warn" T={T}>Pendente</Pill>}</div>
                    <div className="cal-li-title">{e.titulo}</div>
                    <div className="cal-li-meta">{e.espaco} · {e.resp}</div>
                  </div>
                  <button className="icon-btn cal-cancel" onClick={() => cancelar(e)} aria-label={"Cancelar " + e.titulo} title="Cancelar"><X size={15} /></button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Reservar neste dia">
            <form onSubmit={reservar} className="cal-form">
              <div className="field"><label htmlFor="ag-esp">Espaço</label>
                <select id="ag-esp" value={form.espaco} onChange={(e) => setForm({ ...form, espaco: e.target.value })}>
                  {ESPACOS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="cal-times">
                <div className="field"><label htmlFor="ag-ini">Início</label>
                  <select id="ag-ini" value={form.ini} onChange={(e) => setForm({ ...form, ini: Number(e.target.value) })}>{horas.map((h) => <option key={h} value={h}>{fmtH(h)}</option>)}</select>
                </div>
                <div className="field"><label htmlFor="ag-fim">Fim</label>
                  <select id="ag-fim" value={form.fim} onChange={(e) => setForm({ ...form, fim: Number(e.target.value) })}>{horas.concat(24).map((h) => <option key={h} value={h}>{fmtH(h)}</option>)}</select>
                </div>
              </div>
              <div className="field"><label htmlFor="ag-resp">Sócio responsável</label>
                <input id="ag-resp" value={form.resp} onChange={(e) => setForm({ ...form, resp: e.target.value })} placeholder="Nome do sócio" />
              </div>
              {horaInvalida && <div className="cal-alert warn" role="alert">O horário final precisa ser depois do inicial.</div>}
              {!horaInvalida && conflito && (
                <div className="cal-alert bad" role="alert"><ShieldAlert size={15} /> <span>Conflito: <b>{conflito.titulo}</b> ocupa {conflito.espaco} das {fmtH(conflito.ini)} às {fmtH(conflito.fim)}.</span></div>
              )}
              {!horaInvalida && !conflito && <div className="cal-alert ok"><CheckCircle2 size={15} /> <span>Horário livre.</span></div>}
              <button className="btn-add" type="submit" disabled={!!conflito || horaInvalida} style={{ width: "100%", justifyContent: "center" }}><Plus size={15} /> Confirmar reserva</button>
            </form>
          </Card>
        </aside>
      </div>
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

function BarClube({ T, barTab, setBarTab, notify }) {
  const produtos = ["Cerveja", "Refrigerante", "Água", "Espetinho", "Porção fritas", "Salgado", "Suco", "Água de coco"];
  return (
    <div className="view">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">Comandas abertas</div><div className="value"><KpiNumber value={7} /></div></div>
        <div className="kpi-card"><div className="label">Faturamento do bar hoje</div><div className="value">R$ <KpiNumber value={612} /></div></div>
        <div className="kpi-card"><div className="label">Itens com estoque baixo</div><div className="value"><KpiNumber value={2} /></div></div>
      </div>

      <div className="subtabs">
        <button className={"subtab" + (barTab === "comandas" ? " active" : "")} onClick={() => setBarTab("comandas")}>Comandas</button>
        <button className={"subtab" + (barTab === "pdv" ? " active" : "")} onClick={() => setBarTab("pdv")}>PDV rápido</button>
        <button className={"subtab" + (barTab === "estoque" ? " active" : "")} onClick={() => setBarTab("estoque")}>Estoque</button>
      </div>

      {barTab === "comandas" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Comanda</th><th>Sócio</th><th>Itens</th><th>Valor</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr><td className="row-name">#032</td><td>Rogério Antunes Silva</td><td>3</td><td>R$ 47,50</td><td><Pill tone="ok" T={T}>Aberta</Pill></td><td className="table-actions"><button onClick={() => notify("Comanda #032 lançada na mensalidade", "ok")}>Fechar e lançar</button></td></tr>
                <tr><td className="row-name">#033</td><td>João Pedro Bortoluzzi</td><td>5</td><td>R$ 68,00</td><td><Pill tone="ok" T={T}>Aberta</Pill></td><td className="table-actions"><button onClick={() => notify("Comanda #033 lançada na mensalidade", "ok")}>Fechar e lançar</button></td></tr>
                <tr><td className="row-name">#034</td><td>Fernando Zanella</td><td>2</td><td>R$ 19,00</td><td><Pill tone="warn" T={T}>Aberta</Pill></td><td className="table-actions"><button onClick={() => notify("Sócio inadimplente — cobrar à vista", "warn")}>Fechar e lançar</button></td></tr>
                <tr><td className="row-name">#031</td><td>Marta Weber</td><td>2</td><td>R$ 22,00</td><td><Pill tone="neutral" T={T}>Lançada</Pill></td><td className="table-actions"><button>Ver</button></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {barTab === "pdv" && (
        <div className="grid-2">
          <Card title="Ponto de venda rápido">
            <div className="pdv-grid">
              {produtos.map((p) => (
                <button key={p} className="pdv-btn" onClick={() => notify(`${p} adicionado à comanda`, "ok")}>{p}</button>
              ))}
            </div>
          </Card>
          <Card title="Comanda atual — Mesa avulsa">
            <ul className="simple-list">
              <li><span className="who">2x Cerveja</span><span className="meta">R$ 18,00</span></li>
              <li><span className="who">1x Porção fritas</span><span className="meta">R$ 22,00</span></li>
              <li><span className="who">1x Água</span><span className="meta">R$ 5,00</span></li>
            </ul>
            <div className="kv-list" style={{ marginTop: 10 }}>
              <div className="kv"><span>Total</span><b>R$ 45,00</b></div>
            </div>
            <button className="btn-add" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={() => notify("Comanda vinculada à carteirinha do sócio", "ok")}>Vincular à carteirinha</button>
          </Card>
        </div>
      )}

      {barTab === "estoque" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Mínimo</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Cerveja Long Neck</td><td>Bebidas</td><td>84 un</td><td>40 un</td><td><Pill tone="ok" T={T}>OK</Pill></td></tr>
                <tr><td className="row-name">Refrigerante lata</td><td>Bebidas</td><td>12 un</td><td>30 un</td><td><Pill tone="bad" T={T}>Estoque baixo</Pill></td></tr>
                <tr><td className="row-name">Água mineral</td><td>Bebidas</td><td>60 un</td><td>20 un</td><td><Pill tone="ok" T={T}>OK</Pill></td></tr>
                <tr><td className="row-name">Salgadinhos (pacote)</td><td>Petiscos</td><td>8 un</td><td>15 un</td><td><Pill tone="bad" T={T}>Estoque baixo</Pill></td></tr>
                <tr><td className="row-name">Carvão (kg)</td><td>Insumos</td><td>25 kg</td><td>10 kg</td><td><Pill tone="ok" T={T}>OK</Pill></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}
    </div>
  );
}

function Patrimonio({ T, patTab, setPatTab, openModal }) {
  return (
    <div className="view">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">Ativos cadastrados</div><div className="value"><KpiNumber value={38} /></div></div>
        <div className="kpi-card"><div className="label">OS em andamento</div><div className="value"><KpiNumber value={3} /></div></div>
        <div className="kpi-card"><div className="label">Contratos ativos</div><div className="value"><KpiNumber value={3} /></div></div>
      </div>

      <div className="subtabs">
        <button className={"subtab" + (patTab === "ativos" ? " active" : "")} onClick={() => setPatTab("ativos")}>Ativos</button>
        <button className={"subtab" + (patTab === "os" ? " active" : "")} onClick={() => setPatTab("os")}>Ordens de serviço</button>
        <button className={"subtab" + (patTab === "contratos" ? " active" : "")} onClick={() => setPatTab("contratos")}>Contratos</button>
      </div>

      {patTab === "ativos" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Ativo</th><th>Categoria</th><th>Aquisição</th><th>Estado</th><th>Última manutenção</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Gramado Campo Oficial (11)</td><td>Infraestrutura</td><td>2015</td><td><Pill tone="ok" T={T}>Bom</Pill></td><td>15/08/2026</td></tr>
                <tr><td className="row-name">Piscina principal</td><td>Infraestrutura</td><td>2009</td><td><Pill tone="warn" T={T}>Regular</Pill></td><td>20/07/2026</td></tr>
                <tr><td className="row-name">Playground</td><td>Lazer</td><td>2019</td><td><Pill tone="ok" T={T}>Bom</Pill></td><td>10/06/2026</td></tr>
                <tr><td className="row-name">Iluminação Campo Society</td><td>Infraestrutura</td><td>2021</td><td><Pill tone="ok" T={T}>Bom</Pill></td><td>—</td></tr>
                <tr><td className="row-name">Cadeiras salão de festas (120 un)</td><td>Mobiliário</td><td>2018</td><td><Pill tone="warn" T={T}>Regular</Pill></td><td>—</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {patTab === "os" && (
        <>
          <div className="toolbar">
            <div />
            <button className="btn-add" onClick={() => openModal("os")}><Plus size={15} /> Nova ordem de serviço</button>
          </div>
          <Card style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>OS</th><th>Ativo</th><th>Tipo</th><th>Responsável</th><th>Status</th><th>Data</th></tr></thead>
                <tbody>
                  <tr><td className="row-name">OS-014</td><td>Piscina principal</td><td>Corretiva</td><td>Zeladoria</td><td><Pill tone="warn" T={T}>Em andamento</Pill></td><td>28/08/2026</td></tr>
                  <tr><td className="row-name">OS-013</td><td>Gramado Campo Oficial</td><td>Preventiva</td><td>Jardinagem (terceirizado)</td><td><Pill tone="ok" T={T}>Concluída</Pill></td><td>15/08/2026</td></tr>
                  <tr><td className="row-name">OS-012</td><td>Playground</td><td>Corretiva</td><td>Zeladoria</td><td><Pill tone="ok" T={T}>Concluída</Pill></td><td>10/06/2026</td></tr>
                  <tr><td className="row-name">OS-011</td><td>Iluminação Campo Society</td><td>Corretiva</td><td>Eletricista (terceirizado)</td><td><Pill tone="warn" T={T}>Aguardando peça</Pill></td><td>02/09/2026</td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {patTab === "contratos" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Fornecedor</th><th>Serviço</th><th>Vigência</th><th>Valor mensal</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Jardinagem Silva & Cia</td><td>Manutenção de gramados</td><td>até 12/2026</td><td>R$ 1.200,00</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
                <tr><td className="row-name">SegurançaMax</td><td>Vigilância noturna</td><td>até 03/2027</td><td>R$ 2.400,00</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
                <tr><td className="row-name">PiscinaClean</td><td>Tratamento de água</td><td>até 06/2027</td><td>R$ 800,00</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}
    </div>
  );
}

function Comunicacao({ T, comTab, setComTab, notify }) {
  return (
    <div className="view">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">Avisos publicados</div><div className="value"><KpiNumber value={12} /></div></div>
        <div className="kpi-card"><div className="label">Enquetes ativas</div><div className="value"><KpiNumber value={1} /></div></div>
        <div className="kpi-card"><div className="label">Chamados na ouvidoria</div><div className="value"><KpiNumber value={3} /></div></div>
      </div>

      <div className="subtabs">
        <button className={"subtab" + (comTab === "mural" ? " active" : "")} onClick={() => setComTab("mural")}>Mural de avisos</button>
        <button className={"subtab" + (comTab === "notificacoes" ? " active" : "")} onClick={() => setComTab("notificacoes")}>Notificações</button>
        <button className={"subtab" + (comTab === "enquetes" ? " active" : "")} onClick={() => setComTab("enquetes")}>Enquetes</button>
        <button className={"subtab" + (comTab === "ouvidoria" ? " active" : "")} onClick={() => setComTab("ouvidoria")}>Ouvidoria</button>
      </div>

      {comTab === "mural" && (
        <>
          <div className="toolbar">
            <div />
            <button className="btn-add" onClick={() => notify("Aviso publicado no mural", "ok")}><Plus size={15} /> Novo aviso</button>
          </div>
          <ul className="mural-list">
            <li><div className="mural-dot" /><div><div className="who">Manutenção da piscina dia 10/09</div><div className="meta">Publicado em 03/09 · Todos os sócios</div></div></li>
            <li><div className="mural-dot" /><div><div className="who">Inscrições abertas — Torneio Society</div><div className="meta">Publicado em 28/08 · Todos os sócios</div></div></li>
            <li><div className="mural-dot" /><div><div className="who">Assembleia geral ordinária — 30/09</div><div className="meta">Publicado em 25/08 · Sócios patrimoniais</div></div></li>
          </ul>
        </>
      )}

      {comTab === "notificacoes" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Tipo</th><th>Gatilho</th><th>Canal</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td className="row-name">Vencimento de mensalidade</td><td>5 dias antes</td><td>WhatsApp</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
                <tr><td className="row-name">Mensalidade em atraso</td><td>No dia do atraso</td><td>WhatsApp + E-mail</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
                <tr><td className="row-name">Reserva confirmada</td><td>Imediato</td><td>WhatsApp</td><td><Pill tone="ok" T={T}>Ativo</Pill></td></tr>
                <tr><td className="row-name">Aniversário do sócio</td><td>No dia</td><td>E-mail</td><td><Pill tone="neutral" T={T}>Inativo</Pill></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {comTab === "enquetes" && (
        <>
          <div className="toolbar">
            <div />
            <button className="btn-add" onClick={() => notify("Enquete criada", "ok")}><Plus size={15} /> Nova enquete</button>
          </div>
          <Card title="Aprovação do novo regulamento do salão de festas">
            <div className="poll-bar"><div className="poll-fill" style={{ width: "78%" }} /></div>
            <div className="kv-list"><div className="kv"><span>Sim — 78%</span><span>111 votos</span></div><div className="kv"><span>Não — 22%</span><span>31 votos</span></div></div>
            <Pill tone="warn" T={T}>Em andamento · encerra 10/09</Pill>
          </Card>
          <Card title="Qual dia prefere para o Baile de Primavera?">
            <div className="poll-bar"><div className="poll-fill" style={{ width: "61%", background: T.gold }} /></div>
            <div className="kv-list"><div className="kv"><span>Sábado — 61%</span><span>53 votos</span></div><div className="kv"><span>Sexta — 39%</span><span>34 votos</span></div></div>
            <Pill tone="neutral" T={T}>Encerrada</Pill>
          </Card>
        </>
      )}

      {comTab === "ouvidoria" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Protocolo</th><th>Assunto</th><th>Categoria</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                <tr><td className="row-name">#0091</td><td>Água da piscina muito fria de manhã</td><td>Reclamação</td><td><Pill tone="warn" T={T}>Em análise</Pill></td><td>01/09</td></tr>
                <tr><td className="row-name">#0090</td><td>Sugestão: aula de hidroginástica</td><td>Sugestão</td><td><Pill tone="ok" T={T}>Respondido</Pill></td><td>25/08</td></tr>
                <tr><td className="row-name">#0089</td><td>Parabéns pela organização do torneio</td><td>Elogio</td><td><Pill tone="neutral" T={T}>Arquivado</Pill></td><td>15/08</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}
    </div>
  );
}

function Documentos({ T, docTab, setDocTab, notify }) {
  return (
    <div className="view">
      <div className="subtabs">
        <button className={"subtab" + (docTab === "atas" ? " active" : "")} onClick={() => setDocTab("atas")}>Atas & Editais</button>
        <button className={"subtab" + (docTab === "quitacao" ? " active" : "")} onClick={() => setDocTab("quitacao")}>Certidão de quitação</button>
        <button className={"subtab" + (docTab === "transferencia" ? " active" : "")} onClick={() => setDocTab("transferencia")}>Transferência de título</button>
        <button className={"subtab" + (docTab === "lgpd" ? " active" : "")} onClick={() => setDocTab("lgpd")}>LGPD</button>
      </div>

      {docTab === "atas" && (
        <Card style={{ padding: 0 }}>
          <TableWrap>
            <table>
              <thead><tr><th>Título</th><th>Tipo</th><th>Data</th><th></th></tr></thead>
              <tbody>
                <tr><td className="row-name">Ata da Assembleia Geral Ordinária 2025</td><td>Ata</td><td>15/03/2025</td><td className="table-actions"><button onClick={() => notify("Baixando PDF...", "ok")}><Download size={13} /> Baixar</button></td></tr>
                <tr><td className="row-name">Edital de Convocação — Assembleia 2026</td><td>Edital</td><td>20/08/2026</td><td className="table-actions"><button onClick={() => notify("Baixando PDF...", "ok")}><Download size={13} /> Baixar</button></td></tr>
                <tr><td className="row-name">Estatuto Social (atualizado)</td><td>Estatuto</td><td>10/01/2024</td><td className="table-actions"><button onClick={() => notify("Baixando PDF...", "ok")}><Download size={13} /> Baixar</button></td></tr>
                <tr><td className="row-name">Regimento Interno do Salão de Festas</td><td>Regulamento</td><td>05/2023</td><td className="table-actions"><button onClick={() => notify("Baixando PDF...", "ok")}><Download size={13} /> Baixar</button></td></tr>
              </tbody>
            </table>
          </TableWrap>
        </Card>
      )}

      {docTab === "quitacao" && (
        <>
          <Card title="Emitir certidão de quitação">
            <div className="form-grid">
              <div className="field full"><label>Sócio</label><input placeholder="Buscar por nome ou matrícula..." /></div>
            </div>
            <button className="btn-add" onClick={() => notify("Certidão de quitação emitida — situação regular", "ok")}>Verificar e emitir certidão</button>
          </Card>
          <Card title="Certidões emitidas recentemente" style={{ padding: 0 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Sócio</th><th>Emissão</th><th>Validade</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td className="row-name">Rogério Antunes Silva</td><td>01/09/2026</td><td>30 dias</td><td><Pill tone="ok" T={T}>Válida</Pill></td></tr>
                  <tr><td className="row-name">Osvaldo Piovesan</td><td>15/08/2026</td><td>30 dias</td><td><Pill tone="neutral" T={T}>Expirada</Pill></td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
        </>
      )}

      {docTab === "transferencia" && (
        <>
          <div className="toolbar">
            <div />
            <button className="btn-add" onClick={() => notify("Solicitação de transferência registrada", "ok")}><Plus size={15} /> Nova solicitação</button>
          </div>
          <Card style={{ padding: 0, marginBottom: 16 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Título</th><th>De</th><th>Para</th><th>Status</th><th>Solicitação</th></tr></thead>
                <tbody>
                  <tr><td className="row-name">0119</td><td>Marta Weber</td><td>Cristiane Locatelli</td><td><Pill tone="warn" T={T}>Em análise pela diretoria</Pill></td><td>28/08/2026</td></tr>
                  <tr><td className="row-name">0034</td><td>Osvaldo Piovesan</td><td>Osvaldo Piovesan Jr. (herdeiro)</td><td><Pill tone="ok" T={T}>Aprovada</Pill></td><td>10/07/2026</td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
          <Card title="Como funciona a transferência">
            <ul className="simple-list">
              <li><span className="who">1. Quitação de débitos</span><span className="meta">Obrigatório</span></li>
              <li><span className="who">2. Aprovação da diretoria</span><span className="meta">Até 15 dias</span></li>
              <li><span className="who">3. Pagamento da taxa de transferência</span><span className="meta">Conforme estatuto</span></li>
            </ul>
          </Card>
        </>
      )}

      {docTab === "lgpd" && (
        <>
          <Card title="Solicitações de dados pessoais" style={{ padding: 0, marginBottom: 16 }}>
            <TableWrap>
              <table>
                <thead><tr><th>Sócio</th><th>Tipo de solicitação</th><th>Status</th><th>Prazo</th></tr></thead>
                <tbody>
                  <tr><td className="row-name">Fernando Zanella</td><td>Acesso aos dados</td><td><Pill tone="ok" T={T}>Atendido</Pill></td><td>20/08/2026</td></tr>
                </tbody>
              </table>
            </TableWrap>
          </Card>
          <Card title="Política de dados">
            <p style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.6 }}>
              Dados pessoais dos sócios e dependentes são usados exclusivamente para gestão do clube (cobrança, controle de acesso e comunicação).
              Qualquer sócio pode solicitar acesso, correção ou exclusão dos próprios dados por aqui, conforme a LGPD.
            </p>
          </Card>
        </>
      )}
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
    deposito: { title: "Lançar depósito bancário", cta: "Lançar depósito", fields: [
      ["Conta bancária", "full", "select", ["Sicredi — Conta Corrente", "Caixa (espécie)", "Sicredi — Aplicação/Resgate"]],
      ["Valor"], ["Data", null, "date"], ["Origem / Observação", "full"],
    ] },
    contapagar: { title: "Nova conta a pagar", cta: "Cadastrar conta", fields: [
      ["Fornecedor", "full"],
      ["Categoria", null, "select", ["Energia Elétrica", "Tratamento Piscina", "Manutenção de Bens", "Escritório de Contabilidade", "Seguros", "Internet", "Material de Consumo", "Despesas Diversas", "Tarifas Bancárias"]],
      ["Vencimento", null, "date"], ["Valor"],
      ["Conta bancária prevista", "full", "select", ["Sicredi — Conta Corrente", "Caixa (espécie)", "Sicredi — Aplicação/Resgate"]],
    ] },
    lancamento: { title: "Novo lançamento", cta: "Salvar lançamento", fields: [
      ["Tipo", null, "select", ["Entrada", "Saída"]],
      ["Conta (categoria)", null, "select", ["Mensalidades", "Integralização de cota de capital", "Salários", "Energia Elétrica", "Tratamento Piscina", "Material de Consumo", "Manutenção de Bens", "Tarifas Bancárias", "Despesas Diversas", "Seguros", "Internet", "Escritório de Contabilidade"]],
      ["Data", null, "date"], ["Credor/Devedor"],
      ["Conta bancária", null, "select", ["Sicredi", "Caixa"]],
      ["Valor"], ["Observação", "full"],
    ] },
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
          <button className="btn-add" onClick={() => { notify && notify(content.cta + " com sucesso!", "ok"); onClose(); }}>{content.cta}</button>
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
.grid-2 > div{ min-width:0; }
.card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:16px; transition:background .35s ease, border-color .35s ease; min-width:0; }
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

/* bank accounts */
.accounts-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.account-card{
  background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px;
  transition:transform .18s, box-shadow .18s; animation:cardIn .5s ease backwards;
}
.account-card:hover{ transform:translateY(-3px); box-shadow:0 12px 26px var(--shadow); }
.account-type{ font-size:10.5px; text-transform:uppercase; letter-spacing:.05em; color:var(--gold); font-weight:700; margin-bottom:4px; }
.account-name{ font-size:13px; color:var(--text-soft); font-weight:600; margin-bottom:8px; }
.account-balance{ font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--kpi-number); }

/* PDV */
.pdv-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.pdv-btn{
  background:var(--surface-alt); border:1.5px solid var(--border); border-radius:10px; padding:14px 10px;
  font-size:13.5px; font-weight:600; color:var(--text); transition:transform .12s, border-color .15s, background .15s;
}
.pdv-btn:hover{ border-color:var(--green); background:var(--surface); }
.pdv-btn:active{ transform:scale(.96); }

/* mural */
ul.mural-list{ list-style:none; padding:0; margin:0; }
ul.mural-list li{ display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
ul.mural-list li:last-child{ border-bottom:none; }
.mural-dot{ width:8px; height:8px; border-radius:50%; background:var(--gold); margin-top:6px; flex-shrink:0; }
ul.mural-list .who{ font-weight:600; font-size:13.5px; color:var(--text); }
ul.mural-list .meta{ font-size:12px; color:var(--text-soft); margin-top:2px; }

/* enquetes */
.poll-bar{ height:10px; border-radius:6px; background:var(--surface-alt); overflow:hidden; margin-bottom:10px; }
.poll-fill{ height:100%; background:var(--green); border-radius:6px; animation:pollFill 1s ease-out; }
@keyframes pollFill{ from{ width:0 !important; } }

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

/* ===== modern motion layer ===== */
:root{ --ease-out:cubic-bezier(.22,.8,.3,1); --ease-spring:cubic-bezier(.3,1.5,.5,1); }

/* login: drifting aurora orbs + shimmering title + animated card border */
.login-screen{ overflow:hidden; }
.login-screen::before, .login-screen::after{
  content:""; position:absolute; border-radius:50%; filter:blur(70px); opacity:.45; pointer-events:none;
  animation:orbFloat 14s ease-in-out infinite alternate;
}
.login-screen::before{ width:420px; height:420px; background:var(--gold); top:-120px; left:-100px; }
.login-screen::after{ width:480px; height:480px; background:var(--green); bottom:-160px; right:-120px; animation-duration:18s; animation-delay:-6s; }
@keyframes orbFloat{
  0%{ transform:translate(0,0) scale(1); }
  50%{ transform:translate(60px,40px) scale(1.15); }
  100%{ transform:translate(-30px,70px) scale(.95); }
}
.login-card{ position:relative; z-index:1; }
.login-card::before{
  content:""; position:absolute; inset:-2px; border-radius:22px; z-index:-1;
  background:conic-gradient(from var(--spin,0deg), var(--gold), var(--green), var(--gold-light), var(--gold));
  animation:spinBorder 6s linear infinite; opacity:.9;
}
.login-card::after{ content:""; position:absolute; inset:0; border-radius:20px; background:var(--surface); z-index:-1; }
@property --spin{ syntax:"<angle>"; initial-value:0deg; inherits:false; }
@keyframes spinBorder{ to{ --spin:360deg; } }
.login-card > *{ animation:riseIn .6s var(--ease-out) backwards; }
.login-card > :nth-child(1){ animation-delay:.10s; }
.login-card > :nth-child(2){ animation-delay:.18s; }
.login-card > :nth-child(3){ animation-delay:.24s; }
.login-card > :nth-child(4){ animation-delay:.30s; }
.login-card > :nth-child(5){ animation-delay:.36s; }
.login-card > :nth-child(6){ animation-delay:.42s; }
.login-card > :nth-child(7){ animation-delay:.48s; }
.login-card > :nth-child(8){ animation-delay:.54s; }
.login-card > :nth-child(9){ animation-delay:.60s; }
@keyframes riseIn{ from{ opacity:0; transform:translateY(16px); filter:blur(4px); } to{ opacity:1; transform:none; filter:none; } }
.login-card h1{
  background:linear-gradient(90deg, var(--green-dark) 0%, var(--gold) 50%, var(--green-dark) 100%);
  background-size:200% 100%; -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:riseIn .6s var(--ease-out) .18s backwards, textShimmer 5s linear 1s infinite;
}
@keyframes textShimmer{ to{ background-position:-200% 0; } }

/* buttons: shine sweep + ripple */
.btn-primary, .btn-add{ position:relative; overflow:hidden; isolation:isolate; }
.btn-primary::after, .btn-add::after{
  content:""; position:absolute; top:0; left:-75%; width:50%; height:100%; z-index:-1;
  background:linear-gradient(105deg, transparent, rgba(255,255,255,.35), transparent); transform:skewX(-20deg);
}
.btn-primary:hover::after, .btn-add:hover::after{ left:130%; transition:left .7s var(--ease-out); }
.btn-primary:hover, .btn-add:hover{ transform:translateY(-2px); }
.ripple{
  position:absolute; border-radius:50%; background:rgba(255,255,255,.45); pointer-events:none;
  transform:scale(0); animation:rippleOut .6s ease-out forwards;
}
@keyframes rippleOut{ to{ transform:scale(1); opacity:0; } }
.btn-ghost, .pdv-btn, .subtab{ position:relative; overflow:hidden; }
.btn-ghost .ripple, .pdv-btn .ripple{ background:color-mix(in srgb, var(--green) 25%, transparent); }

/* sidebar: staggered entrance, sliding icon, glowing active item */
.sidebar .navlink{ animation:navIn .5s var(--ease-out) backwards; }
.sidebar .navlink:nth-of-type(1){ animation-delay:.05s; }
.sidebar .navlink:nth-of-type(2){ animation-delay:.10s; }
.sidebar .navlink:nth-of-type(3){ animation-delay:.15s; }
.sidebar .navlink:nth-of-type(4){ animation-delay:.20s; }
@keyframes navIn{ from{ opacity:0; transform:translateX(-18px); } to{ opacity:1; transform:none; } }
.navlink{ transition:background .2s, color .2s, transform .25s var(--ease-out), padding .25s var(--ease-out); }
.navlink:hover{ transform:translateX(4px); }
.navlink:hover .ic{ animation:icWiggle .5s var(--ease-spring); }
@keyframes icWiggle{ 0%{ transform:scale(1) rotate(0); } 40%{ transform:scale(1.3) rotate(-12deg); } 100%{ transform:scale(1) rotate(0); } }
.navlink.active{ box-shadow:inset 0 0 24px -8px color-mix(in srgb, var(--gold) 55%, transparent); }
.navlink.active::before{
  content:""; position:absolute; left:-3px; top:50%; width:3px; height:60%; transform:translateY(-50%);
  background:var(--gold); border-radius:3px; box-shadow:0 0 12px 2px var(--gold); animation:glowPulse 2.2s ease-in-out infinite;
}
@keyframes glowPulse{ 50%{ box-shadow:0 0 18px 5px var(--gold); } }
.badge-count{ animation:badgePulse 2.4s ease-in-out infinite; }
@keyframes badgePulse{
  0%,100%{ box-shadow:0 0 0 0 color-mix(in srgb, var(--red) 55%, transparent); }
  50%{ box-shadow:0 0 0 6px transparent; }
}
.sidebar-badge{ transition:transform .6s var(--ease-spring); }
.sidebar-head:hover .sidebar-badge{ transform:rotate(360deg) scale(1.08); }

/* topbar: bell ring, avatar halo, search glow */
.icon-btn{ position:relative; transform-origin:50% 10%; }
.icon-btn:hover{ animation:bellRing .7s ease; }
.icon-btn::after{
  content:""; position:absolute; top:-1px; right:-1px; width:8px; height:8px; border-radius:50%;
  background:var(--red); border:2px solid var(--surface); animation:livePulse 2s ease-out infinite;
}
@keyframes bellRing{ 0%,100%{ transform:rotate(0); } 20%{ transform:rotate(16deg); } 40%{ transform:rotate(-14deg); } 60%{ transform:rotate(9deg); } 80%{ transform:rotate(-5deg); } }
.avatar{ position:relative; transition:transform .3s var(--ease-spring); }
.avatar:hover{ transform:scale(1.12) rotate(-6deg); }
.avatar::before{
  content:""; position:absolute; inset:-3px; border-radius:50%; z-index:-1;
  background:conic-gradient(from var(--spin,0deg), var(--gold), var(--green), var(--gold)); animation:spinBorder 4s linear infinite;
}
.avatar::after{ content:""; position:absolute; inset:0; border-radius:50%; background:var(--gold-light); z-index:-1; }
.avatar{ z-index:0; }
.search-box{ transition:width .3s var(--ease-out), box-shadow .25s, border-color .25s; }
.search-box:focus-within{ width:290px; border-color:var(--green); box-shadow:0 0 0 4px color-mix(in srgb, var(--green) 14%, transparent); }
.topbar{ backdrop-filter:saturate(1.4) blur(10px); background:color-mix(in srgb, var(--surface) 85%, transparent); }
.topbar h2{ animation:titleIn .5s var(--ease-out); }
@keyframes titleIn{ from{ opacity:0; transform:translateY(-8px); letter-spacing:.06em; } to{ opacity:1; transform:none; } }

/* cards: stagger, spotlight following the cursor, lift */
.view > *{ animation:riseIn .55s var(--ease-out) backwards; }
.view > :nth-child(2){ animation-delay:.05s; }
.view > :nth-child(3){ animation-delay:.10s; }
.view > :nth-child(4){ animation-delay:.15s; }
.view > :nth-child(5){ animation-delay:.20s; }
.view > :nth-child(6){ animation-delay:.25s; }
.view .grid-2 > *{ animation:riseIn .6s var(--ease-out) backwards; }
.view .grid-2 > :nth-child(2){ animation-delay:.12s; }
.space-grid > :nth-child(2), .report-grid > :nth-child(2), .accounts-grid > :nth-child(2){ animation-delay:.06s; }
.space-grid > :nth-child(3), .report-grid > :nth-child(3), .accounts-grid > :nth-child(3){ animation-delay:.12s; }
.space-grid > :nth-child(4), .report-grid > :nth-child(4){ animation-delay:.18s; }
.space-grid > :nth-child(5), .report-grid > :nth-child(5){ animation-delay:.24s; }
.space-grid > :nth-child(6), .report-grid > :nth-child(6){ animation-delay:.30s; }
.card, .kpi-card, .space-card, .report-card, .account-card{ position:relative; }
.card::before, .kpi-card::before, .space-card::before, .report-card::before, .account-card::before{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:0; transition:opacity .3s;
  background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--gold) 20%, transparent), transparent 70%);
}
.card:hover::before, .kpi-card:hover::before, .space-card:hover::before, .report-card:hover::before, .account-card:hover::before{ opacity:1; }
.kpi-card, .space-card, .report-card, .account-card{
  transition:transform .35s var(--ease-spring), box-shadow .3s, border-color .3s, background .35s ease;
}
.kpi-card:hover, .space-card:hover, .report-card:hover, .account-card:hover{
  transform:translateY(-6px) scale(1.015); border-color:color-mix(in srgb, var(--gold) 60%, var(--border));
  box-shadow:0 18px 38px var(--shadow), 0 0 0 1px color-mix(in srgb, var(--gold) 30%, transparent);
}
.kpi-card::after{ transition:transform .6s var(--ease-out), opacity .4s; }
.kpi-card:hover::after{ transform:scale(2.6); opacity:.16; }
.report-card .ic-box{ transition:transform .4s var(--ease-spring), background .3s; }
.report-card:hover .ic-box{ transform:rotate(-10deg) scale(1.15); background:var(--gold); }
.space-card .top{ background-size:160% 160%; transition:background-position .8s var(--ease-out); }
.space-card:hover .top{ background-position:100% 100%; }
.space-card .top .ic{ transition:transform .5s var(--ease-spring); }
.space-card:hover .top .ic{ transform:scale(1.3) rotate(8deg); }
.kpi-number{ display:inline-block; }
.kpi-card:hover .kpi-number{ animation:numberPop .5s var(--ease-spring); }
@keyframes numberPop{ 40%{ transform:scale(1.12); } }

/* skeleton-style shimmer on charts while they mount */
.card .recharts-wrapper{ animation:fadeIn .8s ease .2s backwards; }

/* tabs: underline slides in, table rows cascade */
.subtab{ transition:color .2s, background .2s; }
.subtab::after{
  content:""; position:absolute; left:50%; bottom:-2px; width:0; height:2px; background:var(--gold);
  transition:width .3s var(--ease-out), left .3s var(--ease-out);
}
.subtab:hover{ color:var(--green-dark); background:var(--surface-alt); border-radius:8px 8px 0 0; }
.subtab:hover::after, .subtab.active::after{ width:100%; left:0; }
.subtab.active{ border-bottom-color:transparent; }
tbody tr{ animation:rowIn .45s var(--ease-out) backwards; }
tbody tr:nth-child(1){ animation-delay:.04s; } tbody tr:nth-child(2){ animation-delay:.08s; }
tbody tr:nth-child(3){ animation-delay:.12s; } tbody tr:nth-child(4){ animation-delay:.16s; }
tbody tr:nth-child(5){ animation-delay:.20s; } tbody tr:nth-child(6){ animation-delay:.24s; }
tbody tr:nth-child(7){ animation-delay:.28s; } tbody tr:nth-child(8){ animation-delay:.32s; }
tbody tr:nth-child(n+9){ animation-delay:.36s; }
@keyframes rowIn{ from{ opacity:0; transform:translateX(-14px); } to{ opacity:1; transform:none; } }
tbody tr:hover{ box-shadow:inset 3px 0 0 var(--gold); }
.pill{ transition:transform .2s var(--ease-spring); }
tr:hover .pill{ transform:scale(1.08); }
.mini-avatar{ transition:transform .3s var(--ease-spring); }
tr:hover .mini-avatar{ transform:rotate(-12deg) scale(1.12); }

/* modal, toasts, progress bars, list items */
.modal{ animation:modalIn .4s var(--ease-spring); }
@keyframes modalIn{ from{ opacity:0; transform:translateY(30px) scale(.92) rotateX(8deg); } to{ opacity:1; transform:none; } }
.modal-close{ transition:transform .3s var(--ease-spring), color .2s; }
.modal-close:hover{ transform:rotate(90deg) scale(1.2); color:var(--red); }
.toast::after{
  content:""; position:absolute; left:0; bottom:0; height:3px; width:100%; background:currentColor; opacity:.5;
  transform-origin:left; animation:toastTimer 3.2s linear forwards; border-radius:0 0 11px 11px;
}
.toast{ position:relative; overflow:hidden; }
@keyframes toastTimer{ from{ transform:scaleX(1); } to{ transform:scaleX(0); } }
.poll-fill{
  background:linear-gradient(90deg, var(--green), var(--gold)); background-size:200% 100%;
  animation:pollFill 1.2s var(--ease-out), textShimmer 3s linear infinite;
}
ul.simple-list li, ul.mural-list li{ transition:transform .25s var(--ease-out), background .2s; border-radius:8px; }
ul.simple-list li:hover, ul.mural-list li:hover{ transform:translateX(5px); }
.mural-dot{ animation:livePulse 2.4s ease-out infinite; }
.pdv-btn:hover{ transform:translateY(-3px); box-shadow:0 8px 16px var(--shadow); }
.legend-item{ transition:background .2s, transform .25s var(--ease-spring); }
.legend-item:hover{ transform:translateY(-2px); }
.toggle-track{ transition:background .25s, box-shadow .25s; }
.theme-toggle:hover .toggle-track{ box-shadow:0 0 0 4px color-mix(in srgb, var(--gold) 30%, transparent); }

/* ===== modern visual refresh ===== */
:root{
  --r-sm:10px; --r-md:14px; --r-lg:20px;
  --shadow-sm:0 1px 2px rgba(16,32,18,.05), 0 1px 3px rgba(16,32,18,.04);
  --shadow-md:0 4px 12px -2px rgba(16,32,18,.08), 0 2px 4px -2px rgba(16,32,18,.05);
  --shadow-lg:0 20px 40px -12px rgba(16,32,18,.18), 0 8px 16px -8px rgba(16,32,18,.08);
  --ring:0 0 0 3px color-mix(in srgb, var(--green) 28%, transparent);
}
body{ -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; font-feature-settings:"cv11","ss01"; }
.main{
  background:
    radial-gradient(900px 420px at 100% -10%, color-mix(in srgb, var(--gold) 9%, transparent), transparent 60%),
    radial-gradient(700px 400px at -10% 110%, color-mix(in srgb, var(--green) 8%, transparent), transparent 60%);
}
:focus-visible{ outline:2px solid var(--gold); outline-offset:2px; border-radius:6px; }
button:focus-visible, a:focus-visible{ box-shadow:var(--ring); outline-color:var(--green); }
*{ scrollbar-width:thin; scrollbar-color:color-mix(in srgb, var(--text-soft) 35%, transparent) transparent; }

/* sidebar: deeper, floating rounded items */
.sidebar{
  background:linear-gradient(180deg, color-mix(in srgb, var(--green-dark) 100%, #000 0%) 0%, color-mix(in srgb, var(--green-dark) 82%, #000) 100%);
  border-right:1px solid rgba(255,255,255,.06);
}
.sidebar-head{ padding:22px 18px; }
.sidebar-badge{ box-shadow:0 0 0 3px color-mix(in srgb, var(--gold) 25%, transparent); }
nav.navlist{ padding:8px 12px 16px; }
.nav-group-label{ letter-spacing:.1em; font-size:10px; color:color-mix(in srgb, #fff 45%, var(--green-dark)); }
.navlink{ border-left:none; padding:10px 12px; border-radius:var(--r-sm); margin-bottom:2px; }
.navlink:hover{ background:rgba(255,255,255,.07); transform:translateX(2px); }
.navlink.active{
  background:linear-gradient(90deg, rgba(231,184,36,.20), rgba(231,184,36,.05));
  box-shadow:inset 0 0 0 1px rgba(231,184,36,.22);
}
.navlink.active::before{ left:-12px; height:55%; width:4px; border-radius:0 4px 4px 0; box-shadow:0 0 14px 1px var(--gold); animation:none; }
.sidebar-foot{ font-size:10.5px; opacity:.8; }

/* topbar: frosted glass */
.topbar{
  height:68px; backdrop-filter:saturate(1.6) blur(16px); -webkit-backdrop-filter:saturate(1.6) blur(16px);
  background:color-mix(in srgb, var(--surface) 72%, transparent); border-bottom:1px solid color-mix(in srgb, var(--border) 70%, transparent);
}
.topbar h2{ font-size:20px; letter-spacing:-.01em; }
.search-box{ border-radius:999px; padding:9px 16px; background:color-mix(in srgb, var(--surface-alt) 80%, transparent); box-shadow:var(--shadow-sm); }
.icon-btn{ width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:background .2s, color .2s; }
.icon-btn:hover{ background:var(--surface-alt); }
.icon-btn::after{ top:7px; right:8px; }
.content{ padding:28px 32px 64px; max-width:1480px; margin:0 auto; }

/* surfaces: softer borders, layered shadows, larger radii */
.card, .kpi-card, .account-card, .space-card, .report-card{
  border-radius:var(--r-lg); border:1px solid color-mix(in srgb, var(--border) 75%, transparent); box-shadow:var(--shadow-sm);
}
.card{ padding:22px; }
.card-head{ margin-bottom:16px; }
.card-head h3{ font-size:16px; letter-spacing:-.01em; }
.kpi-card, .space-card, .report-card, .account-card{ transition:transform .3s var(--ease-out), box-shadow .3s, border-color .3s, background .35s ease; }
.kpi-card:hover, .space-card:hover, .report-card:hover, .account-card:hover{
  transform:translateY(-3px); box-shadow:var(--shadow-lg); border-color:color-mix(in srgb, var(--gold) 45%, var(--border));
}
.kpi-card{ padding:20px; }
.kpi-card::after{ width:96px; height:96px; right:-24px; bottom:-30px; opacity:.1; background:radial-gradient(circle, var(--gold), transparent 70%); }
.kpi-card .label{ text-transform:uppercase; letter-spacing:.06em; font-size:11px; }
.kpi-number{ font-size:30px; line-height:1.1; }
.kpi-card .delta{ display:inline-flex; padding:3px 8px; border-radius:999px; background:var(--surface-alt); }
.delta.up{ background:var(--ok-bg); }
.delta.down{ background:var(--red-bg); }
.account-card{ background:linear-gradient(160deg, var(--surface), color-mix(in srgb, var(--surface-alt) 70%, var(--surface))); }
.account-balance{ font-size:24px; font-variant-numeric:tabular-nums; }
.space-card .top{ height:88px; }
.report-card .ic-box{ border-radius:12px; }

/* buttons & inputs */
.btn-primary, .btn-add{
  border-radius:12px; letter-spacing:.01em;
  background:linear-gradient(180deg, color-mix(in srgb, var(--green) 85%, #fff 0%), var(--green-dark));
  box-shadow:0 1px 0 rgba(255,255,255,.18) inset, 0 6px 14px -4px color-mix(in srgb, var(--green-dark) 55%, transparent);
}
.btn-primary:hover, .btn-add:hover{ background:linear-gradient(180deg, var(--green), var(--green-dark)); box-shadow:0 1px 0 rgba(255,255,255,.2) inset, 0 12px 24px -6px color-mix(in srgb, var(--green) 55%, transparent); }
.btn-ghost{ border-radius:12px; border-width:1px; background:var(--surface); box-shadow:var(--shadow-sm); }
.btn-ghost:hover{ background:var(--surface-alt); }
.field input, .field select{ border-radius:12px; border-width:1px; padding:12px 14px; }
.field input:focus, .field select:focus{ box-shadow:var(--ring); }
.pdv-btn{ border-radius:var(--r-md); border-width:1px; box-shadow:var(--shadow-sm); }

/* segmented-control tabs */
.subtabs{ display:inline-flex; gap:2px; padding:4px; background:var(--surface-alt); border:1px solid var(--border); border-radius:999px; margin-bottom:20px; max-width:100%; }
.subtab{ border-radius:999px !important; padding:8px 16px; font-size:13px; }
.subtab::after{ display:none; }
.subtab:hover{ background:color-mix(in srgb, var(--surface) 60%, transparent); }
.subtab.active{ background:var(--surface); color:var(--green-dark); box-shadow:var(--shadow-md); }

/* tables */
.table-wrap{ border:1px solid var(--border); border-radius:var(--r-md); background:var(--surface); }
table{ border-collapse:separate; border-spacing:0; }
thead th{ background:var(--surface-alt); border-bottom:1px solid var(--border); padding:12px 14px; font-size:11px; letter-spacing:.07em; }
thead th:first-child{ border-top-left-radius:var(--r-md); } thead th:last-child{ border-top-right-radius:var(--r-md); }
tbody td{ padding:13px 14px; border-bottom:1px solid color-mix(in srgb, var(--border) 60%, transparent); }
tbody tr:last-child td{ border-bottom:none; }
tbody tr:hover{ background:color-mix(in srgb, var(--gold) 7%, var(--surface)); box-shadow:none; }
tbody tr:hover td:first-child{ box-shadow:inset 3px 0 0 var(--gold); }
.pill{ padding:4px 11px; letter-spacing:.01em; }

/* overlays */
.modal{ border-radius:24px; padding:30px 32px; box-shadow:var(--shadow-lg); border:1px solid var(--border); }
.modal-bg, .backdrop{ backdrop-filter:blur(6px); background:rgba(8,16,10,.55); }
.toast{ border-radius:14px; box-shadow:var(--shadow-lg); }
.banner{ border-radius:var(--r-md); }
.chart-tooltip{ border-radius:12px; box-shadow:var(--shadow-lg); backdrop-filter:blur(8px); }
.poll-bar{ height:12px; }
.login-card{ border-radius:24px; box-shadow:var(--shadow-lg); }
.login-card::before{ border-radius:26px; }
.login-card::after{ border-radius:24px; }

/* ===== login extras ===== */
.login-screen{ perspective:1100px; }
.login-particles{ position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.login-particles span{
  position:absolute; bottom:-20px; border-radius:50%;
  background:radial-gradient(circle, var(--gold-light), color-mix(in srgb, var(--gold) 40%, transparent));
  opacity:0; animation:particleRise linear infinite;
}
@keyframes particleRise{
  0%{ transform:translate(0,0) scale(.6); opacity:0; }
  10%{ opacity:.75; }
  90%{ opacity:.5; }
  100%{ transform:translate(40px,-108vh) scale(1.2); opacity:0; }
}
.login-card{
  transform:rotateY(calc(var(--tx,0) * 7deg)) rotateX(calc(var(--ty,0) * -7deg));
  transition:transform .25s var(--ease-out); transform-style:preserve-3d;
}
.login-screen::before{ transform:translate(calc(var(--tx,0) * -40px), calc(var(--ty,0) * -40px)); }
.badge{ position:relative; }
.badge::after{
  content:""; position:absolute; inset:-10px; border-radius:50%; border:1.5px solid var(--gold);
  animation:badgeRing 2.8s ease-out infinite; pointer-events:none;
}
@keyframes badgeRing{ 0%{ transform:scale(.9); opacity:.8; } 100%{ transform:scale(1.35); opacity:0; } }
.field input{ transition:border-color .2s, background .2s, box-shadow .2s, transform .2s var(--ease-out); }
.field input:focus{ transform:translateY(-1px); }
.field label{ transition:color .2s; }
.field:focus-within label{ color:var(--green); }
.pw-wrap{ position:relative; }
.pw-wrap input{ padding-right:44px; }
.pw-toggle{ position:absolute; right:6px; top:50%; transform:translateY(-50%); width:32px; height:32px; border:none; background:none; border-radius:50%; color:var(--text-soft); display:flex; align-items:center; justify-content:center; transition:background .2s, color .2s; }
.pw-toggle:hover{ background:var(--surface-alt); color:var(--green-dark); }
.btn-primary{ display:flex; align-items:center; justify-content:center; gap:8px; }
.btn-primary:disabled{ cursor:progress; opacity:.92; }
.btn-primary.loading{ background-size:200% 100%; animation:btnLoading 1s linear infinite; }
@keyframes btnLoading{ 0%{ filter:brightness(1); } 50%{ filter:brightness(1.25); } 100%{ filter:brightness(1); } }
.spin{ animation:spinIcon .8s linear infinite; }
@keyframes spinIcon{ to{ transform:rotate(360deg); } }
.login-card.shake{ animation:shake .4s; }

/* ===== cobrança automática ===== */
.cob-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:16px; }
.cob-stat{ background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:14px 16px; box-shadow:var(--shadow-sm); }
.cob-stat .label{ font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-soft); font-weight:600; }
.cob-num{ font-family:'Fraunces',serif; font-size:24px; font-weight:700; color:var(--kpi-number); margin-top:4px; font-variant-numeric:tabular-nums; }
.cob-master{ display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.cob-master-info{ display:flex; align-items:center; gap:14px; }
.cob-master-icon{ width:42px; height:42px; border-radius:12px; background:var(--gold-light); color:var(--green-dark); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.cob-title{ font-family:'Fraunces',serif; font-weight:700; font-size:16px; color:var(--green-dark); }
.cob-sub{ font-size:12.5px; color:var(--text-soft); margin-top:2px; }
.cob-master-ctrl{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
.cob-inline{ display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-soft); font-weight:600; }
.cob-select{ padding:7px 10px; border:1px solid var(--border); border-radius:10px; background:var(--surface-alt); color:var(--text); font-family:inherit; font-size:13px; }
.cob-hint{ font-size:12px; color:var(--text-soft); }
.cob-label{ display:block; font-size:12.5px; font-weight:600; color:var(--text-soft); margin-bottom:6px; }

.switch{ width:46px; height:26px; border-radius:999px; border:none; padding:3px; background:var(--border); display:inline-flex; align-items:center; transition:background .25s; flex-shrink:0; }
.switch.on{ background:var(--green); }
.switch-thumb{ width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .3s var(--ease-spring); }
.switch.on .switch-thumb{ transform:translateX(20px); }
.switch.sm{ width:38px; height:22px; }
.switch.sm .switch-thumb{ width:16px; height:16px; }
.switch.sm.on .switch-thumb{ transform:translateX(16px); }

.regua{ list-style:none; margin:0; padding:0; position:relative; }
.regua::before{ content:""; position:absolute; left:17px; top:18px; bottom:18px; width:2px; background:var(--border); border-radius:2px; }
.regua-step{ position:relative; display:flex; align-items:center; gap:10px; padding:4px 0; transition:opacity .2s; }
.regua-step.off{ opacity:.5; }
.regua-dot{ width:14px; height:14px; border-radius:50%; margin-left:11px; flex-shrink:0; border:3px solid var(--surface); box-shadow:0 0 0 2px currentColor; z-index:1; }
.regua-dot.tone-ok{ color:var(--ok); background:var(--ok); }
.regua-dot.tone-warn{ color:var(--amber); background:var(--amber); }
.regua-dot.tone-bad{ color:var(--red); background:var(--red); }
.regua-main{ flex:1; text-align:left; background:none; border:1px solid transparent; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; gap:2px; transition:background .2s, border-color .2s; color:var(--text); }
.regua-main:hover{ background:var(--surface-alt); }
.regua-step.selected .regua-main{ background:color-mix(in srgb, var(--gold) 10%, var(--surface)); border-color:color-mix(in srgb, var(--gold) 55%, var(--border)); }
.regua-label{ font-weight:700; font-size:14px; }
.regua-when{ font-size:12px; color:var(--text-soft); }
.regua-canais{ display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }

.chip{ display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; border:1px solid var(--border); background:var(--surface); color:var(--text-soft); font-size:12.5px; font-weight:600; transition:all .2s; }
.chip.mini{ padding:2px 8px; font-size:11px; gap:4px; background:var(--surface-alt); }
.chip.var{ font-family:ui-monospace,Consolas,monospace; cursor:pointer; }
.chip.var:hover{ border-color:var(--green); color:var(--green-dark); }
.chip.on{ background:var(--green-dark); border-color:var(--green-dark); color:var(--gold-light); }
.cob-canais{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
.cob-textarea{ width:100%; resize:vertical; padding:12px 14px; border:1px solid var(--border); border-radius:12px; background:var(--surface-alt); color:var(--text); font-family:inherit; font-size:13.5px; line-height:1.5; outline:none; transition:border-color .2s, box-shadow .2s, background .2s; }
.cob-textarea:focus{ border-color:var(--green); background:var(--surface); box-shadow:var(--ring); }
.cob-vars{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:8px; }
.wa-preview{ background:color-mix(in srgb, var(--green) 10%, var(--surface-alt)); border-radius:14px; padding:16px; }
.wa-bubble{ position:relative; max-width:92%; background:var(--surface); color:var(--text); border-radius:4px 14px 14px 14px; padding:10px 12px 22px; font-size:13.5px; line-height:1.45; box-shadow:var(--shadow-sm); word-break:break-word; animation:riseIn .35s var(--ease-out); }
.wa-time{ position:absolute; right:10px; bottom:5px; font-size:10.5px; color:var(--text-soft); }
.table-actions button:disabled, .btn-add:disabled{ opacity:.45; cursor:not-allowed; box-shadow:none; transform:none; }
.table-actions button svg{ vertical-align:-2px; margin-right:3px; }
@media (max-width:1080px){ .cob-stats{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px){ .cob-stats{ gap:10px; } .cob-master-ctrl{ width:100%; justify-content:space-between; } }

/* ===== calendário unificado ===== */
.cal-nav{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.cal-title{ font-family:'Fraunces',serif; font-size:20px; color:var(--green-dark); text-transform:capitalize; min-width:190px; text-align:center; margin:0; }
.cal-arrow{ border:1px solid var(--border); background:var(--surface); }
.cal-actions{ display:flex; align-items:center; gap:10px; }
.seg{ display:inline-flex; padding:3px; border-radius:999px; background:var(--surface-alt); border:1px solid var(--border); }
.seg button{ border:none; background:none; padding:6px 14px; border-radius:999px; font-size:13px; font-weight:600; color:var(--text-soft); transition:all .2s; }
.seg button.on{ background:var(--surface); color:var(--green-dark); box-shadow:var(--shadow-md); }
.cal-legend{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.cal-count{ margin-left:auto; }
.cal-filter{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px; border-radius:999px; border:1px solid var(--border); background:var(--surface); color:var(--text-soft); font-size:12.5px; font-weight:600; transition:all .2s; }
.cal-filter b{ font-weight:700; font-size:11px; background:var(--surface-alt); padding:1px 7px; border-radius:999px; }
.cal-filter .cal-dot{ width:9px; height:9px; border-radius:50%; background:var(--c); }
.cal-filter:not(.on){ opacity:.55; }
.cal-filter:not(.on) .cal-dot{ background:transparent; box-shadow:inset 0 0 0 2px var(--c); }
.cal-filter.on{ color:var(--text); border-color:color-mix(in srgb, var(--c) 55%, var(--border)); background:color-mix(in srgb, var(--c) 9%, var(--surface)); }

.cal-layout{ display:grid; grid-template-columns:minmax(0,1fr) 340px; gap:16px; align-items:start; }
.cal-card{ padding:14px; }
.cal-weekhead{ display:grid; grid-template-columns:repeat(7,1fr); gap:6px; margin-bottom:6px; }
.cal-weekhead span{ text-align:center; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-soft); padding:4px 0; }
.cal-grid{ display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
.cal-week{ display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:8px; }
.cal-day{
  position:relative; min-height:104px; padding:8px; border-radius:12px; text-align:left; display:flex; flex-direction:column; gap:6px;
  background:var(--surface); border:1px solid color-mix(in srgb, var(--border) 80%, transparent); color:var(--text);
  transition:background .2s, border-color .2s, transform .2s var(--ease-out), box-shadow .2s; min-width:0; overflow:hidden;
}
.cal-week .cal-day{ min-height:320px; }
.cal-day:hover{ background:var(--surface-alt); transform:translateY(-1px); }
.cal-day.out{ opacity:.45; background:transparent; }
.cal-day.sel{ border-color:var(--green); box-shadow:0 0 0 3px color-mix(in srgb, var(--green) 18%, transparent); }
.cal-daynum{ display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:700; }
.cal-daynum em{ font-style:normal; font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-soft); font-weight:600; }
.cal-daynum i{ font-style:normal; width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; }
.cal-day.today .cal-daynum i{ background:var(--green-dark); color:var(--gold-light); }
.cal-evs{ display:flex; flex-direction:column; gap:3px; min-width:0; }
.cal-ev{
  display:flex; align-items:center; gap:5px; font-size:11px; line-height:1.25; padding:3px 6px; border-radius:6px; min-width:0;
  background:color-mix(in srgb, var(--c) 16%, var(--surface)); border-left:3px solid var(--c); color:var(--text);
}
.cal-ev.pend{ background:repeating-linear-gradient(135deg, color-mix(in srgb, var(--c) 14%, var(--surface)) 0 6px, transparent 6px 12px); border-left-style:dashed; }
.cal-ev-time{ font-weight:700; flex-shrink:0; font-variant-numeric:tabular-nums; color:var(--text-soft); }
.cal-ev-t{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cal-more{ font-size:11px; font-weight:600; color:var(--text-soft); padding-left:4px; }
.cal-dots{ display:none; gap:3px; }
.cal-dots span{ width:6px; height:6px; border-radius:50%; }

.cal-side{ display:flex; flex-direction:column; position:sticky; top:84px; }
.cal-side .card-head h3{ text-transform:capitalize; }
.cal-empty{ text-align:center; padding:18px 8px; color:var(--text-soft); display:flex; flex-direction:column; align-items:center; gap:4px; }
.cal-empty div{ font-weight:700; color:var(--text); }
.cal-empty span{ font-size:12.5px; }
.cal-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
.cal-list li{ display:flex; align-items:stretch; gap:10px; padding:10px; border-radius:12px; background:var(--surface-alt); animation:riseIn .35s var(--ease-out) backwards; }
.cal-bar{ width:4px; border-radius:4px; background:var(--c); flex-shrink:0; }
.cal-li-main{ flex:1; min-width:0; }
.cal-li-time{ font-size:12px; font-weight:700; color:var(--text-soft); display:flex; gap:8px; align-items:center; }
.cal-li-title{ font-weight:700; font-size:14px; margin-top:2px; }
.cal-li-meta{ font-size:12px; color:var(--text-soft); margin-top:1px; }
.cal-cancel{ align-self:flex-start; width:28px; height:28px; }
.cal-cancel:hover{ color:var(--red); }
.cal-form .field{ margin-bottom:12px; }
.cal-times{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.cal-alert{ display:flex; gap:8px; align-items:flex-start; padding:10px 12px; border-radius:10px; font-size:12.5px; margin-bottom:12px; line-height:1.4; }
.cal-alert svg{ flex-shrink:0; margin-top:1px; }
.cal-alert.ok{ background:var(--ok-bg); color:var(--ok); }
.cal-alert.warn{ background:var(--amber-bg); color:var(--amber); }
.cal-alert.bad{ background:var(--red-bg); color:var(--red); }

@media (max-width:1180px){ .cal-layout{ grid-template-columns:1fr; } .cal-side{ position:static; } }
@media (max-width:860px){
  .cal-week{ grid-template-columns:1fr; }
  .cal-week .cal-day{ min-height:0; }
}
@media (max-width:640px){
  .cal-title{ min-width:0; font-size:17px; }
  .cal-grid{ gap:3px; }
  .cal-day{ min-height:56px; padding:5px; align-items:center; }
  .cal-grid .cal-ev, .cal-grid .cal-more{ display:none; }
  .cal-grid .cal-dots{ display:flex; }
  .cal-grid .cal-daynum{ justify-content:center; }
  .cal-count{ margin-left:0; width:100%; }
}

@media (prefers-reduced-motion: reduce){
  .login-card{ transform:none !important; }
  *, *::before, *::after{ animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
}

@media (max-width: 1080px){
  .kpi-grid{ grid-template-columns:repeat(2,1fr); }
  .grid-2{ grid-template-columns:1fr; }
  .space-grid, .report-grid, .accounts-grid{ grid-template-columns:repeat(2,1fr); }
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
  .space-grid, .report-grid, .accounts-grid, .pdv-grid{ grid-template-columns:1fr; }
  .form-grid{ grid-template-columns:1fr; }
  .toolbar{ flex-direction:column; align-items:stretch; }
  .toolbar .search-box{ width:100%; }
  .btn-add{ justify-content:center; }
  .card{ padding:16px; }
}
`;