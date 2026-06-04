const calendario = document.getElementById("calendario");
const mesAno = document.getElementById("mesAno");
const diasBloqueados = [
  "2026-05-01",
  "2026-06-04",
  "2026-06-06",
  "2026-06-07",
  "2026-06-18",
  "2026-06-19",
  "2026-06-20",
  "2026-06-21",
  "2026-06-22",
  "2026-06-23",
  "2026-06-24",
  "2026-06-25",
  "2026-06-26",
  "2026-06-27",
  "2026-06-28",
  "2026-06-29",
  "2026-06-30",
  "2026-07-01",
  "2026-07-02",
  "2026-08-22",
  "2026-08-29",
  "2026-10-12",
  "2026-10-15",
  "2026-11-07",
  "2026-11-26",
  "2026-11-27",
  "2026-11-30",
];
const hoje = new Date();
const mesMin = 4;  // Maio
const mesMax = 10; // Novembro

let mesInicial = hoje.getMonth();

if (mesInicial < mesMin) mesInicial = mesMin;
if (mesInicial > mesMax) mesInicial = mesMax;

// controle de data
let dataAtual = new Date(2026, mesInicial, 1);

function gerarCalendario() {
  calendario.innerHTML = "";

  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  mesAno.textContent = `${meses[mes]} de ${ano}`;

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const hoje = new Date();

  // 🔳 espaços vazios
  for (let i = 0; i < primeiroDiaSemana; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("dia");
    vazio.style.visibility = "hidden";
    calendario.appendChild(vazio);
  }

  // 📅 dias
  for (let i = 1; i <= diasNoMes; i++) {
    const dia = document.createElement("div");
    dia.classList.add("dia");
    dia.innerHTML = `<span>${i}</span>`;

    const dataFormatada = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    const info = agenda[dataFormatada];

    if (diasBloqueados.includes(dataFormatada)) {
  dia.classList.add("dia-apagado");
}

    // 🟤 fim de semana sem nada
const diaSemana = new Date(ano, mes, i).getDay();

if (
  (diaSemana === 0 || diaSemana === 6) && // domingo ou sábado
  (!info || (
    info.eventos.length === 0 &&
    info.trabalhos.length === 0 &&
    info.atividades.length === 0
  ))
) {
  dia.classList.add("dia-apagado");
}

    // 🔴 hoje
    if (
      i === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear()
    ) {
      dia.style.border = "2px solid blue";
    }

    // 🔵 bolinhas
    const bolinhas = document.createElement("div");
    bolinhas.classList.add("bolinhas");

    if (info) {
      if (info.eventos.length > 0) {
        const b = document.createElement("span");
        b.classList.add("evento");
        bolinhas.appendChild(b);
      }

      if (info.trabalhos.length > 0) {
        const b = document.createElement("span");
        b.classList.add("trabalho");
        bolinhas.appendChild(b);
      }

      if (info.atividades.length > 0) {
        const b = document.createElement("span");
        b.classList.add("atividade");
        bolinhas.appendChild(b);
      }
    }

    dia.appendChild(bolinhas);

    // clique
    dia.addEventListener("click", () => {
      document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
      dia.classList.add("selecionado");

      mostrarInfo(dataFormatada);
    });

    calendario.appendChild(dia);
  }

  atualizarBotoes();
}

// botões
function mesAnterior() {
  if (dataAtual.getMonth() > mesMin) {
    dataAtual.setDate(1);
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario();
  }
}

function proximoMes() {
  if (dataAtual.getMonth() < mesMax) {
    dataAtual.setDate(1);
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario();
  }
}

function atualizarBotoes() {
  document.querySelector(".topo button:first-child").disabled =
    dataAtual.getMonth() === mesMin;

  document.querySelector(".topo button:last-child").disabled =
    dataAtual.getMonth() === mesMax;
}

// 📋 info
function mostrarInfo(data) {
  const info = agenda[data];

  const [ano, mes, dia] = data.split("-");

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  document.getElementById("dataSelecionada").textContent =
    `${parseInt(dia)} de ${meses[parseInt(mes) - 1]}`;

  document.getElementById("eventos").innerHTML =
    info && info.eventos.length
      ? info.eventos.map(e => `• ${e}`).join("<br>")
      : "Nenhum evento para esse dia ;(";

  document.getElementById("trabalhos").innerHTML =
    info && info.trabalhos.length
      ? info.trabalhos.map(t => `• ${t}`).join("<br>")
      : "Nenhum trabalho para esse dia :D";

  document.getElementById("atividades").innerHTML =
    info && info.atividades.length
      ? info.atividades.map(a => `• ${a}`).join("<br>")
      : "Nenhuma atividade para esse dia :)";
}

gerarCalendario();