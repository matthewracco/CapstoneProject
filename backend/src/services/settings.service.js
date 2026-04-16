const prisma = require("../config/prisma");

const DEFAULTS = { mode: "PUBLIC", maxDurationHours: null };

async function getSettings({ tenantId }) {
  const config = await prisma.tenantConfig.findUnique({
    where: { tenantId },
  });
  return config ?? { ...DEFAULTS, tenantId };
}

async function upsertSettings({ tenantId, mode, maxDurationHours }) {
  return prisma.tenantConfig.upsert({
    where: { tenantId },
    update: { mode, maxDurationHours },
    create: { tenantId, mode, maxDurationHours },
  });
}

module.exports = { getSettings, upsertSettings };
