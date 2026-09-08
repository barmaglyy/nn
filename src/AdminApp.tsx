import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft, Check, Clock3, Inbox, LogOut, Mail, MessageCircle,
  Phone, RefreshCw, ShieldCheck, Trash2, UserRound,
} from 'lucide-react';
import {
  deleteContactMessage,
  getContactMessages,
  hasSupabaseConfig,
  markContactMessageRead,
  signInAdmin,
  type AdminSession,
  type ContactMessage,
} from './lib/contact-api';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function LoginScreen({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      onLogin(await signInAdmin(email, password));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'تعذر تسجيل الدخول');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-shell admin-login-shell" dir="rtl">
      <div className="admin-login-card glass">
        <a className="admin-back-link" href="../"><ArrowLeft size={15} /> العودة للموقع</a>
        <div className="admin-lock"><ShieldCheck size={25} /></div>
        <div className="eyebrow">BUILDLY / ADMIN</div>
        <h1>صندوق الطلبات</h1>
        <p className="admin-subtitle">سجّل الدخول لمتابعة رسائل العملاء والطلبات الجديدة.</p>
        <form className="admin-login-form" onSubmit={submit}>
          <label>
            البريد الإلكتروني
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required={hasSupabaseConfig}
            />
          </label>
          <label>
            كلمة المرور
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              autoFocus
            />
          </label>
          {error && <div className="admin-error" role="alert">{error}</div>}
          <button className="btn-primary admin-submit" type="submit" disabled={busy}>
            {busy ? <RefreshCw className="spin" size={16} /> : <ShieldCheck size={16} />}
            {busy ? 'جارٍ التحقق...' : 'دخول آمن'}
          </button>
        </form>
        {!hasSupabaseConfig && (
          <p className="admin-demo-note">
            الوضع التجريبي مفعّل حالياً. كلمة المرور الافتراضية: <code>buildly-admin</code>.
            أضف بيانات Supabase قبل النشر لتخزين الطلبات لجميع الزوار.
          </p>
        )}
      </div>
    </main>
  );
}

function AdminDashboard({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const selected = useMemo(
    () => messages.find((message) => message.id === selectedId) || messages[0],
    [messages, selectedId],
  );

  const loadMessages = async () => {
    setLoading(true);
    setNotice('');
    try {
      const nextMessages = await getContactMessages(session);
      setMessages(nextMessages);
      setSelectedId((current) => current && nextMessages.some((message) => message.id === current)
        ? current
        : nextMessages[0]?.id || null);
    } catch (loadError) {
      setNotice(loadError instanceof Error ? loadError.message : 'تعذر تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadMessages(); }, []);

  const selectMessage = async (message: ContactMessage) => {
    setSelectedId(message.id);
    if (message.status === 'new') {
      try {
        await markContactMessageRead(message.id, session);
        setMessages((current) => current.map((item) => (
          item.id === message.id ? { ...item, status: 'read' } : item
        )));
      } catch {
        // The message remains visible even if the read marker cannot be saved.
      }
    }
  };

  const removeMessage = async (id: string) => {
    if (!window.confirm('حذف هذا الطلب نهائياً؟')) return;
    try {
      await deleteContactMessage(id, session);
      const remaining = messages.filter((message) => message.id !== id);
      setMessages(remaining);
      setSelectedId(remaining[0]?.id || null);
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الطلب');
    }
  };

  const unreadCount = messages.filter((message) => message.status === 'new').length;

  return (
    <main className="admin-shell" dir="rtl">
      <header className="admin-header">
        <div className="admin-header-inner">
          <a className="brand" href="../"><span className="brand-mark">b/</span><span>buildly</span></a>
          <div className="admin-header-actions">
            <span className="admin-user"><ShieldCheck size={14} /> {session.email}</span>
            <button className="admin-logout" onClick={onLogout}><LogOut size={15} /> خروج</button>
          </div>
        </div>
      </header>
      <div className="container admin-content">
        <div className="admin-title-row">
          <div>
            <div className="eyebrow">PRIVATE INBOX / 01</div>
            <h1>طلبات العملاء</h1>
            <p>كل الرسائل التي تصل من نموذج التواصل تظهر هنا.</p>
          </div>
          <button className="admin-refresh" onClick={() => void loadMessages()} disabled={loading}>
            <RefreshCw className={loading ? 'spin' : ''} size={15} /> تحديث
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat glass"><Inbox size={18} /><strong>{messages.length}</strong><span>إجمالي الطلبات</span></div>
          <div className="admin-stat glass"><Clock3 size={18} /><strong>{unreadCount}</strong><span>طلبات جديدة</span></div>
          <div className="admin-stat glass"><Check size={18} /><strong>{messages.length - unreadCount}</strong><span>تمت قراءتها</span></div>
        </div>

        {notice && <div className="admin-error admin-wide-error" role="alert">{notice}</div>}
        <div className="admin-inbox">
          <aside className="admin-list glass">
            <div className="admin-list-heading"><span>الرسائل</span><b>{messages.length}</b></div>
            {loading ? (
              <div className="admin-empty"><RefreshCw className="spin" size={20} /><p>جارٍ التحميل...</p></div>
            ) : messages.length === 0 ? (
              <div className="admin-empty"><Inbox size={28} /><p>لا توجد طلبات بعد.</p><span>ستظهر الرسائل الجديدة هنا.</span></div>
            ) : messages.map((message) => (
              <button
                className={`admin-message-row ${selected?.id === message.id ? 'active' : ''}`}
                key={message.id}
                onClick={() => void selectMessage(message)}
              >
                <span className={`message-status ${message.status}`} />
                <span className="message-row-copy">
                  <strong>{message.name}</strong>
                  <small>{message.subject || 'طلب جديد'}</small>
                  <time>{formatDate(message.created_at)}</time>
                </span>
              </button>
            ))}
          </aside>

          <section className="admin-detail glass">
            {selected ? (
              <>
                <div className="admin-detail-top">
                  <div><span className="message-pill">{selected.status === 'new' ? 'جديد' : 'تمت القراءة'}</span><h2>{selected.subject || 'طلب بدون عنوان'}</h2><time>{formatDate(selected.created_at)}</time></div>
                  <button className="delete-message" onClick={() => void removeMessage(selected.id)} aria-label="حذف الطلب"><Trash2 size={17} /></button>
                </div>
                <div className="sender-card">
                  <div className="sender-avatar"><UserRound size={18} /></div>
                  <div><strong>{selected.name}</strong><a href={`mailto:${selected.email}`}><Mail size={13} />{selected.email}</a></div>
                </div>
                <div className="detail-contacts">
                  {selected.phone && <a href={`tel:${selected.phone}`}><Phone size={14} />{selected.phone}</a>}
                  <a href={`mailto:${selected.email}`}><Mail size={14} /> الرد عبر البريد</a>
                </div>
                <div className="message-body">{selected.message}</div>
                <a className="reply-button btn-primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'طلبك إلى buildly'}`)}`}>
                  <MessageCircle size={15} /> الرد على العميل
                </a>
              </>
            ) : (
              <div className="admin-empty admin-detail-empty"><Inbox size={36} /><h2>اختر طلباً</h2><p>اختَر رسالة من القائمة لعرض تفاصيلها.</p></div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(null);
  return session
    ? <AdminDashboard session={session} onLogout={() => setSession(null)} />
    : <LoginScreen onLogin={setSession} />;
}