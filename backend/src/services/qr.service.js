const QRCode = require("qrcode");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function generateQRCode(lockerId, tenantId) {
  const data = JSON.stringify({ lockerId, tenantId });
  return QRCode.toDataURL(data, { width: 300, margin: 2 });
}

async function generateQRForLocker(lockerId, tenantId) {
  const locker = await prisma.locker.findFirst({
    where: { id: lockerId, tenantId },
  });

  if (!locker) {
    throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");
  }

  const qrCode = await generateQRCode(lockerId, tenantId);

  await prisma.locker.updateMany({
    where: { id: lockerId, tenantId },
    data: { qrCode },
  });

  return qrCode;
}

module.exports = {
  generateQRCode,
  generateQRForLocker,
};
