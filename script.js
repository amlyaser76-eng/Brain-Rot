// Brain Rot - Enhanced static site with bilingual support and localStorage history

const LOCALE = {
  ar: {
    title: 'Brain Rot',
    subtitle: 'اختبار سريع لتقييم مدى تأثر الانتباه والذاكرة بعادات الشاشة',
    prev: 'سابق',
    next: 'التالي',
    restart: 'إعادة',
    save: 'حفظ النتيجة',
    share: 'نسخ النتيجة',
    history: 'السجل',
    close: 'إغلاق',
    clear: 'مسح السجل',
    resultTitle: 'النتيجة',
    plan2w: 'خطة لمدة أسبوعين',
    plan3m: 'خطة لمدة 3 أشهر',
    footer: 'هذا تطبيق توعوي تعليمي فقط وليس بديلاً عن تقييم طبي. إذا كانت الأعراض شديدة استشر مختص.'
  },
  en: {
    title: 'Brain Rot',
    subtitle: 'Quick self-check for attention & memory affected by screen habits',
    prev: 'Prev',
    next: 'Next',
    restart: 'Restart',
    save: 'Save result',
    share: 'Copy result',
    history: 'History',
    close: 'Close',
    clear: 'Clear history',
    resultTitle: 'Result',
    plan2w: '2-week plan',
    plan3m: '3-month plan',
    footer: 'This is an informational self-check, not medical advice. Consult a professional if symptoms are severe.'
  }
};

let lang = localStorage.getItem('brainrot_lang') || 'ar';

