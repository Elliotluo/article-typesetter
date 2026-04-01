const { Plugin, PluginSettingTab, Setting, Modal, Notice, MarkdownView } = require("obsidian");

const DEFAULT_SETTINGS = {
  titleStyle: {
    fontSize: 26,
    color: "#111111",
    textAlign: "center",
    sidePadding: 32,
    lineHeight: 1.5,
    marginTop: 28,
    marginBottom: 18,
    fontWeight: "700"
  },
  bodyStyle: {
    fontSize: 16,
    color: "#2B2B2B",
    textAlign: "justify",
    sidePadding: 32,
    lineHeight: 1.9,
    marginTop: 10,
    marginBottom: 18,
    fontWeight: "400"
  },
  imageStyle: {
    maxWidth: 100,
    sidePadding: 32,
    marginTop: 18,
    marginBottom: 18
  },
  presets: []
};

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function normalizeHexColor(value, fallback) {
  const normalized = String(value || "").trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(normalized) ? normalized : fallback;
}

function normalizeAlign(value, fallback) {
  const allowed = new Set(["left", "center", "right", "justify"]);
  return allowed.has(value) ? value : fallback;
}

function normalizePresetName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
}

function normalizePresets(items) {
  const source = Array.isArray(items) ? items : [];
  const seen = new Set();
  const result = [];

  for (const item of source) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const name = normalizePresetName(item.name);
    if (!name || seen.has(name)) {
      continue;
    }
    seen.add(name);
    result.push({
      name,
      titleStyle: {
        fontSize: clampNumber(item.titleStyle && item.titleStyle.fontSize, DEFAULT_SETTINGS.titleStyle.fontSize, 12, 40),
        color: normalizeHexColor(item.titleStyle && item.titleStyle.color, DEFAULT_SETTINGS.titleStyle.color),
        textAlign: normalizeAlign(item.titleStyle && item.titleStyle.textAlign, DEFAULT_SETTINGS.titleStyle.textAlign),
        sidePadding: clampNumber(item.titleStyle && item.titleStyle.sidePadding, DEFAULT_SETTINGS.titleStyle.sidePadding, 0, 80),
        lineHeight: clampNumber(item.titleStyle && item.titleStyle.lineHeight, DEFAULT_SETTINGS.titleStyle.lineHeight, 1, 3),
        marginTop: clampNumber(item.titleStyle && item.titleStyle.marginTop, DEFAULT_SETTINGS.titleStyle.marginTop, 0, 80),
        marginBottom: clampNumber(item.titleStyle && item.titleStyle.marginBottom, DEFAULT_SETTINGS.titleStyle.marginBottom, 0, 80),
        fontWeight: String((item.titleStyle && item.titleStyle.fontWeight) || DEFAULT_SETTINGS.titleStyle.fontWeight)
      },
      bodyStyle: {
        fontSize: clampNumber(item.bodyStyle && item.bodyStyle.fontSize, DEFAULT_SETTINGS.bodyStyle.fontSize, 12, 40),
        color: normalizeHexColor(item.bodyStyle && item.bodyStyle.color, DEFAULT_SETTINGS.bodyStyle.color),
        textAlign: normalizeAlign(item.bodyStyle && item.bodyStyle.textAlign, DEFAULT_SETTINGS.bodyStyle.textAlign),
        sidePadding: clampNumber(item.bodyStyle && item.bodyStyle.sidePadding, DEFAULT_SETTINGS.bodyStyle.sidePadding, 0, 80),
        lineHeight: clampNumber(item.bodyStyle && item.bodyStyle.lineHeight, DEFAULT_SETTINGS.bodyStyle.lineHeight, 1, 3),
        marginTop: clampNumber(item.bodyStyle && item.bodyStyle.marginTop, DEFAULT_SETTINGS.bodyStyle.marginTop, 0, 80),
        marginBottom: clampNumber(item.bodyStyle && item.bodyStyle.marginBottom, DEFAULT_SETTINGS.bodyStyle.marginBottom, 0, 80),
        fontWeight: String((item.bodyStyle && item.bodyStyle.fontWeight) || DEFAULT_SETTINGS.bodyStyle.fontWeight)
      },
      imageStyle: {
        maxWidth: clampNumber(item.imageStyle && item.imageStyle.maxWidth, DEFAULT_SETTINGS.imageStyle.maxWidth, 20, 100),
        sidePadding: clampNumber(item.imageStyle && item.imageStyle.sidePadding, DEFAULT_SETTINGS.imageStyle.sidePadding, 0, 80),
        marginTop: clampNumber(item.imageStyle && item.imageStyle.marginTop, DEFAULT_SETTINGS.imageStyle.marginTop, 0, 80),
        marginBottom: clampNumber(item.imageStyle && item.imageStyle.marginBottom, DEFAULT_SETTINGS.imageStyle.marginBottom, 0, 80)
      }
    });
  }

  return result.slice(0, 12);
}

