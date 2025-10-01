// Brain Rot Scale (BRS) - 16 core questions + optional extras
// English default; Arabic toggle available.

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
const copyBtn = document.getElementById('copy-btn');
const saveBtn = document.getElementById('save-btn');
const welcomeBanner = document.getElementById('welcome-banner');
const optionalArea = document.getElementById('optional-area');
const phoneArea = document.getElementById('phone-area');
const phoneInput = document.getElementById('phone-input');

let lang = localStorage.getItem('brs_lang') || 'en';

// Core 16 questions (sections as provided). Each option is 1-5 (Likert)
const QUESTIONS = [
  // Section 1: Usage Patterns (4)
  { q:{en:'How many hours daily do you spend on TikTok / Reels / Shorts?', ar:'كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟'} },
  { q:{en:'Do you open these apps automatically (without thinking)?', ar:'هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟'} },
  { q:{en:'Do you find it hard to stop after watching one short clip?', ar:'هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟'} },
  { q:{en:'Do you watch short clips even when you know you have more important tasks?', ar:'هل تشاهد مقاطع قصيرة حتى وأنت تعرف أن عندك مهام أهم؟'} },
  // Section 2: Cognitive Symptoms (4)
  { q:{en:'After short content, do you struggle to focus on study/work?', ar:'بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة/العمل؟'} },
  { q:{en:'Do you feel your short-term memory weakens after long use?', ar:'هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟'} },
  { q:{en:'Do you have difficulty reading a book or watching a long film due to impatience?', ar:'هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل بسبب فقدان الصبر؟'} },
  { q:{en:'Do you notice your attention gets distracted more easily than before?', ar:'هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟'} },
  // Section 3: Emotional/Psychological (4)
  { q:{en:'Do you feel empty or that your "brain is blank" after hours of browsing?', ar:'هل تشعر بفراغ أو “دماغك فاضي” بعد ساعات من التصفح؟'} },
  { q:{en:'Do you feel guilt or regret after spending long time on short clips?', ar:'هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل في المقاطع القصيرة؟'} },
  { q:{en:'Do you find it hard to enjoy normal activities compared to quick video pleasure?', ar:'هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالمتعة السريعة من الفيديوهات؟'} },
  { q:{en:'Do you feel anxious or stressed if you don\'t open the apps for a long time?', ar:'هل تشعر بالقلق أو التوتر لو لم تفتح التطبيقات لفترة طويلة؟'} },
  // Section 4: Behavioral Impact (4)
  { q:{en:'Does your usage affect your sleep (delayed sleep, fragmented)?', ar:'هل يؤثر استخدامك على نومك (تأخر نوم، نوم متقطع)؟'} },
  { q:{en:'Does it affect your academic or professional performance?', ar:'هل يؤثر على إنجازك الدراسي أو المهني؟'} },
  { q:{en:'Do you prioritize digital content over relationships or daily activities?', ar:'هل تجد نفسك تعطي الأولوية للمحتوى الرقمي على حساب علاقاتك أو نشاطاتك اليومية؟'} },
  { q:{en:'Have you tried to reduce usage and failed?', ar:'هل حاولت تقليل الاستخدام وفشلت؟'} }
];

// Optional extra clinical/daily-life questions (non-scored or small notes)
const OPTIONALS = [
  { q:{en:"When you wake up, is the first thing you do checking your phone?", ar:"اول ما بتصحى مالنوم بتفتح الموبايل؟"} },
  { q:{en:"Is the phone the last thing you do before sleep?", ar:"الموبايل بيبقى اخر حاجة بتعملها قبل النوم؟"} },
  { q:{en:"Do you hold the phone while with family/friends?", ar:"بتمسك الموبايل مع الاهل والصحاب؟"} },
  { q:{en:"Do you use the phone to remind birthdays or study schedules?", ar:"تستخدم الموبايل عشان تفتكر أعياد الميلاد وتفتكر المذاكرة؟"} },
  { q:{en:"Do you prefer short songs over long music (e.g., short clips)?", ar:"تحب تسمع ام كلثوم ولا أغاني قصيرة؟"} },
  { q:{en:"Do you memorize phone numbers of friends/family?", ar:"هل بتحفظ أرقام موبايلات أصحابك وأهلك؟"} },
  { q:{en:"How many hours do you spend on the internet a day (all apps)?", ar:"How many hours do you spend on the internet a day"} },
  { q:{en:"Type of content mostly: entertainment or educational?", ar:"Type of content (entertainment/educational) mostly"} },
  { q:{en:"Do you watch less-than-10-minute videos or longer videos mostly?", ar:"Less than 10 min videos / More than 10 min videos"} },
  { q:{en:"Do you log into the same app more than once even without notifications?", ar:"Do you log in to the same app more than once, even without notifications?"} },
  { q:{en:"How often do you check your own story? (attention-seeking)", ar:"How many times do you check on your own story (attention-seeking)?"} },
  { q:{en:"Have you noticed ads about something you talked about recently?", ar:"هل بتلاحظ انك ممكن تكون اتكلمت عن حاجة معينة مع حد وبدأ يطلعلك إعلانات عنها؟"} },
  { q:{en:"Do you speed videos to x2 while watching?", ar:"هل بتسرع الفيدوهات على ×2 وانت بنتفرج عليها؟"} }
];

