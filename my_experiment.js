// ==== 自動ID生成 ====
function generateParticipantID(length = 3) {
  const chars = '0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const timeline = [];

// ==== 刺激リスト ====
const stimuliFiles = [
  "stimuli/low_giko_speed2.5.html",
  "stimuli/medium_giko_speed2.5.html",
  "stimuli/high_giko_speed2.5.html"
];
const shuffledStimuli = jsPsych.randomization.shuffle(stimuliFiles);

// ==== 評価質問 ====
const fixedQuestions = [
  {
    name: "pleasantness",
    prompt: "この動きを見てどのように感じましたか？",
    labels: ["とても不快", "", "", "", "", "", "とても心地よい"],
    required: true
  },
  {
    name: "speed",
    prompt: "この動きの速さについてどう感じましたか？",
    labels: ["とても遅い", "", "", "", "", "", "とても速い"],
    required: true
  }
];

// ==== 刺激提示 & 評価（セットで） ====
shuffledStimuli.forEach(file => {
  timeline.push({
    type: 'html-button-response',
    stimulus: `<iframe src="${file}" width="800" height="600" frameborder="0"></iframe>`,
    data: { stimulus_filename: file },
    choices: ['次へ'],
    prompt: "<p>アニメーションを見終わったら「次へ」を押してください。</p>"
  });

  timeline.push({
    type: 'survey-likert',
    preamble: "<h3>今見たアニメーションについてあなたの印象を教えてください。</h3>",
    questions: fixedQuestions,
    data: { stimulus_filename: file }
  });
});

// ==== 背景情報質問 ====
timeline.push({
  type: 'survey-html-form',
  preamble: "<h3>背景に関する質問です。</h3>",
  html: `
    <p>年齢：<input name="age" type="number" required></p>
    <p>性別：
      <select name="gender" required>
        <option value="">選択してください</option>
        <option value="male">男性</option>
        <option value="female">女性</option>
        <option value="other">その他</option>
      </select>
    </p>
    <p>お子さんはいらっしゃいますか？<br>
      <input type="radio" name="has_children" value="yes" required> はい
      <input type="radio" name="has_children" value="no"> いいえ
    </p>
    <p>他人の子どもに接する環境にいますか？<br>
      <input type="radio" name="childcare_job" value="yes" required> はい
      <input type="radio" name="childcare_job" value="no"> いいえ
    </p>
    <p>ペットを飼ったことがありますか？<br>
      <input type="radio" name="pet_experience" value="yes" required> はい
      <input type="radio" name="pet_experience" value="no"> いいえ
    </p>
  `,
  button_label: "次へ",
  data: { part: "background" }
});

// ==== 実験終了メッセージ ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h2>ご協力ありがとうございました！</h2>
    <p>これで実験は終了です。</p>
  `,
  choices: ['完了']
});

// ==== jsPsych 初期化 & データ送信 ====
jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    const participantID = generateParticipantID();

    // 刺激ごとの評価取得
    const likertResponses = jsPsych.data.get()
      .filter(trial => trial.trial_type === 'survey-likert' && trial.data?.stimulus_filename)
      .values();

    const responses = likertResponses.map(trial => ({
      stimulus: trial.data.stimulus_filename.split('/').pop(),
      ...trial.response
    }));

    // 背景情報取得
    const background = jsPsych.data.get()
      .filter(trial => trial.trial_type === 'survey-html-form' && trial.data?.part === "background")
      .values()[0]?.response || {};

    // 全データ構成
    const dataToSend = {
      id: participantID,
      ...background,
      responses
    };

    // Netlifyなどに送信（変更して使ってください）
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "experiment-data",
        "data": JSON.stringify(dataToSend)
      })
    })
    .then(() => {
      console.log("✅ データ送信完了！");
    })
    .catch((error) => {
      console.error("❌ データ送信失敗:", error);
    });
  }
});
