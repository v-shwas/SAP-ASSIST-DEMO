-- CreateTable
CREATE TABLE "sap_products" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Edible Oil',
    "revenue" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "marginPct" DOUBLE PRECISION NOT NULL,
    "orders" INTEGER NOT NULL,

    CONSTRAINT "sap_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_customers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "gstin" TEXT,
    "creditLimit" DOUBLE PRECISION NOT NULL,
    "outstanding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agingDays" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'Low',

    CONSTRAINT "sap_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "delayReason" TEXT,

    CONSTRAINT "sap_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_shipments" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "eta" TIMESTAMP(3) NOT NULL,
    "actual" TIMESTAMP(3),
    "delayReason" TEXT,

    CONSTRAINT "sap_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_inventory" (
    "id" TEXT NOT NULL,
    "materialCode" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "plant" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "stockValue" DOUBLE PRECISION NOT NULL,
    "safetyStock" INTEGER NOT NULL,
    "coverageDays" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'Cases',
    "aiSignal" TEXT NOT NULL,

    CONSTRAINT "sap_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_suppliers" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "onTimePct" DOUBLE PRECISION NOT NULL,
    "qualityScore" DOUBLE PRECISION NOT NULL,
    "activePos" INTEGER NOT NULL,

    CONSTRAINT "sap_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_revenue" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "yoyGrowth" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'monthly',

    CONSTRAINT "sap_revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_gst_records" (
    "id" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "booksAmount" DOUBLE PRECISION NOT NULL,
    "gstPortal" DOUBLE PRECISION NOT NULL,
    "diff" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "period" TEXT NOT NULL,

    CONSTRAINT "sap_gst_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_sales_orgs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "forecastRevenue" DOUBLE PRECISION NOT NULL,
    "growthPct" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "keyDriver" TEXT NOT NULL,

    CONSTRAINT "sap_sales_orgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_plants" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stockValue" DOUBLE PRECISION NOT NULL,
    "deadStockPct" DOUBLE PRECISION NOT NULL,
    "overstockPct" DOUBLE PRECISION NOT NULL,
    "stockoutRisk" TEXT NOT NULL,

    CONSTRAINT "sap_plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sap_risk_regions" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "overdueAmount" DOUBLE PRECISION NOT NULL,
    "avgDelayDays" INTEGER NOT NULL,
    "riskScore" TEXT NOT NULL,

    CONSTRAINT "sap_risk_regions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sap_products_code_key" ON "sap_products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sap_customers_code_key" ON "sap_customers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sap_orders_orderId_key" ON "sap_orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "sap_shipments_deliveryId_key" ON "sap_shipments"("deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "sap_shipments_orderId_key" ON "sap_shipments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "sap_inventory_materialCode_plant_key" ON "sap_inventory"("materialCode", "plant");

-- CreateIndex
CREATE UNIQUE INDEX "sap_suppliers_vendorId_key" ON "sap_suppliers"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "sap_revenue_period_type_key" ON "sap_revenue"("period", "type");

-- CreateIndex
CREATE UNIQUE INDEX "sap_sales_orgs_code_key" ON "sap_sales_orgs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sap_plants_code_key" ON "sap_plants"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sap_risk_regions_region_key" ON "sap_risk_regions"("region");

-- AddForeignKey
ALTER TABLE "sap_orders" ADD CONSTRAINT "sap_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "sap_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sap_shipments" ADD CONSTRAINT "sap_shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sap_orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sap_inventory" ADD CONSTRAINT "sap_inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "sap_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