const questions = [
  // Each question: { q: {ar, en}, opts: [{ar,en}], scores: [...] }
  { q:{ar:'كم مرة في اليوم تجد صعوبة تركز فيها أكثر من 2-3 دقائق على مهمة واحدة؟', en:'How often do you find it hard to focus for more than 2-3 minutes on one task?'},
    opts:[{ar:'نادراً أو لا',en:'Rarely or not'},{ar:'مرتين تقريباً',en:'About twice'},{ar:'عدة مرات',en:'Several times'},{ar:'طوال اليوم',en:'All day'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تشعر أن ذاكرتك قصيرة الأمد تدهورت (تنسي أين وضعت أشياء بسيطة)؟', en:'Do you feel your short-term memory worsened (forgetting simple things)?'},
    opts:[{ar:'لا أبداً',en:'Never'},{ar:'قليلًا',en:'A little'},{ar:'متوسط',en:'Moderate'},{ar:'كثيرًا',en:'A lot'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'كم من الوقت تقضي يومياً في تصفح فيديوهات قصيرة / سوشيال ميديا؟', en:'How long do you spend daily on short videos / social media?'},
    opts:[{ar:'أقل من 30 دقيقة',en:'<30 min'},{ar:'30-90 دقيقة',en:'30-90 min'},{ar:'2-4 ساعات',en:'2-4 hours'},{ar:'أكثر من 4 ساعات',en:'>4 hours'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تجد صعوبة في قراءة كتاب أو مشاهدة فيلم كامل دون أن تشتت؟', en:'Do you struggle to read a book or watch a whole movie without distraction?'},
    opts:[{ar:'لا، أقرأ/أشاهد بسهولة',en:'No, I can'},{ar:'أحيانًا',en:'Sometimes'},{ar:'غالبًا',en:'Often'},{ar:'نادرًا ما أتمكن',en:'Rarely'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل يؤثر استخدام الهاتف قبل النوم على نومك (تأخر، استيقاظ)؟', en:'Does phone use before bed affect your sleep (delay, wakeups)?'},
    opts:[{ar:'لا',en:'No'},{ar:'قليلًا',en:'A little'},{ar:'متوسط',en:'Moderate'},{ar:'نعم بشكل كبير',en:'Yes, a lot'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تشعر بتراجع الدافع لإنجاز مهام بسيطة (تنظيف، دراسة، عمل)؟', en:'Do you feel decreased motivation to do simple tasks?'},
    opts:[{ar:'لا أبداً',en:'Never'},{ar:'قليل',en:'A little'},{ar:'متوسط',en:'Moderate'},{ar:'متوقف تمامًا أحيانًا',en:'Sometimes stopped completely'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تحس أن تفكيرك يطفو على السطح (تفكير سطحي، أفكار متقطعة)؟', en:'Do you feel your thinking is shallow or fragmented?'},
    opts:[{ar:'لا أبدًا',en:'Never'},{ar:'نادرًا',en:'Rarely'},{ar:'متكرر',en:'Often'},{ar:'دائمًا',en:'Always'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تتأثر قدرتك على تخطيط اليوم أو تذكر مواعيد بسيطة؟', en:'Is your ability to plan your day or remember appointments affected?'},
    opts:[{ar:'لا',en:'No'},{ar:'قليلًا',en:'A little'},{ar:'أحيانًا',en:'Sometimes'},{ar:'كثيرًا',en:'A lot'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تلاحظ تغيّراً في مزاجك مرتبط بالاستخدام المفرط للشاشة (اضطراب، قلق، ملل)؟', en:'Do you notice mood changes related to excessive screen use?'},
    opts:[{ar:'لا',en:'No'},{ar:'قليلًا',en:'A little'},{ar:'متوسط',en:'Moderate'},{ar:'نعم بشكل واضح',en:'Yes clearly'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل أصبحت تميل إلى الاستهلاك السهل للمحتوى بدلاً من التعلم العميق (مقالات، كورسات)?', en:'Do you prefer shallow content consumption instead of deep learning?'},
    opts:[{ar:'لا',en:'No'},{ar:'قليلًا',en:'A little'},{ar:'غالبًا',en:'Often'},{ar:'دائمًا',en:'Always'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل حاولت تقليل الوقت على السوشيال لكن فشلت؟', en:'Have you tried to reduce social time but failed?'},
    opts:[{ar:'لم أحاول',en:'Did not try'},{ar:'نجحت أحيانًا',en:'Sometimes succeeded'},{ar:'فشلت أحيانًا',en:'Sometimes failed'},{ar:'فشلت دائمًا',en:'Always failed'}],
    scores:[0,1,2,3]
  },
  { q:{ar:'هل تأثير هذا الوضع يعيق عملك أو دراستك أو علاقاتك؟', en:'Does this situation interfere with work/study/relationships?'},
    opts:[{ar:'لا إطلاقًا',en:'Not at all'},{ar:'قليلًا',en:'A little'},{ar:'متوسط',en:'Moderate'},{ar:'بشكل واضح',en:'Clearly'}],
    scores:[0,1,2,3]
  }
];

let current = 0;
const answers = new Array(questions.length).fill(null);

function t(key){
  return LOCALE[lang][key] || '';
}

function setLang(newLang){
  lang = newLang;
  localStorage.setItem('brainrot_lang', lang);
  document.documentElement.dir = (lang==='ar')? 'rtl' : 'ltr';
  // update static strings
  document.getElementById('app-title').textContent = LOCALE[lang].title;
  document.getElementById('app-sub').textContent = LOCALE[lang].subtitle;
  document.getElementById('progress-text').textContent = `${(lang==='ar')? 'سؤال' : 'Question'} ${current+1} / ${questions.length}`;
  document.getElementById('prev-btn').textContent = t('prev');
  document.getElementById('next-btn').textContent = t('next');
  document.getElementById('restart-btn').textContent = t('restart');
  document.getElementById('save-btn') && (document.getElementById('save-btn').textContent = t('save'));
  document.getElementById('share-btn') && (document.getElementById('share-btn').textContent = t('share'));
  document.getElementById('history-btn').textContent = t('history');
  document.getElementById('close-history') && (document.getElementById('close-history').textContent = t('close'));
  document.getElementById('clear-history') && (document.getElementById('clear-history').textContent = t('clear'));
  document.getElementById('result-title') && (document.getElementById('result-title').textContent = t('resultTitle'));
  document.getElementById('plan-2w-title') && (document.getElementById('plan-2w-title').textContent = t('plan2w'));
  document.getElementById('plan-3m-title') && (document.getElementById('plan-3m-title').textContent = t('plan3m'));
  document.getElementById('footer-note').textContent = t('footer');
  // active button states
  document.getElementById('lang-ar').classList.toggle('active', lang==='ar');
  document.getElementById('lang-en').classList.toggle('active', lang==='en');
  renderQuestion();
}

function renderQuestion(){
  const qObj = questions[current];
  document.getElementById('progress-text').textContent = `${(lang==='ar')? 'سؤال' : 'Question'} ${current+1} / ${questions.length}`;
  const qArea = document.getElementById('question-area');
  qArea.innerHTML = `<p>${qObj.q[lang]}</p>`;
  const opts = document.getElementById('options-area');
  opts.innerHTML = '';
  qObj.opts.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'option';
    btn.tabIndex = 0;
    btn.textContent = opt[lang];
    if(answers[current] === i) btn.classList.add('selected');
    btn.onclick = () => selectOption(i);
    btn.onkeypress = (e)=>{ if(e.key==='Enter') selectOption(i); };
    opts.appendChild(btn);
  });
  document.getElementById('prev-btn').disabled = current === 0;
}

function selectOption(index){
  answers[current] = index;
  // don't auto-next; wait user to press next for control
  renderQuestion();
}

function prevQuestion(){
  if(current>0){ current--; renderQuestion(); }
}

function nextQuestion(){
  if(answers[current] === null){
    alert((lang==='ar')? 'اختر إجابة قبل المتابعة' : 'Please choose an answer before continuing');
    return;
  }
  if(current < questions.length - 1){
    current++;
    renderQuestion();
  } else {
    showResult();
  }
}

function computeScore(){
  let total=0; let max=0;
  for(let i=0;i<questions.length;i++){
    const scArr = questions[i].scores;
    const ans = answers[i];
    if(ans===null) continue;
    total += scArr[ans];
    max += Math.max(...scArr);
  }
  return {total, max};
}

function getLevel(total, max){
  const pct = total / max;
  if(pct < 0.2) return (lang==='ar')? 'قليل' : 'Low';
  if(pct < 0.45) return (lang==='ar')? 'متوسط' : 'Medium';
  if(pct < 0.75) return (lang==='ar')? 'كبير' : 'High';
  return (lang==='ar')? 'شديد' : 'Severe';
}

function getPlan(levelKey){
  // return object with strings in current lang
  if(levelKey.includes('قليل') || levelKey==='Low'){
    return {
      title: (lang==='ar')? 'مستوى: قليل — حالتك مقبولة' : 'Level: Low — Acceptable',
      advice: [(lang==='ar')? 'نوم منتظم وفترات راحة قصيرة' : 'Maintain regular sleep and short breaks',
               (lang==='ar')? 'قلل التصفح قبل النوم' : 'Reduce browsing before bed',
               (lang==='ar')? 'مارس نشاط بدني خفيف' : 'Do light physical activity'],
      twoWeeks: [(lang==='ar')? 'حدد حد وقت للشاشة' : 'Set a daily screen-time limit',
                 (lang==='ar')? 'جرب تقنية بومودورو 25/5' : 'Try Pomodoro 25/5'],
      threeMonths: [(lang==='ar')? 'اجعل القراءة المركزة عادة أسبوعية' : 'Make focused reading a weekly habit',
                    (lang==='ar')? 'تقييم ذاتي بعد 3 أشهر' : 'Self-assess after 3 months']
    };
  } else if(levelKey.includes('متوسط') || levelKey==='Medium'){
    return {
      title: (lang==='ar')? 'مستوى: متوسط — يستحق الانتباه' : 'Level: Medium — Needs attention',
      advice: [(lang==='ar')? 'قواعد للسوشيال ميديا' : 'Set social media rules',
               (lang==='ar')? 'روتين نوم ثابت' : 'Regular sleep routine',
               (lang==='ar')? 'تمارين تركيز 5-10 دقائق' : '5-10 min focus exercises'],
      twoWeeks: [(lang==='ar')? 'قلل 30-60 دقيقة يوميا من الفيديوهات القصيرة' : 'Reduce 30-60 min/day of short videos',
                 (lang==='ar')? 'يوم بلا شاشات أسبوعيا' : 'Weekly screen-free day'],
      threeMonths: [(lang==='ar')? 'ابدأ مشروع تعلم صغير' : 'Start a small learning project',
                    (lang==='ar')? 'سجل تطور التركيز أسبوعياً' : 'Track focus progress weekly']
    };
  } else if(levelKey.includes('كبير') || levelKey==='High'){
    return {
      title: (lang==='ar')? 'مستوى: كبير — تغيير فعلي مطلوب' : 'Level: High — Action required',
      advice: [(lang==='ar')? 'افصل الإشعارات' : 'Turn off notifications',
               (lang==='ar')? 'تحكم بالكافيين بعد الظهر' : 'Control afternoon caffeine',
               (lang==='ar')? 'جلسات تركيز 45 دقيقة' : 'Two 45-min deep-focus sessions'],
      twoWeeks: [(lang==='ar')? 'قواعد صارمة لاستخدام السوشيال' : 'Strict social rules',
                 (lang==='ar')? 'ابدأ دفتر يومي للإنجازات' : 'Start a daily achievements journal'],
      threeMonths: [(lang==='ar')? 'روتين يومي مستدام' : 'Sustainable daily routine',
                    (lang==='ar')? 'استشر مختص إذا لم يحدث تحسن' : 'Consult a specialist if no improvement']
    };
  } else {
    return {
      title: (lang==='ar')? 'مستوى: شديد — يُنصح بالتقييم المهني' : 'Level: Severe — Seek professional evaluation',
      advice: [(lang==='ar')? 'راجع طبيب/أخصائي نفسي أو أعصاب' : 'See a doctor/psychologist/neuro specialist',
               (lang==='ar')? 'مراقبة النوم والكافيين' : 'Monitor sleep and caffeine',
               (lang==='ar')? 'خطة تقليل شاشات بمرافقة' : 'Support-backed screen reduction plan'],
      twoWeeks: [(lang==='ar')? 'سجل يومي للنوم والمزاج' : 'Daily log of sleep & mood',
                 (lang==='ar')? 'ابدأ جلسات تأمل وممارسة رياضة قصيرة يومياً' : 'Start short daily meditation & exercise'],
      threeMonths: [(lang==='ar')? 'متابعة مع أخصائي' : 'Follow-up with a specialist',
                    (lang==='ar')? 'برنامج إعادة تدريب الانتباه بإشراف متخصص' : 'Attention retraining program under supervision']
    };
  }
}

function showResult(){
  const res = computeScore();
  const lvl = getLevel(res.total, res.max);
  document.getElementById('score-text').textContent = `${(lang==='ar')? 'درجتك:' : 'Score:'} ${res.total} / ${res.max}  (${Math.round(res.total/res.max*100)||0}%)`;
  document.getElementById('level-title').textContent = getPlan(lvl).title;
  // advice
  const adviceArea = document.getElementById('advice-area');
  adviceArea.innerHTML = '<h4>' + ((lang==='ar')? 'نصائح عامة:' : 'General advice:') + '</h4>';
  getPlan(lvl).advice.forEach(a=>{
    const p = document.createElement('p'); p.textContent = '• ' + a; adviceArea.appendChild(p);
  });
  // plans
  const two = document.getElementById('two-weeks'); two.innerHTML='';
  getPlan(lvl).twoWeeks.forEach(a=>{ const li=document.createElement('li'); li.textContent=a; two.appendChild(li); });
  const three = document.getElementById('three-months'); three.innerHTML='';
  getPlan(lvl).threeMonths.forEach(a=>{ const li=document.createElement('li'); li.textContent=a; three.appendChild(li); });

  // show/hide
  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');
  document.getElementById('history-section').classList.add('hidden');
}

function saveResultToHistory(){
  const res = computeScore();
  const lvl = getLevel(res.total, res.max);
  const item = {
    date: new Date().toISOString(),
    score: res.total,
    max: res.max,
    pct: Math.round(res.total/res.max*100)||0,
    level: lvl,
    lang: lang
  };
  const stored = JSON.parse(localStorage.getItem('brainrot_history')||'[]');
  stored.unshift(item);
  localStorage.setItem('brainrot_history', JSON.stringify(stored.slice(0,50))); // keep last 50
  alert((lang==='ar')? 'تم حفظ النتيجة' : 'Result saved');
}

function showHistory(){
  const list = JSON.parse(localStorage.getItem('brainrot_history')||'[]');
  const area = document.getElementById('history-list');
  area.innerHTML = '';
  if(list.length===0){
    area.innerHTML = '<p>' + ((lang==='ar')? 'لا توجد نتائج محفوظة' : 'No saved results') + '</p>';
  } else {
    list.forEach(it=>{
      const div = document.createElement('div'); div.className='history-item';
      const d = new Date(it.date);
      div.innerHTML = `<strong>${it.score} / ${it.max} (${it.pct}%)</strong><small>${d.toLocaleString()} — ${it.level}</small>`;
      area.appendChild(div);
    });
  }
  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('history-section').classList.remove('hidden');
}

function clearHistory(){
  if(confirm((lang==='ar')? 'مسح كل السجل؟' : 'Clear all history?')){
    localStorage.removeItem('brainrot_history');
    showHistory();
  }
}

function copyResult(){
  const txt = document.getElementById('score-text').textContent + '\n' + document.getElementById('level-title').textContent;
  navigator.clipboard.writeText(txt).then(()=>{ alert((lang==='ar')? 'تم نسخ النتيجة' : 'Copied'); }).catch(()=>{ alert((lang==='ar')? 'فشل النسخ' : 'Copy failed'); });
}

function restart(){
  for(let i=0;i<answers.length;i++)answers[i]=null;
  current=0;
  document.getElementById('quiz-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('history-section').classList.add('hidden');
  renderQuestion();
}

// init bindings
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('lang-ar').addEventListener('click', ()=>setLang('ar'));
  document.getElementById('lang-en').addEventListener('click', ()=>setLang('en'));
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('restart-btn').addEventListener('click', restart);
  document.getElementById('save-btn').addEventListener('click', saveResultToHistory);
  document.getElementById('share-btn').addEventListener('click', copyResult);
  document.getElementById('history-btn').addEventListener('click', showHistory);
  document.getElementById('close-history').addEventListener('click', ()=>{ document.getElementById('history-section').classList.add('hidden'); document.getElementById('quiz-section').classList.remove('hidden'); });
  document.getElementById('clear-history').addEventListener('click', clearHistory);

  setLang(lang);
});
