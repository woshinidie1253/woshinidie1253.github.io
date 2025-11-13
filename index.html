!doctype html
html lang=zh-CN
head
  meta charset=utf-8 
  meta name=viewport content=width=device-width,initial-scale=1 
  title跳一跳 — 离线版 (单文件)title
  style
    html,body { height100%; margin0; background#ececec; font-family system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial; }
    .wrap { displayflex; flex-directioncolumn; align-itemscenter; justify-contentcenter; height100%; }
    canvas { background linear-gradient(#bfe9ff,#89d0ff); border-radius12px; box-shadow0 8px 24px rgba(0,0,0,0.18); }
    .hud { margin-top14px; displayflex; gap10px; align-itemscenter; }
    .btn { background#fff; padding8px 12px; border-radius8px; box-shadow0 2px 6px rgba(0,0,0,0.08); cursorpointer; }
    .note { color#444; font-size13px; }
  style
head
body
  div class=wrap
    canvas id=game width=420 height=700canvas
    div class=hud
      div class=btn id=restart重新开始div
      div class=note按住或触摸蓄力，松开跳跃。strong id=score分数 0strongdiv
    div
  div

script
(() = {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

   游戏状态
  let platforms = [];  {x,y,w,h}
  let player = null;
  let gravity = 0.9;
  let charging = false;
  let chargeStart = 0;
  let maxCharge = 1200;  ms
  let score = 0;
  let best = 0;
  let running = true;

  function rand(min,max){ return Math.random()(max-min)+min }

  function reset(){
    platforms = [];
     初始平台在中下方
    const baseW = 140;
    const baseH = 16;
    const baseX = (W-baseW)2;
    const baseY = H - 140;
    platforms.push({xbaseX,ybaseY,wbaseW,hbaseH});
     生成几个平台向右
    let x = baseX + baseW + 60;
    for(let i=0;i6;i++){
      const w = rand(60,140);
      const gap = rand(60,150);
      const y = baseY - rand(40,140);
      platforms.push({xx,yy,ww,h12});
      x += w + gap;
    }
    player = {
      x baseX + baseW2,
      y baseY - 22,
      r 16,
      vx0, vy0,
      onPlatformtrue
    };
    charging=false; chargeStart=0; score=0; running=true;
    document.getElementById('score').innerText = '分数 0';
  }

  function addPlatformAt(x){
    const w = rand(60,140);
    const y = H - 200 - rand(0,180);
    platforms.push({xx,yy,ww,h12});
  }

   检测玩家与平台的接触（从上方降落）
  function checkCollision(){
    player.onPlatform = false;
    for(let p of platforms){
      if(player.vy = 0){  只有下落时才碰撞
        const px1 = p.x - player.r;
        const px2 = p.x + p.w + player.r;
        const py = p.y;
        if(player.x  px1 && player.x  px2 && player.y + player.r = py && player.y + player.r = py + 20){
           着陆
          player.y = py - player.r;
          player.vy = 0;
          player.onPlatform = true;
          return p;
        }
      }
    }
    return null;
  }

  function worldScroll(dx){
     将所有平台左移dx（当玩家接近右边时）
    for(let p of platforms) p.x -= dx;
    player.x -= dx;  视窗跟随玩家，使玩家视觉保持
  }

  function update(dt){
    if(!running) return;

     物理
    player.vy += gravity  (dt16);
    player.x += player.vx  (dt16);
    player.y += player.vy  (dt16);

     边界
    if(player.x  player.r) { player.x = player.r; player.vx = 0; }
    if(player.x  W - player.r) { player.x = W - player.r; player.vx = 0; }

     碰撞检测
    const p = checkCollision();
    if(p){
       着陆成功：如果落在非起始的平台且上次触地的平台不同，得分
      if(p !== platforms[0]){
         防止重复计分：当玩家在平台上停留则只在跳起来后计分
      }
    }

     游戏结束：掉落太低
    if(player.y - player.r  H){ running=false; }

     如果玩家靠近右侧（视觉），则世界左移创造新的平台
    const viewRightThreshold = W0.6;
    if(player.x  viewRightThreshold){
      const dx = player.x - viewRightThreshold;
      worldScroll(dx);
    }

     移除屏幕左侧过远的平台并生成新平台到右侧
    while(platforms.length && platforms[0].x + platforms[0].w  -200){
      platforms.shift();
       生成新平台在最右
      const last = platforms[platforms.length-1];
      addPlatformAt(last.x + last.w + rand(60,160));
    }
  }

  function jumpFromCharge(){
    if(!player.onPlatform) return;
    const hold = Math.min(Date.now() - chargeStart, maxCharge);
    const power = hold  maxCharge;  0..1
     距离与力量关系做非线性映射，原版大概平方关系
    const jumpSpeed = 18 + power  42;  垂直速度
    const horizontal =  (8 + power  40);  水平速度
     朝右或左跳根据鼠标位置，相对平台中心
     这里直接让玩家向右为主，微随机
    player.vy = -jumpSpeed;
     根据目标平台选择横向速度：如果下一个平台在右边给正速度
     取离当前最近的目标平台
    let target = null;
    for(let p of platforms){
      if(p.y  player.y + 60 && p.x  player.x - 10){ target = p; break; }
    }
    if(target){
       计算需要的vx粗略估计
      const dx = (target.x + target.w2) - player.x;
       以一个经验系数计算
      player.vx = dx  12;
    } else {
      player.vx = horizontal  (Math.random()0.6 + 0.7);
    }
    player.onPlatform = false;
     计分：每次跳起并成功到达新平台，将在下一次着陆判定
  }

   绘制
  function draw(){
     背景渐变已用 css，清屏
    ctx.clearRect(0,0,W,H);

     画阳光
    const g = ctx.createRadialGradient(W0.15,H0.1,10,W0.15,H0.1,260);
    g.addColorStop(0,'rgba(255,255,200,0.9)');
    g.addColorStop(1,'rgba(255,255,200,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

     平台
    for(let p of platforms){
      ctx.fillStyle = '#5b8a3c';
      roundRect(ctx, p.x, p.y, p.w, p.h, 6, true, false);
       顶部高光
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.moveTo(p.x+6,p.y+2); ctx.lineTo(p.x+p.w-6,p.y+2); ctx.stroke();
    }

     玩家（球）
    const grad = ctx.createRadialGradient(player.x-6, player.y-6, 4, player.x, player.y, player.r1.8);
    grad.addColorStop(0,'#fff'); grad.addColorStop(0.6,'#ffd27a'); grad.addColorStop(1,'#ff9d2a');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI2); ctx.fill();
     阴影
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(player.x, player.y+player.r+6, player.r0.9, player.r0.35, 0,0,Math.PI2); ctx.fill();

     蓄力条
    if(charging){
      const hold = Math.min(Date.now()-chargeStart, maxCharge);
      const w = Math.max(40, 200  (hold  maxCharge));
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect((W-w)2, H-48, w, 10);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.strokeRect((W-w)2, H-48, w, 10);
    }

     分数
    ctx.fillStyle = '#fff';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('分数 ' + score, 14, 26);

    if(!running){
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#fff'; ctx.font = '32px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('游戏结束', W2, H2 - 20);
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText('得分 ' + score, W2, H2 + 12);
      ctx.fillText('点击重新开始', W2, H2 + 46);
      ctx.textAlign = 'start';
    }
  }

  function roundRect(ctx,x,y,w,h,r,fill,stroke){
    if(typeof r==='undefined') r=5;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

   主循环
  let last = Date.now();
  function loop(){
    const now = Date.now();
    const dt = now - last; last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

   事件：按住蓄力，松开跳
  function startCharge(){
    if(!running) return;
    if(player.onPlatform){
      charging = true; chargeStart = Date.now();
    }
  }
  function endCharge(){
    if(charging){
      charging=false;
      jumpFromCharge();
       预先更新分数：简单策略，按跳跃距离增分
      score += 1;
      document.getElementById('score').innerText = '分数 ' + score;
    }
  }

   鼠标触摸支持
  canvas.addEventListener('mousedown', (e)={ startCharge(); });
  window.addEventListener('mouseup', (e)={ endCharge(); });
  canvas.addEventListener('touchstart', (e)={ e.preventDefault(); startCharge(); }, {passivefalse});
  window.addEventListener('touchend', (e)={ endCharge(); });

   键盘支持：空格蓄力
  window.addEventListener('keydown', (e)={ if(e.code==='Space') startCharge(); });
  window.addEventListener('keyup', (e)={ if(e.code==='Space') endCharge(); });

   点击重新开始
  document.getElementById('restart').addEventListener('click', ()={ reset(); });
  canvas.addEventListener('click', ()={ if(!running) reset(); });

   初始化并开始
  reset();
  loop();
})();
script
body
html
