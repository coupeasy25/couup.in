"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import getCurrentUser from "./getCurrentUser";
import { isAdminAuthenticated } from "./admin/adminAuth";
import { revalidatePath } from "next/cache";

export async function getInvoices(limit?: number) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    
    let query = Invoice.find().sort({ invoiceNumber: -1 });
    if (limit) {
      query = query.limit(limit);
    }
    
    const invoices = await query.populate('reservationId', 'status _id').lean();
    
    return JSON.parse(JSON.stringify(invoices));
  } catch (error: any) {
    console.error("Error fetching all invoices:", error);
    return [];
  }
}

export async function getUserInvoices() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    await connectToDatabase();
    
    const invoices = await Invoice.find({ userId: currentUser._id }).sort({ invoiceNumber: -1 }).lean();
    
    return JSON.parse(JSON.stringify(invoices));
  } catch (error: any) {
    console.error("Error fetching user invoices:", error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    await connectToDatabase();
    const invoice = await Invoice.findById(id).lean();

    if (!invoice) return null;

    // Check if user is owner OR admin
    const isAdmin = await isAdminAuthenticated();
    const isOwner = invoice.userId && invoice.userId.toString() === currentUser._id;
    
    if (!isAdmin && !isOwner) {
      return null;
    }

    return JSON.parse(JSON.stringify(invoice));
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export async function createManualInvoice(data: any) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    
    const newInvoice = await Invoice.create({
      type: 'Offline',
      ...data
    });
    
    revalidatePath("/admin/invoices");
    
    return { success: true, invoice: JSON.parse(JSON.stringify(newInvoice)) };
  } catch (error: any) {
    console.error("Error creating manual invoice:", error);
    return { success: false, error: error.message };
  }
}
