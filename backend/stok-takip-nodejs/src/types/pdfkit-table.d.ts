declare module 'pdfkit-table' {
  import PDFDocument from 'pdfkit';
  
  interface TableOptions {
    width?: number;
    padding?: number;
    prepareHeader?: () => void;
    prepareRow?: (row: any, indexColumn: number, indexRow: number, rectRow: any, rectCell: any) => void;
  }

  class PDFDocumentWithTable extends PDFDocument {
    table(
      table: {
        title?: string;
        subtitle?: string;
        headers?: string[];
        rows: any[][];
      },
      options?: TableOptions
    ): this;
  }

  export = PDFDocumentWithTable;
} 