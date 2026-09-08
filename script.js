document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const messages = document.getElementById('form-messages');

  function setMessage(text, isError = false) {
    messages.textContent = text;
    messages.style.color = isError ? 'crimson' : 'green';
  }

  function validateForm(data) {
    const errors = [];
    if (!data.name.trim()) errors.push('Name is required.');
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.push('A valid email is required.');
    if (!data.date) errors.push('Date is required.');
    if (!data.time) errors.push('Time is required.');
    const guests = Number(data.guests);
    if (!guests || guests < 1 || guests > 20) errors.push('Guests must be between 1 and 20.');

    // Date must be today or later
    if (data.date) {
      const selected = new Date(data.date + 'T' + (data.time || '00:00'));
      const now = new Date();
      // Normalize to date-time comparison
      if (selected < now) errors.push('Reservation date/time must be in the future.');
    }

    return errors;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const errors = validateForm(data);
    if (errors.length) {
      setMessage(errors.join(' '), true);
      return;
    }

    // Save booking to localStorage
    const booking = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      date: data.date,
      time: data.time,
      guests: Number(data.guests),
      requests: data.requests || ''
    };

    const existing = JSON.parse(localStorage.getItem('littlelemon_bookings') || '[]');
    existing.push(booking);
    localStorage.setItem('littlelemon_bookings', JSON.stringify(existing));

    setMessage('Reservation confirmed — check your email for details.');
    form.reset();
  });
});
