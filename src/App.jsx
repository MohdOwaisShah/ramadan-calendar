import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { FaCloudMoon, FaMoon, FaMosque } from 'react-icons/fa6';
import { GiOldLantern } from 'react-icons/gi';

const ramadanData = [
  { day: 'Thursday', urduDay: 'جمعرات', ramadan: 1, date: '19 Feb', sehri: '5:41', iftar: '6:43' },
  { day: 'Friday', urduDay: 'جمعہ', ramadan: 2, date: '20 Feb', sehri: '5:40', iftar: '6:44' },
  { day: 'Saturday', urduDay: 'سنیچر', ramadan: 3, date: '21 Feb', sehri: '5:40', iftar: '6:44' },
  { day: 'Sunday', urduDay: 'اتوار', ramadan: 4, date: '22 Feb', sehri: '5:39', iftar: '6:44' },
  { day: 'Monday', urduDay: 'پیر', ramadan: 5, date: '23 Feb', sehri: '5:39', iftar: '6:45' },
  { day: 'Tuesday', urduDay: 'منگل', ramadan: 6, date: '24 Feb', sehri: '5:38', iftar: '6:45' },
  { day: 'Wednesday', urduDay: 'بدھ', ramadan: 7, date: '25 Feb', sehri: '5:37', iftar: '6:45' },
  { day: 'Thursday', urduDay: 'جمعرات', ramadan: 8, date: '26 Feb', sehri: '5:37', iftar: '6:46' },
  { day: 'Friday', urduDay: 'جمعہ', ramadan: 9, date: '27 Feb', sehri: '5:36', iftar: '6:46' },
  { day: 'Saturday', urduDay: 'سنیچر', ramadan: 10, date: '28 Feb', sehri: '5:36', iftar: '6:46' },
  { day: 'Sunday', urduDay: 'اتوار', ramadan: 11, date: '01 Mar', sehri: '5:35', iftar: '6:47' },
  { day: 'Monday', urduDay: 'پیر', ramadan: 12, date: '02 Mar', sehri: '5:34', iftar: '6:47' },
  { day: 'Tuesday', urduDay: 'منگل', ramadan: 13, date: '03 Mar', sehri: '5:33', iftar: '6:47' },
  { day: 'Wednesday', urduDay: 'بدھ', ramadan: 14, date: '04 Mar', sehri: '5:32', iftar: '6:48' },
  { day: 'Thursday', urduDay: 'جمعرات', ramadan: 15, date: '05 Mar', sehri: '5:32', iftar: '6:48' },
];

const ramadanDataPhase2 = [
  { day: 'Friday', urduDay: 'جمعہ', ramadan: 16, date: '06 Mar', sehri: '5:31', iftar: '6:48' },
  { day: 'Saturday', urduDay: 'سنیچر', ramadan: 17, date: '07 Mar', sehri: '5:30', iftar: '6:48' },
  { day: 'Sunday', urduDay: 'اتوار', ramadan: 18, date: '08 Mar', sehri: '5:29', iftar: '6:48' },
  { day: 'Monday', urduDay: 'پیر', ramadan: 19, date: '09 Mar', sehri: '5:29', iftar: '6:49' },
  { day: 'Tuesday', urduDay: 'منگل', ramadan: 20, date: '10 Mar', sehri: '5:28', iftar: '6:49' },
  { day: 'Wednesday', urduDay: 'بدھ', ramadan: 21, date: '11 Mar', sehri: '5:27', iftar: '6:49' },
  { day: 'Thursday', urduDay: 'جمعرات', ramadan: 22, date: '12 Mar', sehri: '5:26', iftar: '6:50' },
  { day: 'Friday', urduDay: 'جمعہ', ramadan: 23, date: '13 Mar', sehri: '5:25', iftar: '6:50' },
  { day: 'Saturday', urduDay: 'سنیچر', ramadan: 24, date: '14 Mar', sehri: '5:24', iftar: '6:50' },
  { day: 'Sunday', urduDay: 'اتوار', ramadan: 25, date: '15 Mar', sehri: '5:24', iftar: '6:50' },
  { day: 'Monday', urduDay: 'پیر', ramadan: 26, date: '16 Mar', sehri: '5:23', iftar: '6:51' },
  { day: 'Tuesday', urduDay: 'منگل', ramadan: 27, date: '17 Mar', sehri: '5:22', iftar: '6:51' },
  { day: 'Wednesday', urduDay: 'بدھ', ramadan: 28, date: '18 Mar', sehri: '5:21', iftar: '6:51' },
  { day: 'Thursday', urduDay: 'جمعرات', ramadan: 29, date: '19 Mar', sehri: '5:20', iftar: '6:51' },
  { day: 'Friday', urduDay: 'جمعہ', ramadan: 30, date: '20 Mar', sehri: '5:19', iftar: '6:52' },
];

