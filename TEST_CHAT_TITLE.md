# 🧪 Test Chat Title Update

## ပြဿနာ
User က message ပို့တဲ့အခါ Chat History Name က အလိုအလျောက် မပြောင်းဘူး။ "New Chat" အဖြစ် ကျန်နေတယ်။

## ပြင်ထားတာ
`src/hooks/useChat.ts` မှာ `isFirstMessage` check ကို message မထည့်ခင် စစ်အောင် ပြင်ထားပါပြီ။

## Test လုပ်နည်း

### Step 1: Clear Browser Cache
```javascript
// Browser console မှာ run လုပ်
localStorage.clear()
location.reload()
```

### Step 2: Test New Chat
1. "+ New Chat" button နှိပ်
2. Message တစ်ခု ပို့ကြည့် (ဥပမာ: "Hello, how are you?")
3. Sidebar မှာ chat name က "Hello, how are you?" လို့ ပြောင်းသွားရမယ်
4. Message ရှည်ရင် (40 characters ကျော်) "..." နဲ့ ဖြတ်ပြီး ပြမယ်

### Step 3: Test Existing Chat
1. Chat တစ်ခု ရှိပြီးသား ဖြစ်ရင်
2. အဲ့ chat မှာ message အသစ် ပို့ကြည့်
3. Chat name က မပြောင်းသင့်ဘူး (ရှိပြီးသား name ကို ထိန်းထားမယ်)

## Expected Behavior

### First Message
```
Before: "New Chat"
After:  "Hello, how are you?"
```

### Long Message (> 40 chars)
```
Message: "Can you help me plan a healthy meal for the week?"
Title:   "Can you help me plan a healthy meal f..."
```

### Subsequent Messages
```
Chat already has title: "Hello, how are you?"
Send new message: "What's the weather?"
Title stays: "Hello, how are you?" (unchanged)
```

## Code Changes

### Before (Bug)
```typescript
const updatedSessions = chatSessions.map((session) => {
  if (session.id === activeChatId) {
    const isFirstMessage = session.messages.length === 0; // ❌ Wrong!
    return {
      ...session,
      messages: [...session.messages, newMessage], // Message ထည့်ပြီးမှ
      title: isFirstMessage ? content : session.title, // စစ်တာမို့ အမြဲ false
    };
  }
  return session;
});
```

### After (Fixed)
```typescript
// Check BEFORE adding message
const isFirstMessage = activeChat.messages.length === 0; // ✅ Correct!

const updatedSessions = chatSessions.map((session) => {
  if (session.id === activeChatId) {
    return {
      ...session,
      messages: [...session.messages, newMessage],
      title: isFirstMessage ? content : session.title, // အခု မှန်ပြီ
    };
  }
  return session;
});
```

## Verification

### Check in Browser Console
```javascript
// After sending first message
// Check if title updated
const chats = JSON.parse(localStorage.getItem('chat_sessions') || '[]')
console.log(chats[0].title) // Should be your message, not "New Chat"
```

### Check in MongoDB
```bash
mongosh
use chat_app
db.chats.find().pretty()
# Check if title field has message content
```

## If Still Not Working

### Debug Steps

1. **Check Browser Console for Errors**
   ```
   Open DevTools → Console tab
   Look for any red errors
   ```

2. **Check Network Tab**
   ```
   Open DevTools → Network tab
   Send a message
   Check PUT /api/chats/[id] request
   Verify title is in the request body
   ```

3. **Check State Updates**
   ```javascript
   // Add temporary console.log in useChat.ts
   console.log('isFirstMessage:', isFirstMessage)
   console.log('content:', content)
   console.log('title will be:', isFirstMessage ? content : session.title)
   ```

4. **Force Refresh**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

5. **Clear Everything**
   ```javascript
   // Browser console
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

## Known Issues

### Issue 1: Browser Cache
**Symptom:** Old code still running
**Solution:** Hard refresh (Ctrl+Shift+R)

### Issue 2: MongoDB Not Updated
**Symptom:** Title updates in UI but not in database
**Solution:** Check API endpoint is receiving title

### Issue 3: Race Condition
**Symptom:** Sometimes works, sometimes doesn't
**Solution:** Check if saveChat is being called

## Success Criteria

✅ New chat starts with "New Chat"
✅ First message updates title automatically
✅ Title shows in sidebar immediately
✅ Title persists after refresh
✅ Title saved in MongoDB
✅ Subsequent messages don't change title

---

**Status:** ✅ Fixed in code
**Next:** Test in browser with cache cleared
