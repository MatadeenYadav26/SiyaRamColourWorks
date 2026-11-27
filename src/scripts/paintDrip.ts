/**
 * Wet-paint background for the enquiry section.
 * A WebGL fragment shader renders signed-distance "paint" (top band, drips, falling drops,
 * a pool on the floor) and lights it as a glossy height field so it reads as real, thick paint.
 * A tiny JS simulation drives it: drips grow (faster while scrolling), drops break off and
 * splash into the pool, old drips drain away and new ones start, so it never looks frozen.
 * Phones get a lighter tier (fewer drips, lower resolution, 30fps).
 */

type RGB = [number, number, number];
type Drip = {
  x: number; len: number; target: number; w: number; w0: number; seed: number; amp: number;
  rgb: RGB; maxLen: number; free: boolean; rate: number; state: 'grow' | 'hold' | 'merged' | 'drain';
  timer: number; rush: number; dropT: number; v: number; freq: number;
};
type Drop = { x: number; y: number; r: number; vx: number; vy: number; rgb: RGB; splash?: boolean };
type Ripple = { x: number; age: number; amp: number };

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// three colour combos; new drips take colours from the current one, and it rotates slowly
const COMBOS: RGB[][] = [
  ['#F0A21C', '#2346A0', '#C0573A'], // saffron · royal blue · terracotta
  ['#1E6B6B', '#E26D4F', '#E3B55B'], // deep teal · coral · sand gold
  ['#B32A2A', '#E3A92B', '#1C2E5A'], // crimson · mustard · navy
].map((c) => c.map(hex));

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function fragSrc(D: number, P: number, R: number) {
  return `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define MAXD ${D}
#define MAXP ${P}
#define MAXR ${R}
uniform vec2 uRes; uniform float uScale; uniform float uTime;
uniform float uBand; uniform float uPool; uniform vec3 uLight; uniform float uQ;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2;
uniform vec3 uQ0; uniform vec3 uQ1; uniform vec3 uQ2; uniform float uMix;
uniform vec4 uD[MAXD]; uniform vec4 uDA[MAXD];
uniform vec4 uP[MAXP]; uniform vec4 uPC[MAXP];
uniform vec4 uR[MAXR];

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y); }
float smin(float a,float b,float k){ float h=max(k-abs(a-b),0.)/k; return min(a,b)-h*h*k*.25; }

float bandY(float x){
  float a=min(1.,uBand/24.);
  return uBand + a*(7.*sin(x*.011+uTime*.35)+4.*sin(x*.027-uTime*.22+1.7)+2.5*sin(x*.063+uTime*.5));
}
float poolY(float x){
  float h = uPool + min(1.,uPool/16.)*(3.*sin(x*.017+uTime*.6)+2.*sin(x*.041-uTime*.45));
  for(int i=0;i<MAXR;i++){
    vec4 R=uR[i]; if(R.z<=0.) continue;
    float dx=x-R.x; float a=R.y; float ad=abs(dx);
    h += R.z*1.4*exp(-a*2.4)*exp(-dx*dx/(R.z*R.z*5.));
    float front=a*150.;
    h += R.z*.5*exp(-a*1.2)*cos(ad*.07-a*8.)*exp(-ad/170.)*smoothstep(front+30.,front,ad);
  }
  return uRes.y - h;
}
float dripD(vec2 p, vec4 D, float amp){
  float L=D.y; if(L<=0.) return 1e4;
  float w=D.z;
  float y=clamp(p.y,-30.,L);
  float t=clamp(y/max(L,1.),0.,1.);
  float ox=amp*sin(y*.016+D.w)*smoothstep(0.,60.,y);
  float r=w*(1.-.5*smoothstep(0.,.55,t));
  float d1=length(vec2(p.x-D.x-ox,p.y-y))-r;
  float oxL=amp*sin(L*.016+D.w)*smoothstep(0.,60.,L);
  vec2 bc=vec2(D.x+oxL, L-w*.15);
  float bulb=length((p-bc)*vec2(1.,.86))-w*1.2*smoothstep(0.,36.,L);
  return smin(d1,bulb,w*.9);
}
float sceneD(vec2 p){
  float d = uBand>.5 ? p.y-bandY(p.x) : 1e4;
  for(int i=0;i<MAXD;i++){ d=smin(d,dripD(p,uD[i],uDA[i].w),14.); }
  for(int i=0;i<MAXP;i++){
    vec4 P=uP[i]; if(P.z<=0.) continue;
    vec2 q=p-P.xy; if(q.y<0.) q.y/=(1.+P.w*2.4);
    d=smin(d,length(q)-P.z,10.);
  }
  if(uPool>.5) d=smin(d,poolY(p.x)-p.y,18.);
  return d;
}
vec3 palOf(float n, vec3 c0, vec3 c1, vec3 c2){
  n=fract(n)*3.;
  vec3 a = n<1. ? c0 : (n<2. ? c1 : c2);
  vec3 b = n<1. ? c1 : (n<2. ? c2 : c0);
  return mix(a,b,smoothstep(.86,.97,fract(n)));
}
// a new colour set spreads in as marbled patches instead of fading (no muddy in-between)
vec3 pal(float n, vec2 p){
  vec3 cur=palOf(n,uC0,uC1,uC2);
  if(uMix>=1.) return cur;
  float m=noise(p*vec2(.006,.02)+vec2(7.3,1.1));
  float th=uMix*1.25-.1;
  return mix(palOf(n,uQ0,uQ1,uQ2),cur,smoothstep(th+.03,th-.03,m));
}
vec3 sceneC(vec2 p){
  vec3 c=vec3(0.); float ws=0.;
  if(uBand>.5){
    float db=p.y-bandY(p.x);
    float n=noise(vec2(p.x*.0042+uTime*.012,p.y*.012))*1.3+.35*noise(p*.02+uTime*.03);
    vec3 bc=pal(n,p);
    bc=mix(bc,vec3(.96,.93,.86),smoothstep(.035,0.,abs(fract(n*3.)-.92))*.45);
    float w=exp(-clamp(db,-40.,200.)/3.); c+=bc*w; ws+=w;
  }
  for(int i=0;i<MAXD;i++){
    float d=dripD(p,uD[i],uDA[i].w); if(d>200.) continue;
    float w=exp(-clamp(d,-40.,200.)/3.); c+=uDA[i].rgb*w; ws+=w;
  }
  for(int i=0;i<MAXP;i++){
    vec4 P=uP[i]; if(P.z<=0.) continue;
    float d=length(p-P.xy)-P.z;
    float w=exp(-clamp(d,-40.,200.)/3.); c+=uPC[i].rgb*w; ws+=w;
  }
  if(uPool>.5){
    float dp=poolY(p.x)-p.y;
    vec2 q=vec2(p.x*.0035+uTime*.012, (p.y-uRes.y)*.045);
    float wv=noise(q*vec2(3.,1.)+vec2(uTime*.04,0.));
    float n=noise(q+vec2(wv*1.6,wv*.8))*1.6 + p.x*.0007;
    vec3 pc=pal(n,p);
    // thin pale veins where two colours fold into each other
    float vein=smoothstep(.035,0.,abs(fract(n*3.)-.92));
    pc=mix(pc,vec3(.96,.93,.86),vein*.55);
    float w=exp(-clamp(dp,-40.,200.)/3.); c+=pc*w; ws+=w;
  }
  c/=max(ws,1e-4);
  return c*(.95+.1*noise(p*.05));
}
float hf(float d, vec2 p){
  float s=clamp(-d/10.,0.,1.);
  float h=sqrt(1.-(1.-s)*(1.-s));
  h+=.07*s*noise(p*vec2(.16,.06)+vec2(0.,-uTime*2.2));
  return h;
}
void main(){
  vec2 p=vec2(gl_FragCoord.x, uRes.y*uScale-gl_FragCoord.y)/uScale;
  // cheap cull: skip the full scene for bare wall far from any paint
  bool near = p.y < uBand+40. || (uPool>.5 && p.y > uRes.y-uPool-70.);
  if(!near){
    for(int i=0;i<MAXD;i++){
      vec4 D=uD[i];
      if(D.y>0. && abs(p.x-D.x) < D.z*1.6+uDA[i].w+34. && p.y < D.y+D.z*1.4+34.){ near=true; break; }
    }
  }
  if(!near){
    for(int i=0;i<MAXP;i++){
      vec4 P=uP[i];
      if(P.z>0. && abs(p.x-P.x) < P.z+34. && abs(p.y-P.y) < P.z*3.5+34.){ near=true; break; }
    }
  }
  if(!near){ gl_FragColor=vec4(0.); return; }
  float d=sceneD(p);
  if(d>22.){ gl_FragColor=vec4(0.); return; }
  vec4 sh=vec4(0.);
  if(d>-1.){
    float d2=sceneD(p-vec2(3.,7.));
    float a=(1.-smoothstep(-9.,9.,d2))*.2;
    sh=vec4(vec3(.16,.1,.05)*a,a);
  }
  float a=clamp(.5-d*uScale,0.,1.);
  if(a<=0.){ gl_FragColor=sh; return; }
  float e=1.25;
  float h0=hf(d,p);
  float hx=hf(sceneD(p+vec2(e,0.)),p+vec2(e,0.));
  float hy=hf(sceneD(p+vec2(0.,e)),p+vec2(0.,e));
  vec2 g=vec2(hx-h0,hy-h0)/e*5.5;
  vec3 n=normalize(vec3(-g.x,-g.y,1.));
  vec3 col=sceneC(p);
  vec3 L=normalize(vec3(normalize(uLight.xy-p+vec2(.001))*.6,.8));
  vec3 V=vec3(0.,0.,1.);
  vec3 H=normalize(L+V);
  float dif=max(dot(n,L),0.);
  float nh=max(dot(n,H),0.);
  float sp=pow(nh,70.)*.85+pow(nh,12.)*.1;
  if(uQ>.5){
    vec3 L2=normalize(vec3(uLight.xy-p,150.));
    sp+=pow(max(dot(n,normalize(L2+V)),0.),50.)*.35;
  }
  float rim=1.-n.z;
  col=col*(.5+.56*dif)-col*rim*.28;
  col+=sp*vec3(1.,.97,.9);
  gl_FragColor=vec4(col*a+sh.rgb*(1.-a), a+sh.a*(1.-a));
}`;
}

