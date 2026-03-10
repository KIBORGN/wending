"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Message from "@/components/Message";
import Venue from "@/components/Venue";
import Timeline from "@/components/Timeline";
import DressCode from "@/components/DressCode";
import Contacts from "@/components/Contacts";
import RSVPForm from "@/components/RSVPForm";
import Final from "@/components/Final";

type BlockType =
  | "hero"
  | "message"
  | "venue"
  | "timeline"
  | "dresscode"
  | "contacts"
  | "rsvp"
  | "final";

type RSVPFieldKey = "name" | "attendance" | "children" | "drinks" | "food";

interface BlockTheme {
  cream: string;
  blush: string;
  rose: string;
  dustyRose: string;
  warmBrown: string;
  champagne: string;
  textDark: string;
  textMid: string;
  buttonBg: string;
  buttonText: string;
  buttonHoverBg: string;
  outlineButtonText: string;
  outlineButtonBorder: string;
  outlineButtonHoverText: string;
  formFieldBg: string;
  formFieldSelectedBg: string;
}

interface BuilderBlock {
  id: string;
  type: BlockType;
  theme: BlockTheme;
  rsvpFields: Record<RSVPFieldKey, boolean>;
}

interface BuilderLayer {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  opacity: number;
  zIndex: number;
}

interface ConstructorData {
  blocks: BuilderBlock[];
  layers: BuilderLayer[];
  blockOffsets: Record<string, { x: number; y: number }>;
  layerOffsets: Record<string, { x: number; y: number }>;
  photoOverrides: Record<string, string>;
  textOverrides: Record<string, string>;
}

const STORAGE_KEY = "wedding-constructor-v1";

const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Начало (Hero)",
  message: "Сообщение + календарь",
  venue: "Место",
  timeline: "Таймлайн",
  dresscode: "Дресс-код",
  contacts: "Контакты",
  rsvp: "Форма RSVP",
  final: "Финал + таймер",
};

const DEFAULT_ORDER: BlockType[] = [
  "hero",
  "message",
  "venue",
  "timeline",
  "dresscode",
  "contacts",
  "rsvp",
  "final",
];

const DEFAULT_THEME: BlockTheme = {
  cream: "#faf7f2",
  blush: "#f2e8e0",
  rose: "#c9a89a",
  dustyRose: "#b8867a",
  warmBrown: "#6b4f3a",
  champagne: "#e8d9c0",
  textDark: "#2c2118",
  textMid: "#5a4035",
  buttonBg: "#b8867a",
  buttonText: "#ffffff",
  buttonHoverBg: "#6b4f3a",
  outlineButtonText: "#b8867a",
  outlineButtonBorder: "#b8867a",
  outlineButtonHoverText: "#ffffff",
  formFieldBg: "#ffffff",
  formFieldSelectedBg: "#fdf4f1",
};

const DEFAULT_RSVP_FIELDS: Record<RSVPFieldKey, boolean> = {
  name: true,
  attendance: true,
  children: true,
  drinks: true,
  food: true,
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeBlock(type: BlockType): BuilderBlock {
  return {
    id: makeId(type),
    type,
    theme: { ...DEFAULT_THEME },
    rsvpFields: { ...DEFAULT_RSVP_FIELDS },
  };
}

function makeDefaultBlocks() {
  return DEFAULT_ORDER.map((type) => makeBlock(type));
}

function makeDefaultLayers(): BuilderLayer[] {
  return [
    {
      id: makeId("layer"),
      name: "Цветок слева",
      src: "/1.png",
      x: -40,
      y: 520,
      width: 180,
      height: 180,
      rotate: 24,
      opacity: 0.35,
      zIndex: 19,
    },
  ];
}

function normalizeTheme(theme?: Partial<BlockTheme>): BlockTheme {
  return {
    ...DEFAULT_THEME,
    ...(theme ?? {}),
  };
}

function normalizeRSVPFields(fields?: Partial<Record<RSVPFieldKey, boolean>>) {
  return {
    ...DEFAULT_RSVP_FIELDS,
    ...(fields ?? {}),
  };
}

function sanitizeOffsets(value: unknown) {
  if (!value || typeof value !== "object") return {} as Record<string, { x: number; y: number }>;

  const entries = Object.entries(value as Record<string, unknown>).filter(([, raw]) => {
    if (!raw || typeof raw !== "object") return false;
    const point = raw as { x?: unknown; y?: unknown };
    return (
      typeof point.x === "number" &&
      Number.isFinite(point.x) &&
      typeof point.y === "number" &&
      Number.isFinite(point.y)
    );
  });

  return Object.fromEntries(entries) as Record<string, { x: number; y: number }>;
}

function sanitizePhotoOverrides(value: unknown) {
  if (!value || typeof value !== "object") return {} as Record<string, string>;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter((entry) => typeof entry[1] === "string")
  ) as Record<string, string>;
}

