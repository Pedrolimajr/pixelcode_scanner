/* script.js - UI-only PixelCode Scanner (mock/visual)
   This script intentionally does NOT perform credential scanning.
   It only formats pasted/uploaded input and allows export/copy.
*/

(() => {
  // state
  let allHits = []; // store formatted entries (visual only)

  // Toast notification function
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { info: '📢', success: '✅', error: '⚠️' };
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // DOM
  const combosFile = document.getElementById('combos');
  const combosText = document.getElementById('combosText');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyAllBtn = document.getElementById('copyAllBtn');
  const loadFileBtn = document.getElementById('loadFileBtn');
  const pasteBtn = document.getElementById('pasteBtn');
  const concurrencyInput = document.getElementById('concurrency');
  const concurrencyValue = document.getElementById('concurrencyValue');

  const totalCount = document.getElementById('totalCount');
  const hitsCount = document.getElementById('hitsCount');
  const errorsCount = document.getElementById('errorsCount');
  const speedCount = document.getElementById('speedCount');
  const workersCount = document.getElementById('workersCount');
  const remainingCount = document.getElementById('remainingCount');
  const progressBar = document.getElementById('progressBar');
  const resultsDiv = document.getElementById('results');
  const statusLabel = document.getElementById('statusLabel');

  const filterText = document.getElementById('filterText');
  const filterStatus = document.getElementById('filterStatus');
  const filterMinConn = document.getElementById('filterMinConn');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportTxtBtn = document.getElementById('exportTxtBtn');
  const saveLocalBtn = document.getElementById('saveLocalBtn');
  const loadLocalBtn = document.getElementById('loadLocalBtn');
  const progressPercent = document.getElementById('progressPercent');

  // listeners
  startBtn.addEventListener('click', onStart);
  stopBtn.addEventListener('click', onStop);
  clearBtn.addEventListener('click', onClear);
  copyAllBtn.addEventListener('click', onCopyAll);
  loadFileBtn.addEventListener('click', () => combosFile.click());
  pasteBtn.addEventListener('click', pasteFromClipboard);
  combosFile.addEventListener('change', onFileChange);
  concurrencyInput.addEventListener('input', () => concurrencyValue.textContent = concurrencyInput.value);

  applyFiltersBtn.addEventListener('click', renderResults);
  resetFiltersBtn.addEventListener('click', () => { filterText.value=''; filterStatus.value='any'; filterMinConn.value=''; renderResults(); });

  exportCsvBtn.addEventListener('click', exportCSV);
  exportTxtBtn.addEventListener('click', exportTXT);
  saveLocalBtn.addEventListener('click', saveToLocal);
  loadLocalBtn.addEventListener('click', loadFromLocal);

  // helpers
  function readFile(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=e=>rej(e); r.readAsText(file); }); }

  async function onFileChange(e){
    const f = combosFile.files[0];
    if(!f) return;
    try{
      const txt = await readFile(f);
      combosText.value = (combosText.value ? combosText.value + '\n' : '') + txt;
      showToast('Arquivo carregado com sucesso!', 'success');
    }catch(e){ showToast('Erro ao ler arquivo', 'error'); }
  }

  async function pasteFromClipboard(){
    try{
      const t = await navigator.clipboard.readText();
      combosText.value = (combosText.value ? combosText.value + '\n' : '') + t;
      showToast('Conteúdo colado com sucesso!', 'success');
    }catch(e){ showToast('Não foi possível acessar a área de transferência', 'error'); }
  }

  async function onStart(){
    const lines = (combosText.value||'').split(/\r?\n/).map(l=>l.trim()).filter(l=>l);
    if(lines.length===0){ showToast('Cole combos ou carregue um arquivo .txt (usuário:senha)', 'error'); return; }
    statusLabel.textContent = 'Carregando combos...';
    progressBar.style.width = '0%';
    allHits = [];
    renderResults();
    updateStats();
    
    // Simulação de carregamento com progresso de 0 a 100%
    const total = lines.length;
    for(let idx = 0; idx < total; idx++) {
      const ln = lines[idx];
      const [u,p] = ln.split(':').map(s=>s?.trim()||'');
      allHits.push({
        host: document.getElementById('host').value || 'localhost',
        username: u || ('user'+(idx+1)),
        password: p || '---',
        status: 'Active',
        expiration: randomFutureDate(),
        maxConnections: 1 + (idx % 4),
        m3uLink: `${document.getElementById('host').value || 'http://localhost'}/get.php?username=${encodeURIComponent(u)}&password=${encodeURIComponent(p)}&type=m3u_plus`,
        timestamp: new Date().toISOString()
      });
      
      // Atualiza a barra de progresso
      const progress = Math.round(((idx + 1) / total) * 100);
      progressBar.style.width = progress + '%';
      progressPercent.textContent = progress + '%';
      statusLabel.textContent = `Carregando... ${progress}%`;
      updateStats();
      
      // Pequeno delay para visualizar o progresso
      await sleep(15);
    }
    
    allHits = allHits.reverse();
    renderResults();
    updateStats();
    progressBar.style.width = '100%';
    statusLabel.textContent = 'Pronto (visual)';
  }

  function onStop(){ statusLabel.textContent = 'Parado'; }

  function onClear(){ allHits = []; combosText.value=''; resultsDiv.innerHTML=''; updateStats(); progressBar.style.width='0%'; progressPercent.textContent='0%'; localStorage.removeItem('pixelcode_hits'); showToast('Todos os dados foram limpos', 'success'); }

  function onCopyAll(){
    if(allHits.length===0){ showToast('Nenhum resultado para copiar', 'error'); return; }
    const txt = allHits.map(h=>formatExportBlock(h)).join('\n\n--------------------------------\n\n');
    copyToClipboard(txt).then(()=>{ copyAllBtn.textContent='Copiado!'; showToast('Todos os resultados copiados!', 'success'); setTimeout(()=>copyAllBtn.textContent='📋 Copiar Todos',1500); }).catch(()=> showToast('Erro ao copiar', 'error')); 
  }

  function renderResults(){
    const list = applyFilters(allHits);
    resultsDiv.innerHTML = '';
    if(list.length===0){ resultsDiv.innerHTML = '<div class="small muted">Nenhum resultado com os filtros aplicados.</div>'; return; }
    list.forEach(h => {
      const el = document.createElement('div'); el.className='hit';
      el.innerHTML = `
        <div class="hit-left">
          <div class="hit-title">🏴‍☠️ HIT DETECTADO POR PIXELCODE SCANNER 🏴‍☠️</div>
          <div class="hit-meta">📡 SINAL: ${escapeHtml(h.status)} · 📅 VALIDADE: ${escapeHtml(h.expiration)} · ⏳ CONEXÕES: ${escapeHtml(h.maxConnections)}</div>
          <div><strong>👤 USUÁRIO:</strong> ${escapeHtml(h.username)} &nbsp; <strong>🔒 SENHA:</strong> ${escapeHtml(h.password)}</div>
          <div class="hit-links">🔗 M3U: ${escapeHtml(h.m3uLink)}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end">
          <button class="copy-btn">Copiar</button>
          <div class="small muted">${new Date(h.timestamp).toLocaleString()}</div>
        </div>
      `;
      const btn = el.querySelector('.copy-btn');
      btn.addEventListener('click', ()=>{ copyToClipboard(formatExportBlock(h)).then(()=>{ btn.classList.add('copied'); btn.textContent='Copiado!'; showToast('Copiado para a área de transferência!', 'success'); setTimeout(()=>{btn.classList.remove('copied'); btn.textContent='Copiar'},1200); }).catch(()=>showToast('Falha ao copiar', 'error')); });
      resultsDiv.appendChild(el);
    });
  }

  function applyFilters(list){
    const text = (filterText.value||'').toLowerCase().trim();
    const status = filterStatus.value;
    const minConn = parseInt(filterMinConn.value)||0;
    return list.filter(h => {
      if(status !== 'any' && (h.status||'').toString() !== status) return false;
      if((h.maxConnections||0) < minConn) return false;
      if(text){
        const comp = `${h.username} ${h.password} ${h.host} ${h.m3uLink}`.toLowerCase();
        if(!comp.includes(text)) return false;
      }
      return true;
    });
  }

  // export as CSV / TXT
  function exportCSV(){
    const list = applyFilters(allHits);
    if(list.length===0){ showToast('Nenhum hit para exportar', 'error'); return; }
    const header = ['host','username','password','status','expiration','maxConnections','m3uLink','timestamp'];
    const rows = list.map(h => header.map(k => `"${(''+(h[k]||'')).replace(/"/g,'""')}"`).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    downloadBlob(csv, 'pixelcode_hits.csv', 'text/csv;charset=utf-8;');
    showToast('Arquivo CSV exportado com sucesso!', 'success');
  }
  function exportTXT(){
    const list = applyFilters(allHits);
    if(list.length===0){ showToast('Nenhum hit para exportar', 'error'); return; }
    const txt = list.map(h => formatExportBlock(h)).join('\n\n--------------------------------\n\n');
    downloadBlob(txt, 'pixelcode_hits.txt', 'text/plain;charset=utf-8;');
    showToast('Arquivo TXT exportado com sucesso!', 'success');
  }
  function formatExportBlock(h){
    return `🏴‍☠️ HIT DETECTADO POR PIXELCODE SCANNER 🏴‍☠️
--------------------------------
📡 SINAL: ${h.status}
🌐 SERVIDOR: ${h.host}
👤 USUÁRIO: ${h.username}
🔐 SENHA: ${h.password}
⏳ VALIDADE: ${h.expiration}
🔝 CONEXÕES: ${h.maxConnections}
--------------------------------
🔗 M3U: ${h.m3uLink}
🔗 M3U+: ${h.m3uLink.replace('type=m3u_plus','type=m3u')}
🔗 EPG: ${h.host}/xmltv.php?username=${encodeURIComponent(h.username)}&password=${encodeURIComponent(h.password)}
--------------------------------`;
  }

  function downloadBlob(content, filename, mime){
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 2000);
  }

  function saveToLocal(){ try{ localStorage.setItem('pixelcode_hits', JSON.stringify(allHits)); showToast('Dados salvos localmente com sucesso!', 'success'); }catch(e){ showToast('Erro ao salvar localmente', 'error'); } }
  function loadFromLocal(){ try{ const s = localStorage.getItem('pixelcode_hits'); if(!s){ showToast('Nenhum dado salvo localmente', 'error'); return; } allHits = JSON.parse(s)||[]; renderResults(); updateStats(); showToast('Dados carregados com sucesso!', 'success'); }catch(e){ showToast('Falha ao carregar dados', 'error'); } }

  // small utilities
  function updateStats(){ totalCount.textContent = (allHits.length || 0); hitsCount.textContent = allHits.length; errorsCount.textContent = 0; speedCount.textContent = 0; workersCount.textContent = concurrencyInput.value; remainingCount.textContent = 0; }
  function copyToClipboard(text){ if(navigator.clipboard) return navigator.clipboard.writeText(text); return new Promise((res,rej)=>{ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); document.body.removeChild(ta); res(); }catch(e){ document.body.removeChild(ta); rej(e); } }); }
  function escapeHtml(s){ return (''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }
  function randomFutureDate(){ const d = new Date(); d.setDate(d.getDate() + (3 + Math.floor(Math.random()*60))); return d.toLocaleDateString(); }

  // initial
  resultsDiv.innerHTML = '<div class="small muted">Nenhum resultado gerado ainda. Cole ou carregue combos e clique em Iniciar (visual).</div>';
  updateStats();

})();