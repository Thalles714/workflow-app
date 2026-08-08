(function(){
  const body=document.body;
  const page=body.dataset.page||'operation';
  const roots={login:'../login/',operation:'../operation/',myWork:'../my-work/',clients:'../clients/',client:'../client/',project:'../project/',deliverable:'../deliverable/',task:'../task/',approvals:'../approvals/',denied:'../access-denied/'};
  const nav=[['operation','Painel','⌁','4'],['myWork','Meu Trabalho','✓',''],['clients','Clientes','◇',''],['project','Projetos','▱',''],['approvals','Aprovações','◎','3']];
  function shell(){
    if(page==='login')return;
    const app=document.querySelector('.app');
    const links=nav.map(([key,label,icon,count])=>`<a class="nav-link" href="${roots[key]}" ${page===key?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icon}</span>${label}${count?`<span class="nav-count">${count}</span>`:''}</a>`).join('');
    app.insertAdjacentHTML('afterbegin',`<a class="skip-link" href="#main">Pular para o conteúdo</a><aside class="sidebar" aria-label="Navegação principal"><a class="brand" href="${roots.operation}" aria-label="Workflow, início"><span class="brand-mark">W</span><strong>Workflow</strong></a><button class="workspace-switch" type="button" aria-label="Trocar workspace"><span class="workspace-logo">AA</span><span><b>Agência Aurora</b><small>workspace de demonstração</small></span><span aria-hidden="true">⌄</span></button><nav class="nav-group" aria-label="Produto"><div class="nav-label">Operação</div>${links}</nav><nav class="nav-group" aria-label="Cadastros"><div class="nav-label">Contexto</div><a class="nav-link" href="${roots.client}" ${page==='client'?'aria-current="page"':''}><span class="nav-icon">◫</span>Órbita</a><a class="nav-link" href="${roots.deliverable}" ${page==='deliverable'?'aria-current="page"':''}><span class="nav-icon">◉</span>Entrega ativa</a></nav><div class="sidebar-foot"><div class="user-chip"><span class="avatar">TM</span><span><b>Thalles Martins</b><small>Administrador</small></span></div></div></aside><header class="mobile-topbar"><a class="brand" href="${roots.operation}"><span class="brand-mark">W</span><strong>Workflow</strong></a><button class="icon-btn mobile-menu" type="button" aria-label="Abrir menu" aria-expanded="false">☰</button></header>`);
  }
  shell();
  document.querySelectorAll('button:not([type])').forEach(button=>{button.type='button'});
  document.querySelectorAll('nav.breadcrumbs:not([aria-label])').forEach(nav=>{nav.setAttribute('aria-label','Breadcrumb')});
  const menu=document.querySelector('.mobile-menu');
  if(menu)menu.addEventListener('click',()=>{const open=body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));if(open)document.querySelector('.sidebar a')?.focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&body.classList.contains('menu-open')){body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.focus()}});
  const params=new URLSearchParams(location.search);
  const states=['normal','loading','empty','error','denied'];
  const requested=states.includes(params.get('state'))?params.get('state'):'normal';
  document.querySelectorAll('.state-panel').forEach(el=>el.dataset.active=String(el.dataset.state===requested));
  function setParam(key,value){const u=new URL(location.href);u.searchParams.set(key,value);location.href=u.href}
  const bar=document.createElement('div');bar.className='prototype-bar';bar.setAttribute('aria-label','Controles do protótipo');
  bar.innerHTML=`<span class="prototype-label">Protótipo · ${page}</span><select class="prototype-select" aria-label="Estado da tela">${states.map(s=>`<option value="${s}" ${s===requested?'selected':''}>estado: ${s}</option>`).join('')}</select>`;
  bar.querySelector('select')?.addEventListener('change',e=>setParam('state',e.target.value));document.body.appendChild(bar);
  document.querySelectorAll('[data-tabs]').forEach((group,groupIndex)=>{
    const tabs=[...group.querySelectorAll('[data-tab]')];
    const panels=[...group.querySelectorAll('[data-panel]')];
    function activate(tab,moveFocus=false){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});panels.forEach(p=>p.hidden=p.dataset.panel!==tab.dataset.tab);if(moveFocus)tab.focus()}
    tabs.forEach((tab,index)=>{const tabId=`prototype-tab-${groupIndex}-${tab.dataset.tab}`;const panel=panels.find(p=>p.dataset.panel===tab.dataset.tab);tab.id=tabId;tab.setAttribute('aria-controls',`${tabId}-panel`);tab.tabIndex=tab.getAttribute('aria-selected')==='true'?0:-1;if(panel){panel.id=`${tabId}-panel`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tabId);panel.tabIndex=0}tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();activate(tabs[next],true)})});
  });
  document.querySelectorAll('[data-toast]').forEach(btn=>btn.addEventListener('click',()=>{const toast=document.createElement('div');toast.setAttribute('role','status');toast.textContent=btn.dataset.toast;Object.assign(toast.style,{position:'fixed',right:'18px',top:'18px',zIndex:300,padding:'13px 16px',border:'1px solid var(--border)',borderRadius:'9px',background:'#fff',boxShadow:'var(--shadow-md)',fontSize:'10px'});document.body.appendChild(toast);setTimeout(()=>toast.remove(),2200)}));
})();
