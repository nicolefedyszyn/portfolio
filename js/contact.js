(function(){
  function encodeRFC3986URIComponent(str){
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c){
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  function byId(id){ return document.getElementById(id); }

  function onSubmit(e){
    e.preventDefault();
    var first = byId('firstName').value.trim();
    var last = byId('lastName').value.trim();
    var email = byId('email').value.trim();
    var subject = byId('subject').value.trim();
    var message = byId('message').value.trim();
    var honeypot = byId('company').value.trim();
    var status = byId('contact-status');

    // simple validation
    if (honeypot) { return; } // likely bot
    if (!first || !last || !email || !message){
      status.textContent = 'Please fill in first name, last name, email, and message.';
      status.style.color = 'var(--err, #ff9ba8)';
      return;
    }
    // rudimentary email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      status.textContent = 'Please enter a valid email address.';
      status.style.color = 'var(--err, #ff9ba8)';
      return;
    }

    var to = 'fedyszynn@gmail.com';
    var finalSubject = subject || ('Portfolio contact from ' + first + ' ' + last);
    var bodyLines = [
      'Name: ' + first + ' ' + last,
      'Email: ' + email,
      '',
      'Message:',
      message,
      '',
      '-- Sent from nicolefedyszyn.com portfolio contact form --'
    ];
    var body = bodyLines.join('\n');

    var href = 'mailto:' + to + '?subject=' + encodeRFC3986URIComponent(finalSubject) + '&body=' + encodeRFC3986URIComponent(body);

    // Try opening mail client
    try {
      window.location.href = href;
      status.textContent = 'Opening your email client to send the message…';
      status.style.color = 'var(--muted, #aab1c3)';
    } catch (err) {
      status.innerHTML = 'Couldn\'t open your email app. You can email me at <a href="mailto:' + to + '">' + to + '</a>.';
      status.style.color = 'var(--err, #ff9ba8)';
    }
  }

  function init(){
    var form = document.getElementById('contact-form');
    if (form){ form.addEventListener('submit', onSubmit); }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
