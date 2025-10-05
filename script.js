// Brain Rot Scale - final interactive script
(function(){
  const SECTIONS = [
    { id: 'usage', title_ar: 'القسم 1 — نمط الاستخدام', title_en: 'Section 1 — Usage Patterns',
      questions: [
        {ar:'كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟', en:'How many hours per day do you spend on TikTok / Reels / Shorts?'},
        {ar:'هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟', en:'Do you open these apps automatically (without thinking)?'},
        {ar:'هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟', en:'Do you find it hard to stop after one short clip?'},
        {ar:'هل تشاهد مقاطع قصيرة رغم وجود مهام أهم؟', en:'Do you watch short clips even when you have more important tasks?'}
      ]
    },
    { id:'cognitive', title_ar:'القسم 2 — أعراض معرفية', title_en:'Section 2 — Cognitive Symptoms',
      questions:[
        {ar:'بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة/العمل؟', en:'After watching short content, do you find it hard to focus on study/work?'},
        {ar:'هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟', en:'Do you feel your memory has weakened after long use?'},
        {ar:'هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل بسبب فقدان الصبر؟', en:'Do you struggle to read a book or watch a long film due to impatience?'},
        {ar:'هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟', en:'Do you notice your attention gets distracted more easily?'}
      ]
    },
    { id:'emotional', title_ar:'القسم 3 — عاطفي/نفسي', title_en:'Section 3 — Emotional/Psychological',
      questions:[
        {ar:'هل تشعر بفراغ أو \"دماغك فاضي\" بعد ساعات من التصفح؟', en:'Do you feel empty or \"your brain is blank\" after hours of browsing?'},
        {ar:'هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل في المقاطع القصيرة؟', en:'Do you feel guilt or regret after spending long time on short clips?'},
        {ar:'هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالمتعة السريعة؟', en:'Do you find it hard to enjoy normal activities compared to quick video pleasure?'},
        {ar:'هل تشعر بالقلق أو التوتر لو لم تفتح التطبيقات لفترة طويلة؟', en:'Do you feel anxious if you do not open the apps for long?'}
      ]
    },
    { id:'behavioral', title_ar:'القسم 4 — التأثير السلوكي', title_en:'Section 4 — Behavioral Impact',
      questions:[
        {ar:'هل يؤثر استخدامك على نومك (تأخر نوم، نوم متقطع)؟', en:'Does your use affect your sleep (delayed or fragmented sleep)?'},
        {ar:'هل يؤثر على إنجازك الدراسي أو المهني؟', en:'Does it affect your academic or professional performance?'},
        {ar:'هل تعطي الأولوية للمحتوى الرقمي على علاقاتك ونشاطاتك؟', en:'Do you prioritize digital content over relationships and activities?'},
        {ar:'هل حاولت تقليل الاستخدام وفشلت؟', en:'Have you tried to cut down usage and failed?'}
      ]
    },
    { id:'extra', title_ar:'القسم 5 — نمط الحياة (إضافي)', title_en:'Section 5 — Lifestyle / Extra',
      questions:[
        {ar:'أول ما بتصحى من النوم بتفتح الموبايل؟', en:'Do you open your phone first thing after waking up?'},
        {ar:'الموبايل آخر حاجة بتعملها قبل النوم؟', en:'Is the phone the last thing you do before sleeping?'},
        {ar:'بتمسك الموبايل مع الأهل والصحاب؟', en:'Do you hold your phone when with family or friends?'},
        {ar:'تستخدم الموبايل لتذكيرك بالمواعيد أو الأعياد؟', en:'Do you use your phone to remember birthdays or reminders?'},
        {ar:'تفضل الموسيقى الطويلة أم الأغاني القصيرة؟ (1=طويلة ... 5=قصيرة)', en:'Do you prefer long-form music or short songs? (1=long ... 5=short)'},
        {ar:'هل تحفظ أرقام موبايلات أصحابك وأهلك؟', en:'Do you memorize phone numbers of friends and family?'}
      ]
    }
  ];

  const LANG = { current: 'ar' };

  // DOM
  const slidesEl = document.getElementById('slides');
  const startBtn = document.getElementById('startBtn');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const progressBar = document.getElementById('progressBar');
  const livePercent = document.getElementById('livePercent');
  const liveText = document.getElementById('liveText');
  const finalPercent = document.getElementById('finalPercent');
  const rawScoreEl = document.getElementById('rawScore');
  const finalSeverity = document.getElementById('finalSeverity');
  const finalAdvice = document.getElementById('finalAdvice');
  const finalUser = document.getElementById('finalUser');
  const restartBtn = document.getElementById('restartBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const btnAr = document.getElementById('btnAr');
  const btnEn = document.getElementById('btnEn');

  // state
  const TOTAL_QUESTIONS = SECTIONS.reduce((s,sec)=>s+sec.questions.length,0);
  const MIN_SCORE = 1 * TOTAL_QUESTIONS;
  const MAX_SCORE = 5 * TOTAL_QUESTIONS;
  let answers = Array(TOTAL_QUESTIONS).fill(null);
  let sectionIndex = 0; // 0 intro, 1..5 sections, 6 result

  // helper to get global question index
  function getGlobalIndex(sectionIdx, qIdx){
    let idx=0;
    for(let i=0;i<sectionIdx;i++) idx += SECTIONS[i].questions.length;
    return idx + qIdx;
  }

  // build section slides
  function buildSlides(){
    // remove existing section slides (if re-building)
    const existing = Array.from(slidesEl.querySelectorAll('.slide')).filter(s => parseInt(s.getAttribute('data-index'))>=1 && parseInt(s.getAttribute('data-index'))<=SECTIONS.length);
    existing.forEach(e=>e.remove());
    // insert before last slide
    const lastSlide = slidesEl.querySelector('.slide[data-index="6"]');
    for(let s=0;s<SECTIONS.length;s++){
      const sec = SECTIONS[s];
      const slide = document.createElement('section');
      slide.className = 'slide';
      slide.setAttribute('data-index', String(s+1));
      const card = document.createElement('div'); card.className='card';
      const h = document.createElement('div'); h.className='section-title';
      h.setAttribute('data-ar', sec.title_ar); h.setAttribute('data-en', sec.title_en);
      h.textContent = LANG.current === 'ar' ? sec.title_ar : sec.title_en;
      card.appendChild(h);

      const qwrap = document.createElement('div'); qwrap.className='questions';
      for(let q=0;q<sec.questions.length;q++){
        const qi = sec.questions[q];
        const globalIndex = getGlobalIndex(s,q);
        const qbox = document.createElement('div'); qbox.className='q';
        const qt = document.createElement('div'); qt.className='text';
        qt.setAttribute('data-ar', qi.ar); qt.setAttribute('data-en', qi.en);
        qt.textContent = LANG.current === 'ar' ? qi.ar : qi.en;
        qbox.appendChild(qt);
        const lik = document.createElement('div'); lik.className='likert';
        for(let v=1;v<=5;v++){
          const id = `q_${globalIndex}_${v}`;
          const input = document.createElement('input'); input.type='radio'; input.name=`q_${globalIndex}`; input.id=id; input.value=String(v);
          const label = document.createElement('label'); label.setAttribute('for', id);
          label.textContent = (LANG.current==='ar') ? String(v) : String(v);
          input.addEventListener('change', ()=> {
            answers[globalIndex] = parseInt(input.value,10);
            updateLive();
          });
          lik.appendChild(input); lik.appendChild(label);
        }
        qbox.appendChild(lik);
        qwrap.appendChild(qbox);
      }
      // navigation for this section
      const nav = document.createElement('div'); nav.className='actions';
      const nextBtn = document.createElement('button'); nextBtn.className='btn primary';
      nextBtn.textContent = LANG.current==='ar' ? 'التالي' : 'Next';
      nextBtn.addEventListener('click', ()=> {
        // validate all questions in this section answered
        const ok = validateSection(s);
        if(!ok){
          alert(LANG.current==='ar' ? 'يرجى الإجابة على جميع أسئلة هذا القسم.' : 'Please answer all questions in this section.');
          return;
        }
        goToSlide(s+2); // intro=0, sections start at 1; slide indexes in DOM are offset by 0
      });
      nav.appendChild(nextBtn);
      card.appendChild(qwrap); card.appendChild(nav);
      slidesEl.insertBefore(slide, lastSlide);
    }
  }

  function validateSection(sectionIdx){
    const sec = SECTIONS[sectionIdx];
    for(let q=0;q<sec.questions.length;q++){
      const gi = getGlobalIndex(sectionIdx,q);
      if(!answers[gi]) return false;
    }
    return true;
  }

  function goToSlide(idx){
    sectionIndex = idx;
    const offset = idx * -100;
    slidesEl.style.transform = `translateX(${offset}%)`;
    updateProgress();
    if(idx === SECTIONS.length + 1){
      showResult();
    }
  }

  function updateProgress(){
    const max = SECTIONS.length + 1;
    const done = Math.max(0, sectionIndex - 0);
    const pct = Math.round((done / (max)) * 100);
    progressBar.style.width = pct + '%';
    livePercent.textContent = pct + '%';
    liveText.textContent = LANG.current === 'ar' ? 'التقدم' : 'Progress';
  }

  function computeScore(){
    let total = 0;
    for(let i=0;i<answers.length;i++){
      total += (answers[i] && !isNaN(answers[i])) ? answers[i] : 1;
    }
    return total;
  }
  function scoreToPercent(score){
    const p = Math.round(((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100);
    return Math.max(0, Math.min(100, p));
  }
  function classify(percent){
    if(percent <= 40) return {level_ar:'منخفض', level_en:'Low', color:'#10b981', advice_ar:'استمر بهذا التوازن الرائع 👏', advice_en:'Keep this healthy balance 👏'};
    if(percent <= 69) return {level_ar:'متوسط', level_en:'Moderate', color:'#f59e0b', advice_ar:'حاول تقليل الوقت تدريجياً وتحسين نمط نومك 💡', advice_en:'Try reducing time gradually and improve sleep 💡'};
    return {level_ar:'شديد', level_en:'Severe', color:'#ef4444', advice_ar:'انتبِه! حاول تقليل المحتوى القصير واستبداله بأنشطة واقعية 🧘‍♂️', advice_en:'Warning! Reduce short-content use and replace with real activities 🧘‍♂️'};
  }

  function showResult(){
    const score = computeScore();
    const pct = scoreToPercent(score);
    finalPercent.textContent = pct + '%';
    rawScoreEl.textContent = `${score} / ${MAX_SCORE}`;
    const cls = classify(pct);
    finalSeverity.textContent = LANG.current === 'ar' ? cls.level_ar : cls.level_en;
    finalAdvice.textContent = LANG.current === 'ar' ? cls.advice_ar : cls.advice_en;
    finalUser.textContent = (LANG.current==='ar' ? 'الاسم: ' : 'Name: ') + (nameInput.value.trim() || '-') + ' — ' + (LANG.current==='ar' ? 'الهاتف: ' : 'Phone: ') + (phoneInput.value.trim() || '-');
    finalPercent.style.color = cls.color;
    finalSeverity.style.color = cls.color;
    finalAdvice.style.color = cls.color;
  }

  function updateLive(){
    const answered = answers.filter(a=>a).length;
    const pct = Math.round((answered / TOTAL_QUESTIONS) * 100);
    livePercent.textContent = pct + '%';
    progressBar.style.width = pct + '%';
  }

  function setLanguage(l){
    LANG.current = l;
    document.documentElement.dir = l==='ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar]').forEach(el=>{
      const ar = el.getAttribute('data-ar');
      const en = el.getAttribute('data-en') || ar;
      el.textContent = (l==='ar') ? ar : en;
    });
    // rebuild slides to update labels
    buildSlides();
    goToSlide(sectionIndex);
    btnAr.classList.toggle('active', l==='ar');
    btnEn.classList.toggle('active', l==='en');
  }

  btnAr.addEventListener('click', ()=> setLanguage('ar'));
  btnEn.addEventListener('click', ()=> setLanguage('en'));

  // start
  startBtn.addEventListener('click', ()=> {
    if(!nameInput.value.trim()){ alert('يرجى إدخال الاسم.'); nameInput.focus(); return; }
    if(!phoneInput.value.trim()){ alert('يرجى إدخال رقم الهاتف.'); phoneInput.focus(); return; }
    answers = Array(TOTAL_QUESTIONS).fill(null);
    buildSlides();
    goToSlide(1);
  });

  restartBtn.addEventListener('click', ()=> {
    if(!confirm(LANG.current==='ar' ? 'هل ترغب في إعادة الاختبار؟' : 'Restart test?')) return;
    answers = Array(TOTAL_QUESTIONS).fill(null);
    sectionIndex = 0;
    slidesEl.style.transform = 'translateX(0%)';
    progressBar.style.width = '0%';
    livePercent.textContent = '0%';
    finalPercent.textContent = '0%';
    rawScoreEl.textContent = `0 / ${MAX_SCORE}`;
    finalSeverity.textContent = '-';
    finalAdvice.textContent = '-';
    finalUser.textContent = '-';
    nameInput.value = '';
    phoneInput.value = '';
  });

  downloadBtn.addEventListener('click', ()=> {
    const score = computeScore(); const pct = scoreToPercent(score);
    const cls = classify(pct);
    const name = nameInput.value.trim() || '-'; const phone = phoneInput.value.trim() || '-';
    const title = (LANG.current==='ar') ? 'تقرير نتيجة اختبار تآكل الدماغ' : 'BRS Test Report';
    const html = `
      <html lang="${LANG.current==='ar'?'ar':'en'}" dir="${LANG.current==='ar'?'rtl':'ltr'}">
      <head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}</style></head>
      <body>
        <h1>${title}</h1>
        <p><strong>${LANG.current==='ar'?'الاسم':'Name'}:</strong> ${escapeHtml(name)}<br><strong>${LANG.current==='ar'?'الهاتف':'Phone'}:</strong> ${escapeHtml(phone)}</p>
        <p><strong>${LANG.current==='ار'?'النتيجة':'Score'}:</strong> ${pct}% (${score}/${MAX_SCORE})</p>
        <h3>${LANG.current==='ar'?'التصنيف':'Classification'}</h3>
        <p>${LANG.current==='ar'?cls.level_ar:cls.level_en} — ${LANG.current==='ar'?cls.advice_ar:cls.advice_en}</p>
      </body></html>
    `;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(()=> w.print(), 400);
  });

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[m];}); }

  // initial build
  buildSlides();
  updateLive();
})();