function normalizeSettings(input) {
  const source = input || {};
  return {
    titleStyle: {
      fontSize: clampNumber(source.titleStyle && source.titleStyle.fontSize, DEFAULT_SETTINGS.titleStyle.fontSize, 12, 40),
      color: normalizeHexColor(source.titleStyle && source.titleStyle.color, DEFAULT_SETTINGS.titleStyle.color),
      textAlign: normalizeAlign(source.titleStyle && source.titleStyle.textAlign, DEFAULT_SETTINGS.titleStyle.textAlign),
      sidePadding: clampNumber(source.titleStyle && source.titleStyle.sidePadding, DEFAULT_SETTINGS.titleStyle.sidePadding, 0, 80),
      lineHeight: clampNumber(source.titleStyle && source.titleStyle.lineHeight, DEFAULT_SETTINGS.titleStyle.lineHeight, 1, 3),
      marginTop: clampNumber(source.titleStyle && source.titleStyle.marginTop, DEFAULT_SETTINGS.titleStyle.marginTop, 0, 80),
      marginBottom: clampNumber(source.titleStyle && source.titleStyle.marginBottom, DEFAULT_SETTINGS.titleStyle.marginBottom, 0, 80),
      fontWeight: String((source.titleStyle && source.titleStyle.fontWeight) || DEFAULT_SETTINGS.titleStyle.fontWeight)
    },
    bodyStyle: {
      fontSize: clampNumber(source.bodyStyle && source.bodyStyle.fontSize, DEFAULT_SETTINGS.bodyStyle.fontSize, 12, 40),
      color: normalizeHexColor(source.bodyStyle && source.bodyStyle.color, DEFAULT_SETTINGS.bodyStyle.color),
      textAlign: normalizeAlign(source.bodyStyle && source.bodyStyle.textAlign, DEFAULT_SETTINGS.bodyStyle.textAlign),
      sidePadding: clampNumber(source.bodyStyle && source.bodyStyle.sidePadding, DEFAULT_SETTINGS.bodyStyle.sidePadding, 0, 80),
      lineHeight: clampNumber(source.bodyStyle && source.bodyStyle.lineHeight, DEFAULT_SETTINGS.bodyStyle.lineHeight, 1, 3),
      marginTop: clampNumber(source.bodyStyle && source.bodyStyle.marginTop, DEFAULT_SETTINGS.bodyStyle.marginTop, 0, 80),
      marginBottom: clampNumber(source.bodyStyle && source.bodyStyle.marginBottom, DEFAULT_SETTINGS.bodyStyle.marginBottom, 0, 80),
      fontWeight: String((source.bodyStyle && source.bodyStyle.fontWeight) || DEFAULT_SETTINGS.bodyStyle.fontWeight)
    },
    imageStyle: {
      maxWidth: clampNumber(source.imageStyle && source.imageStyle.maxWidth, DEFAULT_SETTINGS.imageStyle.maxWidth, 20, 100),
      sidePadding: clampNumber(source.imageStyle && source.imageStyle.sidePadding, DEFAULT_SETTINGS.imageStyle.sidePadding, 0, 80),
      marginTop: clampNumber(source.imageStyle && source.imageStyle.marginTop, DEFAULT_SETTINGS.imageStyle.marginTop, 0, 80),
      marginBottom: clampNumber(source.imageStyle && source.imageStyle.marginBottom, DEFAULT_SETTINGS.imageStyle.marginBottom, 0, 80)
    },
    presets: normalizePresets(source.presets)
  };
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInlineMarkdown(line) {
  let html = escapeHtml(line);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  return html;
}

function parseMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) {
      return;
    }
    blocks.push({
      type: "paragraph",
      text: paragraph.join("<br>")
    });
    paragraph = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^#\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: "heading", text: applyInlineMarkdown(heading[1].trim()) });
      continue;
    }

    const image = line.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (image) {
      flushParagraph();
      blocks.push({ type: "image", alt: image[1].trim(), src: image[2].trim() });
      continue;
    }

    const wikiImage = line.match(/^!\[\[(.+?)\]\]$/);
    if (wikiImage) {
      flushParagraph();
      const raw = wikiImage[1].trim();
      const parts = raw.split("|");
      const target = String(parts[0] || "").trim();
      const alt = parts.length > 1 ? String(parts[parts.length - 1] || "").trim() : "";
      blocks.push({ type: "wikiImage", target, alt });
      continue;
    }

    paragraph.push(applyInlineMarkdown(line));
  }

  flushParagraph();
  return blocks;
}

