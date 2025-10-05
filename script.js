const questionsData = {
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
    "هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالفيديوهات؟",
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
    "Do you watch shorts even when you know you have more important tasks?",
    "After watching short content, do you struggle to focus on work/study?",
    "Do you feel your memory weakened after long use?",
    "Do you struggle to read a book or watch a full movie patiently?",
    "Do you notice your attention gets distracted more easily?",
    "Do you feel empty or 'mind blank' after hours of scrolling?",
    "Do you feel guilt/regret after long time on short videos?",
    "Do you struggle to enjoy normal activities compared to videos?",
    "Do you feel anxious if you don’t open the apps for long?",
    "Does your usage affect your sleep (delay, interruptions)?",
    "Does it affect your academic or work performance?",
    "Do you prioritize digital content over relationships or daily tasks?",
    "Have you tried to reduce usage and failed? (Yes/No)"
  ]
};

let currentLang = "ar";

function renderQuestions() {
  const questionsDiv = document.getElementById("questions");
  questionsDiv.innerHTML = "";
  questionsData[currentLang].forEach((q,i)=>{
    const qDiv = document.createElement("div");
    qDiv.classList.add("q");
    qDiv.innerHTML = `<h3>${i+1}. ${q}</h3>`;
    if(i===15){
      qDiv.innerHTML += `<label><input type="radio" name="q${i}" value="5">${currentLang==="ar"?"نعم":"Yes"}</label>
      <label><input type="radio" name="q${i}" value="1">${currentLang==="ar"?"لا":"No"}</label>`;
    } else {
      let opts="";
      for(let v=1; v<=5; v++){
        opts += `<label><input type="radio" name="q${i}" value="${v}"> ${v}</label>`;
      }
      qDiv.innerHTML += opts;
    }
    questionsDiv.appendChild(qDiv);
  });
}

function calcResult(){
  let total=0, answered=0;
  for(let i=0;i<questionsData[currentLang].length;i++){
    const sel=document.querySelector(`input[name="q${i}"]:checked`);
    if(sel){answered++; total+=parseInt(sel.value);}
  }
  if(answered<16){alert("Please answer all questions"); return;}
  const percent=Math.round((total/80)*100);
  document.getElementById("resultSummary").innerHTML=`<h3>${percent}%</h3>`;
  document.getElementById("resultCard").style.display="block";
}

document.getElementById("langToggle").addEventListener("click",()=>{
  currentLang=(currentLang==="ar")?"en":"ar";
  document.getElementById("langToggle").innerText=currentLang==="ar"?"EN":"AR";
  renderQuestions();
});
document.getElementById("submitBtn").addEventListener("click",calcResult);
renderQuestions();