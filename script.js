(function(){
  'use strict';

  var STORE_URL = 'https://peptide-design.netlify.app';

  var CATS = [
    {id:'metabolic',  label:'Metabolic',        sub:'Retatrutide · MOTS-c · NAD+ · Tesamorelin',        tagline:'Incretin, mitochondrial and metabolic research compounds.', icon:'M'},
    {id:'regenerate', label:'Growth Factors',    sub:'BPC-157 · TB-500 · Ipamorelin · CJC-1295',          tagline:'Growth-factor and repair-signalling research peptides.',    icon:'G'},
    {id:'longevity',  label:'Peptide Standards', sub:'Epithalon · GHK-Cu · DSIP',                          tagline:'Reference peptides for in vitro pathway and assay research.', icon:'P'},
    {id:'beauty',     label:'Copper Peptides',   sub:'GHK-Cu · Glow · Klow',                                tagline:'Copper-peptide and multi-peptide research blends.',          icon:'C'},
    {id:'immune',     label:'Melanocortin',      sub:'KPV · PT-141 · Melanotan II',                         tagline:'Melanocortin and anti-inflammatory research peptides.',      icon:'N'}
  ];

  var LEARN = [
    {tag:'GUIDE',    title:'FAQ',                    sub:'Answers on sourcing, dispatch and payment.',      href:'/?view=faq'},
    {tag:'STANDARDS',title:'Quality Assurance',       sub:'How compounds are tested and documented.',        href:'/?view=quality'},
    {tag:'POLICY',   title:'Research Use Policy',     sub:'Scope, eligibility and intended use.',             href:'/?view=research'},
    {tag:'VERIFY',   title:'Batch Documentation',     sub:'Look up testing docs for a specific batch.',       href:'/?view=docs'}
  ];

  var DASH_TASKS = [
    {num:'01', title:'Confirm research category', sub:'Use onboarding data to choose the correct catalogue track.', meta:'2 min'},
    {num:'02', title:'Review research-use policy', sub:'Check eligibility, intended-use scope and ordering terms.', meta:'Required'},
    {num:'03', title:'Attach documentation', sub:'Keep COA and batch verification links beside the shortlist.', meta:'Before checkout'},
    {num:'04', title:'Open store handoff', sub:'Send the selected category to the SynHealth storefront filter.', meta:'Ready'}
  ];

  var PROTOCOL_TRACKS = [
    {tag:'TRACK A', title:'Metabolic', sub:'Incretin, mitochondrial and metabolic research compounds.', products:'Retatrutide · MOTS-c · NAD+ · Tesamorelin', cat:'metabolic'},
    {tag:'TRACK B', title:'Growth Factors', sub:'Growth-factor and repair-signalling research peptides.', products:'BPC-157 · TB-500 · Ipamorelin · CJC-1295', cat:'regenerate'},
    {tag:'TRACK C', title:'Peptide Standards', sub:'Reference peptides for in vitro pathway and assay research.', products:'Epithalon · GHK-Cu · DSIP', cat:'longevity'},
    {tag:'TRACK D', title:'Copper Peptides', sub:'Copper-peptide and multi-peptide research blends.', products:'GHK-Cu · Glow · Klow', cat:'beauty'},
    {tag:'TRACK E', title:'Melanocortin', sub:'Melanocortin and anti-inflammatory research peptides.', products:'KPV · PT-141 · Melanotan II', cat:'immune'}
  ];

  var DOC_ROWS = [
    {code:'COA', title:'Certificate of analysis', status:'Attach per batch', note:'Match batch ID before ordering'},
    {code:'HPLC', title:'Purity method', status:'Review', note:'Check assay method and date'},
    {code:'ID', title:'Identity verification', status:'Ready', note:'Retain with research notes'},
    {code:'SHIP', title:'Dispatch record', status:'After order', note:'Add tracking and receipt'}
  ];

  var VIDEOS = [
    {time:'03:42', tag:'STARTER', title:'How to read a SynHealth batch file', sub:'COA, batch ID, method, date and what to save before checkout.', tone:'gold'},
    {time:'05:10', tag:'CALCULATOR', title:'Vial concentration math', sub:'How mg, ml, mcg and insulin units relate in research calculations.', tone:'green'},
    {time:'04:26', tag:'QUALITY', title:'Documentation-first ordering', sub:'A simple review flow for product pages, claims and third-party documents.', tone:'blue'},
    {time:'06:18', tag:'CATALOGUE', title:'Choosing a research category', sub:'Metabolic, growth-factor, copper peptide and reference-standard tracks.', tone:'red'},
    {time:'02:55', tag:'POLICY', title:'Research-use boundaries', sub:'Eligibility, intended use and why the portal avoids clinical instructions.', tone:'gold'},
    {time:'07:04', tag:'OPS', title:'Building an order shortlist', sub:'Move from objective to category, then to documentation and store handoff.', tone:'green'}
  ];

  var EXPERIENCE_OPTIONS = [
    {value:'new',      label:'New to peptides',            sub:'Just starting to explore the research'},
    {value:'some',     label:'Some experience',             sub:"I've sourced compounds before"},
    {value:'advanced', label:'Advanced',                    sub:'I run structured protocols regularly'}
  ];

  var INTENSITY_OPTIONS = [
    {value:'exploring', label:'Just exploring',              sub:'Researching before deciding anything'},
    {value:'ready',      label:'Ready to start',              sub:'Looking to source compounds now'},
    {value:'active',     label:'Already running a protocol',  sub:'Looking to expand or refine'}
  ];

  var STEPS = [
    {id:'welcome', kind:'intro',
      eyebrow:'WELCOME',
      titleParts:['Just 3 quick questions, ', 'then your protocol.'],
      sub:'Takes about 30 seconds. Press Enter to continue.'},
    {id:'name', kind:'text', num:'01', section:'IDENTITY',
      title:"What's your full name?", placeholder:'Jane Doe', field:'name', inputType:'text'},
    {id:'email', kind:'text', num:'02', section:'CONTACT',
      title:'Best email to reach you?', placeholder:'jane@example.com', field:'email', inputType:'email'},
    {id:'goal', kind:'choice', num:'03', section:'RESEARCH GOAL',
      title:'What are you primarily researching?', field:'goal',
      options: CATS.map(function(c){return {value:c.id, label:c.label, sub:c.sub};})},
    {id:'experience', kind:'choice', num:'04', section:'EXPERIENCE',
      title:'How familiar are you with peptide research?', field:'experience', options:EXPERIENCE_OPTIONS},
    {id:'intensity', kind:'choice', num:'05', section:'READINESS',
      title:'Where are you in the process?', field:'intensity', options:INTENSITY_OPTIONS},
    {id:'done', kind:'outro',
      eyebrow:'ANALYZING', title:'Building your protocol…', sub:'This will only take a moment.'}
  ];

  // Landing "Begin Onboarding" only asks the 3 essentials so it stays quick;
  // Experience/Readiness live in the dashboard's Intake tab as an optional
  // follow-up, resumed directly (skipping already-answered lead fields).
  var QUICK_IDS = ['welcome', 'name', 'email', 'goal', 'done'];
  function stepsForFlow(flow, answers){
    if(flow === 'extended'){
      var hasLead = answers.name && answers.email && answers.goal;
      if(hasLead){
        return STEPS.filter(function(s){ return ['experience', 'intensity', 'done'].indexOf(s.id) >= 0; });
      }
      return STEPS;
    }
    return STEPS.filter(function(s){ return QUICK_IDS.indexOf(s.id) >= 0; });
  }

  var state = {
    view: 'landing',
    step: 0,
    flow: 'quick',
    activeSteps: stepsForFlow('quick', {}),
    answers: {name:'', email:'', goal:'', experience:'', intensity:''}
  };

  var $ = function(sel){ return document.querySelector(sel); };
  var els = {
    landing: $('#view-landing'),
    onboarding: $('#view-onboarding'),
    dashboard: $('#view-dashboard'),
    resources: $('#view-resources'),
    beginBtn: $('#begin-btn'),
    landingDashboard: $('#landing-dashboard'),
    obClose: $('#ob-close'),
    obBack: $('#ob-back'),
    obNext: $('#ob-next'),
    obStepWrap: $('#ob-step-wrap'),
    resSub: $('#res-sub'),
    resRecommended: $('#res-recommended'),
    resAllCats: $('#res-all-cats'),
    resLearn: $('#res-learn'),
    resRestart: $('#res-restart'),
    dashTitle: $('#dash-title'),
    dashKicker: $('#dash-kicker'),
    dashAccountEmail: $('#dash-account-email'),
    dashWelcome: $('#dash-welcome'),
    dashSummary: $('#dash-summary'),
    dashFocus: $('#dash-focus'),
    dashStage: $('#dash-stage'),
    dashRecTitle: $('#dash-rec-title'),
    dashRecCopy: $('#dash-rec-copy'),
    dashRecLink: $('#dash-rec-link'),
    dashQueue: $('#dash-queue'),
    dashTodayList: $('#dash-today-list'),
    dashProtocolMap: $('#dash-protocol-map'),
    dashDocTable: $('#dash-doc-table'),
    dashEducationCards: $('#dash-education-cards'),
    dashSubtotal: $('#dash-subtotal'),
    dashCalcOutput: $('#dash-calc-output'),
    dashPhotoUpload: $('#dash-photo-upload'),
    dashUploadPreview: $('#dash-upload-preview'),
    calcVialMg: $('#calc-vial-mg'),
    calcWaterMl: $('#calc-water-ml'),
    calcTargetMcg: $('#calc-target-mcg'),
    calcConcentration: $('#calc-concentration'),
    calcVolume: $('#calc-volume'),
    calcUnits: $('#calc-units'),
    calcYield: $('#calc-yield'),
    syringeFill: $('#syringe-fill'),
    syringeReadout: $('#syringe-readout'),
    vialLabel: $('#vial-label'),
    dashStartIntake: $('#dash-start-intake'),
    dashSignout: $('#dash-signout')
  };

  function saveAnswers(){
    try{ localStorage.setItem('synprotocol_answers', JSON.stringify(state.answers)); }catch(e){}
  }
  function loadAnswers(){
    try{
      var raw = localStorage.getItem('synprotocol_answers');
      if(raw){ state.answers = Object.assign(state.answers, JSON.parse(raw)); }
    }catch(e){}
  }

  function catById(id){
    for(var i=0;i<CATS.length;i++){ if(CATS[i].id===id) return CATS[i]; }
    return null;
  }

  // ---------- routing ----------
  function setView(view, opts){
    opts = opts || {};
    if(state.view === view && !opts.force){ return; }
    state.view = view;
    document.body.setAttribute('data-app-view', view);
    ['landing','onboarding','dashboard','resources'].forEach(function(v){
      els[v].hidden = (v !== view);
    });
    if(!opts.skipHash){ location.hash = '#/' + (view==='landing' ? '' : view); }
    window.scrollTo(0,0);
    if(view==='onboarding'){ renderStep(); }
    if(view==='dashboard'){ renderDashboard(); }
    if(view==='resources'){ renderResources(); }
  }

  function routeFromHash(){
    var h = location.hash.replace('#/','');
    if(h==='onboarding'){ setView('onboarding', {skipHash:true}); }
    else if(h==='dashboard'){ setView('dashboard', {skipHash:true}); }
    else if(h==='resources'){ setView('resources', {skipHash:true}); }
    else{ setView('landing', {skipHash:true}); }
  }

  // ---------- onboarding ----------
  function currentStep(){ return state.activeSteps[state.step]; }

  function stepValid(){
    var s = currentStep();
    if(s.kind==='text'){
      var v = (state.answers[s.field]||'').trim();
      if(s.inputType==='email'){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
      return v.length>0;
    }
    if(s.kind==='choice'){
      return !!state.answers[s.field];
    }
    return true;
  }

  function renderStep(){
    var s = currentStep();
    var html = '';

    if(s.kind==='intro'){
      html += '<div class="ob-step ob-outro">'+
        '<p class="ob-meta">'+s.eyebrow+'</p>'+
        '<h2 class="ob-title">'+s.titleParts[0]+'<em>'+s.titleParts[1]+'</em></h2>'+
        '<p class="ob-sub">'+s.sub+'</p>'+
      '</div>';
    } else if(s.kind==='text'){
      html += '<div class="ob-step">'+
        '<p class="ob-meta">'+s.num+' · '+s.section+'</p>'+
        '<h2 class="ob-title">'+s.title+'</h2>'+
        '<input id="ob-field" class="ob-input" type="'+s.inputType+'" placeholder="'+s.placeholder+'" autocomplete="off" value="'+escapeHtml(state.answers[s.field]||'')+'" />'+
      '</div>';
    } else if(s.kind==='choice'){
      html += '<div class="ob-step">'+
        '<p class="ob-meta">'+s.num+' · '+s.section+'</p>'+
        '<h2 class="ob-title">'+s.title+'</h2>'+
        '<div class="ob-choices">'+
          s.options.map(function(o){
            var sel = state.answers[s.field]===o.value ? ' selected' : '';
            return '<button type="button" class="ob-choice'+sel+'" data-value="'+o.value+'">'+
              '<span class="ob-choice-label">'+o.label+'</span>'+
              '<span class="ob-choice-sub">'+o.sub+'</span>'+
            '</button>';
          }).join('')+
        '</div>'+
      '</div>';
    } else if(s.kind==='outro'){
      html += '<div class="ob-step ob-outro">'+
        '<div class="ob-spinner"></div>'+
        '<p class="ob-meta">'+s.eyebrow+'</p>'+
        '<h2 class="ob-title">'+s.title+'</h2>'+
        '<p class="ob-sub">'+s.sub+'</p>'+
      '</div>';
    }

    els.obStepWrap.innerHTML = html;

    // footer state
    els.obBack.style.visibility = state.step===0 ? 'hidden' : 'visible';
    if(s.kind==='outro'){
      els.obNext.style.visibility = 'hidden';
    } else {
      els.obNext.style.visibility = 'visible';
      els.obNext.textContent = '';
      var label = document.createElement('span');
      label.textContent = s.kind==='intro' ? 'BEGIN' : 'CONTINUE';
      var arrow = document.createElement('span');
      arrow.className = 'arrow'; arrow.textContent = '→';
      els.obNext.appendChild(label); els.obNext.appendChild(arrow);
      els.obNext.disabled = !stepValid();
    }

    if(s.kind==='text'){
      var input = $('#ob-field');
      input.focus();
      input.addEventListener('input', function(){
        state.answers[s.field] = input.value;
        els.obNext.disabled = !stepValid();
      });
    }
    if(s.kind==='choice'){
      Array.prototype.forEach.call(document.querySelectorAll('.ob-choice'), function(btn){
        btn.addEventListener('click', function(){
          state.answers[s.field] = btn.getAttribute('data-value');
          Array.prototype.forEach.call(document.querySelectorAll('.ob-choice'), function(b){ b.classList.remove('selected'); });
          btn.classList.add('selected');
          els.obNext.disabled = !stepValid();
          setTimeout(advance, 260);
        });
      });
    }
    if(s.kind==='outro'){
      saveAnswers();
      submitLead();
      setTimeout(function(){ setView('dashboard'); }, 1200);
    }
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function advance(){
    var s = currentStep();
    if(s.kind!=='outro' && !stepValid()) return;
    if(state.step < state.activeSteps.length-1){
      state.step++;
      renderStep();
    }
  }
  function back(){
    if(state.step>0){
      state.step--;
      renderStep();
    } else {
      setView('landing');
    }
  }

  function submitLead(){
    var body = new URLSearchParams({
      'form-name':'protocol-onboarding',
      name: state.answers.name,
      email: state.answers.email,
      goal: state.answers.goal,
      experience: state.answers.experience,
      intensity: state.answers.intensity
    }).toString();
    fetch('/', {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: body
    }).catch(function(){});
  }

  // ---------- resources ----------
  function renderResources(){
    loadAnswers();
    var a = state.answers;
    var goalCat = catById(a.goal);

    els.resSub.textContent = a.name
      ? ('Recommended for ' + a.name.split(' ')[0] + ', based on your research goals.')
      : 'Find your protocol resources below.';

    // recommended
    var recHtml = '';
    if(goalCat){
      recHtml += resCardHtml({
        tag:'RECOMMENDED',
        title: goalCat.label,
        sub: goalCat.tagline,
        icon: goalCat.icon,
        href: STORE_URL + '/?view=shop&cat=' + goalCat.id,
        recommended:true
      });
    } else {
      recHtml += resCardHtml({
        tag:'START HERE',
        title:'Browse the full catalogue',
        sub:'Take the onboarding to get a personalized recommendation.',
        icon:'S',
        href: STORE_URL + '/?view=shop&cat=all',
        recommended:true
      });
    }
    els.resRecommended.innerHTML = recHtml;

    // all categories (excluding the recommended one)
    var others = CATS.filter(function(c){ return !goalCat || c.id!==goalCat.id; });
    els.resAllCats.innerHTML = others.map(function(c){
      return resCardHtml({
        tag: c.sub,
        title: c.label,
        sub: c.tagline,
        icon: c.icon,
        href: STORE_URL + '/?view=shop&cat=' + c.id
      });
    }).join('');

    // learn more
    els.resLearn.innerHTML = LEARN.map(function(l){
      return resCardHtml({
        tag: l.tag,
        title: l.title,
        sub: l.sub,
        icon: l.title.charAt(0),
        href: STORE_URL + l.href
      });
    }).join('');
  }

  function resCardHtml(c){
    var cls = 'res-card' + (c.recommended ? ' recommended' : '');
    return '<a class="'+cls+'" href="'+c.href+'" target="_blank" rel="noopener">'+
      '<span class="res-card-icon">'+c.icon+'</span>'+
      '<span class="res-card-body">'+
        '<span class="res-card-tag">'+c.tag+'</span>'+
        '<span class="res-card-title">'+c.title+'</span>'+
        '<span class="res-card-sub">'+c.sub+'</span>'+
      '</span>'+
      '<span class="res-card-arrow">↗</span>'+
    '</a>';
  }

  // ---------- dashboard ----------
  function renderDashboard(){
    loadAnswers();
    var a = state.answers;
    var goalCat = catById(a.goal);
    var firstName = (a.name || '').trim().split(/\s+/)[0];

    els.dashAccountEmail.textContent = a.email || 'researcher@synhealth.co.uk';
    els.dashWelcome.textContent = firstName ? ('Welcome back, ' + firstName + '.') : 'The foundation of your protocol';
    els.dashSummary.textContent = goalCat
      ? ('Your dashboard is prioritizing ' + goalCat.label.toLowerCase() + ' resources, batch documents and store links.')
      : 'Complete the private research intake to shape the resources, categories and quality documents shown inside your dashboard.';
    els.dashFocus.textContent = goalCat ? goalCat.label : 'Awaiting intake';
    els.dashStage.textContent = a.intensity ? readableIntensity(a.intensity) : 'Not configured';
    els.dashRecTitle.textContent = goalCat ? goalCat.label : 'Browse the full catalogue';
    els.dashRecCopy.textContent = goalCat ? goalCat.tagline : 'After onboarding, this panel prioritizes the SynHealth category most relevant to your stated research goal.';
    els.dashRecLink.href = STORE_URL + '/?view=shop&cat=' + (goalCat ? goalCat.id : 'all');

    els.dashQueue.innerHTML = DASH_TASKS.slice(0,3).map(taskMiniHtml).join('');
    els.dashTodayList.innerHTML = DASH_TASKS.map(taskRichHtml).join('');
    els.dashProtocolMap.innerHTML = PROTOCOL_TRACKS.map(protocolTrackHtml).join('');
    els.dashDocTable.innerHTML = DOC_ROWS.map(docRowHtml).join('');
    els.dashEducationCards.innerHTML = VIDEOS.map(videoCardHtml).join('');

    updateCalculator();
    setDashboardPanel(getActivePanel() || 'overview');
  }

  function taskMiniHtml(t){
    return '<div class="dash-mini-row"><span>'+t.num+'</span><strong>'+t.title+'</strong><em>'+t.meta+'</em></div>';
  }

  function taskRichHtml(t){
    return '<article><span>'+t.num+'</span><div><strong>'+t.title+'</strong><p>'+t.sub+'</p><em>'+t.meta+'</em></div></article>';
  }

  function protocolTrackHtml(t){
    return '<article>'+
      '<small>'+t.tag+'</small>'+
      '<strong>'+t.title+'</strong>'+
      '<p>'+t.sub+'</p>'+
      '<em>'+t.products+'</em>'+
      '<a href="'+STORE_URL+'/?view=shop&cat='+t.cat+'" target="_blank" rel="noopener">Open category ↗</a>'+
    '</article>';
  }

  function docRowHtml(row){
    return '<div class="dash-doc-row">'+
      '<span>'+row.code+'</span>'+
      '<strong>'+row.title+'<small>'+row.note+'</small></strong>'+
      '<em>'+row.status+'</em>'+
    '</div>';
  }

  function videoCardHtml(video){
    return '<article class="dash-video-card tone-'+video.tone+'">'+
      '<div class="dash-video-thumb">'+
        '<span class="dash-play">▶</span>'+
        '<em>'+video.time+'</em>'+
      '</div>'+
      '<p class="dash-card-label">'+video.tag+'</p>'+
      '<h3>'+video.title+'</h3>'+
      '<p>'+video.sub+'</p>'+
    '</article>';
  }

  function readableIntensity(value){
    var found = INTENSITY_OPTIONS.filter(function(o){ return o.value === value; })[0];
    return found ? found.label : value;
  }

  function getActivePanel(){
    var active = document.querySelector('.dash-panel.active');
    return active ? active.getAttribute('data-dash-panel') : 'overview';
  }

  function setDashboardPanel(panel){
    var shell = document.querySelector('.dash-shell');
    if(shell){ shell.setAttribute('data-panel', panel); }
    Array.prototype.forEach.call(document.querySelectorAll('[data-dash-panel]'), function(el){
      el.classList.toggle('active', el.getAttribute('data-dash-panel') === panel);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-dash-nav]'), function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-dash-nav') === panel);
    });
    var titles = {
      overview:['MEMBER DASHBOARD','Your research protocol'],
      today:['TODAY','Current protocol actions'],
      protocol:['PROTOCOL','Research track map'],
      bloodwork:['BATCHWORK','Quality documentation'],
      calculator:['CALCULATOR','Order planning'],
      education:['PEPTIDE EDU','Research resources'],
      intake:['INTAKE','Private onboarding']
    };
    var t = titles[panel] || titles.overview;
    els.dashKicker.textContent = t[0];
    els.dashTitle.textContent = t[1];
  }

  function updateCalculator(){
    if(!els.dashSubtotal || !els.dashCalcOutput) return;
    var subtotal = Number(els.dashSubtotal.value || 0);
    var remaining = Math.max(0, 100 - subtotal);
    els.dashCalcOutput.textContent = remaining
      ? ('£' + remaining.toFixed(0) + ' until free UK delivery.')
      : 'Free UK delivery threshold reached.';

    if(!els.calcVialMg) return;
    var vialMg = Math.max(0, Number(els.calcVialMg.value || 0));
    var waterMl = Math.max(0, Number(els.calcWaterMl.value || 0));
    var targetMcg = Math.max(0, Number(els.calcTargetMcg.value || 0));
    var concentrationMgMl = waterMl > 0 ? vialMg / waterMl : 0;
    var targetMl = concentrationMgMl > 0 ? (targetMcg / 1000) / concentrationMgMl : 0;
    var units = targetMl * 100;
    var yieldCount = targetMcg > 0 ? (vialMg * 1000) / targetMcg : 0;
    els.calcConcentration.textContent = concentrationMgMl.toFixed(2) + ' mg/ml';
    els.calcVolume.textContent = targetMl.toFixed(3) + ' ml per target';
    els.calcUnits.textContent = units.toFixed(1) + ' insulin units';
    els.calcYield.textContent = Math.floor(yieldCount) + ' target draws per vial';
    if(els.syringeFill){
      els.syringeFill.style.width = Math.max(8, Math.min(78, units)).toFixed(1) + '%';
    }
    if(els.syringeReadout){ els.syringeReadout.textContent = targetMl.toFixed(3) + ' ml'; }
    if(els.vialLabel){ els.vialLabel.textContent = vialMg ? (vialMg.toFixed(vialMg % 1 ? 1 : 0) + 'mg') : 'vial'; }
  }

  function handlePhotoUpload(file){
    if(!file || !file.type || file.type.indexOf('image/') !== 0) return;
    var reader = new FileReader();
    reader.onload = function(){
      els.dashUploadPreview.innerHTML = '';
      var img = document.createElement('img');
      img.alt = 'Uploaded client reference';
      img.src = reader.result;
      els.dashUploadPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  // ---------- events ----------
  function startOnboarding(flow){
    state.flow = flow;
    state.activeSteps = stepsForFlow(flow, state.answers);
    state.step = 0;
    setView('onboarding');
  }
  els.beginBtn.addEventListener('click', function(){ startOnboarding('quick'); });
  els.landingDashboard.addEventListener('click', function(){ setView('dashboard'); });
  els.obClose.addEventListener('click', function(){ setView('landing'); });
  els.obNext.addEventListener('click', advance);
  els.obBack.addEventListener('click', back);
  els.resRestart.addEventListener('click', function(){
    state.answers = {name:'', email:'', goal:'', experience:'', intensity:''};
    startOnboarding('quick');
  });
  els.dashStartIntake.addEventListener('click', function(){ startOnboarding('extended'); });
  els.dashSignout.addEventListener('click', function(){ setView('landing'); });
  els.dashSubtotal.addEventListener('input', updateCalculator);
  els.calcVialMg.addEventListener('input', updateCalculator);
  els.calcWaterMl.addEventListener('input', updateCalculator);
  els.calcTargetMcg.addEventListener('input', updateCalculator);
  els.dashPhotoUpload.addEventListener('change', function(e){
    handlePhotoUpload(e.target.files && e.target.files[0]);
  });

  document.addEventListener('click', function(e){
    var nav = e.target.closest('[data-dash-nav]');
    if(nav){ setDashboardPanel(nav.getAttribute('data-dash-nav')); }
    if(e.target.closest('[data-open-intake]')){ startOnboarding('extended'); }
  });

  document.addEventListener('keydown', function(e){
    if(state.view!=='onboarding') return;
    if(e.key==='Enter'){
      e.preventDefault();
      if(currentStep().kind!=='outro' && stepValid()) advance();
    } else if(e.key==='Escape'){
      setView('landing');
    }
  });

  window.addEventListener('hashchange', routeFromHash);

  // ---------- ambient gold particle field ----------
  function initParticles(){
    var canvas = document.getElementById('bg-particles');
    if(!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W, H, DPR, particles = [];

    function resize(){
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = Math.floor(window.innerWidth * DPR);
      H = canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    function makeParticle(){
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 1.5 + 0.5) * DPR,
        vy: -(Math.random() * 0.16 + 0.03) * DPR,
        vx: (Math.random() - 0.5) * 0.05 * DPR,
        baseA: Math.random() * 0.45 + 0.15,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.015 + 0.006
      };
    }
    function seed(){
      resize();
      var count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 16000));
      particles = [];
      for(var i=0;i<count;i++){ particles.push(makeParticle()); }
    }
    function frame(){
      ctx.clearRect(0, 0, W, H);
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.tw += p.twSpeed;
        if(p.y < -10){ p.y = H + 10; p.x = Math.random() * W; }
        if(p.x < -10) p.x = W + 10;
        if(p.x > W + 10) p.x = -10;
        var alpha = p.baseA * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,168,76,' + alpha.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(201,168,76,0.9)';
        ctx.shadowBlur = p.r * 3;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    seed();
    if(!reduceMotion){ requestAnimationFrame(frame); } else { frame(); }
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(seed, 200);
    });
  }

  // ---------- decorative animated DNA helix (resources page) ----------
  function buildHelixSVG(){
    var width = 120, height = 900, turns = 5.5, amplitude = 32, steps = 90, rungEvery = 5;
    var cx = width / 2;
    function xAt(t){ return cx + amplitude * Math.sin(t * Math.PI * 2 * turns); }

    var ptsA = [], ptsB = [];
    for(var i=0;i<=steps;i++){
      var t = i / steps;
      var y = t * height;
      ptsA.push([xAt(t), y]);
      ptsB.push([2 * cx - xAt(t), y]);
    }
    function pathFor(pts){
      return 'M' + pts.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L');
    }
    var rungs = '';
    for(var i=0;i<=steps;i+=rungEvery){
      var a = ptsA[i], b = ptsB[i];
      rungs += '<line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke="rgba(201,168,76,0.35)" stroke-width="1"/>';
    }
    var dots = '';
    for(var i=0;i<=steps;i+=3){
      dots += '<circle cx="'+ptsA[i][0].toFixed(1)+'" cy="'+ptsA[i][1].toFixed(1)+'" r="2.2" fill="rgba(232,212,139,0.55)"/>';
      dots += '<circle cx="'+ptsB[i][0].toFixed(1)+'" cy="'+ptsB[i][1].toFixed(1)+'" r="2.2" fill="rgba(201,168,76,0.4)"/>';
    }
    return '<svg viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">'+
      '<g class="helix-strand">'+
        rungs+
        '<path d="'+pathFor(ptsA)+'" fill="none" stroke="rgba(232,212,139,0.5)" stroke-width="2" stroke-linecap="round"/>'+
        '<path d="'+pathFor(ptsB)+'" fill="none" stroke="rgba(201,168,76,0.4)" stroke-width="2" stroke-linecap="round"/>'+
        dots+
      '</g>'+
    '</svg>';
  }
  function initHelixDeco(){
    var svg = buildHelixSVG();
    ['helix-left','helix-right'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.innerHTML = svg;
    });
  }

  // ---------- cursor-tracked watermark tilt (matches the reference site's
  // subtle mouse-driven 3D parallax: small rotateX/rotateY + translate) ----------
  function initWatermarkTilt(){
    var hero = document.querySelector('.hero');
    var target = document.getElementById('watermark-tilt');
    if(!hero || !target) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return;
    var maxRotate = 6, maxShift = 10;
    function onMove(e){
      var rect = target.getBoundingClientRect();
      var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      var nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      var ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
      var rotY = nx * maxRotate;
      var rotX = -ny * maxRotate * 0.6;
      var tx = nx * maxShift;
      var ty = ny * maxShift * 0.6;
      target.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
    }
    function onLeave(){
      target.style.transform = 'rotateX(0deg) rotateY(0deg) translate3d(0,0,0)';
    }
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
  }

  // ---------- init ----------
  loadAnswers();
  routeFromHash();
  initParticles();
  initHelixDeco();
  initWatermarkTilt();
})();
