"use strict";(self.webpackChunkchess_barebones_docs=self.webpackChunkchess_barebones_docs||[]).push([[5484],{4073:(e,t,r)=>{r.r(t),r.d(t,{default:()=>He});var i=(e=>(e[e.NORTH=0]="NORTH",e[e.SOUTH=1]="SOUTH",e[e.WEST=2]="WEST",e[e.EAST=3]="EAST",e[e.NORTH_WEST=4]="NORTH_WEST",e[e.SOUTH_WEST=5]="SOUTH_WEST",e[e.NORTH_EAST=6]="NORTH_EAST",e[e.SOUTH_EAST=7]="SOUTH_EAST",e))(i||{}),o={0:[0,1],1:[0,-1],2:[-1,0],3:[1,0],4:[-1,1],5:[-1,-1],6:[1,1],7:[1,-1]},s=(e,t)=>{if(e.x===t.x)return e.y>t.y?0:1;if(e.y===t.y)return e.x>t.x?3:2;const r=e.x-t.x,i=e.y-t.y;return Math.abs(r)===Math.abs(i)?e.x>t.x?e.y>t.y?6:7:e.y>t.y?4:5:null},n=(e,t)=>e.x===t.x&&e.y===t.y,a=class{_state;listeners=new Set;constructor(e){this._state=this.getInitialState(e)}set state(e){this._state!==e&&(this._state=e,this.notify())}get state(){return this._state}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}unsubscribeAll(){this.listeners.clear()}notify(){this.listeners.forEach(e=>e())}},l=class extends a{constructor(e,t,r,i){super(i),this._name=e,this._owner=t,this.board=r,this.initialCoordinate=i,this.ordinal=r.getPlayerFiguresByName(t,e).length+1}ordinal;getInitialState(e){return{captured:!1,capture:null,previousCoordinate:null,coordinate:e??this.initialCoordinate}}get owner(){return this._owner}get name(){return this._name}get id(){return`${this._owner.color}-${this._name}-${this.ordinal}`}captureBy(e,t){if(!this._state.captured){t??=this.board.getAllFigures().filter(t=>t.state.capture?.[0]===e).length+1;const r={captured:!0,capture:[e,t],previousCoordinate:this._state.coordinate,coordinate:null};this.state=r}}move(e){"string"==typeof e&&(e=this.board.deserializeCoordinate(e));const t=this.board.getFigure(e);null===t||t.state.captured||t.captureBy(this._owner);const r={captured:!1,capture:null,previousCoordinate:this._state.coordinate,coordinate:e};this.state=r,this.board.lastMoved=this}reset(){this.state=this.getInitialState()}},d=class extends l{getAllMoves(){return[]}getAvailableMoves(){return[]}getReach(){return[]}},c=class extends Error{constructor(e,t){const r=`Reached invalid state at ${e.constructor.name}`;super(t?`${r}. ${t}`:r),this.instance=e}},h=class extends Error{constructor(e,t){const r=`Received argument of ${e.constructor.name} in invalid state`;super(t?`${r}. ${t}`:r),this.instance=e}},u=class extends Error{constructor(e,t){super(t?`Failed to parse "${e}". ${t}`:t)}},g=class extends a{constructor(e){super(),this.figureFactory=e}lastMoved=null;getInitialState(){return{activeFigures:[],captures:[]}}createFigure(e,t,r){"string"==typeof r&&(r=this.deserializeCoordinate(r));const i=this.getFigure(r);if(!1===i?.state.captured)throw new c(this,`Another figure exists at coordinate "${this.serializeCoordinate(r)}", please use replaceFigure method instead`);const o=this.figureFactory.create(e,t,this,r);return this.state={...this._state,activeFigures:[...this._state.activeFigures,o]},o.subscribe(()=>{o.state.captured&&(this.state={...this._state,captures:[...this._state.captures,o],activeFigures:this.state.activeFigures.filter(e=>e!==o)})}),o}replaceFigure(e,t){if(e.state.captured)throw new h(e,"Cannot replace captured figure");const r=this.figureFactory.create(t,e.owner,this,e.state.coordinate);return this.state={...this._state,activeFigures:[...this._state.activeFigures.filter(t=>t!==e),r]},r}getFigure(e){return"string"==typeof e&&(e=this.deserializeCoordinate(e)),Object.values(this._state.activeFigures).find(t=>n(e,t.state.coordinate))??null}getAllFigures(){return[...this.state.activeFigures,...this.state.captures]}getPlayerFigures(e){return this.getAllFigures().filter(t=>t.owner===e)}getPlayerFiguresByName(e,t){return this.getAllFigures().filter(r=>r.owner===e&&r.name===t)}getFiguresReachCoordinate(e){return Object.values(this.state.activeFigures).filter(t=>t.getReach().some(t=>n(e,t)))}getPathBetweenCoordinates(e,t){const r=[],i=s(t,e);if(null!==i)do{e=this.getCoordinateWithVector(e,o[i]),r.push(e)}while(!n(e,t));return r}serializePosition(){return this.getAllFigures().sort((e,t)=>e.id.localeCompare(t.id)).map(e=>{const{captured:t,capture:r,coordinate:i,previousCoordinate:o}=e.state,s=t?`#${r[0].color}-${r[1]}`:this.serializeCoordinate(i),n=o?this.serializeCoordinate(o):"-";return`${e.id}:${s}:${n}`}).join(";")}loadPosition(e,t){const r=e.trim().split(";"),i=this.getAllFigures().reduce((e,t)=>(e.set(t.id,t),e),new Map);this.state=r.reduce((e,r)=>{const[o,s,n]=r.trim().split(":");let a=i.get(o);if(i.delete(o),!s||!n)throw new u(r,"Invalid coordinate(s)");if(!a){const[e,i]=o.split("-");if(!t[e]||!i)throw new u(r,i?"Player is not found in the parameters":"Expected figure name to be provided");a=this.createFigure(i,t[e],s)}if("-"===n?a.reset():a.move(n),s.startsWith("#")){const[i,o]=s.substring(1).split("-");if(!t[i]||Number.isNaN(parseInt(o)))throw new u(r,t[i]?"Missing capture ordinal for the figure":"Player is not found in the parameters");a.captureBy(t[i],+o),e.captures.push(a)}else a.move(s),e.activeFigures.push(a);return e},{activeFigures:[],captures:[]}),i.forEach(e=>e.unsubscribeAll())}},C=(e=>(e[e.A=1]="A",e[e.B=2]="B",e[e.C=3]="C",e[e.D=4]="D",e[e.E=5]="E",e[e.F=6]="F",e[e.G=7]="G",e[e.H=8]="H",e))(C||{}),p={1:"a",2:"b",3:"c",4:"d",5:"e",6:"f",7:"g",8:"h"},x={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8},f=class extends g{serializeCoordinate(e){return`${p[e.x]}${e.y}`}deserializeCoordinate(e){if(!x[e.charAt(0)]||Number.isNaN(parseInt(e.charAt(1),10)))throw new u(e,"Invalid coordinate");return{x:x[e.charAt(0)],y:+e.charAt(1)}}getCoordinateWithVector(e,t){const r=e.x+t[0];if(r>8||r<1)return null;const i=e.y+t[1];return i>8||i<1?null:{x:r,y:i}}},w=class extends a{constructor(e,t){super(),this.color=e,this.flank=t}getInitialState(){return{score:null}}assignScore(e){if(null!==this.state.score)throw new c(this,"Score has already been assigned");this.state={score:e}}},b=(Error,Error,Error,(e=>(e.KING="king",e.QUEEN="queen",e.ROOK="rook",e.BISHOP="bishop",e.KNIGHT="knight",e.PAWN="pawn",e))(b||{})),m=class extends l{getAllMoves(){const{captured:e,coordinate:t}=this.state;return e?[]:this.getDirections().map(e=>{let r=this.board.getCoordinateWithVector(t,o[e]);const i=[];for(;null!==r;)i.push(r),r=this.board.getCoordinateWithVector(r,o[e]);return i}).flat()}getReach(){const{captured:e,coordinate:t}=this.state;return e?[]:this.getDirections().map(e=>{let r=this.board.getCoordinateWithVector(t,o[e]);const i=[];for(;null!==r;){const t=this.board.getFigure(r),s=t?.owner??null;if(i.push(r),r=this.board.getCoordinateWithVector(r,o[e]),null!==s&&("king"!==t.name||t.owner===this.owner))break}return i}).flat()}getAvailableMoves(){const{captured:e,coordinate:t}=this.state;return e?[]:this.getDirections().map(e=>{let r=this.board.getCoordinateWithVector(t,o[e]);const i=[];for(;null!==r;){const t=this.board.getFigure(r),s=t?.owner??null;if(i.push(r),r=this.board.getCoordinateWithVector(r,o[e]),null!==s){s===this.owner&&i.pop();break}}return i}).flat()}},v=[i.EAST,i.WEST,i.NORTH,i.SOUTH,i.SOUTH_EAST,i.NORTH_EAST,i.SOUTH_WEST,i.NORTH_WEST],y=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],H={[i.NORTH]:[i.NORTH_WEST,i.NORTH_EAST],[i.SOUTH]:[i.SOUTH_WEST,i.SOUTH_EAST]},T=Symbol("PAWN_PROMOTION"),L=(C.A,C.B,C.C,C.D,C.E,C.F,C.G,C.H,C.A,C.B,C.C,C.D,C.E,C.F,C.G,C.H,i.EAST,C.G,i.WEST,C.C,i.EAST,C.F,i.WEST,C.D,i.EAST,i.WEST,i.EAST,i.WEST,i.EAST,i.WEST,i.EAST,i.WEST,(e=>(e.WHITE="white",e.BLACK="black",e))(L||{})),E={p:"pawn",n:"knight",b:"bishop",r:"rook",q:"queen",k:"king"},S={pawn:"p",knight:"n",bishop:"b",rook:"r",queen:"q",king:"k"},A=class extends f{serializePosition(){const e=Array.from({length:8},()=>Array(8).fill(null));return this.state.activeFigures.forEach(t=>{const{coordinate:r}=t.state,i=this.getFENSymbol(t),o=8-r.y;e[o][r.x-1]=i}),e.map(e=>{let t=0,r="";for(let i=0;i<8;i++){const o=e[i]??"";""===o?t++:(t>0&&(r+=t,t=0),r+=o)}return t>0&&(r+=t),r}).join("/")}getFENSymbol(e){let t=S[e.name];return"white"===e.owner.color&&(t=t.toUpperCase()),t}loadPosition(e,t){this.getAllFigures().forEach(e=>e.unsubscribeAll()),this.state=this.getInitialState();const[r]=e.trim().split(/\s+/),i=r.split("/");if(8!==i.length)throw new u(e,"Invalid FEN string: must have 8 ranks");i.forEach((r,i)=>{let o=0;for(let s=0;s<r.length;s++){const n=r[s];if(/[1-8]/.test(n)){o+=parseInt(n,10);continue}const a=n===n.toUpperCase()?"white":"black",l=this.getFigureNameFromFen(n);if(!t[a])throw new u(e,`Player not found for color: ${a}`);const d={x:o+1,y:8-i};this.createFigure(l,t[a],d),o++}if(8!==o)throw new u(e,"Invalid rank length at rank "+(8-i))})}getFigureNameFromFen(e){const t=e.toLowerCase(),r=E[t];if(!r)throw new u(e,"Invalid piece character in FEN string");return r}},F=["bishop","rook","queen"],O=e=>{const t=e;return class extends t{getAvailableMoves(){if(this.state.captured)return[];const e=this.state.coordinate,t=this.board.getPlayerFiguresByName(this.owner,"king")[0]??null,r=t?.state;if(null===r||r.captured)throw new c(this.board,`King is not on the board for player "${this.owner.color}"`);const i=r.coordinate,o=s(i,e);if(null!==o){const r=this.board.getPathBetweenCoordinates(i,e);if(r.pop(),r.every(e=>null===this.board.getFigure(e))){const r=this.board.getFiguresReachCoordinate(e).find(r=>{const i=s(e,r.state.coordinate);return F.includes(r.name)&&o===i&&r.owner!==t.owner})??null;if(null!==r){const t=this.board.getPathBetweenCoordinates(e,r.state.coordinate),i=super.getAvailableMoves();return t.filter(e=>i.some(t=>n(e,t)))}}}return super.getAvailableMoves()}}},k=e=>{const t=e;return class extends t{getAvailableMoves(){if(this.state.captured)return[];const e=this.board.getPlayerFiguresByName(this.owner,"king")[0]?.state??null;if(null===e||e.captured)throw new c(this.board,`King is not on the board for player "${this.owner.color}"`);const t=e.coordinate,r=this.board.getFiguresReachCoordinate(t).filter(e=>e.owner!==this.owner);if(0===r.length)return super.getAvailableMoves();if(r.length>1)return[];const i=r[0].state.coordinate,o=this.board.getPathBetweenCoordinates(t,i);return super.getAvailableMoves().filter(e=>0===o.length?n(i,e):o.some(t=>n(t,e)))}}},j={king:class extends l{constructor(e,t,r){super("king",e,t,r)}getCastlingFiles(){return{"O-O":C.G,"O-O-O":C.C}}getCastlingMoves(){const{coordinate:e,previousCoordinate:t,captured:r}=this.state;if(r||null!==t)return[];const i=this.getCastlingFiles(),o=this.getRooksForCastling(),s=[];return Object.entries(o).forEach(([t,r])=>{null!==r&&s.push({rook:r,type:t,move:{x:i[t],y:e?.y}})}),s}getRooksForCastling(){const e={"O-O":null,"O-O-O":null};return this.board.getPlayerFiguresByName(this.owner,"rook").forEach(t=>{const{coordinate:r,captured:o,previousCoordinate:n}=t.state;if(o||null!==n)return;const a=s(r,this.state.coordinate);r.y===this.state.coordinate.y&&[i.WEST,i.EAST].includes(a)&&(e[a===i.EAST?"O-O":"O-O-O"]=t)}),e}getAllMoves(){return this.state.captured?[]:[...this.getReach(),...this.getCastlingMoves().map(({move:e})=>e)]}getReach(){const{coordinate:e,captured:t}=this.state;return t?[]:v.map(t=>this.board.getCoordinateWithVector(e,o[t])).filter(e=>null!==e)}getAvailableMoves(){const{coordinate:e,captured:t}=this.state;if(t)return[];return[...this.board.getFiguresReachCoordinate(e).filter(e=>e.owner!==this.owner).length>0?[]:this.getCastlingMoves().filter(({rook:t,move:r})=>{const i=t.state.coordinate,n=Math.abs(i.x-e.x)>Math.abs(r.x-e.x)?this.board.getCoordinateWithVector(i,o[s(this.state.coordinate,i)]):r;return this.board.getPathBetweenCoordinates(e,n).every(e=>null===this.board.getFigure(e)&&!this.board.getFiguresReachCoordinate(e).some(e=>e.owner!==this.owner))}).map(({move:e})=>e),...this.getReach().filter(e=>this.board.getFigure(e)?.owner!==this.owner&&!this.board.getFiguresReachCoordinate(e).some(e=>e!==this&&e.owner!==this.owner))]}},bishop:k(O(class extends m{directions=[i.SOUTH_EAST,i.NORTH_EAST,i.SOUTH_WEST,i.NORTH_WEST];constructor(e,t,r){super("bishop",e,t,r)}getDirections(){return this.directions}})),rook:k(O(class extends m{directions=[i.NORTH,i.SOUTH,i.WEST,i.EAST];constructor(e,t,r){super("rook",e,t,r)}getDirections(){return this.directions}})),knight:k(O(class extends l{constructor(e,t,r){super("knight",e,t,r)}getAllMoves(){const{captured:e,coordinate:t}=this.state;return e?[]:y.map(e=>this.board.getCoordinateWithVector(t,e)).filter(e=>null!==e).flat()}getReach(){return this.getAllMoves()}getAvailableMoves(){return this.getReach().filter(e=>this.board.getFigure(e)?.owner!==this.owner)}})),queen:k(O(class extends m{directions=[i.EAST,i.WEST,i.NORTH,i.SOUTH,i.SOUTH_EAST,i.NORTH_EAST,i.SOUTH_WEST,i.NORTH_WEST];constructor(e,t,r){super("queen",e,t,r)}getDirections(){return this.directions}})),pawn:k(O(class extends l{constructor(e,t,r){super("pawn",e,t,r)}get headedDirection(){return this.owner.flank===i.NORTH?i.SOUTH:i.NORTH}checkForPromotion(e){return null===this.board.getCoordinateWithVector(e,o[this.headedDirection])}move(e){"string"==typeof e&&(e=this.board.deserializeCoordinate(e)),e.x!==this.state.coordinate.x&&null===this.board.getFigure(e)&&this.board.lastMoved?.captureBy(this.owner),super.move(e)}getAllMoves(){const{captured:e,coordinate:t}=this.state;if(e)return[];const r=[this.board.getCoordinateWithVector(t,o[this.headedDirection])];if(r[0]){const e=this.board.getCoordinateWithVector(r[0],o[this.headedDirection]);this.checkForPromotion(r[0])&&(r[0].requiresInput=T),null===this.state.previousCoordinate&&null!==e&&r.push(e)}return[...this.getReach(),...r[0]?r:[]]}getReach(){const{captured:e,coordinate:t}=this.state;return e?[]:H[this.headedDirection].map(e=>this.board.getCoordinateWithVector(t,o[e])).filter(e=>null!==e)}getAvailableMoves(){const{captured:e,coordinate:t}=this.state;if(e)return[];const r=this.getReach(),i=this.getAllMoves().slice(r.length);return[...r.filter(e=>{const r=this.board.lastMoved;if(null!==r&&"pawn"===r.name){const i=r.state,o=i.previousCoordinate,s=i.coordinate;if(o&&s&&r.owner!==this.owner&&s.y===t.y&&s.x===e.x&&2===Math.abs(s.y-o.y))return!0}const i=this.board.getFigure(e)?.owner;return i&&i!==this.owner}).map(e=>this.checkForPromotion(e)?{...e,requiresInput:T}:e),...null===this.board.getFigure(i[0])?i.filter(e=>null===this.board.getFigure(e)):[]]}}))},N=class{create(e,t,r,i){return new(0,j[e])(t,r,i)}},V=(C.A,C.B,C.C,C.D,C.E,C.F,C.G,C.H,C.A,C.H,C.B,C.G,C.C,C.F,C.D,C.E,r(3917)),R=r(1273),M=e=>(0,V.useSyncExternalStore)(e.subscribe.bind(e),()=>e.state),B=(e,t)=>t?{x:9-e.x,y:9-e.y}:e,_=V.memo(({figure:e,Component:t,onSelect:r,flipped:i})=>{const o=M(e);return(0,R.jsx)(t,{location:B(o.coordinate,i),color:e.owner.color,name:e.name,onSelect:r?()=>r(e):void 0})});_.displayName="BoardFigure";var W=r(5712),P=r(951),I=r(7787),$=I.Ay.div`
  --light: #c8ded3;
  --dark: #3e8564;
  --border: #d9d9d9;
  --shadow: rgba(0, 0, 0, 0.12);

  width: min(60vw, 60vh);
  aspect-ratio: 1 / 1;
  max-width: 720px;

  background: conic-gradient(
      from 90deg,
      var(--light) 25%,
      var(--dark) 0 50%,
      var(--light) 0 75%,
      var(--dark) 0
    )
    0 0 / 25% 25%;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow:
    0 10px 24px var(--shadow),
    inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`,U=I.Ay.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  align-items: center;
  justify-items: center;
`,z=I.Ay.div`
  width: 100%;
  box-sizing: border-box;
  max-width: 720px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`,Z=I.Ay.div`
  display: flex;
  align-items: center;
`,K=({boardFigures:e,moves:t,promotionMenu:r,capturesTop:i,capturesBottom:o,timerTop:s,timerBottom:n})=>(0,R.jsxs)(U,{children:[(0,R.jsxs)(z,{children:[(0,R.jsx)(Z,{children:i}),s]}),(0,R.jsxs)($,{children:[t,e,r]}),(0,R.jsxs)(z,{children:[(0,R.jsx)(Z,{children:o}),n]})]}),D=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{d:"M38.1019 44.1613H33.7015C33.7015 36.0814 36.1522 28.015 41.5739 22.1105C42.4235 20.9541 42.9253 19.5263 42.9253 17.9813C42.9253 14.1256 39.7997 11 35.944 11C32.0883 11 28.9627 14.1256 28.9627 17.9813C28.9627 19.8836 29.7236 21.6082 30.9575 22.8674C26.5965 25.9763 18.4907 34.3096 18.4907 44.7431C18.4907 55.2723 26.7459 59.5351 31.0765 60.4102L15 63.2542V71.5049L56.888 71.5049V63.2542L40.4302 60.3678C44.8099 59.4038 52.8156 55.112 52.8156 44.7431C52.8156 37.9538 49.6528 31.9017 45.8025 27.5013C41.5739 30.8016 38.1019 38.5022 38.1019 44.1613Z",fill:"#34364C"})}),G=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M32.2251 8H38.8249L38.9967 13.4998H45.4246V20.0995H39.203L39.5052 27.5715C39.6258 27.4294 39.75 27.2901 39.878 27.1541C45.8873 20.7673 54.797 17.3686 61.374 22.8494C67.9737 28.3492 67.9737 40.9987 58.8867 48.3147C53.7392 52.4589 49.1285 56.4541 49.3557 62.2973L58.6015 63.5478V71.7975H12.4485V63.5478L21.6943 62.2973C21.9215 56.4541 17.3108 52.4589 12.1633 48.3147C3.07628 40.9987 3.07628 28.3492 9.67602 22.8494C16.253 17.3686 25.1627 20.7673 31.172 27.1541C31.3 27.2901 31.4242 27.4294 31.5448 27.5715L31.847 20.0995H25.6254V13.4998H32.0533L32.2251 8ZM26.0082 33.2695C30.0414 39.8758 30.5752 47.5984 30.5752 50.9568C28.5536 50.9605 20.9328 47.6078 16.8979 42.1038C13.9931 38.1412 13.2357 32.2622 15.7258 29.9799C18.2158 27.6975 23.4875 29.1405 26.0082 33.2695ZM45.0418 33.2695C41.0086 39.8758 40.4748 47.5984 40.4748 50.9568C42.4964 50.9605 50.1172 47.6078 54.1521 42.1038C57.0569 38.1412 57.8143 32.2622 55.3242 29.9799C52.8341 27.6975 47.5625 29.1405 45.0418 33.2695Z",fill:"#34364C"})}),q=e=>(0,R.jsx)("svg",{width:72,height:73,viewBox:"0 0 72 73",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M42.451 20.5912L32.513 9C31.0744 11.7311 29.6798 16.5512 31.6849 20.0309C30.7117 20.1175 29.7816 20.2821 29.0622 20.5708C24.4725 22.4127 19.4364 27.1714 16.9612 37.0721C16.2445 39.939 14.9545 41.3119 13.4214 42.9436C11.9751 44.4828 10.3125 46.2522 8.71057 49.7232C5.41031 56.8737 14.317 64.0243 20.8115 57.5297C24.4629 53.8784 27.6545 52.371 30.3341 51.1055C34.1908 49.284 36.9868 47.9635 38.5662 41.4725C39.3177 44.5002 39.0171 51.6458 31.8034 56.0057C24.5897 60.3657 23.0869 69.5499 23.2371 72.2749H64.265C64.265 46.4044 60.8399 24.0524 42.451 20.5912Z",fill:"#34364C"})}),Q=e=>(0,R.jsx)("svg",{width:72,height:73,viewBox:"0 0 72 73",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{d:"M47.0048 25.8952C47.0048 29.0552 45.6595 31.9009 43.5105 33.891L49.0476 37.7995V44.9619H43.627C43.8884 48.2819 46.0186 51.6045 48.775 54.5026C51.7002 57.5783 55.2196 60.0589 57.5569 61.3945L57.9 61.5905V72.2H15V61.5905L15.3431 61.3945C17.6804 60.0589 21.1998 57.5783 24.125 54.5026C26.8814 51.6045 29.0116 48.2819 29.273 44.9619H23.8524V37.7995L29.0092 34.1594C26.6857 32.1613 25.2143 29.2001 25.2143 25.8952C25.2143 19.878 30.0923 15 36.1095 15C42.1268 15 47.0048 19.878 47.0048 25.8952Z",fill:"#34364C"})}),Y=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{d:"M28.1743 19.635C30.2365 18.8416 31.7 16.8417 31.7 14.5C31.7 11.4624 29.2376 9 26.2 9C23.1624 9 20.7 11.4624 20.7 14.5C20.7 17.307 22.8029 19.6229 25.5192 19.9583L23.0664 39.8L11.2424 29.5305C12.3236 28.5261 13 27.0921 13 25.5C13 22.4624 10.5376 20 7.5 20C4.46243 20 2 22.4624 2 25.5C2 28.5376 4.46243 31 7.5 31C8.03472 31 8.55162 30.9237 9.0404 30.7814L15.2 51.9L21.5697 62.3231L15.2 63.45V71.7L57.0846 71.7V63.45L50.6331 62.3185L57 51.9L63.1596 30.7814C63.6484 30.9237 64.1653 31 64.7 31C67.7376 31 70.2 28.5376 70.2 25.5C70.2 22.4624 67.7376 20 64.7 20C61.6624 20 59.2 22.4624 59.2 25.5C59.2 27.0921 59.8764 28.5261 60.9576 29.5305L49.1336 39.8L46.6808 19.9583C49.3971 19.6229 51.5 17.307 51.5 14.5C51.5 11.4624 49.0376 9 46 9C42.9624 9 40.5 11.4624 40.5 14.5C40.5 16.8417 41.9635 18.8416 44.0257 19.635L36.1 37.6L28.1743 19.635Z",fill:"#34364C"})}),X=e=>(0,R.jsxs)("svg",{width:72,height:73,viewBox:"0 0 72 73",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,R.jsx)("path",{d:"M15 14H26V20.6H30.4V14H42.5V20.6H46.9V14H57.9V23.9L49.1 30.5L51.3 50.3H21.6L23.8 30.5L15 23.9V14Z",fill:"#34364C"}),(0,R.jsx)("path",{d:"M21.6 54.7H51.3L57.9 63.5V72.3H15V63.5L21.6 54.7Z",fill:"#34364C"})]}),J=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M41.1561 21.0997C40.8139 21.4724 40.4847 21.8545 40.1684 22.2455C37.1785 25.941 35.3377 30.4246 34.5124 35.1442C34.1676 37.1164 34 39.1299 34 41.1442H38C38 37.9147 39.2439 33.9538 41.121 30.7103C41.9925 29.2044 43.0006 27.8531 44.084 26.8015C44.2431 26.6471 44.4038 26.4991 44.566 26.3581C44.7096 26.2332 44.8543 26.1137 45 26C45.6956 26.7949 46.3664 27.6491 46.995 28.5561C47.5168 29.3092 48.0095 30.0987 48.4629 30.9208C50.2111 34.0909 51.375 37.7463 51.375 41.6731C51.375 45.851 49.9452 48.9435 48.0064 51.1684C45.5712 53.9628 42.333 55.3883 40.1165 55.8762L55.0769 58.5V66L17 66V58.5L31.6139 55.9147C29.4138 55.4701 26.0994 54.0637 23.6034 51.2386C21.6333 49.0088 20.1731 45.8952 20.1731 41.6731C20.1731 35.1943 23.6115 29.6063 27.0544 25.8145C28.6514 24.0556 30.2494 22.6832 31.5056 21.7877C31.0435 21.3161 30.6544 20.7727 30.3566 20.1758C29.9315 19.3239 29.6923 18.363 29.6923 17.3462C29.6923 13.8413 32.5336 11 36.0385 11C39.5434 11 42.3846 13.8413 42.3846 17.3462C42.3846 18.7506 41.9284 20.0485 41.1561 21.0997ZM24.0455 20.2857C23.8149 19.3431 23.6923 18.3584 23.6923 17.3462C23.6923 10.5275 29.2199 5 36.0385 5C42.8571 5 48.3846 10.5275 48.3846 17.3462C48.3846 18.5245 48.2182 19.6672 47.9078 20.7502C48.4999 21.078 49.0455 21.5119 49.5155 22.049C53.6569 26.782 57.375 33.6314 57.375 41.6731C57.375 46.0121 56.2679 49.5208 54.5861 52.3223L56.1134 52.5902C58.9834 53.0936 61.0769 55.5862 61.0769 58.5V66C61.0769 67.5913 60.4448 69.1174 59.3196 70.2427C58.1943 71.3679 56.6682 72 55.0769 72L17 72C13.6863 72 11 69.3137 11 66V58.5C11 55.5895 13.0888 53.0988 15.9548 52.5917L17.0094 52.4052C15.3004 49.5904 14.1731 46.0556 14.1731 41.6731C14.1731 35.3625 16.6164 29.9343 19.3935 25.8563C20.8528 23.7135 22.4727 21.8402 24.0455 20.2857Z",fill:"#34364C"})}),ee=e=>(0,R.jsxs)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,R.jsx)("path",{d:"M32.4998 46.949L32.5 47.0532H32.494C31.4976 47.0514 29.0253 46.1638 26.3843 44.5617C24.1301 43.1943 21.7529 41.3064 20.0656 39.0046C17.4248 35.4022 16.7362 30.0575 19 27.9825C21.2638 25.9075 26.0563 27.2194 28.348 30.9731C30.3012 34.1726 31.3517 37.66 31.9069 40.6822C32.3823 43.2697 32.4947 45.5162 32.4998 46.949Z",fill:"#34364C"}),(0,R.jsx)("path",{d:"M53.9343 39.0046C52.247 41.3064 49.8698 43.1943 47.6156 44.5617C44.9746 46.1638 42.5023 47.0514 41.5059 47.0532H41.5L41.5002 46.949C41.5053 45.5162 41.6176 43.2697 42.093 40.6822C42.6482 37.66 43.6987 34.1726 45.6519 30.9731C47.9436 27.2194 52.7362 25.9075 55 27.9825C57.2638 30.0575 56.5752 35.4022 53.9343 39.0046Z",fill:"#34364C"}),(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M34 2C31.0354 2 28.561 4.15343 28.0832 7H28C24.6863 7 22 9.68629 22 13V13.0856C17.8263 12.6972 13.4565 13.7259 9.65885 16.8907C0.211597 24.7634 1.35689 40.7571 11.9986 49.3247C13.4928 50.5277 14.7133 51.5463 15.6931 52.4896L15.2163 52.5541C12.2405 52.9566 10.0205 55.4971 10.0205 58.5V66C10.0205 69.3137 12.7068 72 16.0205 72H57.9794C61.2931 72 63.9794 69.3137 63.9794 66V58.5C63.9794 55.4971 61.7594 52.9566 58.7836 52.5541L58.3068 52.4897C59.2867 51.5463 60.5071 50.5277 62.0014 49.3247C72.643 40.7571 73.7883 24.7634 64.3411 16.8907C60.5434 13.7259 56.1736 12.6972 52 13.0856V13C52 9.68629 49.3137 7 46 7H45.9167C45.4389 4.15343 42.9645 2 40 2H34ZM51.9987 19.1228C54.9724 18.7089 57.9318 19.3598 60.5 21.5C66.5 26.5 66.5 38 58.2387 44.6512C55.4822 46.8704 52.8951 49.0426 51.2764 51.5388C50.7341 52.3751 50.3005 53.2477 50.0056 54.1706C49.6863 55.1699 49.5297 56.2282 49.5738 57.3632L57.9794 58.5V66H16.0205V58.5L24.4261 57.3632C24.4702 56.2282 24.3136 55.1699 23.9943 54.1706C23.6994 53.2477 23.2658 52.375 22.7236 51.5388C21.1048 49.0426 18.5177 46.8704 15.7612 44.6512C7.49996 38 7.49996 26.5 13.5 21.5C16.0681 19.3599 19.0275 18.7089 22.0012 19.1228C23.8826 19.3847 25.7698 20.0729 27.5672 21.0798C27.712 21.1609 27.8563 21.2442 28 21.3294C29.6581 22.3134 31.2319 23.5658 32.6445 25C32.7786 25.1362 32.9113 25.2741 33.0425 25.4135C33.1589 25.5372 33.2718 25.6638 33.3814 25.793L33.6562 19H28V13H33.8437L34 8H40L40.1562 13H46V19H40.3437L40.6185 25.793C40.7281 25.6638 40.841 25.5372 40.9574 25.4135C41.0886 25.2741 41.2213 25.1362 41.3554 25C42.768 23.5658 44.3418 22.3134 46 21.3294C46.1436 21.2442 46.2879 21.1609 46.4327 21.0798C48.2301 20.0729 50.1173 19.3847 51.9987 19.1228Z",fill:"#34364C"})]}),te=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M36.8465 4.09469C35.5528 2.58588 33.596 1.81556 31.621 2.03764C29.646 2.25972 27.9091 3.44538 26.9829 5.20381C26.0641 6.94811 25.1639 9.32513 24.7993 11.9253C24.707 12.5835 24.644 13.2959 24.6321 14.0447C19.2955 17.0323 14.6388 22.8426 12.3338 32.0629C12.1722 32.7092 11.9931 33.0376 11.8318 33.2795C11.6048 33.6201 11.3125 33.9505 10.5642 34.7469C9.10833 36.2963 7.07057 38.4658 5.20686 42.5038C2.36265 48.6663 4.87149 54.9269 9.33576 58.1054C11.9629 59.9759 15.2252 60.7929 18.4757 60.276C17.9667 62.4534 17.7903 64.4281 17.8686 65.8485C18.0441 69.029 20.6742 71.5181 23.8595 71.5181H61.1546C64.4683 71.5181 67.1546 68.8318 67.1546 65.5181C67.1546 53.6703 66.3955 41.8629 63.1875 32.4524C60.1115 23.4295 54.4504 15.8217 44.5989 13.1367L36.8465 4.09469ZM10.6546 45.0182C12.1108 41.863 13.6222 40.2545 14.9368 38.8554C16.3305 37.3722 17.5031 36.1242 18.1546 33.5182C19.8374 26.7869 22.8224 22.6703 25.9659 20.3222C27.0254 19.5308 28.1029 18.9402 29.1546 18.5182C29.8086 18.2557 30.654 18.1061 31.5387 18.0273C31.0614 17.199 30.796 16.2871 30.6878 15.3477C30.5626 14.2614 30.6476 13.1382 30.858 12.0647C31.1605 10.5214 31.7222 9.08079 32.2914 8.00006L41.3253 18.5366C56.6005 21.4118 60.5169 38.6267 61.0785 59.5181C61.1315 61.4884 61.1546 63.4914 61.1546 65.5181H23.8595C23.8479 65.3076 23.8472 65.0546 23.8595 64.7655C23.9129 63.5194 24.21 61.6021 24.9323 59.5181C25.401 58.1661 26.0486 56.7439 26.9247 55.3894C28.0707 53.6176 29.6076 51.9614 31.6464 50.7292C31.8494 50.6065 32.0463 50.4814 32.2374 50.3541C38.2198 46.3674 38.4559 40.1853 37.794 37.5182C36.3583 43.4186 33.8166 44.619 30.3108 46.2747C29.9689 46.4362 29.6178 46.602 29.2577 46.7769C27.2338 47.76 24.9244 49.0309 22.3529 51.4386C22.1222 51.6545 21.8895 51.8796 21.6546 52.1145C15.7509 58.0182 7.65462 51.5182 10.6546 45.0182Z",fill:"#34364C"})}),re=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M57.9769 51.1456L57.6649 50.9674C55.946 49.9851 53.2363 48.073 51.0522 45.7765L50.9725 45.6923C52.1883 44.5942 52.9524 43.0054 52.9524 41.2381V34.7269C52.9524 32.7773 52.0052 30.9493 50.4125 29.825L50.0543 29.5722C50.7263 27.8114 51.0952 25.9003 51.0952 23.9048C51.0952 15.1208 43.9744 8 35.1905 8C26.4065 8 19.2857 15.1208 19.2857 23.9048C19.2857 26.0313 19.7045 28.0614 20.4624 29.9158C18.9453 31.0462 18.0476 32.8289 18.0476 34.7269V41.2381C18.0476 43.0054 18.8117 44.5942 20.0276 45.6923L19.9478 45.7765C17.7637 48.073 15.054 49.9851 13.3351 50.9674L13.0231 51.1456C11.1537 52.2139 10 54.2019 10 56.355V66C10 69.3137 12.6863 72 16 72H55C58.3137 72 61 69.3137 61 66V56.355C61 54.2019 59.8463 52.2139 57.9769 51.1456ZM28.7357 31.4176C27.5051 30.3594 26.5374 29.0039 25.9439 27.4627C25.5188 26.3584 25.2857 25.1588 25.2857 23.9048C25.2857 18.4345 29.7202 14 35.1905 14C40.6607 14 45.0952 18.4345 45.0952 23.9048C45.0952 25.2879 44.8117 26.6048 44.2997 27.8005C43.7482 29.0883 42.9317 30.2355 41.9187 31.1736L46.9524 34.7269V41.2381H42.0246C42.1851 43.2769 43.1208 45.3168 44.4836 47.2381C45.1383 48.161 45.8914 49.0566 46.7045 49.9115C49.3638 52.7075 52.5633 54.9626 54.6881 56.1768L55 56.355V66H16V56.355L16.3119 56.1768C18.4367 54.9626 21.6362 52.7075 24.2955 49.9115C25.1086 49.0566 25.8617 48.161 26.5164 47.2381C27.8792 45.3168 28.8149 43.2769 28.9754 41.2381H24.0476V34.7269L28.7357 31.4176Z",fill:"#34364C"})}),ie=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M31.7096 17.6087C31.966 17.0178 32.1081 16.366 32.1081 15.6812C32.1081 12.9998 29.93 10.8261 27.2432 10.8261C24.5565 10.8261 22.3784 12.9998 22.3784 15.6812C22.3784 16.7874 22.7491 17.8073 23.3734 18.6237C24.1471 19.6356 25.3102 20.335 26.6395 20.4992L26.641 20.4994L24.4715 38.0145L14.013 28.9492C14.2686 28.7121 14.4987 28.448 14.6986 28.1613C15.2463 27.3758 15.5675 26.4213 15.5676 25.3918C15.5676 22.7105 13.3895 20.5362 10.7027 20.5362C8.01591 20.5362 5.83784 22.7099 5.83784 25.3913C5.83784 27.1623 6.78796 28.7118 8.20725 29.5598C8.93686 29.9958 9.79046 30.2464 10.7027 30.2464C11.1757 30.2464 11.6329 30.179 12.0652 30.0534L17.5135 48.6957L23.1476 57.8966L17.5135 58.8913V66.1739L54.5613 66.1739V58.8913L48.8549 57.8925L54.4865 48.6957L59.9348 30.0534C60.3671 30.179 60.8243 30.2464 61.2973 30.2464C62.2095 30.2464 63.0631 29.9958 63.7928 29.5598C65.212 28.7118 66.1622 27.1623 66.1622 25.3913C66.1622 22.7099 63.9841 20.5362 61.2973 20.5362C58.6105 20.5362 56.4324 22.7099 56.4324 25.3913C56.4325 26.4207 56.7537 27.3758 57.3014 28.1613C57.5013 28.448 57.7314 28.7121 57.9871 28.9492L47.5285 38.0145L45.359 20.4994L45.3605 20.4992C46.6898 20.335 47.8529 19.6356 48.6266 18.6237C49.2509 17.8073 49.6216 16.7874 49.6216 15.6812C49.6216 12.9998 47.4435 10.8261 44.7568 10.8261C42.07 10.8261 39.8919 12.9998 39.8919 15.6812C39.8919 16.366 40.034 17.0178 40.2904 17.6087C40.746 18.6588 41.5626 19.5166 42.584 20.0263C42.7225 20.0954 42.8648 20.1581 43.0105 20.2141L36 36.0725L28.9895 20.2141C29.1352 20.1581 29.2775 20.0954 29.4161 20.0263C30.4374 19.5166 31.254 18.6588 31.7096 17.6087ZM36 9.53837C34.0631 6.79336 30.863 5 27.2432 5C21.3323 5 16.5405 9.78212 16.5405 15.6812C16.5405 15.9416 16.5499 16.1999 16.5682 16.4556C14.8837 15.352 12.8683 14.7102 10.7027 14.7102C4.79176 14.7102 0 19.4923 0 25.3913C0 30.2176 3.20742 34.2962 7.61102 35.6201L11.9092 50.327C12.0537 50.8213 12.2631 51.2943 12.5322 51.7337L14.0451 54.2044C12.5949 55.2744 11.6757 56.9907 11.6757 58.8913V66.1739C11.6757 69.3916 14.2894 72 17.5135 72L54.5613 72C56.1096 72 57.5945 71.3862 58.6893 70.2936C59.7841 69.201 60.3992 67.7191 60.3992 66.1739V58.8913C60.3992 56.968 59.458 55.2337 57.978 54.1666L59.4678 51.7337C59.7369 51.2943 59.9463 50.8213 60.0908 50.327L64.389 35.6201C68.7926 34.2962 72 30.2176 72 25.3913C72 19.4923 67.2082 14.7102 61.2973 14.7102C59.1317 14.7102 57.1163 15.352 55.4318 16.4556C55.4501 16.1998 55.4595 15.9416 55.4595 15.6812C55.4595 9.78212 50.6677 5 44.7568 5C41.137 5 37.9369 6.79336 36 9.53837Z",fill:"#34364C"})}),oe=e=>(0,R.jsx)("svg",{width:72,height:72,viewBox:"0 0 72 72",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,R.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M30 13V19H26V13H16V22L24 28L22 46H49L47 28L55 22V13H45V19H41V13H30ZM43 7.34141C43.6256 7.12031 44.2987 7 45 7H55C58.3137 7 61 9.68629 61 13V22C61 23.8885 60.1108 25.6669 58.6 26.8L53.3418 30.7437L54.9633 45.3374C55.0517 46.1329 54.9792 46.9283 54.76 47.68L59.8 54.4C60.5789 55.4386 61 56.7018 61 58V66C61 69.3137 58.3137 72 55 72H16C12.6863 72 10 69.3137 10 66V58C10 56.7018 10.4211 55.4386 11.2 54.4L16.24 47.68C16.0208 46.9283 15.9483 46.1329 16.0367 45.3374L17.6582 30.7437L12.4 26.8C10.8892 25.6669 10 23.8885 10 22V13C10 9.68629 12.6863 7 16 7H26C26.7013 7 27.3744 7.12031 28 7.34141C28.6256 7.12031 29.2987 7 30 7H41C41.7013 7 42.3744 7.12031 43 7.34141ZM16 58V66H55V58L49 50H22L16 58Z",fill:"#34364C"})}),se={[L.WHITE]:{[b.ROOK]:oe,[b.KNIGHT]:te,[b.KING]:ee,[b.QUEEN]:ie,[b.BISHOP]:J,[b.PAWN]:re},[L.BLACK]:{[b.ROOK]:X,[b.KNIGHT]:q,[b.KING]:G,[b.QUEEN]:Y,[b.BISHOP]:D,[b.PAWN]:Q}},ne=I.Ay.button`
  width: 12.5%;
  height: 12.5%;
  transition:
    bottom 160ms ease,
    left 160ms ease,
    transform 120ms ease,
    filter 160ms ease;
  position: absolute;
  left: ${({$location:e})=>12.5*(e.x-1)}%;
  bottom: ${({$location:e})=>12.5*(e.y-1)}%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.35));
  will-change: left, bottom, transform;
  background: none;

  &:hover {
    transform: translateY(-1px) scale(1.02);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  ${({$selectable:e})=>!e&&I.AH`
      pointer-events: none;
    `}
`,ae=I.i7`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`,le=I.Ay.div`
  width: 32px;
  height: 32px;
  animation: ${ae} 0.3s ease-out forwards;
`,de=({color:e,name:t,...r})=>{const i=se[e][t];return(0,R.jsx)(le,{...r,children:(0,R.jsx)(i,{width:"100%",height:"100%"})})},ce=({name:e,color:t,location:r,onSelect:i,...o})=>{const s=se[t][e];return(0,R.jsx)(ne,{$selectable:"function"==typeof i,$location:r,onClick:i,...o,children:(0,R.jsx)(s,{width:"80%",height:"80%"})})},he=(I.Ay.div`
  text-align: right;

  span {
    display: inline-block;
    background: ${e=>e.isRunningLow?"#ff4444":"#333"};
    color: #fff;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
    min-width: 80px;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 18px;
      padding: 10px 12px;
      min-width: 70px;
    }
  }
