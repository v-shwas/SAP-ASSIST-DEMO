/**
 * Seed script — populates Neon DB with Tirupathi Oils demo data.
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Tirupathi Oils demo data...");

  // Clear in reverse dependency order
  await prisma.returnOrder.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.plantSummary.deleteMany();
  await prisma.demandForecast.deleteMany();
  await prisma.gstRecord.deleteMany();
  await prisma.profitabilityRecord.deleteMany();
  await prisma.profitabilityByRegion.deleteMany();
  await prisma.profitabilityBySegment.deleteMany();
  await prisma.revenueRecord.deleteMany();
  await prisma.receivable.deleteMany();
  await prisma.regionRisk.deleteMany();
  await prisma.businessRisk.deleteMany();
  await prisma.cashFlowSummary.deleteMany();
  await prisma.costElement.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.salesOrg.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company.deleteMany();
  console.log("  ✓ Cleared existing data");

  // Company
  const company = await prisma.company.create({
    data: {
      id: "comp-tirupathi",
      name: "Tirupathi Oils",
      industry: "Edible Oil Manufacturing",
      description: "Leading edible oil manufacturer in India",
      updatedAt: new Date(),
    },
  });
  const cid = company.id;
  console.log("  ✓ Company");

  // Products
  await Promise.all([
    prisma.product.create({ data: { id: "prod-gn", companyId: cid, name: "Groundnut Oil",  sku: "OIL-GN", category: "Edible Oil", pricePerUnit: 145, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-sf", companyId: cid, name: "Sunflower Oil",  sku: "OIL-SF", category: "Edible Oil", pricePerUnit: 120, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-cs", companyId: cid, name: "Cottonseed Oil", sku: "OIL-CS", category: "Edible Oil", pricePerUnit:  98, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-rb", companyId: cid, name: "Rice Bran Oil",  sku: "OIL-RB", category: "Edible Oil", pricePerUnit: 110, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-mu", companyId: cid, name: "Mustard Oil",    sku: "OIL-MU", category: "Edible Oil", pricePerUnit:  85, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-sb", companyId: cid, name: "Soyabean Oil",   sku: "OIL-SB", category: "Edible Oil", pricePerUnit:  92, unit: "Cases" } }),
    prisma.product.create({ data: { id: "prod-cn", companyId: cid, name: "Corn Oil",       sku: "OIL-CN", category: "Edible Oil", pricePerUnit: 105, unit: "Cases" } }),
  ]);
  console.log("  ✓ Products");

  // Plants
  await Promise.all([
    prisma.plant.create({ data: { id: "plant-1001", companyId: cid, code: "P1001", name: "Guntur Refinery",    location: "Guntur, AP" } }),
    prisma.plant.create({ data: { id: "plant-1002", companyId: cid, code: "P1002", name: "Vizag Processing",   location: "Visakhapatnam, AP" } }),
    prisma.plant.create({ data: { id: "plant-1003", companyId: cid, code: "P1003", name: "Hyderabad Hub",      location: "Hyderabad, TS" } }),
    prisma.plant.create({ data: { id: "plant-1004", companyId: cid, code: "P1004", name: "Chennai Depot",      location: "Chennai, TN" } }),
  ]);
  console.log("  ✓ Plants");

  // Customers
  await Promise.all([
    prisma.customer.create({ data: { id: "cust-001", companyId: cid, name: "Reliance Retail",  segment: "Retail",    region: "West",  creditLimit: 50000000 } }),
    prisma.customer.create({ data: { id: "cust-002", companyId: cid, name: "DMart",            segment: "Retail",    region: "West",  creditLimit: 30000000 } }),
    prisma.customer.create({ data: { id: "cust-003", companyId: cid, name: "BigBasket",        segment: "Online",    region: "South", creditLimit: 20000000 } }),
    prisma.customer.create({ data: { id: "cust-004", companyId: cid, name: "More Supermarket", segment: "Retail",    region: "South", creditLimit: 15000000 } }),
    prisma.customer.create({ data: { id: "cust-005", companyId: cid, name: "Spencer's Retail", segment: "Retail",    region: "East",  creditLimit: 12000000 } }),
    prisma.customer.create({ data: { id: "cust-006", companyId: cid, name: "Star Bazaar",      segment: "Wholesale", region: "West",  creditLimit: 10000000 } }),
    prisma.customer.create({ data: { id: "cust-007", companyId: cid, name: "Future Retail",    segment: "Wholesale", region: "North", creditLimit:  8000000 } }),
  ]);
  console.log("  ✓ Customers");

  // Suppliers
  await Promise.all([
    prisma.supplier.create({ data: { id: "vend-001", companyId: cid, name: "Krishna Oilseeds",  category: "Groundnut/Sunflower", location: "Kurnool, AP",   onTimePct: 96.2, qualityScore: 4.7, activePOs: 8, gstin: "37AABCK1234A1Z5" } }),
    prisma.supplier.create({ data: { id: "vend-002", companyId: cid, name: "Rajasthan Cotton",  category: "Cottonseed",          location: "Jaipur, RJ",    onTimePct: 91.5, qualityScore: 4.3, activePOs: 5, gstin: "08AABCR5678B1Z2" } }),
    prisma.supplier.create({ data: { id: "vend-003", companyId: cid, name: "Punjab Agro Mills", category: "Rice Bran",           location: "Ludhiana, PB",  onTimePct: 88.7, qualityScore: 4.1, activePOs: 6, gstin: "03AABCP9012C1Z8" } }),
    prisma.supplier.create({ data: { id: "vend-004", companyId: cid, name: "MP Soya Corp",      category: "Soyabean",            location: "Indore, MP",    onTimePct: 94.1, qualityScore: 4.5, activePOs: 4, gstin: "23AABCM3456D1Z1" } }),
  ]);
  console.log("  ✓ Suppliers");

  // Sales Orgs
  await Promise.all([
    prisma.salesOrg.create({ data: { id: "so-1000", companyId: cid, code: "1000", name: "South India", forecastRevenue: 52000000, growthPct: 12.4, confidence: 89, keyDriver: "Groundnut Oil demand surge" } }),
    prisma.salesOrg.create({ data: { id: "so-2000", companyId: cid, code: "2000", name: "West India",  forecastRevenue: 38000000, growthPct:  7.8, confidence: 84, keyDriver: "DMart channel expansion" } }),
    prisma.salesOrg.create({ data: { id: "so-3000", companyId: cid, code: "3000", name: "North India", forecastRevenue: 22000000, growthPct:  5.2, confidence: 79, keyDriver: "Mustard Oil seasonal peak" } }),
    prisma.salesOrg.create({ data: { id: "so-4000", companyId: cid, code: "4000", name: "East India",  forecastRevenue: 16000000, growthPct:  3.1, confidence: 76, keyDriver: "Soyabean Oil B2B growth" } }),
  ]);
  console.log("  ✓ Sales Orgs");

  // Revenue Records
  await Promise.all([
    prisma.revenueRecord.create({ data: { id: "rev-m1",  companyId: cid, period: "Jan-2026",  revenue: 28500000, target: 27000000, yoyGrowth: 11.2, region: "All" } }),
    prisma.revenueRecord.create({ data: { id: "rev-m2",  companyId: cid, period: "Feb-2026",  revenue: 31200000, target: 30000000, yoyGrowth:  9.8, region: "All" } }),
    prisma.revenueRecord.create({ data: { id: "rev-m3",  companyId: cid, period: "Mar-2026",  revenue: 34800000, target: 33000000, yoyGrowth: 13.1, region: "All" } }),
    prisma.revenueRecord.create({ data: { id: "rev-q1",  companyId: cid, period: "2026-Q1",   revenue: 94500000, target: 90000000, yoyGrowth: 11.4, region: "All" } }),
    prisma.revenueRecord.create({ data: { id: "rev-q2f", companyId: cid, period: "2026-Q2",   revenue: 128000000, target: 120000000, yoyGrowth: 8.6, region: "All" } }),
  ]);
  console.log("  ✓ Revenue Records");

  // Profitability Records
  await Promise.all([
    prisma.profitabilityRecord.create({ data: { id: "prof-gn", companyId: cid, productId: "prod-gn", period: "2026-Q1", revenue: 22000000, cost: 12760000, marginPct: 42.0, orders: 320 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-sf", companyId: cid, productId: "prod-sf", period: "2026-Q1", revenue: 18500000, cost: 11470000, marginPct: 38.0, orders: 410 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-cs", companyId: cid, productId: "prod-cs", period: "2026-Q1", revenue: 15200000, cost: 10486000, marginPct: 31.0, orders: 280 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-rb", companyId: cid, productId: "prod-rb", period: "2026-Q1", revenue: 12800000, cost:  8576000, marginPct: 33.0, orders: 195 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-mu", companyId: cid, productId: "prod-mu", period: "2026-Q1", revenue:  9600000, cost:  7872000, marginPct: 18.0, orders: 150 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-sb", companyId: cid, productId: "prod-sb", period: "2026-Q1", revenue:  8400000, cost:  7224000, marginPct: 14.0, orders: 175 } }),
    prisma.profitabilityRecord.create({ data: { id: "prof-cn", companyId: cid, productId: "prod-cn", period: "2026-Q1", revenue:  5500000, cost:  5060000, marginPct:  8.0, orders:  90 } }),
  ]);
  console.log("  ✓ Profitability Records");

  // Profitability by Region
  await Promise.all([
    prisma.profitabilityByRegion.create({ data: { id: "profr-s", companyId: cid, region: "South", period: "2026-Q1", revenue: 38000000, marginPct: 32.4, orders: 512 } }),
    prisma.profitabilityByRegion.create({ data: { id: "profr-w", companyId: cid, region: "West",  period: "2026-Q1", revenue: 29500000, marginPct: 29.8, orders: 398 } }),
    prisma.profitabilityByRegion.create({ data: { id: "profr-n", companyId: cid, region: "North", period: "2026-Q1", revenue: 16200000, marginPct: 25.1, orders: 221 } }),
    prisma.profitabilityByRegion.create({ data: { id: "profr-e", companyId: cid, region: "East",  period: "2026-Q1", revenue: 10800000, marginPct: 22.6, orders: 289 } }),
  ]);
  console.log("  ✓ Profitability by Region");

  // Profitability by Segment
  await Promise.all([
    prisma.profitabilityBySegment.create({ data: { id: "profs-ret", companyId: cid, segment: "Retail",     period: "2026-Q1", revenue: 54000000, marginPct: 31.2, varianceVsPlan: "+2.1pp", contributionPct: 58 } }),
    prisma.profitabilityBySegment.create({ data: { id: "profs-wh",  companyId: cid, segment: "Wholesale",  period: "2026-Q1", revenue: 22000000, marginPct: 27.8, varianceVsPlan: "-0.5pp", contributionPct: 24 } }),
    prisma.profitabilityBySegment.create({ data: { id: "profs-b2b", companyId: cid, segment: "Direct B2B", period: "2026-Q1", revenue: 12500000, marginPct: 35.4, varianceVsPlan: "+4.2pp", contributionPct: 13 } }),
    prisma.profitabilityBySegment.create({ data: { id: "profs-on",  companyId: cid, segment: "Online",     period: "2026-Q1", revenue:  6000000, marginPct: 19.6, varianceVsPlan: "-1.8pp", contributionPct:  5 } }),
  ]);
  console.log("  ✓ Profitability by Segment");

  // Sales Orders
  await Promise.all([
    prisma.salesOrder.create({ data: { id: "ord-1",  companyId: cid, orderId: "SO-7180", customerId: "cust-001", productId: "prod-gn", value: 2450000, status: "billed",    orderDate: new Date("2026-02-10") } }),
    prisma.salesOrder.create({ data: { id: "ord-2",  companyId: cid, orderId: "SO-7181", customerId: "cust-002", productId: "prod-sf", value: 1820000, status: "delivered",  orderDate: new Date("2026-02-15") } }),
    prisma.salesOrder.create({ data: { id: "ord-3",  companyId: cid, orderId: "SO-7182", customerId: "cust-003", productId: "prod-cs", value: 3100000, status: "open",       orderDate: new Date("2026-03-01") } }),
    prisma.salesOrder.create({ data: { id: "ord-4",  companyId: cid, orderId: "SO-7183", customerId: "cust-004", productId: "prod-rb", value: 1560000, status: "open",       orderDate: new Date("2026-03-05") } }),
    prisma.salesOrder.create({ data: { id: "ord-5",  companyId: cid, orderId: "SO-7184", customerId: "cust-005", productId: "prod-mu", value:  980000, status: "delivered",  orderDate: new Date("2026-02-20") } }),
    prisma.salesOrder.create({ data: { id: "ord-6",  companyId: cid, orderId: "SO-7185", customerId: "cust-006", productId: "prod-sb", value:  720000, status: "open",       orderDate: new Date("2026-03-10"), delayReason: "Logistics strike — National Highways" } }),
    prisma.salesOrder.create({ data: { id: "ord-7",  companyId: cid, orderId: "SO-7186", customerId: "cust-007", productId: "prod-cn", value:  550000, status: "open",       orderDate: new Date("2026-03-12") } }),
    prisma.salesOrder.create({ data: { id: "ord-8",  companyId: cid, orderId: "SO-7187", customerId: "cust-001", productId: "prod-sf", value: 1900000, status: "billed",    orderDate: new Date("2026-01-25") } }),
    prisma.salesOrder.create({ data: { id: "ord-9",  companyId: cid, orderId: "SO-7188", customerId: "cust-002", productId: "prod-gn", value: 2200000, status: "open",       orderDate: new Date("2026-03-15") } }),
    prisma.salesOrder.create({ data: { id: "ord-10", companyId: cid, orderId: "SO-7189", customerId: "cust-003", productId: "prod-rb", value: 1400000, status: "delivered",  orderDate: new Date("2026-02-28") } }),
  ]);
  console.log("  ✓ Sales Orders");

  // Shipments
  await Promise.all([
    prisma.shipment.create({ data: { id: "ship-1", companyId: cid, deliveryId: "DEL-8001", orderId: "SO-7180", carrier: "VRL Logistics", productId: "prod-gn", status: "Delivered",          destination: "Mumbai",    eta: new Date("2026-02-18"), actual: new Date("2026-02-17"), delayDays: 0 } }),
    prisma.shipment.create({ data: { id: "ship-2", companyId: cid, deliveryId: "DEL-8002", orderId: "SO-7181", carrier: "GATI Courier",  productId: "prod-sf", status: "Delivered",          destination: "Pune",      eta: new Date("2026-02-22"), actual: new Date("2026-02-22"), delayDays: 0 } }),
    prisma.shipment.create({ data: { id: "ship-3", companyId: cid, deliveryId: "DEL-8003", orderId: "SO-7182", carrier: "BlueDart",      productId: "prod-cs", status: "In Transit",         destination: "Bangalore", eta: new Date("2026-03-08"), delayDays: 0 } }),
    prisma.shipment.create({ data: { id: "ship-4", companyId: cid, deliveryId: "DEL-8004", orderId: "SO-7184", carrier: "TCI Express",   productId: "prod-mu", status: "Delivered",          destination: "Kolkata",   eta: new Date("2026-02-28"), actual: new Date("2026-02-27"), delayDays: 0 } }),
    prisma.shipment.create({ data: { id: "ship-5", companyId: cid, deliveryId: "DEL-8005", orderId: "SO-7185", carrier: "Delhivery",     productId: "prod-sb", status: "Delayed — Strike",   destination: "Delhi",     eta: new Date("2026-03-16"), delayReason: "Logistics strike — National Highways", delayDays: 4 } }),
  ]);
  console.log("  ✓ Shipments");

  // Inventory
  await Promise.all([
    prisma.inventoryItem.create({ data: { id: "inv-gn-1001", companyId: cid, productId: "prod-gn", plantId: "plant-1001", stock: 2200, safetyStock: 1500, value:  7700000, alert: false } }),
    prisma.inventoryItem.create({ data: { id: "inv-sf-1001", companyId: cid, productId: "prod-sf", plantId: "plant-1001", stock:  980, safetyStock: 1200, value:  2940000, alert: true  } }),
    prisma.inventoryItem.create({ data: { id: "inv-cs-1002", companyId: cid, productId: "prod-cs", plantId: "plant-1002", stock:  350, safetyStock:  800, value:   875000, alert: true  } }),
    prisma.inventoryItem.create({ data: { id: "inv-rb-1002", companyId: cid, productId: "prod-rb", plantId: "plant-1002", stock: 1800, safetyStock: 1000, value:  5400000, alert: false } }),
    prisma.inventoryItem.create({ data: { id: "inv-mu-1003", companyId: cid, productId: "prod-mu", plantId: "plant-1003", stock:  420, safetyStock:  600, value:  1050000, alert: true  } }),
    prisma.inventoryItem.create({ data: { id: "inv-sb-1003", companyId: cid, productId: "prod-sb", plantId: "plant-1003", stock:   90, safetyStock:  400, value:   207000, alert: true  } }),
    prisma.inventoryItem.create({ data: { id: "inv-cn-1004", companyId: cid, productId: "prod-cn", plantId: "plant-1004", stock: 2400, safetyStock:  500, value:  4320000, alert: false } }),
  ]);
  console.log("  ✓ Inventory");

  // Plant Summaries
  await Promise.all([
    prisma.plantSummary.create({ data: { id: "ps-1001", companyId: cid, plantId: "plant-1001", stockValue: 15200000, deadStockPct:  3.2, overstockPct:  8.5, stockoutRisk: "Low"    } }),
    prisma.plantSummary.create({ data: { id: "ps-1002", companyId: cid, plantId: "plant-1002", stockValue:  9800000, deadStockPct:  5.1, overstockPct: 12.3, stockoutRisk: "Medium" } }),
    prisma.plantSummary.create({ data: { id: "ps-1003", companyId: cid, plantId: "plant-1003", stockValue:  7400000, deadStockPct:  2.8, overstockPct:  6.7, stockoutRisk: "High"   } }),
    prisma.plantSummary.create({ data: { id: "ps-1004", companyId: cid, plantId: "plant-1004", stockValue:  5600000, deadStockPct: 18.4, overstockPct: 22.1, stockoutRisk: "Low"    } }),
  ]);
  console.log("  ✓ Plant Summaries");

  // GST Records
  await Promise.all([
    prisma.gstRecord.create({ data: { id: "gst-001", companyId: cid, supplierId: "vend-001", period: "Mar-2026", invoiceValue: 8200000, claimedItc: 1476000, eligibleItc: 1476000, mismatch:     0, status: "Matched"  } }),
    prisma.gstRecord.create({ data: { id: "gst-002", companyId: cid, supplierId: "vend-002", period: "Mar-2026", invoiceValue: 4500000, claimedItc:  810000, eligibleItc:  724500, mismatch: 85500, status: "Mismatch" } }),
    prisma.gstRecord.create({ data: { id: "gst-003", companyId: cid, supplierId: "vend-003", period: "Mar-2026", invoiceValue: 3200000, claimedItc:  576000, eligibleItc:  576000, mismatch:     0, status: "Matched"  } }),
    prisma.gstRecord.create({ data: { id: "gst-004", companyId: cid, supplierId: "vend-004", period: "Mar-2026", invoiceValue: 2800000, claimedItc:  504000, eligibleItc:  448000, mismatch: 56000, status: "Mismatch" } }),
  ]);
  console.log("  ✓ GST Records");

  // Demand Forecasts
  await Promise.all([
    prisma.demandForecast.create({ data: { id: "df-gn", companyId: cid, productId: "prod-gn", forecastRevenue: 25300000, growthPct: 15.0, confidence: 91 } }),
    prisma.demandForecast.create({ data: { id: "df-sf", companyId: cid, productId: "prod-sf", forecastRevenue: 20900000, growthPct: 13.0, confidence: 89 } }),
    prisma.demandForecast.create({ data: { id: "df-cs", companyId: cid, productId: "prod-cs", forecastRevenue: 16800000, growthPct: 10.5, confidence: 86 } }),
    prisma.demandForecast.create({ data: { id: "df-rb", companyId: cid, productId: "prod-rb", forecastRevenue: 14200000, growthPct: 11.0, confidence: 84 } }),
    prisma.demandForecast.create({ data: { id: "df-mu", companyId: cid, productId: "prod-mu", forecastRevenue: 10400000, growthPct:  8.3, confidence: 81 } }),
    prisma.demandForecast.create({ data: { id: "df-sb", companyId: cid, productId: "prod-sb", forecastRevenue:  9100000, growthPct:  8.3, confidence: 79 } }),
    prisma.demandForecast.create({ data: { id: "df-cn", companyId: cid, productId: "prod-cn", forecastRevenue:  5500000, growthPct:  0.0, confidence: 76 } }),
  ]);
  console.log("  ✓ Demand Forecasts");

  // Receivables
  await Promise.all([
    prisma.receivable.create({ data: { id: "rec-001", companyId: cid, customerId: "cust-001", outstanding:  8500000, agingDays: 28, riskLevel: "Low"    } }),
    prisma.receivable.create({ data: { id: "rec-002", companyId: cid, customerId: "cust-002", outstanding: 21000000, agingDays: 75, riskLevel: "High"   } }),
    prisma.receivable.create({ data: { id: "rec-003", companyId: cid, customerId: "cust-003", outstanding: 14000000, agingDays: 62, riskLevel: "High"   } }),
    prisma.receivable.create({ data: { id: "rec-004", companyId: cid, customerId: "cust-004", outstanding:  9000000, agingDays: 48, riskLevel: "Medium" } }),
    prisma.receivable.create({ data: { id: "rec-005", companyId: cid, customerId: "cust-005", outstanding:  3200000, agingDays: 22, riskLevel: "Low"    } }),
    prisma.receivable.create({ data: { id: "rec-006", companyId: cid, customerId: "cust-006", outstanding:  6000000, agingDays: 30, riskLevel: "Low"    } }),
  ]);
  console.log("  ✓ Receivables");

  // Region Risks
  await Promise.all([
    prisma.regionRisk.create({ data: { id: "rr-s", companyId: cid, region: "South", overdueAmount: 18200000, avgDelayDays: 52, riskScore: "High",   keyRisk: "DMart and BigBasket receivables above credit limit" } }),
    prisma.regionRisk.create({ data: { id: "rr-w", companyId: cid, region: "West",  overdueAmount: 12400000, avgDelayDays: 38, riskScore: "Medium", keyRisk: "Seasonal credit extension during festival season" } }),
    prisma.regionRisk.create({ data: { id: "rr-n", companyId: cid, region: "North", overdueAmount:  6800000, avgDelayDays: 24, riskScore: "Low",    keyRisk: "Future Retail restructuring impact" } }),
    prisma.regionRisk.create({ data: { id: "rr-e", companyId: cid, region: "East",  overdueAmount:  4100000, avgDelayDays: 19, riskScore: "Low",    keyRisk: "Spencer's payment cycle improvement" } }),
  ]);
  console.log("  ✓ Region Risks");

  // Business Risks
  await Promise.all([
    prisma.businessRisk.create({ data: { id: "br-1", companyId: cid, category: "Receivables",  description: "DMart overdue ₹2.1 Cr — 75 days aging, breaches 60-day threshold", severity: "High",   amount: 21000000, region: "West"  } }),
    prisma.businessRisk.create({ data: { id: "br-2", companyId: cid, category: "Supply Chain", description: "Groundnut price surge +8% MoM — margin compression risk",          severity: "Medium", amount:        0              } }),
    prisma.businessRisk.create({ data: { id: "br-3", companyId: cid, category: "Inventory",    description: "Corn Oil dead stock ₹43.2 L at Chennai Depot",                     severity: "Low",    amount:  4320000              } }),
    prisma.businessRisk.create({ data: { id: "br-4", companyId: cid, category: "Logistics",    description: "Active freight strike affecting Delhivery lanes",                   severity: "Medium", amount:   720000              } }),
  ]);
  console.log("  ✓ Business Risks");

  // Cash Flow Summary
  await prisma.cashFlowSummary.create({ data: { id: "cf-1", companyId: cid, periodDays: 60, inflow: 25000000, outflow: 31000000, netGap: -6000000 } });
  console.log("  ✓ Cash Flow Summary");

  // Cost Elements
  await Promise.all([
    prisma.costElement.create({ data: { id: "ce-1", companyId: cid, period: "2026-Q1", element: "Raw Oilseeds",            actual: 51000000, planned: 47000000, variancePct: 8.0 } }),
    prisma.costElement.create({ data: { id: "ce-2", companyId: cid, period: "2026-Q1", element: "Refining & Processing",   actual: 19000000, planned: 19000000, variancePct: 1.7 } }),
    prisma.costElement.create({ data: { id: "ce-3", companyId: cid, period: "2026-Q1", element: "Packaging",               actual: 13000000, planned: 12000000, variancePct: 3.8 } }),
    prisma.costElement.create({ data: { id: "ce-4", companyId: cid, period: "2026-Q1", element: "Logistics & Cold Chain",  actual: 10000000, planned:  9000000, variancePct: 6.9 } }),
    prisma.costElement.create({ data: { id: "ce-5", companyId: cid, period: "2026-Q1", element: "Energy & Utilities",      actual:  7000000, planned:  7000000, variancePct: 4.5 } }),
  ]);
  console.log("  ✓ Cost Elements");

  // Return Orders
  await Promise.all([
    prisma.returnOrder.create({ data: { id: "rma-1", companyId: cid, rmaId: "RMA-301", orderId: "SO-7188", customerId: "cust-002", productId: "prod-sf", reason: "Quality — rancid smell",   value: 345000, status: "Credit issued"    } }),
    prisma.returnOrder.create({ data: { id: "rma-2", companyId: cid, rmaId: "RMA-302", orderId: "SO-7189", customerId: "cust-003", productId: "prod-gn", reason: "Packaging leak",            value: 282000, status: "Replacement sent"  } }),
    prisma.returnOrder.create({ data: { id: "rma-3", companyId: cid, rmaId: "RMA-303", orderId: "SO-7182", customerId: "cust-003", productId: "prod-mu", reason: "Wrong product shipped",     value: 196000, status: "Under review"      } }),
    prisma.returnOrder.create({ data: { id: "rma-4", companyId: cid, rmaId: "RMA-304", orderId: "SO-7183", customerId: "cust-004", productId: "prod-cs", reason: "Damaged in transit",        value: 145000, status: "Credit issued"    } }),
  ]);
  console.log("  ✓ Return Orders");

  console.log("\nSeeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
