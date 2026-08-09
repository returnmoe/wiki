const roots = [...document.querySelectorAll('[data-search-root]')];
const dialog = document.querySelector('#wiki-search-dialog');
let pagefindPromise;

const loadPagefind = () => {
  pagefindPromise ??= import('/pagefind/pagefind.js');
  return pagefindPromise;
};

const plainExcerpt = (value = '') => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = value;
  return wrapper.textContent || '';
};

const createResult = (data) => {
  const title = data.meta?.title || data.url;
  const link = document.createElement('a');
  link.className = 'search-result';
  link.href = data.url;
  link.setAttribute('aria-label', title);

  const heading = document.createElement('h2');
  heading.textContent = title;

  const metadata = document.createElement('p');
  metadata.className = 'search-result-meta';
  metadata.textContent = data.meta?.kindLabel || data.meta?.kind || '';

  const excerpt = document.createElement('p');
  excerpt.textContent = data.meta?.summary || plainExcerpt(data.excerpt);

  link.append(heading);
  if (metadata.textContent) link.append(metadata);
  link.append(excerpt);
  return link;
};

const bindSearch = (root) => {
  if (root.dataset.searchBound) return;
  root.dataset.searchBound = 'true';

  const input = root.querySelector('[data-search-input]');
  const kind = root.querySelector('[data-search-kind]');
  const category = root.querySelector('[data-search-category]');
  const results = root.querySelector('[data-search-results]');
  const status = root.querySelector('[data-search-status]');
  let request = 0;
  let timer;

  const resultLinks = () => [...(results?.querySelectorAll('a.search-result') || [])];

  const focusResult = (index) => {
    const links = resultLinks();
    if (!links.length) return;
    links[(index + links.length) % links.length].focus();
  };

  const run = async () => {
    const query = input?.value.trim() || '';
    const currentRequest = ++request;
    if (!query) {
      results?.replaceChildren();
      if (status) status.textContent = '';
      return;
    }

    if (status) status.textContent = '…';
    try {
      const pagefind = await loadPagefind();
      const filters = {};
      if (kind?.value) filters.kind = kind.value;
      if (category?.value) filters.category = category.value;
      const response = await pagefind.search(query, {
        filters: Object.keys(filters).length ? filters : undefined,
      });
      const loaded = await Promise.all(
        response.results.slice(0, 30).map((result) => result.data()),
      );
      if (currentRequest !== request) return;
      results?.replaceChildren(...loaded.map(createResult));
      if (status) {
        status.textContent = loaded.length
          ? `${loaded.length} ${
              loaded.length === 1
                ? root.dataset.resultSingular || 'result'
                : root.dataset.resultPlural || 'results'
            }`
          : root.dataset.emptyMessage || '';
      }
    } catch {
      results?.replaceChildren();
      if (status) status.textContent = root.dataset.unavailableMessage || '';
    }
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 120);
  };

  input?.addEventListener('input', schedule);
  input?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = resultLinks();
    if (!links.length) return;
    event.preventDefault();
    focusResult(event.key === 'ArrowDown' ? 0 : links.length - 1);
  });
  results?.addEventListener('keydown', (event) => {
    if (!(event.target instanceof Element)) return;
    const current = event.target.closest('a.search-result');
    if (!current) return;

    const links = resultLinks();
    const index = links.indexOf(current);
    if (index < 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusResult(index + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusResult(event.key === 'Home' ? 0 : links.length - 1);
    }
  });
  kind?.addEventListener('change', run);
  category?.addEventListener('change', run);
  root.addEventListener('submit', (event) => {
    if (root.matches('.search-interface-page')) {
      event.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.set('q', input?.value || '');
      window.history.replaceState({}, '', url);
      run();
    }
  });

  if (root.matches('.search-interface-page')) {
    const query = new URL(window.location.href).searchParams.get('q') || '';
    if (input) input.value = query;
    if (query) run();
  }
};

roots.forEach(bindSearch);

document.querySelectorAll('[data-open-search]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (!dialog?.showModal) return;
    event.preventDefault();
    dialog.showModal();
    window.setTimeout(() => dialog.querySelector('[data-search-input]')?.focus(), 0);
  });
});

document.querySelector('[data-close-search]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    if (!dialog?.showModal) return;
    event.preventDefault();
    dialog.showModal();
    window.setTimeout(() => dialog.querySelector('[data-search-input]')?.focus(), 0);
  }
});
