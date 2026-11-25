/**
 * UMBRELLA CORPORATION // ARKLAY CLEANROOM — 5 FORÇAS DE PORTER ENGINE (LIGHT EDITION)
 * Renders interactive Hero Pentagon, 8 custom animated Light-Mode SVG charts,
 * scroll-driven reveals, Ciclo 7 tactical simulator, and accessible segmented tabs.
 */

document.addEventListener("DOMContentLoaded", () => {
  initBioCanvas();
  initScrollProgressAndSpy();
  renderAllCharts();
  initScrollRevealObservers();
  initP7Simulator();
  initFinancialTabs();
});

/* =========================================================================
   1. AMBIENT CLINICAL HEXAGONAL CANVAS (Arklay Cleanroom Light Theme)
   ========================================================================= */
function initBioCanvas() {
  const canvas = document.getElementById("bioCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodes = Array.from({ length: 38 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 1,
    type: i % 5 === 0 ? "emerald" : i % 3 === 0 ? "cyan" : "crimson",
  }));

  function drawHexagon(cx, cy, radius, strokeStyle) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const scrollOffset = window.scrollY * 0.1;
    drawHexagon(width * 0.14, ((height * 0.24 - scrollOffset) % height + height) % height, 52, "rgba(217, 4, 41, 0.08)");
    drawHexagon(width * 0.86, ((height * 0.62 - scrollOffset * 0.7) % height + height) % height, 68, "rgba(2, 132, 199, 0.07)");
    drawHexagon(width * 0.5, ((height * 0.8 - scrollOffset * 1.1) % height + height) % height, 40, "rgba(5, 150, 105, 0.07)");

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dist = Math.hypot(n.x - m.x, n.y - m.y);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.11;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle =
            n.type === "crimson"
              ? `rgba(217, 4, 41, ${alpha})`
              : n.type === "emerald"
              ? `rgba(5, 150, 105, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle =
        n.type === "crimson"
          ? "rgba(217, 4, 41, 0.35)"
          : n.type === "emerald"
          ? "rgba(5, 150, 105, 0.35)"
          : "rgba(2, 132, 199, 0.35)";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* =========================================================================
   2. SCROLL PROGRESS LASER & STICKY NAVIGATION SPY
   ========================================================================= */
function initScrollProgressAndSpy() {
  const laserBar = document.getElementById("scrollLaserBar");
  const stickyNav = document.getElementById("stickyNav");
  const navAnchors = Array.from(document.querySelectorAll("#navLinks a"));
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (laserBar) laserBar.style.width = `${pct.toFixed(2)}%`;

    if (stickyNav) {
      stickyNav.classList.toggle("scrolled", scrollTop > 40);
    }

    let currentIndex = 0;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 230) {
        currentIndex = idx;
      }
    });

    navAnchors.forEach((a, idx) => {
      a.classList.toggle("active", idx === currentIndex);
    });
  }

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  updateOnScroll();
}

/* =========================================================================
   3. SCROLL-DRIVEN REVEAL & CHART ANIMATION TRIGGERS
   ========================================================================= */
function initScrollRevealObservers() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const chartPanels = document.querySelectorAll(".chart-panel");

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  revealItems.forEach((el) => revealObs.observe(el));

  const chartObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.18 }
  );

  chartPanels.forEach((panel) => chartObs.observe(panel));
}

/* =========================================================================
   4. SVG CHART ENGINE (Hero Pentagon + 8 Custom Light-Mode Charts)
   ========================================================================= */
function renderAllCharts() {
  renderHeroPorterPentagon();
  renderChart01FinancialTrajectory();
  renderChart02MarginsPressure();
  renderChart03PnDBarrier();
  renderChart04SupplierShock();
  renderChart05BuyerP6();
  renderChart06CompShareP6();
  renderChart07PriceShiftP5P6();
  renderChart08CompetitorVulnerability();
}

/**
 * Hero Centerpiece: Radar Pentagonal das 5 Forças de Porter
 * Pressão Média do Setor (Nível 1) vs Exposição Real da Umbrella Corp. (Nível 2)
 */
function renderHeroPorterPentagon() {
  const host = document.getElementById("svgHeroPentagon");
  if (!host) return;

  const W = 660;
  const H = 395;
  const cx = 330;
  const cy = 206;
  const maxR = 136;

  const axes = [
    { label: "01. RIVALIDADE SETORIAL", sub: "Setor 4,2 vs Umbrella 2,8", sector: 4.2, umbrella: 2.8 },
    { label: "02. PODER FORNECEDORES", sub: "Setor 4,6 vs Umbrella 4,1", sector: 4.6, umbrella: 4.1 },
    { label: "03. PODER COMPRADORES", sub: "Setor 3,8 vs Umbrella 3,5", sector: 3.8, umbrella: 3.5 },
    { label: "05. SUBSTITUTOS", sub: "Setor 3,4 vs Umbrella 1,6", sector: 3.4, umbrella: 1.6 },
    { label: "04. NOVOS ENTRANTES", sub: "Setor 1,5 vs Umbrella 1,1", sector: 1.5, umbrella: 1.1 },
  ];

  function polarPoint(idx, val5) {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
    const r = (val5 / 5) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  }

  let ringsSvg = "";
  [1, 2, 3, 4, 5].forEach((lvl) => {
    const pts = axes.map((_, i) => {
      const p = polarPoint(i, lvl);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    });
    ringsSvg += `<polygon points="${pts.join(" ")}" fill="${lvl === 5 ? "rgba(241,245,249,0.55)" : "none"}" stroke="${lvl === 5 ? "rgba(15,23,42,0.18)" : "rgba(15,23,42,0.09)"}" stroke-width="1" ${lvl < 5 ? 'stroke-dasharray="3 3"' : ""}/>`;
  });

  let spokesSvg = "";
  let labelsSvg = "";
  axes.forEach((ax, i) => {
    const outer = polarPoint(i, 5);
    spokesSvg += `<line x1="${cx}" y1="${cy}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" stroke="rgba(15,23,42,0.14)" stroke-width="1"/>`;

    const lblPos = polarPoint(i, 6.18);
    let anchor = "middle";
    let dyTitle = -4;
    if (i === 0) {
      dyTitle = -12;
    } else if (i === 1 || i === 2) {
      anchor = "start";
    } else {
      anchor = "end";
    }
    if (i === 2 || i === 3) dyTitle = 8;

    labelsSvg += `
      <text x="${lblPos.x.toFixed(1)}" y="${(lblPos.y + dyTitle).toFixed(1)}" text-anchor="${anchor}" fill="#0f172a" font-size="10.5" font-weight="800" font-family="monospace">${ax.label}</text>
      <text x="${lblPos.x.toFixed(1)}" y="${(lblPos.y + dyTitle + 14).toFixed(1)}" text-anchor="${anchor}" fill="#64748b" font-size="9.5" font-weight="600" font-family="monospace">${ax.sub}</text>
    `;
  });

  const sectorPts = axes.map((ax, i) => polarPoint(i, ax.sector));
  const umbPts = axes.map((ax, i) => polarPoint(i, ax.umbrella));

  const sectorPoly = sectorPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const umbPoly = umbPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const nodesSvg =
    sectorPts
      .map(
        (p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#64748b" stroke="#ffffff" stroke-width="1.8"/>`
      )
      .join("") +
    umbPts
      .map(
        (p, idx) => `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.5" fill="#d90429" stroke="#ffffff" stroke-width="2"/>
        <text x="${p.x.toFixed(1)}" y="${(p.y - 9).toFixed(1)}" text-anchor="middle" fill="#b90422" font-size="9.5" font-weight="800" font-family="monospace">${axes[idx].umbrella.toFixed(1)}</text>
      `
      )
      .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Pentágono Estratégico das 5 Forças de Porter: Setor vs Umbrella Corp">
      ${ringsSvg}
      ${spokesSvg}
      <polygon points="${sectorPoly}" fill="rgba(100, 116, 139, 0.16)" stroke="#64748b" stroke-width="2" stroke-dasharray="5 3"/>
      <polygon points="${umbPoly}" fill="rgba(217, 4, 41, 0.16)" stroke="#d90429" stroke-width="2.8"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#d90429" stroke="#ffffff" stroke-width="2"/>
      ${nodesSvg}
      ${labelsSvg}
    </svg>
  `;
}

/**
 * Gráfico 01: Evolução Auditada de Receita, Lucro Bruto, Lucro Líquido e Liquidez Total (P1 a P6 + Meta P7)
 */
function renderChart01FinancialTrajectory() {
  const host = document.getElementById("svgStageFinancialP6");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5", "P6 (Real)", "P7 (Meta)"];
  const receita = [0.0, 0.0, 5.3, 21.82, 28.57, 36.7, 78.45];
  const lucroBruto = [0.0, 0.0, 3.49, 15.24, 20.88, 24.99, 48.35];
  const lucroLiquido = [-2.17, -2.79, 0.06, 12.46, 11.95, 10.84, 27.55];
  const liquidez = [5.13, 1.44, 1.27, 10.5, 20.47, 29.81, 60.99]; // Caixa + Aplicações

  const W = 960;
  const H = 370;
  const zeroY = 305;
  const scaleY = 3.25; // 80M = 260px

  let barsSvg = "";
  let liqPts = [];

  periods.forEach((p, i) => {
    const gx = 95 + i * 130;

    if (i === 5) {
      barsSvg += `<rect x="${gx - 48}" y="22" width="96" height="${zeroY - 14}" rx="8" fill="rgba(217,4,41,0.05)" stroke="rgba(217,4,41,0.25)" stroke-dasharray="4 3"/>`;
    }

    const recH = Math.max(2, receita[i] * scaleY);
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 75}ms" x="${gx - 36}" y="${zeroY - recH}" width="22" height="${recH}" rx="4" fill="#d90429"/>
      <text x="${gx - 25}" y="${zeroY - recH - 6}" text-anchor="middle" fill="#9f1239" font-size="10" font-weight="700" font-family="monospace">${receita[i].toFixed(1)}</text>
    `;

    const lbH = Math.max(2, lucroBruto[i] * scaleY);
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 75 + 35}ms" x="${gx - 10}" y="${zeroY - lbH}" width="22" height="${lbH}" rx="4" fill="#059669"/>
      <text x="${gx + 1}" y="${zeroY - lbH - 6}" text-anchor="middle" fill="#065f46" font-size="10" font-weight="700" font-family="monospace">${lucroBruto[i].toFixed(1)}</text>
    `;

    const llVal = lucroLiquido[i];
    const llH = Math.max(3, Math.abs(llVal) * scaleY);
    const llY = llVal >= 0 ? zeroY - llH : zeroY;
    const llLabelY = llVal >= 0 ? llY - 6 : llY + llH + 12;
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 75 + 70}ms" x="${gx + 16}" y="${llY}" width="22" height="${llH}" rx="4" fill="${llVal >= 0 ? "#0284c7" : "#e1112c"}"/>
      <text x="${gx + 27}" y="${llLabelY}" text-anchor="middle" fill="${llVal >= 0 ? "#075985" : "#9f1239"}" font-size="10" font-weight="700" font-family="monospace">${llVal.toFixed(1)}</text>
    `;

    barsSvg += `
      <text x="${gx}" y="${H - 18}" text-anchor="middle" fill="${i >= 5 ? "#b90422" : "#0f172a"}" font-size="11.5" font-weight="800" font-family="monospace">${p}</text>
    `;

    liqPts.push({ x: gx, y: zeroY - liquidez[i] * scaleY, val: liquidez[i] });
  });

  const pathD = liqPts.map((pt, idx) => `${idx === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const nodesSvg = liqPts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5" fill="#d97706" stroke="#ffffff" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 11}" text-anchor="middle" fill="#92400e" font-size="10" font-weight="800" font-family="monospace">R$${pt.val.toFixed(1)}M</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução Financeira P1 a P6 e Meta P7">
      <line x1="48" y1="${zeroY - 60 * scaleY}" x2="${W - 24}" y2="${zeroY - 60 * scaleY}" stroke="rgba(15,23,42,0.08)" stroke-dasharray="4 4"/>
      <text x="40" y="${zeroY - 60 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">60M</text>

      <line x1="48" y1="${zeroY - 40 * scaleY}" x2="${W - 24}" y2="${zeroY - 40 * scaleY}" stroke="rgba(15,23,42,0.08)" stroke-dasharray="4 4"/>
      <text x="40" y="${zeroY - 40 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">40M</text>

      <line x1="48" y1="${zeroY - 20 * scaleY}" x2="${W - 24}" y2="${zeroY - 20 * scaleY}" stroke="rgba(15,23,42,0.08)" stroke-dasharray="4 4"/>
      <text x="40" y="${zeroY - 20 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">20M</text>

      <line x1="48" y1="${zeroY}" x2="${W - 24}" y2="${zeroY}" stroke="rgba(15,23,42,0.25)" stroke-width="1.2"/>
      <text x="40" y="${zeroY + 4}" text-anchor="end" fill="#475569" font-size="10" font-family="monospace">0</text>

      ${barsSvg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#d97706" stroke-width="2.8"/>
      ${nodesSvg}
    </svg>
  `;
}

