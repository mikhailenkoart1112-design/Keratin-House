"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  order: number;
  active: boolean;
};

const createEmptyPost = (order: number): BlogPost => ({
  id: `post-${Date.now()}`,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  order,
  active: true,
});

export default function BlogAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("daryna-admin-auth");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const timer = setTimeout(() => {
      setAllowed(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/blog?admin=true", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!data.success) {
        setMessage("Не вдалося завантажити блог.");
        setLoading(false);
        return;
      }

      const loadedPosts: BlogPost[] = (data.posts || []).map(
        (post: Partial<BlogPost>) => ({
          id: post.id || `post-${Date.now()}`,
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          order: Number(post.order) || 1,
          active: post.active !== false,
        })
      );

      setPosts(loadedPosts);
      setLoading(false);
    } catch {
      setMessage("Помилка завантаження блогу.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadPosts();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadPosts]);

  function updatePost(
    index: number,
    key: keyof BlogPost,
    value: string | number | boolean
  ) {
    setPosts((current) =>
      current.map((post, postIndex) =>
        postIndex === index
          ? {
              ...post,
              [key]: value,
            }
          : post
      )
    );

    setMessage("");
  }

  function addPost() {
    setPosts((current) => [...current, createEmptyPost(current.length + 1)]);
    setMessage("");
  }

  function deletePost(index: number) {
    setPosts((current) => current.filter((_, postIndex) => postIndex !== index));
    setMessage("");
  }

  async function savePosts() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ posts }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage("Не вдалося зберегти блог.");
        setSaving(false);
        return;
      }

      setMessage("Блог збережено в Google Sheets.");
      setSaving(false);
    } catch {
      setMessage("Помилка збереження.");
      setSaving(false);
    }
  }

  if (!allowed) return null;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/admin" style={backButtonStyle}>
          <ArrowLeft size={18} />
          Назад в адмінку
        </Link>

        <section style={topCardStyle}>
          <p style={labelStyle}>daryna_makhraieva Admin</p>

          <h1 style={titleStyle}>Блог</h1>

          <p style={descriptionStyle}>
            Редагування статей сайту: назва, slug, короткий опис, основний
            текст, порядок і активність.
          </p>

          <div style={buttonsStyle}>
            <button
              onClick={savePosts}
              disabled={saving || loading}
              style={{
                ...goldButtonStyle,
                opacity: saving || loading ? 0.55 : 1,
                cursor: saving || loading ? "not-allowed" : "pointer",
              }}
            >
              <Save size={18} />
              {saving ? "Зберігаємо..." : "Зберегти"}
            </button>

            <button
              onClick={loadPosts}
              disabled={saving || loading}
              style={{
                ...creamButtonStyle,
                opacity: saving || loading ? 0.55 : 1,
                cursor: saving || loading ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={18} />
              Оновити
            </button>

            <button
              onClick={addPost}
              disabled={saving || loading}
              style={{
                ...whiteButtonStyle,
                opacity: saving || loading ? 0.55 : 1,
                cursor: saving || loading ? "not-allowed" : "pointer",
              }}
            >
              <Plus size={18} />
              Додати статтю
            </button>
          </div>

          {message && <p style={messageStyle}>{message}</p>}
        </section>

        {loading ? (
          <section style={loadingCardStyle}>
            <Loader2 className="animate-spin" size={32} />
            <h2 style={loadingTitleStyle}>Завантажуємо...</h2>
          </section>
        ) : (
          <section style={postsGridStyle}>
            {posts.map((post, index) => (
              <article key={`${post.id}-${index}`} style={postCardStyle}>
                <div style={cardTopStyle}>
                  <div style={iconBoxStyle}>
                    <FileText size={24} />
                  </div>

                  <button
                    onClick={() => deletePost(index)}
                    style={deleteButtonStyle}
                  >
                    <Trash2 size={16} />
                    Видалити
                  </button>
                </div>

                <p style={postNumberStyle}>Стаття #{index + 1}</p>

                <Field
                  label="ID"
                  value={post.id}
                  onChange={(value) => updatePost(index, "id", value)}
                  placeholder="post-1"
                />

                <Field
                  label="Назва"
                  value={post.title}
                  onChange={(value) => updatePost(index, "title", value)}
                  placeholder="Як доглядати за волоссям"
                />

                <Field
                  label="Slug"
                  value={post.slug}
                  onChange={(value) => updatePost(index, "slug", value)}
                  placeholder="hair-care"
                />

                <Field
                  label="Короткий опис"
                  value={post.excerpt}
                  onChange={(value) => updatePost(index, "excerpt", value)}
                  placeholder="Короткий опис статті"
                  textarea
                />

                <Field
                  label="Текст статті"
                  value={post.content}
                  onChange={(value) => updatePost(index, "content", value)}
                  placeholder="Основний текст статті..."
                  textarea
                  big
                />

                <Field
                  label="Порядок"
                  value={String(post.order)}
                  onChange={(value) =>
                    updatePost(index, "order", Number(value) || 0)
                  }
                  placeholder="1"
                  type="number"
                />

                <button
                  onClick={() => updatePost(index, "active", !post.active)}
                  style={{
                    ...activeButtonStyle,
                    background: post.active ? "#ecfdf3" : "#fff1f1",
                    color: post.active ? "#15803d" : "#ef4444",
                  }}
                >
                  {post.active ? <Eye size={17} /> : <EyeOff size={17} />}
                  {post.active ? "Активна" : "Вимкнена"}
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  big,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  textarea?: boolean;
  big?: boolean;
  type?: string;
}) {
  return (
    <div style={fieldStyle}>
      <label style={fieldLabelStyle}>{label}</label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            minHeight: big ? "260px" : "125px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8f6f2",
  padding: "32px 10px 96px",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
};

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "28px",
  borderRadius: "999px",
  background: "#ffffff",
  padding: "14px 20px",
  color: "#2b2826",
  fontSize: "15px",
  fontWeight: 900,
  textDecoration: "none",
  boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
};

const topCardStyle: CSSProperties = {
  marginBottom: "28px",
  borderRadius: "36px",
  background: "#ffffff",
  padding: "32px",
  border: "1px solid rgba(201,169,110,0.3)",
  boxShadow: "0 26px 80px rgba(52,39,25,0.12)",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "#c9a96e",
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.22em",
};

const titleStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "#2b2826",
  fontSize: "46px",
  lineHeight: "1",
  fontWeight: 800,
  letterSpacing: "-0.07em",
};

const descriptionStyle: CSSProperties = {
  margin: "18px 0 0",
  maxWidth: "720px",
  color: "#77716b",
  fontSize: "17px",
  lineHeight: "1.75",
  fontWeight: 500,
};

const buttonsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "24px",
};

const goldButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#c9a96e",
  padding: "15px 22px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 900,
  boxShadow: "0 18px 42px rgba(201,169,110,0.34)",
};

const creamButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#f1ebe3",
  padding: "15px 22px",
  color: "#2b2826",
  fontSize: "15px",
  fontWeight: 900,
};

const whiteButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#ffffff",
  padding: "15px 22px",
  color: "#2b2826",
  fontSize: "15px",
  fontWeight: 900,
  boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
};

