export interface Model {
    id: string;
    name: string;
    photo: string;
    stock: number;
    price: number;
    maxWeight: number;
    batteryCapacity: number;
    status: string; // aktif | nonaktif | tidak tersedia
    [key: string]: any;
  }
  
  export interface ModelFilter {
    name?: string;
    status?: string;
    page: number;
    itemsPerPage: number;
  }
  
  export interface ModelPagination {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
    data: Model[];
  }
  