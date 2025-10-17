interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    "အီလက်ထရွန်နစ် ကွန်ပျူတာ တွက်ချက်မှုကို ရိုးရိုးရှင်းရှင်း ရှင်းပြပေးပါ",
    "အချိန်ခရီးသွားတစ်ယောက်အကြောင်း တီထွင်ဖန်တီးထားတဲ့ ပုံပြင်တစ်ပုဒ် ရေးပေးပါ",
    "တစ်ပတ်အတွက် ကျန်းမာရေးနဲ့ ညီတဲ့ အစားအသောက် အစီအစဉ် ကူညီပြင်ဆင်ပေးပါ",
    "JavaScript အခြေခံ အသိပညာတွေ သင်ပေးပါ",
  ];

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">💬</div>
        <h2 className="empty-state-title">စကားစမြည် ပြောကြမယ်</h2>
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
