interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    "လာမယ့်ပိတ်ရက်မှာ ပုဂံကို ၃ ရက်ကြာ ခရီးသွားဖို့ စီစဉ်နေပါတယ်။ နေ့အလိုက် လည်ပတ်သင့်တဲ့ ဘုရားတွေ၊ စားသောက်ဆိုင်ကောင်းတွေနဲ့ နေဝင်ချိန်ကြည့်ဖို့ အကောင်းဆုံးနေရာတွေကို ထည့်သွင်းပြီး ခရီးစဉ်အသေးစိတ် ရေးဆွဲပေးပါ။",
    "အလုပ်လျှောက်ထားတဲ့ ကုမ္ပဏီကနေ follow-up ပြန်ကြားစာ မရသေးတဲ့အတွက်၊ Professional ဖြစ်ပြီး ယဉ်ကျေးတဲ့ ပုံစံနဲ့ စုံစမ်းမေးမြန်းတဲ့ အီးမေးလ်တစ်စောင် ရေးပေးပါ။",
    "ကိုယ်ပိုင်ကော်ဖီဆိုင်လေးတစ်ခုအတွက် Instagram မှာ  post တစ်ခု ဖန်တီးချင်ပါတယ်။ ဆိုင်ရဲ့ signature ဖြစ်တဲ့ 'မိုးလင်းမှ အိပ်မယ့်သူ' ကို အဓိကထားပြီး ဆွဲဆောင်မှုရှိတဲ့ caption နဲ့ hashtag တွေပါ ထည့်ရေးပေးပါ။",
    "API ဆိုတာဘာလဲ၊ ကျွန်တော်တို့နေ့စဉ်သုံးနေတဲ့ Facebook App က API ကို ဘယ်လိုအသုံးချပြီး အလုပ်လုပ်သလဲဆိုတာကို နားလည်လွယ်တဲ့ ဥပမာနဲ့ ရှင်းပြပေးပါ။",
  ];

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">💬</div>
        <h2 className="empty-state-title">Let's have a conversation.</h2>
        <p className="empty-state-description">
          Please select from the suggestions below, or type in your own message.
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
