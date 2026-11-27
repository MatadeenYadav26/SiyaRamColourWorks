/**
 * Desktop Services finale, rendered in WebGL so it looks real:
 * - thick, glossy blue paint (with a gold fold on its crest) rising as a lit height field
 * - a 3D paint roller (fibre drum soaked in paint, chrome frame, gold plastic handle)
 *   that pushes a ridge of wet paint ahead of it and leaves the wall clean behind
 * The page's GSAP timeline drives the state; this file only draws it.
 */
export type FinaleState = { level: number; wipeX: number; rollerAlpha: number };

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uScale; uniform float uTime;
uniform float uSurf;   // paint surface (css px from top)
uniform float uAmp;    // wave height
uniform float uCx;     // roller drum centre x (css px), huge = no roller
uniform float uRA;     // roller alpha
uniform vec2 uView;    // css viewport size

const float R = 50.;
const vec3 L = vec3(-0.45, -0.62, 0.64);

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.55; for(int i=0;i<3;i++){ v+=a*noise(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return v; }

float surfB(float x){ return uSurf + uAmp*(sin(x*.0062+uTime*.9)*.55 + sin(x*.0141-uTime*1.3+1.3)*.3 + sin(x*.031+uTime*1.9)*.15); }
float surfG(float x){ return surfB(x) - uAmp*.55 - 10. + uAmp*.35*sin(x*.009-uTime*1.1+2.); }
float wipeX(float y){ return uCx - R*.62 + 3.*sin(y*.045+uTime*2.) + 2.*sin(y*.13); }

// thickness profile: rounded meniscus at every edge of the paint
float edgeH(float t){ return 9.*(1.-exp(-max(t,0.)/9.)); }

// paint height (px): edges + slow flowing body + ridge pushed ahead of the roller
float paintH(vec2 p){
  float tB = p.y - surfB(p.x);
  float tG = p.y - surfG(p.x);
  float tw = wipeX(p.y) - p.x;
  float w1 = sin(dot(p, vec2(.0021, .0013)) + uTime*.22) * 2.2;
  float w2 = sin(dot(p, vec2(-.0012, .0024)) - uTime*.17 + 1.3) * 2.;
  float body = 3.2*sin(dot(p, vec2(.0031, .0019)) + w2 + uTime*.35)
             + 2.3*sin(dot(p, vec2(-.0024, .0036)) + w1 - uTime*.28 + 2.1)
             + 1.1*sin(dot(p, vec2(.0058, -.0041)) + w1*.7 + w2*.5 + uTime*.5);
  float h = edgeH(min(max(tG, tB), tw)) + edgeH(min(tB, tw))*.6 + body;
  float rg = tw - 13.; h += 7.*exp(-rg*rg/70.);
  return h;
}

// segment distance
float seg(vec2 p, vec2 a, vec2 b, out vec2 c){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); c=a+ba*h; return length(p-c); }

vec3 envRefl(vec3 r){ float t = clamp(-r.y*.5+.5, 0., 1.); return mix(vec3(.16,.15,.14), vec3(1.,.98,.94), smoothstep(.35,.95,t)) + vec3(.25)*smoothstep(.8,1.,r.x*.5+.5); }

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec3 V = vec3(0.,0.,1.);
  vec4 outc = vec4(0.);

  // ---------- paint ----------
  float tB = p.y - surfB(p.x), tG = p.y - surfG(p.x), tw = wipeX(p.y) - p.x;
  float inside = min(max(tB, tG), tw);
  if (inside > -1.5) {
    float e = 1.4;
    float h0 = paintH(p), hx = paintH(p+vec2(e,0.)), hy = paintH(p+vec2(0.,e));
    vec3 n = normalize(vec3(-(hx-h0)/e*1.15, -(hy-h0)/e*1.15, 1.));
    bool gold = tB < 0.;
    float var = fbm(p*.0021 + uTime*.025);
    vec3 base = gold ? mix(vec3(.80,.53,.10), vec3(.95,.70,.22), var)
                     : mix(vec3(.10,.19,.52), vec3(.13,.24,.60), var);
    // a thin darker line where the gold folds under the blue
    if (!gold) base *= mix(.72, 1., smoothstep(0., 7., tB));
    float dif = clamp(dot(n, normalize(L*vec3(1.,1.,1.))), 0., 1.);
    vec3 r = reflect(-normalize(L), n);
    float sp = pow(max(r.z,0.), 160.)*1.4 + pow(max(r.z,0.), 22.)*.22;
    float fres = pow(1.-n.z, 2.)*1.6;
    // glossy reflections of a soft window light, bent by the flowing surface
    vec2 rv = n.xy*2.;
    float win = smoothstep(.022, .0, abs(rv.x + .025)) * smoothstep(.09, .01, abs(rv.y + .03));
    float win2 = smoothstep(.014, .0, abs(rv.x - .035)) * smoothstep(.07, .01, abs(rv.y + .01));
    float sky = smoothstep(.55, -.1, p.y / uView.y);   // the top of the paint reflects the bright room
    vec3 col = base*(.55 + .55*dif) * mix(.86, 1.08, sky)
             + vec3(1.,.98,.95)*(sp + win*.06 + win2*.03) + envRefl(reflect(-V,n))*fres*.5;
    // soft contact shade at the clean edge
    col *= mix(.8, 1., smoothstep(0., 22., tw));
    float a = smoothstep(-1.2, .6, inside);
    outc = vec4(col*a, a);
  }

  // ---------- roller ----------
  if (uRA > .001 && uCx < uView.x + 500.) {
    float y0 = uView.y*.07, y1 = uView.y*.93;
    // geometry: drum, end caps, chrome rod, handle
    vec2 A = vec2(uCx, y1+8.), B = vec2(uCx, y1+30.), C = vec2(uCx+56., y1+30.), D = vec2(uCx+150., y1-70.), E = vec2(uCx+300., y1-200.);
    vec2 c1, c2, c3, c4, ch;
    float rod = min(min(seg(p,A,B,c1), seg(p,B,C,c2)), seg(p,C,D,c3));
    float hd = seg(p, D, E, ch) - 17.;
    vec2 q = p - vec2(uCx, clamp(p.y, y0, y1));
    float drum = length(vec2(q.x, (p.y<y0? (p.y-y0)*3.2 : p.y>y1? (p.y-y1)*3.2 : 0.))) - R;

    // cast shadow on the wall / paint (down-right)
    vec2 so = vec2(16., 22.);
    vec2 ps = p - so, cc;
    float sd = min(min(length(vec2(ps.x-uCx, ps.y<y0? (ps.y-y0)*3.2 : ps.y>y1? (ps.y-y1)*3.2 : 0.)) - R,
                       min(min(seg(ps,A,B,cc), seg(ps,B,C,cc)), seg(ps,C,D,cc)) - 6.), seg(ps,D,E,cc) - 17.);
    float sh = (1. - smoothstep(-6., 34., sd)) * .34 * uRA;
    outc = vec4(outc.rgb*(1.-sh), outc.a + (1.-outc.a)*sh);

    vec4 obj = vec4(0.);
    // rod (chrome)
    float rd = rod - 6.;
    if (rd < 1.) {
      vec2 cp = (rod == seg(p,A,B,c1)) ? c1 : (rod == seg(p,B,C,c2) ? c2 : c3);
      vec2 d2 = (p - cp)/6.; float k = clamp(length(d2), 0., 1.);
      vec3 n = normalize(vec3(d2, sqrt(max(1.-k*k, 0.))));
      vec3 col = envRefl(reflect(-V, n))*.85 + vec3(1.)*pow(max(dot(reflect(-normalize(L),n),V),0.),60.);
      float a = smoothstep(1., -1., rd);
      obj = vec4(col*a, a);
    }
    // handle (gold plastic with grip rings)
    if (hd < 1.) {
      vec2 d2 = (p - ch)/17.; float k = clamp(length(d2), 0., 1.);
      vec3 n = normalize(vec3(d2, sqrt(max(1.-k*k, 0.))));
      float along = dot(p - D, normalize(E - D));
      float ring = smoothstep(.75, 1., abs(sin(along*.22))) * step(60., along) * step(along, 150.);
      vec3 base = mix(vec3(.88,.62,.13), vec3(.70,.45,.08), ring);
      if (along < 22.) base = vec3(.62,.60,.57); // metal ferrule
      float dif = clamp(dot(n, normalize(L)), 0., 1.);
      float sp = pow(max(dot(reflect(-normalize(L),n),V),0.), 40.);
      vec3 col = base*(.35+.8*dif) + vec3(1.)*sp*.7;
      float a = smoothstep(1., -1., hd);
      obj = vec4(col*a, a) + obj*(1.-a);
    }
    // drum: paint-soaked fibre cover on a cylinder
    if (drum < 1.) {
      float u = clamp(q.x / R, -1., 1.);
      float capT = p.y<y0 ? (y0-p.y)/ (R/3.2) : p.y>y1 ? (p.y-y1)/(R/3.2) : 0.;
      float z = sqrt(max(1.-u*u, 0.));
      vec3 n = normalize(vec3(u, (p.y<y0? -capT : p.y>y1? capT : 0.)*.9, z));
      float ang = asin(u) - uCx / R;                      // it turns as it rolls
      float fib = noise(vec2(ang*38., p.y*.35)) * .6 + noise(vec2(ang*90., p.y*1.3)) * .4;
      float clump = fbm(vec2(ang*6., p.y*.03));
      vec3 base = mix(vec3(.05,.11,.33), vec3(.17,.30,.70), fib*.75 + clump*.35);
      float dif = clamp(dot(n, normalize(L)), 0., 1.);
      vec3 rr = reflect(-normalize(L), n);
      float wet = pow(max(rr.z,0.), 30.) * (.35 + .65*smoothstep(.45,.8,fib));
      vec3 col = base*(.25 + .95*dif) + vec3(.9,.94,1.)*wet*.55;
      col *= mix(.45, 1., z);                               // occlusion toward the silhouette
      // end caps: grey plastic
      if (p.y < y0 + 3. || p.y > y1 - 3.) col = vec3(.56,.54,.51)*(.45+.7*dif) + vec3(.5)*pow(max(rr.z,0.),24.);
      float a = smoothstep(1., -1., drum);
      obj = vec4(col*a, a) + obj*(1.-a);
    }
    obj *= uRA;
    outc = obj + outc*(1.-obj.a);
  }
  gl_FragColor = outc;
}`;

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';

export function initPaintFinale(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'high-performance' }) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U('uRes'), scale: U('uScale'), time: U('uTime'), surf: U('uSurf'), amp: U('uAmp'), cx: U('uCx'), ra: U('uRA'), view: U('uView') };

  let scale = Math.min(window.devicePixelRatio || 1, 1.25);
  let state: FinaleState = { level: 0, wipeX: 1e5, rollerAlpha: 0 };
  let raf = 0, running = false, t0 = performance.now(), slow = 0, last = 0;

  const resize = () => {
    canvas.width = Math.round(innerWidth * scale); canvas.height = Math.round(innerHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  const visible = () => (state.level > 0.001 && state.wipeX > -60) || state.rollerAlpha > 0.001;
  const draw = (now: number) => {
    raf = 0;
    if (!running) return;
    // adaptive resolution: keep it smooth on slower GPUs
    if (last) { const dt = now - last; slow = dt > 22 ? slow + 1 : Math.max(0, slow - 1); if (slow > 12 && scale > 0.6) { scale = Math.max(0.6, scale - 0.15); resize(); slow = 0; } }
    last = now;
    const H = innerHeight, W = innerWidth;
    const lv = state.level;
    const surf = (H + 140) * (1 - lv) - 140 * lv;
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.scale, scale);
    gl.uniform2f(u.view, W, H);
    gl.uniform1f(u.time, (now - t0) / 1000);
    gl.uniform1f(u.surf, surf);
    gl.uniform1f(u.amp, 34 + 26 * Math.sin(lv * Math.PI));
    gl.uniform1f(u.cx, state.wipeX);
    gl.uniform1f(u.ra, state.rollerAlpha);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(draw);
  };

  return {
    set(s: FinaleState) {
      state = s;
      const v = visible();
      canvas.style.visibility = v ? 'visible' : 'hidden';
      if (v && !running) { running = true; last = 0; raf = requestAnimationFrame(draw); }
      if (!v && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; gl.clear(gl.COLOR_BUFFER_BIT); }
    },
  };
}
