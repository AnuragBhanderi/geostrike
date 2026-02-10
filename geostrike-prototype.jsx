import { useState, useEffect, useRef, useCallback } from "react";

const CONFLICTS = [
  {id:"russia-ukraine",tag:"war",sev:"critical",type:"Full-Scale Invasion",a:{n:"Russia",f:"🇷🇺",lat:55.75,lng:37.62},t:{n:"Ukraine",f:"🇺🇦",lat:48.38,lng:31.17},desc:"Full-scale military invasion and ongoing territorial war across eastern and southern Ukraine — the largest armed conflict in Europe since WWII.",stats:{cas:"500,000+",disp:"6.2M",sev:95},allies:[{n:"NATO",f:"🏳️",r:"ally"},{n:"Belarus",f:"🇧🇾",r:"agg"}],tl:[{d:"Feb 2022",t:"Russia launches full-scale invasion"},{d:"Apr 2022",t:"Russian withdrawal from Kyiv"},{d:"Sep 2022",t:"Ukraine recaptures Kharkiv"},{d:"2024–25",t:"Attritional warfare in Donbas"}]},
  {id:"israel-gaza",tag:"war",sev:"critical",type:"Military Offensive",a:{n:"Israel",f:"🇮🇱",lat:31.77,lng:35.22},t:{n:"Palestine (Gaza)",f:"🇵🇸",lat:31.35,lng:34.31},desc:"Devastating military offensive in Gaza following October 7 attacks, creating one of the worst humanitarian crises in modern history.",stats:{cas:"45,000+",disp:"1.9M",sev:93},allies:[{n:"Iran Axis",f:"🇮🇷",r:"ally"},{n:"United States",f:"🇺🇸",r:"ally"}],tl:[{d:"Oct 7 2023",t:"Hamas surprise attack"},{d:"Oct 2023",t:"Israel declares war"},{d:"2024",t:"Rafah offensive"},{d:"2025",t:"Ceasefire negotiations"}]},
  {id:"sudan",tag:"war",sev:"critical",type:"Civil War",a:{n:"RSF",f:"🇸🇩",lat:13.19,lng:30.22},t:{n:"Sudan (SAF)",f:"🇸🇩",lat:15.59,lng:32.53},desc:"Brutal civil war between Sudanese Armed Forces and RSF causing massive famine and the world's largest displacement crisis.",stats:{cas:"15,000+",disp:"10.7M",sev:90},allies:[{n:"Wagner",f:"🇷🇺",r:"agg"}],tl:[{d:"Apr 2023",t:"SAF vs RSF in Khartoum"},{d:"2024",t:"RSF takes Darfur"},{d:"2025",t:"10M+ displaced"}]},
  {id:"china-taiwan",tag:"tension",sev:"high",type:"Military Standoff",a:{n:"China",f:"🇨🇳",lat:26.07,lng:119.30},t:{n:"Taiwan",f:"🇹🇼",lat:23.70,lng:120.96},desc:"Escalating military buildup and grey-zone operations with frequent air and naval incursions.",stats:{cas:"N/A",disp:"N/A",sev:72},allies:[{n:"United States",f:"🇺🇸",r:"ally"},{n:"Japan",f:"🇯🇵",r:"ally"}],tl:[{d:"Aug 2022",t:"PLA exercises after Pelosi visit"},{d:"2023–24",t:"Record ADIZ incursions"},{d:"2025",t:"Grey-zone pressure continues"}]},
  {id:"korea",tag:"tension",sev:"high",type:"Nuclear Standoff",a:{n:"North Korea",f:"🇰🇵",lat:39.04,lng:125.76},t:{n:"South Korea",f:"🇰🇷",lat:35.91,lng:127.77},desc:"ICBM tests, constitutional changes declaring South Korea as enemy state, and border provocations.",stats:{cas:"N/A",disp:"N/A",sev:65},allies:[{n:"United States",f:"🇺🇸",r:"ally"}],tl:[{d:"2023",t:"Record missile tests"},{d:"2024",t:"ROK declared hostile"},{d:"2025",t:"Provocations escalate"}]},
  {id:"myanmar",tag:"war",sev:"high",type:"Civil War",a:{n:"Myanmar Junta",f:"🇲🇲",lat:19.76,lng:96.07},t:{n:"Resistance",f:"🇲🇲",lat:21.97,lng:96.08},desc:"Multi-front civil war as ethnic armies battle the junta which has lost control of large territories.",stats:{cas:"50,000+",disp:"2.7M",sev:82},allies:[],tl:[{d:"Feb 2021",t:"Military coup"},{d:"Oct 2023",t:"Operation 1027"},{d:"2025",t:"Resistance advances"}]},
  {id:"india-pakistan",tag:"tension",sev:"medium",type:"Border Conflict",a:{n:"India",f:"🇮🇳",lat:28.61,lng:77.21},t:{n:"Pakistan",f:"🇵🇰",lat:33.69,lng:73.04},desc:"Military standoff along Line of Control in Kashmir with periodic escalations.",stats:{cas:"Classified",disp:"N/A",sev:55},allies:[],tl:[{d:"2019",t:"Balakot airstrikes"},{d:"2025",t:"Operation Sindoor"}]},
  {id:"ethiopia",tag:"war",sev:"high",type:"Internal Conflict",a:{n:"Fano / OLA",f:"🇪🇹",lat:9.03,lng:38.75},t:{n:"Ethiopia Fed.",f:"🇪🇹",lat:7.50,lng:39.50},desc:"Post-Tigray instability with Amhara Fano insurgency threatening federal control.",stats:{cas:"600,000+",disp:"3.5M",sev:78},allies:[],tl:[{d:"Nov 2022",t:"Pretoria peace deal"},{d:"2023",t:"Fano insurgency"},{d:"2025",t:"Multi-front conflicts"}]},
  {id:"iran-israel",tag:"cyber",sev:"high",type:"Shadow War",a:{n:"Iran",f:"🇮🇷",lat:35.69,lng:51.39},t:{n:"Israel",f:"🇮🇱",lat:32.09,lng:34.78},desc:"Proxy conflicts, direct missile exchanges, and cyber attacks spanning the Middle East.",stats:{cas:"Classified",disp:"N/A",sev:70},allies:[{n:"Hezbollah",f:"🇱🇧",r:"ally"},{n:"Houthis",f:"🇾🇪",r:"ally"}],tl:[{d:"Apr 2024",t:"Iran launches 300+ missiles"},{d:"Oct 2024",t:"Israel strikes Iran"},{d:"2025",t:"Proxy warfare continues"}]},
  {id:"south-china-sea",tag:"tension",sev:"high",type:"Maritime Dispute",a:{n:"China",f:"🇨🇳",lat:16.00,lng:112.00},t:{n:"Philippines",f:"🇵🇭",lat:14.60,lng:120.98},desc:"Maritime confrontations between Chinese coast guard and Philippine vessels.",stats:{cas:"N/A",disp:"N/A",sev:60},allies:[{n:"United States",f:"🇺🇸",r:"ally"}],tl:[{d:"2023",t:"Water cannon incidents"},{d:"2024",t:"Vessel ramming"},{d:"2025",t:"Grey-zone escalation"}]},
  {id:"congo",tag:"war",sev:"critical",type:"Rebel Offensive",a:{n:"M23 / Rwanda",f:"🇷🇼",lat:-1.94,lng:29.87},t:{n:"DR Congo",f:"🇨🇩",lat:-1.68,lng:29.23},desc:"Rwanda-backed M23 rebels capture Goma, causing the world's largest internal displacement crisis.",stats:{cas:"10,000+",disp:"6.9M",sev:87},allies:[{n:"Uganda",f:"🇺🇬",r:"agg"}],tl:[{d:"2022",t:"M23 resurgence"},{d:"2024",t:"Advance on Goma"},{d:"Jan 2025",t:"Goma captured"}]},
  {id:"yemen",tag:"cyber",sev:"high",type:"Proxy War",a:{n:"Houthis",f:"🇾🇪",lat:15.37,lng:44.19},t:{n:"Red Sea Shipping",f:"🚢",lat:12.80,lng:43.15},desc:"Houthi attacks on commercial shipping disrupt global trade routes.",stats:{cas:"150,000+",disp:"4.5M",sev:75},allies:[{n:"Iran",f:"🇮🇷",r:"ally"}],tl:[{d:"Nov 2023",t:"Red Sea attacks begin"},{d:"Jan 2024",t:"US/UK strikes"},{d:"2025",t:"Shipping rerouted"}]}
];

