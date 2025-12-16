/* VoltanLabs Gif Forge - app.js
   Requires:
   - gif.js.optimized loaded in index.html
*/

(() => {
  // ---------- DOM ----------
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");

  const frameCountEl = document.getElementById("frameCount");
  const frameListEl = document.getElementById("frameList");

  const clearBtn = document.getElementById("clearBtn");
  const moveUpBtn = document.getElementById("moveUpBtn");
  const moveDownBtn = document.getElementById("moveDownBtn");

  const previewCanvas = document.getElementById("previewCanvas");
  const ctx = previewCanvas.getContext("2d");

  const playBtn = document.getElementById("playBtn");
  const stopBtn = document.getElementById("stopBtn");

  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const delayInput = document.getElementById("delayInput");
  const qualityInput = document.getElementById("qualityInput");
  const loopInput = document.getElementById("loopInput");

  const exportBtn = document.getElementById("exportBtn");
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");

  const resultArea = document.getElementById("resultArea");
  const resultImg = document.getElementById("resultImg");
  const downloadLink = document.getElementById("downloadLink");

  // ---------- STATE ----------
  /** @type {{name:string, file:File, img:HTMLImageElement, url:string, w:number, h:number}[]} */
  let frames = [];
  let selectedIndex = -1;

  let isPlaying = false;
  let playTimer = null;
  let playIndex = 0;

  let lastGifBlobUrl = null;

  // ---------- HELPERS ----------
  const setStatus = (msg) => (statusText.textContent = msg);

  const setProgress = (p01) => {
    const pct = Math.max(0, Math.min(1, p01));
    progressBar.style.width = `${Math.round(pct * 100)}%`;
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

    // Hide result area when frames change
  };

  const normalizeTargetSize = () => {
    // User overrides
    const w = parseInt(widthInput.value, 10);
    const h = parseInt(heightInput.value, 10);

    if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0) {
      return { w, h };
    }

    // Auto: use first frame size if available
    if (frames.length > 0) {
      return { w: frames[0].w, h: frames[0].h };
    }

    return { w: 300, h: 300 };
  };

  const drawFrameToCanvas = (frame) => {
    if (!frame) return;

    const { w, h } = normalizeTargetSize();

    // Resize canvas buffer to target
    previewCanvas.width = w;
    previewCanvas.height = h;

    // Draw with "contain" behavior (no cropping)
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

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
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
    stopBtn.disabled = true;
    playBtn.disabled = frames.length < 2;
    enableControls();
  };

  const startPlayback = () => {
    if (frames.length < 2) return;
    const delay = Math.max(10, parseInt(delayInput.value, 10) || 120);

    isPlaying = true;
    playIndex = 0;

    playBtn.disabled = true;
    stopBtn.disabled = false;

    drawFrameToCanvas(frames[playIndex]);

    if (playTimer) clearInterval(playTimer);
    playTimer = setInterval(() => {
      playIndex = (playIndex + 1) % frames.length;
      drawFrameToCanvas(frames[playIndex]);
    }, delay);

    enableControls();
  };

  const clearResult = () => {
    resultArea.classList.add("hidden");
    resultImg.src = "";
    downloadLink.href = "#";
    setProgress(0);

    if (lastGifBlobUrl) {
      URL.revokeObjectURL(lastGifBlobUrl);
      lastGifBlobUrl = null;
    }
  };

  const renderFrameList = () => {
    frameListEl.innerHTML = "";

    frames.forEach((f, idx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className =
        "w-full flex items-center gap-3 rounded-2xl border p-2 text-left transition " +
        (idx === selectedIndex
          ? "border-zinc-400 bg-zinc-950/60"
          : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900");

      // thumb
      const thumb = document.createElement("img");
      thumb.src = f.url;
      thumb.alt = f.name;
      thumb.className = "h-12 w-12 object-cover rounded-xl border border-zinc-800 bg-black";

      const meta = document.createElement("div");
      meta.className = "min-w-0";

      const title = document.createElement("div");
      title.className = "text-sm text-zinc-200 truncate";
      title.textContent = `${idx + 1}. ${f.name}`;

      const sub = document.createElement("div");
      sub.className = "text-xs text-zinc-500";
      sub.textContent = `${f.w}×${f.h}`;

      meta.appendChild(title);
      meta.appendChild(sub);

      item.appendChild(thumb);
      item.appendChild(meta);

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

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => {
  const typeOk = (f.type || "").startsWith("image/");
  const nameOk = /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(f.name || "");
  return typeOk || nameOk; // some pickers give blank MIME, so name check helps
});

    if (files.length === 0) {
      setStatus("No valid images found. Use PNG/JPG.");
      return;
    }

    setStatus(`Loading ${files.length} image(s)…`);
    clearResult();

    // Load sequentially to keep memory sane on mobile
    for (const file of files) {
      const url = URL.createObjectURL(file);

      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";

      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load: ${file.name}`));
        img.src = url;
      }).catch((err) => {
        console.warn(err);
        URL.revokeObjectURL(url);
        return;
      });

      frames.push({
        name: file.name,
        file,
        img,
        url,
        w: img.naturalWidth || img.width,
        h: img.naturalHeight || img.height,
      });
    }

    // Select first frame if none selected
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
    if (frames.length === 0) return;

    stopPlayback();
    clearResult();

    const delay = Math.max(10, parseInt(delayInput.value, 10) || 120);
    const quality = Math.max(1, Math.min(30, parseInt(qualityInput.value, 10) || 10));
    const loopForever = !!loopInput.checked;
    const { w, h } = normalizeTargetSize();

    exportBtn.disabled = true;
    setProgress(0);
    setStatus("Forging GIF…");

    // Create offscreen canvas for consistent sizing
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const offCtx = off.getContext("2d");

    // IMPORTANT: workerScript must be explicitly set when using CDN
    const gif = new GIF({
      workers: Math.min(4, navigator.hardwareConcurrency || 2),
      quality,
      width: w,
      height: h,
      repeat: loopForever ? 0 : -1,
      workerScript: "https://unpkg.com/gif.js.optimized/dist/gif.worker.js",
    });

    // Add frames
    for (let idx = 0; idx < frames.length; idx++) {
      const f = frames[idx];

      // Draw "contain" into offscreen buffer
      offCtx.clearRect(0, 0, w, h);
      offCtx.fillStyle = "#000";
      offCtx.fillRect(0, 0, w, h);

      const scale = Math.min(w / f.w, h / f.h);
      const dw = Math.round(f.w * scale);
      const dh = Math.round(f.h * scale);
      const dx = Math.round((w - dw) / 2);
      const dy = Math.round((h - dh) / 2);

      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = "high";
      offCtx.drawImage(f.img, dx, dy, dw, dh);

      // Add canvas frame
      gif.addFrame(offCtx, { copy: true, delay });

      // Small UI feedback for long sets
      if (frames.length >= 30 && idx % 10 === 0) {
        setStatus(`Queued ${idx + 1}/${frames.length} frames…`);
      }
    }

    gif.on("progress", (p) => {
      setProgress(p);
      setStatus(`Rendering… ${Math.round(p * 100)}%`);
    });

    gif.on("finished", (blob) => {
      setProgress(1);
      setStatus("Done! GIF is ready.");

      if (lastGifBlobUrl) URL.revokeObjectURL(lastGifBlobUrl);
      lastGifBlobUrl = URL.createObjectURL(blob);

      resultImg.src = lastGifBlobUrl;
      downloadLink.href = lastGifBlobUrl;

      resultArea.classList.remove("hidden");
      exportBtn.disabled = false;
      enableControls();
    });

    gif.on("abort", () => {
      setStatus("Render aborted.");
      exportBtn.disabled = false;
      enableControls();
    });

    try {
      gif.render();
    } catch (e) {
      console.error(e);
      setStatus("Error: GIF render failed. Try fewer frames or smaller size.");
      exportBtn.disabled = false;
      enableControls();
    }
  };

  // ---------- EVENTS ----------
  // Clicking dropZone opens file picker
  dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async (e) => {
    await addFiles(e.target.files);
    // reset input so same files can be re-added if needed
    fileInput.value = "";
  });

  // Drag & drop handling
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
    // cleanup object URLs
    frames.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
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

  // If settings change, redraw current preview
  [widthInput, heightInput].forEach((el) =>
    el.addEventListener("input", () => {
      if (selectedIndex >= 0) drawFrameToCanvas(frames[selectedIndex]);
      clearResult();
    })
  );

  delayInput.addEventListener("input", () => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
    clearResult();
  });

  qualityInput.addEventListener("input", clearResult);
  loopInput.addEventListener("change", clearResult);

  exportBtn.addEventListener("click", forgeGif);

  // Initial UI state
  enableControls();
  setStatus("Idle.");
})();
