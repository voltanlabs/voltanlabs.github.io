# Data Discovery Runtime Ownership Guide

Status: authoritative  
Architecture phase: 4.7  
Updated: 2026-07-17

## Purpose

This document defines the active runtime owners for DataByteSprites: Data Discovery.

The core rule is simple:

> Every gameplay responsibility has exactly one canonical owner.

The application shell coordinates owners. It must not duplicate calculations, state mutation, faint handling, reward processing, or presentation behavior.

## Canonical Runtime Chain

The live product page loads the following responsibility layers: