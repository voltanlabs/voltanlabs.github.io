// assets/studio-registry.js
// Central module registry for VoltanLabs Studio.
// Keep this file data-driven so new projects can be added without rewriting the Studio shell.

window.VOLTAN_STUDIO_MODULES = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "⚡",
    href: "/studio/",
    status: "active",
    category: "Core",
    description: "Central launchpad for VoltanLabs systems, projects, and development flow."
  },
  {
    id: "databytesprites",
    title: "DataByteSprites",
    icon: "📡",
    href: "/databyte-admin-briefing.html",
    status: "active",
    category: "Flagship Project",
    description: "Discovery, capture, codex, battle, and worldbuilding systems for the DataByteSprites universe."
  },
  {
    id: "creator-suite",
    title: "Creator Suite",
    icon: "🛠️",
    href: "/tools.html",
    status: "active",
    category: "Production Tools",
    description: "Browser-based creative tools for drawing, prompts, sprites, GIFs, and character assembly."
  },
  {
    id: "technology-vault",
    title: "Technology Vault",
    icon: "🏛️",
    href: "/technology-vault/",
    status: "active",
    category: "Knowledge Base",
    description: "Catalog of reusable technologies, local-first stacks, licenses, and implementation notes."
  },
  {
    id: "knowledge-engine",
    title: "Knowledge Engine",
    icon: "🧠",
    href: "#knowledge-engine",
    status: "planned",
    category: "Studio Intelligence",
    description: "Future searchable memory layer for projects, documentation, assets, decisions, and source code."
  },
  {
    id: "simulation-lab",
    title: "Simulation Lab",
    icon: "🧪",
    href: "#simulation-lab",
    status: "planned",
    category: "Experimentation",
    description: "Future sandbox for testing systems, game mechanics, AI workflows, and world simulations."
  },
  {
    id: "asset-library",
    title: "Asset Library",
    icon: "📦",
    href: "#asset-library",
    status: "planned",
    category: "Production Assets",
    description: "Future organized library for sprites, images, audio, documents, templates, and reusable project files."
  },
  {
    id: "future-projects",
    title: "Future Projects",
    icon: "🚀",
    href: "#future-projects",
    status: "planned",
    category: "Expansion",
    description: "Reserved space for commercial tools, games, AI utilities, and new VoltanLabs products."
  }
];
