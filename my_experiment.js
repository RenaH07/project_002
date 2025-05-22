// ==== スマホ・タブレットをブロックする ====
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  jsPsych.init({
    timeline: [{
      type: 'html-button-response',
      stimulus: `
        <h3>この実験はパソコン専用です</h3>
        <p>スマートフォンやタブレットではご参加いただけません。</p>
      `,
      choices: ['終了']
    }],
    on_finish: function () {
      jsPsych.endExperiment("モバイル端末でのアクセスが検出されたため、実験を終了しました。");
    }
  });
  // 💥 ここで実験の通常処理を止める！
  throw new Error("モバイルブロック：実験中止");
}

// ==== 自動ID生成 ====
function generateParticipantID(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const timeline = [];

// ==== イントロダクション ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h2>図形の動きに対する印象アンケート</h2>
    <p>この度はお忙しいところ、本調査にご協力いただき誠にありがとうございます。<br>
    回答を始める前に、以下の点をご確認ください。</p>

     <div style="text-align: left; max-height: 500px; overflow-y: auto; padding: 10px; border: 1px solid #ccc; font-size: 14px;">   
      <h3>本調査の目的</h3>
      <p>本調査は、図形が動いている様子に対する感じ方の傾向を調べることを目的としています。</p>

      <h3>本調査への回答および辞退について</h3>
      <p>本調査への回答は、あなたの自由な意思によるものです。調査への回答を始めた後でも、いつでも回答を中止することができます。<br>
      回答を中止した場合、そのデータは一切使用されません。また、本調査に回答しないこと、あるいは回答を中止することで、あなたが不利益を被ることはありません。<br>
      ただし、報酬の受け取りには、回答の完了が必要です。</p>

      <h3>本調査で得られるデータの取り扱いについて</h3>
      <p>本調査で得られたデータは、すべて個人と紐づけられない形で統計的に処理され、パスワードをかけて厳重に保管されます。<br>
      回答データから回答者個人を特定できないようにする方法として、回答データを匿名化したうえで、回答者とその回答データの対応表を作成しないという手法をとります。<br>
      得られたデータの保管期間は、公益社団法人・日本心理学会の倫理規定に従い、研究公表から5年間とします。保管期限経過後、得られたデータは破棄されます。<br>
      収集される個人情報は報酬のお支払い手続きにのみ使用し、報酬のお支払いが完了した時点で破棄されます。なお、名前・連絡先は取得しません。<br>
      本調査で得られたデータは、学術目的に限定して公表される場合があります。データを公表する際にも、個人が特定できない形で公表を行います。</p>

      <h3>本調査の回答方法について</h3>
      <p>本調査は、オンラインフォーム上のアンケートによって実施されます。回答に正解・不正解はありません。それぞれの質問に、素直にお答えください。<br>
      本調査への回答は、パソコン（Windows、Mac等）から行ってください。本調査には20分程度の回答時間を要します。静穏な環境でご回答ください。<br>
      なお、本調査への参加は、デバイス1台につき1回に制限されています。そのため、回答を途中で終了した場合でも再回答はできませんので、ご注意ください。</p>

      <h3>報酬のお支払いについて</h3>
      <p>以下の要件をすべて満たした方に、Lancers上で指定した金銭報酬をお支払いいたします。<br>
      本調査の回答完了後に表示されるID番号を、Lancersの作業画面で入力し、送信してください。<br>
      なお、明らかに質問を読んでいないと判断される回答がある場合などには、報酬をお支払いできません。</p>

      <h3>本研究に関するお問い合わせについて</h3>
      <p>本研究で得られた結果について知りたい場合は、Lancersのメッセージ機能でご連絡ください。ただし、個人を特定できるデータを保存していないため、個人データを開示することはできません。<br>
      本研究についてご質問がある場合も、Lancersのメッセージ機能でご連絡ください。<br>
      研究実施機関：名古屋大学情報学研究科　心理・認知科学専攻　心理学講座</p>

      <h3>【確認】あなたは、以上の説明をよく読み、調査への参加に同意しますか。</h3>
      <p>報酬をお支払いする前に限り、本調査への参加に一度同意した後でも、あなたはこの同意を取り消すことができます。同意を取り消すことで、あなたが不利益を被ることはありません。<br>
      同意を取り消す場合は、Lancers上のメッセージ機能でご連絡ください。同意が取り消された場合、あなたの回答データは削除されます。</p>
      <p style="font-weight: bold;">※「同意しない」を選択すると、調査終了ページに移動します。</p>
    </div>
  `,
  choices: ['同意する', '同意しない'],
  on_finish: function(data){
    if(data.response === 1){
      jsPsych.endExperiment("調査へのご参加、ありがとうございました。<br>今回は同意が得られなかったため、調査は行われませんでした。");
    }
  }
});

// ==== 操作説明 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h3>操作説明</h3>
    <p>図形が動くアニメーションが表示されます。</p>
    <p>見終わったら「次へ」ボタンを押し、質問に回答してください。</p>
  `,
  choices: ['練習を始める']
});

