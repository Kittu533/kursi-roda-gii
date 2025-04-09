<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!data.length"
      class="text-center py-8 text-muted-foreground"
    >
      No data available
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            class="border-b hover:bg-muted/50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-sm"
            >
              <!-- Special handling for action column -->
              <template v-if="column.key === 'actions'">
                <div class="flex space-x-2">
                  <button
                    @click="emitAction('view', row)"
                    class="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <span class="sr-only">View</span>
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
                      class="lucide lucide-eye"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    @click="emitAction('edit', row)"
                    class="p-1 text-yellow-600 hover:text-yellow-800"
                  >
                    <span class="sr-only">Edit</span>
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
                      class="lucide lucide-pencil"
                    >
                      <path
                        d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                      />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    @click="emitAction('delete', row)"
                    class="p-1 text-red-600 hover:text-red-800"
                  >
                    <span class="sr-only">Delete</span>
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
                      class="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              </template>

              <!-- Render function for custom cell content (non-action columns) -->
              <template v-else-if="column.render">
                <component
                  :is="getRenderComponent(column.render(row[column.key], row))"
                  v-bind="getRenderProps(column.render(row[column.key], row))"
                >
                  {{ getRenderText(column.render(row[column.key], row)) }}
                </component>
              </template>

              <!-- Default cell rendering -->
              <template v-else>
                {{ row[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// Define types
interface TableColumn {
  key: string;
  label: string;
  render?: (value: unknown, row?: Record<string, unknown>) => RenderResult;
}

type RenderResult =
  | string
  | {
      component?: string;
      text?: string;
      slots?: Record<string, string>;
      class?: string;
      [key: string]: unknown;
    };

// Props with proper types
const props = defineProps<{
  data: Record<string, unknown>[];
  columns: TableColumn[];
  loading?: boolean;
}>();

// Emits with proper types
const emit = defineEmits<{
  (e: "action", action: { type: string; row: Record<string, unknown> }): void;
}>();

// Helper method to emit actions
const emitAction = (type: string, row: Record<string, unknown>): void => {
  emit("action", { type, row });
};

// Methods for rendering custom cells with proper types
const getRenderComponent = (renderResult: RenderResult): string => {
  if (typeof renderResult === "object" && renderResult !== null) {
    return renderResult.component || "span";
  }
  return "span";
};

const getRenderProps = (
  renderResult: RenderResult
): Record<string, unknown> => {
  if (
    typeof renderResult === "string" ||
    renderResult === null ||
    renderResult === undefined
  ) {
    return {};
  }

  const { component, text, slots, ...restProps } = renderResult;
  return restProps;
};

const getRenderText = (renderResult: RenderResult): string => {
  if (typeof renderResult === "string") {
    return renderResult;
  }
  if (renderResult === null || renderResult === undefined) {
    return "";
  }

  return renderResult.text || "";
};
</script>

