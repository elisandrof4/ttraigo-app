// TTRAIGO FASE FINAL B — CONFIGURACIÓN DE PRODUCCIÓN
// NO subas claves secretas reales a GitHub. Solo claves públicas.

const TTRAIGO_PAYMENT_MODE = "sandbox";
const TTRAIGO_CURRENCY = "DOP";
const TTRAIGO_TAX_RATE = 0.18;
const TTRAIGO_FRAUD_LIMIT_AMOUNT = 25000;

const TTRAIGO_PAYMENT_PROVIDERS = {
  azul: {
    enabled: true,
    merchantId: "PON_AQUI_TU_MERCHANT_ID_AZUL",
    publicKey: "PON_AQUI_TU_PUBLIC_KEY_AZUL"
  },
  cardnet: {
    enabled: false,
    merchantId: "PON_AQUI_TU_MERCHANT_ID_CARDNET",
    publicKey: "PON_AQUI_TU_PUBLIC_KEY_CARDNET"
  }
};