// Scoring thresholds
// total range = 16..80
function classify(total){
  if(total <= 32) return 'Low';
  if(total <= 55) return 'Moderate';
  return 'High';
}
function classifyAr(total){
  if(total <= 32) return 'Low (استخدام طبيعي)';
  if(total <= 55) return 'Moderate (علامات Brain Rot متوسطة)';
  return 'High (Brain Rot شديد)';
}

function explanationText(level, lang){
  if(lang === 'en'){
    if(level === 'Low') return 'Your usage appears within a normal range. Maintain healthy habits.';
    if(level === 'Moderate') return 'You show moderate signs of screen-related cognitive/behavioral impact. Consider behavior changes.';
    return 'High level detected — consider structured changes and professional consultation if symptoms interfere with life.';
  } else {
    if(level.includes('Low')) return 'الاستخدام يبدو ضمن النطاق الطبيعي. حافظ على عادات صحية.';
    if(level.includes('Moderate')) return 'تظهر علامات متوسطة لتأثير الشاشة على الإدراك والسلوك. فكّر في تغييرات.';
    return 'تمّ اكتشاف مستوى عالي — فكر في تغييرات منظمة واستشر مختصًا إذا أثرت الأعراض.';
  }
}

function planFor(level, lang){
  if(lang === 'en'){
    if(level === 'Low') return ['Keep regular sleep and short breaks; schedule focused reading.','Limit screen before bed.'];
    if(level === 'Moderate') return ['Use app timers; reduce short-video time by 30–60 min/day; weekly screen-free period.','Practice short daily attention exercises (5-10 min).'];
    return ['Turn off non-essential notifications; schedule deep-focus sessions (45 min); consider professional help if no improvement.','Keep a daily log of sleep and mood.'];
  } else {
    if(level.includes('Low')) return ['حافظ على نوم منتظم وفترات راحة قصيرة؛ خصص وقتًا للقراءة المركزة.','قلل استخدام الهاتف قبل النوم.'];
    if(level.includes('Moderate')) return ['استخدم محددات زمن للتطبيقات؛ قلل 30–60 دقيقة يوميًا من الفيديوهات القصيرة؛ اجرب يومًا أسبوعيًا بلا شاشات.','مارس تمارين تركيز قصيرة يوميًا (5-10 دقائق).'];
    return ['عطّل الإشعارات غير المهمة؛ حدّد جلسات تركيز 45 دقيقة؛ فكّر بالاستشارة إن لم يكن هناك تحسّن.','سجّل النوم والحالة المزاجية يوميًا.'];
  }
}

