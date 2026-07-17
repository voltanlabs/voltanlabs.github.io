# Data Discovery Runtime Load Order

Status: active reference  
Phase: 4.7 canonical resolution and throttled diagnostics  
Authoritative browser loader: `databyte-discovery.html`  
Manifest mirror: `studio/runtime/load-order.json`

## Purpose

This document defines the required browser script order for DataByteSprites: Data Discovery and explains why each dependency must be available before the next owner boots.

The browser page is the immediate execution authority. The Studio runtime manifest is the structured mirror used by tooling