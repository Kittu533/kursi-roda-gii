<template>
  <!-- Your existing template remains the same -->
  <div class="relative">
    <div v-if="isClient">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
const isClient = ref(false);

onMounted(() => {
  isClient.value = true; // Mark client-side hydration complete
});
// Define interfaces for type safety
interface Column {
  key: string;
  header: string;
}

interface DataItem {
  [key: string]: string | number | boolean | null | undefined;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

type PageSizeType = "A4" | "Letter" | "Legal";
type OrientationType = "landscape" | "portrait";

// Props definition with TypeScript interfaces
interface Props {
  data: DataItem[];
  columns: Column[];
  title: string;
  label: string;
  filename: string;
  pageSize: PageSizeType;
  orientation: OrientationType;
  headerColor: string;
  alternateRowColor: string;
  borderColor: string;
  textColor: string;
  headerTextColor: string;
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

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): RGBColor => {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return { r, g, b };
};

// Function to calculate column widths based on content
const calculateColumnWidths = (
  headers: string[],
  rows: string[][],
  pageWidth: number,
  margin: number
): number[] => {
  const availableWidth = pageWidth - margin * 2;
  const charWidth = 5; // Estimated width per character
  const minWidth = 60; // Minimum column width
  const padding = 10; // Padding inside cells

  // Calculate content-based widths
  const contentWidths = headers.map((header, colIndex) => {
    const headerLength = header.length;
    const maxDataLength = Math.max(
      ...rows.map((row) => String(row[colIndex] || "").length)
    );
    return Math.max(headerLength, maxDataLength) * charWidth + padding;
  });

  // Calculate total content width
  const totalContentWidth = contentWidths.reduce(
    (sum, width) => sum + width,
    0
  );

  // If content fits within available width, use content-based widths
  if (totalContentWidth <= availableWidth) {
    return contentWidths;
  }

  // Otherwise, distribute available width proportionally
  return contentWidths.map((width) =>
    Math.max(minWidth, (width / totalContentWidth) * availableWidth)
  );
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

// Enhanced PDF export function
const exportToPDF = async (): Promise<void> => {
  try {
    // Define types for imported modules
    interface PDFLib {
      PDFDocument: {
        create(): Promise<PDFDocument>;
      };
      rgb: (r: number, g: number, b: number) => RGB;
      StandardFonts: {
        Helvetica: string;
        HelveticaBold: string;
        HelveticaOblique: string;
      };
    }

    interface RGB {
      [key: string]: unknown;
    }

    interface PDFFont {
      [key: string]: unknown;
    }

    interface PDFPage {
      getWidth(): number;
      getHeight(): number;
      drawText(
        text: string,
        options: {
          x: number;
          y: number;
          size: number;
          font: PDFFont;
          color: RGB;
          maxWidth?: number;
        }
      ): void;
      drawRectangle(options: {
        x: number;
        y: number;
        width: number;
        height: number;
        color?: RGB;
        borderColor?: RGB;
        borderWidth?: number;
      }): void;
      drawLine(options: {
        start: { x: number; y: number };
        end: { x: number; y: number };
        thickness: number;
        color: RGB;
      }): void;
    }

    interface PDFDocument {
      addPage(dimensions: number[]): PDFPage;
      embedFont(font: string): Promise<PDFFont>;
      save(): Promise<Uint8Array>;
    }

    interface FileSaver {
      saveAs(blob: Blob, filename: string): void;
    }

    const { PDFDocument, rgb, StandardFonts } = (await import(
      "pdf-lib"
    )) as PDFLib;
    const { saveAs } = (await import("file-saver")) as FileSaver;

    // Create a new PDF document with proper orientation
    const pdfDoc = await PDFDocument.create();

    // Set page dimensions based on orientation and page size
    let pageWidth: number, pageHeight: number;
    if (props.pageSize === "A4") {
      pageWidth = props.orientation === "landscape" ? 841.89 : 595.28;
      pageHeight = props.orientation === "landscape" ? 595.28 : 841.89;
    } else if (props.pageSize === "Letter") {
      pageWidth = props.orientation === "landscape" ? 792 : 612;
      pageHeight = props.orientation === "landscape" ? 612 : 792;
    } else {
      // Default to A4 landscape
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Set up fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Convert colors from hex to RGB
    const headerColorRgb = hexToRgb(props.headerColor);
    const alternateRowColorRgb = hexToRgb(props.alternateRowColor);
    const borderColorRgb = hexToRgb(props.borderColor);
    const textColorRgb = hexToRgb(props.textColor);
    const headerTextColorRgb = hexToRgb(props.headerTextColor);

    // Page margins and layout settings
    const margin = 40;
    const titleFontSize = 16;
    const headerFontSize = 10;
    const dataFontSize = 9;
    const rowHeight = 25;
    const cellPadding = 5;

    // Add title and date
    page.drawText(props.title, {
      x: margin,
      y: pageHeight - margin,
      size: titleFontSize,
      font: fontBold,
      color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
    });

    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    page.drawText(`Tanggal: ${currentDate}`, {
      x: margin,
      y: pageHeight - margin - titleFontSize - 10,
      size: dataFontSize,
      font: fontItalic,
      color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
    });

    // Prepare table data
    const headers = props.columns.map((col) => col.header);
    const rows = props.data.map((item) =>
      props.columns.map((col) => formatCellData(item[col.key]))
    );

    // Calculate column widths based on content
    const colWidths = calculateColumnWidths(headers, rows, pageWidth, margin);

    // Table starting position
    const tableTop = pageHeight - margin - titleFontSize - 40;
    const tableLeft = margin;

    // Draw table headers with background
    let currentX = tableLeft;
    let currentY = tableTop;

    // Draw header background
    page.drawRectangle({
      x: tableLeft,
      y: currentY - rowHeight,
      width: colWidths.reduce((a, b) => a + b, 0),
      height: rowHeight,
      color: rgb(headerColorRgb.r, headerColorRgb.g, headerColorRgb.b),
      borderColor: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
      borderWidth: 1,
    });

    // Draw header text
    headers.forEach((header, colIndex) => {
      const colWidth = colWidths[colIndex];

      page.drawText(header, {
        x: currentX + cellPadding,
        y: currentY - rowHeight / 2 + headerFontSize / 2 - 2, // Center vertically
        size: headerFontSize,
        font: fontBold,
        color: rgb(
          headerTextColorRgb.r,
          headerTextColorRgb.g,
          headerTextColorRgb.b
        ),
      });

      // Draw vertical line after each column (except the last one)
      if (colIndex < headers.length - 1) {
        page.drawLine({
          start: { x: currentX + colWidth, y: currentY },
          end: { x: currentX + colWidth, y: currentY - rowHeight },
          thickness: 1,
          color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
        });
      }

      currentX += colWidth;
    });

    currentY -= rowHeight;

    // Draw table rows
    rows.forEach((row, rowIndex) => {
      // Draw row background for alternate rows
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: tableLeft,
          y: currentY - rowHeight,
          width: colWidths.reduce((a, b) => a + b, 0),
          height: rowHeight,
          color: rgb(
            alternateRowColorRgb.r,
            alternateRowColorRgb.g,
            alternateRowColorRgb.b
          ),
          borderColor: rgb(
            borderColorRgb.r,
            borderColorRgb.g,
            borderColorRgb.b
          ),
          borderWidth: 0,
        });
      }

      // Draw horizontal line above row
      page.drawLine({
        start: { x: tableLeft, y: currentY },
        end: {
          x: tableLeft + colWidths.reduce((a, b) => a + b, 0),
          y: currentY,
        },
        thickness: 1,
        color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
      });

      // Draw cell content
      currentX = tableLeft;
      row.forEach((cell, colIndex) => {
        const colWidth = colWidths[colIndex];

        page.drawText(cell, {
          x: currentX + cellPadding,
          y: currentY - rowHeight / 2 + dataFontSize / 2 - 2, // Center vertically
          size: dataFontSize,
          font: font,
          color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
        });

        // Draw vertical line after each column (except the last one)
        if (colIndex < row.length - 1) {
          page.drawLine({
            start: { x: currentX + colWidth, y: currentY },
            end: { x: currentX + colWidth, y: currentY - rowHeight },
            thickness: 1,
            color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
          });
        }

        currentX += colWidth;
      });

      currentY -= rowHeight;
    });

    // Draw bottom border of the table
    page.drawLine({
      start: { x: tableLeft, y: currentY },
      end: { x: tableLeft + colWidths.reduce((a, b) => a + b, 0), y: currentY },
      thickness: 1,
      color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
    });

    // Draw left and right borders of the table
    page.drawLine({
      start: { x: tableLeft, y: tableTop },
      end: { x: tableLeft, y: currentY },
      thickness: 1,
      color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
    });

    page.drawLine({
      start: {
        x: tableLeft + colWidths.reduce((a, b) => a + b, 0),
        y: tableTop,
      },
      end: { x: tableLeft + colWidths.reduce((a, b) => a + b, 0), y: currentY },
      thickness: 1,
      color: rgb(borderColorRgb.r, borderColorRgb.g, borderColorRgb.b),
    });

    // Add page number at the bottom
    page.drawText(`Halaman 1 dari 1`, {
      x: pageWidth - margin - 80,
      y: margin / 2,
      size: 8,
      font: font,
      color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${props.filename}.pdf`);
    isOpen.value = false;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Failed to export to PDF. Please try again.");
  }
};

// Excel export with TypeScript
const exportToExcel = async (): Promise<void> => {
  try {
    interface XLSX {
      utils: {
        json_to_sheet(data: Record<string, unknown>[]): unknown;
        book_new(): unknown;
        book_append_sheet(
          workbook: unknown,
          worksheet: unknown,
          name: string
        ): void;
      };
      writeFile(workbook: unknown, filename: string): void;
    }

    const XLSX = (await import("xlsx")) as XLSX;

    const excelData = props.data.map((item) => {
      const row: Record<string, unknown> = {};
      props.columns.forEach((col) => {
        row[col.header] = item[col.key];
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
