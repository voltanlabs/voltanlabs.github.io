/* VoltanLabs Gif Forge - app.js
   Requires:
   - gif.js.optimized loaded in index.html
   - gif.worker.js placed locally at: gif-forge/gif.worker.js
*/

(() => {
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  const frameCountEl = document.getElementById("frameCount");
  const frameListEl = document.getElementById("frameList");

  const clearBtn = document.getElementById("clearBtn");
  const moveUpBtn = document.getElementById("moveUpBtn");
  const moveDownBtn = document.getElementById("moveDownBtn");

  const previewCanvas = document.getElementById("previewCanvas");
  const ctx = previewCanvas.getContext("2d", { alpha: true });

  const playBtn = document.getElementById("playBtn");
  const stopBtn = document.getElementById("stopBtn");

  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const delayInput = document.getElementById("delayInput");
  const qualityInput = document.getElementById("qualityInput");
  const loopInput = document.getElementById("loopInput");
  const transparentInput = document.getElementById("transparentInput");
  const filenameInput = document.getElementById("filenameInput");

  const exportBtn = document.getElementById("exportBtn");
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");

  const resultArea = document.getElementById("resultArea");
  const resultImg = document.getElementById("resultImg");
  const downloadLink = document.getElementById("downloadLink");

  if (!fileInput || !dropZone || !previewCanvas) {
    console.error("Gif Forge: missing required DOM elements. Check index.html IDs.");
    return;
  }

  let frames = [];
  let selectedIndex = -1;
  let isPlaying = false;
  let playTimer = null;
  let playIndex = 0;
  let lastGifBlobUrl = null;
  let dragIndex = null;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const setStatus = (msg) => (statusText.textContent = msg);

  const getGlobalDelay = () => {
    return Math.max(10, parseInt(delayInput.value, 10) || 120);
  };

  const setProgress = (p01) => {
    const pct = Math.max(0, Math.min(1, p01));
    progressBar.style.width = `${Math.round(pct * 100)}%`;
  };

  const wantsTransparentBg = () => {
    return transparentInput ? !!transparentInput.checked : false;
  };

  const getSafeGifFilename = () => {
    const raw = (filenameInput?.value || "").trim() || "voltanlabs-gif";
    const cleaned = raw
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^\.+/, "")
      .slice(0, 80);

    const base = cleaned || "voltanlabs-gif";
    return base.toLowerCase().endsWith(".gif") ? base : `${base}.gif`;
  };

  const applyCheckerboard = (el) => {
    if (!el) return;
    el.style.backgroundImage =
      "linear-gradient(45deg, rgba(255,255,255,.10) 25%, transparent 25%)," +
      "linear-gradient(-45deg, rgba(255,255,255,.10) 25%, transparent 25%)," +
      "linear-gradient(45deg, transparent 75%, rgba(255,255,255,.10) 75%)," +
      "linear-gradient(-45deg, transparent 75%, rgba(255,255,255,.10) 75%)";
    el.style.backgroundSize = "16px 16px";
    el.style.backgroundPosition = "0 0, 0 8px, 8px -8px, -8px 0px";
  };

  const clearBackdrop = (el) => {
    if (!el) return;
    el.style.backgroundImage = "";
    el.style.backgroundSize = "";
    el.style.backgroundPosition = "";
  };

  const applyPreviewBackdrop = () => {
    if (wantsTransparentBg()) applyCheckerboard(previewCanvas);
    else clearBackdrop(previewCanvas);
  };

  const applyResultBackdrop = () => {
    if (!resultImg) return;

    if (wantsTransparentBg()) {
      applyCheckerboard(resultImg);
      resultImg.style.backgroundColor = "transparent";
    } else {
      clearBackdrop(resultImg);
      resultImg.style.backgroundColor = "#000";
    }
  };

  const clearResult = () => {
    resultArea.classList.add("hidden");
    resultImg.src = "";
    downloadLink.href = "#";
    setProgress(0);
    applyResultBackdrop();

    if (lastGifBlobUrl) {
      URL.revokeObjectURL(lastGifBlobUrl);
      lastGifBlobUrl = null;
    }
  };

  const enableControls = () => {
    const hasFrames = frames.length > 0;
    frameCountEl.textContent = String(frames.length);

    clearBtn.disabled = !hasFrames;
    exportBtn.disabled = !hasFrames;

    const hasSelection = selectedIndex >= 0 && selectedIndex < frames.length;
    moveUpBtn.disabled = !(hasSelection && selectedIndex > 0);
    moveDownBtn.disabled = !(hasSelection && selectedIndex < frames.length - 1);

    playBtn.disabled = frames.length < 2;
    stopBtn.disabled = !isPlaying;
  };

  const normalizeTargetSize = () => {
    const w = parseInt(widthInput.value, 10);
    const h = parseInt(heightInput.value, 10);

    if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0) {
      return { w, h };
    }

    if (frames.length > 0) return { w: frames[0].w, h: frames[0].h };

    return { w: 300, h: 300 };
  };

  const drawFrameToCanvas = (frame) => {
    if (!frame) return;

    const { w, h } = normalizeTargetSize();

    previewCanvas.width = w;
    previewCanvas.height = h;

    ctx.clearRect(0, 0, w, h);

    if (!wantsTransparentBg()) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    }

    const scale = Math.min(w / frame.w, h / frame.h);
    const dw = Math.round(frame.w * scale);
    const dh = Math.round(frame.h * scale);
    const dx = Math.round((w - dw) / 2);
    const dy = Math.round((h - dh) / 2);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(frame.img, dx, dy, dw, dh);
  };

  const stopPlayback = () => {
    isPlaying = false;
    if (playTimer) clearTimeout(playTimer);
    playTimer = null;
    stopBtn.disabled = true;
    playBtn.disabled = frames.length < 2;
    enableControls();
  };

  const playNextFrame = () => {
    if (!isPlaying || frames.length < 2) return;

    drawFrameToCanvas(frames[playIndex]);

    const frameDelay = Math.max(10, frames[playIndex].delay || getGlobalDelay());

    playIndex = (playIndex + 1) % frames.length;

    playTimer = setTimeout(playNextFrame, frameDelay);
  };

  const startPlayback = () => {
    if (frames.length < 2) return;

    isPlaying = true;
    playIndex = selectedIndex >= 0 ? selectedIndex : 0;

    playBtn.disabled = true;
    stopBtn.disabled = false;

    if (playTimer) clearTimeout(playTimer);

    playNextFrame();
    enableControls();
  };

  const removeFrameAt = (idx) => {
    if (idx < 0 || idx >= frames.length) return;

    if (isPlaying) stopPlayback();

    frames.splice(idx, 1);

    if (frames.length === 0) {
      selectedIndex = -1;
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      clearResult();
      setStatus("All frames removed.");
    } else {
      if (selectedIndex === idx) {
        selectedIndex = Math.min(idx, frames.length - 1);
      } else if (selectedIndex > idx) {
        selectedIndex -= 1;
      }

      drawFrameToCanvas(frames[selectedIndex]);
      clearResult();
      setStatus("Frame removed.");
    }

    renderFrameList();
    enableControls();
  };

  const duplicateFrameAt = (idx) => {
    if (idx < 0 || idx >= frames.length) return;

    if (isPlaying) stopPlayback();

    const source = frames[idx];

    const copy = {
      name: `${source.name} copy`,
      file: source.file,
      img: source.img,
      url: source.url,
      w: source.w,
      h: source.h,
      delay: source.delay || getGlobalDelay(),
    };

    frames.splice(idx + 1, 0, copy);
    selectedIndex = idx + 1;

    renderFrameList();
    drawFrameToCanvas(frames[selectedIndex]);
    clearResult();
    enableControls();
    setStatus("Frame copied.");
  };

  const moveFrame = (from, to) => {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= frames.length ||
      to >= frames.length
    ) {
      return;
    }

    const [moved] = frames.splice(from, 1);
    frames.splice(to, 0, moved);

    selectedIndex = to;
    dragIndex = to;

    renderFrameList();
    drawFrameToCanvas(frames[selectedIndex]);
    clearResult();
    enableControls();
  };

  const renderFrameList = () => {
    frameListEl.innerHTML = "";

    frames.forEach((f, idx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.dataset.index = String(idx);
      item.className =
        "w-full flex items-center gap-3 rounded-2xl border p-2 text-left transition " +
        (idx === selectedIndex
          ? "border-zinc-400 bg-zinc-950/60"
          : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900");

      const dragHandle = document.createElement("button");
      dragHandle.type = "button";
      dragHandle.className =
        "shrink-0 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-300 touch-none";
      dragHandle.textContent = "☰";
      dragHandle.title = "Drag to reorder";

      dragHandle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPlaying) stopPlayback();

        dragIndex = idx;
        dragHandle.setPointerCapture(e.pointerId);
        item.classList.add("opacity-60", "scale-[0.98]");
      });

      dragHandle.addEventListener("pointermove", (e) => {
        if (dragIndex === null) return;

        const target = document.elementFromPoint(e.clientX, e.clientY);
        const targetItem = target?.closest?.("[data-index]");

        if (!targetItem) return;

        const targetIndex = parseInt(targetItem.dataset.index, 10);

        if (Number.isFinite(targetIndex) && targetIndex !== dragIndex) {
          moveFrame(dragIndex, targetIndex);
        }
      });

      dragHandle.addEventListener("pointerup", (e) => {
        e.preventDefault();
        e.stopPropagation();

        dragIndex = null;
        renderFrameList();
        enableControls();
        setStatus("Frame order updated.");
      });

      dragHandle.addEventListener("pointercancel", () => {
        dragIndex = null;
        renderFrameList();
        enableControls();
      });

      const thumb = document.createElement("img");
      thumb.src = f.url;
      thumb.alt = f.name;
      thumb.className = "h-12 w-12 object-cover rounded-xl border border-zinc-800 bg-black";

      const meta = document.createElement("div");
      meta.className = "min-w-0 flex-1";

      const title = document.createElement("div");
      title.className = "text-sm text-zinc-200 truncate";
      title.textContent = `${idx + 1}. ${f.name}`;

      const sub = document.createElement("div");
      sub.className = "text-xs text-zinc-500";
      sub.textContent = `${f.w}×${f.h}`;

      const delayWrap = document.createElement("label");
      delayWrap.className = "mt-1 flex items-center gap-1 text-[11px] text-zinc-500";
      delayWrap.textContent = "Delay";

      const delayBox = document.createElement("input");
      delayBox.type = "number";
      delayBox.min = "10";
      delayBox.step = "10";
      delayBox.value = f.delay || getGlobalDelay();
      delayBox.className =
        "w-20 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs";

      delayBox.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      delayBox.addEventListener("input", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const val = Math.max(10, parseInt(delayBox.value, 10) || getGlobalDelay());
        frames[idx].delay = val;

        if (selectedIndex === idx && isPlaying) {
          stopPlayback();
          startPlayback();
        }

        clearResult();
      });

      const ms = document.createElement("span");
      ms.textContent = "ms";

      delayWrap.appendChild(delayBox);
      delayWrap.appendChild(ms);

      meta.appendChild(title);
      meta.appendChild(sub);
      meta.appendChild(delayWrap);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "shrink-0 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-300";
      copyBtn.textContent = "Copy";
      copyBtn.title = "Duplicate frame";
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        duplicateFrameAt(idx);
      });

      const del = document.createElement("button");
      del.type = "button";
      del.className =
        "shrink-0 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-300";
      del.textContent = "✕";
      del.title = "Remove frame";
      del.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeFrameAt(idx);
      });

      item.appendChild(dragHandle);
      item.appendChild(thumb);
      item.appendChild(meta);
      item.appendChild(copyBtn);
      item.appendChild(del);

      item.addEventListener("click", () => {
        selectedIndex = idx;
        drawFrameToCanvas(frames[selectedIndex]);
        renderFrameList();
        enableControls();
      });

      frameListEl.appendChild(item);
    });

    frameCountEl.textContent = String(frames.length);
  };

  const filterImageFiles = (fileList) => {
    return Array.from(fileList || []).filter((f) => {
      const typeOk = (f.type || "").startsWith("image/");
      const nameOk = /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(f.name || "");
      return typeOk || nameOk;
    });
  };

  const addFiles = async (fileList) => {
    const files = filterImageFiles(fileList);

    if (files.length === 0) {
      setStatus("No valid images found. Try PNG/JPG/WEBP.");
      return;
    }

    setStatus(`Loading ${files.length} image(s)…`);
    clearResult();

    for (const file of files) {
      const url = URL.createObjectURL(file);

      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";

      const ok = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

      if (!ok) {
        console.warn("Failed to load image:", file.name);
        URL.revokeObjectURL(url);
        continue;
      }

      frames.push({
        name: file.name,
        file,
        img,
        url,
        w: img.naturalWidth || img.width,
        h: img.naturalHeight || img.height,
        delay: getGlobalDelay(),
      });
    }

    if (filenameInput && !filenameInput.value && frames.length > 0) {
      filenameInput.value = (frames[0].name || "voltanlabs-gif").replace(/\.[^.]+$/, "");
    }

    if (frames.length > 0 && (selectedIndex < 0 || selectedIndex >= frames.length)) {
      selectedIndex = 0;
      drawFrameToCanvas(frames[0]);
    }

    renderFrameList();
    enableControls();
    setStatus("Ready.");
  };

  const moveSelected = (dir) => {
    const i = selectedIndex;
    if (i < 0) return;

    const j = i + dir;
    if (j < 0 || j >= frames.length) return;

    const tmp = frames[i];
    frames[i] = frames[j];
    frames[j] = tmp;

    selectedIndex = j;
    renderFrameList();
    drawFrameToCanvas(frames[selectedIndex]);
    enableControls();
    clearResult();
  };

  const forgeGif = async () => {
    if (frames.length < 2) {
      setStatus("Add at least 2 frames to make an animated GIF.");
      return;
    }

    stopPlayback();
    clearResult();

    const delay = getGlobalDelay();
    const quality = Math.max(1, Math.min(30, parseInt(qualityInput.value, 10) || 10));
    const loopForever = !!loopInput.checked;

    const { w, h } = normalizeTargetSize();

    let targetW = w;
    let targetH = h;

    if (isMobile) {
      const MAX = 512;
      const s = Math.min(1, MAX / Math.max(w, h));
      targetW = Math.max(1, Math.round(w * s));
      targetH = Math.max(1, Math.round(h * s));
    }

    exportBtn.disabled = true;
    setProgress(0);
    setStatus("Forging GIF…");

    const off = document.createElement("canvas");
    off.width = targetW;
    off.height = targetH;
    const offCtx = off.getContext("2d", { alpha: true });

    const transparent = wantsTransparentBg();

    const gif = new GIF({
      workers: isMobile ? 1 : Math.min(4, navigator.hardwareConcurrency || 2),
      quality,
      width: targetW,
      height: targetH,
      repeat: loopForever ? 0 : -1,
      workerScript: "./gif.worker.js",
      transparent: transparent ? 0x000000 : null,
      background: 0x000000,
    });

    let sawProgress = false;

    const watchdog = setTimeout(() => {
      if (!sawProgress) {
        setStatus("Stuck at 0% — worker didn't start. Ensure gif-forge/gif.worker.js exists.");
        exportBtn.disabled = false;
        enableControls();
      }
    }, 4000);

    for (let idx = 0; idx < frames.length; idx++) {
      const f = frames[idx];

      offCtx.clearRect(0, 0, targetW, targetH);

      if (!transparent) {
        offCtx.fillStyle = "#000";
        offCtx.fillRect(0, 0, targetW, targetH);
      }

      const s = Math.min(targetW / f.w, targetH / f.h);
      const dw = Math.round(f.w * s);
      const dh = Math.round(f.h * s);
      const dx = Math.round((targetW - dw) / 2);
      const dy = Math.round((targetH - dh) / 2);

      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = "high";
      offCtx.drawImage(f.img, dx, dy, dw, dh);

      gif.addFrame(offCtx, { copy: true, delay: f.delay || delay });
    }

    gif.on("progress", (p) => {
      sawProgress = true;
      setProgress(p);
      setStatus(`Rendering… ${Math.round(p * 100)}%`);
    });

    gif.on("finished", (blob) => {
      clearTimeout(watchdog);

      setProgress(1);
      setStatus("Done! GIF is ready.");

      if (lastGifBlobUrl) URL.revokeObjectURL(lastGifBlobUrl);
      lastGifBlobUrl = URL.createObjectURL(blob);

      applyResultBackdrop();

      resultImg.src = "";

      requestAnimationFrame(() => {
        resultImg.src = lastGifBlobUrl;
      });

      downloadLink.href = lastGifBlobUrl;
      downloadLink.download = getSafeGifFilename();

      resultArea.classList.remove("hidden");
      exportBtn.disabled = false;
      enableControls();
    });

    gif.on("abort", () => {
      clearTimeout(watchdog);
      setStatus("Render aborted.");
      exportBtn.disabled = false;
      enableControls();
    });

    try {
      gif.render();
    } catch (e) {
      clearTimeout(watchdog);
      console.error("GIF render error:", e);
      setStatus("Error: GIF render failed. Try fewer frames or smaller size.");
      exportBtn.disabled = false;
      enableControls();
    }
  };

  fileInput.addEventListener("change", async () => {
    await new Promise((r) => setTimeout(r, 60));

    if (!fileInput.files || fileInput.files.length === 0) {
      await new Promise((r) => setTimeout(r, 120));
    }

    await addFiles(fileInput.files);
    fileInput.value = "";
  });

  ["dragenter", "dragover"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("ring-2", "ring-emerald-400");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("ring-2", "ring-emerald-400");
    });
  });

  dropZone.addEventListener("drop", async (e) => {
    const dt = e.dataTransfer;
    if (!dt) return;
    await addFiles(dt.files);
  });

  clearBtn.addEventListener("click", () => {
    stopPlayback();

    [...new Set(frames.map((f) => f.url).filter(Boolean))].forEach((url) => {
      URL.revokeObjectURL(url);
    });

    frames = [];
    selectedIndex = -1;

    frameListEl.innerHTML = "";
    frameCountEl.textContent = "0";

    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    clearResult();
    enableControls();
    setStatus("Cleared.");
  });

  moveUpBtn.addEventListener("click", () => moveSelected(-1));
  moveDownBtn.addEventListener("click", () => moveSelected(1));

  playBtn.addEventListener("click", startPlayback);
  stopBtn.addEventListener("click", stopPlayback);

  [widthInput, heightInput].forEach((el) =>
    el.addEventListener("input", () => {
      if (selectedIndex >= 0) drawFrameToCanvas(frames[selectedIndex]);
      clearResult();
    })
  );

  delayInput.addEventListener("input", () => {
    clearResult();
  });

  qualityInput.addEventListener("input", clearResult);
  loopInput.addEventListener("change", clearResult);

  if (transparentInput) {
    transparentInput.addEventListener("change", () => {
      applyPreviewBackdrop();
      applyResultBackdrop();

      if (selectedIndex >= 0) drawFrameToCanvas(frames[selectedIndex]);

      clearResult();
    });
  }

  exportBtn.addEventListener("click", forgeGif);

  applyPreviewBackdrop();
  applyResultBackdrop();
  enableControls();
  setStatus("Idle.");
})();