interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    // Personal Finance
    "ကျွန်တော်ဟာ လစာဝင်ငွေ ၈ သိန်းရှိတဲ့ ဝန်ထမ်းတစ်ယောက်ပါ။ 50/30/20 ဘတ်ဂျက်နည်းလမ်းကိုသုံးပြီး လစဉ် အသုံးစရိတ် စီမံခန့်ခွဲဖို့ ကူညီပေးပါ။ အိမ်လခ၊ စားစရိတ်၊ သွားလာရေး၊ အရေးပေါ်စုငွေ နဲ့ ကိုယ်ပိုင်သုံးစွဲမှုအတွက် ရာခိုင်နှုန်းအလိုက် ခွဲခြမ်းပြတဲ့ ဇယားတစ်ခုနဲ့ ရှင်းပြပေးပါ။",

    // Health & Fitness
    "တစ်နေ့လုံး ကွန်ပျူတာရှေ့မှာ အလုပ်လုပ်ရတဲ့အတွက် ခါးနဲ့ပခုံးတွေ ညောင်းညာနေပါတယ်။ အလုပ်စားပွဲမှာပဲ ၅ မိနစ်အတွင်း လုပ်လို့ရတဲ့ ရိုးရှင်းတဲ့ အကြောလျှော့လေ့ကျင့်ခန်း (stretching exercises) ၅ မျိုးလောက်နဲ့ ရှင်းပြပေးနိုင်မလား။",

    // Event Planning
    "ကျွန်တော့်သူငယ်ချင်းရဲ့ မွေးနေ့အတွက် အမှတ်တရဖြစ်စေမယ့် surprise party တစ်ခု စီစဉ်ချင်ပါတယ်။ လူ ၁၅ ယောက်လောက်အတွက် ရန်ကုန်မှာရှိတဲ့ စိတ်ဝင်စားစရာကောင်းတဲ့ နေရာ၊ လုပ်ဆောင်စရာ (activities) နဲ့ အစားအသောက်ဆိုင် idea အသစ်အဆန်းတွေ အကြံပြုပေးပါ။",

    // Productivity
    "ကျွန်တော်က အလုပ်တွေကို အချိန်ဆွဲတတ်တဲ့အကျင့် (procrastination) ရှိပါတယ်။ ဒီအကျင့်ကိုကျော်လွှားပြီး ပို productive ဖြစ်လာစေဖို့အတွက် သိပ္ပံနည်းကျ သက်သေပြထားတဲ့ နည်းလမ်း ၅ ခုကို လက်တွေ့လုပ်ဆောင်ရမယ့် အဆင့်တွေနဲ့တကွ ရှင်းပြပေးပါ။",
  ];

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">💬</div>
        <h2 className="empty-state-title">Let's have a conversation.</h2>
        <p className="empty-state-description">
          အောက်က အဆိုပြုချက်တွေ ရွေးချယ်ပါ ဒါမှမဟုတ် သင့်ရဲ့ မက်ဆေ့ချ်
          ရိုက်ထည့်ပါ
        </p>

        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">✨</span>
              <span className="suggestion-text">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
