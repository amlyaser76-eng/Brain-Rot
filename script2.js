// Brain Rot - 10 Questions Test (English default) with bilingual support and scoring

const langBtn = document.getElementById('lang-btn');
const quizForm = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const backBtn = document.getElementById('back-btn');
const resultSection = document.getElementById('result-section');
const quizSection = document.getElementById('quiz-section');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const explanationEl = document.getElementById('explanation');
const planList = document.getElementById('plan-list');
const shareBtn = document.getElementById('share-btn');
const welcomeBanner = document.getElementById('welcome-banner');

let lang = localStorage.getItem('brainrot_lang') || 'en';

// Questions data: text in two languages, options with scores
const QUESTIONS = [
  { q:{en:'How many hours per day do you spend on social media?', ar:'كم ساعة يوميًا تقضي على وسائل التواصل؟'},
    opts:[
      {en:'Less than 1 hour', ar:'أقل من ساعة', score:0},
      {en:'1-3 hours', ar:'1-3 ساعات', score:1},
      {en:'4-6 hours', ar:'4-6 ساعات', score:2},
      {en:'More than 6 hours', ar:'أكثر من 6 ساعات', score:3},
    ]
  },
  { q:{en:'How often do you find it hard to focus on work/study?', ar:'كم مرة تجد صعوبة في التركيز في العمل/الدراسة؟'},
    opts:[
      {en:'Never', ar:'أبدًا', score:0},
      {en:'Sometimes', ar:'أحيانًا', score:1},
      {en:'Often', ar:'غالبًا', score:2},
      {en:'Almost always', ar:'دائمًا تقريبًا', score:3},
    ]
  },
  { q:{en:'Do you struggle to read a full article or book chapter?', ar:'هل تجد صعوبة في قراءة مقال كامل أو فصل من كتاب؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'A little', ar:'قليلًا', score:1},
      {en:'Quite a bit', ar:'إلى حد كبير', score:2},
      {en:'Completely', ar:'تمامًا', score:3},
    ]
  },
  { q:{en:'Does phone use before bed affect your sleep?', ar:'هل يؤثر استخدام الهاتف قبل النوم على نومك؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'Sometimes', ar:'أحيانًا', score:1},
      {en:'Often', ar:'غالبًا', score:2},
      {en:'Yes, a lot', ar:'نعم كثيرًا', score:3},
    ]
  },
  { q:{en:'Do you find your short-term memory worsening?', ar:'هل تلاحظ تراجعًا في الذاكرة قصيرة الأمد؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'Slightly', ar:'قليلًا', score:1},
      {en:'Moderately', ar:'متوسط', score:2},
      {en:'Significantly', ar:'بشكل واضح', score:3},
    ]
  },
  { q:{en:'Do you prefer quick short videos over deep learning?', ar:'هل تفضل الفيديوهات القصيرة على التعلم العميق؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'Sometimes', ar:'أحيانًا', score:1},
      {en:'Often', ar:'غالبًا', score:2},
      {en:'Always', ar:'دائمًا', score:3},
    ]
  },
  { q:{en:'How often do you multitask on screens (tabs, apps)?', ar:'كم مرة تعدد المهام على الشاشات (تبويبات، تطبيقات)؟'},
    opts:[
      {en:'Rarely', ar:'نادراً', score:0},
      {en:'Occasionally', ar:'أحيانًا', score:1},
      {en:'Frequently', ar:'غالبًا', score:2},
      {en:'Constantly', ar:'دائمًا', score:3},
    ]
  },
  { q:{en:'Do you feel less motivated to complete small tasks?', ar:'هل تشعر بقلة الحافز لإنهاء المهام البسيطة؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'A bit', ar:'قليلًا', score:1},
      {en:'Moderately', ar:'متوسط', score:2},
      {en:'Yes, often', ar:'نعم كثيرًا', score:3},
    ]
  },
  { q:{en:'Does excessive screen time affect your mood (anxiety, boredom)?', ar:'هل يؤثر الإفراط في وقت الشاشة على مزاجك؟'},
    opts:[
      {en:'No', ar:'لا', score:0},
      {en:'A little', ar:'قليلًا', score:1},
      {en:'Moderately', ar:'متوسط', score:2},
      {en:'Significantly', ar:'بشكل واضح', score:3},
    ]
  },
  { q:{en:'Have you tried to cut down screen time and failed?', ar:'هل حاولت تقليل وقت الشاشة وفشلت؟'},
    opts:[
      {en:'I did not try', ar:'لم أحاول', score:0},
      {en:'Sometimes I succeeded', ar:'نجحت أحيانًا', score:1},
      {en:'Often failed', ar:'فشلت أحيانًا', score:2},
      {en:'Always failed', ar:'فشلت دائمًا', score:3},
    ]
  }
];

// Levels thresholds
// total max = 10 * 3 = 30
function getLevel(total){
  if(total <= 10) return 'Low';
  if(total <= 20) return 'Medium';
  return 'High';
}

function getLevelAr(total){
  if(total <= 10) return 'بسيط';
  if(total <= 20) return 'متوسط';
  return 'شديد';
}

