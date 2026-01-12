export interface RoadAddressResult {
  results: RoadAddress;
}

export interface RoadAddress {
  common: RoadAddressCommon;
  juso: RoadAddressJuso[];
}

export interface RoadAddressCommon {
  totalCount: string;
  currentPage: number;
  countPerPage: number;
  errorCode: number;
  errorMessage: string;
};

export interface RoadAddressJuso {
  roadAddr: string;
  roadAddrPart1: string;
  roadAddrPart2: string;
  jibunAddr: string;
  engAddr: string;
  zipNo: string;
  admCd: string;
  rnMgtSn: string;
  bdMgtSn: string;
  detBdNmList: string;
  bdNm: string;
  bdKdcd: string;
  siNm: string;
  sggNm: string;
  emdNm: string;
  liNm: string;
  rn: string;
  udrtYn: string;
  buldMnnm: number;
  buldSlno: number;
  mtYn: string;
  lnbrMnnm: number;
  lnbrSlno: number;
  emdNo: string;
  hstryYn: string;
  relJibun: string;
  hemdNm: string;
}

