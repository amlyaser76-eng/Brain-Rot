// Language data and labels
const Q = {
  ar: [
    "كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟",
    "هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟",
    "هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟",
    "هل تشاهد مقاطع قصيرة حتى وأنت تعرف أن عندك مهام أهم؟",
    "بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة/العمل؟",
    "هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟",
    "هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل بسبب فقدان الصبر؟",
    "هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟",
    "هل تشعر بفراغ أو "دماغك فاضي" بعد ساعات من التصفح؟",
    "هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل في المقاطع القصيرة؟",
    "هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالمتعة السريعة من الفيديوهات؟",
    "هل تشعر بالقلق أو التوتر لو لم تفتح التطبيقات لفترة طويلة؟",
    "هل يؤثر استخدامك على نومك (تأخر نوم، نوم متقطع)؟",
    "هل يؤثر على إنجازك الدراسي أو المهني؟",
    "هل تجد نفسك تعطي الأولوية للمحتوى الرقمي على حساب علاقاتك أو نشاطاتك اليومية؟",
    "هل حاولت تقليل الاستخدام وفشلت؟ (نعم/لا)"
  ],
  en: [
    "How many hours do you spend daily on TikTok / Reels / Shorts?",
    "Do you open these apps automatically (without thinking)?",
    "Do you find it hard to stop after one short video?",
    "Do you watch shorts even when you have more important tasks?",
    "After watching short content, do you struggle to focus on work/study?",
    "Do you feel your memory has weakened after long use?",
    "Do you struggle to read a book or watch a full movie patiently?",
    "Do you notice your attention gets distracted more easily?",
    "Do you feel empty or 'mind blank' after hours of scrolling?",
    "Do you feel guilt or regret after long sessions on short videos?",
    "Do you find it hard to enjoy normal activities compared to quick videos?",
    "Do you feel anxious if you don’t open the apps for long?",
    "Does your usage affect your sleep (delayed or interrupted)?",
    "Does it affect your academic or work performance?",
    "Do you prioritize digital content over relationships or daily activities?",
    "Have you tried to reduce usage and failed? (Yes/No)"
  ]
};

const LIKERT_AR = ["دائمًا","غالبًا","أحيانًا","نادراً","أبدًا"];
const LIKERT_EN = ["Always","Often","Sometimes","Rarely","Never"];
// mapping values: Always=5 ... Never=1
const LIKERT_VALUES = [5,4,3,2,1];

let lang = 'ar';

function renderQuestions(){
  const container = document.getElementById('questions');
  container.innerHTML='';
  const qs = Q[lang];
  const likert = (lang==='ar')?LIKERT_AR:LIKERT_EN;
  for(let i=0;i<qs.length;i++){
    const qDiv = document.createElement('div');
    qDiv.className='q';
    qDiv.innerHTML = `<h3>${i+1}. ${qs[i]}</h3>`;
    const opts = document.createElement('div');
    opts.className='options';
    // if last question yes/no -> use specific options
    if(i===15){
      if(lang==='ar'){
        opts.innerHTML = `<label><input type="radio" name="q${i}" value="5"><span>نعم</span></label>
                          <label><input type="radio" name="q${i}" value="1"><span>لا</span></label>`;
      } else {
        opts.innerHTML = `<label><input type="radio" name="q${i}" value="5"><span>Yes</span></label>
                          <label><input type="radio" name="q${i}" value="1"><span>No</span></label>`;
      }
    } else {
      // generate likert from 5 to 1; for arabic we'll reverse visually via CSS
      for(let j=0;j<likert.length;j++){
        const val = LIKERT_VALUES[j];
        const text = likert[j];
        const lab = document.createElement('label');
        lab.innerHTML = `<input type="radio" name="q${i}" value="${val}"><span>${text}</span>`;
        opts.appendChild(lab);
      }
    }
    qDiv.appendChild(opts);
    container.appendChild(qDiv);
  }
}

