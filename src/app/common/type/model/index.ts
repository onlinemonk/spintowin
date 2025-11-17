export interface IWarrantyData {
  // WarrantyDetails fields
  Br_SalesConsultant: string;
  Br_CustomerName: string;
  Br_Email: string;
  Br_VehicleBrand: string;
  Br_VehicleModel: string;
  Br_Car_Registration_No: string;
  Br_Present_Milege: string;
  Br_Date_of_Purchase: string;
  Br_Original_Invoice_No: string;
  Br_FR_Combination: string;
  Br_IPC1: string;
  Br_IPC2: string;
  // ClaimDetails fields
  Br_Invoice_No: string | null;
  Br_Repair_Outlet_Consultant: string | null;
  Br_Incident_Date: string | null;
  Br_Repairable: string | null;
  Br_Type_of_Damage: string | null;
  Br_No_of_Puntures: string | null;
  Br_Invoice_PDF: string | null;
  Br_No_of_Replacement: string | null;
}
