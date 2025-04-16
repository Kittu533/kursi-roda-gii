<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
    >
      <span>{{ label }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ 'transform rotate-180': isOpen }"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-10 w-40 mt-1 bg-white border rounded-md shadow-lg"
    >
      <div class="py-1">
        <button
          @click="exportToPDF"
          class="block w-full px-4 py-2 text-left hover:bg-gray-100"
        >
          PDF
        </button>
        <button
          @click="exportToExcel"
          class="block w-full px-4 py-2 text-left hover:bg-gray-100"
        >
          Excel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Define interfaces for type safety
interface Column {
  key: string;
  header: string;
  width?: number;
  formatter?: (value: any, row: any) => string;
  excelFormatter?: (value: any, row: any) => any;
}

interface DataItem {
  [key: string]: string | number | boolean | null | undefined;
}

type PageSizeType = "A4" | "Letter" | "Legal";
type OrientationType = "landscape" | "portrait";

// Props definition with TypeScript interfaces
interface Props {
  data: DataItem[];
  columns: Column[];
  title?: string;
  label?: string;
  filename?: string;
  pageSize?: PageSizeType;
  orientation?: OrientationType;
  headerColor?: string;
  alternateRowColor?: string;
  borderColor?: string;
  textColor?: string;
  headerTextColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Export Data",
  label: "Cetak",
  filename: "export",
  pageSize: "A4",
  orientation: "landscape",
  headerColor: "#f3f4f6",
  alternateRowColor: "#f9fafb",
  borderColor: "#d1d5db",
  textColor: "#111827",
  headerTextColor: "#111827",
});

const isOpen = ref(false);

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (!target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});

// Helper function to convert hex color to RGB for jsPDF
const hexToRgb = (hex: string): [number, number, number] => {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
};

// Function to format cell data
const formatCellData = (
  value: string | number | boolean | null | undefined,
  maxLength = 30
): string => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);
  if (stringValue.length > maxLength) {
    return stringValue.substring(0, maxLength - 3) + "...";
  }
  return stringValue;
};

// Enhanced PDF export function with error handling
const exportToPDF = async (): Promise<void> => {
  try {
    // Use a different approach with jsPDF instead of pdf-lib
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default;
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: props.orientation,
      unit: "mm",
      format: props.pageSize
    });
    
    // Add title
    doc.setFontSize(16);
    doc.text(props.title, 14, 15);
    
    // Add date
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Tanggal: ${currentDate}`, 14, 22);
    
    // Prepare table data
    const headers = props.columns.map(col => col.header);
    
    // Format rows data safely
    const rows = props.data.map(item =>
      props.columns.map(col => {
        // Make sure the key exists in the item
        const key = col.key as string;
        if (key in item) {
          return formatCellData(item[key]);
        }
        return "";
      })
    );
    
    // Generate table with proper type handling
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: hexToRgb(props.headerColor),
        textColor: hexToRgb(props.headerTextColor),
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: hexToRgb(props.alternateRowColor)
      },
      tableLineColor: hexToRgb(props.borderColor),
      tableLineWidth: 0.1,
      styles: {
        textColor: hexToRgb(props.textColor)
      }
    });
    
    // Save the PDF
    doc.save(`${props.filename}.pdf`);
    isOpen.value = false;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Failed to export to PDF. Please try again.");
  }
};

// Excel export with TypeScript
const exportToExcel = async (): Promise<void> => {
  try {
    const XLSX = await import("xlsx");

    // Prepare data for Excel export
    const excelData = props.data.map((item) => {
      const row: Record<string, unknown> = {};
      props.columns.forEach((col) => {
        // Make sure the key exists in the item
        const key = col.key as string;
        if (key in item) {
          row[col.header] = item[key];
        } else {
          row[col.header] = "";
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, `${props.filename}.xlsx`);
    isOpen.value = false;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Gagal mengekspor ke Excel. Silakan coba lagi.");
  }
};
</script>