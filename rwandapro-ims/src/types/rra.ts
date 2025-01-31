export interface EBMInvoice {
    tin: string;
    invoiceNumber: string;
    issueDate: string;
    items: Array<{
      itemCode: string;
      description: string;
      quantity: number;
      unitPrice: number;
      taxType: "A" | "B" | "C";
      classCode: string;
    }>;
    totalAmount: number;
    taxAmount: number;
  }
  
  export interface EBMSubmissionResponse {
    success: boolean;
    receiptNumber?: string;
    submissionDate?: string;
    errors?: Array<{
      code: string;
      message: string;
      details?: string;
    }>;
  }
  
  export interface TaxReport {
    period: string;
    totalSales: number;
    taxableSales: number;
    vatAmount: number;
    withholdingTax: number;
    paymentDeadline: string;
  }
  