const messageStyle: CSSProperties = {
  margin: "20px 0 0",
  borderRadius: "20px",
  background: "#f8f6f2",
  padding: "14px 16px",
  color: "#2b2826",
  fontSize: "14px",
  fontWeight: 900,
};

const loadingCardStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  gap: "14px",
  borderRadius: "36px",
  background: "#ffffff",
  padding: "42px",
  color: "#c9a96e",
  boxShadow: "0 26px 80px rgba(52,39,25,0.12)",
};

const loadingTitleStyle: CSSProperties = {
  margin: 0,
  color: "#2b2826",
  fontSize: "30px",
  fontWeight: 800,
  letterSpacing: "-0.06em",
};

const postsGridStyle: CSSProperties = {
  display: "grid",
  gap: "28px",
};

const postCardStyle: CSSProperties = {
  borderRadius: "36px",
  background: "#ffffff",
  padding: "30px",
  border: "1px solid rgba(201,169,110,0.3)",
  boxShadow: "0 26px 80px rgba(52,39,25,0.12)",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "22px",
};

const iconBoxStyle: CSSProperties = {
  width: "46px",
  height: "46px",
  display: "grid",
  placeItems: "center",
  borderRadius: "16px",
  background: "#f8f6f2",
  color: "#c9a96e",
};

const deleteButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#fff1f1",
  padding: "12px 16px",
  color: "#ef4444",
  fontSize: "14px",
  fontWeight: 900,
  cursor: "pointer",
};

const postNumberStyle: CSSProperties = {
  margin: "0 0 18px",
  color: "#c9a96e",
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
};

const fieldStyle: CSSProperties = {
  marginTop: "18px",
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  color: "#c9a96e",
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(201,169,110,0.24)",
  borderRadius: "24px",
  background: "#f8f6f2",
  padding: "18px 20px",
  color: "#2b2826",
  fontSize: "17px",
  lineHeight: "1.55",
  fontWeight: 650,
  outline: "none",
};

const activeButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "22px",
  border: "none",
  borderRadius: "999px",
  padding: "13px 18px",
  fontSize: "14px",
  fontWeight: 900,
  cursor: "pointer",
};