// ==== 練習 ====
timeline.push({
  type: 'html-button-response',
  stimulus: '<iframe src="stimuli/perfect_straight_speed2.5.html" width="820" height="620" frameborder="0"></iframe>',
  choices: ['次へ'],
  prompt: "<p>アニメーションを見終わったら「次へ」を押してください。</p>"
});

timeline.push({
  type: 'survey-likert',
  preamble: "<h3>評価</h3><p>今見たアニメーションについてあなたの印象を教えてください。</p>",
  questions: [
    { prompt: "この動きを見てどのように感じましたか？", labels: ["とても不快", "", "", "", "", "", "とても心地よい"], required: true },
    { prompt: "この動きの速さについてどう感じましたか？", labels: ["とても遅い", "", "", "", "", "", "とても速い"], required: true },
  ]
});

// ==== 本番案内 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h3>本番開始</h3>
    <p>ここからが本番です。先ほどと同じ形式でアニメーションが表示されます。</p>
    <p>アニメーションを見終わったら「次へ」を押して、質問に回答してください。</p>
  `,
  choices: ['開始する']
});

// ==== 刺激リスト（シャッフル付き） ====
const stimuliFiles = [
  "stimuli/low_giko_speed2.5.html",
  "stimuli/medium_giko_speed2.5.html",
  "stimuli/high_giko_speed2.5.html"
];
const shuffledStimuli = jsPsych.randomization.shuffle(stimuliFiles);

// ==== 刺激提示 & 評価 ====
shuffledStimuli.forEach(file => {
  timeline.push({
    type: 'html-button-response',
    stimulus: `<iframe src="${file}" width="800" height="600" frameborder="0"></iframe>`,
    choices: ['次へ'],
    prompt: "<p>アニメーションを見終わったら「次へ」を押してください。</p>"
  });

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

const shuffleQuestions = jsPsych.randomization.shuffle([
  { name: "predictable", prompt: "この動きは次にどう動くか予想しやすかった", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "unexpected", prompt: "この動きは予想外の動きが多かった", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "goal_oriented", prompt: "この動きには目的があると感じた", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "intentional", prompt: "意図をもって動いていたように感じた", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "cute", prompt: "この動きはかわいいと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "familiar", prompt: "この動きに親しみを感じた", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "curious", prompt: "この動きは次にどう動くかが気になった", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "want_to_watch_more", prompt: "この動きをもっと見ていたいと感じた", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "want_to_protect", prompt: "この動きを見守りたいと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "want_to_help", prompt: "この動きを助けてあげたいと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "want_to_cheer", prompt: "この動きを応援したいと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "awkward", prompt: "この動きはぎこちないと感じた", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "clumsy", prompt: "この動きは不器用だと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "smooth", prompt: "この動きは滑らかだと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "funny", prompt: "この動きは面白いと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "calming", prompt: "この動きを見て穏やかな気持ちになった", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "irritating", prompt: "この動きを見てイライラした", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true },
  { name: "boring", prompt: "この動きは退屈だと思った", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true }
]);

  const allQuestions = fixedQuestions.concat(shuffleQuestions);

  timeline.push({
    type: 'survey-likert',
    preamble: "<h3>今見たアニメーションについてあなたの印象を教えてください。</h3>",
    questions: allQuestions,
    on_load: () => {
      document.querySelectorAll('.jspsych-survey-likert-horizontal .jspsych-survey-likert-label').forEach(label => {
        label.style.whiteSpace = 'nowrap';
        label.style.fontSize = '13px';
        label.style.maxWidth = '100px';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.display = 'inline-block';
        label.style.verticalAlign = 'top';
        label.style.textAlign = 'center';
      });

      document.querySelectorAll('.jspsych-survey-likert-horizontal td').forEach(cell => {
        cell.style.width = '100px';
      });
    }
  });
});

// ==== 背景質問 ====
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
  button_label: "次へ"
});
timeline.push({
  type: 'survey-likert',
  preamble: "<h3>以下の質問にお答えください</h3>",
  questions: [
    { name: "aq_q1", prompt: "私は、物事を一人で行うよりもほかの人と一緒に行うのを好む", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q2", prompt: "自分では丁寧に話しているつもりでも、ほかの人から失礼だと言われることがよくある", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q3", prompt: "私には興味の偏りがあり、それを追及できないと混乱してしまう", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q4", prompt: "物語を読んでいる時、登場人物の意図を理解するのが難しい", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q5", prompt: "私は、博物館よりは劇場に行きたい", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q6", prompt: "私は、冗談が理解できないことがよくある", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q7", prompt: "私は、相手の表情から、感じていることや考えていることが容易にわかる", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q8", prompt: "私は、特定のカテゴリー（例：自動車、鳥、電車、植物の種類など）について情報を集めることが好きだ", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q9", prompt: "私は、他者の立場を想像するのが苦手だ", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true },
    { name: "aq_q10", prompt: "私には、他人の意図を理解しがたい", labels: ["確かに違う", "だいたい違う", "だいたいそうだ", "確かにそうだ"], required: true }
  ]
});

timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h2>ご協力ありがとうございました！</h2>
    <p>これで実験は終了です。</p>
  `,
  choices: ['完了']
});

