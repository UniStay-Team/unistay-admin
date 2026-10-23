export type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

interface Label {
  text: string;
  severity: TagSeverity;
}

const applicationStatus: Record<string, Label> = {
  pending: { text: 'Ожидает', severity: 'warn' },
  accepted: { text: 'Принята', severity: 'success' },
  rejected: { text: 'Отклонена', severity: 'danger' },
  cancelled: { text: 'Отменена', severity: 'secondary' },
};

const listingStatus: Record<string, Label> = {
  draft: { text: 'Черновик', severity: 'secondary' },
  published: { text: 'Опубликовано', severity: 'success' },
  archived: { text: 'В архиве', severity: 'contrast' },
};

const roles: Record<string, string> = {
  student: 'Студент',
  landlord: 'Владелец',
};

// Неизвестное значение показываем как есть, а не подменяем.
export function applicationStatusLabel(status: string): Label {
  return applicationStatus[status] ?? { text: status, severity: 'info' };
}

export function listingStatusLabel(status: string): Label {
  return listingStatus[status] ?? { text: status, severity: 'info' };
}

export function roleLabel(role: string): string {
  return roles[role] ?? role;
}