/**
 * Gráfico 02: Compressão Estrutural de Margens pelas Forças 1, 2 e 3 (P3 a P6 — R$/un)
 */
function renderChart02MarginsPressure() {
  const host = document.getElementById("svgStageMarginsPressure");
  if (!host) return;

  const periods = ["P3 (R$ 11,90)", "P4 (R$ 21,37)", "P5 (R$ 26,76)", "P6 (R$ 29,31)"];
  const cpvInd = [2.34, 2.71, 2.79, 4.22]; // CPV Industrial (MP + Embalagem nas vendidas)
  const varCom = [1.73, 3.74, 4.42, 5.13]; // Impostos 12,5% + Comissão
  const lucroBruto = [7.83, 14.92, 19.56, 19.97];
  const margemPct = ["65,8%", "69,8%", "73,1%", "68,1%"];

  const W = 590;
  const H = 295;
  const baseY = 242;
  const scaleY = 8.4;

  let svg = "";
  periods.forEach((p, i) => {
    const gx = 86 + i * 140;
    const hInd = cpvInd[i] * scaleY;
    const hVar = varCom[i] * scaleY;
    const hLb = lucroBruto[i] * scaleY;

    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 90}ms" x="${gx - 38}" y="${baseY - hInd}" width="22" height="${hInd}" rx="3" fill="#d97706"/>
      <text x="${gx - 27}" y="${baseY - hInd - 6}" text-anchor="middle" fill="#92400e" font-size="9.5" font-weight="700" font-family="monospace">${cpvInd[i].toFixed(2)}</text>

      <rect class="anim-bar" style="transition-delay:${i * 90 + 40}ms" x="${gx - 11}" y="${baseY - hVar}" width="22" height="${hVar}" rx="3" fill="#d90429"/>
      <text x="${gx}" y="${baseY - hVar - 6}" text-anchor="middle" fill="#9f1239" font-size="9.5" font-weight="700" font-family="monospace">${varCom[i].toFixed(2)}</text>

      <rect class="anim-bar" style="transition-delay:${i * 90 + 80}ms" x="${gx + 16}" y="${baseY - hLb}" width="24" height="${hLb}" rx="3" fill="#059669"/>
      <text x="${gx + 28}" y="${baseY - hLb - 7}" text-anchor="middle" fill="#065f46" font-size="10" font-weight="800" font-family="monospace">R$${lucroBruto[i].toFixed(2)}</text>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="700" font-family="monospace">${p}</text>
      <text x="${gx}" y="${baseY + 34}" text-anchor="middle" fill="${i === 3 ? "#b90422" : "#047857"}" font-size="9.5" font-weight="700" font-family="monospace">Margem: ${margemPct[i]}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Decomposição Unitária do Preço e Pressão de Custos P3 a P6">
      <line x1="30" y1="${baseY}" x2="${W - 20}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Gráfico 03: Escalada da Barreira de Mobilidade em P&D (P1 a P7 — Por Período vs Acumulado)
 */
function renderChart03PnDBarrier() {
  const host = document.getElementById("svgStagePnDBarrier");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5", "P6", "P7 (Ativo)"];
  const porPeriodo = [1.35, 1.05, 1.5, 2.7, 0.9, 2.4, 3.6];
  const acum = [1.35, 2.4, 3.9, 6.6, 7.5, 9.9, 13.5];
  const cotaTag = ["150k/c", "150k/c", "300k/c", "300k/c", "300k/c", "600k/c", "600k/c"];

  const W = 590;
  const H = 295;
  const baseY = 242;
  const scaleY = 14.2; // 13.5M = 191px

  let svg = "";
  let pts = [];

  periods.forEach((p, i) => {
    const x = 56 + i * 80;
    const h = porPeriodo[i] * scaleY;
    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 70}ms" x="${x - 16}" y="${baseY - h}" width="32" height="${h}" rx="4" fill="#d90429"/>
      <text x="${x}" y="${baseY - h - 6}" text-anchor="middle" fill="#9f1239" font-size="9.5" font-weight="700" font-family="monospace">${porPeriodo[i].toFixed(2)}M</text>
      <text x="${x}" y="${baseY + 17}" text-anchor="middle" fill="#0f172a" font-size="10.5" font-weight="800" font-family="monospace">${p}</text>
      <text x="${x}" y="${baseY + 32}" text-anchor="middle" fill="${i >= 5 ? "#b90422" : "#64748b"}" font-size="9" font-weight="700" font-family="monospace">${cotaTag[i]}</text>
    `;
    pts.push({ x, y: baseY - acum[i] * scaleY, val: acum[i] });
  });

  const pathD = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const nodesSvg = pts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="4.8" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 10}" text-anchor="middle" fill="#0369a1" font-size="9.8" font-weight="800" font-family="monospace">${pt.val.toFixed(1)}M</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Investimento em P&D por Período e Barreira Acumulada">
      <line x1="25" y1="${baseY}" x2="${W - 18}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      <line x1="25" y1="${baseY - 6.6 * scaleY}" x2="${W - 18}" y2="${baseY - 6.6 * scaleY}" stroke="rgba(5,150,105,0.35)" stroke-dasharray="4 4"/>
      <text x="${W - 22}" y="${baseY - 6.6 * scaleY - 5}" text-anchor="end" fill="#047857" font-size="9" font-weight="700" font-family="monospace">Grau 2 Destravado (R$ 6,6M em P4)</text>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#0284c7" stroke-width="2.6"/>
      ${nodesSvg}
    </svg>
  `;
}

/**
 * Gráfico 04: Poder dos Fornecedores — Inflação na Fórmula 2:2:1 (P1 a P6 Real + Reposição P7 API vs CarCaetano)
 */
function renderChart04SupplierShock() {
  const host = document.getElementById("svgStageSupplierShock");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5", "P6 (Méd.)", "P7 (API)", "P7 (CarCaet.)"];
  const mp1 = [0.4, 0.4, 0.58, 0.6, 0.6, 0.86, 1.21, 1.21]; // 2 x MP1
  const mp2 = [0.6, 0.6, 0.98, 1.12, 1.16, 1.7, 2.42, 2.42]; // 2 x MP2
  const mp3 = [0.56, 0.59, 0.78, 0.99, 1.03, 1.66, 2.53, 2.22]; // 1 x MP3
  const total = [1.56, 1.59, 2.34, 2.71, 2.79, 4.22, 6.16, 5.86];

  const W = 940;
  const H = 315;
  const baseY = 260;
  const scaleY = 34; // R$ 6.2 = 211px

  let svg = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const gx = 78 + i * 112;
    const h1 = mp1[i] * scaleY;
    const h2 = mp2[i] * scaleY;
    const h3 = mp3[i] * scaleY;

    if (i === 7) {
      svg += `<rect x="${gx - 46}" y="24" width="92" height="${baseY - 18}" rx="8" fill="rgba(5,150,105,0.07)" stroke="rgba(5,150,105,0.32)" stroke-dasharray="3 3"/>`;
    }

    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 65}ms" x="${gx - 34}" y="${baseY - h1}" width="20" height="${h1}" rx="3" fill="#d90429"/>
      <rect class="anim-bar" style="transition-delay:${i * 65 + 30}ms" x="${gx - 10}" y="${baseY - h2}" width="20" height="${h2}" rx="3" fill="#0284c7"/>
      <rect class="anim-bar" style="transition-delay:${i * 65 + 60}ms" x="${gx + 14}" y="${baseY - h3}" width="20" height="${h3}" rx="3" fill="#d97706"/>
      <text x="${gx}" y="${baseY + 20}" text-anchor="middle" fill="${i === 7 ? "#047857" : "#0f172a"}" font-size="10.5" font-weight="800" font-family="monospace">${p}</text>
    `;

    linePts.push({ x: gx, y: baseY - total[i] * scaleY, val: total[i] });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt, i) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5" fill="${i === 7 ? "#059669" : "#b90422"}" stroke="#ffffff" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 11}" text-anchor="middle" fill="${i === 7 ? "#047857" : "#0f172a"}" font-size="10.5" font-weight="800" font-family="monospace">R$${pt.val.toFixed(2)}</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução dos Custos de Fornecedores MP1, MP2 e MP3">
      <line x1="34" y1="${baseY}" x2="${W - 22}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#059669" stroke-width="2.8"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Gráfico 05: Poder dos Compradores no Ciclo 6 — Venda Planejada vs Realizada vs Venda Retida (R1 a R4)
 */
function renderChart05BuyerP6() {
  const host = document.getElementById("svgStageBuyerP6");
  if (!host) return;

  const regions = ["Região 1 (Isolada)", "Região 2 (@ R$29)", "Região 3 (@ R$29)", "Região 4 (@ R$30)"];
  const realizado = [0, 259110, 600916, 391875];
  const perdida = [0, 120732, 199084, 508125];
  const conv = ["0% (Sem oferta)", "Conv: 68,2%", "Conv: 75,1% (1º Share)", "Conv: 43,5% (Trava À Vista)"];

  const W = 590;
  const H = 300;
  const baseY = 246;
  const scaleY = 0.00031; // 600,916 = 186px

  let svg = "";
  regions.forEach((r, i) => {
    const gx = 84 + i * 140;
    const hReal = realizado[i] * scaleY;
    const hPerd = perdida[i] * scaleY;

    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 85}ms" x="${gx - 28}" y="${baseY - hReal}" width="25" height="${Math.max(2, hReal)}" rx="4" fill="#059669"/>
      <text x="${gx - 15.5}" y="${baseY - hReal - 6}" text-anchor="middle" fill="#065f46" font-size="9.5" font-weight="800" font-family="monospace">${(realizado[i] / 1000).toFixed(0)}k</text>

      <rect class="anim-bar" style="transition-delay:${i * 85 + 40}ms" x="${gx + 3}" y="${baseY - hPerd}" width="25" height="${Math.max(2, hPerd)}" rx="4" fill="#d90429"/>
      <text x="${gx + 15.5}" y="${baseY - hPerd - 6}" text-anchor="middle" fill="#9f1239" font-size="9.5" font-weight="800" font-family="monospace">${(perdida[i] / 1000).toFixed(0)}k</text>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="800" font-family="monospace">${r}</text>
      <text x="${gx}" y="${baseY + 33}" text-anchor="middle" fill="${i === 2 ? "#047857" : i === 3 ? "#b90422" : "#64748b"}" font-size="9" font-weight="700" font-family="monospace">${conv[i]}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Conversão de Vendas por Região no Ciclo 6">
      <line x1="28" y1="${baseY}" x2="${W - 18}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Gráfico 06: Market Share por Região das 8 Corporações no Ciclo 6 (%)
 */
function renderChart06CompShareP6() {
  const host = document.getElementById("svgStageCompShareP6");
  if (!host) return;

  const companies = [
    { name: "Umbrella", r1: 0.0, r2: 10.15, r3: 23.21, r4: 15.15, highlight: true },
    { name: "Galo Elét.", r1: 0.0, r2: 5.07, r3: 16.53, r4: 21.96, highlight: false },
    { name: "BIOSAFRA", r1: 10.48, r2: 7.05, r3: 8.36, r4: 23.63, highlight: false },
    { name: "ValeVerde", r1: 38.7, r2: 26.46, r3: 21.95, r4: 11.14, highlight: false },
    { name: "KuraMotor", r1: 44.55, r2: 43.62, r3: 11.85, r4: 6.87, highlight: false },
    { name: "EcoBoost", r1: 0.0, r2: 0.0, r3: 11.44, r4: 14.04, highlight: false },
    { name: "Ipirango", r1: 6.27, r2: 7.64, r3: 6.67, r4: 7.22, highlight: false },
    { name: "KUmbustão", r1: 0.0, r2: 0.0, r3: 0.0, r4: 0.0, highlight: false },
  ];

  const W = 590;
  const H = 310;
  const baseY = 250;
  const scaleY = 4.35; // 45% = 196px

  let svg = "";
  companies.forEach((c, i) => {
    const gx = 48 + i * 70;
    const h1 = c.r1 * scaleY;
    const h2 = c.r2 * scaleY;
    const h3 = c.r3 * scaleY;
    const h4 = c.r4 * scaleY;

    if (c.highlight) {
      svg += `<rect x="${gx - 28}" y="20" width="56" height="${baseY - 14}" rx="6" fill="rgba(217,4,41,0.06)" stroke="rgba(217,4,41,0.3)" stroke-dasharray="3 3"/>`;
    }

    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 55}ms" x="${gx - 22}" y="${baseY - h1}" width="10" height="${Math.max(2, h1)}" rx="2" fill="#64748b"/>
      <rect class="anim-bar" style="transition-delay:${i * 55 + 20}ms" x="${gx - 10}" y="${baseY - h2}" width="10" height="${Math.max(2, h2)}" rx="2" fill="#0284c7"/>
      <rect class="anim-bar" style="transition-delay:${i * 55 + 40}ms" x="${gx + 2}" y="${baseY - h3}" width="10" height="${Math.max(2, h3)}" rx="2" fill="#059669"/>
      <rect class="anim-bar" style="transition-delay:${i * 55 + 60}ms" x="${gx + 14}" y="${baseY - h4}" width="10" height="${Math.max(2, h4)}" rx="2" fill="#d90429"/>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="${c.highlight ? "#b90422" : "#0f172a"}" font-size="9.5" font-weight="800" font-family="monospace">${c.name}</text>
      <text x="${gx}" y="${baseY + 32}" text-anchor="middle" fill="#475569" font-size="8.5" font-weight="700" font-family="monospace">${c.name === "KUmbustão" ? "COLAPSO 0%" : `R3:${c.r3.toFixed(0)}% R4:${c.r4.toFixed(0)}%`}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Market Share Regional das 8 Corporações no Ciclo 6">
      <line x1="22" y1="${baseY - 40 * scaleY}" x2="${W - 10}" y2="${baseY - 40 * scaleY}" stroke="rgba(15,23,42,0.08)" stroke-dasharray="4 4"/>
      <text x="19" y="${baseY - 40 * scaleY + 3}" text-anchor="end" fill="#64748b" font-size="8.5" font-family="monospace">40%</text>
      <line x1="22" y1="${baseY - 20 * scaleY}" x2="${W - 10}" y2="${baseY - 20 * scaleY}" stroke="rgba(15,23,42,0.08)" stroke-dasharray="4 4"/>
      <text x="19" y="${baseY - 20 * scaleY + 3}" text-anchor="end" fill="#64748b" font-size="8.5" font-family="monospace">20%</text>
      <line x1="22" y1="${baseY}" x2="${W - 10}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Gráfico 07: Choque de Preços P5 -> P6 das 8 Corporações (Fim do Dumping da ValeVerde & Teto R$ 30)
 */
function renderChart07PriceShiftP5P6() {
  const host = document.getElementById("svgStagePriceShiftP5P6");
  if (!host) return;

  const rivals = [
    { name: "Umbrella", p5: 26.83, p6: 29.33, level: 2 },
    { name: "Galo Elét.", p5: 24.38, p6: 29.53, level: 2 },
    { name: "BIOSAFRA", p5: 23.75, p6: 27.81, level: 1 },
    { name: "ValeVerde", p5: 15.77, p6: 26.26, level: 1 },
    { name: "Ipirango", p5: 23.5, p6: 25.13, level: 1 },
    { name: "KuraMotor", p5: 24.0, p6: 24.5, level: 1 },
    { name: "EcoBoost", p5: 21.0, p6: 23.5, level: 1 },
    { name: "KUmbustão", p5: 21.5, p6: 0.0, level: 1 },
  ];

  const W = 590;
  const H = 310;
  const baseY = 250;
  const scaleP = 6.9; // R$ 30 = 207px

  let svg = "";
  rivals.forEach((r, i) => {
    const gx = 48 + i * 70;
    const h5 = r.p5 * scaleP;
    const h6 = r.p6 * scaleP;

    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 60}ms" x="${gx - 19}" y="${baseY - h5}" width="17" height="${h5}" rx="3" fill="#94a3b8"/>
      <text x="${gx - 10.5}" y="${baseY - h5 - 5}" text-anchor="middle" fill="#475569" font-size="8.5" font-weight="700" font-family="monospace">${r.p5.toFixed(0)}</text>

      <rect class="anim-bar" style="transition-delay:${i * 60 + 35}ms" x="${gx + 2}" y="${baseY - h6}" width="17" height="${Math.max(2, h6)}" rx="3" fill="${r.level === 2 ? "#d90429" : "#0284c7"}"/>
      <text x="${gx + 10.5}" y="${baseY - h6 - 5}" text-anchor="middle" fill="${r.level === 2 ? "#9f1239" : "#075985"}" font-size="8.5" font-weight="800" font-family="monospace">${r.p6 > 0 ? r.p6.toFixed(1) : "0"}</text>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="${r.name === "Umbrella" ? "#b90422" : "#0f172a"}" font-size="9.5" font-weight="800" font-family="monospace">${r.name}</text>
      <text x="${gx}" y="${baseY + 32}" text-anchor="middle" fill="${r.name === "ValeVerde" ? "#b45309" : r.level === 2 ? "#047857" : "#64748b"}" font-size="8.5" font-weight="700" font-family="monospace">${r.name === "ValeVerde" ? "+66,5% P6!" : r.name === "KUmbustão" ? "Inativa P6" : `Grau ${r.level}`}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução do Preço Médio Praticado pelos Concorrentes de P5 para P6">
      <line x1="22" y1="${baseY}" x2="${W - 10}" y2="${baseY}" stroke="rgba(15,23,42,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Gráfico 08: Índice Composto de Vulnerabilidade às 5 Forças por Corporação (0 a 5 — Menor = Mais Blindada)
 */
function renderChart08CompetitorVulnerability() {
  const host = document.getElementById("svgStageCompetitorVulnerability");
  if (!host) return;

  const items = [
    { name: "Umbrella Corp.", score: 2.62, tag: "Blindada (Grau 2 • Caixa R$29,8M)", color: "#059669" },
    { name: "Galo Elétrico", score: 2.78, tag: "Par Grau 2 (Sem atuação R1)", color: "#0284c7" },
    { name: "BIOSAFRA", score: 3.35, tag: "Líder R4, exposta em Grau 1", color: "#0284c7" },
    { name: "KuraMotor", score: 3.58, tag: "Custo Fixo 4 Usinas + Grau 1", color: "#d97706" },
    { name: "ValeVerde", score: 3.82, tag: "Choque Fornecedor forçou +67%", color: "#d97706" },
    { name: "EcoBoost Bio.", score: 4.18, tag: "Travada 1 Usina @ R$ 23,50", color: "#d90429" },
    { name: "Posto Ipirango", score: 4.35, tag: "Pulverizada 4 Regiões (1 Usina)", color: "#d90429" },
    { name: "KUmbustão", score: 5.0, tag: "Colapso Operacional no P6 (0%)", color: "#9f1239" },
  ];

  const W = 920;
  const H = 305;
  const startX = 165;
  const maxBarW = 470;

  let rowsSvg = "";
  items.forEach((it, i) => {
    const y = 26 + i * 33;
    const bw = (it.score / 5) * maxBarW;
    rowsSvg += `
      <text x="${startX - 12}" y="${y + 15}" text-anchor="end" fill="${i === 0 ? "#b90422" : "#0f172a"}" font-size="11" font-weight="800" font-family="monospace">${it.name}</text>
      <rect x="${startX}" y="${y + 2}" width="${maxBarW}" height="18" rx="5" fill="#eef2f7"/>
      <rect x="${startX}" y="${y + 2}" width="${bw.toFixed(1)}" height="18" rx="5" fill="${it.color}"/>
      <text x="${startX + bw + 8}" y="${y + 15}" text-anchor="start" fill="#0f172a" font-size="10.5" font-weight="800" font-family="monospace">${it.score.toFixed(2)}/5 • ${it.tag}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Índice Composto de Vulnerabilidade às 5 Forças de Porter">
      ${rowsSvg}
    </svg>
  `;
}

/* =========================================================================
   5. INTERACTIVE CYCLE 7 PORTER COUNTER-STRATEGY CONSOLE
   ========================================================================= */
function initP7Simulator() {
  const slSales = document.getElementById("simSales");
  const slProd = document.getElementById("simProductivity");
  const slPrice = document.getElementById("simPrice");
  const slTreasury = document.getElementById("simTreasury");

  const valSales = document.getElementById("valSimSales");
  const valProd = document.getElementById("valSimProductivity");
  const valPrice = document.getElementById("valSimPrice");
  const valTreasury = document.getElementById("valSimTreasury");

  const outAvailVol = document.getElementById("outAvailVol");
  const outAvailNote = document.getElementById("outAvailNote");
  const outMpSavings = document.getElementById("outMpSavings");
  const outMpNote = document.getElementById("outMpNote");
  const outRevP7 = document.getElementById("outRevP7");
  const outMarginNote = document.getElementById("outMarginNote");
  const outCashRoa = document.getElementById("outCashRoa");
  const outRoaNote = document.getElementById("outRoaNote");

  const btnSavedP7 = document.getElementById("presetSavedP7");
  const btnPorterOpt = document.getElementById("presetPorterOpt");
  const btnStressP7 = document.getElementById("presetStressP7");

  const INITIAL_PA_P7 = 738941; // Estoque final auditado P6
  const NOMINAL_CAP_P7 = 1800000; // 2 módulos USBIO
  const MP3_QTY_P7 = 1798011; // Lote base P7

  let useCarCaetano = false;

  function fmtInt(n) {
    return Math.round(n).toLocaleString("pt-BR");
  }

  function recalculate() {
    if (!slSales) return;
    const targetSales = Number(slSales.value);
    const prodPct = Number(slProd.value);
    const avgPrice = Number(slPrice.value);
    const appliedMillions = Number(slTreasury.value);

    valSales.textContent = `${fmtInt(targetSales)} un`;
    valProd.textContent = `${prodPct.toFixed(1).replace(".", ",")}%`;
    valPrice.textContent = `R$ ${avgPrice.toFixed(2).replace(".", ",")}`;
    valTreasury.textContent = `R$ ${appliedMillions.toFixed(1).replace(".", ",")} mi`;

    const realProd = Math.round(NOMINAL_CAP_P7 * (prodPct / 100));
    const maxSupply = INITIAL_PA_P7 + realProd;
    const effectiveSold = Math.min(targetSales, maxSupply);
    const endingPa = maxSupply - effectiveSold;

    outAvailVol.textContent = `${fmtInt(effectiveSold)} un`;
    if (targetSales > maxSupply) {
      outAvailNote.textContent = `Teto físico: ${fmtInt(realProd)} prod. + 738,9k est. = ${fmtInt(maxSupply)} un`;
      outAvailNote.style.color = "#b45309";
    } else {
      outAvailNote.textContent = `Prod. real: ${fmtInt(realProd)} un • Estoque final PA: ${fmtInt(endingPa)} un`;
      outAvailNote.style.color = "#047857";
    }

    // Economia Fornecedor MP3 (CarCaetano R$ 2,20 vs API R$ 2,50 + 1% frete)
    const mp3CostApi = MP3_QTY_P7 * 2.5 * 1.01;
    const mp3CostCar = MP3_QTY_P7 * 2.2 * 1.01;
    const supplierSaving = useCarCaetano ? mp3CostApi - mp3CostCar : 0;
    const finIncome = appliedMillions * 1e6 * 0.02; // 2,0% efetivo na previsão

    outMpSavings.textContent = useCarCaetano
      ? `+R$ ${((supplierSaving + finIncome) / 1e3).toFixed(0)} mil`
      : `+R$ ${(finIncome / 1e3).toFixed(0)} mil`;
    outMpNote.textContent = useCarCaetano
      ? `CarCaetano À Vista poupa R$ 545 mil no MP3 + R$ ${(finIncome / 1e3).toFixed(0)} mil juros`
      : `API a prazo (+13,6% custo embutido) • Juros aplic.: R$ ${(finIncome / 1e3).toFixed(0)} mil`;
    outMpNote.style.color = useCarCaetano ? "#047857" : "#64748b";

    // Receita, CPV e Lucro Líquido P7
    const revenue = effectiveSold * avgPrice;
    const unitIndCpv = 5.46; // Média ponderada estoque PA R$2,49 + lote P7 MP R$4,22 + Emb. R$1,30
    const cpv = effectiveSold * unitIndCpv + revenue * 0.175; // 12,5% imp + 5% com
    const grossProfit = revenue - cpv;
    const opExpenses = 16058088; // P&D 3,6M + Prop 5,77M + Fixo 2M + RH/Pesq
    const lair = grossProfit - opExpenses + finIncome;
    const netProfit = lair > 0 ? lair * 0.85 : lair;
    const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    outRevP7.textContent = `R$ ${(revenue / 1e6).toFixed(2).replace(".", ",")} mi`;
    if (avgPrice > 31.5) {
      outMarginNote.textContent = `Lucro Líq.: R$ ${(netProfit / 1e6).toFixed(2).replace(".", ",")} mi • Atenção: À Vista >R$31 exige prazo P0/P+1 na R4`;
      outMarginNote.style.color = "#b45309";
    } else {
      outMarginNote.textContent = `Margem Bruta: ${grossMarginPct.toFixed(1).replace(".", ",")}% • Lucro Líquido: R$ ${(netProfit / 1e6).toFixed(2).replace(".", ",")} mi`;
      outMarginNote.style.color = "#047857";
    }

    const estTotalLiquidity = 29.81 + (netProfit / 1e6) + (useCarCaetano ? 0.54 : 0);
    const estAssets = 42.9 + Math.max(0, netProfit / 1e6);
    const estRoa = estAssets > 0 ? ((netProfit / 1e6) / estAssets) * 100 : 0;

    outCashRoa.textContent = `R$ ${estTotalLiquidity.toFixed(2).replace(".", ",")} mi`;
    outRoaNote.textContent = `ROA Projetado: ${estRoa.toFixed(1).replace(".", ",")}% (Meta mínima Conselho: 20,0%)`;
    outRoaNote.style.color = estRoa >= 20 ? "#047857" : "#b90422";
  }

  function setActiveBtn(btn) {
    [btnSavedP7, btnPorterOpt, btnStressP7].forEach((b) => b && b.classList.remove("active"));
    if (btn) btn.classList.add("active");
  }

  if (btnSavedP7) {
    btnSavedP7.addEventListener("click", () => {
      useCarCaetano = false;
      setActiveBtn(btnSavedP7);
      slSales.value = 2538941;
      slProd.value = 100.0;
      slPrice.value = 30.9;
      slTreasury.value = 6.0;
      recalculate();
    });
  }

  if (btnPorterOpt) {
    btnPorterOpt.addEventListener("click", () => {
      useCarCaetano = true;
      setActiveBtn(btnPorterOpt);
      slSales.value = 2150000;
      slProd.value = 91.0;
      slPrice.value = 30.2;
      slTreasury.value = 16.0;
      recalculate();
    });
  }

  if (btnStressP7) {
    btnStressP7.addEventListener("click", () => {
      useCarCaetano = true;
      setActiveBtn(btnStressP7);
      slSales.value = 1520000;
      slProd.value = 89.5;
      slPrice.value = 30.9;
      slTreasury.value = 12.0;
      recalculate();
    });
  }

  [slSales, slProd, slPrice, slTreasury].forEach((el) => {
    if (el) el.addEventListener("input", recalculate);
  });

  useCarCaetano = true;
  recalculate();
}

/* =========================================================================
   6. ACCESSIBLE SEGMENTED TABS (Click + Arrow Keys)
   ========================================================================= */
function initFinancialTabs() {
  const tabBtns = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanes = document.querySelectorAll(".tab-pane");

  function activateTab(btn) {
    const targetId = btn.getAttribute("data-tab");
    tabBtns.forEach((b) => {
      const isAct = b === btn;
      b.classList.toggle("active", isAct);
      b.setAttribute("aria-selected", isAct ? "true" : "false");
      b.setAttribute("tabindex", isAct ? "0" : "-1");
    });
    tabPanes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === targetId);
    });
  }

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => activateTab(btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIdx =
          e.key === "ArrowRight"
            ? (idx + 1) % tabBtns.length
            : (idx - 1 + tabBtns.length) % tabBtns.length;
        tabBtns[nextIdx].focus();
        activateTab(tabBtns[nextIdx]);
      }
    });
  });
}