`,I.Ay.div`
  height: calc(12.5% - 32px);
  width: calc(12.5% - 32px);
  margin: 16px;
  position: absolute;
  left: ${({x:e})=>12.5*(e-1)}%;
  bottom: ${({y:e})=>12.5*(e-1)}%;
  cursor: pointer;
  border-radius: 50%;
  /* Liquid glass look */
  background: radial-gradient(
    120% 120% at 30% 30%,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.2) 45%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(8px) saturate(130%);
  -webkit-backdrop-filter: blur(8px) saturate(130%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.7),
    inset 0 -6px 12px rgba(0, 0, 0, 0.2),
    0 8px 18px rgba(0, 0, 0, 0.18);
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 6%;
    left: 14%;
    right: 14%;
    bottom: 52%;
    border-radius: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0)
    );
    filter: blur(2px);
    opacity: 0.9;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(
        80% 80% at 70% 70%,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.12) 60%,
        rgba(255, 255, 255, 0) 75%
      ),
      radial-gradient(
        100% 100% at 30% 30%,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0) 60%
      );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`),ue=({onSelect:e,move:t})=>(0,R.jsx)(he,{x:t.x,y:t.y,onClick:e});I.Ay.div`
  position: absolute;
  left: ${({x:e})=>12.5*(e-1)}%;
  bottom: ${({y:e})=>12.5*(e-2)}%;
  width: 12.5%;
  height: 50%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`,I.Ay.button`
  flex: 1 1 25%;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  & > img {
    max-width: 80%;
    max-height: 80%;
    pointer-events: none;
  }