// ==== jsPsych初期化 & データ送信 ====
jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    const participantID = generateParticipantID();

    // 全survey-likertの回答（印象評価＋AQ）
    const likertAll = jsPsych.data.get().filter({ trial_type: 'survey-likert' }).values();

    // 刺激の提示ブロック（アニメーション）
    const stimulusTrials = jsPsych.data.get().filter({ trial_type: 'html-button-response' }).values();

    // 背景質問（年齢・性別など）を取得
    const backgroundData = jsPsych.data.get().filter({ trial_type: 'survey-html-form' }).values();
    const background = backgroundData.length > 0 ? backgroundData[0].response : {};

    const responses = [];

    // 印象評価部分だけ responses に追加（stimulus つき）
    for (let i = 0; i < stimulusTrials.length - 1; i++) {
      const stim_html = stimulusTrials[i].stimulus;
      const fileMatch = stim_html.match(/src="([^"]+)"/);
      const stimulusFile = fileMatch ? fileMatch[1] : `unknown_${i}`;

      responses.push({
        stimulus: stimulusFile,
        ...likertAll[i]?.response  // ← 名前付き質問が自動展開される
      });
    }

    // 🔥 ここがポイント！ backgroundをまるっと展開して追加
    const dataToSend = {
      id: participantID,
      ...background,         // ← これで年齢・性別・子育て・ペット・AQ全部入る
      responses: responses   // ← 刺激ごとの印象評価リスト
    };

    console.log("送信データ:", dataToSend);

    // ✅ Netlifyにデータ送信（非表示）
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "experiment-data",
        "data": JSON.stringify(dataToSend)
      })
    })
    .then(() => {
      console.log("Netlifyに送信完了！");
    })
    .catch((error) => {
      console.error("送信失敗:", error);
    });
  }
});
