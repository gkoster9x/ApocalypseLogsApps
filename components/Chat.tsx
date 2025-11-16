import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Terminal } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

export const Chat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: "Watcher AI kích hoạt. Hệ thống trực tuyến. Tôi có thể hỗ trợ gì cho việc sinh tồn của bạn hôm nay?" }
    ]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // Format history for API
            const history = messages.map(m => ({
                role: m.role,
                parts: m.text
            }));

            const response = await getChatResponse(history, userMsg);
            setMessages(prev => [...prev, { role: 'model', text: response || "..." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Lỗi kết nối máy chủ..." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto flex flex-col border border-stone-800 bg-stone-950 rounded-sm overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-stone-900 p-4 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                    <Terminal className="w-5 h-5" />
                    <h2 className="font-mono text-sm font-bold tracking-widest">WATCHER_AI_V2.1</h2>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-600/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-600/30 rounded-full"></div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-sm border 
                            ${msg.role === 'model' ? 'border-emerald-900 bg-emerald-950/30 text-emerald-600' : 'border-stone-700 bg-stone-800 text-stone-400'}`}>
                            {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-sm text-sm font-mono leading-relaxed border
                            ${msg.role === 'model' 
                                ? 'bg-emerald-950/10 border-emerald-900/50 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                                : 'bg-stone-900 border-stone-800 text-stone-300'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                     <div className="flex gap-4 flex-row">
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-sm border border-emerald-900 bg-emerald-950/30 text-emerald-600">
                             <Bot size={18} />
                        </div>
                         <div className="text-emerald-600 text-xs flex items-center h-8 animate-pulse">
                            ĐANG XỬ LÝ DỮ LIỆU...
                        </div>
                     </div>
                )}
                <div ref={bottomRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-stone-900 border-t border-stone-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập yêu cầu hỗ trợ..."
                        className="flex-1 bg-black border border-stone-800 text-stone-300 p-3 font-mono text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-900 placeholder-stone-700"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-emerald-900/30 text-emerald-600 border border-emerald-800 hover:bg-emerald-900/50 hover:text-emerald-400 px-4 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};