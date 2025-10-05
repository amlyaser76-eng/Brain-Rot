
const langToggle = document.getElementById('langToggle');
let isArabic = true;

const questionsData = {
  ar: [
    {section:"أنماط الاستخدام", questions:[
      "كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟",
      "هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟",
      "أول ما تصحى من النوم، هل تفتح الموبايل؟"
    ]},
    {section:"الأعراض الإدراكية", questions:[
      "بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة/العمل؟",
      "هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟"
    ]},
    {section:"السلوك والتأثير", questions:[
      "هل يؤثر استخدامك على نومك؟",
      "هل حاولت تقليل الاستخدام وفشلت؟"
    ]}
  ],
  en: [
    {section:"Usage Patterns", questions:[
      "How many hours do you spend daily on TikTok / Reels / Shorts?",
      "Do you open these apps automatically (without thinking)?",
      "Do you check your phone immediately after waking up?"
    ]},
    {section:"Cognitive Symptoms", questions:[
      "After watching short content, do you find it hard to focus on work/study?",
      "Do you feel your memory is weaker or you forget things faster after long use?"
    ]},
    {section:"Behavioral Impact", questions:[
      "Does your usage affect your sleep?",
      "Have you tried to reduce usage and failed?"
    ]}
  ]
};

const questionsContainer = document.getElementById('questions');
const progressBar = document.getElementById('progress');

function renderQuestions(){
  questionsContainer.innerHTML = '';
  const lang = isArabic ? 'ar' : 'en';
  questionsData[lang].forEach(section=>{
    const secDiv = document.createElement('div');
    secDiv.className = 'section';
    secDiv.innerHTML = `<h3>${section.section}</h3>`;
    section.questions.forEach((q,i)=>{
      let optionsHTML='';
      for(let v=1;v<=5;v++){
        optionsHTML += `<label><input type="radio" name="${section.section}-${i}" value="${v}"> ${v}</label>`;
      }
      const qDiv = document.createElement('div');
      qDiv.className='question';
      qDiv.innerHTML = `<p>${q}</p><div class="options">${optionsHTML}</div>`;
      secDiv.appendChild(qDiv);
    });
    questionsContainer.appendChild(secDiv);
  });
  updateProgress();
}
renderQuestions();

langToggle.addEventListener('click',()=>{
  isArabic=!isArabic;
  document.documentElement.lang = isArabic ? 'ar':'en';
  document.documentElement.dir = isArabic ? 'rtl':'ltr';
  document.getElementById('siteName').innerText = isArabic ? 'اختبار الدماغ':'Brain Test';
  document.getElementById('introText').innerText = isArabic ?
    'هذا الاختبار يقيس مدى تأثير المحتوى الرقمي على دماغك وسلوكك اليومي. جاوب بصدق لمعرفة النتيجة.':
    'This test measures how short digital content affects your brain and daily behavior. Answer honestly to see your result.';
  renderQuestions();
});

function updateProgress(){
  const total = document.querySelectorAll('.question').length;
  const answered = document.querySelectorAll('input[type=radio]:checked').length;
  progressBar.style.width = `${Math.round((answered/total)*100)}%`;
}

document.getElementById('questions').addEventListener('change',updateProgress);

document.getElementById('submitTest').addEventListener('click',()=>{
  const inputs = document.querySelectorAll('input[type=radio]:checked');
  if(inputs.length===0){
    alert(isArabic?'من فضلك أجب على جميع الأسئلة':'Please answer all questions');
    return;
  }
  let sum=0;
  inputs.forEach(i=>sum+=parseInt(i.value));
  const percent = Math.round((sum/(inputs.length*5))*100);
  const resultText = isArabic ? `لقد حصلت على ${percent}% من إجمالي النقاط.` : `You scored ${percent}% of total points.`;
  document.getElementById('resultText').innerText = resultText;
  document.getElementById('result').style.display='block';
});

document.getElementById('resetTest').addEventListener('click',()=>{
  document.querySelectorAll('input[type=radio]').forEach(i=>i.checked=false);
  document.getElementById('result').style.display='none';
  updateProgress();
});
