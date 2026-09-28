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

Spotify's top-artists and top-tracks endpoints only ever return today's answer — there is no history and no way to backfill, so the dataset does not exist until you start capturing it. This project snapshots mine every morning on a GitHub Actions cron, stores the raw responses immutably, and rebuilds every derived layer from them, so a new metric can be replayed across all of history instead of only applying going forward. The static dashboard reports rank movement, entries and exits, short-versus-long-term divergence, and rotation half-life.
