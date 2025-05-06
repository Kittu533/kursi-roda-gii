// Define proper TypeScript interfaces for the data table
export interface TableHeader {
  key: string;
  label: string;
  format?: string;
  render?: (value: string) => {
    component: string;
    class: string;
    text: string;
  };
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export interface StatusConfig {
  [key: string]: string;
}

export interface ExportColumn {
  key: string;
  header: string;
}

// Define more specific types for table data
export type TableItemValue = string | number | boolean | null | undefined;
export interface TableItem {
  [key: string]: TableItemValue | Record<string, TableItemValue>;
}

// Status styling configuration
export const statusClass: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-green-100", text: "text-green-800" },
  failed: { bg: "bg-red-100", text: "text-red-800" },
  refunded: { bg: "bg-gray-100", text: "text-gray-800" },
  aktif: { bg: "bg-green-100", text: "text-green-800" },
  nonaktif: { bg: "bg-gray-100", text: "text-gray-800" },
  dibekukan: { bg: "bg-red-100", text: "text-red-800" },
  menunggu: { bg: "bg-orange-100", text: "text-orange-800" },
  perbaikan: { bg: "bg-red-100", text: "text-red-800" },
  tersedia: { bg: "bg-green-100", text: "text-green-800" },
  tersewa: { bg: "bg-gray-100", text: "text-gray-800" },
  expired: { bg: "bg-red-100", text: "text-red-800" },
  open: { bg: "bg-orange-300", text: "text-orange-800" },
  forwarded: { bg: "bg-gray-100", text: "text-gray-800" },
  resolved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
  tertunda: { bg: "bg-gray-100", text: "text-gray-800" },
  berhasil: { bg: "bg-green-100", text: "text-green-800" },
  gagal: { bg: "bg-red-100", text: "text-red-800" },
  batal: { bg: "bg-orange-300", text: "text-orange-800" },
  ditolak: { bg: "bg-red-100", text: "text-red-800" },
};
