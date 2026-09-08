export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read';
  created_at: string;
};

export type ContactPayload = Omit<ContactMessage, 'id' | 'status' | 'created_at'>;

export type AdminSession = {
  accessToken: string;
  email: string;
  local: boolean;
};

const LOCAL_STORAGE_KEY = 'buildly_contact_messages';
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'buildly-admin';
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

function localMessages(): ContactMessage[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') as ContactMessage[];
  } catch {
    return [];
  }
}

function saveLocalMessages(messages: ContactMessage[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
}

function supabaseHeaders(accessToken = supabaseAnonKey): HeadersInit {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function readError(response: Response) {
  try {
    const body = await response.json() as { message?: string; error_description?: string };
    return body.message || body.error_description || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function submitContactMessage(payload: ContactPayload) {
  if (!hasSupabaseConfig) {
    const message: ContactMessage = {
      ...payload,
      id: crypto.randomUUID(),
      status: 'new',
      created_at: new Date().toISOString(),
    };
    saveLocalMessages([message, ...localMessages()]);
    return { local: true };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
    method: 'POST',
    headers: { ...supabaseHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(await readError(response));
  return { local: false };
}

export async function signInAdmin(email: string, password: string): Promise<AdminSession> {
  if (!hasSupabaseConfig) {
    if (password !== LOCAL_ADMIN_PASSWORD) throw new Error('كلمة المرور غير صحيحة');
    return { accessToken: 'local-demo', email: email || 'admin', local: true };
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message.includes('Invalid') ? 'بيانات الدخول غير صحيحة' : message);
  }

  const data = await response.json() as { access_token: string; user?: { email?: string } };
  return {
    accessToken: data.access_token,
    email: data.user?.email || email,
    local: false,
  };
}

export async function getContactMessages(session: AdminSession): Promise<ContactMessage[]> {
  if (session.local) return localMessages().sort((a, b) => b.created_at.localeCompare(a.created_at));

  const response = await fetch(
    `${supabaseUrl}/rest/v1/contact_messages?select=*&order=created_at.desc`,
    { headers: supabaseHeaders(session.accessToken) },
  );
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<ContactMessage[]>;
}

export async function markContactMessageRead(id: string, session: AdminSession) {
  if (session.local) {
    saveLocalMessages(localMessages().map((message) => (
      message.id === id ? { ...message, status: 'read' } : message
    )));
    return;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...supabaseHeaders(session.accessToken), Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'read' }),
    },
  );
  if (!response.ok) throw new Error(await readError(response));
}

export async function deleteContactMessage(id: string, session: AdminSession) {
  if (session.local) {
    saveLocalMessages(localMessages().filter((message) => message.id !== id));
    return;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { ...supabaseHeaders(session.accessToken), Prefer: 'return=minimal' },
    },
  );
  if (!response.ok) throw new Error(await readError(response));
}