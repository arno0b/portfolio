---
date: '0'
title: 'Spotify Taste Drift'
cover: './cover.png'
github: 'https://github.com/arno0b/spotify-taste-drift'
external: 'https://arno0b.github.io/spotify-taste-drift/'

tech:
  - Python
  - Spotify API
  - GitHub Actions
  - JavaScript
showInProjects: true
---

Spotify's top-artists and top-tracks endpoints only ever return today's answer. There is no history and no way to backfill, so the dataset does not exist until you start capturing it. This project snapshots mine every morning on a GitHub Actions cron and stores the raw responses immutably. The static dashboard reports rank movement, entries and exits, short-vs-long-term divergence, and rotation half-life.