// Render functions
function renderLikert(qIdx, container, qText){
  const div = document.createElement('div');
  div.className = 'question';
  const title = document.createElement('div');
  title.className = 'q-title';
  title.innerText = qText;
  div.appendChild(title);
  const likert = document.createElement('div');
  likert.className = 'likert';
  const labels = [(lang==='en')? '1
Never':'1
أبدًا', (lang==='en')? '2
Rarely':'2
نادراً', (lang==='en')? '3
Sometimes':'3
أحيانًا', (lang==='en')? '4
Often':'4
غالبًا', (lang==='en')? '5
Always':'5
دائمًا'];
  for(let i=1;i<=5;i++){
    const id = 'q' + qIdx + 'o' + i;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.innerText = labels[i-1];
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'q' + qIdx;
    input.id = id;
    input.value = i;
    input.addEventListener('change', ()=>{
      // mark selected visually
      const siblings = likert.querySelectorAll('label');
      siblings.forEach(l=>l.classList.remove('selected'));
      label.classList.add('selected');
    });
    likert.appendChild(label);
    likert.appendChild(input);
  }
  div.appendChild(likert);
  container.appendChild(div);
}

function renderQuiz(){
  quizForm.innerHTML = '';
  QUESTIONS.forEach((item, idx) => {
    renderLikert(idx, quizForm, item.q[lang]);
  });
  // optional extras
  optionalArea.innerHTML = '';
  OPTIONALS.forEach((it, idx) => {
    const p = document.createElement('p');
    p.innerText = it.q[lang];
    optionalArea.appendChild(p);
  });

  // update UI strings
  document.getElementById('quiz-title').innerText = (lang==='en')? 'Answer the 16 core questions' : 'أجب عن الأسئلة الأساسية الـ 16';
  document.getElementById('instructions').innerText = (lang==='en')? 'Please answer all 16 core questions using the 1–5 scale (1 = Never, 5 = Always).' : 'من فضلك أجب عن الأسئلة الأساسية الستة عشر باستخدام مقياس 1–5 (1 = أبدًا، 5 = دائمًا).';
  submitBtn.innerText = (lang==='en')? 'Submit' : 'إرسال';
  resetBtn.innerText = (lang==='en')? 'Reset' : 'إعادة';
  document.getElementById('site-title').innerText = (lang==='en')? 'Brain Rot Scale (BRS)' : 'مقياس Brain Rot (BRS)';
  welcomeBanner.innerText = (lang==='en')? '🧠 Welcome — Brain Rot Scale (BRS): 16-question self-assessment' : '🧠 أهلاً بك — مقياس Brain Rot: استبيان مكوّن من 16 سؤالاً';
  document.getElementById('note-text').innerText = (lang==='en')? 'This questionnaire is informational and not a medical diagnosis. If you are worried about memory or mood, consult a professional.' : 'هذا الاستبيان لأغراض معلوماتية وليس تشخيصًا طبيًا. إذا كنت قلقًا بشأن الذاكرة أو المزاج استشر مختص.';
  document.getElementById('footer-text').innerText = (lang==='en')? 'Brain Rot Scale (BRS)' : 'مقياس Brain Rot (BRS)';
}

function collectScore(){
  const qDivs = quizForm.querySelectorAll('.question');
  let total = 0;
  let answered = 0;
  qDivs.forEach((q, idx) => {
    const val = quizForm.querySelector('input[name="q'+idx+'"]:checked');
    if(val){
      total += parseInt(val.value);
      answered++;
    }
  });
  return { total, answered };
}

submitBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const res = collectScore();
  if(res.answered < QUESTIONS.length){
    alert((lang==='en')? 'Please answer all 16 core questions before submitting.' : 'من فضلك أجب على جميع الأسئلة الأساسية الستة عشر قبل الإرسال.');
    return;
  }
  const total = res.total;
  const level = (lang==='en')? classify(total) : classifyAr(total);
  const explanation = explanationText(level, lang);
  const plan = planFor(level, lang);

  scoreDisplay.innerText = (lang==='en')? `Total score: ${total} / ${QUESTIONS.length * 5}` : `إجمالي الدرجة: ${total} / ${QUESTIONS.length * 5}`;
  levelDisplay.innerText = (lang==='en')? `Classification: ${level}` : `التصنيف: ${level}`;
  explanationEl.innerText = explanation;
  planList.innerHTML = '';
  plan.forEach(p=>{ const li = document.createElement('li'); li.innerText = p; planList.appendChild(li); });

  // show result and optional follow-up area
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  document.getElementById('followup-section').classList.remove('hidden');
});

copyBtn.addEventListener('click', ()=>{
  const text = scoreDisplay.innerText + '\n' + levelDisplay.innerText + '\n' + explanationEl.innerText;
  navigator.clipboard.writeText(text).then(()=>{ alert((lang==='en')? 'Result copied to clipboard.' : 'تم نسخ النتيجة'); }).catch(()=>{ alert((lang==='en')? 'Copy failed' : 'فشل النسخ'); });
});

saveBtn.addEventListener('click', ()=>{
  const res = collectScore();
  const item = { date:new Date().toISOString(), total:res.total };
  const stored = JSON.parse(localStorage.getItem('brs_history')||'[]');
  stored.unshift(item);
  localStorage.setItem('brs_history', JSON.stringify(stored.slice(0,50)));
  alert((lang==='en')? 'Result saved locally.' : 'تم حفظ النتيجة محليًا.');
});

resetBtn.addEventListener('click',(e)=>{ e.preventDefault(); renderQuiz(); resultSection.classList.add('hidden'); quizSection.classList.remove('hidden'); });

backBtn.addEventListener('click', ()=>{ resultSection.classList.add('hidden'); quizSection.classList.remove('hidden'); });

// follow-up radio behavior
document.addEventListener('change', (e)=>{
  if(e.target && e.target.name === 'follow'){
    if(e.target.value === 'yes') { phoneArea.classList.remove('hidden'); }
    else { phoneArea.classList.add('hidden'); phoneInput.value=''; }
  }
});

// language toggle
langBtn.addEventListener('click', ()=>{
  lang = (lang==='en')? 'ar':'en';
  localStorage.setItem('brs_lang', lang);
  document.documentElement.dir = (lang==='ar')? 'rtl' : 'ltr';
  renderQuiz();
});

// initial render
document.addEventListener('DOMContentLoaded', ()=>{
  document.documentElement.dir = (lang==='ar')? 'rtl' : 'ltr';
  renderQuiz();
});

