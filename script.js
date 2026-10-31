const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safe = (u) => (/^https?:\/\//i.test(u) ? u : '#');

fetch('profile.json').then((r) => r.json()).then((p) => {
    document.title = `${p.name} | Portfolio`;
    $('name').textContent = p.name;
    $('tagline').textContent = p.tagline;
    $('bio').textContent = p.bio;
    $('skills').innerHTML = (p.skills || []).map((s) => `<li>${esc(s)}</li>`).join('');
    $('projects').innerHTML = (p.projects || []).map((x) =>
        `<div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>` +
        `<a href="${safe(x.link)}" target="_blank" rel="noopener">View project</a></div>`).join('');
    $('links').innerHTML = Object.entries(p.links || {}).map(([k, v]) =>
        `<a href="${safe(v)}" target="_blank" rel="noopener">${esc(k)}</a>`).join('');
    $('footer').textContent = `\u00A9 ${new Date().getFullYear()} ${p.name}`;
}).catch((err) => console.log('Could not load profile.json:', err));

const lightBtn = $('lightBtn');
const darkBtn = $('darkBtn');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    lightBtn.setAttribute('aria-pressed', theme === 'light');
    darkBtn.setAttribute('aria-pressed', theme === 'dark');
    try { 
        localStorage.setItem('theme', theme); 
    }catch (e) {}
}

lightBtn.addEventListener('click', () => setTheme('light'));
darkBtn.addEventListener('click', () => setTheme('dark'));

let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
setTheme(savedTheme);

const words = ['embedded systems', 'electronics', 'coding', 'building things'];
const typingElement = $('typing');
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function type() {
    const currentWord = words[wordIndex];
    letterIndex += deleting ? -1 : 1;
    typingElement.textContent = currentWord.substring(0, letterIndex);

    let speed = deleting ? 50 : 100;
    if (!deleting && letterIndex === currentWord.length) {
        deleting = true;
        speed = 1200;
    } else if (deleting && letterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }
    setTimeout(type, speed);
}
type();