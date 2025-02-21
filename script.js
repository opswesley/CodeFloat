let currentClockIndex = 0;
let clockColor = "#00ffff"; // Cor padrão inicial do relógio
const clocks = [
  {
    type: "minimal",
    update: function () {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    style: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "3rem"
    }
  },
  {
    type: "programming",
    update: function () {
      const now = new Date();
      const clock = {
        hour: String(now.getHours()).padStart(2, '0'),
        minute: String(now.getMinutes()).padStart(2, '0'),
        second: String(now.getSeconds()).padStart(2, '0'),
        period: now.getHours() >= 12 ? "PM" : "AM",
        day: now.getDate(),
        month: now.toLocaleString('en-US', { month: 'long' }), // Mês em inglês
        year: now.getFullYear()
      };
      return `
let clock = {
hour: ${clock.hour},
minute: ${clock.minute},
second: ${clock.second},
period: "${clock.period}",
day: ${clock.day},
month: "${clock.month.charAt(0).toUpperCase() + clock.month.slice(1)}",
year: ${clock.year}
};
      `;
    },
    style: {
      fontFamily: "'Roboto Mono', monospace",
      fontSize: "1.2rem",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  },
  {
    type: "countdown",
    update: function () {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = Math.floor((end - now) / 1000);
      const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    style: {
      fontFamily: "'Roboto Mono', monospace",
      fontSize: "2.8rem"
    }
  },
  {
    type: "binary",
    update: function () {
      const now = new Date();
      const hours = now.getHours().toString(2).padStart(6, '0');
      const minutes = now.getMinutes().toString(2).padStart(6, '0');
      const seconds = now.getSeconds().toString(2).padStart(6, '0');
      return `
        <div class="binary-clock">
          <span style="color: cyan;">${hours}</span>
          <span style="color: magenta;">:</span>
          <span style="color: magenta;">${minutes}</span>
          <span style="color: lime;">:</span>
          <span style="color: lime;">${seconds}</span>
        </div>
      `;
    },
    style: {
      fontFamily: "'Roboto Mono', monospace",
      fontSize: "1.5rem"
    }
  }
];

function updateClock() {
  const clockElement = document.getElementById('clock');
  const currentClock = clocks[currentClockIndex];
  clockElement.innerHTML = currentClock.update();
  Object.assign(clockElement.style, currentClock.style);
  clockElement.style.color = clockColor;
}

function changeClock(direction) {
  const totalClocks = clocks.length;
  currentClockIndex += direction;
  if (currentClockIndex >= totalClocks) currentClockIndex = 0;
  if (currentClockIndex < 0) currentClockIndex = totalClocks - 1;
  
  const clockElement = document.getElementById('clock');
  clockElement.style.animation = direction > 0 ? "slideInRight 0.3s forwards" : "slideInLeft 0.3s forwards";
  setTimeout(() => {
    updateClock();
    clockElement.style.animation = "";
  }, 300);
}

function setupSpotifyListener() {
  const musicInfoElement = document.createElement('div');
  musicInfoElement.id = 'music-info';
  document.body.appendChild(musicInfoElement);

  function updateMusicInfo() {
    fetch('/current-track')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          musicInfoElement.style.display = 'none'; // Oculta se não houver música tocando
        } else {
          const content = `
            <div class="music-text">
              <strong>Música:</strong> ${data.name}<br>
              <strong>Artista:</strong> ${data.artist}
            </div>
          `;
          musicInfoElement.innerHTML = content;
          musicInfoElement.style.display = 'block';
        }
      })
      .catch((error) => {
        console.error('Erro ao capturar música:', error);
      });
  }

  // Atualiza as informações periodicamente
  setInterval(updateMusicInfo, 5000); // A cada 5 segundos
}

// Background Animado
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];

class Particle {
  constructor(x, y, size, color, velocity) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x > canvas.width || this.x < 0) this.velocity.x = -this.velocity.x;
    if (this.y > canvas.height || this.y < 0) this.velocity.y = -this.velocity.y;
    this.draw();
  }
}

function createParticles() {
  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
    particles.push(new Particle(x, y, size, color, velocity));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => particle.update());
  requestAnimationFrame(animate);
}

createParticles();
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Função para alterar o background
function changeBackground(bgClass) {
  document.body.classList.remove('gradient1', 'gradient2', 'solid1', 'solid2');
  document.body.classList.add(bgClass);
}

document.querySelectorAll('.palette-btn').forEach(button => {
  button.addEventListener('click', () => {
    const bgClass = button.getAttribute('data-bg');
    changeBackground(bgClass);
  });
});

document.getElementById('clock-color').addEventListener('input', (event) => {
  clockColor = event.target.value; 
  document.getElementById('clock').style.color = clockColor; 
});

document.getElementById('music-color').addEventListener('input', (event) => {
  document.getElementById('music-info').style.color = event.target.value;
});

document.getElementById('button-color').addEventListener('input', (event) => {
  document.querySelectorAll('.controls button').forEach(button => {
    button.style.borderColor = event.target.value;
    button.style.color = event.target.value;
  });
});

document.getElementById('blur-intensity').addEventListener('input', (event) => {
  const blurValue = `${event.target.value}px`;
  document.getElementById('background').style.filter = `blur(${blurValue})`;
});

setInterval(updateClock, 1000);
updateClock();

window.addEventListener('load', () => {
  setupSpotifyListener();
});