function sanitizeTextOverrides(value: unknown) {
  if (!value || typeof value !== "object") return {} as Record<string, string>;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter((entry) => typeof entry[1] === "string")
  ) as Record<string, string>;
}

function extractConfig(value: unknown): ConstructorData {
  const parsed = (value ?? {}) as {
    blocks?: Array<Partial<BuilderBlock> | null>;
    layers?: Array<Partial<BuilderLayer> | null>;
    blockOffsets?: unknown;
    layerOffsets?: unknown;
    photoOverrides?: unknown;
    textOverrides?: unknown;
  };

  const blocks = (parsed.blocks ?? [])
    .filter((entry): entry is Partial<BuilderBlock> & { type: BlockType } => {
      if (!entry || typeof entry !== "object") return false;
      const type = (entry as { type?: unknown }).type;
      return typeof type === "string" && type in BLOCK_LABELS;
    })
    .map((entry) => ({
      id: entry.id || makeId(entry.type),
      type: entry.type,
      theme: normalizeTheme(entry.theme),
      rsvpFields: normalizeRSVPFields(entry.rsvpFields),
    }));

  const layers = (parsed.layers ?? [])
    .filter((entry): entry is Partial<BuilderLayer> => {
      if (!entry || typeof entry !== "object") return false;
      return typeof (entry as { src?: unknown }).src === "string";
    })
    .map((entry, index) => ({
      id: entry.id || makeId("layer"),
      name: entry.name || `Слой ${index + 1}`,
      src: entry.src || "/1.png",
      x: typeof entry.x === "number" ? entry.x : 0,
      y: typeof entry.y === "number" ? entry.y : 0,
      width: typeof entry.width === "number" ? entry.width : 160,
      height: typeof entry.height === "number" ? entry.height : 160,
      rotate: typeof entry.rotate === "number" ? entry.rotate : 0,
      opacity: typeof entry.opacity === "number" ? entry.opacity : 0.45,
      zIndex: typeof entry.zIndex === "number" ? entry.zIndex : 21,
    }));

  return {
    blocks,
    layers,
    blockOffsets: sanitizeOffsets(parsed.blockOffsets),
    layerOffsets: sanitizeOffsets(parsed.layerOffsets),
    photoOverrides: sanitizePhotoOverrides(parsed.photoOverrides),
    textOverrides: sanitizeTextOverrides(parsed.textOverrides),
  };
}

function readInitialState(): ConstructorData {
  const fallback = {
    blocks: makeDefaultBlocks(),
    layers: makeDefaultLayers(),
    blockOffsets: {},
    layerOffsets: {},
    photoOverrides: {},
    textOverrides: {},
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = extractConfig(JSON.parse(raw));
    return {
      blocks: parsed.blocks.length ? parsed.blocks : fallback.blocks,
      layers: parsed.layers,
      blockOffsets: parsed.blockOffsets,
      layerOffsets: parsed.layerOffsets,
      photoOverrides: parsed.photoOverrides,
      textOverrides: parsed.textOverrides,
    };
  } catch {
    return fallback;
  }
}

