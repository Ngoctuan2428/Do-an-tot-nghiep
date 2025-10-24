import { useState } from 'react';
import { Send } from 'lucide-react';

export default function DetailInteraction() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'Patricia',
      role: 'Cookpad Community Manager',
      time: '18 ngày trước',
      avatar: 'https://www.cookpad.com/assets/images/profile_default.png',
      content: `
👋 Welcome to Cookpad, Page One!

I'm Patricia, one of the Cookpad Community Managers. 🧡 Thank you for joining the biggest online cooking community in the world! 🌏

You found us while looking for a recipe or wanting to share some of your own? 👩‍🍳 At Cookpad, you can:

🍽️ Find new ideas - Type in ingredients, a dish name, cooking method, or cuisine in the search bar.
🧑‍🍳 Create and share your own recipes - Now even faster with our AI tool 🤖, but don't forget to upload an original picture of the final result! 📸
🤝 Find a community of home-cooks - Stay up-to-date with messages and comments from new friends and followers.
💬 Share your passion for cooking - Tell us a little bit about your love for home-cooking!
📷 Send a Cooksnap! - If you try a recipe, take a picture of the result and post it as a comment to show how your experience went.

📝 Unsure how to write a recipe?  
Read this handy guide here 👉 [https://blog.cookpad.com/us/the-recipe-for-a-great-recipe/](https://blog.cookpad.com/us/the-recipe-for-a-great-recipe/)

Or using our AI tool 👉 [https://blog.cookpad.com/us/meet-cookpads-new-ai-assistant-your-smarter-way-to-create-recipes/](https://blog.cookpad.com/us/meet-cookpads-new-ai-assistant-your-smarter-way-to-create-recipes/)

📣 On our blog, you can also find seasonal recipes and cooking tips to help inspire your cooking journey! 👉 [https://blog.cookpad.com/us/](https://blog.cookpad.com/us/)

Any questions, please feel free to get in touch by messaging me directly or sending an email to help@cookpad.com 💌  

Happy cooking! 🍳  
Patricia [https://cookpad.com/us/users/113890724]
      `,
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      name: 'Bạn',
      role: 'User',
      time: 'Vừa xong',
      avatar: 'https://www.cookpad.com/assets/images/profile_default.png',
      content: input.trim(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-xl font-semibold mb-6">Phản hồi</h1>

      <div className="border rounded-lg bg-white shadow-sm p-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-6">
            <div className="flex items-start gap-3">
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{msg.name}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <div
                  className="prose prose-sm text-gray-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\n/g, '<br/>')
                      .replace(
                        /\[(https?:\/\/[^\s\]]+)\]/g,
                        '<a href="$1" target="_blank" class="text-orange-500 hover:underline">$1</a>'
                      ),
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input gửi phản hồi */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 border rounded-full px-4 py-2 bg-white shadow-sm"
      >
        <input
          type="text"
          placeholder="Trả lời thử..."
          className="flex-1 outline-none text-sm text-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="text-orange-500 hover:text-orange-600 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
