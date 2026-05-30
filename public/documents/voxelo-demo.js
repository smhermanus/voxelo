/* ============================================================
   VOXELO — Live demo engine
   - 6 industry agent personas
   - Real chat via window.claude.complete
   - Simulated call: speechSynthesis voice + animated Voice Wave + captions
   ============================================================ */
(function(){
  "use strict";

  // ---- Voice Wave SVG (re-used) ----
  function waveSVG(cls){
    return '<svg class="vmark '+(cls||'')+'" viewBox="0 0 100 100">'
      + '<rect class="bubble" x="14" y="16" width="72" height="52" rx="18"/>'
      + '<path class="bubble" d="M30 58 L26 82 L52 62 Z"/>'
      + '<g class="wave"><rect x="29.5" y="36" width="5" height="12" rx="2.5"/><rect x="38.5" y="31" width="5" height="22" rx="2.5"/><rect x="47.5" y="26" width="5" height="32" rx="2.5"/><rect x="56.5" y="31" width="5" height="22" rx="2.5"/><rect x="65.5" y="36" width="5" height="12" rx="2.5"/></g></svg>';
  }

  // ---- Industry personas ----
  const RULES = "You are Vox, a friendly, sharp AI customer-service agent made by Voxelo. "
    + "Keep replies SHORT — 1 to 3 sentences, conversational, no markdown, no bullet lists. "
    + "You may invent plausible specifics (order numbers, dates, amounts) to make the demo feel real. "
    + "Be warm and proactive; end by offering a clear next step when it fits. "
    + "Never say you are Claude or a language model — you are Vox. Stay fully in character.";

  const INDUSTRIES = [
    {
      id:'retail', name:'Lumen Goods', tag:'Retail & E-commerce',
      icon:'<path d="M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5z"/><path d="M8.5 7a3.5 3.5 0 0 1 7 0"/>',
      greet:"Hi! I'm Vox, your Lumen Goods assistant. I can track orders, start returns, or help you find something. What's up?",
      quick:["Where's my order?","Start a return","Do you ship internationally?"],
      persona:"You work for Lumen Goods, a premium home & lifestyle online store. You help with order tracking, returns/exchanges, shipping, and product questions."
    },
    {
      id:'insurance', name:'Harbor Mutual', tag:'Insurance',
      icon:'<path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/><path d="m9 12 2 2 4-4"/>',
      greet:"Hello, I'm Vox at Harbor Mutual. I can help you file a claim, get a quote, or understand your coverage. How can I help today?",
      quick:["File a claim","Get a car quote","What does my policy cover?"],
      persona:"You work for Harbor Mutual, an insurance provider (auto, home, life). You help file and track claims, generate quotes, and explain coverage. Be reassuring and clear."
    },
    {
      id:'health', name:'Meridian Health', tag:'Healthcare',
      icon:'<path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="9"/>',
      greet:"Hi, I'm Vox with Meridian Health. I can book appointments, help with prescriptions, or point you to the right care. What do you need?",
      quick:["Book an appointment","I have a sore throat","Refill a prescription"],
      persona:"You work for Meridian Health, a clinic network. You help schedule appointments, refill prescriptions, and give general, non-diagnostic guidance. For anything clinical, gently recommend seeing a provider and never give a firm diagnosis. Be calm and caring."
    },
    {
      id:'telecom', name:'Nova Mobile', tag:'Telecom',
      icon:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
      greet:"Hey, I'm Vox from Nova Mobile. I can fix connection issues, explain your bill, or upgrade your plan. What's going on?",
      quick:["My internet is down","Explain my bill","Upgrade my plan"],
      persona:"You work for Nova Mobile, a mobile & internet carrier. You help troubleshoot connectivity, explain charges, and change plans. Walk through fixes step by step, one step at a time."
    },
    {
      id:'bank', name:'Arc Bank', tag:'Banking & Fintech',
      icon:'<path d="M3 10 12 4l9 6"/><path d="M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"/>',
      greet:"Hi, I'm Vox at Arc Bank. I can check balances, flag suspicious charges, or move money — securely. How can I help?",
      quick:["Check my balance","I see a suspicious charge","Send a payment"],
      persona:"You work for Arc Bank, a digital bank. You help with balances, transactions, fraud/disputes, and payments. Be security-conscious: for sensitive actions mention you'd verify identity first. Be precise and trustworthy."
    },
    {
      id:'travel', name:'Wander', tag:'Travel & Hospitality',
      icon:'<path d="M2 12h20M2 12l4-7 3 7M22 12l-4 7-3-7"/><path d="M9 12l3-9 3 9"/>',
      greet:"Hi! I'm Vox from Wander. I can change flights, book hotels, or rescue a tight itinerary. Where are we headed?",
      quick:["Change my flight","Book a hotel","Cancel a reservation"],
      persona:"You work for Wander, a travel booking service. You help change flights, book hotels, and manage reservations. Be upbeat and solution-oriented; offer concrete options with times and prices."
    },
    {
      id:'realestate', name:'Keystone Realty', tag:'Real Estate',
      icon:'<path d="M3 11 12 4l9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>',
      greet:"Hi, I'm Vox at Keystone Realty. I can book viewings, pull up listing details, or give you a quick home valuation. What are you after?",
      quick:["Book a viewing","What's my home worth?","Show 2-bed listings"],
      persona:"You work for Keystone Realty, a residential real-estate agency. You help schedule property viewings, answer listing questions (price, size, area), capture buyer and seller leads, and give rough ballpark valuations — always noting a formal valuation follows. Be friendly and proactive."
    },
    {
      id:'saas', name:'Stacklane', tag:'SaaS & Tech support',
      icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8.5 10-2 2 2 2"/><path d="m14 10 2 2-2 2"/>',
      greet:"Hey, I'm Vox from Stacklane support. I can reset access, sort out billing, or troubleshoot an issue. What's going on?",
      quick:["Reset my password","Upgrade my plan","Report a bug"],
      persona:"You provide support for Stacklane, a B2B SaaS product. You help with account access, billing and plans, onboarding, and basic troubleshooting. For a confirmed bug, log a ticket and give a reference number. Be technical but clear and concise."
    }
  ];

  // ---- State ----
  let current = INDUSTRIES[0];
  let history = [];          // {role, content}
  let mode = 'chat';         // 'chat' | 'call'
  let busy = false;
  let callTimer = null, callSeconds = 0;
  let muted = false;

  // ---- DOM refs ----
  const $ = (s,r)=> (r||document).querySelector(s);
  const indList   = $('#indList');
  const chatLog   = $('#chatLog');
  const quickRow  = $('#quickRow');
  const chatInput = $('#chatInput');
  const sendBtn   = $('#sendBtn');
  const scrWho    = $('#scrWho');
  const scrTag    = $('#scrTag');
  const segChat   = $('#segChat');
  const segCall   = $('#segCall');
  const chatView  = $('#chatView');
  const callView  = $('#callView');
  const callName  = $('#callName');
  const callTime  = $('#callTime');
  const callOrb   = $('#callOrb');
  const callCap   = $('#callCaption');
  const callQuick = $('#callQuick');
  const micBtn    = $('#micBtn');
  const muteBtn   = $('#muteBtn');

  // ---- Build industry selector ----
  INDUSTRIES.forEach((ind,i)=>{
    const b = document.createElement('button');
    b.className = 'ind-btn' + (i===0?' active':'');
    b.dataset.id = ind.id;
    b.innerHTML = '<span class="ico-box"><svg viewBox="0 0 24 24">'+ind.icon+'</svg></span>'
      + '<span class="meta"><span class="t">'+ind.name+'</span><span class="s">'+ind.tag+'</span></span>';
    b.addEventListener('click', ()=> selectIndustry(ind.id));
    indList.appendChild(b);
  });

  function selectIndustry(id){
    if(busy) return;
    current = INDUSTRIES.find(x=>x.id===id) || INDUSTRIES[0];
    document.querySelectorAll('.ind-btn').forEach(b=> b.classList.toggle('active', b.dataset.id===id));
    scrWho.textContent = current.name;
    scrTag.innerHTML = '<span class="dot-live"></span> Vox · AI agent';
    resetConversation();
    if(mode==='call'){ startCall(); }
  }

  function resetConversation(){
    history = [];
    chatLog.innerHTML = '';
    addMessage('bot', current.greet, false);
    history.push({role:'assistant', content: current.greet});
    renderQuick();
  }

  function renderQuick(){
    quickRow.innerHTML = '';
    current.quick.forEach(q=>{
      const b = document.createElement('button');
      b.textContent = q;
      b.addEventListener('click', ()=>{ if(!busy){ sendUser(q); } });
      quickRow.appendChild(b);
    });
  }

  // ---- Chat rendering ----
  function addMessage(role, text){
    const d = document.createElement('div');
    d.className = 'msg ' + (role==='user'?'user':'bot');
    d.textContent = text;
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
    return d;
  }
  function showTyping(){
    const t = document.createElement('div');
    t.className = 'typing'; t.id='typingDots';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatLog.appendChild(t);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function hideTyping(){ const t = $('#typingDots'); if(t) t.remove(); }

  // ---- Claude call ----
  function buildMessages(){
    const sys = RULES + "\n\nContext: " + current.persona;
    const msgs = history.map(m=>({role:m.role, content:m.content}));
    // inject persona into the first user turn so the model always has it
    const firstUser = msgs.find(m=>m.role==='user');
    if(firstUser){ firstUser.content = sys + "\n\nCustomer: " + firstUser.content; }
    else { msgs.unshift({role:'user', content: sys + "\n\n(Greet the customer.)"}); }
    return msgs;
  }

  async function getReply(){
    try{
      const res = await window.claude.complete({ messages: buildMessages() });
      return (res||'').trim() || "Sorry, I didn't catch that — could you say it another way?";
    }catch(e){
      return "I'm having trouble connecting right now. Mind trying that again in a moment?";
    }
  }

  // ---- Send (chat mode) ----
  async function sendUser(text){
    text = (text||'').trim();
    if(!text || busy) return;
    busy = true; sendBtn.disabled = true;
    addMessage('user', text);
    history.push({role:'user', content:text});
    chatInput.value='';
    showTyping();
    const reply = await getReply();
    hideTyping();
    addMessage('bot', reply);
    history.push({role:'assistant', content: reply});
    busy = false; sendBtn.disabled = false;
    chatInput.focus();
  }

  sendBtn.addEventListener('click', ()=> sendUser(chatInput.value));
  chatInput.addEventListener('keydown', e=>{ if(e.key==='Enter') sendUser(chatInput.value); });

  // ============================================================
  //  CALL MODE
  // ============================================================
  function setMode(m){
    mode = m;
    segChat.classList.toggle('on', m==='chat');
    segCall.classList.toggle('on', m==='call');
    chatView.classList.toggle('off', m==='call');
    callView.classList.toggle('on', m==='call');
    if(m==='call'){ startCall(); }
    else { stopCall(); }
  }
  segChat.addEventListener('click', ()=> setMode('chat'));
  segCall.addEventListener('click', ()=> setMode('call'));

  function startCall(){
    stopSpeak();
    callName.textContent = current.name;
    callSeconds = 0; callTime.textContent = '00:00';
    clearInterval(callTimer);
    callTimer = setInterval(()=>{ callSeconds++; const m=String(Math.floor(callSeconds/60)).padStart(2,'0'); const s=String(callSeconds%60).padStart(2,'0'); callTime.textContent = m+':'+s; }, 1000);
    // reset conversation context for the call
    history = [];
    renderCallQuick();
    // agent greets
    const greet = current.greet;
    history.push({role:'assistant', content: greet});
    showCaption('Vox', greet);
    speak(greet);
  }
  function stopCall(){ clearInterval(callTimer); stopSpeak(); }

  function renderCallQuick(){
    callQuick.innerHTML='';
    current.quick.forEach(q=>{
      const b=document.createElement('button'); b.textContent=q;
      b.addEventListener('click', ()=> callSay(q));
      callQuick.appendChild(b);
    });
  }

  function showCaption(who, text){
    callCap.innerHTML = '<span class="lbl">'+ (who==='You'?'You said':'Vox') +'</span>' + text;
  }

  async function callSay(text){
    if(busy) return;
    busy = true;
    stopSpeak();
    showCaption('You', text);
    history.push({role:'user', content:text});
    callCap.innerHTML = '<span class="lbl">Vox is thinking…</span><span style="opacity:.6">●●●</span>';
    const reply = await getReply();
    history.push({role:'assistant', content: reply});
    showCaption('Vox', reply);
    speak(reply);
    busy = false;
  }

  // ---- Speech synthesis ----
  let voices = [];
  function loadVoices(){ voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
  if(window.speechSynthesis){ loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }

  function pickVoice(){
    if(!voices.length) loadVoices();
    const pref = voices.find(v=>/en-US/i.test(v.lang) && /female|samantha|google us/i.test(v.name))
      || voices.find(v=>/en[-_]/i.test(v.lang)) || voices[0];
    return pref || null;
  }

  function speak(text){
    if(!window.speechSynthesis || muted){ // still show the waveform briefly
      callOrb.classList.add('speaking');
      setTimeout(()=> callOrb.classList.remove('speaking'), Math.min(6000, 1200 + text.length*32));
      return;
    }
    stopSpeak();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if(v) u.voice = v;
    u.rate = 1.04; u.pitch = 1.02;
    u.onstart = ()=> callOrb.classList.add('speaking');
    u.onend   = ()=> callOrb.classList.remove('speaking');
    u.onerror = ()=> callOrb.classList.remove('speaking');
    window.speechSynthesis.speak(u);
  }
  function stopSpeak(){ if(window.speechSynthesis) window.speechSynthesis.cancel(); callOrb.classList.remove('speaking'); }

  // ---- Mute ----
  muteBtn.addEventListener('click', ()=>{
    muted = !muted;
    muteBtn.innerHTML = muted ? ICON_MUTED : ICON_SPK;
    if(muted) stopSpeak();
  });

  // ---- Mic (optional, browser speech recognition) ----
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null, listening = false;
  if(SR){
    recog = new SR(); recog.lang='en-US'; recog.interimResults=false; recog.maxAlternatives=1;
    recog.onresult = e=>{ const t = e.results[0][0].transcript; callSay(t); };
    recog.onend = ()=>{ listening=false; micBtn.classList.remove('listening'); };
    recog.onerror = ()=>{ listening=false; micBtn.classList.remove('listening'); };
    micBtn.addEventListener('click', ()=>{
      if(busy) return;
      if(listening){ recog.stop(); return; }
      stopSpeak();
      try{ recog.start(); listening=true; micBtn.classList.add('listening'); }catch(e){}
    });
  } else {
    micBtn.addEventListener('click', ()=>{
      callCap.innerHTML = '<span class="lbl">Heads up</span>Your browser can\'t capture mic input here — tap a phrase below to talk to Vox.';
    });
  }

  // End call → back to chat
  $('#endBtn').addEventListener('click', ()=> setMode('chat'));

  // ---- Icons for mute toggle ----
  const ICON_SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';
  const ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>';
  muteBtn.innerHTML = ICON_SPK;

  // ---- init ----
  scrWho.textContent = current.name;
  scrTag.innerHTML = '<span class="dot-live"></span> Vox · AI agent';
  resetConversation();

  // ---- nav toggle (mobile) ----
  const nav = $('#nav'); const navToggle = $('#navToggle');
  if(navToggle){ navToggle.addEventListener('click', ()=> nav.classList.toggle('open')); 
    nav.querySelectorAll('.nav-links a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('open'))); }

  // ---- hero rotating word ----
  const rot = $('#rotWord');
  if(rot){
    const words = ['retail','banking','healthcare','travel','insurance','telecom'];
    let ri=0;
    setInterval(()=>{
      ri=(ri+1)%words.length;
      rot.style.opacity='0'; rot.style.transform='translateY(-8px)';
      setTimeout(()=>{ rot.textContent=words[ri]; rot.style.opacity='1'; rot.style.transform='none'; }, 220);
    }, 2200);
  }

  // ============================================================
  //  PRICING — tiers + currency toggle
  // ============================================================
  const TIERS = [
    { tier:'Starter', bestfor:'Sole traders & single-location SMEs',
      zar:{price:'R 899', over:'R 1.80'}, usd:{price:'$39', over:'$0.10'},
      mins:'300 min', subm:'≈ 100 calls / mo',
      feats:['1 concurrent line','Chat + voice','Help-center training'] },
    { tier:'Growth', featured:true, bestfor:'Busy SMEs · one sales or support line',
      zar:{price:'R 1,799', over:'R 1.50'}, usd:{price:'$89', over:'$0.08'},
      mins:'750 min', subm:'≈ 250 calls / mo',
      feats:['2 concurrent lines','Chat, voice & email','Basic analytics'] },
    { tier:'Business', bestfor:'Multi-role: reception + sales + support',
      zar:{price:'R 3,499', over:'R 1.20'}, usd:{price:'$179', over:'$0.07'},
      mins:'2,000 min', subm:'≈ 650 calls / mo',
      feats:['Multi-role agents','CRM integrations','Priority routing'] },
    { tier:'Scale / BPO', bestfor:'Call-centre overflow · high volume · multi-agent',
      zar:{price:'R 6,999+', over:'R 0.95'}, usd:{price:'$349+', over:'$0.05'},
      mins:'5,000+ min', subm:'High-volume',
      feats:['5+ concurrent lines','Multi-agent','Premium analytics'] },
    { tier:'Enterprise', custom:true, bestfor:'Regulated, high-volume & multi-site operations',
      zar:{price:'Custom', over:'Negotiated'}, usd:{price:'Custom', over:'Negotiated'},
      mins:'Custom + SLA', subm:'Dedicated capacity',
      feats:['Dedicated numbers','On-prem & SSO','Custom SLA & DPA'], cta:'Contact sales', formType:'sales' }
  ];
  let cur = 'zar';
  const priceGrid = $('#priceGrid');
  const CHK = '<svg viewBox="0 0 24 24"><path d="m4 13 4 4 12-12"/></svg>';

  function renderPricing(){
    if(!priceGrid) return;
    priceGrid.innerHTML = '';
    TIERS.forEach(t=>{
      const c = t[cur];
      const custom = !!t.custom;
      const card = document.createElement('div');
      card.className = 'price' + (t.featured?' featured':'');
      card.innerHTML =
        (t.featured?'<span class="badge">Most popular</span>':'')
        + '<div class="tier">'+t.tier+'</div>'
        + '<p class="bestfor">'+t.bestfor+'</p>'
        + '<div class="amt">'+c.price+(custom?'':'<small> / mo</small>')+'</div>'
        + '<div class="annual">'+(custom?'Tailored to your volume':'Annual: ~2 months free')+'</div>'
        + '<div class="mins"><span class="m">'+t.mins+(custom?'':' included')+'</span><span class="sub">'+t.subm+'</span></div>'
        + '<div class="over">'+(custom?'Overage <b>negotiated</b>':'then <b>'+c.over+'</b> / min overage')+'</div>'
        + '<ul>'+ t.feats.map(f=>'<li>'+CHK+'<span>'+f+'</span></li>').join('') +'</ul>'
        + '<button class="btn '+(t.featured?'btn-primary':'btn-ghost')+'" data-open-form data-form-type="'+(t.formType||'trial')+'">'+(t.cta||'Start free trial')+'</button>';
      priceGrid.appendChild(card);
    });
    layoutCarousel();
  }
  const priceToggle = $('#priceToggle');
  if(priceToggle){
    priceToggle.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', ()=>{
        cur = b.dataset.cur;
        priceToggle.querySelectorAll('button').forEach(x=> x.classList.toggle('on', x===b));
        renderPricing();
      });
    });
  }

  // ---- pricing carousel (3-up, arrows + dots) ----
  const pcViewport = $('#pcViewport');
  const pcPrev = $('#pcPrev'), pcNext = $('#pcNext'), pcDots = $('#pcDots');
  let pcIndex = 0;
  const PC_GAP = 18;
  function perView(){ const w = window.innerWidth; if(w>=980) return 3; if(w>=640) return 2; return 1; }
  function maxIndex(){ return Math.max(0, TIERS.length - perView()); }
  function layoutCarousel(){
    if(!priceGrid || !pcViewport) return;
    const pv = perView();
    const vw = pcViewport.clientWidth;
    const cardW = (vw - PC_GAP*(pv-1)) / pv;
    [...priceGrid.children].forEach(c=>{ c.style.width = cardW+'px'; });
    pcIndex = Math.min(pcIndex, maxIndex());
    priceGrid.style.transform = 'translateX(' + (-(pcIndex*(cardW+PC_GAP))) + 'px)';
    if(pcPrev) pcPrev.disabled = pcIndex<=0;
    if(pcNext) pcNext.disabled = pcIndex>=maxIndex();
    renderDots();
  }
  function renderDots(){
    if(!pcDots) return;
    const pages = maxIndex()+1;
    pcDots.innerHTML='';
    for(let i=0;i<pages;i++){
      const b=document.createElement('button');
      if(i===pcIndex) b.className='on';
      b.setAttribute('aria-label','Go to plan group '+(i+1));
      b.addEventListener('click', ()=>{ pcIndex=i; layoutCarousel(); });
      pcDots.appendChild(b);
    }
  }
  if(pcPrev) pcPrev.addEventListener('click', ()=>{ pcIndex=Math.max(0,pcIndex-1); layoutCarousel(); });
  if(pcNext) pcNext.addEventListener('click', ()=>{ pcIndex=Math.min(maxIndex(),pcIndex+1); layoutCarousel(); });
  let pcResize; window.addEventListener('resize', ()=>{ clearTimeout(pcResize); pcResize=setTimeout(layoutCarousel,120); });
  renderPricing();

  // ============================================================
  //  LEAD FORM MODAL (Book a demo / Free trial / Sales)
  // ============================================================
  const formModal = $('#formModal');
  if(formModal){
    // populate industry select once
    const indSel = $('#lf_industry');
    if(indSel){ INDUSTRIES.forEach(i=>{ const o=document.createElement('option'); o.value=i.tag; o.textContent=i.tag; indSel.appendChild(o); }); const o=document.createElement('option'); o.value='Other'; o.textContent='Other'; indSel.appendChild(o); }

    const FORM_COPY = {
      demo:  ['Book a demo','See Voxelo answer your real customer questions.'],
      trial: ['Start your free trial','Spin up your first agent — free for 14 days, no card.'],
      sales: ['Talk to sales','Custom pricing, SLAs and deployment for your team.']
    };
    function openForm(type){
      const t = FORM_COPY[type] || FORM_COPY.demo;
      $('#formEyebrow').textContent = t[0];
      $('#formTitle').textContent = t[1];
      $('#formType').value = type;
      $('#formBody').hidden = false; $('#formSuccess').hidden = true;
      formModal.classList.add('open'); formModal.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      setTimeout(()=>{ const f=$('#lf_name'); if(f) f.focus(); }, 220);
    }
    function closeForm(){ formModal.classList.remove('open'); formModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

    document.addEventListener('click', e=>{
      const opener = e.target.closest('[data-open-form]');
      if(opener){ e.preventDefault(); openForm(opener.getAttribute('data-form-type')||'demo'); return; }
      if(e.target === formModal || e.target.closest('.js-close-form')){ closeForm(); }
    });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && formModal.classList.contains('open')) closeForm(); });

    $('#leadForm').addEventListener('submit', async e=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      // ─────────────────────────────────────────────────────────────
      //  WIRE YOUR BACKEND HERE — e.g. Formspree, HubSpot, your API:
      //  await fetch('https://formspree.io/f/XXXXXXX', {
      //    method:'POST', headers:{'Accept':'application/json'},
      //    body: new FormData(e.target)
      //  });
      // ─────────────────────────────────────────────────────────────
      $('#successName').textContent = (data.name||'').trim().split(' ')[0] || 'there';
      $('#formBody').hidden = true; $('#formSuccess').hidden = false;
      e.target.reset();
    });
  }

  // ============================================================
  //  STICKY LAUNCHER — mini chat (Voxelo site assistant)
  // ============================================================
  const SITE_PERSONA = RULES + "\n\nContext: You're the assistant on the Voxelo website. "
    + "Voxelo builds AI customer-service agents for chat, voice and email that drop into any industry "
    + "(retail, insurance, healthcare, telecom, banking, travel). Pricing is tiered monthly plans with "
    + "included minutes plus a per-minute overage, starting at R899 / $39 per month, with a free 7–14 day "
    + "trial and ~2 months free on annual billing. Help visitors understand the product and pricing, and "
    + "warmly nudge them to try the live demo on this page or book a demo. Keep it brief.";

  const fab = $('#voxFab'), panel = $('#voxPanel'), voxClose = $('#voxClose');
  const voxLog = $('#voxLog'), voxInput = $('#voxInput'), voxSend = $('#voxSend'), voxQuick = $('#voxQuick');
  let siteHistory = [], siteBusy = false, siteStarted = false;
  const SITE_QUICK = ['How does pricing work?','Which industries?','Book a demo'];

  function voxAdd(role, text){
    const d = document.createElement('div');
    d.className = 'msg ' + (role==='user'?'user':'bot');
    d.textContent = text;
    voxLog.appendChild(d);
    voxLog.scrollTop = voxLog.scrollHeight;
  }
  function voxTyping(on){
    let t = $('#voxTyping');
    if(on && !t){ t=document.createElement('div'); t.className='typing'; t.id='voxTyping'; t.innerHTML='<span></span><span></span><span></span>'; voxLog.appendChild(t); voxLog.scrollTop=voxLog.scrollHeight; }
    if(!on && t) t.remove();
  }
  function voxRenderQuick(){
    voxQuick.innerHTML='';
    SITE_QUICK.forEach(q=>{ const b=document.createElement('button'); b.textContent=q; b.addEventListener('click',()=>{ if(!siteBusy) voxSendMsg(q); }); voxQuick.appendChild(b); });
  }
  function startSite(){
    if(siteStarted) return; siteStarted = true;
    const greet = "Hi! I'm Vox 👋 I can explain how Voxelo works, walk you through pricing, or get you set up with a demo. What would you like to know?";
    voxAdd('bot', greet);
    siteHistory.push({role:'assistant', content: greet});
    voxRenderQuick();
  }
  async function voxSendMsg(text){
    text=(text||'').trim(); if(!text||siteBusy) return;
    siteBusy=true; voxSend.disabled=true;
    voxAdd('user', text); siteHistory.push({role:'user', content:text}); voxInput.value='';
    voxTyping(true);
    let reply;
    try{
      const msgs = siteHistory.map(m=>({role:m.role, content:m.content}));
      const fu = msgs.find(m=>m.role==='user'); if(fu) fu.content = SITE_PERSONA + "\n\nVisitor: " + fu.content;
      reply = ((await window.claude.complete({messages:msgs}))||'').trim() || "Could you say that another way?";
    }catch(e){ reply = "I'm having trouble connecting — try again in a moment, or tap “Book a demo”."; }
    voxTyping(false); voxAdd('bot', reply); siteHistory.push({role:'assistant', content:reply});
    siteBusy=false; voxSend.disabled=false; voxInput.focus();
  }
  function openPanel(){ panel.classList.add('open'); fab.classList.add('hidden'); startSite(); setTimeout(()=>voxInput.focus(),250); }
  function closePanel(){ panel.classList.remove('open'); fab.classList.remove('hidden'); }
  if(fab){
    fab.addEventListener('click', openPanel);
    voxClose.addEventListener('click', closePanel);
    voxSend.addEventListener('click', ()=> voxSendMsg(voxInput.value));
    voxInput.addEventListener('keydown', e=>{ if(e.key==='Enter') voxSendMsg(voxInput.value); });
  }

})();
