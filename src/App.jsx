import { useState, useEffect, useCallback } from "react";
const STORAGE_KEY = "wedding-checklist-v1";
const categories = [
{
id: "local", icon: " items: [
"Definir data oficial do casamento",
"Escolher e reservar o espaço da cerimônia",
"Escolher e reservar o espaço da festa",
"Contratar buffet / catering",
"Contratar fotógrafo",
"Contratar videomaker",
"Contratar DJ ou banda",
"Contratar cerimonialista / assessora",
"Contratar decorador(a)",
"Contratar floricultura",
"Contratar bolo de casamento",
"Contratar bem-casados / docinhos",
"Contratar iluminação especial",
", title: "Local & Fornecedores", color: "#c9a96e",
],
},
{
id: "vestimenta", icon: " items: [
"Escolher e comprar/aluguar vestido de noiva",
"Agendar provas do vestido",
"Escolher traje do noivo",
"Escolher trajes dos padrinhos e madrinhas",
"Contratar maquiadora para o dia",
"Contratar cabeleireira para o dia",
"Fazer teste de maquiagem e cabelo",
"Escolher buquê da noiva",
"Comprar acessórios (véu, tiara, joias)",
"Sapatos da noiva (ensaio para adaptar)",
", title: "Vestimenta & Beleza", color: "#d4a5c9",
],
},
{
id: "convites", icon: " items: [
"Definir número total de convidados",
"Montar lista de convidados (cerimônia)",
"Montar lista de convidados (festa)",
", title: "Convites & Lista de Convidados", color: "#9ec4c9",
},
{
},
{
},
{
},
"Criar e encomendar convites",
"Enviar convites (até 2 meses antes)",
"Criar website do casamento",
"Criar lista de presentes / PIX coletivo",
"Confirmar presença dos convidados (RSVP)",
"Definir e comunicar o dress code",
],
id: "cerimonia", icon: " ", title: "Cerimônia", color: "#a9c9a4",
items: [
"Escolher padre/pastor/celebrante",
"Agendar reuniões com o celebrante",
"Definir roteiro da cerimônia",
"Escolher padrinhos e madrinhas",
"Escolher daminhas e pajens",
"Escolher alianças",
"Escolher música de entrada e saída",
"Ensaio geral da cerimônia",
"Providenciar documentação (habilitação de casamento)",
],
id: "festa", icon: " ", title: "Festa & Recepção", color: "#c9b4a0",
items: [
"Definir menu completo com o buffet",
"Definir opções para restrições alimentares",
"Escolher bebidas e bar",
"Definir ordem dos eventos da festa",
"Planejar abertura de pista de dança",
"Definir mesa de bolo e doces",
"Escolher lembrancinhas para convidados",
"Planejar chuva de arroz / pétalas",
"Definir área kids (se necessário)",
],
id: "logistica", icon: " ", title: "Logística & Hospedagem", color: "#b4a9c9",
items: [
"Contratar carro para os noivos",
"Providenciar transporte para convidados (van/ônibus)",
"Indicar hotéis próximos para convidados de fora",
"Reservar quarto para a noite do casamento",
"Planejar lua de mel (passagens, hotel, roteiro)",
"Fazer passaporte (se viagem internacional)",
],
{
id: "financeiro", icon: " ", title: "Financeiro", color: "#c9c4a0",
items: [
"Definir orçamento total do casamento",
"Abrir conta ou poupança exclusiva para o casamento",
"Criar planilha de gastos e pagamentos",
"Pagar sinais / reservas dos fornecedores",
"Revisar contratos de todos os fornecedores",
"Definir valor da gorjeta para fornecedores",
"Contratar seguro do evento (opcional)",
],
},
{
id: "noivos", icon: " ", title: "Cuidados com os Noivos", color: "#c9a0a0",
items: [
"Agendar sessão de fotos de casal (pré-wedding)",
"Escrever votos pessoais",
"Fazer tratamento de pele (iniciar com antecedência)",
"Planejar despedida de solteiro(a)",
"Fazer lista de músicas especiais para a festa",
"Preparar presente surpresa para o parceiro(a)",
"Separar documento para mudança de nome (se for mudar)",
],
},
{
id: "semana", icon: " ", title: "Semana do Casamento", color: "#9ea9c9",
items: [
"Confirmar horários com todos os fornecedores",
"Entregar itens para o cerimonialista",
"Preparar cesta de emergência (alfinete, fita, remédios)",
"Fazer manicure/pedicure",
"Distribuir tarefas entre padrinhos/madrinhas",
"Descansar e dormir bem nos dias anteriores",
"Fazer check-in no hotel da lua de mel",
],
},
];
export default function WeddingChecklist() {
const [checked, setChecked] = useState({});
const [openCat, setOpenCat] = useState("local");
const [filter, setFilter] = useState("all");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [lastSaved, setLastSaved] = useState(null);
const [syncPulse, setSyncPulse] = useState(false);
useEffect(() => {
(async () => {
try {
const result = await window.storage.get(STORAGE_KEY, true);
if (result?.value) setChecked(JSON.parse(result.value));
} catch (_) {}
setLoading(false);
})();
}, []);
useEffect(() => {
const interval = setInterval(async () => {
try {
const result = await window.storage.get(STORAGE_KEY, true);
if (result?.value) {
const remote = JSON.parse(result.value);
setChecked(prev => {
if (JSON.stringify(prev) !== JSON.stringify(remote)) {
setSyncPulse(true);
setTimeout(() => setSyncPulse(false), 1500);
return remote;
}
});
return prev;
}
} catch (_) {}
}, 8000);
return () => clearInterval(interval);
}, []);
const saveToStorage = useCallback(async (newChecked) => {
setSaving(true);
try {
await window.storage.set(STORAGE_KEY, JSON.stringify(newChecked), true);
setLastSaved(new Date());
} catch (_) {}
setSaving(false);
}, []);
const toggle = (catId, item) => {
const key = `${catId}||${item}`;
setChecked(prev => {
const next = { ...prev, [key]: !prev[key] };
saveToStorage(next);
return next;
});
};
const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
const doneItems = Object.values(checked).filter(Boolean).length;
const pct = Math.round((doneItems / totalItems) * 100);
const getProgress = (cat) => {
const done = cat.items.filter(i => checked[`${cat.id}||${i}`]).length;
return { done, total: cat.items.length };
};
if (loading) {
return (
<div style={{
minHeight: "100vh",
background: "linear-gradient(135deg, #1a0a0f 0%, #2d1520 40%, #1a0d1a 100%)",
display: "flex", alignItems: "center", justifyContent: "center",
fontFamily: "Georgia, serif", color: "#c9a96e", fontSize: 15, letterSpacing: "0.2em",
}}>
Carregando checklist compartilhado...
</div>
);
}
return (
<div style={{
minHeight: "100vh",
background: "linear-gradient(135deg, #1a0a0f 0%, #2d1520 40%, #1a0d1a 100%)",
fontFamily: "'Georgia', 'Times New Roman', serif",
color: "#f0e6d3",
padding: "0 0 60px 0",
}}>
{/* Header */}
<div style={{ textAlign: "center", padding: "48px 20px 18px", position: "relative", ove
<div style={{
position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.15) 0%, tra
pointerEvents: "none",
}} />
<div style={{ fontSize: 12, letterSpacing: "0.45em", color: "#c9a96e", textTransform:
Novembro 2026
</div>
<h1 style={{
fontSize: "clamp(1.8rem, 6vw, 3.2rem)", fontWeight: 400,
margin: "0 0 6px", color: "#f5ead8", fontStyle: "italic", lineHeight: 1.1,
}}>
Checklist do Casamento
</h1>
<div style={{ color: "#c9a96e", fontSize: 18, margin: "8px 0 20px", letterSpacing: 8
3, ove
<div style={{ maxWidth: 400, margin: "0 auto 10px" }}>
<div style={{ height: 5, background: "rgba(255,255,255,0.09)", borderRadius: <div style={{
height: "100%", width: `${pct}%`,
background: "linear-gradient(90deg, #c9a96e, #e8c97a)",
borderRadius: 3, transition: "width 0.4s ease",
}} />
</div>
<div style={{ marginTop: 7, fontSize: 12, color: "#b8a080", letterSpacing: "0.06em"
{doneItems} de {totalItems} tarefas concluídas — {pct}%
</div>
</div>
{/* Sync badge */}
<div style={{
display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
fontSize: 11, letterSpacing: "0.07em",
color: syncPulse ? "#7dc97a" : saving ? "#e8c97a" : "#5a4a30",
transition: "color 0.5s",
}}>
<span style={{
width: 6, height: 6, borderRadius: "50%",
background: syncPulse ? "#7dc97a" : saving ? "#e8c97a" : "#3a2a18",
display: "inline-block", transition: "background 0.5s",
}} />
{syncPulse ? "Atualizado por outra pessoa ✓" : saving ? "Salvando..." : lastSaved ?
</div>
</div>
{/* Filter */}
<div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "0 20px 22px"
{[["all", "Todas"], ["pending", "Pendentes"], ["done", "Concluídas"]].map(([val, labe
<button key={val} onClick={() => setFilter(val)} style={{
padding: "6px 18px", borderRadius: 30,
border: `1px solid ${filter === val ? "#c9a96e" : "rgba(201,169,110,0.22)"}`,
background: filter === val ? "rgba(201,169,110,0.13)" : "transparent",
color: filter === val ? "#c9a96e" : "#6a5a40",
fontSize: 12, cursor: "pointer", letterSpacing: "0.06em", transition: "all }}>{label}</button>
0.2s",
))}
</div>
{/* Categories */}
<div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
{categories.map(cat => {
const { done, total } = getProgress(cat);
const isOpen = openCat === cat.id;
const allDone = done === total;
const visibleItems = cat.items.filter(item => {
const key = `${cat.id}||${item}`;
if (filter === "done") return !!checked[key];
if (filter === "pending") return !checked[key];
return true;
});
if (filter !== "all" && visibleItems.length === 0) return null;
return (
<div key={cat.id} style={{
marginBottom: 10,
border: `1px solid ${isOpen ? cat.color + "50" : "rgba(255,255,255,0.06)"}`,
borderRadius: 12, overflow: "hidden",
background: isOpen ? "rgba(255,255,255,0.025)" : "transparent",
transition: "all 0.2s",
}}>
<button onClick={() => setOpenCat(isOpen ? null : cat.id)} style={{
width: "100%", display: "flex", alignItems: "center", gap: 12,
padding: "14px 18px", background: "transparent", border: "none",
cursor: "pointer", textAlign: "left",
}}>
<span style={{ fontSize: 19 }}>{cat.icon}</span>
<span style={{ flex: 1, fontSize: 15, color: "#f0e6d3", letterSpacing: "0.02e
{allDone && <span style={{ fontSize: 10, color: "#7dc97a" }}>✓ COMPLETO</span
<span style={{ fontSize: 12, color: allDone ? "#7dc97a" : cat.color, minWidth
{done}/{total}
</span>
<span style={{
fontSize: 9, color: cat.color, marginLeft: 2,
transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transfo
}}>▼</span>
</button>
<div style={{ height: 2, background: "rgba(255,255,255,0.04)", margin: "0 18px"
<div style={{
height: "100%", width: `${(done / total) * 100}%`,
background: allDone ? "#7dc97a" : cat.color, transition: "width 0.35s",
}} />
</div>
{isOpen && (
<div style={{ padding: "10px 0 14px" }}>
{visibleItems.map(item => {
const key = `${cat.id}||${item}`;
const isDone = !!checked[key];
return (
<div key={item} onClick={() => toggle(cat.id, item)}
style={{ display: "flex", alignItems: "flex-start", gap: 12, padding:
onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,2
onMouseLeave={e => e.currentTarget.style.background = "transparent"}
>
<div style={{
width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2
border: `1.5px solid ${isDone ? cat.color : "rgba(255,255,255,0.17)
background: isDone ? cat.color + "25" : "transparent",
display: "flex", alignItems: "center", justifyContent: "center",
transition: "all 0.2s",
}}>
{isDone && <span style={{ color: cat.color, fontSize: 11 }}>✓</span
</div>
<span style={{
fontSize: 13, lineHeight: 1.55,
color: isDone ? "#5a4a30" : "#d4c4a8",
textDecoration: isDone ? "line-through" : "none",
transition: "all 0.2s",
}}>{item}</span>
</div>
);
})}
</div>
)}
</div>
);
})}
</div>
<div style={{ textAlign: "center", marginTop: 44, color: "#3a2a18", fontSize: 11, lette
✦ Feito com amor ✦
</div>
</div>
);
}
