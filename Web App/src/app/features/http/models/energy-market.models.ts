export interface ElectricityPrice {
  year: number;
  ipex: number;
  epex_germany: number;
  nord_pool: number;
  omel: number;
  epex_france: number;
}

export interface GreenCertificate {
  year: number;
  weighted_avg_price: number;
  cvs_traded: number;
  total_value_incl_vat: number;
}

export interface MarketComparison {
  market: string;
  price: number;
}

export interface CombinedData {
  year: number;
  ipex: number;
  epex_germany: number;
  nord_pool: number;
  omel: number;
  epex_france: number;
  cv_price: number | null;
  cvs_traded: number | null;
  total_value_incl_vat: number | null;
}
