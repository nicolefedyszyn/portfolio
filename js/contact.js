(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');

  function encode(data) {
    return Object.keys(data)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Build payload, includes required form-name
    const formData = new FormData(form);
    // Netlify requires form-name in the body as well
    if (!formData.has('form-name')) formData.append('form-name', form.getAttribute('name'));

    const body = encode(Object.fromEntries(formData.entries()));

    // UI: lock button
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
    if (statusBox) {
      statusBox.textContent = '';
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      if (!res.ok) throw new Error('Network response was not ok');

      // Success UI
      form.reset();
      if (statusBox) {
        statusBox.style.color = 'var(--ok, #1a7f37)';
        statusBox.textContent = 'Thanks! Your message was sent. ✅';
      }
    } catch (err) {
      if (statusBox) {
        statusBox.style.color = 'var(--err, #b42318)';
        statusBox.textContent = 'Sorry—something went wrong. Please try again. ❌';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Send Message';
      }
    }
  });
})();
