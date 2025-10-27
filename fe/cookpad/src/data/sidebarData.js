import {
  Notebook,
  Bookmark,
  CheckCircle,
  User,
  FileText,
  Clock,
} from 'lucide-react';

export const khoMonItems = [
  {
    path: '/recipes/all',
    label: 'Tất cả',
    icon: Notebook,
    time: '0 phút',
    count: 0, // Có thể fetch từ API/state
  },
  {
    path: '/recipes/saved',
    label: 'Đã lưu',
    icon: Bookmark,
    time: '0 phút',
    count: 0,
  },
  {
    path: '/recipes/cooked',
    label: 'Đã nấu',
    icon: CheckCircle,
    time: '0 phút',
    count: 0,
  },
  {
    path: '/recipes/mine',
    label: 'Món của tôi',
    icon: User,
    time: '0 phút',
    count: 0,
  },
  {
    path: '/recipes/published',
    label: 'Đã lên sóng',
    icon: FileText,
    time: '0 phút',
    count: 0,
  },
  {
    path: '/recipes/drafts',
    label: 'Món nháp',
    icon: Clock,
    time: '0 phút',
    count: 0,
  },
];