function getExplanation(level, lang){
  if(lang === 'en'){
    if(level === 'Low') return 'Your brain health seems fine — small healthy changes can help maintain focus.';
    if(level === 'Medium') return 'You show moderate signs of distraction and screen-related effects. Consider adjustments.';
    return 'Significant impact detected — consider structured changes and professional advice if needed.';
  } else {
    if(level === 'بسيط') return 'حالة الدماغ تظهر جيدة — تغييرات بسيطة تحافظ على التركيز مفيدة.';
    if(level === 'متوسط') return 'تظهر علامات متوسطة للتشتت وتأثير الشاشات. فكر في بعض التعديلات.';
    return 'تأثير واضح ملحوظ — فكر في تغييرات منظمة واطلب رأي مختص إذا استمر الوضع.';
  }
}

function getPlan(level, lang){
  const plans = {
    Low: {
      en: ['Keep regular sleep, short breaks during work, 15–30 min focused reading daily.'],
      ar: ['حافظ على نوم منتظم، فترات راحة قصيرة أثناء العمل، قراءة مركزة 15–30 دقيقة يومياً.']
    },
    Medium: {
      en: ['Set social limits, reduce short-video time by 30–60 min/day, try weekly screen-free period.'],
      ar: ['ضع حدود للسوشيال، قلل 30–60 دقيقة يوميًا من الفيديوهات القصيرة، جرب يوم بلا شاشات أسبوعياً.']
    },
    High: {
      en: ['Turn off notifications, schedule deep-focus sessions (45 min), consider professional consultation.'],
      ar: ['افصل الإشعارات، حدد جلسات تركيز 45 دقيقة، وفكر في استشارة مختص إذا استمر الوضع.']
    }
  };
  if(lang === 'en') return plans[level].en;
  // map Arabic label to English keys
  if(level === 'بسيط') return plans.Low.ar;
  if(level === 'متوسط') return plans.Medium.ar;
  return plans.High.ar;
}

// Render quiz
function renderQuiz(){
  quizForm.innerHTML = '';
  QUESTIONS.forEach((item, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    const qTitle = document.createElement('div');
    qTitle.className = 'q-title';
    qTitle.innerText = item.q[lang];
    qDiv.appendChild(qTitle);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    item.opts.forEach((opt, oi) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.innerText = opt[lang];
      btn.dataset.score = opt.score;
      btn.dataset.qidx = idx;
      btn.addEventListener('click', () => {
        // mark selection: only one per question
        const siblings = optsDiv.querySelectorAll('.option');
        siblings.forEach(s => s.classList.remove('selected'));
        btn.classList.add('selected');
        // store selection on question element
        qDiv.dataset.selected = opt.score;
      });
      optsDiv.appendChild(btn);
    });
    qDiv.appendChild(optsDiv);
    quizForm.appendChild(qDiv);
  });

  // update static texts
  document.getElementById('quiz-title').innerText = (lang === 'en')? 'Answer the 10 questions' : 'أجب عن الأسئلة العشرة';
  submitBtn.innerText = (lang === 'en')? 'Submit' : 'إرسال';
  resetBtn.innerText = (lang === 'en')? 'Reset' : 'إعادة';
  backBtn.innerText = (lang === 'en')? 'Back' : 'العودة';
  document.getElementById('site-title').innerText = (lang === 'en')? 'Brain Rot' : 'Brain Rot';
  welcomeBanner.innerText = (lang === 'en')? '🧠 Welcome to the Brain Rot 10-question self-test — Check your focus & memory' : '🧠 أهلاً بك في اختبار Brain Rot المكوّن من 10 أسئلة — قيّم تركيزك وذاكرتك';
}

// Submit handler
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // compute total
  const qDivs = quizForm.querySelectorAll('.question');
  let total = 0;
  let answered = 0;
  qDivs.forEach(q => {
    const sel = q.dataset.selected;
    if(typeof sel !== 'undefined'){
      total += parseInt(sel);
      answered++;
    }
  });
  if(answered < QUESTIONS.length){
    alert((lang === 'en')? 'Please answer all questions before submitting.' : 'من فضلك أجب على جميع الأسئلة قبل الإرسال.');
    return;
  }
  const level = (lang === 'en')? getLevel(total) : getLevelAr(total);
  const explanation = getExplanation(level, (lang === 'en')? 'en' : 'ar');
  const plan = getPlan(level, (lang === 'en')? 'en' : 'ar');

  scoreDisplay.innerText = (lang === 'en')? `Score: ${total} / ${QUESTIONS.length * 3}` : `الدرجة: ${total} / ${QUESTIONS.length * 3}`;
  levelDisplay.innerText = (lang === 'en')? `Level: ${level}` : `المستوى: ${level}`;
  explanationEl.innerText = explanation;
  planList.innerHTML = '';
  plan.forEach(p => {
    const li = document.createElement('li'); li.innerText = p; planList.appendChild(li);
  });

  // show result
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
});

// Reset
resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  renderQuiz();
  resultSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
});

// Back button
backBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
});

// Share
shareBtn.addEventListener('click', () => {
  const text = scoreDisplay.innerText + ' - ' + levelDisplay.innerText + '\n' + explanationEl.innerText;
  navigator.clipboard.writeText(text).then(()=>{ alert((lang==='en')? 'Result copied to clipboard.' : 'تم نسخ النتيجة'); }).catch(()=>{ alert((lang==='en')? 'Copy failed' : 'فشل النسخ'); });
});

// Language toggle
langBtn.addEventListener('click', () => {
  lang = (lang === 'en')? 'ar' : 'en';
  localStorage.setItem('brainrot_lang', lang);
  // adjust direction
  document.documentElement.dir = (lang === 'ar')? 'rtl' : 'ltr';
  renderQuiz();
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dir = (lang === 'ar')? 'rtl' : 'ltr';
  renderQuiz();
});
