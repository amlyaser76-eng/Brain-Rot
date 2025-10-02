let lang = 'ar';

const questions = {
  ar: [
    "كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟",
    "هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟",
    "هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟",
    "هل تشاهد مقاطع قصيرة حتى وأنت تعرف أن عندك مهام أهم؟",
    "بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة/العمل؟",
    "هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟",
    "هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل بسبب فقدان الصبر؟",
    "هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟",
    "هل تشعر بفراغ أو دماغك فاضي بعد ساعات من التصفح؟",
    "هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل في المقاطع القصيرة؟",
    "هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالمتعة السريعة من الفيديوهات؟",
    "هل تشعر بالقلق أو التوتر لو لم تفتح التطبيقات لفترة طويلة؟",
    "هل يؤثر استخدامك على نومك (تأخر نوم، نوم متقطع)؟",
    "هل يؤثر على إنجازك الدراسي أو المهني؟",
    "هل تجد نفسك تعطي الأولوية للمحتوى الرقمي على حساب علاقاتك أو نشاطاتك اليومية؟",
    "هل حاولت تقليل الاستخدام وفشلت؟ (نعم / لا فقط)"
  ],
  en: [
    "How many hours do you spend daily on TikTok / Reels / Shorts?",
    "Do you open these apps automatically (without thinking)?",
    "Do you find it hard to stop after watching one short video?",
    "Do you watch short videos even when you know you have important tasks?",
    "After watching short content, do you find it hard to focus on study/work?",
    "Do you feel your memory has weakened after long usage periods?",
    "Do you struggle to read books or watch long movies due to impatience?",
    "Do you notice your attention gets distracted more than before?",
    "Do you feel empty or 'mind blank' after hours of scrolling?",
    "Do you feel guilt or regret after spending too much time on shorts?",
    "Do you struggle to enjoy normal activities compared to fast videos?",
    "Do you feel anxious if you don’t open the apps for long?",
    "Does your usage affect your sleep (late sleep, disturbed)?",
    "Does it affect your study or work performance?",
    "Do you prioritize digital content over relationships or daily activities?",
    "Have you tried reducing usage and failed? (Yes / No only)"
  ]
};

const options = {
  ar: ["أبدًا", "نادراً", "أحياناً", "غالباً", "دائماً"],
  en: ["Never", "Rarely", "Sometimes", "Often", "Always"]
};

function renderQuestions(){
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = "";
  questions[lang].forEach((q, idx) => {
    const div = document.createElement('div');
    div.classList.add('question');
    let optsHTML = "";
    if(idx === 15){
      optsHTML = `
        <label><input type="radio" name="q${idx}" value="5"> ${lang==='ar'?'نعم':'Yes'}</label>
        <label><input type="radio" name="q${idx}" value="1"> ${lang==='ar'?'لا':'No'}</label>
      `;
    } else {
      options[lang].forEach((opt, i) => {
        optsHTML += `<label><input type="radio" name="q${idx}" value="${i+1}"> ${opt}</label>`;
      });
    }
    div.innerHTML = `<p>${idx+1}. ${q}</p>${optsHTML}`;
    qDiv.appendChild(div);
  });
}

function calculate(){
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  let total = 0, answered = 0;
  const answers = [];
  for(let i=0;i<questions[lang].length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if(sel){
      answered++;
      total += parseInt(sel.value);
      answers.push(sel.value);
    } else {
      answers.push(null);
    }
  }
  if(answered < questions[lang].length){
    alert(lang==='ar'?'من فضلك أجب عن كل الأسئلة':'Please answer all questions');
    return;
  }
  let percent = Math.round(((total-16)/(80-16))*100);
  let classText = "";
  if(total<=32){ classText = lang==='ar'?'استخدام طبيعي':'Normal use'; }
  else if(total<=55){ classText = lang==='ar'?'Brain Rot متوسط':'Moderate Brain Rot'; }
  else { classText = lang==='ar'?'Brain Rot شديد':'Severe Brain Rot'; }

  document.getElementById('resultSummary').innerHTML = `
    <div><strong>${lang==='ar'?'النسبة':'Percentage'}:</strong> ${percent}% - ${classText}</div>
    <div>${lang==='ar'?'الاسم':'Name'}: ${name}<br>${lang==='ar'?'الهاتف':'Phone'}: ${phone}</div>
  `;
}

function toggleLang(){
  lang = lang==='ar'?'en':'ar';
  document.body.dir = lang==='ar'?'rtl':'ltr';
  document.getElementById('title').innerText = lang==='ar'?'🧠 مقياس تآكل الدماغ':'🧠 Brain Rot Scale';
  document.getElementById('introText').innerText = lang==='ar'?
    'هذا الاختبار يساعدك في تقييم تأثير المقاطع القصيرة على تركيزك وصحتك النفسية.':
    'This test helps you assess the effect of short videos on your focus and mental health.';
  document.getElementById('nameLabel').innerText = lang==='ar'?'الاسم:':'Name:';
  document.getElementById('phoneLabel').innerText = lang==='ar'?'رقم الهاتف:':'Phone:';
  document.getElementById('calcBtn').innerText = lang==='ar'?'احسب النتيجة':'Calculate';
  document.getElementById('resultTitle').innerText = lang==='ar'?'النتيجة':'Result';
  document.getElementById('langToggle').innerText = lang==='ar'?'English':'العربية';
  renderQuestions();
}

window.onload = () => {
  renderQuestions();
};
