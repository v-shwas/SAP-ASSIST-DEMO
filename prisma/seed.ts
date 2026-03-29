/**
 * Seed script — populates Neon DB with Tirupathi Oils demo data.
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Tirupathi Oils demo data...");

  // Clear existing SAP data
  await prisma.sapShipment.deleteMany();
  await prisma.sapOrder.deleteMany();
  await prisma.sapInventory.deleteMany();
  await prisma.sapGstRecord.deleteMany();
  await prisma.sapRevenue.deleteMany();
  await prisma.sapProduct.deleteMany();
  await prisma.sapCustomer.deleteMany();
  await prisma.sapSupplier.deleteMany();
  await prisma.sapSalesOrg.deleteMany();
  await prisma.sapPlant.deleteMany();
  await prisma.sapRiskRegion.deleteMany();

  // ── Products ──
  const products = await Promise.all([
    prisma.sapProduct.create({ data: { code: "OIL-GN", name: "Groundnut Oil", revenue: 22000000, cost: 12760000, marginPct: 42.0, orders: 320 } }),
    prisma.sapProduct.create({ data: { code: "OIL-SF", name: "Sunflower Oil", revenue: 18500000, cost: 11470000, marginPct: 38.0, orders: 410 } }),
    prisma.sapProduct.create({ data: { code: "OIL-CS", name: "Cottonseed Oil", revenue: 15200000, cost: 10486000, marginPct: 31.0, orders: 280 } }),
    prisma.sapProduct.create({ data: { code: "OIL-RB", name: "Rice Bran Oil", revenue: 12800000, cost: 8576000, marginPct: 33.0, orders: 195 } }),
    prisma.sapProduct.create({ data: { code: "OIL-MU", name: "Mustard Oil", revenue: 9600000, cost: 7872000, marginPct: 18.0, orders: 150 } }),
    prisma.sapProduct.create({ data: { code: "OIL-SB", name: "Soyabean Oil", revenue: 8400000, cost: 7224000, marginPct: 14.0, orders: 175 } }),
    prisma.sapProduct.create({ data: { code: "OIL-CN", name: "Corn Oil", revenue: 5500000, cost: 5060000, marginPct: 8.0, orders: 90 } }),
  ]);
  console.log(`  ✓ ${products.length} products`);

  // ── Customers ──
  const customers = await Promise.all([
    prisma.sapCustomer.create({ data: { code: "CUST-001", name: "Reliance Retail", segment: "Retail", gstin: "37AABCT4521K1Z8", creditLimit: 50000000, outstanding: 8500000, agingDays: 28, riskLevel: "Low" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-002", name: "DMart", segment: "Retail", gstin: "27AAACM6254Q1ZP", creditLimit: 30000000, outstanding: 21000000, agingDays: 75, riskLevel: "High" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-003", name: "BigBasket", segment: "Online", gstin: "29AAACU9603R1ZP", creditLimit: 20000000, outstanding: 14000000, agingDays: 62, riskLevel: "High" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-004", name: "More Supermarket", segment: "Retail", gstin: "36AABCS5678D1Z4", creditLimit: 15000000, outstanding: 9000000, agingDays: 48, riskLevel: "Medium" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-005", name: "Spencer's Retail", segment: "Retail", gstin: "27AABCU9342P1ZO", creditLimit: 12000000, outstanding: 3200000, agingDays: 22, riskLevel: "Low" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-006", name: "Star Bazaar", segment: "Wholesale", gstin: "27AABCU9342P1ZO", creditLimit: 10000000, outstanding: 6000000, agingDays: 30, riskLevel: "Low" } }),
    prisma.sapCustomer.create({ data: { code: "CUST-007", name: "Amazon Pantry", segment: "Online", gstin: "29AAGCF5765H1ZH", creditLimit: 25000000, outstanding: 4800000, agingDays: 18, riskLevel: "Low" } }),
  ]);
  console.log(`  ✓ ${customers.length} customers`);

  // ── Sales Orders ──
  const orders = await Promise.all([
    prisma.sapOrder.create({ data: { orderId: "SO-7201", customerId: customers[0].id, product: "Sunflower Oil 1L x 20", value: 3450000, status: "delivered", date: new Date("2026-03-12") } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7202", customerId: customers[1].id, product: "Groundnut Oil 5L x 50", value: 2820000, status: "open", date: new Date("2026-03-14"), delayReason: "Shipment late from warehouse" } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7203", customerId: customers[2].id, product: "Rice Bran Oil 1L x 100", value: 1800000, status: "billed", date: new Date("2026-03-10") } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7204", customerId: customers[3].id, product: "Cottonseed Oil 15kg Tin", value: 1450000, status: "open", date: new Date("2026-03-15") } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7205", customerId: customers[4].id, product: "Mustard Oil 1L x 60", value: 980000, status: "delivered", date: new Date("2026-03-11") } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7206", customerId: customers[5].id, product: "Soyabean Oil 5L x 30", value: 1250000, status: "open", date: new Date("2026-03-16") } }),
    prisma.sapOrder.create({ data: { orderId: "SO-7207", customerId: customers[6].id, product: "Corn Oil 1L x 48", value: 720000, status: "delivered", date: new Date("2026-03-09") } }),
  ]);
  console.log(`  ✓ ${orders.length} orders`);

  // ── Shipments ──
  const shipments = await Promise.all([
    prisma.sapShipment.create({ data: { deliveryId: "DL-3401", orderId: "SO-7201", carrier: "BlueDart", status: "Delivered", product: "Sunflower Oil 1L", eta: new Date("2026-03-14"), actual: new Date("2026-03-13") } }),
    prisma.sapShipment.create({ data: { deliveryId: "DL-3402", orderId: "SO-7202", carrier: "DTDC", status: "Delayed — In Transit", product: "Groundnut Oil 5L", eta: new Date("2026-03-18"), delayReason: "Vehicle breakdown on NH44" } }),
    prisma.sapShipment.create({ data: { deliveryId: "DL-3403", orderId: "SO-7203", carrier: "Gati", status: "Out for Delivery", product: "Rice Bran Oil 1L", eta: new Date("2026-03-16") } }),
    prisma.sapShipment.create({ data: { deliveryId: "DL-3404", orderId: "SO-7205", carrier: "DHL", status: "Delivered", product: "Mustard Oil 1L", eta: new Date("2026-03-12"), actual: new Date("2026-03-12") } }),
    prisma.sapShipment.create({ data: { deliveryId: "DL-3405", orderId: "SO-7207", carrier: "Delhivery", status: "Delivered", product: "Corn Oil 1L", eta: new Date("2026-03-10"), actual: new Date("2026-03-09") } }),
  ]);
  console.log(`  ✓ ${shipments.length} shipments`);

  // ── Inventory ──
  const inventoryData = [
    { materialCode: "MAT-001", productId: products[2].id, plant: "P001 — Tirupati", stock: 450, stockValue: 2250000, safetyStock: 200, coverageDays: 210, aiSignal: "Dead Stock" },
    { materialCode: "MAT-002", productId: products[0].id, plant: "P001 — Tirupati", stock: 80, stockValue: 960000, safetyStock: 100, coverageDays: 45, aiSignal: "Healthy" },
    { materialCode: "MAT-003", productId: products[1].id, plant: "P002 — Vijayawada", stock: 15, stockValue: 75000, safetyStock: 120, coverageDays: 8, aiSignal: "Reorder Now" },
    { materialCode: "MAT-004", productId: products[3].id, plant: "P001 — Tirupati", stock: 320, stockValue: 1440000, safetyStock: 150, coverageDays: 180, aiSignal: "Overstock" },
    { materialCode: "MAT-005", productId: products[4].id, plant: "P003 — Hyderabad", stock: 60, stockValue: 420000, safetyStock: 80, coverageDays: 35, aiSignal: "Low Stock" },
    { materialCode: "MAT-006", productId: products[5].id, plant: "P002 — Vijayawada", stock: 200, stockValue: 1200000, safetyStock: 100, coverageDays: 90, aiSignal: "Healthy" },
    { materialCode: "MAT-007", productId: products[6].id, plant: "P003 — Hyderabad", stock: 25, stockValue: 175000, safetyStock: 50, coverageDays: 18, aiSignal: "Reorder Now" },
  ];
  const inv = await Promise.all(inventoryData.map((d) => prisma.sapInventory.create({ data: d })));
  console.log(`  ✓ ${inv.length} inventory records`);

  // ── Suppliers ──
  const suppliers = await Promise.all([
    prisma.sapSupplier.create({ data: { vendorId: "V-2001", name: "Andhra Pradesh Oilseeds Federation", category: "Groundnut Seeds", onTimePct: 94.8, qualityScore: 4.7, activePos: 12 } }),
    prisma.sapSupplier.create({ data: { vendorId: "V-2002", name: "Gujarat Cottonseed Traders", category: "Cotton Seeds", onTimePct: 91.2, qualityScore: 4.4, activePos: 8 } }),
    prisma.sapSupplier.create({ data: { vendorId: "V-2003", name: "Rajasthan Mustard Co-op", category: "Mustard Seeds", onTimePct: 88.5, qualityScore: 4.2, activePos: 6 } }),
    prisma.sapSupplier.create({ data: { vendorId: "V-2004", name: "MP Soya Processors", category: "Soyabean Seeds", onTimePct: 92.4, qualityScore: 4.5, activePos: 10 } }),
    prisma.sapSupplier.create({ data: { vendorId: "V-2005", name: "Karnataka Sunflower Growers", category: "Sunflower Seeds", onTimePct: 96.1, qualityScore: 4.8, activePos: 5 } }),
    prisma.sapSupplier.create({ data: { vendorId: "V-2006", name: "West Bengal Rice Bran Mills", category: "Rice Bran", onTimePct: 89.7, qualityScore: 4.3, activePos: 4 } }),
  ]);
  console.log(`  ✓ ${suppliers.length} suppliers`);

  // ── Revenue Trend ──
  const revenueData = [
    { period: "Oct 2025", revenue: 32000000, target: 30000000, yoyGrowth: 9.8, type: "monthly" },
    { period: "Nov 2025", revenue: 35600000, target: 33000000, yoyGrowth: 11.4, type: "monthly" },
    { period: "Dec 2025", revenue: 38200000, target: 36000000, yoyGrowth: 10.1, type: "monthly" },
    { period: "Jan 2026", revenue: 42000000, target: 40000000, yoyGrowth: 8.6, type: "monthly" },
    { period: "Feb 2026", revenue: 51000000, target: 48000000, yoyGrowth: 12.3, type: "monthly" },
    { period: "Mar 2026", revenue: 63000000, target: 58000000, yoyGrowth: 14.2, type: "monthly" },
    { period: "Q1 Actual", revenue: 42000000, target: 40000000, yoyGrowth: 8.6, type: "quarterly" },
    { period: "Q2 Actual", revenue: 51000000, target: 48000000, yoyGrowth: 12.3, type: "quarterly" },
    { period: "Q3 Actual", revenue: 63000000, target: 58000000, yoyGrowth: 14.2, type: "quarterly" },
    { period: "Q4 Forecast", revenue: 78000000, target: 72000000, yoyGrowth: 8.6, type: "quarterly" },
  ];
  const rev = await Promise.all(revenueData.map((d) => prisma.sapRevenue.create({ data: d })));
  console.log(`  ✓ ${rev.length} revenue records`);

  // ── GST Records ──
  const gstData = [
    { gstin: "37AABCT4521K1Z8", party: "Reliance Retail", booksAmount: 3450000, gstPortal: 3450000, diff: 0, status: "Matched", period: "Mar-2026" },
    { gstin: "27AAACM6254Q1ZP", party: "DMart", booksAmount: 2820000, gstPortal: 2800000, diff: 20000, status: "Mismatch", period: "Mar-2026" },
    { gstin: "29AAACU9603R1ZP", party: "BigBasket", booksAmount: 1800000, gstPortal: 1800000, diff: 0, status: "Matched", period: "Mar-2026" },
    { gstin: "36AABCS5678D1Z4", party: "Spencer's Retail", booksAmount: 980000, gstPortal: 965000, diff: 15000, status: "Mismatch", period: "Mar-2026" },
    { gstin: "27AABCU9342P1ZO", party: "Star Bazaar", booksAmount: 1250000, gstPortal: 1250000, diff: 0, status: "Matched", period: "Mar-2026" },
    { gstin: "29AAGCF5765H1ZH", party: "More Supermarket", booksAmount: 1450000, gstPortal: 1442000, diff: 8000, status: "Mismatch", period: "Mar-2026" },
  ];
  const gst = await Promise.all(gstData.map((d) => prisma.sapGstRecord.create({ data: d })));
  console.log(`  ✓ ${gst.length} GST records`);

  // ── Sales Orgs ──
  const salesOrgs = await Promise.all([
    prisma.sapSalesOrg.create({ data: { code: "1000", name: "NA", forecastRevenue: 52000000, growthPct: 10.2, confidence: 91, keyDriver: "Groundnut Oil demand" } }),
    prisma.sapSalesOrg.create({ data: { code: "2000", name: "EU", forecastRevenue: 38000000, growthPct: 6.4, confidence: 85, keyDriver: "Stable orders" } }),
    prisma.sapSalesOrg.create({ data: { code: "3000", name: "APAC", forecastRevenue: 28000000, growthPct: 9.1, confidence: 88, keyDriver: "New customers" } }),
    prisma.sapSalesOrg.create({ data: { code: "4000", name: "LATAM", forecastRevenue: 10000000, growthPct: 4.3, confidence: 80, keyDriver: "Seasonal" } }),
  ]);
  console.log(`  ✓ ${salesOrgs.length} sales orgs`);

  // ── Plants ──
  const plants = await Promise.all([
    prisma.sapPlant.create({ data: { code: "P001", name: "Tirupati", stockValue: 12000000, deadStockPct: 18, overstockPct: 12, stockoutRisk: "Low" } }),
    prisma.sapPlant.create({ data: { code: "P002", name: "Vijayawada", stockValue: 9000000, deadStockPct: 22, overstockPct: 18, stockoutRisk: "Medium" } }),
    prisma.sapPlant.create({ data: { code: "P003", name: "Hyderabad", stockValue: 7000000, deadStockPct: 28, overstockPct: 25, stockoutRisk: "High" } }),
  ]);
  console.log(`  ✓ ${plants.length} plants`);

  // ── Risk Regions ──
  const risks = await Promise.all([
    prisma.sapRiskRegion.create({ data: { region: "South", overdueAmount: 18000000, avgDelayDays: 52, riskScore: "High" } }),
    prisma.sapRiskRegion.create({ data: { region: "West", overdueAmount: 12000000, avgDelayDays: 48, riskScore: "Medium" } }),
    prisma.sapRiskRegion.create({ data: { region: "North", overdueAmount: 8000000, avgDelayDays: 39, riskScore: "Medium" } }),
    prisma.sapRiskRegion.create({ data: { region: "East", overdueAmount: 4000000, avgDelayDays: 30, riskScore: "Low" } }),
  ]);
  console.log(`  ✓ ${risks.length} risk regions`);

  console.log("\nDone! All Tirupathi Oils demo data seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
