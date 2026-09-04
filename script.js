const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

// Elementos de controle
const colorPicker = document.getElementById('colorPicker');
const sizeRange = document.getElementById('sizeRange');
const sizeVal = document.getElementById('sizeVal');
const btnSpray = document.getElementById('btnSpray');
const btnBrush = document.getElementById('btnBrush');
const btnClear = document.getElementById('btnClear');

// Estado do aplicativo
let isDrawing = false;
let mode = 'spray'; // 'spray' ou 'brush'
let lastX = 0;
let lastY = 0;

// Atualiza indicador de tamanho
sizeRange.addEventListener('input', (e) => {
  sizeVal.textContent = e.target.value;
});

// Troca de ferramentas
btnSpray.addEventListener('click', () => {
  mode = 'spray';
  btnSpray.classList.add('active');
  btnBrush.classList.remove('active');
});

btnBrush.addEventListener('click', () => {
  mode = 'brush';
  btnBrush.classList.add('active');
  btnSpray.classList.remove('active');
});

// Limpar o muro
btnClear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Posição do mouse/toque no canvas
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

// Início do desenho
function startDrawing(e) {
  isDrawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
  draw(e);
}

// Parar desenho
function stopDrawing() {
  isDrawing = false;
}

// Lógica de pintura
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();

  const pos = getPos(e);
  const color = colorPicker.value;
  const radius = parseInt(sizeRange.value, 10);

  if (mode === 'spray') {
    paintSpray(pos.x, pos.y, color, radius);
  } else if (mode === 'brush') {
    paintBrush(pos.x, pos.y, color, radius);
  }

  lastX = pos.x;
  lastY = pos.y;
}

// Efeito de Spray de Tinta
function paintSpray(x, y, color, radius) {
  ctx.fillStyle = color;
  const density = radius * 3; // Quantidade de gotas por ciclo

  for (let i = 0; i < density; i++) {
    // Distribuição circular das partículas de spray
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const particleX = x + Math.cos(angle) * r;
    const particleY = y + Math.sin(angle) * r;

    ctx.globalAlpha = Math.random() * 0.4 + 0.1; // Transparência suave
    ctx.fillRect(particleX, particleY, 1.5, 1.5);
  }

  // Efeito de escorrimento ocasional (drip) ao pulverizar no mesmo lugar
  if (Math.random() < 0.02) {
    makeDrip(x, y, color, radius);
  }
}

// Efeito de Pincel/Marcador
function paintBrush(x, y, color, radius) {
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = color;
  ctx.lineWidth = radius;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
}

// Simula escorrimento de tinta do graffiti
function makeDrip(x, y, color, radius) {
  const length = Math.random() * 30 + 10;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;

  for (let i = 0; i < length; i++) {
    const dripY = y + i;
    const dripWidth = Math.max(1, (radius / 6) * (1 - i / length));
    ctx.fillRect(x + (Math.random() * 4 - 2), dripY, dripWidth, 1.5);
  }
}

// Eventos de Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Eventos de Toque (para telas sensíveis ao toque)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