const VERT = `attribute vec2 aP; void main(){ gl_Position=vec4(aP,0.,1.); }`;

export function initPaintDrip(section: HTMLElement, canvas: HTMLCanvasElement) {
  const lite = matchMedia('(max-width: 767px), (hover: none)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = lite
    ? { D: 8, P: 7, R: 4, band: 24, poolMax: 40, wMin: 4.5, wMax: 8, speed: 13, fps: 30, scale: 0.75, pad: 8 }
    : { D: 16, P: 14, R: 6, band: 42, poolMax: 64, wMin: 8, wMax: 17, speed: 17, fps: 60, scale: Math.min(devicePixelRatio || 1, 1.15), pad: 22 };

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: lite ? 'low-power' : 'high-performance' }) as WebGLRenderingContext | null;
  if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < C.D * 2 + C.P * 2 + C.R + 20) { canvas.remove(); return; }

  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = mk(gl.VERTEX_SHADER, VERT), fs = mk(gl.FRAGMENT_SHADER, fragSrc(C.D, C.P, C.R));
  if (!vs || !fs) { canvas.remove(); return; }
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, 'aP');
  gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    res: U('uRes'), scale: U('uScale'), time: U('uTime'), band: U('uBand'), pool: U('uPool'), light: U('uLight'), q: U('uQ'),
    c0: U('uC0'), c1: U('uC1'), c2: U('uC2'), q0: U('uQ0'), q1: U('uQ1'), q2: U('uQ2'), mix: U('uMix'), d: U('uD'), da: U('uDA'), p: U('uP'), pc: U('uPC'), r: U('uR'),
  };
  gl.uniform1f(u.q, lite ? 0 : 1);
  const fD = new Float32Array(C.D * 4), fDA = new Float32Array(C.D * 4);
  const fP = new Float32Array(C.P * 4), fPC = new Float32Array(C.P * 4), fR = new Float32Array(C.R * 4);

  // ---------- layout ----------
  let W = 1, H = 1, scale = C.scale;
  let obstacles: { l: number; r: number; t: number }[] = [];
  const measure = () => {
    const s = section.getBoundingClientRect();
    obstacles = Array.from(section.querySelectorAll<HTMLElement>('[data-paint-avoid]'))
      .filter((el) => el.offsetParent !== null)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - s.left - C.pad, r: r.right - s.left + C.pad, t: r.top - s.top - C.pad };
      });
    drips.forEach((d) => {
      d.maxLen = maxLenAt(d.x, d.w0);
      if (d.len > d.maxLen) d.len = d.target = Math.max(0, d.maxLen);
      if (d.target > d.maxLen) d.target = d.maxLen;
    });
  };
  const resize = () => {
    W = section.clientWidth; H = section.clientHeight;
    canvas.width = Math.round(W * scale); canvas.height = Math.round(H * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    measure();
  };
  const floorY = () => H - C.poolMax * 0.55;
  const maxLenAt = (x: number, w: number) => {
    let m = floorY();
    for (const o of obstacles) if (x + w * 1.4 > o.l && x - w * 1.4 < o.r) m = Math.min(m, o.t - w * 1.4 - 6);
    return m;
  };

  // ---------- simulation ----------
  const drips: Drip[] = [];
  const drops: Drop[] = [];
  const ripples: Ripple[] = [];
  let combo = 0, comboT = 0, palMix = 1; // palette crossfade 0..1 towards next combo
  let surge = 0, pool = 0, fill = 0, fillS = 0, scrollV = 0, time = 0, spawnT = 0, pending: number[] = [];
  const light = { x: -0.1, y: -0.4, tx: -0.1, ty: -0.4 }; // fractions of W/H, or absolute when pointer
  let pointer: { x: number; y: number } | null = null;

  const pickColour = (): RGB => COMBOS[combo][Math.floor(Math.random() * 3)];

  const spawn = (xHint?: number) => {
    if (drips.length >= C.D) return false;
    const minLen = C.band + 22;
    let best: { x: number; w: number; m: number } | null = null;
    const tries = xHint !== undefined ? 1 : 18;
    const cands: { x: number; w: number; m: number }[] = [];
    for (let i = 0; i < tries; i++) {
      const w = rand(C.wMin, C.wMax) * (xHint !== undefined ? 1.15 : 1);
      const x = xHint !== undefined ? xHint : rand(lite ? 2 : w, W - (lite ? 2 : w));
      if (xHint === undefined && drips.some((d) => Math.abs(d.x - x) < (d.w0 + w) * 2.4)) continue;
      const m = maxLenAt(x, w);
      if (m < minLen) continue;
      cands.push({ x, w, m });
    }
    if (!cands.length) return false;
    best = Math.random() < 0.8 ? cands.reduce((a, b) => (b.m > a.m ? b : a)) : cands[Math.floor(Math.random() * cands.length)];
    const free = best.m >= floorY() - 1;
    drips.push({
      x: best.x, len: 0, w: best.w, w0: best.w, seed: rand(0, 6.28), amp: rand(0.5, 2.6) * (best.w / 10),
      rgb: pickColour(), maxLen: best.m, free,
      target: free ? best.m * rand(0.35, 0.75) : Math.max(minLen, best.m * rand(0.55, 1)),
      rate: rand(0.6, 1.4), state: 'grow', timer: 0, rush: xHint !== undefined ? 2.2 : 0, dropT: rand(1, 4), v: 0, freq: rand(0.6, 1.6),
    });
    return true;
  };

  const step = (dt: number) => {
    time += dt;
    // pour-in progress, tied to how far the section has entered the viewport (never goes back)
    const top = section.getBoundingClientRect().top;
    fill = Math.max(fill, clamp((innerHeight - top) / (innerHeight * 0.55), 0, 1));
    fillS += (fill - fillS) * Math.min(1, dt * 2.5);
    scrollV *= Math.exp(-dt * 2.5);
    surge += (Math.min(scrollV / 45, C.band * 0.45) - surge) * Math.min(1, dt * 3);
    const boost = 1 + Math.min(scrollV / 260, 5);

    comboT += dt;
    if (comboT > 18) { comboT = 0; combo = (combo + 1) % COMBOS.length; palMix = 0; }
    palMix = Math.min(1, palMix + dt / 5);

    const poolBase = C.poolMax * 0.45 * fillS;
    pool = Math.max(poolBase, pool - dt * 0.6);

    // spawning
    if (fillS > 0.12) {
      spawnT -= dt;
      if (pending.length && spawn(pending[0])) pending.shift();
      if (spawnT <= 0 && drips.length < C.D) { spawn(); spawnT = rand(0.35, 1.2) / boost; }
    }

    for (let i = drips.length - 1; i >= 0; i--) {
      const d = drips[i];
      d.rush = Math.max(0, d.rush - dt);
      let feed = 1;
      if (pointer && Math.abs(pointer.x - d.x) < 60 && pointer.y < d.len + 140) feed = 3.2;
      const rush = d.rush > 0 ? 4 : 1;
      if (d.state === 'grow') {
        // paint has weight: it accelerates, surges a little, and brakes near where it will stop
        const pulse = Math.max(0.2, 0.62 + 0.38 * Math.sin(time * d.freq * 2.2 + d.seed));
        const accel = (C.speed * 3.6 + d.w0 * 4) * d.rate * boost * feed * rush * pulse;
        d.v += (accel - 1.15 * d.v) * dt;
        const left = d.target - d.len;
        if (left < 60) d.v = Math.min(d.v, left * 2.4 + 5);
        d.v = Math.min(d.v, 320);
        d.len += d.v * Math.min(1, fillS * 2) * dt;
        if (d.len >= d.target - 0.5) {
          d.len = d.target;
          if (d.free && d.target < floorY() - 4) {
            if (drops.length < C.P) {
              drops.push({ x: d.x + d.amp * Math.sin(d.len * 0.016 + d.seed), y: d.len, r: d.w0 * rand(0.85, 1.15), vx: 0, vy: 60, rgb: d.rgb });
              d.len *= rand(0.5, 0.72); d.v *= 0.25;
              d.target = Math.min(floorY(), d.target + d.maxLen * rand(0.12, 0.3));
            }
          } else if (d.free) { d.state = 'merged'; d.timer = rand(8, 14); }
          else { d.state = 'hold'; d.timer = rand(12, 22); }
        }
      } else if (d.state === 'hold' || d.state === 'merged') {
        d.timer -= dt * (pending.length ? 6 : 1);
        d.w = d.w0 * (1 + 0.05 * Math.sin(time * 1.6 + d.seed));
        if (d.state === 'merged') d.len = floorY();
        else {
          // a held drip keeps swelling and lets a drop go every few seconds (faster while scrolling)
          if (d.len < d.target) d.len = Math.min(d.target, d.len + C.speed * 0.5 * boost * dt);
          d.dropT -= dt * boost;
          if (d.dropT <= 0 && d.len >= d.target - 1 && drops.length < C.P) {
            drops.push({ x: d.x + d.amp * Math.sin(d.len * 0.016 + d.seed), y: d.len, r: d.w0 * rand(0.7, 0.95), vx: 0, vy: 50, rgb: d.rgb });
            d.len -= d.w0 * 1.1;
            d.dropT = rand(2.5, 6);
          }
        }
        if (d.timer <= 0) d.state = 'drain';
      } else {
        d.w -= d.w0 * dt / 2.6;
        if (d.w < 0.6) { drips.splice(i, 1); spawnT = Math.min(spawnT, rand(0.4, 1.6)); }
      }
    }

    const g = lite ? 1700 : 1900;
    for (let i = drops.length - 1; i >= 0; i--) {
      const p = drops[i];
      p.vy += g * dt; p.y += p.vy * dt; p.x += p.vx * dt;
      if (p.vy > 0 && p.y + p.r * 0.3 >= H - pool) {
        if (ripples.length >= C.R) ripples.shift();
        ripples.push({ x: p.x, age: 0, amp: p.r * (p.splash ? 0.6 : 1.2) });
        pool = Math.min(C.poolMax, pool + p.r * (p.splash ? 0.03 : 0.12));
        drops.splice(i, 1);
        // a real drop throws a couple of tiny droplets back up out of the pool
        if (!p.splash) {
          const n = lite ? 2 : 3;
          for (let k = 0; k < n && drops.length < C.P; k++) {
            drops.push({ x: p.x, y: H - pool - 2, r: Math.max(1.6, p.r * rand(0.22, 0.38)), vx: rand(-150, 150), vy: rand(-420, -230), rgb: p.rgb, splash: true });
          }
        }
      }
    }
    for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].age += dt; if (ripples[i].age > 3.2) ripples.splice(i, 1); }

    // light: follows the pointer on desktop, slow drift otherwise
    if (pointer) { light.tx = pointer.x; light.ty = pointer.y - 60; }
    else { light.tx = W * (0.15 + 0.1 * Math.sin(time * 0.15)); light.ty = -H * 0.35; }
    light.x += (light.tx - light.x) * Math.min(1, dt * 4);
    light.y += (light.ty - light.y) * Math.min(1, dt * 4);
  };

  const render = () => {
    fD.fill(0); fDA.fill(0); fP.fill(0); fPC.fill(0); fR.fill(0);
    drips.forEach((d, i) => {
      fD.set([d.x, d.len, Math.max(d.w, 0), d.seed], i * 4);
      fDA.set([d.rgb[0], d.rgb[1], d.rgb[2], d.amp], i * 4);
    });
    drops.forEach((p, i) => {
      fP.set([p.x, p.y, p.r, p.splash ? 0.15 : Math.min(Math.max(p.vy, 0) / 1100, 0.9)], i * 4);
      fPC.set([p.rgb[0], p.rgb[1], p.rgb[2], 1], i * 4);
    });
    ripples.forEach((r, i) => fR.set([r.x, r.age, r.amp, 0], i * 4));
    const prev = COMBOS[(combo + COMBOS.length - 1) % COMBOS.length], cur = COMBOS[combo];

    gl.uniform2f(u.res, W, H); gl.uniform1f(u.scale, canvas.width / W); gl.uniform1f(u.time, time);
    gl.uniform1f(u.band, C.band * (1 - Math.pow(1 - fillS, 3)) + surge); gl.uniform1f(u.pool, pool);
    gl.uniform3f(u.light, light.x, light.y, 0);
    gl.uniform3fv(u.c0, cur[0]); gl.uniform3fv(u.c1, cur[1]); gl.uniform3fv(u.c2, cur[2]);
    gl.uniform3fv(u.q0, prev[0]); gl.uniform3fv(u.q1, prev[1]); gl.uniform3fv(u.q2, prev[2]);
    gl.uniform1f(u.mix, palMix);
    gl.uniform4fv(u.d, fD); gl.uniform4fv(u.da, fDA); gl.uniform4fv(u.p, fP); gl.uniform4fv(u.pc, fPC); gl.uniform4fv(u.r, fR);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  new ResizeObserver(() => { resize(); if (reduce) render(); }).observe(section);
  addEventListener('load', measure);
  document.fonts?.ready.then(measure);

  if (reduce) {
    fill = fillS = 1;
    for (let i = 0; i < 400; i++) step(0.05);
    render();
    return;
  }

  // ---------- input ----------
  let lastY = scrollY, lastT = performance.now();
  addEventListener('scroll', () => {
    const now = performance.now(), dtS = Math.max(16, now - lastT);
    scrollV = Math.max(scrollV, (Math.abs(scrollY - lastY) / dtS) * 1000);
    lastY = scrollY; lastT = now;
  }, { passive: true });
  if (!lite) {
    section.addEventListener('pointermove', (e) => {
      const s = section.getBoundingClientRect(); pointer = { x: e.clientX - s.left, y: e.clientY - s.top };
    });
    section.addEventListener('pointerleave', () => { pointer = null; });
  }
  section.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('a, button, input, textarea, select, label, .enquiry__panel')) return;
    const s = section.getBoundingClientRect();
    const x = e.clientX - s.left;
    if (drips.length >= C.D) {
      const old = drips.find((d) => d.state === 'hold' || d.state === 'merged') || drips[0];
      old.state = 'drain'; old.w0 *= 1.6;
    }
    pending.push(x);
    scrollV = Math.max(scrollV, 600);
  });

  // ---------- loop ----------
  let running = false, raf = 0, last = 0, acc = 0, slow = 0, measureT = 0;
  const frameMin = 1000 / C.fps - 2;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const el = now - last;
    if (el < frameMin) return;
    last = now;
    const dt = Math.min(el / 1000, 0.05);
    measureT -= dt;
    if (measureT <= 0) { measure(); measureT = 1; }
    step(dt);
    const t0 = performance.now();
    render();
    // adaptive resolution: if frames are slow, render fewer pixels
    acc += el; slow += el > (lite ? 45 : 26) ? 1 : 0;
    if (acc > 2000) {
      if (slow > (lite ? 20 : 40) && scale > 0.45) { scale *= 0.8; resize(); }
      acc = 0; slow = 0;
    }
    void t0;
  };
  const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  let inView = false;
  new IntersectionObserver(([en]) => {
    inView = en.isIntersecting;
    inView && !document.hidden ? start() : stop();
  }, { rootMargin: '120px 0px' }).observe(section);
  document.addEventListener('visibilitychange', () => (document.hidden || !inView ? stop() : start()));
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); canvas.style.display = 'none'; });
}
