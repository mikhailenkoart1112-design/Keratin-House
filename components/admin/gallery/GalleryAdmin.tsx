"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  order: number;
  active: boolean;
};

type GalleryKey =
  | "id"
  | "title"
  | "category"
  | "imageUrl"
  | "beforeImageUrl"
  | "afterImageUrl"
  | "order"
  | "active";

type ImageKey = "imageUrl" | "beforeImageUrl" | "afterImageUrl";

const emptyGalleryItem = (): GalleryItem => ({
  id: `gallery-${Date.now()}`,
  title: "",
  category: "work",
  imageUrl: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  order: 1,
  active: true,
});

export default function GalleryAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/gallery", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити галерею.");
        setLoading(false);
        return;
      }

      const loadedGallery: GalleryItem[] = (result.gallery || []).map(
        (item: Partial<GalleryItem>) => ({
          id: item.id || `gallery-${Date.now()}`,
          title: item.title || "",
          category: item.category || "work",
          imageUrl: item.imageUrl || "",
          beforeImageUrl: item.beforeImageUrl || "",
          afterImageUrl: item.afterImageUrl || "",
          order: Number(item.order) || 1,
          active: item.active !== false,
        })
      );

      setGallery(loadedGallery);
      setLoading(false);
    } catch {
      setError("Помилка завантаження галереї.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadGallery();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadGallery]);

  const updateGalleryItem = (
    index: number,
    key: GalleryKey,
    value: string | number | boolean
  ) => {
    setGallery((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );

    setSuccess("");
    setError("");
  };

  const addGalleryItem = () => {
    setGallery((current) => [
      ...current,
      {
        ...emptyGalleryItem(),
        order: current.length + 1,
      },
    ]);

    setSuccess("");
    setError("");
  };

  const removeGalleryItem = (index: number) => {
    setGallery((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );

    setSuccess("");
    setError("");
  };

  const uploadImage = async (index: number, key: ImageKey, file: File) => {
  try {
    const currentKey = `${index}-${key}`;
    setUploadingKey(currentKey);
    setError("");
    setSuccess("");

    const compressed = await imageFileToBase64(file);

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(compressed),
    });

    const result = await response.json();

    if (!result.success || !result.imageUrl) {
      setError("Не вдалося завантажити фото.");
      setUploadingKey("");
      return;
    }

    const updatedGallery = gallery.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: result.imageUrl,
          }
        : item
    );

    setGallery(updatedGallery);

    const saveResponse = await fetch("/api/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gallery: updatedGallery,
      }),
    });

    const saveResult = await saveResponse.json();

    if (!saveResult.success) {
      setError("Фото завантажено, але не збережено в Google Sheets.");
      setUploadingKey("");
      return;
    }

    setSuccess("Фото завантажено і збережено.");
    setUploadingKey("");
  } catch {
    setError("Помилка завантаження фото.");
    setUploadingKey("");
  }
};

  const saveGallery = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gallery,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти галерею в Google Sheets.");
        setSaving(false);
        return;
      }

      setSuccess("Галерею збережено в Google Sheets.");
      setSaving(false);
    } catch {
      setError("Помилка збереження.");
      setSaving(false);
    }
  };

  if (!allowed) return null;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/admin" style={backButtonStyle}>
          <ArrowLeft size={18} />
          Назад в адмінку
        </Link>

        <section style={heroCardStyle}>
          <p style={labelStyle}>daryna_makhraieva Admin</p>

          <h1 style={titleStyle}>Галерея</h1>

          <p style={descriptionStyle}>
            Тут можна додавати фото з телефона. Фото завантажується в Google
            Drive, а URL автоматично вставляється в поле.
          </p>

          <div style={actionsStyle}>
            <button
              onClick={saveGallery}
              disabled={saving || loading || Boolean(uploadingKey)}
              style={{
                ...goldButtonStyle,
                opacity: saving || loading || uploadingKey ? 0.6 : 1,
                cursor:
                  saving || loading || uploadingKey ? "not-allowed" : "pointer",
              }}
            >
              <Save size={18} />
              {saving ? "Зберігаємо..." : "Зберегти в Google Sheets"}
            </button>

            <button
              onClick={loadGallery}
              disabled={saving || loading || Boolean(uploadingKey)}
              style={{
                ...lightButtonStyle,
                opacity: saving || loading || uploadingKey ? 0.6 : 1,
                cursor:
                  saving || loading || uploadingKey ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={18} />
              Оновити
            </button>

            <button
              onClick={addGalleryItem}
              disabled={saving || loading || Boolean(uploadingKey)}
              style={{
                ...whiteButtonStyle,
                opacity: saving || loading || uploadingKey ? 0.6 : 1,
                cursor:
                  saving || loading || uploadingKey ? "not-allowed" : "pointer",
              }}
            >
              <Plus size={18} />
              Додати фото
            </button>
          </div>

          {success && <Message type="success" text={success} />}
          {error && <Message type="error" text={error} />}
        </section>

        {loading ? (
          <section style={loadingCardStyle}>
            <Loader2 className="mx-auto animate-spin text-accent" size={30} />

            <h2 style={loadingTitleStyle}>Завантажуємо...</h2>
          </section>
        ) : (
          <section style={listStyle}>
            {gallery.map((item, index) => (
              <article key={`${item.id}-${index}`} style={itemCardStyle}>
                <div style={itemInnerStyle}>
                  <div style={itemTopStyle}>
                    <ImageIcon size={26} style={{ color: "#c9a96e" }} />

                    <button
                      onClick={() => removeGalleryItem(index)}
                      style={deleteButtonStyle}
                    >
                      <Trash2 size={16} />
                      Видалити
                    </button>
                  </div>

                  <p style={itemNumberStyle}>Фото #{index + 1}</p>

                  <Preview item={item} />

                  <Field
                    label="ID"
                    value={item.id}
                    onChange={(value) => updateGalleryItem(index, "id", value)}
                    placeholder="work-1"
                  />

                  <Field
                    label="Назва"
                    value={item.title}
                    onChange={(value) =>
                      updateGalleryItem(index, "title", value)
                    }
                    placeholder="Робота 1"
                  />

                  <Field
                    label="Категорія"
                    value={item.category}
                    onChange={(value) =>
                      updateGalleryItem(index, "category", value)
                    }
                    placeholder="work або before-after"
                  />

                  <ImageField
                    label="Фото"
                    value={item.imageUrl}
                    onChange={(value) =>
                      updateGalleryItem(index, "imageUrl", value)
                    }
                    onUpload={(file) => uploadImage(index, "imageUrl", file)}
                    uploading={uploadingKey === `${index}-imageUrl`}
                    placeholder="https://..."
                  />

                  <ImageField
                    label="До"
                    value={item.beforeImageUrl}
                    onChange={(value) =>
                      updateGalleryItem(index, "beforeImageUrl", value)
                    }
                    onUpload={(file) =>
                      uploadImage(index, "beforeImageUrl", file)
                    }
                    uploading={uploadingKey === `${index}-beforeImageUrl`}
                    placeholder="https://..."
                  />

                  <ImageField
                    label="Після"
                    value={item.afterImageUrl}
                    onChange={(value) =>
                      updateGalleryItem(index, "afterImageUrl", value)
                    }
                    onUpload={(file) =>
                      uploadImage(index, "afterImageUrl", file)
                    }
                    uploading={uploadingKey === `${index}-afterImageUrl`}
                    placeholder="https://..."
                  />

                  <Field
                    label="Порядок"
                    value={String(item.order)}
                    onChange={(value) =>
                      updateGalleryItem(index, "order", Number(value) || 0)
                    }
                    placeholder="1"
                    type="number"
                  />

                  <button
                    onClick={() =>
                      updateGalleryItem(index, "active", !item.active)
                    }
                    style={{
                      ...activeButtonStyle,
                      background: item.active ? "#ecfdf3" : "#fff1f1",
                      color: item.active ? "#15803d" : "#ef4444",
                    }}
                  >
                    {item.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    {item.active ? "Активна" : "Вимкнена"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Preview({ item }: { item: GalleryItem }) {
  const hasMain = item.imageUrl.trim().length > 0;
  const hasBefore = item.beforeImageUrl.trim().length > 0;
  const hasAfter = item.afterImageUrl.trim().length > 0;

  if (!hasMain && !hasBefore && !hasAfter) {
    return (
      <div style={emptyPreviewStyle}>
        <ImageIcon size={24} />
        <p style={{ margin: 0 }}>Превʼю зʼявиться після додавання фото.</p>
      </div>
    );
  }

  return (
    <div style={previewGridStyle}>
      {hasMain && (
        <div style={previewBoxStyle}>
          <img src={item.imageUrl} alt={item.title} style={previewImageStyle} />
        </div>
      )}

      {hasBefore && (
        <div style={previewBoxStyle}>
          <img
            src={item.beforeImageUrl}
            alt={`${item.title} до`}
            style={previewImageStyle}
          />
        </div>
      )}

      {hasAfter && (
        <div style={previewBoxStyle}>
          <img
            src={item.afterImageUrl}
            alt={`${item.title} після`}
            style={previewImageStyle}
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <label style={fieldLabelStyle}>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
  placeholder: string;
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <label style={fieldLabelStyle}>{label}</label>

      <div style={uploadRowStyle}>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />

        <label
          style={{
            ...uploadButtonStyle,
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          <Upload size={17} />
          {uploading ? "Завантажуємо..." : "Обрати фото"}

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onUpload(file);
              }

              event.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

function Message({ type, text }: { type: "success" | "error"; text: string }) {
  return (
    <p
      style={{
        marginTop: "20px",
        marginBottom: 0,
        borderRadius: "18px",
        background: type === "success" ? "#ecfdf3" : "#fff1f1",
        padding: "14px 16px",
        fontSize: "14px",
        fontWeight: 700,
        color: type === "success" ? "#15803d" : "#ef4444",
      }}
    >
      {text}
    </p>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("File read error"));

    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load error"));

    image.src = src;
  });
}

async function imageFileToBase64(file: File) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxSize = 1600;
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);

  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas error");
  }

  context.drawImage(image, 0, 0, width, height);

  const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.86);
  const base64 = compressedDataUrl.split(",")[1];

  return {
    file: base64,
    fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
    mimeType: "image/jpeg",
  };
}

const pageStyle: CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  background: "#f8f6f2",
  paddingTop: "32px",
  paddingBottom: "96px",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
  paddingLeft: "10px",
  paddingRight: "10px",
  boxSizing: "border-box",
};

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "28px",
  borderRadius: "999px",
  background: "#ffffff",
  padding: "14px 20px",
  fontSize: "15px",
  fontWeight: 800,
  boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
  textDecoration: "none",
  color: "#2b2826",
};

const heroCardStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: "34px",
  padding: "30px",
  boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
  marginBottom: "24px",
};

const labelStyle: CSSProperties = {
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "#c9a96e",
  margin: 0,
};

const titleStyle: CSSProperties = {
  marginTop: "16px",
  marginBottom: 0,
  fontSize: "42px",
  lineHeight: "1.05",
  fontWeight: 700,
  letterSpacing: "-0.07em",
  color: "#2b2826",
};

const descriptionStyle: CSSProperties = {
  marginTop: "18px",
  marginBottom: 0,
  fontSize: "16px",
  lineHeight: "1.75",
  color: "#77716b",
};

const actionsStyle: CSSProperties = {
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
  fontSize: "15px",
  fontWeight: 800,
  color: "#ffffff",
  boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
};

const lightButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#f1ebe3",
  padding: "15px 22px",
  fontSize: "15px",
  fontWeight: 800,
  color: "#2b2826",
};

const whiteButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#ffffff",
  padding: "15px 22px",
  fontSize: "15px",
  fontWeight: 800,
  color: "#2b2826",
  boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
};

const uploadButtonStyle: CSSProperties = {
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#c9a96e",
  padding: "15px 18px",
  fontSize: "14px",
  fontWeight: 800,
  color: "#ffffff",
  boxShadow: "0 16px 36px rgba(201,165,122,0.3)",
};

const uploadRowStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const loadingCardStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: "34px",
  padding: "32px",
  textAlign: "center",
  boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
};

const loadingTitleStyle: CSSProperties = {
  marginTop: "16px",
  fontSize: "30px",
  lineHeight: "1.15",
  fontWeight: 700,
  letterSpacing: "-0.06em",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  width: "100%",
};

const itemCardStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#ffffff",
  borderRadius: "34px",
  boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
  overflow: "hidden",
};

const itemInnerStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "26px 30px 30px 30px",
};

const itemTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const deleteButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "999px",
  background: "#fff1f1",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 800,
  color: "#ef4444",
  cursor: "pointer",
};

const itemNumberStyle: CSSProperties = {
  marginTop: "24px",
  marginBottom: 0,
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "#c9a96e",
};

const previewGridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const previewBoxStyle: CSSProperties = {
  overflow: "hidden",
  borderRadius: "24px",
  background: "#f8f6f2",
};

const previewImageStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "260px",
  objectFit: "cover",
};

const emptyPreviewStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
  borderRadius: "24px",
  background: "#f8f6f2",
  padding: "18px 20px",
  color: "#77716b",
  fontSize: "14px",
  fontWeight: 700,
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "#c9a96e",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "none",
  borderRadius: "24px",
  background: "#f8f6f2",
  padding: "18px 20px",
  fontSize: "17px",
  lineHeight: "1.55",
  fontWeight: 650,
  color: "#2b2826",
  outline: "none",
  overflowWrap: "anywhere",
};

const activeButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "20px",
  border: "none",
  borderRadius: "999px",
  padding: "13px 18px",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
};