function styleToString(style) {
  return Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}

function renderHeading(block, style) {
  const sidePadding = Number(style.sidePadding) || 0;
  const contentWidth = sidePadding > 0 ? `calc(100% - ${sidePadding * 2}px)` : "100%";
  return [
    `<section style="${styleToString({
      "margin-top": `${style.marginTop}px`,
      "margin-bottom": `${style.marginBottom}px`,
      "margin-left": `${sidePadding}px`,
      "margin-right": `${sidePadding}px`,
      "text-align": style.textAlign,
      "box-sizing": "border-box",
      width: contentWidth
    })}">`,
    `<span style="${styleToString({
      display: "block",
      width: contentWidth,
      "box-sizing": "border-box",
      "white-space": "pre-wrap",
      color: style.color,
      "font-size": `${style.fontSize}px`,
      "line-height": style.lineHeight,
      "font-weight": style.fontWeight
    })}">${block.text}</span>`,
    "</section>"
  ].join("");
}

function renderParagraph(block, style) {
  const sidePadding = Number(style.sidePadding) || 0;
  const contentWidth = sidePadding > 0 ? `calc(100% - ${sidePadding * 2}px)` : "100%";
  return [
    `<p style="${styleToString({
      "margin-top": `${style.marginTop}px`,
      "margin-bottom": `${style.marginBottom}px`,
      "margin-left": `${sidePadding}px`,
      "margin-right": `${sidePadding}px`,
      "text-align": style.textAlign,
      "box-sizing": "border-box",
      width: contentWidth
    })}">`,
    `<span style="${styleToString({
      display: "block",
      width: contentWidth,
      "box-sizing": "border-box",
      "white-space": "pre-wrap",
      color: style.color,
      "font-size": `${style.fontSize}px`,
      "line-height": style.lineHeight,
      "font-weight": style.fontWeight
    })}">${block.text}</span>`,
    "</p>"
  ].join("");
}

function renderImage(block, style) {
  const sidePadding = Number(style.sidePadding) || 0;
  return [
    `<section style="${styleToString({
      "margin-top": `${style.marginTop}px`,
      "margin-bottom": `${style.marginBottom}px`,
      "text-align": "justify",
      "padding-left": `${sidePadding}px`,
      "padding-right": `${sidePadding}px`,
      "box-sizing": "border-box"
    })}">`,
    `<div style="${styleToString({
      "text-align": "center"
    })}">`,
    `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" style="${styleToString({
      display: "inline-block",
      "max-width": `${style.maxWidth}%`,
      width: "auto",
      height: "auto"
    })}">`,
    "</div>",
    "</section>"
  ].join("");
}

function extensionToMime(path) {
  const lower = String(path || "").toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".bmp")) return "image/bmp";
  return "application/octet-stream";
}

function isRemoteOrDataUrl(src) {
  const value = String(src || "").trim();
  return /^https?:\/\//i.test(value) || /^data:/i.test(value);
}

async function resolveObsidianImageSrc(plugin, rawSrc, sourceFilePath) {
  const src = String(rawSrc || "").trim();
  if (!src) {
    return "";
  }
  if (isRemoteOrDataUrl(src)) {
    return src;
  }

  const file = plugin.app.metadataCache.getFirstLinkpathDest(src, sourceFilePath || "");
  if (!file) {
    return src;
  }

  try {
    const binary = await plugin.app.vault.readBinary(file);
    const mime = extensionToMime(file.path);
    const base64 = Buffer.from(binary).toString("base64");
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    return src;
  }
}

