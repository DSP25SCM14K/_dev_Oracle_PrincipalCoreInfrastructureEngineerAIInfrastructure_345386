const phrases = ['New platforms brought to life through automation', 'GPU readiness from devices to distributed state', 'Firmware rollouts with measured quality gates', 'Linux triage that makes the next launch simpler', 'Provisioning workflows built to recover'];
const rotatingText = document.querySelector('#rotatingText');
let phraseIndex = 0;
setInterval(() => {
  if (!rotatingText) return;
  rotatingText.classList.add('changing');
  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    rotatingText.textContent = phrases[phraseIndex];
    rotatingText.classList.remove('changing');
  }, 220);
}, 2600);

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const projectSearch = document.querySelector('#projectSearch');
const cards = [...document.querySelectorAll('.project-card')];
const count = document.querySelector('#projectCount');
const noResults = document.querySelector('#noResults');
projectSearch?.addEventListener('input', () => {
  const query = projectSearch.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const show = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    card.hidden = !show;
    if (show) visible++;
  });
  count.textContent = `${visible.toString().padStart(2, '0')} PROJECT${visible === 1 ? '' : 'S'}`;
  noResults.hidden = visible !== 0;
});

// The ambient network topology animates continuously behind the platform ecosystem diagram.
const canvas = document.querySelector('#topology');
const ctx = canvas?.getContext('2d');
let width = 0, height = 0, points = [], frame = 0;
function resizeTopology() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.max(28, Math.floor(width / 30));
  points = Array.from({length: count}, (_, i) => ({x: (i % Math.ceil(Math.sqrt(count))) * width / Math.ceil(Math.sqrt(count)) + Math.random()*28, y: Math.floor(i / Math.ceil(Math.sqrt(count))) * height / Math.ceil(Math.sqrt(count)) + Math.random()*30, phase: Math.random()*Math.PI*2, speed: .003 + Math.random()*.006}));
}
function drawTopology() {
  if (!ctx) return;
  ctx.clearRect(0,0,width,height); frame++;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const drift = reduced ? 0 : frame;
  points.forEach((p,i) => {
    const x = p.x + Math.sin(drift*p.speed+p.phase)*9, y = p.y + Math.cos(drift*p.speed*.7+p.phase)*8;
    for (let j=i+1;j<points.length;j++) {
      const q=points[j], qx=q.x+Math.sin(drift*q.speed+q.phase)*9, qy=q.y+Math.cos(drift*q.speed*.7+q.phase)*8;
      const d=Math.hypot(x-qx,y-qy);
      if (d<145) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(qx,qy); ctx.strokeStyle=`rgba(255,118,91,${(1-d/145)*.16})`; ctx.lineWidth=.55; ctx.stroke(); }
    }
    const bright=(Math.sin(drift*p.speed*1.8+p.phase)+1)/2;
    ctx.beginPath();ctx.arc(x,y,1+bright*.8,0,Math.PI*2);ctx.fillStyle=`rgba(255,155,125,${.18+bright*.3})`;ctx.fill();
  });
  requestAnimationFrame(drawTopology);
}
resizeTopology(); drawTopology();
window.addEventListener('resize', resizeTopology, {passive:true});
