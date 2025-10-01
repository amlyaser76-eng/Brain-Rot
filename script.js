const langToggle = document.getElementById('lang-toggle');
const quizForm = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const resultSection = document.getElementById('result-section');

let currentLang = 'en';

const texts = {
  en: {
    banner: "🧠 Welcome to Brain Rot Test — Discover your level!",
    questionsTitle: "Answer the following questions:",
    submit: "Submit",
    resultTitle: "Your Brain Rot Result:",
    planTitle: "Suggested Recovery Plan:",
    questions: [
      "Do you spend more than 4 hours daily on social media?",
      "Do you find it hard to focus on studying or work?",
      "Do you often scroll without purpose?"
    ],
    results: ["Mild Brain Rot", "Moderate Brain Rot", "Severe Brain Rot"],
    plans: [
      "Limit screen time to 2 hours a day.",
      "Take breaks every hour and exercise.",
      "Seek professional help and digital detox."
    ]
  },
  ar: {
    banner: "🧠 أهلاً بك في اختبار Brain Rot — اكتشف مستواك!",
    questionsTitle: "أجب عن الأسئلة التالية:",
    submit: "إرسال",
    resultTitle: "نتيجة الـ Brain Rot الخاصة بك:",
    planTitle: "الخطة العلاجية المقترحة:",
    questions: [
      "هل تقضي أكثر من ٤ ساعات يومياً على وسائل التواصل؟",
      "هل تجد صعوبة في التركيز على الدراسة أو العمل؟",
      "هل تقوم بالتمرير كثيراً بدون هدف؟"
    ],
    results: ["Brain Rot بسيط", "Brain Rot متوسط", "Brain Rot شديد"],
    plans: [
      "قلل وقت الشاشة إلى ساعتين يومياً.",
      "خذ استراحة كل ساعة ومارس الرياضة.",
      "اطلب مساعدة متخصصة وقم بإزالة السموم الرقمية."
    ]
  }
};

function renderQuestions() {
  quizForm.innerHTML = '';
  texts[currentLang].questions.forEach((q, idx) => {
    const label = document.createElement('label');
    label.innerText = q;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'q' + idx;
    label.prepend(checkbox);
    quizForm.appendChild(label);
    quizForm.appendChild(document.createElement('br'));
  });
  submitBtn.innerText = texts[currentLang].submit;
  document.getElementById('questions-title').innerText = texts[currentLang].questionsTitle;
  document.getElementById('result-title').innerText = texts[currentLang].resultTitle;
  document.getElementById('plan-title').innerText = texts[currentLang].planTitle;
  document.getElementById('welcome-banner').innerText = texts[currentLang].banner;
}

submitBtn.addEventListener('click', () => {
  const answers = quizForm.querySelectorAll('input[type=checkbox]:checked').length;
  let resultIdx = 0;
  if (answers === 1) resultIdx = 0;
  if (answers === 2) resultIdx = 1;
  if (answers >= 3) resultIdx = 2;
  document.getElementById('result-text').innerText = texts[currentLang].results[resultIdx];
  document.getElementById('plan-text').innerText = texts[currentLang].plans[resultIdx];
  resultSection.style.display = 'block';
});

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  langToggle.innerText = currentLang === 'en' ? 'AR' : 'EN';
  renderQuestions();
});

// Initial render
renderQuestions();