const MONTH_MAP = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseDayMonth(dateStr, year) {
  const [dRaw, mRaw] = String(dateStr).trim().split(/\s+/);
  const dayNum = Number.parseInt(dRaw, 10);
  const monthIdx = MONTH_MAP[mRaw];
  if (!Number.isFinite(dayNum) || monthIdx == null) return null;
  return new Date(year, monthIdx, dayNum);
}

function isSameLocalDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseTimeHM(timeStr) {
  const [hRaw, mRaw] = String(timeStr).trim().split(':');
  const h = Number.parseInt(hRaw, 10);
  const m = Number.parseInt(mRaw, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return { h, m };
}

function formatCountdown(ms) {
  const safe = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(safe / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function App() {
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const today = useMemo(() => new Date(), []);
  const baseYear = now.getFullYear();
  const todayLabel = useMemo(() => today.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }), [today]);

  const allRamadanRows = useMemo(() => [...ramadanData, ...ramadanDataPhase2], []);

  const nextSehri = useMemo(() => {
    const candidates = [];
    for (const row of allRamadanRows) {
      const d = parseDayMonth(row.date, baseYear);
      const t = parseTimeHM(row.sehri);
      if (!d || !t) continue;
      const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.h, t.m, 0, 0);
      if (dt > now) candidates.push({ dt, row });
    }
    candidates.sort((a, b) => a.dt - b.dt);
    return candidates[0] || null;
  }, [allRamadanRows, baseYear, now]);

  const nextIftar = useMemo(() => {
    const candidates = [];
    for (const row of allRamadanRows) {
      const d = parseDayMonth(row.date, baseYear);
      const t = parseTimeHM(row.iftar);
      if (!d || !t) continue;
      const iftarHour = t.h < 12 ? t.h + 12 : t.h;
      const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), iftarHour, t.m, 0, 0);
      if (dt > now) candidates.push({ dt, row });
    }
    candidates.sort((a, b) => a.dt - b.dt);
    return candidates[0] || null;
  }, [allRamadanRows, baseYear, now]);

  const sehriCountdown = nextSehri ? formatCountdown(nextSehri.dt - now) : null;
  const iftarCountdown = nextIftar ? formatCountdown(nextIftar.dt - now) : null;

  const shopAd = {
    title: 'Laptop & Mobile Repair',
    name: 'Final Solution',
    address:
      'FinalSolution Shop No 04, Yusuf Suleman Chowk, 1st, KK Rd, near Friend Circle School, Rabodi, Thane West, Mumbai, Thane, Maharashtra 400601',
    mapsUrl: 'https://maps.app.goo.gl/SnMLRi8YcDnXK9eX7',
    whatsapp: '9136837381',
  };

  return (
    <div className="ramadan-app">
      <div className="background-ornament top-left"></div>
      <div className="background-ornament bottom-right"></div>

      <header className="main-header">
        <div className="corner-lantern corner-lantern-left" aria-hidden="true">
          <GiOldLantern className="corner-lantern-icon" size={52} />
        </div>
        <div className="corner-lantern corner-lantern-right" aria-hidden="true">
          <GiOldLantern className="corner-lantern-icon" size={52} />
        </div>

        <div className="topbar">
          <div className="brand">
            <div className="title-group">
              <h1 className="urdu-title urdu-font" lang="ur" dir="rtl">
                رمضان المبارک کیلنڈر
              </h1>
              <div className="subline">
                <h2 className="english-title">Ramadan Kareem Calendar</h2>
                <span className="dot">•</span>
                <p className="year-info">1446 Hijri • 2026 CE</p>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="today-pill" title="Today">
              Today: {todayLabel}
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>
              <span className="toggle-label">{isDark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="calendar-container">
        <section className="countdown-card" aria-label="Countdown">
          <div className="countdown-header">
            <div className="countdown-title urdu-font" lang="ur" dir="rtl">
              وقت باقی ہے
            </div>
            <div className="countdown-subtitle">Countdown to Sehri & Iftar</div>
          </div>

          <div className="countdown-grid">
            <div className="countdown-tile">
              <div className="countdown-tile-label">Sehri</div>
              <div className="countdown-tile-time">{nextSehri?.row?.sehri ?? '--:--'}</div>
              <div className="countdown-tile-value">{sehriCountdown ?? '--:--:--'}</div>
              <div className="countdown-tile-meta">
                {nextSehri?.row?.date ? `Next: ${nextSehri.row.date}` : 'Not available'}
              </div>
            </div>

            <div className="countdown-tile">
              <div className="countdown-tile-label">Iftar</div>
              <div className="countdown-tile-time">{nextIftar?.row?.iftar ?? '--:--'}</div>
              <div className="countdown-tile-value">{iftarCountdown ?? '--:--:--'}</div>
              <div className="countdown-tile-meta">
                {nextIftar?.row?.date ? `Next: ${nextIftar.row.date}` : 'Not available'}
              </div>
            </div>
          </div>
        </section>

        <div className="dua-section">
          <div className="dua-card">
            <h3 className="urdu-font" lang="ur" dir="rtl">
              روزہ رکھنے کی نیت
            </h3>
            <p className="arabic-dua">نَوَيْتُ اَنْ اَصُوْمَ غَدًا لِّلّٰہِ تَعَالٰی مِنْ فَرْضِ رَمَضَانَ</p>
            <p className="translation">I intend to keep the fast tomorrow for the sake of Allah from the duty of Ramadan.</p>
          </div>
          <div className="dua-card">
            <h3 className="urdu-font" lang="ur" dir="rtl">
              افطار کی دعا
            </h3>
            <p className="arabic-dua">اَللّٰہُمَّ اِنِّی لَکَ صُمْتُ وَبِکَ اٰمَنْتُ وَعَلَیْکَ تَوَکَّلْتُ وَعَلٰی رِزْقِکَ اَفْطَرْتُ</p>
            <p className="translation">O Allah! I fasted for You and I believe in You and I put my trust in You and with Your sustenance I break my fast.</p>
          </div>
        </div>

        <div className="content-layout">
          <div className="tables-wrapper">
            <div className="calendar-table-container">
              <div className="table-header-info">
                <FaCloudMoon /> First 15 Days
              </div>
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th className="urdu-font" lang="ur" dir="rtl">وقت افطار</th>
                    <th className="urdu-font" lang="ur" dir="rtl">وقت سحری</th>
                    <th>Feb/Mar</th>
                    <th className="urdu-font" lang="ur" dir="rtl">رمضان</th>
                    <th className="urdu-font" lang="ur" dir="rtl">ایام</th>
                  </tr>
                </thead>
                <tbody>
                  {ramadanData.map((row, idx) => {
                    const rowDate = parseDayMonth(row.date, baseYear);
                    const isToday = rowDate ? isSameLocalDay(rowDate, today) : false;
                    return (
                      <tr key={idx} className={`color-row-${(idx % 5) + 1} ${isToday ? 'is-today' : ''}`}>
                      <td className="time-cell iftar">{row.iftar}</td>
                      <td className="time-cell sehri">{row.sehri}</td>
                      <td className="date-cell">{row.date}</td>
                      <td className="ramadan-num">{row.ramadan}</td>
                      <td className="urdu-font day-cell" lang="ur" dir="rtl">{row.urduDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="calendar-table-container">
              <div className="table-header-info">
                <FaMoon /> Last 15 Days
              </div>
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th className="urdu-font" lang="ur" dir="rtl">وقت افطار</th>
                    <th className="urdu-font" lang="ur" dir="rtl">وقت سحری</th>
                    <th>Mar</th>
                    <th className="urdu-font" lang="ur" dir="rtl">رمضان</th>
                    <th className="urdu-font" lang="ur" dir="rtl">ایام</th>
                  </tr>
                </thead>
                <tbody>
                  {ramadanDataPhase2.map((row, idx) => {
                    const rowDate = parseDayMonth(row.date, baseYear);
                    const isToday = rowDate ? isSameLocalDay(rowDate, today) : false;
                    return (
                      <tr key={idx} className={`color-row-${((idx + 15) % 5) + 1} ${isToday ? 'is-today' : ''}`}>
                      <td className="time-cell iftar">{row.iftar}</td>
                      <td className="time-cell sehri">{row.sehri}</td>
                      <td className="date-cell">{row.date}</td>
                      <td className="ramadan-num">{row.ramadan}</td>
                      <td className="urdu-font day-cell" lang="ur" dir="rtl">{row.urduDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="ad-sidebar" aria-label="Advertisements">
            <div className="ad-card">
              <div className="ad-badge">Advertisement</div>
              <h3 className="ad-title">{shopAd.title}</h3>
              <p className="ad-line"><strong>{shopAd.name}</strong></p>
              <p className="ad-line">{shopAd.address}</p>
              <p className="ad-line">
                Location:{' '}
                <a className="ad-link" href={shopAd.mapsUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
              </p>
              <p className="ad-line">
                WhatsApp:{' '}
                <a className="ad-link" href={`https://wa.me/${shopAd.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer">
                  {shopAd.whatsapp}
                </a>
              </p>
            </div>

            <div className="ad-card">
              <div className="ad-badge">Advertisement</div>
              <h3 className="ad-title">Website Development</h3>
              <p className="ad-line">Need a modern website for your business?</p>
              <p className="ad-line">
                Visit:{' '}
                <a className="ad-link" href="https://shahcodex.in" target="_blank" rel="noreferrer">
                  shahcodex.in
                </a>
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="main-footer">
        <p>May this Ramadan bring peace and blessings to you and your family.</p>
        <div className="footer-icons">
          <FaMosque size={32} />
          <FaMoon size={32} />
          <FaCloudMoon size={32} />
        </div>
      </footer>
    </div>
  );
}

export default App;