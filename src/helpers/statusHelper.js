export const getStatusByMonths = (
  date,
  warningMonth,
  dueSoonMonth,
  overdueMonth,
) => {
  if (!date) return "overdue";

  const install = new Date(date);
  const now = new Date();

  const addMonths = (base, months) => {
    const d = new Date(base);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const warningDate = addMonths(install, warningMonth);
  const dueSoonDate = addMonths(install, dueSoonMonth);
  const overdueDate = addMonths(install, overdueMonth);

  if (now >= overdueDate) return "overdue";
  if (now >= dueSoonDate) return "dueSoon";
  if (now >= warningDate) return "warning";

  return "ok";
};

export const getNextDateByMonths = (date, months) => {
  if (!date) return null;

  const d = new Date(date);
  d.setMonth(d.getMonth() + months);

  return d;
};