// calculate score: sum values, percentage relative to 16..80
function calculate(){
  const name = document.getElementById('name').value.trim() || '';
  const phone = document.getElementById('phone').value.trim() || '';
  let total = 0; let answered = 0;
  const answers = [];
  for(let i=0;i<Q[lang].length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if(sel){
      answered++; total += parseInt(sel.value); answers.push(parseInt(sel.value));
    } else {
      alert(lang==='ar' ? 'الرجاء الإجابة على جميع الأسئلة' : 'Please answer all questions');
      return;
    }
  }
  const percent = Math.round(((total-16)/(80-16))*100); // maps 16->0% and 80->100%
  // classification
  let classText='';
  if(percent<=40) classText = lang==='ar' ? 'استخدام طبيعي' : 'Low (normal)';
  else if(percent<=70) classText = lang==='ar' ? 'علامات متوسطة' : 'Moderate signs';
  else classText = lang==='ar' ? 'Brain Rot شديد' : 'High (severe)';
  // show result
  document.getElementById('resultSummary').innerHTML = `<div class="result-summary"><strong>${lang==='ar'?'النسبة':'Percentage'}:</strong> ${percent}% - ${classText}</div>`;
  // breakdown each question score
  let breakdownHTML = '<div class="breakdown">';
  for(let i=0;i<answers.length;i++){
    const qText = Q[lang][i];
    const val = answers[i];
    breakdownHTML += `<p>${i+1}. ${qText} → <strong>${(lang==='ar'? (val===5?'دائمًا':val===4?'غالبًا':val===3?'أحيانًا':val===2?'نادراً':'أبدًا') : (val===5?'Always':val===4?'Often':val===3?'Sometimes':val===2?'Rarely':'Never'))}</strong> (${val})</p>`;
  }
  breakdownHTML += '</div>';
  document.getElementById('breakdown').innerHTML = breakdownHTML;
  // simple care plan
  const plan = document.getElementById('plan');
  if(percent<=40){
    plan.innerHTML = `<div class="care-plan">${lang==='ar' ? 'تقييم منخفض — استمر في عادات جيدة، وراقب وقت الشاشة.' : 'Low risk — keep healthy habits and monitor screen time.'}</div>`;
  } else if(percent<=70){
    plan.innerHTML = `<div class="care-plan">${lang==='ar' ? 'تقييم متوسط — جرب تقليل وقت المشاهدة، وضع قيود يومية، واطلع على استراتيجيات التركيز.' : 'Moderate — try reducing viewing time, set daily limits, and adopt focus strategies.'}</div>`;
  } else {
    plan.innerHTML = `<div class="care-plan">${lang==='ar' ? 'تقييم عالي — أنصح باستشارة متخصص وتقليل التعرض للمقاطع القصيرة فوراً.' : 'High — consider seeking professional help and strongly reduce short-video exposure.'}</div>`;
  }
  document.getElementById('resultCard').style.display = 'block';

  // send to Google Sheets if endpoint set (replace YOUR_GOOGLE_SCRIPT_URL in file)
  const payload = { name, phone, answers, total, percent, lang };
  if(typeof window.API_ENDPOINT !== 'undefined' && window.API_ENDPOINT){
    fetch(window.API_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      .then(()=> console.log('sent'))
      .catch(()=> console.log('send failed'));
  }
}

// toggle language
document.getElementById('langToggle').addEventListener('click', ()=>{
  lang = (lang==='ar')? 'en' : 'ar';
  document.body.classList.toggle('en', lang==='en');
  document.getElementById('langToggle').innerText = (lang==='ar')? 'EN' : 'AR';
  // change direction and text of some items
  document.documentElement.lang = (lang==='ar')? 'ar' : 'en';
  document.documentElement.dir = (lang==='ar')? 'rtl' : 'ltr';
  document.getElementById('personalTitle').innerText = (lang==='ar')? 'البيانات الشخصية' : 'Personal info';
  document.getElementById('qTitle').innerText = (lang==='ar')? 'الأسئلة' : 'Questions';
  document.getElementById('submitBtn').innerText = (lang==='ar')? 'احسب النتيجة' : 'Calculate Score';
  document.getElementById('resultTitle').innerText = (lang==='ar')? 'النتيجة' : 'Result';
  document.getElementById('footerText').innerText = (lang==='ar')? 'تنبيه: هذا الاختبار إرشادي ولا يغني عن استشارة مختص.' : 'Note: This is an indicative test and not a diagnosis.';
  renderQuestions();
});

// attach submit
document.getElementById('submitBtn').addEventListener('click', calculate);

// initialize
renderQuestions();