async function convertMarkdownToHtml(markdown, settings, plugin, sourceFilePath) {
  const blocks = parseMarkdown(markdown);
  const normalized = normalizeSettings(settings);
  const htmlBlocks = [];

  for (const block of blocks) {
    if (block.type === "heading") {
      htmlBlocks.push(renderHeading(block, normalized.titleStyle));
      continue;
    }
    if (block.type === "image") {
      const resolvedSrc = await resolveObsidianImageSrc(plugin, block.src, sourceFilePath);
      htmlBlocks.push(renderImage({ type: "image", alt: block.alt, src: resolvedSrc }, normalized.imageStyle));
      continue;
    }
    if (block.type === "wikiImage") {
      const resolvedSrc = await resolveObsidianImageSrc(plugin, block.target, sourceFilePath);
      htmlBlocks.push(renderImage({ type: "image", alt: block.alt, src: resolvedSrc }, normalized.imageStyle));
      continue;
    }
    htmlBlocks.push(renderParagraph(block, normalized.bodyStyle));
  }

  const html = htmlBlocks.join("\n");

  return {
    html,
    blocks
  };
}

function getPlainTextFromHtml(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.innerText || container.textContent || "";
}

class FormatterModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.currentHtml = "";
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("article-typesetter-modal");

    this.setTitle("Article Typesetter");

    const toolbar = contentEl.createDiv({ cls: "article-typesetter-toolbar" });
    const loadButton = toolbar.createEl("button", { text: "加载当前笔记" });
    const generateButton = toolbar.createEl("button", { text: "生成预览" });
    const copyButton = toolbar.createEl("button", { text: "复制富文本" });
    copyButton.addClass("mod-cta");

    const inputLabel = contentEl.createEl("p", { text: "Markdown 输入" });
    inputLabel.addClass("article-typesetter-label");

    const input = contentEl.createEl("textarea");
    input.addClass("article-typesetter-input");

    const previewLabel = contentEl.createEl("p", { text: "预览" });
    previewLabel.addClass("article-typesetter-label");

    const preview = contentEl.createDiv({ cls: "article-typesetter-preview markdown-rendered" });

    const status = contentEl.createDiv({ cls: "article-typesetter-status" });

    const loadCurrent = async () => {
      const context = await this.plugin.getActiveMarkdownContext();
      const markdown = context.markdown;
      if (!markdown.trim()) {
        status.setText("未读取到当前笔记内容。");
        return;
      }
      input.value = markdown;
      status.setText("已加载当前笔记。");
      await this.generate(input.value, preview, status, context.sourceFilePath);
    };

    loadButton.addEventListener("click", () => {
      loadCurrent();
    });

    generateButton.addEventListener("click", async () => {
      const context = await this.plugin.getActiveMarkdownContext();
      await this.generate(input.value, preview, status, context.sourceFilePath);
    });

    copyButton.addEventListener("click", async () => {
      if (!this.currentHtml.trim()) {
        const context = await this.plugin.getActiveMarkdownContext();
        await this.generate(input.value, preview, status, context.sourceFilePath);
      }
      if (!this.currentHtml.trim()) {
        status.setText("请先输入或加载 Markdown 内容。");
        return;
      }

      const ok = await this.plugin.copyRichText(this.currentHtml);
      status.setText(ok ? "富文本已复制。" : "复制失败，请检查 Obsidian 权限。");
    });

    await loadCurrent();
  }

  async generate(markdown, previewEl, statusEl, sourceFilePath) {
    const source = String(markdown || "").trim();
    if (!source) {
      this.currentHtml = "";
      previewEl.empty();
      statusEl.setText("请输入 Markdown。");
      return;
    }

    const result = await convertMarkdownToHtml(source, this.plugin.settings, this.plugin, sourceFilePath);
    this.currentHtml = result.html;
    previewEl.innerHTML = result.html;
    statusEl.setText("预览已生成，可直接复制富文本。");
  }
}

