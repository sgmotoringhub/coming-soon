/* SgMotoringHub — shared form handler.
   1) Create a free form at formspree.io (or similar), copy its endpoint URL.
   2) Paste it below. All forms (Sell, Finance, Insurance) will then email you.   */
const FORM_ENDPOINT = 'https://formspree.io/f/xgaknyrr';
const WHATSAPP = 'https://wa.me/6598806776';

function labelOf(el){
  const box = el.closest('.fld, .field');
  const lab = box && box.querySelector('label');
  return lab ? lab.textContent.replace(/\*/g,'').replace(/\(Optional\)/i,'').trim() : (el.name || el.id || 'Field');
}
function isRequired(el){
  const box = el.closest('.fld, .field');
  const lab = box && box.querySelector('label');
  return !!(lab && lab.querySelector('.req'));
}
function visible(el){ return el.offsetParent !== null; }

document.querySelectorAll('form[data-form]').forEach(form => {
  const btn = form.querySelector('button.submit-btn');
  const msg = document.createElement('div');
  msg.setAttribute('role','alert');
  msg.style.cssText = 'margin-top:12px;font-size:15px;line-height:1.5;color:#8E4556;font-weight:600;display:none;';
  btn.insertAdjacentElement('afterend', msg);
  const show = t => { msg.textContent = t; msg.style.display = t ? 'block' : 'none'; };

  form.addEventListener('submit', async e => {
    e.preventDefault(); show('');
    const data = {}; let email = '';
    const controls = form.querySelectorAll('input:not([type=checkbox]), select, textarea');
    for (const el of controls){
      if (!visible(el)) continue;
      const name = labelOf(el);
      const val = (el.value || '').trim();
      if (isRequired(el) && !val){ el.focus(); show('Please fill in: ' + name); return; }
      if (val){ data[name] = val; if (el.type === 'email') email = val; }
    }
    data['Consent given'] = 'Yes — ticked on ' + new Date().toISOString();
    data['Page'] = location.pathname.split('/').pop();
    data['_subject'] = '[SgMotoringHub] ' + form.dataset.form + ' — ' + (data['Name'] || data['Full Name'] || data['Company Name'] || 'new enquiry');
    if (email) data['email'] = email;

    btn.disabled = true; const old = btn.textContent; btn.textContent = 'Sending…';
    try {
      if (FORM_ENDPOINT.includes('REPLACE_WITH')) throw new Error('not-connected');
      const r = await fetch(FORM_ENDPOINT, {method:'POST', headers:{'Accept':'application/json','Content-Type':'application/json'}, body:JSON.stringify(data)});
      if (!r.ok) throw new Error('failed');
      form.innerHTML = '<div style="background:#F6ECEE;border-left:4px solid #AE576A;border-radius:8px;padding:20px;line-height:1.6;"><b>Thank you — we have received your details.</b><br>We will be in touch with you directly. You can also WhatsApp us on <a href="'+WHATSAPP+'" style="color:#AE576A;font-weight:700;">9880 6776</a>.</div>';
    } catch (err) {
      btn.disabled = false; btn.textContent = old;
      show('Sorry, we could not send this right now. Please WhatsApp or call us on 9880 6776 instead.');
    }
  });
});
