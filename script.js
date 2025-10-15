// FullCalendar pulling events from a public Google Calendar ICS feed
document.addEventListener('DOMContentLoaded', async () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'Asia/Manila',
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next', center: 'title', right: '' },
    height: 'auto',
    firstDay: 1,
    eventSources: [
      {
        // your public Google Calendar iCal feed:
        url: 'https://calendar.google.com/calendar/ical/bookings.amelias%40gmail.com/public/basic.ics',
        format: 'ics'
      }
    ],
    // Color events that include "Booked" or "Reserved"
    eventDidMount: (info) => {
      const t = (info.event.title || '').toLowerCase();
      if (t.includes('booked') || t.includes('reserved')) {
        info.el.style.backgroundColor = '#ef4444';
        info.el.style.borderColor = '#ef4444';
        info.el.style.color = '#ffffff';
      }
      info.el.setAttribute('title', info.event.title || 'Booked');
    },
    eventContent: (arg) => ({ html: `<span>${arg.event.title || 'Booked'}</span>` })
  });

  calendar.render();

  // toolbar buttons
  const $ = (id) => document.getElementById(id);
  if ($('btn-today')) $('btn-today').onclick = () => calendar.today();
  if ($('btn-month')) $('btn-month').onclick = () => calendar.changeView('dayGridMonth');
  if ($('btn-week'))  $('btn-week').onclick  = () => calendar.changeView('timeGridWeek');
  if ($('btn-list'))  $('btn-list').onclick  = () => calendar.changeView('listMonth');
});