module.exports = class ArticleTypesetterPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "copy-current-note-rich-text",
      name: "复制当前笔记为富文本",
      callback: async () => {
        const context = await this.getActiveMarkdownContext();
        const markdown = context.markdown;
        if (!markdown.trim()) {
          new Notice("没有读取到当前笔记内容。");
          return;
        }

        const result = await convertMarkdownToHtml(markdown, this.settings, this, context.sourceFilePath);
        const ok = await this.copyRichText(result.html);
        new Notice(ok ? "富文本已复制。" : "复制失败，请检查 Obsidian 权限。");
      }
    });

    this.addCommand({
      id: "open-typesetter-workbench",
      name: "打开排版工作台",
      callback: () => {
        new FormatterModal(this.app, this).open();
      }
    });

    this.addRibbonIcon("copy", "复制当前笔记为富文本", async () => {
      await this.app.commands.executeCommandById("article-typesetter:copy-current-note-rich-text");
    });

    this.addSettingTab(new ArticleTypesetterSettingTab(this.app, this));
  }

  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = normalizeSettings(Object.assign({}, DEFAULT_SETTINGS, loaded || {}));
  }

  async saveSettings() {
    this.settings = normalizeSettings(this.settings);
    await this.saveData(this.settings);
  }

  async getActiveMarkdownContext() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view && view.editor) {
      const file = view.file || this.app.workspace.getActiveFile();
      return {
        markdown: view.editor.getValue(),
        sourceFilePath: file ? file.path : ""
      };
    }

    const file = this.app.workspace.getActiveFile();
    if (file) {
      try {
        return {
          markdown: await this.app.vault.cachedRead(file),
          sourceFilePath: file.path
        };
      } catch (error) {
        return { markdown: "", sourceFilePath: "" };
      }
    }

    return { markdown: "", sourceFilePath: "" };
  }

  async copyRichText(html) {
    const wrappedHtml = [
      "<!doctype html>",
      "<html><head><meta charset=\"utf-8\"></head><body>",
      html,
      "</body></html>"
    ].join("");

    const text = getPlainTextFromHtml(html);

    try {
      if (window.require) {
        const { clipboard } = window.require("electron");
        clipboard.write({ html: wrappedHtml, text });
        return true;
      }
    } catch (error) {
      // Electron fallback failed, try web clipboard.
    }

    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const item = new ClipboardItem({
          "text/html": new Blob([wrappedHtml], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }
};

class ArticleTypesetterSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Article Typesetter 设置" });
    containerEl.createEl("h3", { text: "样式预设" });

    let presetNameInput = "";
    let selectedPresetName = this.plugin.settings.presets[0] ? this.plugin.settings.presets[0].name : "";

    new Setting(containerEl)
      .setName("保存当前样式为预设")
      .setDesc("输入预设名后保存，重复名称会覆盖。")
      .addText((text) => {
        text
          .setPlaceholder("例如：科技资讯风格")
          .setValue("")
          .onChange((value) => {
            presetNameInput = value;
          });
      })
      .addButton((button) => {
        button.setButtonText("保存").onClick(async () => {
          const name = normalizePresetName(presetNameInput);
          if (!name) {
            new Notice("请先输入预设名称。");
            return;
          }

          const nextPreset = {
            name,
            titleStyle: Object.assign({}, this.plugin.settings.titleStyle),
            bodyStyle: Object.assign({}, this.plugin.settings.bodyStyle),
            imageStyle: Object.assign({}, this.plugin.settings.imageStyle)
          };

          const filtered = this.plugin.settings.presets.filter((item) => item.name !== name);
          this.plugin.settings.presets = normalizePresets([nextPreset].concat(filtered));
          await this.plugin.saveSettings();
          new Notice(`已保存预设：${name}`);
          this.display();
        });
      });

    new Setting(containerEl)
      .setName("应用样式预设")
      .setDesc("选择一个已保存预设并应用到当前样式。")
      .addDropdown((dropdown) => {
        dropdown.addOption("", "请选择预设");
        this.plugin.settings.presets.forEach((preset) => dropdown.addOption(preset.name, preset.name));
        dropdown.setValue(selectedPresetName).onChange((value) => {
          selectedPresetName = value;
        });
      })
      .addButton((button) => {
        button.setButtonText("应用").onClick(async () => {
          const preset = this.plugin.settings.presets.find((item) => item.name === selectedPresetName);
          if (!preset) {
            new Notice("请先选择一个预设。");
            return;
          }
          this.plugin.settings.titleStyle = Object.assign({}, preset.titleStyle);
          this.plugin.settings.bodyStyle = Object.assign({}, preset.bodyStyle);
          this.plugin.settings.imageStyle = Object.assign({}, preset.imageStyle);
          await this.plugin.saveSettings();
          new Notice(`已应用预设：${preset.name}`);
          this.display();
        });
      });

    new Setting(containerEl)
      .setName("删除样式预设")
      .setDesc("删除当前选择的预设。")
      .addDropdown((dropdown) => {
        dropdown.addOption("", "请选择预设");
        this.plugin.settings.presets.forEach((preset) => dropdown.addOption(preset.name, preset.name));
        dropdown.setValue(selectedPresetName).onChange((value) => {
          selectedPresetName = value;
        });
      })
      .addButton((button) => {
        button.setButtonText("删除").onClick(async () => {
          if (!selectedPresetName) {
            new Notice("请先选择要删除的预设。");
            return;
          }
          const before = this.plugin.settings.presets.length;
          this.plugin.settings.presets = this.plugin.settings.presets.filter((item) => item.name !== selectedPresetName);
          if (this.plugin.settings.presets.length === before) {
            new Notice("未找到对应预设。");
            return;
          }
          await this.plugin.saveSettings();
          new Notice(`已删除预设：${selectedPresetName}`);
          this.display();
        });
      });

    containerEl.createEl("h3", { text: "样式参数" });

    this.addNumberSetting(containerEl, "标题字号", this.plugin.settings.titleStyle.fontSize, async (value) => {
      this.plugin.settings.titleStyle.fontSize = value;
    }, 12, 40);

    this.addTextSetting(containerEl, "标题颜色", this.plugin.settings.titleStyle.color, async (value) => {
      this.plugin.settings.titleStyle.color = value;
    }, "#111111");

    this.addSelectSetting(containerEl, "标题对齐", this.plugin.settings.titleStyle.textAlign, ["left", "center", "right", "justify"], async (value) => {
      this.plugin.settings.titleStyle.textAlign = value;
    });

    this.addNumberSetting(containerEl, "标题缩进(px)", this.plugin.settings.titleStyle.sidePadding, async (value) => {
      this.plugin.settings.titleStyle.sidePadding = value;
    }, 0, 80);

    this.addNumberSetting(containerEl, "正文字号", this.plugin.settings.bodyStyle.fontSize, async (value) => {
      this.plugin.settings.bodyStyle.fontSize = value;
    }, 12, 40);

    this.addTextSetting(containerEl, "正文颜色", this.plugin.settings.bodyStyle.color, async (value) => {
      this.plugin.settings.bodyStyle.color = value;
    }, "#2B2B2B");

    this.addSelectSetting(containerEl, "正文对齐", this.plugin.settings.bodyStyle.textAlign, ["justify", "left", "center", "right"], async (value) => {
      this.plugin.settings.bodyStyle.textAlign = value;
    });

    this.addNumberSetting(containerEl, "正文缩进(px)", this.plugin.settings.bodyStyle.sidePadding, async (value) => {
      this.plugin.settings.bodyStyle.sidePadding = value;
    }, 0, 80);

    this.addNumberSetting(containerEl, "图片宽度(%)", this.plugin.settings.imageStyle.maxWidth, async (value) => {
      this.plugin.settings.imageStyle.maxWidth = value;
    }, 20, 100);

    this.addNumberSetting(containerEl, "图片缩进(px)", this.plugin.settings.imageStyle.sidePadding, async (value) => {
      this.plugin.settings.imageStyle.sidePadding = value;
    }, 0, 80);

  }

  addNumberSetting(containerEl, name, value, onChange, min, max) {
    new Setting(containerEl)
      .setName(name)
      .addText((text) => {
        text
          .setValue(String(value))
          .onChange(async (raw) => {
            const next = clampNumber(raw, value, min, max);
            await onChange(next);
            await this.plugin.saveSettings();
          });
      });
  }

  addTextSetting(containerEl, name, value, onChange, placeholder) {
    new Setting(containerEl)
      .setName(name)
      .addText((text) => {
        text
          .setPlaceholder(placeholder)
          .setValue(value)
          .onChange(async (next) => {
            await onChange(next);
            await this.plugin.saveSettings();
          });
      });
  }

  addSelectSetting(containerEl, name, value, options, onChange) {
    new Setting(containerEl)
      .setName(name)
      .addDropdown((dropdown) => {
        options.forEach((option) => dropdown.addOption(option, option));
        dropdown.setValue(value).onChange(async (next) => {
          await onChange(next);
          await this.plugin.saveSettings();
        });
      });
  }
}
