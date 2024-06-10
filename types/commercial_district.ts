export interface ILocation {
  lat: number;
  lng: number;
}

export interface IStore {
  storeName: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  administrativeDistrictCode: string;
  administrativeDistrictName: string;
  roadAddress: string;
  location: [number, number];
  distance: number;
}

// 상위 상권
export interface ITopCommercialDistrict {
  administrativeDistrictCode: number;
  administrativeDistrictName: string;
  cityName: string;
  count: number;
  largeCategory: string;
  provinceName: string;
  smallCategory: string;
  standardCategory: string;
}