function blockToCssVars(theme: BlockTheme): React.CSSProperties {
  return {
    "--cream": theme.cream,
    "--blush": theme.blush,
    "--rose": theme.rose,
    "--dusty-rose": theme.dustyRose,
    "--warm-brown": theme.warmBrown,
    "--champagne": theme.champagne,
    "--text-dark": theme.textDark,
    "--text-mid": theme.textMid,
    "--btn-rose-bg": theme.buttonBg,
    "--btn-rose-text": theme.buttonText,
    "--btn-rose-hover-bg": theme.buttonHoverBg,
    "--btn-outline-text": theme.outlineButtonText,
    "--btn-outline-border": theme.outlineButtonBorder,
    "--btn-outline-hover-bg": theme.buttonBg,
    "--btn-outline-hover-text": theme.outlineButtonHoverText,
    "--form-field-bg": theme.formFieldBg,
    "--form-field-selected-bg": theme.formFieldSelectedBg,
  } as React.CSSProperties;
}


function getPathKey(root: HTMLElement, target: HTMLElement): string | null {
  const path: number[] = [];
  let current: HTMLElement | null = target;

  while (current && current !== root) {
    const parentElement: HTMLElement | null = current.parentElement;
    if (!parentElement) return null;
    const index = Array.prototype.indexOf.call(parentElement.children, current);
    if (index < 0) return null;
    path.unshift(index);
    current = parentElement;
  }

  if (current !== root) return null;
  return path.join(".");
}

function getElementByPathKey(root: HTMLElement, key: string) {
  if (!key) return root;

  const indexes = key
    .split(".")
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v >= 0);

  let current: HTMLElement | null = root;
  for (const index of indexes) {
    if (!current || !current.children[index]) return null;
    current = current.children[index] as HTMLElement;
  }

  return current;
}

function setLiveTransform(element: HTMLElement, x: number, y: number) {
  const base = (element.style.transform || "").replace(/\s*translate\([^)]*\)/g, "").trim();
  element.style.transform = `${base} translate(${x}px, ${y}px)`.trim();
}

