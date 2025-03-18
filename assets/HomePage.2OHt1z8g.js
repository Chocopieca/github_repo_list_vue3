var W=Object.defineProperty;var Z=(t,e,s)=>e in t?W(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var N=(t,e,s)=>Z(t,typeof e!="symbol"?e+"":e,s);import{d as Q,r as E,c as k,w as X,a as b,b as y,o as h,e as p,f as ee,g as q,n as te,h as M,t as x,m as V,i as se,j as oe,k as ne,u as w,v as re,F,l as Y,p as A,_ as L,q as R,T as ae,s as D,x as ie,y as ce,z as le,A as de,B as S,C as $,D as ue,E as pe,G as O}from"./index.CD8aN9J8.js";import{u as me}from"./githubAuth.FFXAwXST.js";const J=Q("modal",()=>{const t=E([]),e=k(()=>t.value.length>0);X(e,o=>{o?document.body.style.overflow="hidden":document.body.style.overflow=""});function s(o){const r=crypto.randomUUID(),l=1e3+t.value.length,c={...o,id:r,zIndex:l};return t.value.push(c),r}function n(o){const r=t.value.findIndex(l=>l.id===o);r!==-1&&t.value.splice(r,1)}function i(){t.value=[]}return{modals:t,isAnyModalOpen:e,openModal:s,closeModal:n,closeAllModals:i}});var I=(t=>(t.ERROR="error",t.DYNAMIC="dynamic",t.CONFIRMATION="confirmation",t))(I||{});function P(){const t=J();return{showError:(r,l)=>t.openModal({type:I.ERROR,message:r,title:l}),showDynamic:(r,l,c)=>t.openModal({type:I.DYNAMIC,component:r,props:l,title:c}),showConfirmation:(r,l,{title:c,confirmText:a="Confirm",cancelText:m="Cancel",onCancel:f}={})=>t.openModal({type:I.CONFIRMATION,message:r,title:c,confirmText:a,cancelText:m,onConfirm:l,onCancel:f}),closeModal:r=>{t.closeModal(r)},closeAllModals:()=>{t.closeAllModals()}}}const he={class:"space-y-3"},fe=b({__name:"UrlDialog",props:{repoUrl:{default:""},ownerUrl:{default:""},modalId:{}},setup(t){const e=t,s=P(),n=()=>{s.closeModal(e.modalId)},i=o=>{window.open(o,"_blank"),n()};return(o,r)=>(h(),y("div",he,[p("button",{onClick:r[0]||(r[0]=l=>i(o.repoUrl)),class:"w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"}," Repository URL "),p("button",{onClick:r[1]||(r[1]=l=>i(o.ownerUrl)),class:"w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"}," Owner URL ")]))}}),_e={class:"text-xl font-bold text-gray-800 mb-2"},ge={key:0,class:"text-gray-600 mb-3"},ye={class:"flex items-center text-sm text-gray-500"},ve={class:"font-medium"},we=b({__name:"RepoCard",props:{repository:{}},setup(t){const e=t,s=P(),n=k(()=>({"p-4 rounded-lg shadow-md mb-4 transition-colors cursor-pointer":!0,"bg-blue-50":!e.repository.has_wiki,"bg-white":e.repository.has_wiki})),i=k(()=>({repoUrl:e.repository.html_url,ownerUrl:e.repository.owner.html_url,title:"Choose URL to open"})),o=()=>{s.showDynamic(V(fe),i.value)},r=k(()=>e.repository.description||"");return(l,c)=>{const a=ee("long-press");return q((h(),y("div",{class:te(n.value)},[p("h2",_e,x(l.repository.name),1),r.value?(h(),y("p",ge,x(r.value),1)):M("",!0),p("div",ye,[c[0]||(c[0]=p("span",{class:"mr-2"},"Owner:",-1)),p("span",ve,x(l.repository.owner.login),1)])],2)),[[a,{onLongPress:o,delay:500}]])}}}),be=()=>{const t=E(new Map),e=(c,a)=>a?`${a}:${c}`:c;return{set:(c,a,m={})=>{const f=m.ttl||3e5,C=e(c,m.prefix);t.value.set(C,{data:a,timestamp:Date.now(),ttl:f})},get:(c,a={})=>{const m=e(c,a.prefix),f=t.value.get(m);return f?Date.now()-f.timestamp>f.ttl?(t.value.delete(m),null):f.data:null},has:(c,a={})=>{const m=e(c,a.prefix),f=t.value.get(m);return f?Date.now()-f.timestamp>f.ttl?(t.value.delete(m),!1):!0:!1},remove:(c,a={})=>{const m=e(c,a.prefix);t.value.delete(m)},removeByPrefix:c=>{for(const a of t.value.keys())a.startsWith(`${c}:`)&&t.value.delete(a)},clear:()=>t.value.clear(),getCacheKey:(c,a,m)=>{const f=a?new URLSearchParams(Object.entries(a).map(([j,K])=>[j,String(K)])):"",C=`${c}${f?`?${f}`:""}`;return e(C,m)}}};class H extends Error{constructor(e){super(e),this.name=this.constructor.name}}class T extends H{constructor(e,s,n,i){super(e),this.status=s,this.originalError=n,this.details=i}}class G extends H{constructor(){super("Network error occurred")}}class xe extends H{constructor(e){super("An unknown error occurred"),this.originalError=e}}class z extends T{constructor(e,s){super(e,403,s)}}class Ee{static async createError(e){var s;if(e instanceof Response){let n;try{n=await e.json()}catch{n={message:e.statusText}}return e.status===403&&((s=n.message)!=null&&s.includes("API rate limit exceeded"))?new z(n.message,e):new T(n.message||`HTTP Error ${e.status}`,e.status,e,n.details)}return e instanceof TypeError&&e.message==="Failed to fetch"?new G:e instanceof T||e instanceof G||e instanceof z?e:new xe(e)}}const Re={class:"p-6"},Ie={class:"text-black text-xl font-bold mb-4"},Ce=b({__name:"GithubAuthModal",props:{title:{}},setup(t){const e=()=>{const s="Ov23liVGFpU5jgw8L93s",n=`${window.location.origin}/auth/callback`,i="repo",o=Math.random().toString(36).substring(7);localStorage.setItem("github_auth_state",o);const r=new URL("https://github.com/login/oauth/authorize");r.searchParams.append("client_id",s),r.searchParams.append("redirect_uri",n),r.searchParams.append("scope",i),r.searchParams.append("state",o),window.location.href=r.toString()};return(s,n)=>(h(),y("div",Re,[p("h2",Ie,x(s.title),1),n[0]||(n[0]=p("p",{class:"text-black mb-6"}," You've reached the GitHub API rate limit. Please authenticate with GitHub to increase your rate limit. ",-1)),p("button",{onClick:e,class:"bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"}," Authenticate with GitHub ")]))}}),ke=()=>{const t=E({isVisible:!1,message:""}),e=P(),s=r=>{t.value={isVisible:!0,message:r}},n=()=>{t.value.isVisible=!1},i=()=>{e.showDynamic(V(Ce),{title:"GitHub Authentication Required"})};return{handleError:async r=>{const l=await Ee.createError(r);return l instanceof z?i():l instanceof T?s(`API Error: ${l.message}`):l instanceof G?s("Network Error: Please check your internet connection"):s("An unexpected error occurred. Please try again later"),l},modalState:t,showErrorModal:s,hideErrorModal:n}},Me=(t={})=>{const e=E(t.baseURL||""),s=E(t.headers||{}),n=be(),i=ke(),o=(d,u)=>{const _=new URL(d,e.value);return u&&Object.entries(u).forEach(([v,g])=>{g!=null&&_.searchParams.append(v,String(g))}),_.toString()},r=(d={})=>{const u={method:d.method||"GET",headers:{"Content-Type":"application/json",...s.value,...d.headers}};return d.body&&(u.body=JSON.stringify(d.body)),u},l=async d=>{if(!d.ok)throw d;return d.json()},c=(d,u={})=>{var _,v;if(((_=u.cache)==null?void 0:_.enabled)!==!1){const g=n.get(d,{prefix:"api",ttl:(v=u.cache)==null?void 0:v.ttl});if(g)return g}return null},a=(d,u,_={})=>{var v,g;((v=_.cache)==null?void 0:v.enabled)!==!1&&n.set(d,u,{prefix:"api",ttl:(g=_.cache)==null?void 0:g.ttl})},m=async(d,u={})=>{try{const _=o(d,u.params),v=r(u),g=await fetch(_,v);return await l(g)}catch(_){throw await i.handleError(_)}};return{get:async(d,u={})=>{const _=n.getCacheKey(d,u.params,"api"),v=c(_,u);if(v)return v;const g=await m(d,{...u,method:"GET"});return a(_,g,u),g},post:async(d,u,_={})=>m(d,{..._,method:"POST",body:u}),put:async(d,u,_={})=>m(d,{..._,method:"PUT",body:u}),delete:async(d,u={})=>m(d,{...u,method:"DELETE"}),baseURL:e,defaultHeaders:s,cache:n,errorHandler:i}};class Pe{constructor(e={}){N(this,"api");this.api=Me(e)}getHeaders(){return{"Content-Type":"application/json",Accept:"application/json"}}}const U={GITHUB_API_URL:"https://api.github.com",DEFAULT_PER_PAGE:10,DEFAULT_ORGANIZATION:"nodejs",GITHUB_TOKEN:""};class Ae extends Pe{constructor(s){super({baseURL:s.baseURL});N(this,"authStore",me())}getHeaders(){const s={...super.getHeaders(),Accept:"application/vnd.github.v3+json"},n=this.authStore.token||U.GITHUB_TOKEN;return n&&(s.Authorization=`Bearer ${n}`),s}async fetchPublicRepositories(s){return(await this.api.get("/search/repositories",{params:{q:`org:${s.organization}`,page:s.page||1,per_page:s.per_page||U.DEFAULT_PER_PAGE,sort:"updated",order:"desc"},headers:this.getHeaders(),cache:{enabled:!0,ttl:3e5}})).items}}const Se=()=>new Ae({baseURL:U.GITHUB_API_URL});function $e(){const t=E([]),e=E(!1),s=E(1),n=Se(),i=()=>{sessionStorage.setItem("scrollPosition",window.scrollY.toString()),sessionStorage.setItem("repositories",JSON.stringify(t.value)),sessionStorage.setItem("currentPage",s.value.toString())};let o=null;const r=()=>{o&&window.clearTimeout(o),o=window.setTimeout(()=>{i()},100)},l=async()=>{if(!e.value)try{e.value=!0;const a=await n.fetchPublicRepositories({organization:"nodejs",page:s.value,per_page:U.DEFAULT_PER_PAGE});t.value.push(...a),s.value++,i()}catch(a){console.error("Failed to load repositories:",a)}finally{e.value=!1}},c=async()=>{const a=sessionStorage.getItem("repositories"),m=sessionStorage.getItem("currentPage"),f=sessionStorage.getItem("scrollPosition");a&&(t.value=JSON.parse(a)),m&&(s.value=parseInt(m)),f&&(await ne(),setTimeout(()=>{window.scrollTo({top:parseInt(f),behavior:"instant"})},100))};return se(()=>{c(),t.value.length===0&&l(),window.addEventListener("scroll",r)}),oe(()=>{window.removeEventListener("scroll",r),o&&window.clearTimeout(o)}),{repositories:t,loading:e,loadRepositories:l}}const Te={class:"repositories-list"},Ue={key:0,class:"empty-list"},Le={key:2,class:"loading-indicator"},De=b({__name:"RepoList",setup(t){const{repositories:e,loading:s,loadRepositories:n}=$e();return(i,o)=>q((h(),y("div",Te,[w(e).length===0?(h(),y("div",Ue,o[0]||(o[0]=[p("span",null,"No repositories found",-1)]))):(h(!0),y(F,{key:1},Y(w(e),r=>(h(),y("div",{key:r.id},[A(we,{repository:r},null,8,["repository"])]))),128)),w(s)?(h(),y("div",Le,o[1]||(o[1]=[p("span",null,"Loading more repositories...",-1)]))):M("",!0)])),[[w(re),{onLoadMore:w(n),disabled:w(s),threshold:200}]])}}),Ne=L(De,[["__scopeId","data-v-e32c2e13"]]),Oe={class:"modal-header"},Fe={key:0,class:"modal-title"},Ge={class:"modal-content"},ze=b({__name:"BaseModal",props:{id:{},type:{},title:{},zIndex:{}},setup(t){const e=t,s=P(),n=()=>{s.closeModal(e.id)};return(i,o)=>(h(),R(ae,{to:"body"},[A(ie,{name:"modal"},{default:D(()=>[e.id?(h(),y("div",{key:0,class:"modal-overlay",style:ce({zIndex:e.zIndex}),onClick:n},[p("div",{class:"modal-container",onClick:o[0]||(o[0]=le(()=>{},["stop"]))},[p("div",Oe,[e.title?(h(),y("h3",Fe,x(e.title),1)):M("",!0),p("button",{class:"modal-close",onClick:n},"×")]),p("div",Ge,[de(i.$slots,"default",{},void 0,!0)])])],4)):M("",!0)]),_:3})]))}}),B=L(ze,[["__scopeId","data-v-31f8d9ff"]]),He={class:"error-content"},Be={class:"error-message"},je=b({__name:"ErrorModal",props:{message:{},type:{},id:{},title:{},zIndex:{}},setup(t){return(e,s)=>(h(),R(B,S($(e.$props)),{default:D(()=>[p("div",He,[s[0]||(s[0]=p("div",{class:"error-icon"},"⚠️",-1)),p("p",Be,x(e.message),1)])]),_:1},16))}}),Ke=L(je,[["__scopeId","data-v-fab82af3"]]),qe={class:"confirmation-content"},Ve={class:"confirmation-message"},Ye={class:"confirmation-actions"},Je=b({__name:"ConfirmationModal",props:{message:{},confirmText:{},cancelText:{},onConfirm:{type:Function},onCancel:{type:Function},type:{},id:{},title:{},zIndex:{}},setup(t){const e=t,s=P(),n=()=>{e.onConfirm(),s.closeModal(e.id)},i=()=>{var o;(o=e.onCancel)==null||o.call(e),s.closeModal(e.id)};return(o,r)=>(h(),R(B,S($(o.$props)),{default:D(()=>[p("div",qe,[p("p",Ve,x(o.message),1),p("div",Ye,[p("button",{class:"btn btn-secondary",onClick:i},x(o.cancelText),1),p("button",{class:"btn btn-primary",onClick:n},x(o.confirmText),1)])])]),_:1},16))}}),We=L(Je,[["__scopeId","data-v-5f17b7c7"]]),Ze=b({__name:"DynamicModal",props:{component:{},props:{},type:{},id:{},title:{},zIndex:{}},setup(t){const e=t,s=k(()=>({id:e.id,type:e.type,title:e.title,zIndex:e.zIndex})),n=k(()=>({...e.props||{},modalId:e.id}));return(i,o)=>(h(),R(B,S($(s.value)),{default:D(()=>[(h(),R(ue(e.component),S($(n.value)),null,16))]),_:1},16))}}),Qe=b({__name:"ModalManager",setup(t){const e=J(),{modals:s}=pe(e);return(n,i)=>(h(!0),y(F,null,Y(w(s),o=>(h(),y(F,{key:o.id},[o.type===w(I).ERROR?(h(),R(Ke,O({key:0,ref_for:!0},o),null,16)):o.type===w(I).CONFIRMATION?(h(),R(We,O({key:1,ref_for:!0},o),null,16)):o.type===w(I).DYNAMIC?(h(),R(Ze,O({key:2,ref_for:!0},o),null,16)):M("",!0)],64))),128))}}),Xe={class:"container"},ot=b({__name:"HomePage",setup(t){return(e,s)=>(h(),y("div",Xe,[s[0]||(s[0]=p("h1",{class:"text-2xl font-bold mb-6"},"Node.js Repositories",-1)),A(Ne),A(Qe)]))}});export{ot as default};
