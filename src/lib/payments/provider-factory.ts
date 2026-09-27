import { PaymentProvider } from "./types";
import { mpesaProvider } from "./providers/mpesa-provider";

export class PaymentProviderFactory {
  private providers = new Map<string, PaymentProvider>();

  constructor() {
    this.registerProvider("MPESA", mpesaProvider);
  }

  registerProvider(name: string, provider: PaymentProvider) {
    this.providers.set(name.toUpperCase(), provider);
  }

  getProvider(name: string = "MPESA"): PaymentProvider {
    const provider = this.providers.get(name.toUpperCase());
    if (!provider) {
      throw new Error(`Unsupported payment provider: ${name}`);
    }
    return provider;
  }
}

export const paymentProviderFactory = new PaymentProviderFactory();