function findEditableTextNode(root: HTMLElement, target: HTMLElement) {
  let current: HTMLElement | null = target;
  while (current && current !== root) {
    if (current.closest(".constructor-chip")) {
      current = current.parentElement;
      continue;
    }

    if (
      current.matches("p,h1,h2,h3,h4,h5,h6,span,a,button,label,li,strong,em,small,b,i") &&
      current.childElementCount === 0 &&
      (current.textContent || "").trim().length > 0
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export default function InviteConstructor() {
  const [initialData] = useState(readInitialState);
  const [blocks, setBlocks] = useState<BuilderBlock[]>(initialData.blocks);
  const [layers, setLayers] = useState<BuilderLayer[]>(initialData.layers);
  const [blockOffsets, setBlockOffsets] = useState<Record<string, { x: number; y: number }>>(
    initialData.blockOffsets
  );
  const [layerOffsets, setLayerOffsets] = useState<Record<string, { x: number; y: number }>>(
    initialData.layerOffsets
  );
  const [photoOverrides, setPhotoOverrides] = useState<Record<string, string>>(
    initialData.photoOverrides
  );
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>(
    initialData.textOverrides
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    initialData.blocks[0]?.id ?? null
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialData.layers[0]?.id ?? null
  );
  const [newBlockType, setNewBlockType] = useState<BlockType>("message");
  const [newLayerSrc, setNewLayerSrc] = useState("/2.png");
  const [configDraft, setConfigDraft] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    kind: "block" | "layer";
    target: HTMLElement;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks, layers, blockOffsets, layerOffsets, photoOverrides, textOverrides }));
  }, [blocks, layers, blockOffsets, layerOffsets, photoOverrides, textOverrides]);

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId) ?? null;

  const sortedLayers = useMemo(
    () => [...layers].sort((a, b) => a.zIndex - b.zIndex),
    [layers]
  );

  const serializedConfig = useMemo(
    () => JSON.stringify({ blocks, layers, blockOffsets, layerOffsets, photoOverrides, textOverrides }, null, 2),
    [blocks, layers, blockOffsets, layerOffsets, photoOverrides, textOverrides]
  );


  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;

    Object.entries(photoOverrides).forEach(([key, src]) => {
      const node = getElementByPathKey(root, key);
      if (node instanceof HTMLImageElement) {
        node.src = src;
      }
    });

    Object.entries(textOverrides).forEach(([key, value]) => {
      const node = getElementByPathKey(root, key);
      if (node && !(node instanceof HTMLImageElement)) {
        node.textContent = value;
      }
    });
  }, [photoOverrides, textOverrides, blocks, layers]);

  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;

    const onMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      const x = drag.originX + dx;
      const y = drag.originY + dy;
      drag.moved = true;
      setLiveTransform(drag.target, x, y);
    };

    const onMouseUp = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      drag.target.style.outline = "";
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      const x = drag.originX + dx;
      const y = drag.originY + dy;

      if (drag.moved) {
        if (drag.kind === "block") {
          setBlockOffsets((prev) => ({ ...prev, [drag.id]: { x, y } }));
        } else {
          setLayerOffsets((prev) => ({ ...prev, [drag.id]: { x, y } }));
        }
      }

      dragRef.current = null;
    };

    const onMouseDown = (event: MouseEvent) => {
      if (!(event.ctrlKey || event.altKey)) return;
      const target = event.target as HTMLElement;
      if (!root.contains(target)) return;
      if (target.closest(".constructor-chip")) return;
      if (target.isContentEditable) return;

      const layerNode = target.closest(".constructor-layer") as HTMLElement | null;
      if (layerNode) {
        const id = layerNode.dataset.layerId;
        if (!id) return;
        const point = layerOffsets[id] || { x: 0, y: 0 };
        dragRef.current = {
          id,
          kind: "layer",
          startX: event.clientX,
          startY: event.clientY,
          originX: point.x,
          originY: point.y,
          target: layerNode,
          moved: false,
        };
        layerNode.style.outline = "2px dashed rgba(184,134,122,0.85)";
        event.preventDefault();
        return;
      }

      const blockNode = target.closest(".constructor-preview-block") as HTMLElement | null;
      if (blockNode) {
        const id = blockNode.dataset.blockId;
        if (!id) return;
        const point = blockOffsets[id] || { x: 0, y: 0 };
        dragRef.current = {
          id,
          kind: "block",
          startX: event.clientX,
          startY: event.clientY,
          originX: point.x,
          originY: point.y,
          target: blockNode,
          moved: false,
        };
        blockNode.style.outline = "2px dashed rgba(184,134,122,0.85)";
        event.preventDefault();
      }
    };

    const onDoubleClick = (event: MouseEvent) => {
      if (!(event.ctrlKey || event.altKey)) return;
      const target = event.target as HTMLElement;
      if (!root.contains(target)) return;

      if (event.altKey) {
        const imageNode = target.closest("img") as HTMLImageElement | null;
        if (imageNode) {
          const key = getPathKey(root, imageNode);
          if (!key) return;
          const currentSrc = imageNode.getAttribute("src") || imageNode.src;
          const next = window.prompt("Новый путь к изображению", currentSrc);
          if (next && next.trim()) {
            const src = next.trim();
            imageNode.src = src;
            setPhotoOverrides((prev) => ({ ...prev, [key]: src }));
          }
          event.preventDefault();
          return;
        }
      }

      if (event.ctrlKey) {
        const textNode = findEditableTextNode(root, target);
        if (!textNode) return;
        const key = getPathKey(root, textNode);
        if (!key) return;

        const oldOutline = textNode.style.outline;
        const initial = textNode.textContent || "";
        textNode.contentEditable = "true";
        textNode.spellcheck = false;
        textNode.style.outline = "2px solid rgba(184,134,122,0.95)";
        textNode.focus();

        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(textNode);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        const finish = (accept: boolean) => {
          textNode.contentEditable = "false";
          textNode.style.outline = oldOutline;
          textNode.removeEventListener("keydown", onKeyDown);
          textNode.removeEventListener("blur", onBlur);
          if (!accept) {
            textNode.textContent = initial;
            return;
          }

          const value = textNode.textContent || "";
          setTextOverrides((prev) => ({ ...prev, [key]: value }));
        };

        const onKeyDown = (keyEvent: KeyboardEvent) => {
          if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
            keyEvent.preventDefault();
            finish(true);
          }
          if (keyEvent.key === "Escape") {
            keyEvent.preventDefault();
            finish(false);
          }
        };

        const onBlur = () => finish(true);

        textNode.addEventListener("keydown", onKeyDown);
        textNode.addEventListener("blur", onBlur, { once: true });
        event.preventDefault();
      }

    };

    root.addEventListener("mousedown", onMouseDown);
    root.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      root.removeEventListener("mousedown", onMouseDown);
      root.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [blockOffsets, layerOffsets]);
  const addBlock = () => {
    const block = makeBlock(newBlockType);
    setBlocks((prev) => [...prev, block]);
    setSelectedBlockId(block.id);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const duplicateBlock = (id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index < 0) return prev;
      const source = prev[index];
      const copy: BuilderBlock = {
        ...source,
        id: makeId(source.type),
        theme: { ...source.theme },
        rsvpFields: { ...source.rsvpFields },
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      setSelectedBlockId(copy.id);
      return next;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => {
      const next = prev.filter((block) => block.id !== id);
      if (selectedBlockId === id) {
        setSelectedBlockId(next[0]?.id ?? null);
      }
      return next.length ? next : makeDefaultBlocks();
    });
    setBlockOffsets((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateSelectedTheme = <K extends keyof BlockTheme>(
    key: K,
    value: BlockTheme[K]
  ) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === selectedBlockId
          ? { ...block, theme: { ...block.theme, [key]: value } }
          : block
      )
    );
  };

  const updateRSVPField = (field: RSVPFieldKey, value: boolean) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === selectedBlockId
          ? { ...block, rsvpFields: { ...block.rsvpFields, [field]: value } }
          : block
      )
    );
  };

  const resetSelectedTheme = () => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === selectedBlockId ? { ...block, theme: { ...DEFAULT_THEME } } : block
      )
    );
  };

  const addLayer = () => {
    const src = newLayerSrc.trim() || "/1.png";
    const filename = src.split("/").pop() || "layer";
    const layer: BuilderLayer = {
      id: makeId("layer"),
      name: `Слой ${filename}`,
      src,
      x: 20,
      y: 20,
      width: 180,
      height: 180,
      rotate: 0,
      opacity: 0.45,
      zIndex: 21,
    };
    setLayers((prev) => [...prev, layer]);
    setSelectedLayerId(layer.id);
  };

  const moveLayer = (id: string, direction: "up" | "down") => {
    setLayers((prev) => {
      const index = prev.findIndex((layer) => layer.id === id);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => {
      const next = prev.filter((layer) => layer.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next[0]?.id ?? null);
      }
      return next;
    });
    setLayerOffsets((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateLayer = <K extends keyof BuilderLayer>(
    key: K,
    value: BuilderLayer[K]
  ) => {
    if (!selectedLayerId) return;
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === selectedLayerId ? { ...layer, [key]: value } : layer
      )
    );
  };

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(serializedConfig);
      setStatusMessage("JSON скопирован в буфер обмена.");
    } catch {
      setStatusMessage("Не удалось скопировать автоматически. Скопируйте JSON вручную.");
    }
  };

  const clearCanvasEdits = () => {
    setBlockOffsets({});
    setLayerOffsets({});
    setPhotoOverrides({});
    setTextOverrides({});
    setStatusMessage("Ручные правки холста сброшены.");
  };

  const applyConfig = () => {
    try {
      const imported = extractConfig(JSON.parse(configDraft));
      if (!imported.blocks.length) {
        setStatusMessage("В JSON нет валидных блоков.");
        return;
      }

      setBlocks(imported.blocks);
      setLayers(imported.layers);
      setBlockOffsets(imported.blockOffsets);
      setLayerOffsets(imported.layerOffsets);
      setPhotoOverrides(imported.photoOverrides);
      setTextOverrides(imported.textOverrides);
      setSelectedBlockId(imported.blocks[0]?.id ?? null);
      setSelectedLayerId(imported.layers[0]?.id ?? null);
      setStatusMessage("Конфиг применен.");
    } catch {
      setStatusMessage("Некорректный JSON.");
    }
  };

  const renderBlock = (block: BuilderBlock) => {
    if (block.type === "hero") return <Hero />;
    if (block.type === "message") return <Message />;
    if (block.type === "venue") return <Venue />;
    if (block.type === "timeline") return <Timeline />;
    if (block.type === "dresscode") return <DressCode />;
    if (block.type === "contacts") return <Contacts />;
    if (block.type === "final") return <Final />;

    return (
      <RSVPForm
        builderMode
        hiddenFields={{
          name: !block.rsvpFields.name,
          attendance: !block.rsvpFields.attendance,
          children: !block.rsvpFields.children,
          drinks: !block.rsvpFields.drinks,
          food: !block.rsvpFields.food,
        }}
      />
    );
  };

  return (
    <div className="constructor-layout">
      <aside className="constructor-sidebar">
        <div className="constructor-card">
          <h1>Конструктор приглашения</h1>
          <p>
            База: дизайн из <code>wedding-invite</code> и <code>wedding-invite-2</code>.
            Здесь вы можете собирать страницу по блокам и редактировать стили.
          </p>
        </div>

        <div className="constructor-card constructor-card--hint">
          <h2>Управление на холсте</h2>
          <p className="constructor-muted">
            <b>Ctrl + drag</b> или <b>Alt + drag</b> двигает блоки и PNG/SVG слои.
          </p>
          <p className="constructor-muted">
            <b>Ctrl + double click</b> по тексту включает редактирование. Enter - сохранить, Esc - отмена.
          </p>
          <p className="constructor-muted">
            <b>Alt + double click</b> по картинке меняет путь к изображению.
          </p>
          <button className="constructor-btn" onClick={clearCanvasEdits}>
            Сбросить ручные правки холста
          </button>
        </div>

        <div className="constructor-card">
          <h2>Блоки</h2>
          <label className="constructor-label">Добавить блок</label>
          <div className="constructor-row">
            <select
              className="constructor-select"
              value={newBlockType}
              onChange={(e) => setNewBlockType(e.target.value as BlockType)}
            >
              {Object.entries(BLOCK_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button className="constructor-btn constructor-btn--primary" onClick={addBlock}>
              + Добавить
            </button>
          </div>

          <div className="constructor-list">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`constructor-item ${selectedBlockId === block.id ? "is-active" : ""}`}
              >
                <button
                  className="constructor-item__main"
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  {index + 1}. {BLOCK_LABELS[block.type]}
                </button>
                <div className="constructor-item__actions">
                  <button onClick={() => moveBlock(block.id, "up")}>↑</button>
                  <button onClick={() => moveBlock(block.id, "down")}>↓</button>
                  <button onClick={() => duplicateBlock(block.id)}>⧉</button>
                  <button onClick={() => removeBlock(block.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedBlock && (
          <div className="constructor-card">
            <h2>Стиль блока</h2>
            <p className="constructor-muted">{BLOCK_LABELS[selectedBlock.type]}</p>
            <div className="constructor-grid">
              <label>
                Текст основной
                <input
                  type="color"
                  value={selectedBlock.theme.textDark}
                  onChange={(e) => updateSelectedTheme("textDark", e.target.value)}
                />
              </label>
              <label>
                Текст вторичный
                <input
                  type="color"
                  value={selectedBlock.theme.textMid}
                  onChange={(e) => updateSelectedTheme("textMid", e.target.value)}
                />
              </label>
              <label>
                Акцент
                <input
                  type="color"
                  value={selectedBlock.theme.dustyRose}
                  onChange={(e) => {
                    const color = e.target.value;
                    updateSelectedTheme("dustyRose", color);
                    updateSelectedTheme("buttonBg", color);
                    updateSelectedTheme("outlineButtonText", color);
                    updateSelectedTheme("outlineButtonBorder", color);
                  }}
                />
              </label>
              <label>
                Кнопка фон
                <input
                  type="color"
                  value={selectedBlock.theme.buttonBg}
                  onChange={(e) => updateSelectedTheme("buttonBg", e.target.value)}
                />
              </label>
              <label>
                Кнопка текст
                <input
                  type="color"
                  value={selectedBlock.theme.buttonText}
                  onChange={(e) => updateSelectedTheme("buttonText", e.target.value)}
                />
              </label>
              <label>
                Поля форма (граница)
                <input
                  type="color"
                  value={selectedBlock.theme.champagne}
                  onChange={(e) => updateSelectedTheme("champagne", e.target.value)}
                />
              </label>
              <label>
                Поля форма (фон)
                <input
                  type="color"
                  value={selectedBlock.theme.formFieldBg}
                  onChange={(e) => updateSelectedTheme("formFieldBg", e.target.value)}
                />
              </label>
              <label>
                Поля форма (актив)
                <input
                  type="color"
                  value={selectedBlock.theme.formFieldSelectedBg}
                  onChange={(e) => updateSelectedTheme("formFieldSelectedBg", e.target.value)}
                />
              </label>
            </div>

            <button className="constructor-btn" onClick={resetSelectedTheme}>
              Сбросить стиль блока
            </button>

            {selectedBlock.type === "rsvp" && (
              <div className="constructor-toggle-list">
                <h3>Поля формы RSVP</h3>
                {(Object.keys(DEFAULT_RSVP_FIELDS) as RSVPFieldKey[]).map((field) => (
                  <label key={field} className="constructor-toggle">
                    <input
                      type="checkbox"
                      checked={selectedBlock.rsvpFields[field]}
                      onChange={(e) => updateRSVPField(field, e.target.checked)}
                    />
                    {field}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="constructor-card">
          <h2>Слои PNG / SVG</h2>
          <label className="constructor-label">Источник слоя</label>
          <div className="constructor-row">
            <input
              className="constructor-input"
              value={newLayerSrc}
              onChange={(e) => setNewLayerSrc(e.target.value)}
              placeholder="/1.png или /icons/flower.svg"
            />
            <button className="constructor-btn constructor-btn--primary" onClick={addLayer}>
              + Слой
            </button>
          </div>

          <div className="constructor-list">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className={`constructor-item ${selectedLayerId === layer.id ? "is-active" : ""}`}
              >
                <button
                  className="constructor-item__main"
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  {index + 1}. {layer.name}
                </button>
                <div className="constructor-item__actions">
                  <button onClick={() => moveLayer(layer.id, "up")}>↑</button>
                  <button onClick={() => moveLayer(layer.id, "down")}>↓</button>
                  <button onClick={() => removeLayer(layer.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {selectedLayer && (
            <div className="constructor-grid constructor-grid--layer">
              <label>
                Название
                <input
                  className="constructor-input"
                  value={selectedLayer.name}
                  onChange={(e) => updateLayer("name", e.target.value)}
                />
              </label>
              <label>
                Путь
                <input
                  className="constructor-input"
                  value={selectedLayer.src}
                  onChange={(e) => updateLayer("src", e.target.value)}
                />
              </label>
              <label>
                X
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.x}
                  onChange={(e) => updateLayer("x", Number(e.target.value))}
                />
              </label>
              <label>
                Y
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.y}
                  onChange={(e) => updateLayer("y", Number(e.target.value))}
                />
              </label>
              <label>
                Ширина
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.width}
                  onChange={(e) => updateLayer("width", Number(e.target.value))}
                />
              </label>
              <label>
                Высота
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.height}
                  onChange={(e) => updateLayer("height", Number(e.target.value))}
                />
              </label>
              <label>
                Наклон (deg)
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.rotate}
                  onChange={(e) => updateLayer("rotate", Number(e.target.value))}
                />
              </label>
              <label>
                Прозрачность (0..1)
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  className="constructor-input"
                  value={selectedLayer.opacity}
                  onChange={(e) => updateLayer("opacity", Number(e.target.value))}
                />
              </label>
              <label>
                Слой z-index
                <input
                  type="number"
                  className="constructor-input"
                  value={selectedLayer.zIndex}
                  onChange={(e) => updateLayer("zIndex", Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>

        <div className="constructor-card">
          <h2>JSON конфиг</h2>
          <div className="constructor-row">
            <button className="constructor-btn" onClick={copyConfig}>
              Скопировать текущий JSON
            </button>
          </div>
          <textarea
            className="constructor-textarea"
            placeholder="Вставьте JSON и нажмите Применить JSON"
            value={configDraft}
            onChange={(e) => setConfigDraft(e.target.value)}
          />
          <button className="constructor-btn constructor-btn--primary" onClick={applyConfig}>
            Применить JSON
          </button>
          <details>
            <summary>Показать текущий JSON</summary>
            <pre className="constructor-pre">{serializedConfig}</pre>
          </details>
          {statusMessage && <p className="constructor-status">{statusMessage}</p>}
        </div>
      </aside>

      <section className="constructor-preview">
        <main className="page-bg constructor-page-bg">
          <div className="ribbon-wrap">
            <div className="ribbon constructor-ribbon-canvas" ref={previewRef}>
              <p className="constructor-gesture-hint">
                Ctrl/Alt + drag: двигать. Ctrl + double click: редактировать текст. Alt + double click: сменить фото.
              </p>

              {blocks.map((block, index) => {
                const blockOffset = blockOffsets[block.id] || { x: 0, y: 0 };

                return (
                  <div
                    key={block.id}
                    data-block-id={block.id}
                    className={`constructor-preview-block ${
                      selectedBlockId === block.id ? "is-selected" : ""
                    }`}
                    style={{
                      ...blockToCssVars(block.theme),
                      transform: `translate(${blockOffset.x}px, ${blockOffset.y}px)`,
                    }}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <button
                      className="constructor-chip"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlockId(block.id);
                      }}
                    >
                      {index + 1}. {BLOCK_LABELS[block.type]}
                    </button>
                    {renderBlock(block)}
                  </div>
                );
              })}

              <div className="constructor-layer-canvas" aria-hidden>
                {sortedLayers.map((layer) => {
                  const layerOffset = layerOffsets[layer.id] || { x: 0, y: 0 };

                  return (
                    <img
                      key={layer.id}
                      data-layer-id={layer.id}
                      src={layer.src}
                      alt={layer.name}
                      className={`constructor-layer ${
                        selectedLayerId === layer.id ? "is-selected" : ""
                      }`}
                      onClick={() => setSelectedLayerId(layer.id)}
                      style={{
                        left: layer.x + layerOffset.x,
                        top: layer.y + layerOffset.y,
                        width: layer.width,
                        height: layer.height,
                        transform: `rotate(${layer.rotate}deg)`,
                        opacity: layer.opacity,
                        zIndex: layer.zIndex,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

