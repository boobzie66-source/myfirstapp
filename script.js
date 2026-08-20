const fields = document.querySelectorAll('[data-field]');
const storageKey = 'resumeStudioData';

const defaults = {
    name: 'Alex Morgan',
    title: 'Product Designer',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    website: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
};

function formatText(value, fallback) {
    return value.trim() || fallback;
}

function updatePreview() {
    const data = Object.fromEntries([...fields].map((field) => [field.dataset.field, field.value]));
    const name = formatText(data.name, defaults.name);
    const title = formatText(data.title, defaults.title);
    const summary = formatText(data.summary, 'A thoughtful professional who turns complex problems into clear, useful results. Add your summary to make this section yours.');
    const experience = formatText(data.experience, 'Your recent role and accomplishments will appear here.');
    const education = formatText(data.education, 'Your education will appear here.');
    const skills = formatText(data.skills, 'Your skills will appear here.');
    const contact = [data.email, data.phone, data.location, data.website].filter(Boolean).join('  ·  ');

    document.querySelector('[data-preview="name"]').textContent = name;
    document.querySelector('[data-preview="title"]').textContent = title;
    document.querySelector('[data-preview="contact"]').textContent = contact || 'email@example.com  ·  (555) 123-4567  ·  City, State';
    document.querySelector('[data-preview="summary"]').textContent = summary;
    document.querySelector('[data-preview="experience"]').textContent = experience;
    document.querySelector('[data-preview="education"]').textContent = education;
    document.querySelector('[data-preview="skills"]').textContent = skills;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadSavedData() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }
    fields.forEach((field) => { field.value = saved[field.dataset.field] || ''; });
}

fields.forEach((field) => field.addEventListener('input', updatePreview));
document.getElementById('printResume').addEventListener('click', () => window.print());
loadSavedData();
updatePreview();