const tagColor = (tag) => tag === "war" ? "#ff2d55" : tag === "tension" ? "#ffae00" : "#7b61ff";
const tagName = (tag) => tag === "war" ? "red" : tag === "tension" ? "amber" : "purple";
const sevColor = (sev) => sev > 80 ? "#ff2d55" : sev > 60 ? "#ffae00" : "#00e5ff";

function arcPoints(p1, p2, n = 50) {
  const pts = [];
  const mLat = (p1[0]+p2[0])/2, mLng = (p1[1]+p2[1])/2;
  const d = Math.sqrt((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2);
  const dx = p2[1]-p1[1], dy = -(p2[0]-p1[0]);
  const len = Math.sqrt(dx*dx+dy*dy) || 1;
  const off = Math.min(d*0.25, 15);
  const cLat = mLat + dy/len*off*0.3, cLng = mLng + dx/len*off;
  for (let i = 0; i <= n; i++) {
    const t = i/n;
    pts.push([(1-t)*(1-t)*p1[0]+2*(1-t)*t*cLat+t*t*p2[0], (1-t)*(1-t)*p1[1]+2*(1-t)*t*cLng+t*t*p2[1]]);
  }
  return pts;
}

// Sidebar conflict item
function ConflictItem({ c, active, onClick }) {
  const col = tagColor(c.tag);
  return (
    <div onClick={onClick} style={{
      display:"flex",gap:11,padding:"13px 18px",borderBottom:"1px solid rgba(255,255,255,.06)",
      cursor:"pointer",borderLeft: active ? "2px solid #00e5ff" : "2px solid transparent",
      background: active ? "rgba(0,229,255,.03)" : "transparent",
      transition:"all .2s"
    }}>
      <div style={{
        width:6,height:6,borderRadius:"50%",marginTop:6,flexShrink:0,
        background: c.sev==="critical"?"#ff2d55":c.sev==="high"?"#ffae00":"#7b61ff",
        boxShadow: c.sev==="critical"?"0 0 6px rgba(255,45,85,.35)":c.sev==="high"?"0 0 6px rgba(255,174,0,.3)":"none"
      }}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:12.5,fontWeight:600,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {c.a.f} {c.a.n} <span style={{color:"#ff2d55",fontSize:10,margin:"0 4px"}}>→</span> {c.t.f} {c.t.n}
        </div>
        <div style={{fontSize:9.5,color:"#555568",textTransform:"uppercase",letterSpacing:1,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>{c.type}</div>
        <div style={{fontSize:11,color:"#8888a0",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{c.desc}</div>
        <div style={{display:"flex",gap:5,marginTop:6}}>
          <span style={{fontSize:8,padding:"2px 7px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:.5,textTransform:"uppercase",background:`${col}1e`,color:col}}>{c.tag}</span>
          <span style={{fontSize:8,padding:"2px 7px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",background:"rgba(255,255,255,.04)",color:"#555568",textTransform:"uppercase"}}>{c.sev}</span>
        </div>
      </div>
    </div>
  );
}

// Detail panel content
function DetailContent({ c }) {
  const sc = sevColor(c.stats.sev);
  return (
    <div>
      <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <h2 style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:17,fontWeight:700,marginBottom:2,lineHeight:1.4}}>
          {c.a.f} {c.a.n} → {c.t.f} {c.t.n}
        </h2>
        <div style={{fontSize:10,color:"#555568",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,textTransform:"uppercase"}}>{c.type} • {c.sev}</div>
      </div>
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <h3 style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:9.5,fontWeight:600,letterSpacing:2.5,textTransform:"uppercase",color:"#555568",marginBottom:10}}>Overview</h3>
        <p style={{fontSize:12,lineHeight:1.7,color:"#8888a0"}}>{c.desc}</p>
      </div>
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <h3 style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:9.5,fontWeight:600,letterSpacing:2.5,textTransform:"uppercase",color:"#555568",marginBottom:10}}>Key Statistics</h3>
        {[["Casualties",c.stats.cas,"#ff2d55"],["Displaced",c.stats.disp,"#ffae00"],["Severity",c.stats.sev+"/100","#00e5ff"]].map(([l,v,cl])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
            <span style={{fontSize:11.5,color:"#8888a0"}}>{l}</span>
            <span style={{fontSize:12,fontWeight:500,fontFamily:"'JetBrains Mono',monospace",color:cl}}>{v}</span>
          </div>
        ))}
        <div style={{height:4,background:"#13131f",borderRadius:2,marginTop:6,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:2,width:`${c.stats.sev}%`,background:sc,transition:"width .8s cubic-bezier(.22,1,.36,1)"}}/>
        </div>
      </div>
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <h3 style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:9.5,fontWeight:600,letterSpacing:2.5,textTransform:"uppercase",color:"#555568",marginBottom:10}}>Involved Parties</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {[{...c.a,role:"agg"},{...c.t,role:"def"},...c.allies.map(a=>({n:a.n,f:a.f,role:a.r}))].map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:"#0d0d16",borderRadius:9,border:"1px solid rgba(255,255,255,.06)"}}>
              <span style={{fontSize:16,width:24,textAlign:"center"}}>{p.f}</span>
              <span style={{fontSize:12,fontWeight:500,flex:1}}>{p.n}</span>
              <span style={{
                fontSize:8,textTransform:"uppercase",letterSpacing:1,fontFamily:"'JetBrains Mono',monospace",padding:"2px 7px",borderRadius:4,
                background:p.role==="agg"?"rgba(255,45,85,.12)":p.role==="def"?"rgba(255,174,0,.1)":"rgba(0,229,255,.08)",
                color:p.role==="agg"?"#ff2d55":p.role==="def"?"#ffae00":"#00e5ff"
              }}>{p.role==="agg"?"Aggressor":p.role==="def"?"Target":"Allied"}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 20px"}}>
        <h3 style={{fontFamily:"'Chakra Petch',sans-serif",fontSize:9.5,fontWeight:600,letterSpacing:2.5,textTransform:"uppercase",color:"#555568",marginBottom:10}}>Timeline</h3>
        <div style={{position:"relative",paddingLeft:16}}>
          <div style={{position:"absolute",left:3,top:0,bottom:0,width:1,background:"rgba(255,255,255,.1)"}}/>
          {c.tl.map((ev,i)=>(
            <div key={i} style={{position:"relative",paddingBottom:12}}>
              <div style={{position:"absolute",left:-16,top:4,width:7,height:7,borderRadius:"50%",border:"1.5px solid #ff2d55",background:i===c.tl.length-1?"#ff2d55":"#07070d"}}/>
              <div style={{fontSize:9.5,color:"#555568",fontFamily:"'JetBrains Mono',monospace",marginBottom:1}}>{ev.d}</div>
              <div style={{fontSize:11.5,color:"#8888a0",lineHeight:1.5}}>{ev.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SVG Map with canvas-like rendering
function MapView({ conflicts, activeId, onSelect }) {
  const svgRef = useRef(null);
  const [vb, setVb] = useState({ x: -180, y: -90, w: 360, h: 200 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);
  const animRef = useRef(0);

  // Dash animation
  useEffect(() => {
    let offset = 0;
    const animate = () => {
      offset -= 0.3;
      const paths = document.querySelectorAll(".conflict-arc");
      paths.forEach(p => { p.style.strokeDashoffset = offset + "px"; });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const toSvg = useCallback((lat, lng) => [lng, -lat], []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    setVb(prev => {
      const nw = Math.max(30, Math.min(600, prev.w * scale));
      const nh = Math.max(16, Math.min(340, prev.h * scale));
      return { x: prev.x + (prev.w - nw) * mx, y: prev.y + (prev.h - nh) * my, w: nw, h: nh };
    });
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest(".marker-g")) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.x) * (vb.w / rect.width);
    const dy = (e.clientY - dragStart.current.y) * (vb.h / rect.height);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setVb(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
  }, [dragging, vb]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const flyTo = useCallback((lat, lng) => {
    const [sx, sy] = toSvg(lat, lng);
    setVb(prev => ({ x: sx - prev.w * 0.35, y: sy - prev.h * 0.4, w: Math.min(prev.w, 80), h: Math.min(prev.h, 45) }));
  }, [toSvg]);

  useEffect(() => {
    if (activeId) {
      const c = conflicts.find(x => x.id === activeId);
      if (c) flyTo((c.a.lat + c.t.lat) / 2, (c.a.lng + c.t.lng) / 2);
    }
  }, [activeId, conflicts, flyTo]);

  return (
    <svg
      ref={svgRef}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{ width: "100%", height: "100%", cursor: dragging ? "grabbing" : "grab", background: "#07070d" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <defs>
        <radialGradient id="glow-red"><stop offset="0%" stopColor="#ff2d55" stopOpacity=".3"/><stop offset="100%" stopColor="#ff2d55" stopOpacity="0"/></radialGradient>
        <radialGradient id="glow-amber"><stop offset="0%" stopColor="#ffae00" stopOpacity=".3"/><stop offset="100%" stopColor="#ffae00" stopOpacity="0"/></radialGradient>
        <radialGradient id="glow-purple"><stop offset="0%" stopColor="#7b61ff" stopOpacity=".3"/><stop offset="100%" stopColor="#7b61ff" stopOpacity="0"/></radialGradient>
        <filter id="blur-sm"><feGaussianBlur stdDeviation=".8"/></filter>
      </defs>

      {/* Grid lines */}
      {[-60,-30,0,30,60].map(lat=>(
        <line key={`lat${lat}`} x1={-180} y1={-lat} x2={180} y2={-lat} stroke="rgba(255,255,255,.025)" strokeWidth=".15"/>
      ))}
      {[-120,-60,0,60,120].map(lng=>(
        <line key={`lng${lng}`} x1={lng} y1={-90} x2={lng} y2={90} stroke="rgba(255,255,255,.025)" strokeWidth=".15"/>
      ))}

      {/* Conflict arcs and markers */}
      {conflicts.map(c => {
        const [x1, y1] = toSvg(c.a.lat, c.a.lng);
        const [x2, y2] = toSvg(c.t.lat, c.t.lng);
        const col = tagColor(c.tag);
        const cn = tagName(c.tag);
        const dim = activeId && activeId !== c.id;
        const pts = arcPoints([y1, x1], [y2, x2], 40);
        const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[1]},${p[0]}`).join(" ");
        const mid = pts[Math.floor(pts.length / 2)];

        return (
          <g key={c.id} style={{ opacity: dim ? 0.08 : 1, transition: "opacity .4s" }}>
            {/* Arc line */}
            <path
              className="conflict-arc"
              d={pathD}
              fill="none"
              stroke={col}
              strokeWidth={c.sev === "critical" ? .6 : .4}
              strokeDasharray={c.tag === "war" ? "3 2" : c.tag === "tension" ? "1.5 3" : "1 2"}
              opacity={.6}
            />
            {/* Glow line */}
            <path d={pathD} fill="none" stroke={col} strokeWidth={1.5} opacity={.08} filter="url(#blur-sm)"/>

            {/* Direction dots */}
            {[0.25, 0.5, 0.75].map(frac => {
              const idx = Math.floor(pts.length * frac);
              return <circle key={frac} cx={pts[idx][1]} cy={pts[idx][0]} r={.3} fill={col} opacity={.35}/>;
            })}

            {/* Aggressor marker */}
            <g className="marker-g" style={{ cursor: "pointer" }} onClick={() => onSelect(c.id)}
              onMouseEnter={() => setTooltip({ x: x1, y: y1, n: c.a.n, role: "Aggressor" })}
              onMouseLeave={() => setTooltip(null)}>
              <circle cx={x1} cy={y1} r={3} fill={`url(#glow-${cn})`}>
                <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={x1} cy={y1} r={c.sev === "critical" ? 1.2 : .9} fill={col} opacity={.9}/>
              <circle cx={x1} cy={y1} r={.4} fill="rgba(255,255,255,.5)"/>
            </g>

            {/* Target marker */}
            <g className="marker-g" style={{ cursor: "pointer" }} onClick={() => onSelect(c.id)}
              onMouseEnter={() => setTooltip({ x: x2, y: y2, n: c.t.n, role: "Target" })}
              onMouseLeave={() => setTooltip(null)}>
              <circle cx={x2} cy={y2} r={2.5} fill={cn === "red" ? "url(#glow-amber)" : `url(#glow-${cn})`}>
                <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={x2} cy={y2} r={c.sev === "critical" ? 1 : .7} fill={cn === "red" ? "#ffae00" : col} opacity={.9}/>
              <circle cx={x2} cy={y2} r={.35} fill="rgba(255,255,255,.4)"/>
            </g>

            {/* Label at midpoint */}
            {vb.w < 120 && (
              <text x={mid[1]} y={mid[0] - 1.5} textAnchor="middle" fill={col} fontSize={1.8} fontFamily="'Chakra Petch',sans-serif" opacity={.7}>
                {c.a.n}→{c.t.n}
              </text>
            )}
          </g>
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <g>
          <rect x={tooltip.x + 1} y={tooltip.y - 4} width={18} height={4} rx={.5} fill="rgba(10,10,18,.92)" stroke="rgba(255,255,255,.1)" strokeWidth={.1}/>
          <text x={tooltip.x + 2} y={tooltip.y - 1.8} fill="#e4e4f0" fontSize={1.6} fontFamily="'Chakra Petch',sans-serif" fontWeight="600">{tooltip.n}</text>
          <text x={tooltip.x + 2} y={tooltip.y - .4} fill="#555568" fontSize={1} fontFamily="'JetBrains Mono',monospace">{tooltip.role}</text>
        </g>
      )}
    </svg>
  );
}

// Main App
export default function GeoStrike() {
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  const filtered = CONFLICTS.filter(c => {
    const fm = filter === "all" || c.tag === filter;
    const sm = !search || c.a.n.toLowerCase().includes(search.toLowerCase()) || c.t.n.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return fm && sm;
  });

  const activeConflict = CONFLICTS.find(c => c.id === activeId);

  const handleSelect = (id) => {
    setActiveId(id);
    setDetailOpen(true);
  };

  const handleClose = () => {
    setDetailOpen(false);
    setActiveId(null);
  };

  const filterBtns = [
    { key: "all", label: "All", cls: "" },
    { key: "war", label: "War", cls: "war" },
    { key: "tension", label: "Tension", cls: "tension" },
    { key: "cyber", label: "Cyber", cls: "cyber" },
  ];

  const wars = CONFLICTS.filter(c => c.tag === "war").length;
  const tensions = CONFLICTS.filter(c => c.tag === "tension").length;
  const cybers = CONFLICTS.filter(c => c.tag === "cyber").length;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#07070d", color: "#e4e4f0", fontFamily: "'Outfit',sans-serif", position: "relative" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes flicker{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1a1a2a;border-radius:2px}
        * { scrollbar-width: thin; scrollbar-color: #1a1a2a transparent; }
      `}</style>

      {/* Loading */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#07070d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, transition: "opacity .5s" }}>
          <div style={{ width: 44, height: 44, border: "2px solid rgba(255,255,255,.1)", borderTopColor: "#ff2d55", borderRadius: "50%", animation: "spin .7s linear infinite" }}/>
          <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "#555568", animation: "flicker 2s infinite" }}>Initializing GEOSTRIKE</div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 52, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
        background: "linear-gradient(180deg,rgba(7,7,13,.98),rgba(7,7,13,.90))",
        borderBottom: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(24px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, border: "1.5px solid #ff2d55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, background: "#ff2d55", borderRadius: "50%" }}/>
          </div>
          <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 5 }}>
            GEO<span style={{ color: "#ff2d55" }}>STRIKE</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[["#ff2d55","Wars",wars],["#ffae00","Tensions",tensions],["#7b61ff","Cyber",cybers],["#00e5ff","Tracked",CONFLICTS.length]].map(([col,lab,val])=>(
            <div key={lab} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: col, boxShadow: `0 0 6px ${col}40` }}/>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#555568" }}>{lab}</span>
              <strong style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 13 }}>{val}</strong>
            </div>
          ))}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20,
          border: "1px solid rgba(255,45,85,.35)", fontFamily: "'JetBrains Mono',monospace",
          fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#ff2d55"
        }}>
          <div style={{ width: 5, height: 5, background: "#ff2d55", borderRadius: "50%" }}/>
          Live Intel
        </div>
      </div>

      {/* Map */}
      <div style={{ position: "fixed", top: 52, left: 0, right: 0, bottom: 40, zIndex: 1 }}>
        <MapView conflicts={filtered} activeId={activeId} onSelect={handleSelect}/>
      </div>

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 52, left: 0, bottom: 40, width: 370, zIndex: 900,
        background: "rgba(10,10,18,.92)", borderRight: "1px solid rgba(255,255,255,.06)",
        backdropFilter: "blur(30px)", display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-370px)",
        transition: "transform .4s cubic-bezier(.22,1,.36,1)"
      }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#555568", marginBottom: 10 }}>
            Conflict Intelligence
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            background: "#0d0d16", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555568" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text" placeholder="Search conflicts..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e4e4f0", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, padding: "10px 18px 0", flexWrap: "wrap" }}>
          {filterBtns.map(fb => {
            const isOn = filter === fb.key;
            const c = fb.key === "war" ? "#ff2d55" : fb.key === "tension" ? "#ffae00" : fb.key === "cyber" ? "#7b61ff" : "#00e5ff";
            return (
              <button key={fb.key} onClick={() => setFilter(fb.key)} style={{
                padding: "4px 11px", borderRadius: 20, fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all .2s",
                border: `1px solid ${isOn ? c : "rgba(255,255,255,.06)"}`,
                background: isOn ? `${c}1e` : "transparent",
                color: isOn ? c : "#555568"
              }}>{fb.label}</button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          {filtered.map(c => (
            <ConflictItem key={c.id} c={c} active={activeId === c.id} onClick={() => handleSelect(c.id)}/>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 30, textAlign: "center", color: "#555568", fontSize: 12 }}>No conflicts found</div>
          )}
        </div>
      </div>

      {/* Sidebar Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
        position: "fixed", zIndex: 901, width: 30, height: 30, top: 62,
        left: sidebarOpen ? 370 : 0,
        border: "1px solid rgba(255,255,255,.1)", borderRadius: "0 8px 8px 0",
        background: "rgba(10,10,18,.92)", color: "#555568", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
        transition: "all .4s cubic-bezier(.22,1,.36,1)"
      }}>
        {sidebarOpen ? "◂" : "▸"}
      </button>

      {/* Detail Panel */}
      <div style={{
        position: "fixed", top: 52, right: 0, bottom: 40, width: 420, zIndex: 900,
        background: "rgba(10,10,18,.92)", borderLeft: "1px solid rgba(255,255,255,.06)",
        backdropFilter: "blur(30px)", transform: detailOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .4s cubic-bezier(.22,1,.36,1)",
        overflowY: "auto"
      }}>
        <button onClick={handleClose} style={{
          position: "sticky", top: 0, zIndex: 2, float: "right", margin: "10px 10px 0 0",
          width: 28, height: 28, border: "1px solid rgba(255,255,255,.06)", borderRadius: 8,
          background: "#0d0d16", color: "#555568", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
        }}>✕</button>
        {activeConflict && <DetailContent c={activeConflict}/>}
      </div>

      {/* Bottom Bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 40, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 28,
        background: "linear-gradient(0deg,rgba(7,7,13,.97),rgba(7,7,13,.85))",
        borderTop: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(20px)",
        fontFamily: "'JetBrains Mono',monospace", fontSize: 9
      }}>
        {[["#ff2d55","Conflicts","12"],["#ffae00","Countries","34"],["#7b61ff","Displaced","38.2M"],["#00e5ff","Status","LIVE"]].map(([col,l,v])=>(
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: col }}/>
            <span style={{ color: "#555568", textTransform: "uppercase", letterSpacing: 1 }}>{l}</span>
            <span style={{ color: "#e4e4f0" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: "fixed", bottom: 50, left: "50%", transform: "translateX(-50%)", zIndex: 900,
        display: "flex", gap: 16, padding: "5px 18px", borderRadius: 20,
        background: "rgba(10,10,18,.88)", border: "1px solid rgba(255,255,255,.06)",
        backdropFilter: "blur(16px)", fontFamily: "'JetBrains Mono',monospace", fontSize: 8,
        textTransform: "uppercase", letterSpacing: 1, color: "#555568"
      }}>
        {[["#ff2d55","Active War"],["#ffae00","Tension"],["#7b61ff","Cyber/Proxy"]].map(([col,lab])=>(
          <div key={lab} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 20, height: 0, borderTop: `2px dashed ${col}` }}/>
            {lab}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <button onClick={() => { setActiveId(null); setDetailOpen(false); }} style={{
        position: "fixed", bottom: 50, right: 14, zIndex: 900,
        padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(10,10,18,.92)", color: "#555568", cursor: "pointer",
        fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 1, textTransform: "uppercase"
      }}>⟳ Reset</button>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
        background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.012) 3px,rgba(0,0,0,.012) 4px)"
      }}/>
    </div>
  );
}
