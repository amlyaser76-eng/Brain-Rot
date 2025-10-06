// ============================
// إعداد الأسئلة بالعربية
// ============================
const questions_ar = [
  // القسم 1
  "كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟",
  "هل تفتح هذه التطبيقات بشكل تلقائي (بدون تفكير)؟",
  "هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟",
  "هل تشاهد مقاطع قصيرة حتى وأنت تعرف أن عندك مهام أهم؟",
  // القسم 2
  "بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة أو العمل؟",
  "هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة بعد فترات استخدام طويلة؟",
  "هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل بسبب فقدان الصبر؟",
  "هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟",
  // القسم 3
  "هل تشعر بفراغ أو “دماغك فاضي” بعد ساعات من التصفح؟",
  "هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل في المقاطع القصيرة؟",
  "هل تجد صعوبة في الاستمتاع بأنشطة عادية مقارنة بالمتعة السريعة من الفيديوهات؟",
  "هل تشعر بالقلق أو التوتر لو لم تفتح التطبيقات لفترة طويلة؟",
  // القسم 4
  "هل يؤثر استخدامك على نومك (تأخر نوم، نوم متقطع)؟",
  "هل يؤثر على إنجازك الدراسي أو المهني؟",
  "هل تجد نفسك تعطي الأولوية للمحتوى الرقمي على حساب علاقاتك؟",
  "هل حاولت تقليل الاستخدام وفشلت؟",
  // إضافية
  "أول ما بتصحى من النوم بتفتح الموبايل؟",
  "الموبايل آخر حاجة بتعملها قبل النوم؟",
  "بتمسك الموبايل وأنت مع الأهل أو الأصدقاء؟",
  "تستخدم الموبايل عشان تفتكر أعياد الميلاد أو المذاكرة؟",
  "تحب تسمع أم كلثوم ولا أغاني قصيرة؟",
  "هل تحفظ أرقام موبايلات أهلك وأصحابك؟"
];

// ============================
// إعداد الأسئلة بالإنجليزية
// ============================
const questions_en = [
  "How many hours a day do you spend on TikTok / Reels / Shorts?",
  "Do you open these apps automatically without thinking?",
  "Do you find it hard to stop after one short video?",
  "Do you watch shorts even when you have more important tasks?",
  "After watching short content, do you struggle to focus on study/work?",
  "Do you feel your memory has weakened after long use?",
  "Do you find it hard to read a book or watch a long movie now?",
  "Do you notice your attention span is shorter than before?",
  "Do you feel empty or 'brain-dead' after hours of scrolling?",
  "Do you feel guilty or regret time wasted on short videos?",
  "Do you find it harder to enjoy normal activities compared to quick videos?",
  "Do you feel anxious if you don’t open these apps for a while?",
  "Does your use affect your sleep?",
  "Does it affect your academic or job performance?",
  "Do you prioritize digital content over relationships?",
  "Have you tried to reduce use but failed?",
  "Do you check your phone first thing after waking up?",
  "Is your phone the last thing you use before sleeping?",
  "Do you use your phone while with friends or family?",
  "Do you rely on your phone to remember birthdays or studies?",
  "Do you prefer short songs over classics like Umm Kulthum?",
  "Do you remember phone numbers of close people?"
];

// ============================
// عناصر الصفحة
// ============================
const introPage = document.getElementById("intro");
const quizPage = document.getElementById("quiz");
const resultPage = document.getElementById("result");
const questionText = document.getElementById("question-text");
const options = document.querySelectorAll(".option");
const progressBar = document.getElementById("progress-bar");
const progressCircle = document.getElementById("progress-circle");
const progressPercent = document.getElementById("progress-percent");
const scoreDisplay = document.getElementById("score-display");
const scoreText = document.getElementById("score-text");
const retryBtn = document.getElementById("retry-btn");
const startBtn = document.getElementById("start-btn");
const langToggle = document.getElementById("lang-toggle");

let currentIndex = 0;
let score = 0;
let currentLang = "ar";
let questions = questions_ar;

// ============================
// بدء الاختبار
// ============================
startBtn.addEventListener("click", () => {
  const name = document.getElementById("user-name").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  if (!name || !phone) {
    alert(currentLang === "ar" ? "الرجاء إدخال الاسم ورقم الهاتف." : "Please enter your name and phone number.");
    return;
  }

  introPage.classList.remove("active");
  quizPage.classList.add("active");
  loadQuestion();
});

// ============================
// تحميل السؤال الحالي
// ============================
function loadQuestion() {
  if (currentIndex >= questions.length) return showResult();

  questionText.textContent = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressPercent.textContent = `${Math.round(progress)}%`;
  progressCircle.style.background = `conic-gradient(#00c9b7 ${progress}%, #004f4f ${progress}%)`;
}

// ============================
// عند اختيار إجابة
// ============================
options.forEach((btn) => {
  btn.addEventListener("click", () => {
    score += parseInt(btn.dataset.value);
    currentIndex++;
    if (currentIndex < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  });
});

// ============================
// عرض النتيجة
// ============================
function showResult() {
  quizPage.classList.remove("active");
  resultPage.classList.add("active");

  const maxScore = questions.length * 5;
  const percent = Math.round((score / maxScore) * 100);

  scoreDisplay.textContent = percent + "%";

  let level = "";
  let color = "";

  if (percent <= 40) {
    level = currentLang === "ar" ? "استخدام طبيعي 🟢" : "Normal use 🟢";
    color = "#00e090";
  } else if (percent <= 70) {
    level = currentLang === "ar" ? "علامات متوسطة 🔵" : "Moderate signs 🔵";
    color = "#00bfff";
  } else {
    level = currentLang === "ar" ? "Brain Rot شديد 🔴" : "Severe Brain Rot 🔴";
    color = "#ff4b5c";
  }

  scoreDisplay.style.color = color;
  scoreText.textContent = level;
}

// ============================
// إعادة الاختبار
// ============================
retryBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  resultPage.classList.remove("active");
  introPage.classList.add("active");
  progressBar.style.width = "0%";
  progressCircle.style.background = "conic-gradient(#00c9b7 0%, #004f4f 0%)";
  progressPercent.textContent = "0%";
});

// ============================
// زر تغيير اللغة
// ============================
langToggle.addEventListener("click", () => {
  if (currentLang === "ar") {
    currentLang = "en";
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    questions = questions_en;
    startBtn.textContent = "Start Test";
    document.getElementById("user-name").placeholder = "Full Name";
    document.getElementById("user-phone").placeholder = "Phone Number";
    document.querySelector(".intro-content p").textContent =
      "A non-medical awareness test about short-form content effects.";
    questionText.textContent = "";
  } else {
    currentLang = "ar";
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    questions = questions_ar;
    startBtn.textContent = "ابدأ الاختبار";
    document.getElementById("user-name").placeholder = "الاسم الكامل";
    document.getElementById("user-phone").placeholder = "رقم الهاتف";
    document.querySelector(".intro-content p").textContent =
      "اختبار غير طبي، الغرض منه التوعية حول أثر المحتوى القصير على التركيز والانتباه.";
    questionText.textContent = "";
  }
});
