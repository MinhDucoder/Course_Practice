import Handlebars from 'handlebars';

export default {
  increment: (v) => v + 1,
  decrement: (v) => v - 1,
  ifEquals: (a, b, opts) => a === b ? opts.fn(this) : opts.inverse(this),
  range: (from, to) => {
    const res = [];
    for (let i = from; i <= to; i++) res.push(i);
    return res;
  },
  eq: (a, b) => a === b,
  sum: (a, b) => a + b,
  sortable: (field, sort) => {
    const isCurrent = field === sort.column;
    const icons = {
      default: 'bi bi-filter',
      asc:     'bi bi-sort-alpha-down',
      desc:    'bi bi-sort-alpha-up'
    };
    const types = {
      default: 'asc',
      asc:     'desc',
      desc:    'asc'
    };

    const currentType = isCurrent ? sort.type : 'default';
    const nextType = types[currentType];
    const iconClass = icons[currentType];
    const href = `?_sort&column=${field}&type=${nextType}`;

    const output = `
      <a href="${href}" class="text-decoration-none ms-1">
        <i class="${iconClass}"></i>
      </a>
    `;
    return new Handlebars.SafeString(output);
  },
  formatDate: (date) =>
    new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
};
