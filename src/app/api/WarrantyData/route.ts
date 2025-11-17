import { NextResponse } from "next/server";
import pool from "../../common/core/db";

export async function GET() {
  try {
    const result = await pool.query(`
    SELECT 
      wd."Br_SalesConsultant",
      wd."Br_CustomerName",
      wd."Br_Email",
      wd."Br_VehicleBrand",
      wd."Br_VehicleModel",
      wd."Br_Car_Registration_No",
      wd."Br_Present_Milege",
      wd."Br_Date_of_Purchase",
      wd."Br_Original_Invoice_No",
      wd."Br_FR_Combination",
      wd."Br_IPC1",
      wd."Br_IPC2",
      cd."Br_Invoice_No",
      cd."Br_Repair_Outlet_Consultant",
      cd."Br_Incident_Date",
      cd."Br_Repairable",
      cd."Br_Type_of_Damage",
      cd."Br_No_of_Puntures",
      cd."Br_Invoice_PDF",
      cd."Br_No_of_Replacement"
      FROM 
          public."WarrantyDetails" AS wd
      LEFT JOIN 
          public."ClaimDetails" AS cd
      ON 
          wd."Br_Original_Invoice_No" = cd."Br_Invoice_No"
      WHERE 
          wd."Br_Original_Invoice_No" IS NOT NULL;
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        details: error,
      },
      { status: 500 }
    );
  }
}