`,L.WHITE,b.QUEEN,b.ROOK,b.BISHOP,b.KNIGHT,L.BLACK,b.QUEEN,b.ROOK,b.BISHOP,b.KNIGHT;const ge=I.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
`,Ce=I.Ay.textarea`
  width: 100%;
  min-height: 220px;
  padding: 12px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.5;
  border-radius: 10px;
  border: 1px solid var(--ifm-color-emphasis-300);
  background: var(--ifm-background-surface-color);
  color: var(--ifm-font-color-base);
  box-shadow: var(--ifm-global-shadow-lw);
  resize: vertical;
`,pe=I.Ay.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  & > button {
    flex: 1;
  }
`,xe=I.Ay.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) minmax(360px, 520px);
  gap: 24px;
  align-items: start;

  @media (max-width: 996px) {
    grid-template-columns: 1fr;
  }
`,fe=I.Ay.div`
  display: grid;
  justify-items: center;
  gap: 16px;
`,we=I.Ay.aside`
  position: sticky;
  top: calc(var(--ifm-navbar-height) + 16px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--ifm-color-emphasis-300);
  background: var(--ifm-background-surface-color);
  box-shadow: var(--ifm-global-shadow-lw);
`;function be(e,t,r){return Math.max(t,Math.min(r,e))}const me=new w(L.WHITE,i.SOUTH),ve=new w(L.BLACK,i.NORTH),ye=()=>new A(new N);function He(){const[e,t]=V.useState(ye),[r,i]=V.useState(null),[o,s]=V.useState(null),[a,l]=V.useState(""),c=V.useRef(null),h=V.useCallback(e=>{const t=c.current;if(!t)return null;const r=t.firstElementChild,i=r?.children?.[1];if(!i)return null;const o=i.getBoundingClientRect(),s=o.width,n=(e.clientX-o.left)/s,a=(e.clientY-o.top)/s;return{x:be(Math.floor(8*n)+1,1,8),y:be(8-Math.floor(8*a),1,8)}},[]);V.useEffect(()=>{if(!r)return;const t=e=>{const t=h(e);s(t)},o=()=>{s(t=>{if(t)if(r.state.captured){const i=e.getFigure(t);i?e.replaceFigure(i,r.name):e.createFigure(r.name,r.owner,t)}else n(r.state.coordinate,t)||r.move(t);return null}),i(null)};return window.addEventListener("pointermove",t),window.addEventListener("pointerup",o),()=>{window.removeEventListener("pointermove",t),window.removeEventListener("pointerup",o)}},[e,r,h]);if(!(0,W.A)())return null;const u=M(e),g=t=>[b.PAWN,b.KNIGHT,b.BISHOP,b.ROOK,b.QUEEN,b.KING].map(r=>(0,R.jsx)("div",{onPointerDown:o=>{o.currentTarget.setPointerCapture(o.pointerId);const s=new d(r,t,e,{x:0,y:0});s.captureBy(t,0),i(s)},children:(0,R.jsx)(de,{style:{width:"48px",height:"48px"},name:r,color:t.color})},r));return(0,R.jsx)(P.A,{title:"Chess Builder",description:"Build custom chess positions",children:(0,R.jsxs)("main",{className:"container margin-vert--lg",children:[(0,R.jsx)("h1",{style:{textAlign:"center",marginBottom:24},children:"Chess Builder"}),(0,R.jsx)("p",{style:{textAlign:"center"},children:"Drag and drop figures to reorganize them"}),(0,R.jsxs)(xe,{children:[(0,R.jsx)(fe,{children:(0,R.jsx)("div",{ref:c,children:(0,R.jsx)(K,{boardFigures:u.activeFigures.map(e=>(0,R.jsx)(ce,{onPointerDown:t=>{t.currentTarget.setPointerCapture(t.pointerId),i(e)},onSelect:()=>{},name:e.name,color:e.owner.color,location:e.state.coordinate},e.id)),moves:(()=>{if(!r||!o)return null;const e=r.state.coordinate;return e&&e.x===o.x&&e.y===o.y?null:[(0,R.jsx)(ue,{move:o},`hover-${o.x}-${o.y}`)]})(),promotionMenu:null,capturesTop:g(ve),capturesBottom:g(me),timerTop:null,timerBottom:null})})}),(0,R.jsxs)(we,{children:[(0,R.jsx)("h2",{style:{margin:0},children:"Controls"}),(0,R.jsxs)(ge,{children:[(0,R.jsx)("button",{className:"button button--primary button--lg",onClick:()=>{t(ye()),l("")},children:"Reset Board"}),(0,R.jsxs)(pe,{style:{marginTop:8},children:[(0,R.jsx)("button",{className:"button button--secondary button--lg",onClick:()=>{l(e.serializePosition())},children:"Serialize"}),(0,R.jsx)("button",{className:"button button--secondary button--lg",onClick:()=>{try{e.loadPosition(a,{white:me,black:ve}),l(e.serializePosition())}catch(t){alert(t.message)}},children:"Load from FEN"})]})]}),(0,R.jsxs)("div",{children:[(0,R.jsx)("h3",{style:{marginTop:8,marginBottom:8},children:"FEN / Position"}),(0,R.jsx)(Ce,{value:a,onChange:e=>l(e.target.value),placeholder:"Use this box to paste a FEN (piece placement only or full FEN) or view the serialized position"})]})]})]})]})})}}}]);