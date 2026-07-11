import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// 登录页背景设计图（用户提供）
const BG_IMAGE = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260620/image_1781930869617.png";
// 右下角小鹿吉祥物
const MASCOT_SMALL = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithUsername, signUpWithUsername } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameValid = /^[a-zA-Z0-9_]{2,20}$/.test(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameValid) {
      toast.error("用户名只能含字母、数字、下划线，2-20位");
      return;
    }
    if (password.length < 6) {
      toast.error("密码至少6位");
      return;
    }
    if (mode === "register") {
      if (!agreed) { toast.error("请先同意用户协议与隐私政策"); return; }
      if (password !== confirmPassword) { toast.error("两次密码不一致"); return; }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signInWithUsername(username, password);
        if (error) throw error;
        toast.success("登录成功，欢迎回来！");
        navigate("/", { replace: true });
      } else {
        const { error } = await signUpWithUsername(username, password);
        if (error) throw error;
        toast.success("注册成功，欢迎加入！");
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败，请重试";
      if (msg.includes("Invalid login credentials")) {
        toast.error("用户名或密码错误");
      } else if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("该用户名已被注册");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 轻微遮罩，让卡片更清晰 */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      {/* 登录卡片区域 */}
      <div className="relative z-10 w-full max-w-[360px] mx-4 py-6" style={{ marginTop: 0 }}>

        {/* 木质风格卡片 */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(180deg, #f5e6c8 0%, #fdf6e8 8%, #fdf6e8 100%)",
            border: "3px solid #c4922a",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(120,70,10,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* Tab 切换 */}
          <div
            className="grid grid-cols-2"
            style={{
              background: "linear-gradient(180deg, #d4a843 0%, #c8982a 100%)",
              borderBottom: "2px solid #b8841a",
            }}
          >
            {/* 登录 Tab */}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="relative py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              style={mode === "login" ? {
                background: "linear-gradient(180deg, #6dbf5a 0%, #4aa83a 100%)",
                color: "#fff",
                borderRadius: "8px 8px 0 0",
                margin: "4px 4px 0 4px",
                boxShadow: "0 2px 8px rgba(70,160,50,0.4)",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              } : {
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {/* 登录 Tab 叶片装饰 */}
              {mode === "login" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12 Q5 8 3 5 Q7 2 11 5 Q12 8 7 12Z" fill="#c8f0b0"/>
                  <line x1="7" y1="12" x2="7" y2="13.5" stroke="#5a9a40" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
              登录
            </button>

            {/* 注册 Tab */}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="relative py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              style={mode === "register" ? {
                background: "linear-gradient(180deg, #5bbce8 0%, #3aa0d0 100%)",
                color: "#fff",
                borderRadius: "8px 8px 0 0",
                margin: "4px 4px 0 4px",
                boxShadow: "0 2px 8px rgba(60,150,200,0.4)",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              } : {
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {/* 注册 Tab 云朵装饰 */}
              {mode === "register" && (
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M3 9 Q1 9 1 7 Q1 5.5 2.5 5.2 Q2.5 3 4.5 3 Q5 1 7 1 Q9.5 1 10 3 Q12 3 12 5.5 Q14 5.8 14 7.5 Q14 9 12 9Z" fill="#d8f0ff" opacity=".9"/>
                </svg>
              )}
              注册
            </button>
          </div>

          {/* 卡片内容 */}
          <div className="px-5 pt-4 pb-5">
            {/* 标题行：欢迎回来 + 小猫图标 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold" style={{ color: "#5a3a1a" }}>
                {mode === "login" ? "欢迎回来 👋" : "创建账号 🌟"}
              </h2>
              {/* 小橘猫装饰（登录模式） */}
              {mode === "login" && (
                <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
                  <ellipse cx="16" cy="18" rx="10" ry="8" fill="#f5a03c"/>
                  <path d="M8 14 Q7 8 10 6 L10 14Z" fill="#f5a03c"/>
                  <path d="M24 14 Q25 8 22 6 L22 14Z" fill="#f5a03c"/>
                  <path d="M8 14 Q7 9 10 7" stroke="#e8880a" strokeWidth=".8" fill="none"/>
                  <path d="M24 14 Q25 9 22 7" stroke="#e8880a" strokeWidth=".8" fill="none"/>
                  <circle cx="13" cy="16" r="2" fill="#fff"/>
                  <circle cx="19" cy="16" r="2" fill="#fff"/>
                  <circle cx="13.5" cy="16.2" r="1" fill="#5a3020"/>
                  <circle cx="19.5" cy="16.2" r="1" fill="#5a3020"/>
                  <path d="M13 20 Q16 22 19 20" stroke="#e8880a" strokeWidth="1" fill="none" strokeLinecap="round"/>
                  <line x1="9" y1="18.5" x2="4" y2="17.5" stroke="#e8880a" strokeWidth=".9" strokeLinecap="round"/>
                  <line x1="9" y1="20" x2="4" y2="20" stroke="#e8880a" strokeWidth=".9" strokeLinecap="round"/>
                  <line x1="23" y1="18.5" x2="28" y2="17.5" stroke="#e8880a" strokeWidth=".9" strokeLinecap="round"/>
                  <line x1="23" y1="20" x2="28" y2="20" stroke="#e8880a" strokeWidth=".9" strokeLinecap="round"/>
                  <ellipse cx="16" cy="20.5" rx="2" ry="1.2" fill="#e8880a" opacity=".5"/>
                </svg>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 用户名 */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a3a1a" }}>
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#a07850" }} />
                  <input
                    id="username"
                    placeholder="字母/数字/下划线，2-20位"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #d4b88a",
                      color: "#3a2a10",
                      fontSize: "13px",
                    }}
                    onFocus={e => { e.currentTarget.style.border = "1.5px solid #6dbf5a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109,191,90,0.15)"; }}
                    onBlur={e => { e.currentTarget.style.border = "1.5px solid #d4b88a"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a3a1a" }}>
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#a07850" }} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="至少6位"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="w-full pl-8 pr-9 py-2 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #d4b88a",
                      color: "#3a2a10",
                      fontSize: "13px",
                    }}
                    onFocus={e => { e.currentTarget.style.border = "1.5px solid #6dbf5a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109,191,90,0.15)"; }}
                    onBlur={e => { e.currentTarget.style.border = "1.5px solid #d4b88a"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                    style={{ color: "#a07850" }}
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 确认密码（注册时） */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a3a1a" }}>
                    确认密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#a07850" }} />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="再次输入密码"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none transition-all"
                      style={{
                        background: "#fff",
                        border: "1.5px solid #d4b88a",
                        color: "#3a2a10",
                        fontSize: "13px",
                      }}
                      onFocus={e => { e.currentTarget.style.border = "1.5px solid #6dbf5a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109,191,90,0.15)"; }}
                      onBlur={e => { e.currentTarget.style.border = "1.5px solid #d4b88a"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              )}

              {/* 用户协议（注册时） */}
              {mode === "register" && (
                <div className="flex items-start gap-2 pt-0.5">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={v => setAgreed(!!v)}
                    className="mt-0.5 shrink-0"
                  />
                  <label htmlFor="agree" className="text-xs leading-relaxed cursor-pointer" style={{ color: "#7a5a30" }}>
                    我已阅读并同意
                    <span className="font-semibold mx-0.5" style={{ color: "#4aa83a" }}>《用户协议》</span>
                    和
                    <span className="font-semibold mx-0.5" style={{ color: "#4aa83a" }}>《隐私政策》</span>
                  </label>
                </div>
              )}

              {/* 登录/注册按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full text-sm font-bold transition-all mt-1 flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? "linear-gradient(90deg, #8ed08a 0%, #6dbf5a 100%)"
                    : "linear-gradient(90deg, #6dbf5a 0%, #4aa83a 40%, #6dbf5a 100%)",
                  color: "#fff",
                  border: "2px solid #3a9828",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(70,160,50,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.18)",
                  letterSpacing: "0.08em",
                  fontSize: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    {mode === "login" ? "登录中..." : "注册中..."}
                  </>
                ) : (
                  <>（{mode === "login" ? "登 录" : "注 册"}）</>
                )}
              </button>

              {/* 切换提示 */}
              <p className="text-center text-[11px] pt-0.5" style={{ color: "#8a6a40" }}>
                {mode === "login" ? (
                  <>
                    还没有账号？
                    <button
                      type="button"
                      className="font-semibold hover:underline"
                      style={{ color: "#3aa0d0" }}
                      onClick={() => setMode("register")}
                    >
                      立即注册
                    </button>
                  </>
                ) : (
                  <>
                    已有账号？
                    <button
                      type="button"
                      className="font-semibold hover:underline"
                      style={{ color: "#4aa83a" }}
                      onClick={() => setMode("login")}
                    >
                      去登录
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>

        {/* 先逛逛 */}
        <div className="text-center mt-3">
          <Link
            to="/"
            className="text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.92)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            ← 先逛逛，不登录
          </Link>
        </div>
      </div>

      {/* 右下角小鹿吉祥物 */}
      <div
        className="fixed bottom-4 right-4 z-20 pointer-events-none"
        style={{ animation: "loginDeerFloat 3s ease-in-out infinite" }}
      >
        <img
          src={MASCOT_SMALL}
          alt="四四"
          className="w-16 h-16 object-contain drop-shadow-lg rounded-xl"
          style={{ border: "2.5px solid rgba(255,255,255,0.75)" }}
        />
      </div>

      <style>{`
        @keyframes loginDeerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
