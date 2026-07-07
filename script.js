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
      titleParts:['A few questions, ', 'then your protocol.'],
      sub:'Takes about a minute. Press Enter to continue.'},
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

  var state = {
    view: 'landing',
    step: 0,
    answers: {name:'', email:'', goal:'', experience:'', intensity:''}
  };

  var $ = function(sel){ return document.querySelector(sel); };
  var els = {
    landing: $('#view-landing'),
    onboarding: $('#view-onboarding'),
    resources: $('#view-resources'),
    beginBtn: $('#begin-btn'),
    obClose: $('#ob-close'),
    obBack: $('#ob-back'),
    obNext: $('#ob-next'),
    obStepWrap: $('#ob-step-wrap'),
    resSub: $('#res-sub'),
    resRecommended: $('#res-recommended'),
    resAllCats: $('#res-all-cats'),
    resLearn: $('#res-learn'),
    resRestart: $('#res-restart')
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
    ['landing','onboarding','resources'].forEach(function(v){
      els[v].hidden = (v !== view);
    });
    if(!opts.skipHash){ location.hash = '#/' + (view==='landing' ? '' : view); }
    window.scrollTo(0,0);
    if(view==='onboarding'){ renderStep(); }
    if(view==='resources'){ renderResources(); }
  }

  function routeFromHash(){
    var h = location.hash.replace('#/','');
    if(h==='onboarding'){ setView('onboarding', {skipHash:true}); }
    else if(h==='resources'){ setView('resources', {skipHash:true}); }
    else{ setView('landing', {skipHash:true}); }
  }

  // ---------- onboarding ----------
  function currentStep(){ return STEPS[state.step]; }

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
      setTimeout(function(){ setView('resources'); }, 1200);
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
    if(state.step < STEPS.length-1){
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

  // ---------- events ----------
  els.beginBtn.addEventListener('click', function(){
    state.step = 0;
    setView('onboarding');
  });
  els.obClose.addEventListener('click', function(){ setView('landing'); });
  els.obNext.addEventListener('click', advance);
  els.obBack.addEventListener('click', back);
  els.resRestart.addEventListener('click', function(){
    state.step = 0;
    state.answers = {name:'', email:'', goal:'', experience:'', intensity:''};
    setView('onboarding');
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

  // ---------- init ----------
  loadAnswers();
  routeFromHash();
})();
