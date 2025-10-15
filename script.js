// Amelia’s Resort — Availability Calendar (FullCalendar + Google ICS)
// REQUIREMENT in index.html (inside <head>, in this order):
// <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/@fullcalendar/icalendar@6.1.15/index.global.min.js"></script>

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Calendar mount
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl || !window.FullCalendar) return;

  // Read site accent from CSS variables (fallback to aqua)
  const getAccent = () => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return v || '#22d3ee';
    } catch {
      return '#22d3ee';
    }
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'Asia/Manila',
    initialView: 'dayGridMonth',
    firstDay: 1,                 // Monday
    height: 'auto',
    headerToolbar: { left: 'prev,next', center: 'title', right: '' },

    // 🔗 Your public Google Calendar ICS feed (keep %40):
    eventSources: [
      {
        url: 'https://calendar.google.com/calendar/ical/bookings.amelias%40gmail.com/public/basic.ics',
        format: 'ics'
      }
    ],

    // Improve click/hover UX a bit
    eventMouseEnter: (info) => {
      info.el.style.filter = 'brightness(1.05)';
    },
    eventMouseLeave: (info) => {
      info.el.style.filter = '';
    },

    // 🎨 Style event tiles to match site theme
    eventDidMount: (info) => {
      const title = (info.event.title || '').toLowerCase();

      // Defaults: site accent
      let bg = getAccent();
      let border = bg;
      let fg = '#ffffff';

      // Red for Booked/Reserved
      if (title.includes('booked') || title.includes('reserved')) {
        bg = '#ef4444';
        border = '#ef4444';
      }
      // Gold for Busy (when calendar is public as free/busy only)
      else if (title === 'busy') {
        bg = '#facc15';
        border = '#facc15';
      }

      // Apply styles
      info.el.style.backgroundColor = bg;
      info.el.style.borderColor = border;
      info.el.style.color = fg;
      info.el.style.fontWeight = '600';
      info.el.setAttribute('title', info.event.title || 'Booked');

      // Make all-day pills a bit taller on month view
      if (info.view.type === 'dayGridMonth') {
        info.el.style.minHeight = '20px';
      }
    },

    // Label content (show "Booked" when Google exposes only "Busy")
    eventContent: (arg) => {
      const raw = (arg.event.title || '').toLowerCase();
      const label = raw === 'busy' ? 'Booked' : (arg.event.title || 'Booked');
      return { html: `<span>${label}</span>` };
    },

    // Fail silently if ICS blocks temporarily (rare)
    loading: (isLoading) => {
      // You could toggle a small spinner here if you want
      // console.log('calendar loading:', isLoading);
    }
  });

  calendar.render();

  // Toolbar helpers for your custom buttons
  const $ = (id) => document.getElementById(id);
  if ($('btn-today')) $('btn-today').onclick = () => calendar.today();
  if ($('btn-month')) $('btn-month').onclick = () => calendar.changeView('dayGridMonth');
  if ($('btn-week'))  $('btn-week').onclick  = () => calendar.changeView('timeGridWeek');
  if ($('btn-list'))  $('btn-list').onclick  = () => calendar.changeView('listMonth');
});


