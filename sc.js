// jump-embed-top.js
(() => {
  // 容器
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.height = '360px'; // 固定高度，可调整
  container.style.overflow = 'hidden';
  container.style.background = 'radial-gradient(circle at 20% 0%, #fdfbfb 0, #ebedee 30%, #1f2335 100%)';
  container.style.marginBottom = '20px'; // 让下面内容有间距
  document.body.prepend(container);

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.cursor = 'pointer';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = container.clientWidth;
  let H = container.clientHeight;
  let dpr = window.devicePixelRatio || 1;

  // --- 以下为原游戏逻辑，仅修改部分：
  const GRAVITY = 1600, MIN_POWER = 650, MAX_POWER = 1500, MAX_CHARGE_TIME = 900;
  let platforms = [], particles = [], floatingTexts = [];
  let player = null, gameState = 'ready', holdStart = 0, holdTime = 0;
  let score = 0, bestScore = 0, combo = 0, cameraX = 0;
  let shakeTime = 0, shakeMag = 0;
  let lastTime = 0;
  const PLATFORM_COLORS = ['#FF9A9E','#FAD0C4','#FBC2EB','#A6C1EE','#A1C4FD','#C2E9FB','#FEE140','#FA709A'];

  function resize() {
    W = container.clientWidth;
    H = container.clientHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  (function initBestScore () {
    try { const val = localStorage.getItem('jump_best_score'); if(val) bestScore = parseInt(val,10)||0; }
    catch(e){ bestScore=0; }
  })();

  // --- 平台生成 / 游戏初始化 / 重置 ---
  function createPlatform(x,y,width){ return {x,y,width,height:26,color: PLATFORM_COLORS[(Math.random()*PLATFORM_COLORS.length)|0]}; }
  function spawnNextPlatform(prev){
    let x = prev.x + 160 + Math.random()*180;
    let y = prev.y - 120 + Math.random()*240;
    y = Math.min(Math.max(y,H*0.3), H*0.8);
    const width = 80 + Math.random()*80;
    return createPlatform(x,y,width);
  }
  function createInitialPlatforms(){
    platforms.length=0;
    const baseY = H*0.7;
    const first = createPlatform(W*0.3,baseY,150);
    platforms.push(first);
    let prev=first;
    for(let i=0;i<6;i++){ prev=spawnNextPlatform(prev); platforms.push(prev); }
  }
  function resetGame(){
    score=0; combo=0; cameraX=0; particles.length=0; floatingTexts.length=0;
    shakeTime=0; shakeMag=0;
    createInitialPlatforms();
    const first=platforms[0];
    player={x:first.x, y:first.y-44, radius:24, vx:0, vy:0, chargeScale:1, currentPlatform:first};
    gameState='ready';
  }

  function ensurePlatforms(){
    let last = platforms[platforms.length-1]; if(!last) return;
    while(last.x - cameraX < W*2){ const next=spawnNextPlatform(last); platforms.push(next); last=next; }
    while(platforms.length && platforms[0].x + platforms[0].width < cameraX - W*0.5){ platforms.shift(); }
  }

  // --- 跳跃、蓄力、物理更新 ---
  function startCharge(){ if(gameState==='ready'){ gameState='charging'; holdStart=performance.now(); holdTime=0; } else if(gameState==='gameover'){ resetGame(); } }
  function releaseCharge(){ if(gameState!=='charging') return; holdTime = performance.now()-holdStart; const t=Math.min(1,holdTime/MAX_CHARGE_TIME); const power=MIN_POWER+(MAX_POWER-MIN_POWER)*t; const angle=-Math.PI/3; player.vx=Math.cos(angle)*power; player.vy=Math.sin(angle)*power; gameState='jumping'; }
  function triggerGameOver(){ if(gameState==='gameover') return; gameState='gameover'; }

  function update(dt){
    if(!player) return;
    dt=Math.min(dt,0.032);
    if(gameState==='charging'){ const now=performance.now(); holdTime=now-holdStart; player.chargeScale=1-0.25*Math.min(1,holdTime/MAX_CHARGE_TIME); }
    else{ player.chargeScale += (1-player.chargeScale)*Math.min(1,dt*14); }

    if(gameState==='jumping'){
      const prevBottom = player.y + player.radius;
      player.vy += GRAVITY*dt;
      player.x += player.vx*dt;
      player.y += player.vy*dt;
      const currBottom = player.y + player.radius;

      let landedPlatform = null;
      if(player.vy>0){
        for(let i=0;i<platforms.length;i++){
          const p=platforms[i];
          const left=p.x - p.width/2;
          const right=p.x + p.width/2;
          if(player.x>left && player.x<right && prevBottom<=p.y && currBottom>=p.y){ landedPlatform=p; break; }
        }
      }

      if(landedPlatform){
        player.y=landedPlatform.y-player.radius; player.vx=0; player.vy=0; player.currentPlatform=landedPlatform; gameState='ready';
        score+=1; const centerDist=Math.abs(player.x-landedPlatform.x); let bonus=0;
        if(centerDist<10){ combo+=1; bonus=2+Math.min(3,combo-1); }
        else if(centerDist<landedPlatform.width*0.25){ combo=0; }
        else{ combo=0; }
        score+=bonus;
        if(score>bestScore){ bestScore=score; try{ localStorage.setItem('jump_best_score',String(bestScore)); } catch(e){} }
        shakeTime=0.14; shakeMag=10;
        ensurePlatforms();
      } else if(player.y-player.radius>H+200){ triggerGameOver(); }
    }

    const targetCameraX = Math.max(0,player.x-W*0.35);
    cameraX += (targetCameraX-cameraX)*Math.min(1,dt*3);
    if(shakeTime>0){ shakeTime-=dt; if(shakeTime<0) shakeTime=0; }

    for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.life+=dt; if(p.life>p.maxLife){ particles.splice(i,1); continue; } p.vy+=GRAVITY*0.3*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; }
    for(let i=floatingTexts.length-1;i>=0;i--){ const f=floatingTexts[i]; f.life+=dt; f.y-=30*dt; if(f.life>f.maxLife) floatingTexts.splice(i,1); }
  }

  // --- 渲染（这里可以直接复用你原来的 render()，只需修改 canvas 大小为 container 大小） ---
  function render(){
    if(!player) return;
    ctx.clearRect(0,0,W,H);
    // 在这里绘制背景、平台、角色、粒子、飘字、HUD
    // 建议直接把你原 HTML 中的 render() 函数复制过来，并替换 W,H 为 container.clientWidth/clientHeight
  }

  function loop(timestamp){ if(!lastTime) lastTime=timestamp; const dt=(timestamp-lastTime)/1000; lastTime=timestamp; lastTime=timestamp; update(dt); render(); requestAnimationFrame(loop); }

  // --- 输入事件 ---
  let pointerDown=false;
  canvas.addEventListener('mousedown',()=>{ pointerDown=true; startCharge(); });
  window.addEventListener('mouseup',()=>{ if(pointerDown){ pointerDown=false; releaseCharge(); } });
  canvas.addEventListener('touchstart',e=>{ e.preventDefault(); pointerDown=true; startCharge(); },{passive:false});
  window.addEventListener('touchend',e=>{ e.preventDefault(); if(pointerDown){ pointerDown=false; releaseCharge(); }},{passive:false});
  let keyCharging=false;
  window.addEventListener('keydown',e=>{ if(e.code==='Space'||e.key===' '){ if(!keyCharging){ keyCharging=true; startCharge(); } e.preventDefault(); }});
  window.addEventListener('keyup',e=>{ if(e.code==='Space'||e.key===' '){ if(keyCharging){ keyCharging=false; releaseCharge(); } e.preventDefault(); }});

  window.addEventListener('resize',()=>{ resize(); resetGame(); });

  resize(); resetGame(); requestAnimationFrame(loop);
})();
