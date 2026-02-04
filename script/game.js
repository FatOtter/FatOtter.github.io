/* Game Logic for Fat Otter's Requirement Catcher */

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById('game-overlay');
    this.ui = {
      weight: document.getElementById('score-weight'),
      money: document.getElementById('score-money'),
      timer: document.getElementById('score-timer'),
      msg: document.getElementById('game-msg')
    };
    
    // Game State
    this.isActive = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.player = { x: this.width / 2, y: this.height - 100, width: 60, height: 60, speed: 10 };
    this.items = []; // Falling requirements
    this.state = {
      weight: 100, // Initial weight (jin)
      money: 3000, // Initial money
      time: 60,    // Seconds
      lastFrame: 0,
      spawnTimer: 0
    };

    // Assets
    this.keywords = [
      // SGE (MSF) - Social & Family Dev
      "SGE: CPLS", "Car Park Label",
      "SGE: EIPIC", "Early Intervention",
      "SGE: PPIP", "SGE: ATC", 
      "SGE: DSP", "Disability Support",
      
      // APS (Aviation) - Intelligent Scheduling
      "APS: Weekly Plan", "APS: Daily Schedule", // 周/日计划
      "Constraint: OSP", "Constraint: Space", // 工艺/空间约束
      "Res: Qualification", "Res: Tooling", // 资质/工装
      "Data: MOM Integration", "KPI: Manpower Util", // 集成与指标
      "Algo: Heuristic", "Algo: Rolling Horizon", // 算法类型
      
      // Retail / CV
      "Shell: CV Pipeline", "Store Scoring",
      "Trax: Retail AI", "Market Insight",
      
      // Airport
      "Airport: Pax Flow", "Sim: Bottleneck"
    ];
    
    // Bindings
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.handleInput();
    
    // Load Sprite (using emoji/simple shape for now if image fails)
    this.otterImg = new Image();
    this.otterImg.src = 'assets/protrait.png'; // Use portrait as avatar for now
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.player.y = this.height - 120;
  }

  start() {
    this.isActive = true;
    this.overlay.style.opacity = 1;
    this.state.weight = 100;
    this.state.money = 3000;
    this.state.time = 60;
    this.items = [];
    this.ui.msg.innerText = "准备接需求！左右移动控制 Rex";
    
    // Start loop
    requestAnimationFrame((t) => this.loop(t));
    
    // Timer countdown
    this.timerInterval = setInterval(() => {
      if (!this.isActive) return;
      this.state.time--;
      if (this.state.time <= 0) {
        this.endGame(true, "平稳落地！项目顺利交付！");
      }
    }, 1000);
  }

  handleInput() {
    // Touch
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      this.player.x = touchX - this.player.width / 2;
    }, { passive: false });

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      this.player.x = e.clientX - this.player.width / 2;
    });

    // Keyboard (optional)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.player.x -= 30;
      if (e.key === 'ArrowRight') this.player.x += 30;
    });
  }

  spawnItem() {
    const text = this.keywords[Math.floor(Math.random() * this.keywords.length)];
    const x = Math.random() * (this.width - 100) + 50;
    this.items.push({
      x: x,
      y: -50,
      text: text,
      speed: 3 + Math.random() * 3,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  }

  update(dt) {
    // Spawn
    this.state.spawnTimer += dt;
    if (this.state.spawnTimer > 800) { // Spawn every 0.8s
      this.spawnItem();
      this.state.spawnTimer = 0;
    }

    // Move Items
    for (let i = this.items.length - 1; i >= 0; i--) {
      let item = this.items[i];
      item.y += item.speed;

      // Collision Detection (Catch)
      if (
        item.x < this.player.x + this.player.width &&
        item.x + 60 > this.player.x &&
        item.y < this.player.y + this.player.height &&
        item.y + 40 > this.player.y
      ) {
        // Caught!
        this.state.weight += 1; // +1 jin
        this.state.money += 200;
        this.items.splice(i, 1);
        this.checkWin();
        continue;
      }

      // Missed (Off screen)
      if (item.y > this.height) {
        this.state.weight = Math.max(0, this.state.weight - 1); // -1 jin
        this.state.money -= 500; // Lose money
        this.items.splice(i, 1);
        this.checkFail();
      }
    }

    // Keep player in bounds
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > this.width - this.player.width) this.player.x = this.width - this.player.width;
  }

  checkWin() {
    if (this.state.weight >= 200) {
      this.endGame(true, "太强了！您已成为业界重量级专家（200斤）！");
    }
  }

  checkFail() {
    if (this.state.money <= 0) {
      this.endGame(false, "资金链断裂... 破产了！");
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Player
    // this.ctx.fillStyle = '#333';
    // this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    try {
        this.ctx.drawImage(this.otterImg, this.player.x, this.player.y, this.player.width, this.player.height);
    } catch(e) {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }

    // Draw Items
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.items.forEach(item => {
      this.ctx.fillStyle = item.color;
      this.ctx.beginPath();
      this.ctx.roundRect(item.x, item.y, 80, 40, 10);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#fff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.text, item.x + 40, item.y + 25);
    });
    
    // UI Updates
    this.ui.weight.innerText = `体重: ${this.state.weight}斤`;
    this.ui.money.innerText = `资金: ￥${this.state.money}`;
    this.ui.timer.innerText = `${this.state.time}s`;
  }

  loop(timestamp) {
    if (!this.isActive) return;
    const dt = timestamp - this.state.lastFrame;
    this.state.lastFrame = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  endGame(success, message) {
    this.isActive = false;
    clearInterval(this.timerInterval);
    
    const container = document.getElementById('game-msg');
    container.innerHTML = ''; // Clear previous content

    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '20px';
    msgDiv.innerText = message;
    
    const enterBtn = document.createElement('button');
    enterBtn.id = 'game-enter-btn';
    enterBtn.className = 'btn'; // Use global style
    enterBtn.style.marginTop = '10px';
    
    if (success) {
      msgDiv.style.color = 'var(--success)';
      enterBtn.innerText = "进入主页";
    } else {
      msgDiv.style.color = 'var(--error)';
      enterBtn.innerText = "虽败犹荣，直接进入"; // Fail forward
      
      const retryBtn = document.createElement('button');
      retryBtn.innerText = "不服再战";
      retryBtn.className = 'chip';
      retryBtn.style.marginRight = '10px';
      retryBtn.onclick = () => {
        container.innerHTML = `
          <div><i class="fa-solid fa-gamepad"></i> Rex 的需求接住大作战</div>
          <div style="font-size:1rem; font-weight:400; margin:10px 0; color:var(--muted)">
            接住项目需求变强(胖)，漏掉需求会扣钱变瘦！<br>
            目标：活过60秒 或 达到200斤<br>
            失败：资金归零
          </div>
          <button id="game-start-btn">开始工作</button>
        `;
        document.getElementById('game-start-btn').className = 'btn';
        document.getElementById('game-start-btn').onclick = () => {
             document.getElementById('game-start-btn').style.display = 'none';
             this.start();
        };
      };
      container.appendChild(retryBtn);
    }
    
    enterBtn.onclick = () => {
        // Trigger exit animation
        this.overlay.classList.add('hidden');
        
        // Trigger entrance animation for main content
        // Small delay to sync with the "zoom in" feel
        setTimeout(() => {
          document.querySelector('.wrapper').classList.add('visible');
        }, 100);
        
        // Stop rendering loop to save battery
        this.isActive = false;
    };

    container.prepend(msgDiv);
    container.appendChild(enterBtn);
  }
}

// Init
window.onload = () => {
    // Check if we should skip game (optional, e.g. ?skip=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skip')) {
        document.getElementById('game-overlay').style.display = 'none';
        document.querySelector('.wrapper').classList.add('visible');
        return;
    }

    const game = new Game();
    
    // Start Button
    const startBtn = document.getElementById('game-start-btn');
    startBtn.className = 'btn'; // Apply global styling
    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        game.start();
    });
};
