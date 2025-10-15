// FullCalendar setup (read-only) pulling events from data/bookings.json
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  let events = [];
  try {
    const res = await fetch('data/bookings.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load bookings.json');
    const json = await res.json();
    events = (json.events || []).map(e => ({
      ...e,
      display: 'block',
      color: '#ef4444',
      textColor: '#ffffff'
    }));
  } catch (err) {
    console.error(err);
  }

  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'Asia/Manila',
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next', center: 'title', right: '' },
    height: 'auto',
    firstDay: 1,
    events,
    eventDidMount: (info) => { info.el.setAttribute('title', info.event.title || 'Booked'); },
    eventContent: () => ({ html: `<span style="font-weight:600;">Booked</span>` })
  });

  calendar.render();

  document.getElementById('btn-today').onclick = () => calendar.today();
  document.getElementById('btn-month').onclick = () => calendar.changeView('dayGridMonth');
  document.getElementById('btn-week').onclick  = () => calendar.changeView('timeGridWeek');
  document.getElementById('btn-list').onclick  = () => calendar.changeView('listMonth');
});
