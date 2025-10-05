document.getElementById("brsForm").addEventListener("submit", function(e){
  e.preventDefault();
  let form = e.target;
  let total = 0;
  let count = 0;

  for (let i = 1; i <= 16; i++) {
    let value = parseInt(form["q"+i].value);
    total += value;
    count++;
  }

  // نسبة مئوية
  let percentage = Math.round((total - count) / (80 - count) * 100);

  let resultText = "";
  if (total <= 32) resultText = "📊 النتيجة: استخدام طبيعي (Low).";
  else if (total <= 55) resultText = "📊 النتيجة: علامات Brain Rot متوسطة (Moderate).";
  else resultText = "📊 النتيجة: Brain Rot شديد (High).";

  document.getElementById("result").innerHTML =
    "النتيجة: " + percentage + "%<br>" + resultText;
});
