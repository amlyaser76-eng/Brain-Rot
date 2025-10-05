const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');
const formContainer = document.getElementById('form-container');
const nextBtn = document.getElementById('nextBtn');
const resultDiv = document.getElementById('result');
const scorePercent = document.getElementById('scorePercent');
const scoreLevel = document.getElementById('scoreLevel');

const questions = [
  'كم ساعة تقضيها يوميًا على TikTok / Reels / Shorts؟',
  'هل تفتح هذه التطبيقات بشكل تلقائي؟',
  'هل تجد صعوبة في التوقف بعد مشاهدة مقطع قصير واحد؟',
  'هل تشاهد مقاطع قصيرة حتى وأنت تعرف أن عندك مهام أهم؟',
  'بعد مشاهدة محتوى قصير، هل تجد صعوبة في التركيز على الدراسة؟',
  'هل تشعر أن ذاكرتك ضعفت أو تنسى بسرعة؟',
  'هل تواجه صعوبة في قراءة كتاب أو مشاهدة فيلم طويل؟',
  'هل تلاحظ أن انتباهك يتشتت بسهولة أكثر من قبل؟',
  'هل تشعر بفراغ أو “دماغك فاضي” بعد ساعات من التصفح؟',
  'هل يجيك إحساس بالذنب أو الندم بعد قضاء وقت طويل؟',
  'هل تجد صعوبة في الاستمتاع بأنشطة عادية؟',
  'هل تشعر بالقلق لو لم تفتح التطبيقات؟',
  'هل يؤثر استخدامك على نومك؟',
  'هل يؤثر على إنجازك الدراسي أو المهني؟',
  'هل تجد نفسك تعطي الأولوية للمحتوى الرقمي؟',
  'هل حاولت تقليل الاستخدام وفشلت؟',
  'اول مابتصحى من النوم بتفتح الموبايل؟',
  'الموبايل آخر حاجة بتعملها قبل النوم؟',
  'بتمسك الموبايل مع الأهل والصحاب؟',
  'تستخدم الموبايل لتفتكر أعياد الميلاد؟',
  'تحب تسمع أم كلثوم ولا الأغاني القصيرة؟',
  'هل تحفظ أرقام موبايلات أصحابك وأهلك؟'
];

let currentQuestion = 0;
let totalScore = 0;

startBtn.addEventListener('click', () => {
  intro.classList.add('hidden');
  formContainer.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  if (currentQuestion === 0) {
    showQuestion();
  } else if (currentQuestion < questions.length) {
    const radios = document.querySelectorAll('input[name="q"]');
    let value = 0;
    radios.forEach(r => { if (r.checked) value = parseInt(r.value); });
    if (value === 0) { alert('اختر إجابة.'); return; }
    totalScore += value;
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else showResult();
  }
});

function showQuestion() {
  const container = document.querySelector('.question-card');
  container.innerHTML = `
    <h2>${questions[currentQuestion]}</h2>
    <div class="options">
      <label><input type="radio" name="q" value="1"> أبدًا</label><br>
      <label><input type="radio" name="q" value="2"> نادرًا</label><br>
      <label><input type="radio" name="q" value="3"> أحيانًا</label><br>
      <label><input type="radio" name="q" value="4"> غالبًا</label><br>
      <label><input type="radio" name="q" value="5"> دائمًا</label><br>
    </div>
    <button id="nextBtn">التالي</button>
  `;
  document.getElementById('nextBtn').addEventListener('click', () => nextBtn.click());
}

function showResult() {
  formContainer.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  const percent = Math.round((totalScore / (questions.length * 5)) * 100);
  let level = '';
  if (percent < 40) level = 'استخدام طبيعي (Low)';
  else if (percent < 70) level = 'علامات متوسطة (Moderate)';
  else level = 'Brain Rot مرتفع (High)';
  scorePercent.textContent = percent + '%';
  scoreLevel.textContent = level;
  document.getElementById('scoreCircle').style.background =
    `conic-gradient(#6d28d9 0% ${percent}%, #ccc ${percent}% 100%)`;
}
