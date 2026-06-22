const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING_CHARGE = 149;

const calculateShippingCharge = (subtotal) => {
  const value = Number(subtotal);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_CHARGE;
};

export {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_CHARGE,
  calculateShippingCharge,
};
